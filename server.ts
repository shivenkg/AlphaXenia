import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseService } from './src/server/databaseService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));

  let serverDataCache: any = null;
  let lastServerSyncAt: string | null = null;
  let serverSyncCount = 0;

  // Database API Endpoints for Supabase PostgreSQL
  app.get('/api/database/realtime-status', (_req, res) => {
    res.json({
      online: true,
      lastServerSyncAt,
      serverSyncCount,
      configuredHost: 'db.eonmoodozhicjlgnmzkx.supabase.co',
      port: 5432,
      database: 'postgres',
      timestamp: new Date().toISOString(),
    });
  });

  app.post('/api/database/test-connection', async (req, res) => {
    try {
      const config = req.body || {};
      const result = await DatabaseService.testConnection(config);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err?.message || 'Failed to test database connection',
      });
    }
  });

  app.post('/api/database/create-schema', async (req, res) => {
    try {
      const config = req.body || {};
      const result = await DatabaseService.createSchema(config);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err?.message || 'Failed to create schema',
      });
    }
  });

  app.post('/api/database/sync-all-local-data', async (req, res) => {
    try {
      const { config, localData } = req.body || {};
      if (localData) {
        serverDataCache = localData;
        lastServerSyncAt = new Date().toISOString();
        serverSyncCount++;
      }
      const result = await DatabaseService.syncAllData(config, localData);
      res.json({
        ...result,
        serverCached: true,
        lastServerSyncAt,
        serverSyncCount,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err?.message || 'Failed to sync local data to database',
        lastServerSyncAt,
      });
    }
  });

  app.post('/api/database/generate-sql', (req, res) => {
    try {
      const { localData } = req.body || {};
      const sql = DatabaseService.generateFullSqlScript(localData);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.send(sql);
    } catch (err: any) {
      res.status(500).send(`-- Error generating SQL: ${err?.message}`);
    }
  });

  app.post('/api/database/sync-dummy-data', async (req, res) => {
    try {
      const config = req.body || {};
      const result = await DatabaseService.syncDummyData(config);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err?.message || 'Failed to sync dummy data',
      });
    }
  });

  app.get('/api/database/sql-script', (_req, res) => {
    try {
      const sql = DatabaseService.generateFullSqlScript();
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.send(sql);
    } catch (err: any) {
      res.status(500).send(`-- Error generating SQL: ${err?.message}`);
    }
  });

  app.get('/api/database/status', (_req, res) => {
    res.json({
      configuredHost: 'db.eonmoodozhicjlgnmzkx.supabase.co',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      engine: 'POSTGRESQL',
      ssl: 'require',
      status: 'CONFIGURED',
      timestamp: new Date().toISOString(),
    });
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Enterprise VMS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
