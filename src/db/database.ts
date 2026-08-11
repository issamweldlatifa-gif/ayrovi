import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'node:crypto';
import { CartItem, AddToCartRequest } from '../types';

export class QatafoDatabase {
  private db: Database.Database;

  constructor(dbPath?: string) {
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const resolvedPath = dbPath || path.join(dataDir, 'qatafo.sqlite');
    this.db = new Database(resolvedPath);
    this.db.pragma('journal_mode = WAL');
    this.initSchema();
  }

  private initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        store TEXT NOT NULL,
        external_id TEXT,
        source_url TEXT NOT NULL,
        title TEXT NOT NULL,
        image_url TEXT,
        source_price REAL NOT NULL,
        source_currency TEXT NOT NULL,
        price_tnd REAL NOT NULL,
        variant TEXT,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_cart_session ON cart_items(session_id);
    `);
  }

  private mapRow(row: any): CartItem {
    return {
      id: row.id,
      sessionId: row.session_id,
      store: row.store,
      externalId: row.external_id,
      sourceUrl: row.source_url,
      title: row.title,
      imageUrl: row.image_url,
      sourcePrice: Number(row.source_price),
      sourceCurrency: row.source_currency,
      priceTND: Number(row.price_tnd),
      variant: row.variant,
      quantity: Number(row.quantity),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  public addItem(sessionId: string, item: AddToCartRequest): CartItem {
    const now = new Date().toISOString();

    // Check duplicate
    if (item.externalId) {
      const existing = this.db.prepare(`
        SELECT * FROM cart_items
        WHERE session_id = ? AND store = ? AND external_id = ?
          AND IFNULL(variant, '') = IFNULL(?, '')
      `).get(sessionId, item.store, item.externalId, item.variant || '') as any;

      if (existing) {
        const newQty = existing.quantity + (item.quantity || 1);
        if (newQty > 99) throw new RangeError('CART_QUANTITY_LIMIT');
        this.db.prepare(`
          UPDATE cart_items SET quantity = ?, updated_at = ? WHERE id = ? AND session_id = ?
        `).run(newQty, now, existing.id, sessionId);
        return this.getItemById(existing.id, sessionId)!;
      }
    }

    const id = 'ayr_' + randomUUID().substring(0, 8);
    this.db.prepare(`
      INSERT INTO cart_items (
        id, session_id, store, external_id, source_url, title, image_url,
        source_price, source_currency, price_tnd, variant, quantity, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      sessionId,
      item.store,
      item.externalId || null,
      item.url,
      item.title,
      item.imageUrl,
      item.sourcePrice,
      item.sourceCurrency,
      item.priceTND,
      item.variant || null,
      item.quantity || 1,
      now,
      now
    );

    return this.getItemById(id, sessionId)!;
  }

  public getItems(sessionId: string): CartItem[] {
    const rows = this.db
      .prepare('SELECT * FROM cart_items WHERE session_id = ? ORDER BY created_at DESC')
      .all(sessionId) as any[];
    return rows.map((row) => this.mapRow(row));
  }

  public getItemById(id: string, sessionId: string): CartItem | null {
    const row = this.db
      .prepare('SELECT * FROM cart_items WHERE id = ? AND session_id = ?')
      .get(id, sessionId) as any;
    return row ? this.mapRow(row) : null;
  }

  public removeItem(id: string, sessionId: string): boolean {
    const result = this.db
      .prepare('DELETE FROM cart_items WHERE id = ? AND session_id = ?')
      .run(id, sessionId);
    return result.changes > 0;
  }

  public updateQuantity(id: string, quantity: number, sessionId: string): CartItem | null {
    if (quantity <= 0) {
      this.removeItem(id, sessionId);
      return null;
    }

    const now = new Date().toISOString();
    this.db.prepare('UPDATE cart_items SET quantity = ?, updated_at = ? WHERE id = ? AND session_id = ?')
      .run(quantity, now, id, sessionId);
    return this.getItemById(id, sessionId);
  }

  public clearCart(sessionId: string): number {
    return this.db.prepare('DELETE FROM cart_items WHERE session_id = ?').run(sessionId).changes;
  }
}
