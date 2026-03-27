-- AM-84: Add PatrolRouteLog table for route generation and update logging
-- Also adds the `logs` relation to PatrolRoute (no schema change needed for PatrolRoute itself)

CREATE TABLE "PatrolRouteLog" (
    "id"            TEXT NOT NULL,
    "patrolRouteId" TEXT NOT NULL,
    "event"         TEXT NOT NULL,
    "performedBy"   TEXT,
    "metadata"      TEXT,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatrolRouteLog_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "PatrolRouteLog"
    ADD CONSTRAINT "PatrolRouteLog_patrolRouteId_fkey"
    FOREIGN KEY ("patrolRouteId") REFERENCES "PatrolRoute"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "PatrolRouteLog_patrolRouteId_idx" ON "PatrolRouteLog"("patrolRouteId");
CREATE INDEX "PatrolRouteLog_event_idx" ON "PatrolRouteLog"("event");
