import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgres://jejaku:jejaku_password@localhost:5432/jejaku_db";

const client = postgres(connectionString, { max: 10 });
export const db = drizzle(client, { schema });
