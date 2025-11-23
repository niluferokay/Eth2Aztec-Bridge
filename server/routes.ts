import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import faucet from "./routes/faucet";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register backend API routes
  app.use("/api/faucet", faucet);

  // Create the HTTP server after routes are attached
  const httpServer = createServer(app);

  return httpServer;
}
