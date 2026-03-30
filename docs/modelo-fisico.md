# Modelo Físico (DER) — Amparo

O modelo físico descreve a implementação exata no PostgreSQL: tipos de dados nativos, constraints, índices e DDL das tabelas.

---

## DDL — Definição das Tabelas

```sql
-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'VICTIM');

CREATE TYPE "AlertEventType" AS ENUM (
  'LOCATION_UPDATE',
  'NOTIFICATION_SENT',
  'STATUS_CHANGE',
  'COMMENT',
  'CREATED'
);

CREATE TYPE "EventSource" AS ENUM ('SYSTEM', 'ADMIN', 'USER');

CREATE TYPE "NotificationCategory" AS ENUM (
  'ALERT', 'SUCCESS', 'WARNING', 'INFO', 'MAINTENANCE'
);

CREATE TYPE "PatrolRouteStatus" AS ENUM (
  'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
);

-- ============================================================
-- TABELAS
-- ============================================================

CREATE TABLE "User" (
  "id"         TEXT         NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "email"      TEXT         NOT NULL,
  "password"   TEXT         NOT NULL,
  "name"       TEXT         NOT NULL,
  "role"       "Role"       NOT NULL DEFAULT 'USER',
  "cpf"        TEXT,                          -- encrypted
  "cpfHash"    TEXT,                          -- sha256, lookup
  "createdAt"  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updatedAt"  TIMESTAMPTZ  NOT NULL,

  CONSTRAINT "User_pkey"       PRIMARY KEY ("id"),
  CONSTRAINT "User_email_key"  UNIQUE ("email"),
  CONSTRAINT "User_cpfHash_key" UNIQUE ("cpfHash")
);

-- ------------------------------------------------------------

CREATE TABLE "Aggressor" (
  "id"       TEXT  NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "name"     TEXT  NOT NULL,
  "cpf"      TEXT  NOT NULL,                  -- encrypted
  "cpfHash"  TEXT  NOT NULL,                  -- sha256, lookup

  CONSTRAINT "Aggressor_pkey"       PRIMARY KEY ("id"),
  CONSTRAINT "Aggressor_cpfHash_key" UNIQUE ("cpfHash")
);

-- ------------------------------------------------------------

CREATE TABLE "Occurrence" (
  "id"           TEXT         NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "description"  TEXT         NOT NULL,
  "latitude"     DOUBLE PRECISION NOT NULL,
  "longitude"    DOUBLE PRECISION NOT NULL,
  "userId"       TEXT         NOT NULL,
  "aggressorId"  TEXT,
  "createdAt"    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMPTZ  NOT NULL,

  CONSTRAINT "Occurrence_pkey"              PRIMARY KEY ("id"),
  CONSTRAINT "Occurrence_userId_fkey"       FOREIGN KEY ("userId")      REFERENCES "User"("id"),
  CONSTRAINT "Occurrence_aggressorId_fkey"  FOREIGN KEY ("aggressorId") REFERENCES "Aggressor"("id")
);

CREATE INDEX "Occurrence_userId_idx"    ON "Occurrence"("userId");
CREATE INDEX "Occurrence_createdAt_idx" ON "Occurrence"("createdAt");

-- ------------------------------------------------------------

CREATE TABLE "EmergencyContact" (
  "id"           TEXT         NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "name"         TEXT         NOT NULL,
  "phone"        TEXT         NOT NULL,        -- encrypted
  "email"        TEXT,                         -- encrypted
  "relationship" TEXT         NOT NULL,
  "priority"     INTEGER      NOT NULL DEFAULT 1,
  "userId"       TEXT         NOT NULL,
  "createdAt"    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMPTZ  NOT NULL,

  CONSTRAINT "EmergencyContact_pkey"        PRIMARY KEY ("id"),
  CONSTRAINT "EmergencyContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "EmergencyContact_userId_idx" ON "EmergencyContact"("userId");

-- ------------------------------------------------------------

CREATE TABLE "EmergencyAlert" (
  "id"                 TEXT         NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "latitude"           DOUBLE PRECISION NOT NULL,
  "longitude"          DOUBLE PRECISION NOT NULL,
  "address"            TEXT,
  "status"             TEXT         NOT NULL DEFAULT 'PENDING',
  "cancellationReason" TEXT,
  "userId"             TEXT,
  "createdAt"          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT "EmergencyAlert_pkey"        PRIMARY KEY ("id"),
  CONSTRAINT "EmergencyAlert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL
);

CREATE INDEX "EmergencyAlert_userId_idx"          ON "EmergencyAlert"("userId");
CREATE INDEX "EmergencyAlert_status_createdAt_idx" ON "EmergencyAlert"("status", "createdAt");

-- ------------------------------------------------------------

CREATE TABLE "NotificationLog" (
  "id"           TEXT         NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "alertId"      TEXT         NOT NULL,
  "contactEmail" TEXT,
  "contactName"  TEXT         NOT NULL,
  "channel"      TEXT         NOT NULL DEFAULT 'EMAIL',
  "status"       TEXT         NOT NULL,
  "errorMessage" TEXT,
  "attempt"      INTEGER      NOT NULL DEFAULT 1,
  "createdAt"    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT "NotificationLog_pkey"         PRIMARY KEY ("id"),
  CONSTRAINT "NotificationLog_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "EmergencyAlert"("id") ON DELETE CASCADE
);

CREATE INDEX "NotificationLog_alertId_createdAt_idx" ON "NotificationLog"("alertId", "createdAt");
CREATE INDEX "NotificationLog_status_idx"            ON "NotificationLog"("status");

-- ------------------------------------------------------------

CREATE TABLE "AlertEvent" (
  "id"        TEXT            NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "alertId"   TEXT            NOT NULL,
  "type"      "AlertEventType" NOT NULL,
  "source"    "EventSource"   NOT NULL DEFAULT 'SYSTEM',
  "message"   TEXT            NOT NULL,
  "metadata"  TEXT,                             -- JSON stringified
  "createdAt" TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  CONSTRAINT "AlertEvent_pkey"         PRIMARY KEY ("id"),
  CONSTRAINT "AlertEvent_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "EmergencyAlert"("id") ON DELETE CASCADE
);

CREATE INDEX "AlertEvent_alertId_createdAt_idx" ON "AlertEvent"("alertId", "createdAt");
CREATE INDEX "AlertEvent_type_idx"              ON "AlertEvent"("type");

-- ------------------------------------------------------------

CREATE TABLE "CheckIn" (
  "id"                  TEXT         NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "startTime"           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "expectedArrivalTime" TIMESTAMPTZ  NOT NULL,
  "actualArrivalTime"   TIMESTAMPTZ,
  "startLatitude"       DOUBLE PRECISION,
  "startLongitude"      DOUBLE PRECISION,
  "finalLatitude"       DOUBLE PRECISION,
  "finalLongitude"      DOUBLE PRECISION,
  "distanceType"        TEXT         NOT NULL,  -- SHORT | MEDIUM | LONG
  "status"              TEXT         NOT NULL DEFAULT 'ACTIVE',
  "userId"              TEXT         NOT NULL,
  "overdueAt"           TIMESTAMPTZ,
  "escalationStage"     INTEGER      NOT NULL DEFAULT 0,
  "createdAt"           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updatedAt"           TIMESTAMPTZ  NOT NULL,

  CONSTRAINT "CheckIn_pkey"        PRIMARY KEY ("id"),
  CONSTRAINT "CheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "CheckIn_userId_status_idx"                    ON "CheckIn"("userId", "status");
CREATE INDEX "CheckIn_status_expectedArrivalTime_idx"       ON "CheckIn"("status", "expectedArrivalTime");
CREATE INDEX "CheckIn_status_escalationStage_overdueAt_idx" ON "CheckIn"("status", "escalationStage", "overdueAt");
CREATE INDEX "CheckIn_userId_createdAt_idx"                 ON "CheckIn"("userId", "createdAt");

-- ------------------------------------------------------------

CREATE TABLE "CheckInSchedule" (
  "id"                 TEXT         NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"             TEXT         NOT NULL,
  "name"               TEXT         NOT NULL,
  "destinationAddress" TEXT,
  "destinationLat"     DOUBLE PRECISION NOT NULL,
  "destinationLng"     DOUBLE PRECISION NOT NULL,
  "expectedArrivalAt"  TIMESTAMPTZ  NOT NULL,
  "windowMinutes"      INTEGER      NOT NULL DEFAULT 15,
  "status"             TEXT         NOT NULL DEFAULT 'PENDING',
  "alertedAt"          TIMESTAMPTZ,
  "arrivedAt"          TIMESTAMPTZ,
  "createdAt"          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updatedAt"          TIMESTAMPTZ  NOT NULL,

  CONSTRAINT "CheckInSchedule_pkey"        PRIMARY KEY ("id"),
  CONSTRAINT "CheckInSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "CheckInSchedule_userId_idx"                    ON "CheckInSchedule"("userId");
CREATE INDEX "CheckInSchedule_status_expectedArrivalAt_idx"  ON "CheckInSchedule"("status", "expectedArrivalAt");

-- ------------------------------------------------------------

CREATE TABLE "SafeLocation" (
  "id"        TEXT         NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "name"      TEXT         NOT NULL,
  "address"   TEXT,
  "latitude"  DOUBLE PRECISION NOT NULL,
  "longitude" DOUBLE PRECISION NOT NULL,
  "radius"    INTEGER      NOT NULL DEFAULT 200,
  "userId"    TEXT         NOT NULL,
  "createdAt" TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ  NOT NULL,

  CONSTRAINT "SafeLocation_pkey"        PRIMARY KEY ("id"),
  CONSTRAINT "SafeLocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "SafeLocation_userId_idx" ON "SafeLocation"("userId");

-- ------------------------------------------------------------

CREATE TABLE "Notification" (
  "id"        TEXT                   NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "title"     TEXT                   NOT NULL,
  "body"      TEXT                   NOT NULL,
  "category"  "NotificationCategory" NOT NULL DEFAULT 'INFO',
  "targetId"  TEXT,
  "read"      BOOLEAN                NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ            NOT NULL DEFAULT NOW(),

  CONSTRAINT "Notification_pkey"          PRIMARY KEY ("id"),
  CONSTRAINT "Notification_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "Notification_targetId_createdAt_idx" ON "Notification"("targetId", "createdAt");
CREATE INDEX "Notification_read_idx"               ON "Notification"("read");
CREATE INDEX "Notification_category_idx"           ON "Notification"("category");

-- ------------------------------------------------------------

CREATE TABLE "Note" (
  "id"           TEXT         NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "title"        TEXT,
  "content"      TEXT         NOT NULL,
  "userId"       TEXT         NOT NULL,
  "occurrenceId" TEXT,
  "createdAt"    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMPTZ  NOT NULL,

  CONSTRAINT "Note_pkey"              PRIMARY KEY ("id"),
  CONSTRAINT "Note_userId_fkey"       FOREIGN KEY ("userId")       REFERENCES "User"("id")       ON DELETE CASCADE,
  CONSTRAINT "Note_occurrenceId_fkey" FOREIGN KEY ("occurrenceId") REFERENCES "Occurrence"("id") ON DELETE SET NULL
);

CREATE INDEX "Note_userId_createdAt_idx" ON "Note"("userId", "createdAt");
CREATE INDEX "Note_occurrenceId_idx"     ON "Note"("occurrenceId");

-- ------------------------------------------------------------

CREATE TABLE "Document" (
  "id"          TEXT         NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "fileName"    TEXT         NOT NULL,
  "contentType" TEXT         NOT NULL,
  "storageKey"  TEXT         NOT NULL,
  "sizeBytes"   INTEGER,
  "userId"      TEXT         NOT NULL,
  "uploadedBy"  TEXT,
  "createdAt"   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ  NOT NULL,

  CONSTRAINT "Document_pkey"            PRIMARY KEY ("id"),
  CONSTRAINT "Document_storageKey_key"  UNIQUE ("storageKey"),
  CONSTRAINT "Document_userId_fkey"     FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "Document_userId_createdAt_idx" ON "Document"("userId", "createdAt");

-- ------------------------------------------------------------

CREATE TABLE "AuditLog" (
  "id"         TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"     TEXT,
  "action"     TEXT        NOT NULL,
  "resource"   TEXT        NOT NULL,
  "resourceId" TEXT,
  "ipAddress"  TEXT,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AuditLog_userId_idx"   ON "AuditLog"("userId");
CREATE INDEX "AuditLog_resource_idx" ON "AuditLog"("resource");

-- ------------------------------------------------------------

CREATE TABLE "HeatMapCell" (
  "id"             TEXT             NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "cellKey"        TEXT             NOT NULL,
  "latitude"       DOUBLE PRECISION NOT NULL,
  "longitude"      DOUBLE PRECISION NOT NULL,
  "intensity"      INTEGER          NOT NULL DEFAULT 1,
  "riskScore"      DOUBLE PRECISION NOT NULL DEFAULT 0,
  "lastOccurrence" TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  "updatedAt"      TIMESTAMPTZ      NOT NULL,

  CONSTRAINT "HeatMapCell_pkey"              PRIMARY KEY ("id"),
  CONSTRAINT "HeatMapCell_cellKey_key"       UNIQUE ("cellKey"),
  CONSTRAINT "HeatMapCell_lat_lng_key"       UNIQUE ("latitude", "longitude")
);

CREATE INDEX "HeatMapCell_intensity_idx"      ON "HeatMapCell"("intensity");
CREATE INDEX "HeatMapCell_riskScore_idx"      ON "HeatMapCell"("riskScore");
CREATE INDEX "HeatMapCell_lastOccurrence_idx" ON "HeatMapCell"("lastOccurrence");

-- ------------------------------------------------------------

CREATE TABLE "PatrolRoute" (
  "id"            TEXT                NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "name"          TEXT                NOT NULL,
  "waypoints"     TEXT                NOT NULL,  -- JSON
  "routeGeometry" TEXT,                          -- JSON via OSRM
  "status"        "PatrolRouteStatus" NOT NULL DEFAULT 'PENDING',
  "assignedTo"    TEXT,
  "generatedBy"   TEXT,
  "scheduledAt"   TIMESTAMPTZ,
  "startedAt"     TIMESTAMPTZ,
  "completedAt"   TIMESTAMPTZ,
  "createdAt"     TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ         NOT NULL,

  CONSTRAINT "PatrolRoute_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PatrolRoute_status_idx"      ON "PatrolRoute"("status");
CREATE INDEX "PatrolRoute_scheduledAt_idx" ON "PatrolRoute"("scheduledAt");

-- ------------------------------------------------------------

CREATE TABLE "PatrolRouteLog" (
  "id"            TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "patrolRouteId" TEXT        NOT NULL,
  "event"         TEXT        NOT NULL,  -- GENERATED | ASSIGNED | STARTED | COMPLETED | CANCELLED | UPDATED
  "performedBy"   TEXT,
  "metadata"      TEXT,                  -- JSON
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT "PatrolRouteLog_pkey"              PRIMARY KEY ("id"),
  CONSTRAINT "PatrolRouteLog_patrolRouteId_fkey" FOREIGN KEY ("patrolRouteId") REFERENCES "PatrolRoute"("id") ON DELETE CASCADE
);

CREATE INDEX "PatrolRouteLog_patrolRouteId_idx" ON "PatrolRouteLog"("patrolRouteId");
CREATE INDEX "PatrolRouteLog_event_idx"         ON "PatrolRouteLog"("event");
```

