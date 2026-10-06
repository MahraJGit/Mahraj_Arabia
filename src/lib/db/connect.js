import mongoose from "mongoose";

const uri = process.env.DATABASE_URI;

const globalForMongoose = globalThis;

const cache = globalForMongoose.__mahrajMongoose ?? {
  conn: null,
  promise: null,
};

globalForMongoose.__mahrajMongoose = cache;

/**
 * Dedicated Mongoose connection for the custom CMS and public reads.
 * Do not use the default mongoose connection.
 */
export async function connectDb() {
  if (!uri) {
    throw new Error("DATABASE_URI is not set.");
  }

  if (cache.conn && cache.conn.readyState === 1) {
    return cache.conn;
  }

  if (!cache.promise) {
    const connection = mongoose.createConnection(uri, {
      bufferCommands: false,
    });
    cache.promise = connection.asPromise();
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
