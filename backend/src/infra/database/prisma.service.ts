/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

/**
 * PostgreSQL is served through WSL2/Docker port-forwarding on this machine.
 * That networking layer is flaky: it can drop idle connections and fail under
 * concurrent load. The pool is configured defensively and a periodic keepalive
 * ping prevents WSL2 from putting idle connections to sleep.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private pool!: Pool;
  private keepaliveTimer?: ReturnType<typeof setInterval>;
  private reconnectPromise: Promise<void> | null = null;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      keepAlive: true,
      keepAliveInitialDelayMillis: 0,
      // Connections idle longer than 25 s are closed proactively, preventing
      // WSL2/Docker from dropping them server-side first.
      idleTimeoutMillis: 25_000,
      // WSL2 can take a long time to establish a new connection when the
      // networking layer is waking up — use 0 (no hard limit) and rely on
      // the OS-level timeout instead.
      connectionTimeoutMillis: 0,
      max: 10,
    });

    pool.on("error", (err) => {
      this.logger.warn(`Idle pool client error: ${err.message}`);
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });

    // Store reference for keepalive and cleanup
    (this as unknown as { pool: Pool }).pool = pool;
  }

  async onModuleInit() {
    await this.$connect();

    // Warm up: force WSL2/Docker networking to wake before the first HTTP
    // request arrives. Retries a few times since the first connection attempt
    // after a long idle can fail while WSL2 "wakes up".
    await this.warmUp();

    // Periodic keepalive: SELECT 1 every 5 s — well below the pool's
    // idleTimeoutMillis (25 s) so WSL2/Docker never gets a chance to drop
    // idle connections before the next ping resets the timer.
    // If a ping fails, ping() reconnects immediately so the pool is healthy
    // again before the next HTTP request arrives.
    this.keepaliveTimer = setInterval(() => void this.ping(), 5_000);
  }

  private async warmUp(attempts = 5, delayMs = 2_000): Promise<void> {
    for (let i = 1; i <= attempts; i++) {
      try {
        await this.$queryRaw`SELECT 1`;
        this.logger.log("Database connection warmed up.");
        return;
      } catch (err) {
        this.logger.warn(
          `Warm-up attempt ${i}/${attempts} failed: ${String(err)}`,
        );
        if (i < attempts) {
          await new Promise((_resolve) => setTimeout(_resolve, delayMs));
        }
      }
    }
    this.logger.error(
      "Could not warm up database connection after all attempts. Continuing anyway.",
    );
  }

  /**
   * Executes `fn` and, on a transient WSL2/Docker connection error (P1017 /
   * P1001), reconnects once and retries before re-throwing.
   * Use this in repository methods that are on the critical path (e.g. the
   * JWT validation query that runs on every authenticated request).
   */
  /**
   * Serialised reconnect: if multiple callers hit P1017 simultaneously they
   * all await the same promise instead of each racing to $disconnect/$connect.
   */
  private reconnect(): Promise<void> {
    if (!this.reconnectPromise) {
      this.reconnectPromise = this.$disconnect()
        .catch(() => undefined)
        .then(() => this.$connect())
        .catch((err: unknown) => {
          this.logger.warn(`Reconnect failed: ${String(err)}`);
        })
        .finally(() => {
          this.reconnectPromise = null;
        });
    }
    return this.reconnectPromise;
  }

  async withRetry<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "P1017" || code === "P1001") {
        this.logger.warn(
          `Transient connection error (${code}) — reconnecting and retrying…`,
        );
        await this.reconnect();
        return fn();
      }
      throw err;
    }
  }

  private async ping(): Promise<void> {
    try {
      await this.$queryRaw`SELECT 1`;
    } catch {
      await this.reconnect();
    }
  }

  async onModuleDestroy() {
    if (this.keepaliveTimer) {
      clearInterval(this.keepaliveTimer);
    }
    await this.$disconnect();

    await (this as unknown as { pool: Pool }).pool.end();
  }
}
