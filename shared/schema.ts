import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Faucet request schema
export const faucetRequests = pgTable("faucet_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  address: text("address").notNull(),
  amount: text("amount").notNull(),
  txHash: text("tx_hash"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertFaucetRequestSchema = createInsertSchema(faucetRequests).omit({
  id: true,
  timestamp: true,
});

export type InsertFaucetRequest = z.infer<typeof insertFaucetRequestSchema>;
export type FaucetRequest = typeof faucetRequests.$inferSelect;
