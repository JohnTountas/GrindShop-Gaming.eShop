/**
 * Loads, validates, and exposes environment variables used by the backend.
 */
import dotenv from "dotenv";

dotenv.config();

// Exposes normalized environment configuration for the backend runtime.
export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DIRECT_URL || process.env.DATABASE_URL || "",

  jwt: {
    secret: process.env.JWT_SECRET || "grindspot-dev-access-token-secret",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "grindspot-dev-refresh-token-secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10),
    uploadDir: process.env.UPLOAD_DIR || "uploads",
  },
};
