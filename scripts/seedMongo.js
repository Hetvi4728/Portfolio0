const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Set public DNS servers to resolve MongoDB Atlas SRV records reliably
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // fallback if environment locks dns.setServers
}

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

const uri = process.env.MONGODB_URI || 'mongodb+srv://hetvipatel4728_db_user:E8DgbKpynSdnSwmE@cluster0.zotlpat.mongodb.net/';
const dbName = process.env.MONGODB_DB || 'portfolio_db';

async function seedMongo() {
  const client = new MongoClient(uri);
  try {
    console.log('Connecting to Live MongoDB Atlas...');
    await client.connect();
    console.log('✅ Connected to Live MongoDB Atlas successfully!');
    const db = client.db('portfolio_db');

    // 1. Flowcharts
    const flowchartsData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'flowcharts.json'), 'utf-8')
    );
    await db.collection('flowcharts').updateOne(
      { _id: 'flowcharts_config' },
      { $set: { data: flowchartsData, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log('🎉 Initialized flowcharts in MongoDB Atlas!');

    // 2. Art
    const artData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'art.json'), 'utf-8')
    );
    await db.collection('art').updateOne(
      { _id: 'art_config' },
      { $set: { data: artData, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log('🎉 Initialized art in MongoDB Atlas!');

    // 3. Blog
    const blogData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'blog.json'), 'utf-8')
    );
    await db.collection('blogs').updateOne(
      { _id: 'blog_config' },
      { $set: { data: blogData, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log('🎉 Initialized blogs in MongoDB Atlas!');

    // 4. Projects
    const projectsData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'projects.json'), 'utf-8')
    );
    await db.collection('projects').updateOne(
      { _id: 'projects_config' },
      { $set: { data: projectsData, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log('🎉 Initialized projects in MongoDB Atlas!');

    // 5. Resume
    const resumeData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'resume.json'), 'utf-8')
    );
    await db.collection('resume').updateOne(
      { _id: 'resume_config' },
      { $set: { data: resumeData, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log('🎉 Initialized resume in MongoDB Atlas!');

    console.log('✅ ALL JSON datasets successfully seeded to MongoDB Atlas!');
  } catch (err) {
    console.error('❌ MongoDB Atlas Seeding Error:', err);
  } finally {
    await client.close();
  }
}

seedMongo();
