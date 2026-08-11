import { randomInt } from 'node:crypto';
import { isIP } from 'node:net';
import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { SmartLinkScraper } from '../scraper/scraper';
import { QatafoDatabase as AyroviDatabase } from '../db/database';
import { VisualProductExtractor } from '../services/vision';
import { AddToCartRequest } from '../types';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_IMAGE_SIZE, files: 1 } });
const SUPPORTED_STORES = new Set(['amazon', 'shein', 'temu', 'aliexpress', 'generic']);

function isUnsafeHostname(rawHostname: string): boolean {
  const hostname = rawHostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '');
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.lan')
  ) return true;

  const ipVersion = isIP(hostname);
  if (ipVersion === 4) {
    const [first, second] = hostname.split('.').map(Number);
    return (
      first === 0 || first === 10 || first === 127 || first >= 224 ||
      (first === 100 && second >= 64 && second <= 127) ||
      (first === 169 && second === 254) ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 168) ||
      (first === 198 && (second === 18 || second === 19))
    );
  }
  if (ipVersion === 6) {
    return (
      hostname === '::' || hostname === '::1' ||
      hostname.startsWith('fc') || hostname.startsWith('fd') ||
      /^fe[89ab]/.test(hostname) || hostname.startsWith('::ffff:')
    );
  }
  return false;
}

function calculateItemPriceTND(sourcePrice: number, sourceCurrency: string): number | null {
  const rate = VisualProductExtractor.RATES_TO_TND[sourceCurrency];
  if (!rate) return null;
  const convertedTND = Math.round(sourcePrice * rate * 100) / 100;
  const serviceFeeTND = Math.round(Math.max(10, convertedTND * 0.08) * 100) / 100;
  return Math.round((convertedTND + serviceFeeTND + 25) * 100) / 100;
}

