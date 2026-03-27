-- CreateTable: PatrolRoute (AM-74 — Rotas Inteligentes de Patrulha)
CREATE TABLE "PatrolRoute" (
    "id"        TEXT NOT NULL,
    "name"      TEXT NOT NULL DEFAULT 'Rota de patrulha',
    "startLat"  DOUBLE PRECISION NOT NULL,
    "startLng"  DOUBLE PRECISION NOT NULL,
    "radiusKm"  DOUBLE PRECISION NOT NULL DEFAULT 5,
    "waypoints" JSONB NOT NULL,
    "totalRisk" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatrolRoute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PatrolRoute_createdAt_idx" ON "PatrolRoute"("createdAt");