---

## Resumo de Tabelas e Índices

| Tabela | PKs | UKs | FKs | Índices |
|---|---|---|---|---|
| `User` | 1 | 2 (email, cpfHash) | — | — |
| `Aggressor` | 1 | 1 (cpfHash) | — | — |
| `Occurrence` | 1 | — | 2 (userId, aggressorId) | userId, createdAt |
| `EmergencyContact` | 1 | — | 1 (userId) | userId |
| `EmergencyAlert` | 1 | — | 1 (userId) | userId, (status+createdAt) |
| `NotificationLog` | 1 | — | 1 (alertId) | (alertId+createdAt), status |
| `AlertEvent` | 1 | — | 1 (alertId) | (alertId+createdAt), type |
| `CheckIn` | 1 | — | 1 (userId) | (userId+status), (status+expectedArrival), (status+escalation+overdueAt), (userId+createdAt) |
| `CheckInSchedule` | 1 | — | 1 (userId) | userId, (status+expectedArrivalAt) |
| `SafeLocation` | 1 | — | 1 (userId) | userId |
| `Notification` | 1 | — | 1 (targetId) | (targetId+createdAt), read, category |
| `Note` | 1 | — | 2 (userId, occurrenceId) | (userId+createdAt), occurrenceId |
| `Document` | 1 | 1 (storageKey) | 1 (userId) | (userId+createdAt) |
| `AuditLog` | 1 | — | — | userId, resource |
| `HeatMapCell` | 1 | 2 (cellKey, lat+lng) | — | intensity, riskScore, lastOccurrence |
| `PatrolRoute` | 1 | — | — | status, scheduledAt |
| `PatrolRouteLog` | 1 | — | 1 (patrolRouteId) | patrolRouteId, event |

---

## Observações de Implementação

| Aspecto | Detalhe |
|---|---|
| **UUIDs** | Gerados via `gen_random_uuid()` (pgcrypto) ou pelo Prisma no lado da aplicação |
| **Timestamps** | Tipo `TIMESTAMPTZ` (com fuso horário) para evitar ambiguidade em alertas |
| **Campos JSON** | Armazenados como `TEXT` e parseados na camada de aplicação (Prisma não tem tipo JSON nativo no schema atual) |
| **Criptografia** | Campos sensíveis (CPF, telefone, e-mail) são criptografados na aplicação antes de persistir |
| **Hash de CPF** | `cpfHash` usa SHA-256 para lookup seguro sem descriptografar |
| **Cascade DELETE** | Deleção de usuário cascateia para contatos, alertas, check-ins, notas, documentos, locais seguros e notificações |
| **SET NULL** | Deleção de alerta mantém logs históricos; deleção de ocorrência mantém notas soltas |
| **Storage** | Documentos armazenam apenas metadados; binários ficam no MinIO referenciados por `storageKey` |
