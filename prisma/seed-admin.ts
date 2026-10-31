import "dotenv/config";

import { hash } from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = "admin@pizztol.com";
  const password = "ChangeMe123!";

  const passwordHash = await hash(password, 12);

  const admin = await prisma.user.upsert({
    where: {
      email,
    },

    update: {
      passwordHash,
      role: "ADMIN",
    },

    create: {
      name: "Pizztol Admin",
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Admin created:");
  console.log("Email:", admin.email);
  console.log("Password:", password);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });