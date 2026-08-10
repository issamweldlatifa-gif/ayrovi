import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { QatafoDatabase as AyroviDatabase } from './db/database';
import { SmartLinkScraper } from './scraper/scraper';
import { VisualProductExtractor } from './services/vision';
import { createApiRouter } from './api/routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable Permissive CORS & Iframe embedding for Arena Preview
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session-id, x-requested-with');
  res.removeHeader('X-Frame-Options');
  res.setHeader('Content-Security-Policy', "frame-ancestors *");
  
  // Disable Browser Caching Completely
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Database, Scraper & Vision Engine
const db = new AyroviDatabase();
const scraper = new SmartLinkScraper();
const visionExtractor = new VisualProductExtractor();

// Static Assets
app.use(express.static(path.resolve(__dirname, '../public')));

// Uploads static directory
const uploadsDir = path.resolve(process.cwd(), 'data/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api', createApiRouter(db, scraper, visionExtractor));

// Healthcheck Route
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'AYROVI Universal Shopping & Vision Platform',
    version: '2.5.0',
    features: ['Link Scraper', 'Visual Screenshot OCR', 'Dynamic Pricing (1 EUR/USD = 4.00 DT)', 'Unified Cart'],
    supportedStores: ['SHEIN', 'Amazon', 'TEMU', 'AliExpress', 'Zara', 'Nike']
  });
});

// Explicit Pages
app.get('/cart', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/cart.html'));
});

app.get('/', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log('====================================================');
    console.log(`🚀 AYROVI Universal Shopping & Vision Platform running`);
    console.log(`📍 Portal & Vision Extractor: http://0.0.0.0:${PORT}/`);
    console.log(`📍 Web Cart & Checkout:       http://0.0.0.0:${PORT}/cart`);
    console.log('====================================================');
  });
}

export { app, db, scraper, visionExtractor };
