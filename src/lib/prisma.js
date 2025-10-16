import { PrismaClient } from "@prisma/client";

const Db = new PrismaClient({
  log: ["info", "query", "error", "warn"],
});

export { Db };
