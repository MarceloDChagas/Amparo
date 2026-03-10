/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = "admin@gmail.com";
  const adminPassword = "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
    },
    create: {
      email: adminEmail,
      name: "Admin",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const victimEmail = "victim@gmail.com";
  const victimPassword = "victim123";
  const victimHashedPassword = await bcrypt.hash(victimPassword, 10);

  const victim = await prisma.user.upsert({
    where: { email: victimEmail },
    update: {
      role: Role.VICTIM,
    },
    create: {
      email: victimEmail,
      name: "Maria da Silva",
      password: victimHashedPassword,
      role: Role.VICTIM,
    },
  });

  const occurrencesData = [
    {
      description:
        "Agressão verbal e ameaças pelo companheiro em via pública perto da praça principal.",
      latitude: -8.334,
      longitude: -36.425,
      userId: victim.id,
    },
    {
      description:
        "Perseguição por ex-namorado no supermercado no bairro Cohab.",
      latitude: -8.3285,
      longitude: -36.418,
      userId: victim.id,
    },
    {
      description: "Violação de medida protetiva próximo à rodoviária.",
      latitude: -8.3365,
      longitude: -36.431,
      userId: victim.id,
    },
    {
      description:
        "Assédio moral e tentativa de agressão na rua Gêmeniano Maciel.",
      latitude: -8.3323,
      longitude: -36.4215,
      userId: victim.id,
    },
    {
      description:
        "Violência doméstica grave relatada pelos vizinhos no bairro São Pedro.",
      latitude: -8.341,
      longitude: -36.419,
      userId: victim.id,
    },
    {
      description:
        "Importunação sexual e assédio no transporte público no centro.",
      latitude: -8.333,
      longitude: -36.426,
      userId: victim.id,
    },
    {
      description:
        "Dano ao patrimônio (carro riscado e pneus furados pelo ex-cônjuge) próximo à faculdade.",
      latitude: -8.325,
      longitude: -36.435,
      userId: victim.id,
    },
    {
      description:
        "Ameaça com arma de fogo pelo atual companheiro próximo à agência bancária.",
      latitude: -8.3315,
      longitude: -36.422,
      userId: victim.id,
    },
    {
      description:
        "Violência psicológica e constrangimento público perto do mercado municipal.",
      latitude: -8.3355,
      longitude: -36.4245,
      userId: victim.id,
    },
    {
      description:
        "Agressão física seguida de roubo do celular para checar mensagens no estacionamento do parque.",
      latitude: -8.329,
      longitude: -36.427,
      userId: victim.id,
    },
    {
      description:
        "Agressão física cometida por ex-companheiro que não aceita o fim do relacionamento em um bar no bairro Bom Conselho.",
      latitude: -8.338,
      longitude: -36.415,
      userId: victim.id,
    },
    {
      description:
        "Invasão de domicílio pelo ex-marido à procura da vítima no bairro Santo Antônio.",
      latitude: -8.342,
      longitude: -36.429,
      userId: victim.id,
    },
    {
      description:
        "Assédio sexual cometido por desconhecido em praça pública no bairro Maria Cristina.",
      latitude: -8.326,
      longitude: -36.416,
      userId: victim.id,
    },
    {
      description:
        "Cárcere privado e tentativa de feminicídio próximo à BR-232.",
      latitude: -8.322,
      longitude: -36.438,
      userId: victim.id,
    },
  ];

  for (const data of occurrencesData) {
    await prisma.occurrence.create({
      data,
    });
  }

  // eslint-disable-next-line no-console
  console.log({ admin, victim, occurrencesCount: occurrencesData.length });
}

void main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
