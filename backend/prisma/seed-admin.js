const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const email = process.env.SEED_ADMIN_EMAIL || "admin@amparo.local";
    const password = process.env.SEED_ADMIN_PASSWORD || "Admin@123";
    const name = process.env.SEED_ADMIN_NAME || "Administrador";
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.upsert({
      where: { email },
      update: { name, role: Role.ADMIN },
      create: {
        email,
        name,
        password: passwordHash,
        role: Role.ADMIN,
      },
    });

    console.log(`[bootstrap] Admin user ready: ${email}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("[bootstrap] Failed to seed admin user", error);
  process.exit(1);
});
