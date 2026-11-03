import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mmljatcvouyjfbznxjgs.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_mt-NaU29NLLqSThp1Eym0A_BBs1NWo7';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function chunkUpsert(tableName: string, records: any[], chunkSize = 40) {
  console.log(`[*] Seeding ${records.length} records into '${tableName}' in chunks of ${chunkSize}...`);
  for (let i = 0; i < records.length; i += chunkSize) {
    const chunk = records.slice(i, i + chunkSize);
    const { error } = await supabase.from(tableName).upsert(chunk);
    if (error) {
      console.error(`[Error] Seeding chunk [${i}..${i + chunk.length}] into ${tableName}:`, error.message);
    } else {
      process.stdout.write(`  Upserted ${Math.min(i + chunkSize, records.length)}/${records.length} into ${tableName}\r`);
    }
  }
  console.log(`\n Completed '${tableName}'.`);
}

async function runSeed() {
  console.log('===============================================================');
  console.log(' ARTHIQ SUPABASE DATA SEEDER — 7-MONTH VALIDATED DATASET');
  console.log(` Target Supabase: ${SUPABASE_URL}`);
  console.log('===============================================================');

  const jsonPath = path.join(__dirname, 'sampleDatabaseSeeder.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`Cannot find ${jsonPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const dataset = JSON.parse(raw);

  // 1. Organizations
  if (dataset.organizations?.length) {
    await chunkUpsert('organizations', dataset.organizations);
  }

  // 2. Accounts
  if (dataset.accounts?.length) {
    await chunkUpsert('accounts', dataset.accounts);
  }

  // 3. Vendors
  if (dataset.vendors?.length) {
    await chunkUpsert('vendors', dataset.vendors);
  }

  // 4. Clients
  if (dataset.clients?.length) {
    await chunkUpsert('clients', dataset.clients);
  }

  // 5. Expenses
  if (dataset.expenses?.length) {
    await chunkUpsert('expenses', dataset.expenses);
  }

  // 6. Invoices
  if (dataset.invoices?.length) {
    await chunkUpsert('invoices', dataset.invoices);
  }

  // 7. Profit Leakage Findings
  if (dataset.profit_leakage_findings?.length) {
    await chunkUpsert('profit_leakage_findings', dataset.profit_leakage_findings);
  }

  console.log('\n[*] All sample data seeded successfully into Supabase!');
}

runSeed().catch(err => {
  console.error('[Fatal Error]', err);
  process.exit(1);
});

