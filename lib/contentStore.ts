import fs from 'fs/promises';
import path from 'path';
import clientPromise from './mongodb';
import { explorations as defaultExplorations } from '@/data/explorations';

const getDataFilePath = (fileName: string) => path.join(process.cwd(), 'data', fileName);

export const defaultResumeFallback: Record<string, any> = {
  name: "Hetvi Patel",
  title: "IT Student",
  email: "hetvipatel4728@gmail.com",
  phone: "+91 7990992726",
  location: "Anand, Gujarat, India",
  cgpa: "8.00",
  degree: "B.Tech in Information Technology",
  institution: "G.H. Patel College of Engineering and Technology",
  graduation_year: "June 2025 - May 2029",
  summary: "Aspiring IT student with a strong foundation in programming, web development, and AI/ML technologies. Seeking opportunities to apply my skills in real-world projects and contribute to the tech community.",
  hero_tagline: "OPEN TO COLLABORATION & RESEARCH",
  hero_badges: [
    "LangChain",
    "FastAPI",
    "OpenAI API",
    "React.js / Next.js",
    "PyTorch",
    "ChromaDB",
    "OpenCV",
    "Docker"
  ],
  resume_url: "https://drive.google.com/file/d/1GzDOMeZzXpkl95ztqR5CXrPUbD3TYaHb/view",
  profile_image: "/images/hetvi.jpg",
  metrics: {
    cgpa: "8.00",
    degree_label: "CGPA · B.Tech in Information Technology",
    projects_count: "2+",
    projects_label: "Production & Research Projects",
    highlight_badge: "RAG · Agents · Vision"
  },
  core_stack_overview: {
    title: "Core Stack Overview",
    categories: [
      {
        title: "AI & ML Architecture",
        items: "PyTorch, TensorFlow, LangChain, LangGraph, scikit-learn"
      },
      {
        title: "Data & Vector Databases",
        items: "ChromaDB, Qdrant, FAISS, PostgreSQL, MongoDB"
      },
      {
        title: "Backend & Infrastructure",
        items: "Python, FastAPI, Docker, Microservices, REST APIs"
      }
    ],
    link_text: "Explore Full Stack →",
    link_url: "#stack"
  },
  connect_profiles: [
    {
      platform: "github",
      label: "GitHub Profile ↗",
      url: "https://github.com/Hetvi4728"
    },
    {
      platform: "linkedin",
      label: "LinkedIn Profile ↗",
      url: "https://www.linkedin.com/in/patelhetvi4"
    },
    {
      platform: "leetcode",
      label: "LeetCode Profile ↗",
      url: "https://leetcode.com/u/hetvi47/"
    }
  ],
  full_stack_sections: [
    {
      title: "AI & ML",
      skills: ["PyTorch", "TensorFlow", "LangChain", "LangGraph", "scikit-learn", "XGBoost", "OpenCV", "HuggingFace"]
    },
    {
      title: "DATA",
      skills: ["PostgreSQL", "MongoDB", "Neo4j graph", "Qdrant", "ChromaDB", "FAISS", "Pandas / NumPy"]
    },
    {
      title: "BACKEND",
      skills: ["Python", "FastAPI", "Flask / Django", "REST / ORM", "Microservices", "JavaScript / TS", "React / Next.js"]
    },
    {
      title: "INFRA",
      skills: ["Docker", "Kubernetes", "AWS", "Databricks", "Supabase", "Git / GitHub", "Postman / FastMCP"]
    }
  ],
  links: {
    github: "https://github.com/Hetvi4728",
    linkedin: "https://www.linkedin.com/in/patelhetvi4",
    leetcode: "https://leetcode.com/u/hetvi47/",
    GeeksforGeeks: "https://www.geeksforgeeks.org/profile/hetvi47",
    instagram: "https://www.instagram.com/codebyhetvi47/",
    medium: ""
  },
  work_experience: [],
  technical_skills: {
    programming_languages: ["C", "C++", "HTML", "CSS", "JavaScript", "Python"],
    frameworks: [],
    ai_ml_libraries: []
  },
  featured_projects: [
    {
      title: "HerMediSafe",
      description: "HerMediSafe is an AI-powered healthcare platform designed to improve medication safety for pregnant and breastfeeding women."
    }
  ]
};

