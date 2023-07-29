import "dotenv/config";

export const PORT = process.env.PORT || 5000;

export const MONGO_URI =
  process.env.MONGO_DB || "mongodb://127.0.0.1:27017/pdf";

export const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false, // Don't build indexes
  maxPoolSize: 50, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

export const REDIS_HOST = {
  port: 6379,
  host: process.env.REDIS_HOST || "localhost",
  password: process.env.REDIS_PASSWORD || "",
};
