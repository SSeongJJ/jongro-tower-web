import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new pg.Client({
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.nzsgbcsdmzcacszhgony',
  password: 'Yrx_4u@8s.Yx7*5',
  ssl: { rejectUnauthorized: false },
});

async function run() {
  await client.connect();
  console.log('Connected to Supabase PostgreSQL');

  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    if (!file.endsWith('.sql')) continue;
    console.log(`Running: ${file}`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    try {
      await client.query(sql);
      console.log(`  ✓ ${file} done`);
    } catch (err) {
      console.error(`  ✗ ${file} failed:`, err.message);
    }
  }

  // Run seed
  const seedPath = path.join(__dirname, '..', 'supabase', 'seed.sql');
  if (fs.existsSync(seedPath)) {
    console.log('Running: seed.sql');
    const seed = fs.readFileSync(seedPath, 'utf8');
    try {
      await client.query(seed);
      console.log('  ✓ seed.sql done');
    } catch (err) {
      console.error('  ✗ seed.sql failed:', err.message);
    }
  }

  await client.end();
  console.log('Migration complete');
}

run().catch(console.error);
