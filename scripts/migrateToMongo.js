const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // ignore
}

// Read .env file manually
function getEnvConfig() {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

getEnvConfig();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'portfolio_db';

if (!uri) {
  console.error('❌ MONGODB_URI not found in environment or .env');
  process.exit(1);
}

async function migrate() {
  console.log(`Connecting to MongoDB Atlas at database: "${dbName}"...`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas successfully!');
    const db = client.db(dbName);

    const datasets = [
      { name: 'art', id: 'art_config', file: 'art.json' },
      { name: 'blogs', id: 'blog_config', file: 'blog.json' },
      { name: 'explorations', id: 'explorations_config', file: 'explorations.json' },
      { name: 'flowcharts', id: 'flowcharts_config', file: 'flowcharts.json' },
      { name: 'projects', id: 'projects_config', file: 'projects.json' },
      { name: 'resume', id: 'resume_config', file: 'resume.json' },
    ];

    for (const item of datasets) {
      const filePath = path.join(process.cwd(), 'data', item.file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        const result = await db.collection(item.name).updateOne(
          { _id: item.id },
          { $set: { data: data, updatedAt: new Date() } },
          { upsert: true }
        );
        console.log(`✅ [${item.name}] Uploaded ${item.file} to collection "${item.name}" (id: ${item.id}) - matched: ${result.matchedCount}, upserted: ${result.upsertedCount}`);
      } else {
        console.warn(`⚠️ File not found: ${filePath}`);
      }
    }

    console.log('\n--- Verifying MongoDB Atlas Collections ---');
    for (const item of datasets) {
      const doc = await db.collection(item.name).findOne({ _id: item.id });
      if (doc && doc.data) {
        const count = Array.isArray(doc.data) ? `${doc.data.length} items` : 'object';
        console.log(`✔ Verified "${item.name}": document exists with ${count}`);
      } else {
        console.error(`❌ Missing document in "${item.name}"!`);
      }
    }

    console.log('\n🎉 ALL JSON data successfully transformed and verified in MongoDB Atlas!');
  } catch (err) {
    console.error('❌ Migration error:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

migrate();
