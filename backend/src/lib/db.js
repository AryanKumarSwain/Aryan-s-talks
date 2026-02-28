import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not defined in .env");
    process.exit(1);
  }

  const tryConnect = async (connectionUri) => {
    const conn = await mongoose.connect(connectionUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  };

  try {
    await tryConnect(uri);
  } catch (error) {
    const isSrvRefused =
      error.message?.includes("querySrv ECONNREFUSED") ||
      error.message?.includes("getaddrinfo ENOTFOUND");
    const fallbackUri = process.env.MONGODB_URI_STANDARD;

    if (isSrvRefused && fallbackUri) {
      console.warn("SRV lookup failed, trying standard connection string...");
      try {
        await tryConnect(fallbackUri);
      } catch (fallbackError) {
        console.error("MongoDB connection error (fallback):", fallbackError.message);
        process.exit(1);
      }
    } else {
      console.error("MongoDB connection error:", error.message);
      process.exit(1);
    }
  }
};