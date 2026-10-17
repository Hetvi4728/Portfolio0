const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Fallback public DNS for reliable SRV lookups
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

// Read .env file
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

async function checkConnection() {
  console.log('--------------------------------------------------');
  console.log('🔍 Checking MongoDB Atlas Connection...');
  console.log('--------------------------------------------------');

  if (!uri) {
    console.error('❌ MONGODB_URI is missing from .env or environment.');
    process.exit(1);
  }

  // Mask credentials for display
  const maskedUri = uri.replace(/:\/\/[^:]+:[^@]+@/, '://<credentials>@');
  console.log(`📡 Connecting to: ${maskedUri}`);
  console.log(`📁 Target Database: ${dbName}`);

  const startTime = Date.now();
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });

  try {
    await client.connect();
    const connectLatency = Date.now() - startTime;
    console.log(`✅ Successfully connected to MongoDB Atlas in ${connectLatency}ms!`);

    const db = client.db(dbName);

    // 1. Ping the cluster
    const pingStart = Date.now();
    const pingResult = await db.command({ ping: 1 });
    const pingLatency = Date.now() - pingStart;
    console.log(`⚡ Ping command responded in ${pingLatency}ms:`, pingResult);

    // 2. Fetch server build information
    try {
      const buildInfo = await db.command({ buildInfo: 1 });
      console.log(`🏷️  MongoDB Version: ${buildInfo.version}`);
    } catch (e) {
      // Build info might be restricted on some shared clusters
    }

    // 3. Inspect collections and documents
    console.log('\n📊 Checking Collections and Document Counts:');
    const expectedCollections = ['art', 'blogs', 'explorations', 'flowcharts', 'projects', 'resume'];

    for (const colName of expectedCollections) {
      const count = await db.collection(colName).countDocuments();
      const sample = await db.collection(colName).findOne();
      const sampleId = sample ? (sample._id || 'unknown') : 'none';
      const hasData = sample && sample.data ? (Array.isArray(sample.data) ? `${sample.data.length} items` : 'Object') : 'No data field';
      console.log(`  • Collection "${colName}": ${count} doc(s) [Config ID: "${sampleId}", Content: ${hasData}]`);
    }

    // 4. Test Write and Delete capability
    console.log('\n🧪 Testing Read/Write Privileges:');
    const testCol = db.collection('_connection_test');
    const testDoc = { test: true, timestamp: new Date() };
    const insertRes = await testCol.insertOne(testDoc);
    console.log(`  ✓ Write Test: Inserted test document (_id: ${insertRes.insertedId})`);

    const foundDoc = await testCol.findOne({ _id: insertRes.insertedId });
    if (foundDoc) {
      console.log(`  ✓ Read Test: Verified test document exists.`);
    }

    await testCol.deleteOne({ _id: insertRes.insertedId });
    console.log(`  ✓ Cleanup Test: Deleted test document.`);

    console.log('\n--------------------------------------------------');
    console.log('🎉 MongoDB Connection Status: 100% HEALTHY & ACTIVE!');
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('\n❌ MongoDB Connection Error:', error.message || error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

checkConnection();
