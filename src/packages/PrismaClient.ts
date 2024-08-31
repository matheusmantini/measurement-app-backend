import { PrismaClient } from "@prisma/client";
import fs from "fs";

const readSecret = (filePath: string): string => {
  try {
    return fs.readFileSync(filePath, "utf8").trim();
  } catch (error) {
    throw new Error(`Failed to read secret from ${filePath}: ${error}`);
  }
};

const dbUsername: string = readSecret("/run/secrets/db_username");
const dbPassword: string = readSecret("/run/secrets/db_password");
const dbName: string = readSecret("/run/secrets/db_dbname");

const DATABASE_URL: string = `postgres://${dbUsername}:${dbPassword}@postgres:5432/${dbName}`;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

export { prisma };
