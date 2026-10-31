import "dotenv/config";

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting database seed...");

  // ==========================================
  // CATEGORIES
  // ==========================================

  console.log("Creating categories...");

  const tshirts = await prisma.category.upsert({
    where: {
      slug: "t-shirts",
    },

    update: {},

    create: {
      name: "T-Shirts",
      slug: "t-shirts",
      description:
        "Premium everyday T-shirts",
      isActive: true,
    },
  });

  const perfumes = await prisma.category.upsert({
    where: {
      slug: "perfumes",
    },

    update: {},

    create: {
      name: "Perfumes",
      slug: "perfumes",
      description:
        "Signature fragrances",
      isActive: true,
    },
  });

  console.log("✓ Categories created");

  // ==========================================
  // SIZES
  // ==========================================

  console.log("Creating sizes...");

  const sizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
  ];

  for (const name of sizes) {
    await prisma.size.upsert({
      where: {
        name,
      },

      update: {},

      create: {
        name,
      },
    });
  }

  console.log("✓ Sizes created");

  // ==========================================
  // VOLUMES
  // ==========================================

  console.log("Creating volumes...");

  const volumes = [
    "10 ML",
    "30 ML",
    "50 ML",
    "100 ML",
  ];

  for (const name of volumes) {
    await prisma.volume.upsert({
      where: {
        name,
      },

      update: {},

      create: {
        name,
      },
    });
  }

  console.log("✓ Volumes created");

  // ==========================================
  // SEED SUMMARY
  // ==========================================

  console.log("");
  console.log(
    "================================="
  );
  console.log("🌱 SEED COMPLETED");
  console.log(
    "================================="
  );
  console.log("");

  console.log("Categories:");

  console.log(
    `- ${tshirts.name}`
  );

  console.log(
    `- ${perfumes.name}`
  );

  console.log("");

  console.log("Sizes:");

  for (const size of sizes) {
    console.log(`- ${size}`);
  }

  console.log("");

  console.log("Volumes:");

  for (const volume of volumes) {
    console.log(`- ${volume}`);
  }

  console.log("");

  console.log(
    "Products are created from the Admin Panel."
  );

  console.log("");
}

main()
  .catch((error) => {
    console.error(
      "❌ Seed failed:"
    );

    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });