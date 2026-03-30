-- AlterTable: adiciona coluna routeGeometry (geometria real das ruas via OSRM)
ALTER TABLE "PatrolRoute" ADD COLUMN "routeGeometry" TEXT;
