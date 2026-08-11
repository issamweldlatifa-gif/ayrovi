import { afterAll, describe, expect, test } from 'vitest';
import request from 'supertest';
import { app, db, scraper } from '../src/server';

const uniqueSession = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const createCartItem = (title = 'Muchica Matching Set') => ({
  store: 'shein',
  externalId: `SH-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  url: 'https://www.shein.com/product-p-382460229.html',
  title,
  imageUrl: '/uploads/product.jpg',
  sourcePrice: 21.99,
  sourceCurrency: 'EUR',
  priceTND: 103.61,
  variant: 'Taille: M',
  quantity: 1,
});

describe('AYROVI platform', () => {
  const primarySession = uniqueSession('primary');
  const isolatedSession = uniqueSession('isolated');
  const quantitySession = uniqueSession('quantity');

  afterAll(() => {
    db.clearCart(primarySession);
    db.clearCart(isolatedSession);
    db.clearCart(quantitySession);
  });

  test('URL cleaner extracts a valid link from pasted text', () => {
    const value = scraper.cleanPastedUrl(
      'Voir cet article : https://www.shein.com/product-p-382460229.html), merci',
    );
    expect(value).toBe('https://www.shein.com/product-p-382460229.html');
  });

  test('image extraction rejects a request without an image', async () => {
    const response = await request(app).post('/api/extract-image');
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('image extraction rejects non-image uploads', async () => {
    const response = await request(app)
      .post('/api/extract-image')
      .attach('image', Buffer.from('not-an-image'), {
        filename: 'payload.txt',
        contentType: 'text/plain',
      });
    expect(response.status).toBe(415);
    expect(response.body.success).toBe(false);
  });

  test('scraping blocks malformed and private service addresses', async () => {
    const malformed = await request(app).post('/api/scrape').send({ url: 'not-a-web-address' });
    expect(malformed.status).toBe(400);

    const privateAddress = await request(app).post('/api/scrape').send({ url: 'http://127.0.0.1:3000/' });
    expect(privateAddress.status).toBe(400);
    expect(privateAddress.body.success).toBe(false);
  });

  test('cart routes require a valid client session', async () => {
    const response = await request(app).get('/api/cart/items');
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('cart and checkout remain isolated between client sessions', async () => {
    const addResponse = await request(app)
      .post('/api/cart/items')
      .set('x-session-id', primarySession)
      .send(createCartItem());

    expect(addResponse.status).toBe(201);
    expect(addResponse.body.success).toBe(true);
    expect(addResponse.body.cartItem.priceTND).toBe(122.96);
    const itemId = addResponse.body.cartItem.id as string;

    const primaryCart = await request(app)
      .get('/api/cart/items')
      .set('x-session-id', primarySession);
    expect(primaryCart.status).toBe(200);
    expect(primaryCart.body.items).toHaveLength(1);

    const isolatedCart = await request(app)
      .get('/api/cart/items')
      .set('x-session-id', isolatedSession);
    expect(isolatedCart.status).toBe(200);
    expect(isolatedCart.body.items).toHaveLength(0);

    const unauthorizedUpdate = await request(app)
      .patch(`/api/cart/items/${itemId}`)
      .set('x-session-id', isolatedSession)
      .send({ quantity: 2 });
    expect(unauthorizedUpdate.status).toBe(404);

    const unauthorizedDelete = await request(app)
      .delete(`/api/cart/items/${itemId}`)
      .set('x-session-id', isolatedSession);
    expect(unauthorizedDelete.status).toBe(404);

    const emptyCheckout = await request(app)
      .post('/api/checkout')
      .set('x-session-id', isolatedSession)
      .send({
        name: 'Client Test',
        phone: '98123456',
        city: 'Tunis',
        address: 'Avenue Habib Bourguiba, Tunis',
        paymentMethod: 'cod',
      });
    expect(emptyCheckout.status).toBe(400);
    expect(emptyCheckout.body.error).toContain('panier est vide');

    const checkoutResponse = await request(app)
      .post('/api/checkout')
      .set('x-session-id', primarySession)
      .send({
        name: 'Client Test',
        phone: '98123456',
        city: 'Tunis',
        address: 'Avenue Habib Bourguiba, Tunis',
        paymentMethod: 'cod',
      });

    expect(checkoutResponse.status).toBe(200);
    expect(checkoutResponse.body.success).toBe(true);
    expect(checkoutResponse.body.orderNumber).toMatch(/^AYR-\d{6}$/);
  });

  test('invalid cart quantities are rejected', async () => {
    const response = await request(app)
      .post('/api/cart/items')
      .set('x-session-id', primarySession)
      .send({ ...createCartItem('Invalid quantity item'), quantity: 100 });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('duplicate additions cannot exceed the per-item quantity limit', async () => {
    const item = { ...createCartItem('Quantity limit item'), quantity: 99 };
    const firstResponse = await request(app)
      .post('/api/cart/items')
      .set('x-session-id', quantitySession)
      .send(item);
    expect(firstResponse.status).toBe(201);

    const secondResponse = await request(app)
      .post('/api/cart/items')
      .set('x-session-id', quantitySession)
      .send({ ...item, quantity: 1 });
    expect(secondResponse.status).toBe(400);
    expect(secondResponse.body.error).toContain('99');
  });

  test('healthcheck reports the service as ready', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
