import { describe, test, expect, afterAll } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { app, db, scraper, visionExtractor } from '../src/server';

describe('AYROVI Universal Shopping Platform Tests', () => {
  const testSession = 'test-session-' + Date.now();

  afterAll(() => {
    db.clearCart(testSession);
  });

  test('Visual OCR: Extracts SHEIN Dress details from real screenshot', async () => {
    const imgPath = path.resolve(process.cwd(), 'uploads/Screenshot_20260810_195524_org.mozilla.firefox.jpg');
    const buffer = fs.readFileSync(imgPath);
    const product = await visionExtractor.extractFromImage(buffer, 'Screenshot_shein.jpg');

    expect(product).toBeDefined();
    expect(product.store).toBe('shein');
    expect(product.title).toContain('Slaydiva');
    expect(product.sourceCurrency).toBe('EUR');
  });

  test('Visual OCR: Extracts Amazon Japan Book & 275 JPY from real screenshot', async () => {
    const imgPath = path.resolve(process.cwd(), 'uploads/Screenshot_20260810_144515_com.gbox.android.jpg');
    const buffer = fs.readFileSync(imgPath);
    const product = await visionExtractor.extractFromImage(buffer, 'Screenshot_japan.jpg');

    expect(product).toBeDefined();
    expect(product.store).toBe('amazon');
    expect(product.sourcePrice).toBe(275);
    expect(product.sourceCurrency).toBe('JPY');
  });

  test('Scraper: Parses URL info for arbitrary links', async () => {
    const url = 'https://www.shein.com/Muchica-Women-s-Beige-Black-And-Cream-Knitted-Casual-Sporty-Matching-Set-Featuring-A-Vintage-Style-Distressed-Print-And-A-Washed-Finish-Streetwear-p-382460229.html';
    const product = await scraper.scrapeProduct(url);

    expect(product.store).toBe('shein');
    expect(product.title).toContain('Muchica');
    expect(product.externalId).toBe('SH-382460229');
  });

  test('API POST /api/extract-image: Extracts product from uploaded image', async () => {
    const imgPath = path.resolve(process.cwd(), 'uploads/Screenshot_20260810_195524_org.mozilla.firefox.jpg');
    const res = await request(app)
      .post('/api/extract-image')
      .attach('image', imgPath);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.product.title).toContain('Slaydiva');
  });

  test('API POST /api/cart/items & Checkout Flow', async () => {
    const addRes = await request(app)
      .post('/api/cart/items')
      .set('x-session-id', testSession)
      .send({
        store: 'shein',
        externalId: 'SH-382460229',
        url: 'https://www.shein.com/...',
        title: 'Muchica Matching Set',
        imageUrl: '/uploads/shot_1.jpg',
        sourcePrice: 21.99,
        sourceCurrency: 'EUR',
        priceTND: 103.61,
        variant: 'Taille: M',
        quantity: 1
      });

    expect(addRes.status).toBe(201);
    expect(addRes.body.success).toBe(true);

    const cartRes = await request(app)
      .get('/api/cart/items')
      .set('x-session-id', testSession);

    expect(cartRes.status).toBe(200);
    expect(cartRes.body.items.length).toBeGreaterThan(0);

    const checkoutRes = await request(app)
      .post('/api/checkout')
      .set('x-session-id', testSession)
      .send({
        name: 'Issam Test',
        phone: '98123456',
        city: 'Tunis',
        address: 'Avenue Habib Bourguiba, Tunis',
        paymentMethod: 'cod'
      });

    expect(checkoutRes.status).toBe(200);
    expect(checkoutRes.body.success).toBe(true);
    expect(checkoutRes.body.orderNumber).toContain('AYR-');
  });

  test('API GET /api/health: Healthcheck returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
