import { pgTable, text, timestamp, doublePrecision, integer, varchar } from "drizzle-orm/pg-core";

export const receipts = pgTable("receipts", {
  id: varchar("id", { length: 50 }).primaryKey(),
  merchant: text("merchant").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  date: varchar("date", { length: 20 }).notNull(),
  amount: doublePrecision("amount").notNull(),
  status: varchar("status", { length: 20 }).default("VERIFIED").notNull(),
  itemsCount: integer("items_count").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: text("name").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  merchant: text("merchant").notNull(),
  date: varchar("date", { length: 20 }).notNull(),
  amount: doublePrecision("amount").notNull(),
  currency: varchar("currency", { length: 10 }).default("MYR").notNull(),
  fileSize: varchar("file_size", { length: 20 }).notNull(),
  format: varchar("format", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).default("VERIFIED").notNull(),
  hash: text("hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id", { length: 50 }).primaryKey(),
  timestamp: varchar("timestamp", { length: 50 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  action: text("action").notNull(),
  operator: varchar("operator", { length: 100 }).notNull(),
  ipAddress: varchar("ip_address", { length: 50 }).notNull(),
  hash: text("hash").notNull(),
  status: varchar("status", { length: 20 }).default("VERIFIED").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: varchar("id", { length: 50 }).primaryKey(),
  callSign: varchar("call_sign", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  currency: varchar("currency", { length: 10 }).default("MYR").notNull(),
  autoTaxTag: varchar("auto_tax_tag", { length: 10 }).default("true").notNull(),
  twoFactorAuth: varchar("two_factor_auth", { length: 10 }).default("true").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
