// Agrou — Supabase SQL Push Script
// Usage: node supabase/push.js schema   → runs 01_schema.sql
//        node supabase/push.js seed     → runs 02_seed.sql
//        node supabase/push.js all      → runs both in order

const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

// Set DB_PASSWORD env var before running:
//   DB_PASSWORD=yourpassword node supabase/push.cjs
const CONNECTION = {
  host: process.env.DB_HOST || "db.hodtuvbkrshvtjesacab.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
};

if (!CONNECTION.password) {
  console.error("❌ Set DB_PASSWORD env var before running.");
  process.exit(1);
}

const FILES = {
  schema: path.join(__dirname, "01_schema.sql"),
  seed: path.join(__dirname, "02_seed.sql"),
};

async function runFile(label, filePath) {
  const sql = fs.readFileSync(filePath, "utf8");
  const client = new Client(CONNECTION);
  await client.connect();
  console.log(`\n▶ Running ${label} (${filePath})...`);
  try {
    await client.query(sql);
    console.log(`✅ ${label} complete`);
  } catch (err) {
    console.error(`❌ ${label} failed:`, err.message);
    throw err;
  } finally {
    await client.end();
  }
}

async function main() {
  const arg = process.argv[2] ?? "all";
  if (arg === "schema") {
    await runFile("Schema", FILES.schema);
  } else if (arg === "seed") {
    await runFile("Seed", FILES.seed);
  } else {
    await runFile("Schema", FILES.schema);
    await runFile("Seed", FILES.seed);
  }
  console.log("\n🎉 Done!");
}

main().catch((err) => {
  console.error("\nFatal:", err.message);
  process.exit(1);
});
