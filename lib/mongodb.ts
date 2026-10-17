import { MongoClient } from 'mongodb';
import dns from 'dns';

// Only configure custom DNS in local environments, NEVER on Vercel/serverless containers
try {
  if (
    !process.env.VERCEL &&
    typeof window === 'undefined' &&
    dns &&
    typeof dns.setServers === 'function'
  ) {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  }
} catch (e) {
  // ignore
}

export function getNormalizedMongoUri(): string {
  let uri = (process.env.MONGODB_URI || '').trim();
  if (!uri) return '';
  // Ensure the database and query parameters are cleanly specified
  if (uri.endsWith('.mongodb.net/')) {
    uri = uri + 'portfolio_db?retryWrites=true&w=majority';
  } else if (uri.endsWith('.mongodb.net')) {
    uri = uri + '/portfolio_db?retryWrites=true&w=majority';
  }
  return uri;
}

const options = {
  maxPoolSize: 10,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 6000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  tls: true,
};

let cachedClient: MongoClient | null = null;
let cachedPromise: Promise<MongoClient> | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  const uri = getNormalizedMongoUri();
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  // In development, preserve client across fast-refresh/hot-module reloads on globalThis
  if (process.env.NODE_ENV === 'development') {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientInstance?: MongoClient;
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (globalWithMongo._mongoClientInstance) {
      return globalWithMongo._mongoClientInstance;
    }

    if (!globalWithMongo._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client
        .connect()
        .then((connectedClient) => {
          globalWithMongo._mongoClientInstance = connectedClient;
          return connectedClient;
        })
        .catch((err) => {
          delete globalWithMongo._mongoClientPromise;
          delete globalWithMongo._mongoClientInstance;
          throw err;
        });
    }

    return globalWithMongo._mongoClientPromise;
  }

  // In production / Vercel serverless
  if (cachedClient) {
    return cachedClient;
  }

  if (!cachedPromise) {
    const client = new MongoClient(uri, options);
    cachedPromise = client
      .connect()
      .then((connectedClient) => {
        cachedClient = connectedClient;
        return connectedClient;
      })
      .catch((err) => {
        cachedPromise = null;
        cachedClient = null;
        throw err;
      });
  }

  return cachedPromise;
}

// Thenable Promise-like wrapper that resolves via getMongoClient()
const clientPromise: Promise<MongoClient> = {
  then(onfulfilled, onrejected) {
    return getMongoClient().then(onfulfilled, onrejected);
  },
  catch(onrejected) {
    return getMongoClient().catch(onrejected);
  },
  finally(onfinally) {
    return getMongoClient().finally(onfinally);
  },
  [Symbol.toStringTag]: 'Promise',
} as Promise<MongoClient>;

export default clientPromise;