export function createApiRouter(
  db: AyroviDatabase,
  scraper: SmartLinkScraper,
  visionExtractor: VisualProductExtractor
): Router {
  const router = Router();

  function getSessionId(req: Request): string {
    const candidate = req.headers['x-session-id'] || req.query.sessionId;
    const value = Array.isArray(candidate) ? candidate[0] : candidate;
    if (typeof value !== 'string') return '';
    const normalized = value.trim();
    return /^[A-Za-z0-9._:-]{8,160}$/.test(normalized) ? normalized : '';
  }

  function requireSessionId(req: Request, res: Response): string | null {
    const sessionId = getSessionId(req);
    if (sessionId) return sessionId;
    res.status(400).json({ success: false, error: 'Session client invalide ou absente.' });
    return null;
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
        if (!req.file.mimetype.startsWith('image/')) {
          return res.status(415).json({ success: false, error: 'Le fichier envoyé doit être une image.' });
        }
        imageBuffer = req.file.buffer;
        filename = req.file.originalname;
      } else if (typeof req.body?.imageBase64 === 'string') {
        const match = req.body.imageBase64.match(/^data:image\/[A-Za-z0-9.+-]+;base64,([A-Za-z0-9+/=]+)$/);
        if (match) imageBuffer = Buffer.from(match[1], 'base64');
      }

      if (!imageBuffer || imageBuffer.length === 0 || imageBuffer.length > MAX_IMAGE_SIZE) {
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
        error: "L'analyse de l'image a échoué. Réessayez avec une capture plus nette."
      });
    }
  });

  /**
   * POST /api/scrape
   */
  router.post('/scrape', async (req: Request, res: Response) => {
    const url = req.body?.url;

    if (typeof url !== 'string' || !url.trim() || url.length > 4096) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez fournir une URL valide.'
      });
    }

    const cleanUrl = scraper.cleanPastedUrl(url);
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(cleanUrl);
    } catch {
      return res.status(400).json({ success: false, error: 'Veuillez fournir une URL Web valide.' });
    }
    if (!['http:', 'https:'].includes(parsedUrl.protocol) || isUnsafeHostname(parsedUrl.hostname)) {
      return res.status(400).json({ success: false, error: 'Cette adresse Web ne peut pas être analysée.' });
    }

    try {
      const product = await scraper.scrapeProduct(cleanUrl);
      return res.json({
        success: true,
        product
      });
    } catch (err: any) {
      console.error('[Scraper Error]', err);
      return res.status(500).json({
        success: false,
        error: "L'extraction du produit a échoué. Vérifiez le lien ou utilisez une capture d'écran."
      });
    }
  });

  /**
   * POST /api/cart/items
   */
  router.post('/cart/items', (req: Request, res: Response) => {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;

    const item = req.body as Partial<AddToCartRequest> | null;
    if (!item || typeof item !== 'object') {
      return res.status(400).json({ success: false, error: 'Données produit incomplètes ou invalides.' });
    }

    const quantity = Number(item.quantity ?? 1);
    const sourcePrice = Number(item.sourcePrice);
    const sourceCurrency = typeof item.sourceCurrency === 'string' ? item.sourceCurrency.trim().toUpperCase() : '';
    const calculatedPriceTND = calculateItemPriceTND(sourcePrice, sourceCurrency);

    if (
      typeof item.title !== 'string' || !item.title.trim() || item.title.length > 500 ||
      typeof item.store !== 'string' || !SUPPORTED_STORES.has(item.store) ||
      typeof item.url !== 'string' || item.url.length > 4096 ||
      typeof item.imageUrl !== 'string' || item.imageUrl.length > 4096 ||
      !Number.isFinite(sourcePrice) || sourcePrice <= 0 || sourcePrice > 1_000_000 ||
      calculatedPriceTND === null ||
      !Number.isInteger(quantity) || quantity < 1 || quantity > 99 ||
      (item.externalId != null && (typeof item.externalId !== 'string' || item.externalId.length > 300)) ||
      (item.variant != null && (typeof item.variant !== 'string' || item.variant.length > 500))
    ) {
      return res.status(400).json({
        success: false,
        error: 'Données produit incomplètes ou invalides.'
      });
    }

    const normalizedItem: AddToCartRequest = {
      store: item.store,
      externalId: item.externalId?.trim() || null,
      url: item.url.trim(),
      title: item.title.trim(),
      imageUrl: item.imageUrl.trim(),
      sourcePrice,
      sourceCurrency,
      priceTND: calculatedPriceTND,
      variant: item.variant?.trim() || null,
      quantity,
    };

    try {
      const cartItem = db.addItem(sessionId, normalizedItem);
      const items = db.getItems(sessionId);
      const totalTND = items.reduce((sum, current) => sum + current.priceTND * current.quantity, 0);
      return res.status(201).json({
        success: true,
        cartItem,
        totalItemsCount: items.reduce((sum, current) => sum + current.quantity, 0),
        totalTND: Math.round(totalTND * 100) / 100,
      });
    } catch (err: any) {
      if (err instanceof RangeError && err.message === 'CART_QUANTITY_LIMIT') {
        return res.status(400).json({ success: false, error: 'La quantité maximale par article est de 99.' });
      }
      console.error('[Cart Add Error]', err);
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
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;

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
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;

    const { id } = req.params;
    try {
      const removed = db.removeItem(id, sessionId);
      if (!removed) return res.status(404).json({ success: false, error: 'Article introuvable.' });
      return res.json({ success: true, removed: true });
    } catch {
      return res.status(500).json({ success: false, error: 'Erreur de suppression.' });
    }
  });

  /**
   * PATCH /api/cart/items/:id
   */
  router.patch('/cart/items/:id', (req: Request, res: Response) => {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;

    const { id } = req.params;
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(quantity) || quantity < 0 || quantity > 99) {
      return res.status(400).json({ success: false, error: 'Quantité invalide.' });
    }

    try {
      const existing = db.getItemById(id, sessionId);
      if (!existing) return res.status(404).json({ success: false, error: 'Article introuvable.' });
      const updated = db.updateQuantity(id, quantity, sessionId);
      return res.json({ success: true, cartItem: updated });
    } catch {
      return res.status(500).json({ success: false, error: 'Erreur de mise à jour.' });
    }
  });

  /**
   * POST /api/checkout
   */
  router.post('/checkout', (req: Request, res: Response) => {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;

    const { name, phone, city, address, paymentMethod } = req.body ?? {};

    if (
      typeof name !== 'string' || !name.trim() || name.length > 160 ||
      typeof phone !== 'string' || phone.length > 40 || phone.replace(/\D/g, '').length < 8 ||
      typeof city !== 'string' || !city.trim() || city.length > 100 ||
      typeof address !== 'string' || !address.trim() || address.length > 500
    ) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez remplir des coordonnées de livraison valides.'
      });
    }

    const items = db.getItems(sessionId);
    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Votre panier est vide.'
      });
    }

    const orderNumber = `AYR-${randomInt(100000, 1000000)}`;
    const totalTND = items.reduce((sum, it) => sum + it.priceTND * it.quantity, 0);
    const normalizedPaymentMethod = paymentMethod === 'd17' ? 'd17' : 'cod';

    db.clearCart(sessionId);

    return res.json({
      success: true,
      orderNumber,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
        paymentMethod: normalizedPaymentMethod,
      },
      totalTND: Math.round(totalTND * 100) / 100,
      itemCount: items.length,
      message: 'Votre commande a été enregistrée avec succès chez AYROVI !'
    });
  });

  router.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof multer.MulterError) {
      const message = err.code === 'LIMIT_FILE_SIZE'
        ? 'Image trop volumineuse (10 Mo maximum).'
        : 'Le fichier envoyé est invalide.';
      return res.status(400).json({ success: false, error: message });
    }
    console.error('[API Error]', err);
    return res.status(500).json({ success: false, error: 'Erreur interne du service.' });
  });

  return router;
}
