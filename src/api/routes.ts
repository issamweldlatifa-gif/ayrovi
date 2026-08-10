import { Router, Request, Response } from 'express';
import multer from 'multer';
import { SmartLinkScraper } from '../scraper/scraper';
import { QatafoDatabase as AyroviDatabase } from '../db/database';
import { VisualProductExtractor } from '../services/vision';
import { AddToCartRequest } from '../types';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export function createApiRouter(
  db: AyroviDatabase,
  scraper: SmartLinkScraper,
  visionExtractor: VisualProductExtractor
): Router {
  const router = Router();

  function getSessionId(req: Request): string {
    return (req.headers['x-session-id'] as string) || (req.query.sessionId as string) || 'default-session';
  }

  /**
   * POST /api/extract-image
   * Visual AI Screenshot Extractor
   */
  router.post('/extract-image', upload.single('image'), async (req: Request, res: Response) => {
    try {
      let imageBuffer: Buffer | null = null;
      let filename: string = 'screenshot.jpg';

      if (req.file) {
        imageBuffer = req.file.buffer;
        filename = req.file.originalname;
      } else if (req.body.imageBase64) {
        const base64Data = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, '');
        imageBuffer = Buffer.from(base64Data, 'base64');
      }

      if (!imageBuffer) {
        return res.status(400).json({
          success: false,
          error: 'Veuillez télécharger une capture d\'écran.'
        });
      }

      const product = await visionExtractor.extractFromImage(imageBuffer, filename);
      return res.json({
        success: true,
        product
      });
    } catch (err: any) {
      console.error('[Vision Error]', err);
      return res.status(500).json({
        success: false,
        error: `Erreur lors de l'analyse: ${err.message}`
      });
    }
  });

  /**
   * POST /api/scrape
   */
  router.post('/scrape', async (req: Request, res: Response) => {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez fournir une URL valide.'
      });
    }

    try {
      const product = await scraper.scrapeProduct(url);
      return res.json({
        success: true,
        product
      });
    } catch (err: any) {
      console.error('[Scraper Error]', err);
      return res.status(500).json({
        success: false,
        error: `Erreur lors de l'extraction: ${err.message}`
      });
    }
  });

  /**
   * POST /api/cart/items
   */
  router.post('/cart/items', (req: Request, res: Response) => {
    const sessionId = getSessionId(req);
    const item = req.body as AddToCartRequest;

    if (!item.title || item.sourcePrice === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Données produit incomplètes.'
      });
    }

    try {
      const cartItem = db.addItem(sessionId, item);
      return res.status(201).json({
        success: true,
        cartItem
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de l\'enregistrement dans le panier.'
      });
    }
  });

  /**
   * GET /api/cart/items
   */
  router.get('/cart/items', (req: Request, res: Response) => {
    const sessionId = getSessionId(req);

    try {
      const items = db.getItems(sessionId);
      const totalTND = items.reduce((sum, it) => sum + it.priceTND * it.quantity, 0);

      return res.json({
        success: true,
        sessionId,
        itemCount: items.length,
        totalItemsCount: items.reduce((sum, it) => sum + it.quantity, 0),
        totalTND: Math.round(totalTND * 100) / 100,
        items
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: 'Erreur de lecture du panier.'
      });
    }
  });

  /**
   * DELETE /api/cart/items/:id
   */
  router.delete('/cart/items/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const removed = db.removeItem(id);
      return res.json({ success: true, removed });
    } catch {
      return res.status(500).json({ success: false, error: 'Erreur de suppression.' });
    }
  });

  /**
   * PATCH /api/cart/items/:id
   */
  router.patch('/cart/items/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { quantity } = req.body;
    try {
      const updated = db.updateQuantity(id, Number(quantity) || 1);
      return res.json({ success: true, cartItem: updated });
    } catch {
      return res.status(500).json({ success: false, error: 'Erreur de mise à jour.' });
    }
  });

  /**
   * POST /api/checkout
   */
  router.post('/checkout', (req: Request, res: Response) => {
    const sessionId = getSessionId(req);
    const { name, phone, city, address, paymentMethod } = req.body;

    if (!name || !phone || !city) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez remplir vos coordonnées complètes (Nom, Téléphone, Ville).'
      });
    }

    const items = db.getItems(sessionId);
    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Votre panier est vide.'
      });
    }

    const orderNumber = 'AYR-' + Math.floor(Math.random() * 899999 + 100000);
    const totalTND = items.reduce((sum, it) => sum + it.priceTND * it.quantity, 0);

    db.clearCart(sessionId);

    return res.json({
      success: true,
      orderNumber,
      customer: { name, phone, city, address, paymentMethod },
      totalTND: Math.round(totalTND * 100) / 100,
      itemCount: items.length,
      message: 'Votre commande a été enregistrée avec succès chez AYROVI !'
    });
  });

  return router;
}
