// =============================================================================
// KISWA - MongoDB Atlas Connection Singleton (with Hot-Reload Caching)
// =============================================================================
// Uses the official MongoDB Node.js driver with a global connection cache
// to prevent connection leaks during local development hot-reloads.
// =============================================================================

import { MongoClient, Db } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || ''
const DB_NAME = process.env.MONGODB_DB || 'kiswa'

if (!MONGODB_URI) {
  console.warn(
    '⚠️ MONGODB_URI is not set in environment variables. Database features will not work.'
  )
}

interface MongoConnection {
  client: MongoClient
  db: Db
}

// Cache the connection in global scope to survive Next.js dev server hot-reloads
let globalWithMongo = global as typeof globalThis & {
  _mongoConnectionPromise?: Promise<MongoConnection>
  _mongoConnection?: MongoConnection
}

/**
 * Connect to MongoDB Atlas and return a cached client + db instance.
 */
export async function connectToDatabase(): Promise<MongoConnection> {
  if (globalWithMongo._mongoConnection) {
    return globalWithMongo._mongoConnection
  }

  if (!globalWithMongo._mongoConnectionPromise) {
    if (!MONGODB_URI) {
      throw new Error(
        'MONGODB_URI is not defined. Please add it to your .env.local file.'
      )
    }

    // Set pool sizes to prevent running out of sockets
    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      connectTimeoutMS: 10000,
    })

    globalWithMongo._mongoConnectionPromise = client.connect().then((clientInstance) => {
      const db = clientInstance.db(DB_NAME)
      const conn = { client: clientInstance, db }
      globalWithMongo._mongoConnection = conn
      return conn
    })
  }

  try {
    const conn = await globalWithMongo._mongoConnectionPromise
    return conn
  } catch (e) {
    // Reset promise cache so subsequent requests can try to reconnect
    globalWithMongo._mongoConnectionPromise = undefined
    throw e
  }
}

/**
 * Get a specific collection from the database.
 * Usage: const orders = await getCollection('orders')
 */
export async function getCollection(name: string) {
  const { db } = await connectToDatabase()
  return db.collection(name)
}
