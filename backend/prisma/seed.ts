/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PrismaPg } from "@prisma/adapter-pg";
import {
  Aggressor,
  AlertEventType,
  EventSource,
  PrismaClient,
  Role,
  User,
} from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import * as dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Encryption (mirrors EncryptionService) ───────────────────────────────────
const ENC_KEY = Buffer.from(
  process.env.ENCRYPTION_KEY ??
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  "hex",
);

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENC_KEY, iv);
  let enc = cipher.update(text, "utf8", "hex");
  enc += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${enc}:${tag}`;
}

function hashValue(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

// ─── Admin ────────────────────────────────────────────────────────────────────
const DEFAULT_ADMIN_EMAIL = "admin@amparo.local";
const DEFAULT_ADMIN_PASSWORD = "Admin@123";
const DEFAULT_ADMIN_NAME = "Administrador";

function getSeedAdminConfig() {
  return {
    email: process.env.SEED_ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD,
    name: process.env.SEED_ADMIN_NAME ?? DEFAULT_ADMIN_NAME,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const adminConfig = getSeedAdminConfig();

  // ── Admin ──
  await prisma.user.upsert({
    where: { email: adminConfig.email },
    update: { name: adminConfig.name, role: Role.ADMIN },
    create: {
      email: adminConfig.email,
      name: adminConfig.name,
      password: await bcrypt.hash(adminConfig.password, 10),
      role: Role.ADMIN,
    },
  });

  // ── Vítimas ──
  const victimsCpfs = [
    { cpf: "123.456.789-01", raw: "12345678901" },
    { cpf: "987.654.321-00", raw: "98765432100" },
    { cpf: "321.654.987-55", raw: "32165498755" },
  ];

  const victimData = [
    {
      email: "victim@gmail.com",
      name: "Maria da Silva",
      ...victimsCpfs[0],
    },
    {
      email: "ana.beatriz@gmail.com",
      name: "Ana Beatriz Santos",
      ...victimsCpfs[1],
    },
    {
      email: "juliana.ferreira@gmail.com",
      name: "Juliana Ferreira",
      ...victimsCpfs[2],
    },
  ];

  const victims: User[] = [];
  for (const v of victimData) {
    const victim = await prisma.user.upsert({
      where: { email: v.email },
      update: { name: v.name, role: Role.VICTIM },
      create: {
        email: v.email,
        name: v.name,
        password: bcrypt.hashSync("victim123", 10),
        role: Role.VICTIM,
        cpf: encrypt(v.cpf),
        cpfHash: hashValue(v.raw),
      },
    });
    victims.push(victim);
  }

  const [maria, ana, juliana] = victims;

  // ── Contatos de emergência ──
  const existingContacts = await prisma.emergencyContact.count({
    where: { userId: maria.id },
  });

  if (existingContacts === 0) {
    await prisma.emergencyContact.createMany({
      data: [
        {
          userId: maria.id,
          name: "Josefa da Silva",
          phone: encrypt("+55 83 98765-4321"),
          email: encrypt("josefa.silva@gmail.com"),
          relationship: "Mãe",
          priority: 1,
        },
        {
          userId: maria.id,
          name: "Patricia da Silva",
          phone: encrypt("+55 83 99876-5432"),
          relationship: "Irmã",
          priority: 2,
        },
        {
          userId: ana.id,
          name: "Carlos Santos",
          phone: encrypt("+55 83 97654-3210"),
          relationship: "Pai",
          priority: 1,
        },
        {
          userId: juliana.id,
          name: "Fernanda Ferreira",
          phone: encrypt("+55 83 96543-2109"),
          relationship: "Amiga",
          priority: 1,
        },
      ],
    });
  }

  // ── Agressores ──
  const aggressorData = [
    {
      name: "Roberto Carlos Lima",
      cpf: "111.222.333-44",
      raw: "11122233344",
    },
    {
      name: "José Antônio Pereira",
      cpf: "555.666.777-88",
      raw: "55566677788",
    },
    {
      name: "Paulo Henrique Souza",
      cpf: "222.333.444-55",
      raw: "22233344455",
    },
  ];

  const aggressors: Aggressor[] = [];
  for (const a of aggressorData) {
    const aggressor = await prisma.aggressor.upsert({
      where: { cpfHash: hashValue(a.raw) },
      update: { name: a.name },
      create: {
        name: a.name,
        cpf: encrypt(a.cpf),
        cpfHash: hashValue(a.raw),
      },
    });
    aggressors.push(aggressor);
  }

  const [roberto, jose, paulo] = aggressors;

  // ── Ocorrências ──
  const existingOccurrences = await prisma.occurrence.count({
    where: { userId: maria.id },
  });

  if (existingOccurrences === 0) {
    const occurrencesData = [
      // Maria
      {
        description:
          "Agressão verbal e ameaças pelo companheiro em via pública perto da praça principal.",
        latitude: -8.334,
        longitude: -36.425,
        userId: maria.id,
        aggressorId: roberto.id,
      },
      {
        description:
          "Perseguição por ex-namorado no supermercado no bairro Cohab.",
        latitude: -8.3285,
        longitude: -36.418,
        userId: maria.id,
        aggressorId: roberto.id,
      },
      {
        description: "Violação de medida protetiva próximo à rodoviária.",
        latitude: -8.3365,
        longitude: -36.431,
        userId: maria.id,
        aggressorId: roberto.id,
      },
      {
        description:
          "Assédio moral e tentativa de agressão na rua Gêmeniano Maciel.",
        latitude: -8.3323,
        longitude: -36.4215,
        userId: maria.id,
        aggressorId: undefined,
      },
      {
        description:
          "Violência doméstica grave relatada pelos vizinhos no bairro São Pedro.",
        latitude: -8.341,
        longitude: -36.419,
        userId: maria.id,
        aggressorId: roberto.id,
      },
      {
        description:
          "Importunação sexual e assédio no transporte público no centro.",
        latitude: -8.333,
        longitude: -36.426,
        userId: maria.id,
        aggressorId: undefined,
      },
      {
        description:
          "Dano ao patrimônio (carro riscado e pneus furados pelo ex-cônjuge).",
        latitude: -8.325,
        longitude: -36.435,
        userId: maria.id,
        aggressorId: jose.id,
      },
      {
        description:
          "Ameaça com arma de fogo pelo atual companheiro próximo à agência bancária.",
        latitude: -8.3315,
        longitude: -36.422,
        userId: maria.id,
        aggressorId: roberto.id,
      },
      {
        description:
          "Violência psicológica e constrangimento público perto do mercado municipal.",
        latitude: -8.3355,
        longitude: -36.4245,
        userId: maria.id,
        aggressorId: undefined,
      },
      {
        description:
          "Agressão física seguida de roubo do celular no estacionamento do parque.",
        latitude: -8.329,
        longitude: -36.427,
        userId: maria.id,
        aggressorId: jose.id,
      },
      {
        description:
          "Agressão física por ex-companheiro no bairro Bom Conselho.",
        latitude: -8.338,
        longitude: -36.415,
        userId: maria.id,
        aggressorId: roberto.id,
      },
      {
        description:
          "Invasão de domicílio pelo ex-marido no bairro Santo Antônio.",
        latitude: -8.342,
        longitude: -36.429,
        userId: maria.id,
        aggressorId: roberto.id,
      },
      {
        description:
          "Assédio sexual cometido por desconhecido em praça pública no bairro Maria Cristina.",
        latitude: -8.326,
        longitude: -36.416,
        userId: maria.id,
        aggressorId: undefined,
      },
      {
        description:
          "Cárcere privado e tentativa de feminicídio próximo à BR-232.",
        latitude: -8.322,
        longitude: -36.438,
        userId: maria.id,
        aggressorId: roberto.id,
      },
      // Ana Beatriz
      {
        description:
          "Stalking e importunação sistemática pelo ex-namorado nas proximidades do trabalho.",
        latitude: -8.3301,
        longitude: -36.4198,
        userId: ana.id,
        aggressorId: jose.id,
      },
      {
        description:
          "Ameaças por mensagem de texto com fotos do local de trabalho da vítima.",
        latitude: -8.3312,
        longitude: -36.4231,
        userId: ana.id,
        aggressorId: jose.id,
      },
      {
        description:
          "Violência patrimonial — destruição de pertences pessoais.",
        latitude: -8.3278,
        longitude: -36.4267,
        userId: ana.id,
        aggressorId: jose.id,
      },
      // Juliana
      {
        description:
          "Agressão física durante discussão no condomínio residencial.",
        latitude: -8.3389,
        longitude: -36.4142,
        userId: juliana.id,
        aggressorId: paulo.id,
      },
      {
        description:
          "Violação de medida protetiva de urgência — companheiro se aproximou a menos de 50 metros.",
        latitude: -8.3345,
        longitude: -36.4189,
        userId: juliana.id,
        aggressorId: paulo.id,
      },
    ];

    for (const data of occurrencesData) {
      await prisma.occurrence.create({ data });
    }
  }

  // ── Alertas de emergência ──
  const existingAlerts = await prisma.emergencyAlert.count();

  if (existingAlerts === 0) {
    // Alerta 1 — ACTIVE (Maria, agora)
    const alertActive = await prisma.emergencyAlert.create({
      data: {
        latitude: -8.3323,
        longitude: -36.4215,
        address: "Rua Gêmeniano Maciel, 245 — Campina Grande, PB",
        status: "ACTIVE",
        userId: maria.id,
      },
    });

    await prisma.alertEvent.createMany({
      data: [
        {
          alertId: alertActive.id,
          type: AlertEventType.CREATED,
          source: EventSource.USER,
          message: "Alerta de emergência ativado pela usuária via app.",
        },
        {
          alertId: alertActive.id,
          type: AlertEventType.NOTIFICATION_SENT,
          source: EventSource.SYSTEM,
          message:
            "Notificação enviada para contatos de emergência: Josefa da Silva, Patricia da Silva.",
        },
        {
          alertId: alertActive.id,
          type: AlertEventType.LOCATION_UPDATE,
          source: EventSource.SYSTEM,
          message: "Localização atualizada via GPS do dispositivo.",
          metadata: JSON.stringify({ latitude: -8.3323, longitude: -36.4215 }),
        },
        {
          alertId: alertActive.id,
          type: AlertEventType.STATUS_CHANGE,
          source: EventSource.SYSTEM,
          message: "Status alterado de PENDING para ACTIVE.",
        },
      ],
    });

    // Alerta 2 — RESOLVED (Ana Beatriz)
    const alertResolved = await prisma.emergencyAlert.create({
      data: {
        latitude: -8.3301,
        longitude: -36.4198,
        address: "Av. Floriano Peixoto, 890 — Campina Grande, PB",
        status: "RESOLVED",
        userId: ana.id,
      },
    });

    await prisma.alertEvent.createMany({
      data: [
        {
          alertId: alertResolved.id,
          type: AlertEventType.CREATED,
          source: EventSource.USER,
          message: "Alerta ativado pela usuária.",
        },
        {
          alertId: alertResolved.id,
          type: AlertEventType.NOTIFICATION_SENT,
          source: EventSource.SYSTEM,
          message: "Notificação enviada para Carlos Santos.",
        },
        {
          alertId: alertResolved.id,
          type: AlertEventType.COMMENT,
          source: EventSource.ADMIN,
          message:
            "Viatura 07 despachada para o endereço. Vítima em segurança.",
        },
        {
          alertId: alertResolved.id,
          type: AlertEventType.STATUS_CHANGE,
          source: EventSource.ADMIN,
          message: "Ocorrência encerrada pelo operador após confirmação.",
        },
      ],
    });

    // Alerta 3 — RESOLVED (Juliana, mais antigo)
    const alertOld = await prisma.emergencyAlert.create({
      data: {
        latitude: -8.3389,
        longitude: -36.4142,
        address: "Rua das Flores, 12 — Campina Grande, PB",
        status: "RESOLVED",
        userId: juliana.id,
      },
    });

    await prisma.alertEvent.createMany({
      data: [
        {
          alertId: alertOld.id,
          type: AlertEventType.CREATED,
          source: EventSource.USER,
          message: "Alerta ativado.",
        },
        {
          alertId: alertOld.id,
          type: AlertEventType.STATUS_CHANGE,
          source: EventSource.ADMIN,
          message: "Encerrado após atendimento presencial.",
        },
      ],
    });
  }

  // ── Check-ins ──
  const existingCheckIns = await prisma.checkIn.count();

  if (existingCheckIns === 0) {
    const now = new Date();

    // Check-in LATE — Maria, prazo vencido há 15 min
    await prisma.checkIn.create({
      data: {
        userId: maria.id,
        distanceType: "SHORT",
        status: "LATE",
        startLatitude: -8.334,
        startLongitude: -36.425,
        expectedArrivalTime: new Date(now.getTime() - 15 * 60_000),
        startTime: new Date(now.getTime() - 25 * 60_000),
      },
    });

    // Check-in ACTIVE — Ana, ainda dentro do prazo
    await prisma.checkIn.create({
      data: {
        userId: ana.id,
        distanceType: "MEDIUM",
        status: "ACTIVE",
        startLatitude: -8.3301,
        startLongitude: -36.4198,
        expectedArrivalTime: new Date(now.getTime() + 20 * 60_000),
        startTime: new Date(now.getTime() - 10 * 60_000),
      },
    });

    // Check-in ON_TIME — Juliana, chegou no prazo
    await prisma.checkIn.create({
      data: {
        userId: juliana.id,
        distanceType: "LONG",
        status: "ON_TIME",
        startLatitude: -8.3389,
        startLongitude: -36.4142,
        finalLatitude: -8.329,
        finalLongitude: -36.427,
        expectedArrivalTime: new Date(now.getTime() - 60 * 60_000),
        actualArrivalTime: new Date(now.getTime() - 65 * 60_000),
        startTime: new Date(now.getTime() - 120 * 60_000),
      },
    });
  }

  // ── Relatório ──
  // eslint-disable-next-line no-console
  console.log("\n✅ Seed concluído\n");
  // eslint-disable-next-line no-console
  console.table([
    {
      entidade: "Admin",
      email: adminConfig.email,
      senha: adminConfig.password,
    },
    { entidade: "Vítima 1", email: "victim@gmail.com", senha: "victim123" },
    {
      entidade: "Vítima 2",
      email: "ana.beatriz@gmail.com",
      senha: "victim123",
    },
    {
      entidade: "Vítima 3",
      email: "juliana.ferreira@gmail.com",
      senha: "victim123",
    },
  ]);
  // eslint-disable-next-line no-console
  console.log(`\nAgressores: ${aggressorData.map((a) => a.name).join(", ")}`);
  // eslint-disable-next-line no-console
  console.log(`Alertas: 1 ACTIVE · 2 RESOLVED`);
  // eslint-disable-next-line no-console
  console.log(`Check-ins: 1 LATE · 1 ACTIVE · 1 ON_TIME\n`);
}

void main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();

    await (pool as { end: () => Promise<void> }).end();
  });