// Generic loader for any collection
async function loadCollectionData<T>(
  collectionName: string,
  configId: string,
  jsonFileName?: string,
  defaultFallback?: T
): Promise<T> {
  // 1. Live MongoDB Database
  if (process.env.MONGODB_URI && clientPromise) {
    try {
      const client = await clientPromise;
      const dbName = process.env.MONGODB_DB || 'portfolio_db';
      const db = client.db(dbName);
      const doc = await db.collection(collectionName).findOne({ _id: configId as any });

      if (doc && doc.data) {
        return doc.data as T;
      }
    } catch (err) {
      console.warn(`MongoDB read error for ${collectionName}:`, err);
    }
  }

  // 2. Fallback to provided default
  if (defaultFallback !== undefined) return defaultFallback;

  // 3. Fallback to local data/*.json if exists
  if (jsonFileName) {
    try {
      const filePath = getDataFilePath(jsonFileName);
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content) as T;
    } catch (err) {
      // Local JSON file was removed; data is maintained in MongoDB
    }
  }

  return ([] as unknown) as T;
}

// Generic saver for any collection
async function saveCollectionData<T>(
  collectionName: string,
  configId: string,
  jsonFileName: string | null,
  newData: T
): Promise<{ success: boolean; provider: string }> {
  let activeProvider = 'memory';

  // 1. Live MongoDB Database
  if (process.env.MONGODB_URI && clientPromise) {
    try {
      const client = await clientPromise;
      const dbName = process.env.MONGODB_DB || 'portfolio_db';
      const db = client.db(dbName);
      await db.collection(collectionName).updateOne(
        { _id: configId as any },
        { $set: { data: newData, updatedAt: new Date() } },
        { upsert: true }
      );
      return { success: true, provider: 'Live MongoDB Database' };
    } catch (err) {
      console.warn(`MongoDB save error for ${collectionName}:`, err);
    }
  }

  // 2. Local File Save fallback if file path provided
  if (jsonFileName) {
    try {
      const filePath = getDataFilePath(jsonFileName);
      await fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf-8');
      activeProvider = 'Local File';
    } catch (err) {
      // Skip local file write
    }
  }

  return { success: true, provider: activeProvider };
}

// --- ART ---
export async function getArtData() {
  return loadCollectionData<any[]>('art', 'art_config', 'art.json', []);
}
export async function saveArtData(data: any[]) {
  return saveCollectionData<any[]>('art', 'art_config', null, data);
}

// --- BLOG ---
export async function getBlogData() {
  return loadCollectionData<any[]>('blogs', 'blog_config', 'blog.json', []);
}
export async function saveBlogData(data: any[]) {
  return saveCollectionData<any[]>('blogs', 'blog_config', null, data);
}

// --- PROJECTS ---
export async function getProjectsData() {
  return loadCollectionData<any[]>('projects', 'projects_config', 'projects.json', []);
}
export async function saveProjectsData(data: any[]) {
  return saveCollectionData<any[]>('projects', 'projects_config', null, data);
}

// --- RESUME ---
export async function getResumeData() {
  return loadCollectionData<Record<string, any>>('resume', 'resume_config', 'resume.json', defaultResumeFallback);
}
export async function saveResumeData(data: Record<string, any>) {
  return saveCollectionData<Record<string, any>>('resume', 'resume_config', null, data);
}

// --- EXPLORATIONS / EXPLORE PAGE ---
export async function getExplorationsData() {
  return loadCollectionData<any[]>('explorations', 'explorations_config', 'explorations.json', defaultExplorations);
}
export async function saveExplorationsData(data: any[]) {
  return saveCollectionData<any[]>('explorations', 'explorations_config', null, data);
}
