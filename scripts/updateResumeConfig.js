const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const envPath = path.join(process.cwd(), '.env');
const env = fs.readFileSync(envPath, 'utf-8');
const uri = env.split('\n').find(l => l.startsWith('MONGODB_URI=')).split('=')[1].trim();

async function updateHeroFields() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('portfolio_db');

  const currentDoc = await db.collection('resume').findOne({ _id: 'resume_config' });
  const existing = currentDoc ? currentDoc.data : {};

  const heroData = {
    ...existing,
    hero_tagline: existing.hero_tagline || 'OPEN TO COLLABORATION & RESEARCH',
    hero_badges: existing.hero_badges || [
      'LangChain',
      'FastAPI',
      'OpenAI API',
      'React.js / Next.js',
      'PyTorch',
      'ChromaDB',
      'OpenCV',
      'Docker'
    ],
    resume_url: existing.resume_url || 'https://drive.google.com/file/d/1GzDOMeZzXpkl95ztqR5CXrPUbD3TYaHb/view',
    profile_image: existing.profile_image || '/images/hetvi.jpg',
    metrics: existing.metrics || {
      cgpa: existing.cgpa || '8.00',
      degree_label: 'CGPA · ' + (existing.degree || 'B.Tech in Information Technology'),
      projects_count: '2+',
      projects_label: 'Production & Research Projects',
      highlight_badge: 'RAG · Agents · Vision'
    },
    core_stack_overview: existing.core_stack_overview || {
      title: 'Core Stack Overview',
      categories: [
        {
          title: 'AI & ML Architecture',
          items: 'PyTorch, TensorFlow, LangChain, LangGraph, scikit-learn'
        },
        {
          title: 'Data & Vector Databases',
          items: 'ChromaDB, Qdrant, FAISS, PostgreSQL, MongoDB'
        },
        {
          title: 'Backend & Infrastructure',
          items: 'Python, FastAPI, Docker, Microservices, REST APIs'
        }
      ],
      link_text: 'Explore Full Stack →',
      link_url: '#stack'
    },
    connect_profiles: existing.connect_profiles || [
      {
        platform: 'github',
        label: 'GitHub Profile ↗',
        url: existing.links?.github || 'https://github.com/Hetvi4728'
      },
      {
        platform: 'linkedin',
        label: 'LinkedIn Profile ↗',
        url: existing.links?.linkedin || 'https://www.linkedin.com/in/patelhetvi4'
      },
      {
        platform: 'leetcode',
        label: 'LeetCode Profile ↗',
        url: existing.links?.leetcode || 'https://leetcode.com/u/hetvi47/'
      }
    ],
    full_stack_sections: existing.full_stack_sections || [
      {
        title: 'AI & ML',
        skills: ['PyTorch', 'TensorFlow', 'LangChain', 'LangGraph', 'scikit-learn', 'XGBoost', 'OpenCV', 'HuggingFace']
      },
      {
        title: 'DATA',
        skills: ['PostgreSQL', 'MongoDB', 'Neo4j graph', 'Qdrant', 'ChromaDB', 'FAISS', 'Pandas / NumPy']
      },
      {
        title: 'BACKEND',
        skills: ['Python', 'FastAPI', 'Flask / Django', 'REST / ORM', 'Microservices', 'JavaScript / TS', 'React / Next.js']
      },
      {
        title: 'INFRA',
        skills: ['Docker', 'Kubernetes', 'AWS', 'Databricks', 'Supabase', 'Git / GitHub', 'Postman / FastMCP']
      }
    ]
  };

  await db.collection('resume').updateOne(
    { _id: 'resume_config' },
    { $set: { data: heroData, updatedAt: new Date() } },
    { upsert: true }
  );

  console.log('✅ Successfully updated resume_config in MongoDB with editable hero and overview fields!');
  await client.close();
}

updateHeroFields().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
