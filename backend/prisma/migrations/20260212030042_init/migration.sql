-- CreateTable
CREATE TABLE "Victim" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Victim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aggressor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,

    CONSTRAINT "Aggressor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Occurrence" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "victimId" TEXT NOT NULL,
    "aggressorId" TEXT NOT NULL,

    CONSTRAINT "Occurrence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Victim_cpf_key" ON "Victim"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Aggressor_cpf_key" ON "Aggressor"("cpf");

-- AddForeignKey
ALTER TABLE "Occurrence" ADD CONSTRAINT "Occurrence_victimId_fkey" FOREIGN KEY ("victimId") REFERENCES "Victim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Occurrence" ADD CONSTRAINT "Occurrence_aggressorId_fkey" FOREIGN KEY ("aggressorId") REFERENCES "Aggressor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
