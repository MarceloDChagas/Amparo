export interface PositionResult {
  latitude: number;
  longitude: number;
  /** Estimated 68% confidence radius, in metres. */
  accuracy: number;
}

// ── Tuning constants ─────────────────────────────────────────────────────────
/** Floor for a single fix's reported accuracy so the variance never collapses. */
const MIN_ACCURACY_M = 1;
/** Assumed accuracy when a provider omits it (rare, non-standard providers). */
const ASSUMED_ACCURACY_M = 100;
/** Require this many fused fixes before trusting that the target was hit —
 *  prevents a single optimistic reading from resolving early. */
const MIN_SAMPLES = 3;
/** Improvements smaller than this count as "no progress" for the stall timer. */
const IMPROVE_EPSILON_M = 0.5;
/** If the estimate stops improving for this long, accept the best so far. Keeps
 *  the alert fast on devices that top out above the target instead of blocking
 *  for the whole timeout. */
const STALL_MS = 3_500;
/** Default process noise: how fast the subject may move, in metres/second.
 *  A small value (walking pace) tells the filter to trust accumulated history,
 *  which is what shrinks the noise of a stationary device toward a few metres. */
const DEFAULT_Q = 2;

/** Reads a fix's accuracy defensively (guards undefined/NaN from odd providers). */
function readAccuracy(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

/**
 * 1-D Kalman filter for fusing a stream of GPS fixes — the well-known
 * "smooth GPS data" formulation.
 *
 * Each raw fix carries its own accuracy (a 1-sigma radius in metres). The
 * filter fuses successive fixes so the estimated position converges and its
 * uncertainty (variance) shrinks far below any single noisy reading. That is
 * what lets a stationary device reach a ~5 m estimate out of a stream of
 * ~10-20 m fixes — something a single `getCurrentPosition` call can never do.
 *
 * Coarse fixes are fed in too: a coarse seed is corrected as soon as a precise
 * fix arrives (the Kalman gain ≈ 1 when the prior variance is large), and a
 * coarse fix arriving after the estimate is already tight is down-weighted to
 * near-nothing (gain ≈ 0). So no fix is ever thrown away — the worst case is
 * simply a coarse estimate when that is all the device can provide.
 *
 * Movement is modelled by `qMetresPerSecond`: between fixes the variance grows
 * by q²·Δt, so the filter both trusts older history less while moving and keeps
 * a realistic floor on its confidence (it will not claim absurd sub-metre
 * precision from correlated GPS noise).
 */
export class GeoKalmanFilter {
  private readonly q: number; // process noise (metres / second)
  private lat = 0;
  private lng = 0;
  private variance = -1; // P (metres²); < 0 ⇒ uninitialised
  private timestamp = 0; // ms

  constructor(qMetresPerSecond: number = DEFAULT_Q) {
    this.q = qMetresPerSecond;
  }

  /** Folds a raw fix into the estimate. `accuracy` is the fix's 1-sigma radius (m). */
  process(lat: number, lng: number, accuracy: number, timestamp: number): void {
    const acc = Math.max(
      readAccuracy(accuracy, ASSUMED_ACCURACY_M),
      MIN_ACCURACY_M,
    );
    const ts = readAccuracy(timestamp, Date.now());

    if (this.variance < 0) {
      // First fix — seed the estimate.
      this.lat = lat;
      this.lng = lng;
      this.variance = acc * acc;
      this.timestamp = ts;
      return;
    }

    // Predict: uncertainty grows with elapsed time while the subject may move.
    const dtMs = ts - this.timestamp;
    if (dtMs > 0) {
      this.variance += (dtMs * this.q * this.q) / 1000;
      this.timestamp = ts;
    }

    // Update: K is dimensionless, so mixing metre-variance with degree-coords is fine.
    const k = this.variance / (this.variance + acc * acc);
    this.lat += k * (lat - this.lat);
    this.lng += k * (lng - this.lng);
    this.variance = (1 - k) * this.variance;
  }

  /** Current fused estimate, or null if no fix has been folded in yet. */
  get position(): PositionResult | null {
    if (this.variance < 0) return null;
    return {
      latitude: this.lat,
      longitude: this.lng,
      accuracy: Math.sqrt(this.variance),
    };
  }

  /** Estimated 1-sigma accuracy of the fused position in metres (∞ if none). */
  get accuracy(): number {
    return this.variance < 0 ? Infinity : Math.sqrt(this.variance);
  }
}

interface WatchOptions {
  /** Process noise in metres/second — how fast the subject may move. */
  qMetresPerSecond?: number;
}

export interface WatchHandle {
  stop: () => void;
}

/**
 * Continuously watches the device position, feeding each fix through a Kalman
 * filter, and calls `onUpdate` with the fused estimate on every update. Useful
 * to pre-warm the GPS so a precise position is ready the instant it is needed.
 *
 * Every fix updates the estimate (coarse ones included), so `onUpdate` always
 * reflects the best location the device can currently provide — there is never
 * a window where the caller has no position to fall back on.
 *
 * Returns a handle whose `stop()` ends the watch. Where geolocation (or
 * `watchPosition`) is unavailable it returns an inert handle instead of throwing.
 */
export function watchBestPosition(
  onUpdate: (pos: PositionResult) => void,
  { qMetresPerSecond = DEFAULT_Q }: WatchOptions = {},
): WatchHandle {
  const geo = navigator?.geolocation;
  if (!geo || typeof geo.watchPosition !== "function") {
    return { stop: () => undefined };
  }

  const filter = new GeoKalmanFilter(qMetresPerSecond);
  const watchId = geo.watchPosition(
    ({ coords, timestamp }) => {
      const accuracy = readAccuracy(coords.accuracy, ASSUMED_ACCURACY_M);
      filter.process(coords.latitude, coords.longitude, accuracy, timestamp);
      const pos = filter.position;
      if (pos) onUpdate(pos);
    },
    () => undefined,
    { enableHighAccuracy: true, maximumAge: 0, timeout: 30_000 },
  );

  return {
    stop: () => {
      try {
        geo.clearWatch(watchId);
      } catch {
        // clearing an already-cleared watch is harmless
      }
    },
  };
}

/**
 * Resolves with the most accurate position obtainable, fusing a stream of GPS
 * fixes through a Kalman filter rather than trusting a single reading.
 *
 * Resolution happens at the first of:
 *   • target reached — at least `MIN_SAMPLES` fused fixes AND the estimate is
 *     within `targetMeters`;
 *   • stalled — the estimate has not improved for `STALL_MS` (the device has
 *     topped out, so there is no point waiting longer);
 *   • timeout — `timeoutMs` elapsed.
 * In every case it resolves with the best estimate so far (fused, else the best
 * raw fix). It rejects only when the device delivers no fix at all, so the
 * caller never silently loses a usable location.
 *
 * Note: 5 m is a target, not a guarantee — it is bounded by the device's
 * hardware. This converges as close to it as the signal allows.
 */
export function getBestPosition(
  targetMeters = 5,
  timeoutMs = 15_000,
): Promise<PositionResult> {
  return new Promise((resolve, reject) => {
    const geo = navigator?.geolocation;
    if (!geo) {
      reject(new Error("Geolocalização não suportada"));
      return;
    }

    const filter = new GeoKalmanFilter(DEFAULT_Q);
    let samples = 0;
    let bestAccuracy = Infinity;
    let rawBest: PositionResult | null = null; // graceful fallback
    let settled = false;
    let watchId: number | null = null;
    let stallTimer: ReturnType<typeof setTimeout> | null = null;

    const cleanup = () => {
      clearTimeout(timer);
      if (stallTimer) clearTimeout(stallTimer);
      if (watchId !== null) {
        try {
          geo.clearWatch(watchId);
        } catch {
          // harmless if already cleared
        }
        watchId = null;
      }
    };

    const settle = () => {
      if (settled) return;
      settled = true;
      cleanup();
      const result = filter.position ?? rawBest;
      if (result) resolve(result);
      else reject(new Error("GPS indisponível"));
    };

    // Accept the best estimate once it stops improving (device has topped out).
    const armStall = () => {
      if (stallTimer) clearTimeout(stallTimer);
      stallTimer = setTimeout(() => {
        if (filter.position) settle();
      }, STALL_MS);
    };

    const onFix = (coords: GeolocationCoordinates, timestamp: number): void => {
      const accuracy = readAccuracy(coords.accuracy, ASSUMED_ACCURACY_M);

      // Always remember the best raw fix so there is something to return.
      if (!rawBest || accuracy < rawBest.accuracy) {
        rawBest = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy,
        };
      }

      filter.process(coords.latitude, coords.longitude, accuracy, timestamp);
      samples += 1;

      const acc = filter.accuracy;
      if (samples >= MIN_SAMPLES && acc <= targetMeters) {
        settle();
        return;
      }
      // (Re)arm the stall deadline whenever the estimate meaningfully improves,
      // and at least once after the first fix.
      if (acc < bestAccuracy - IMPROVE_EPSILON_M || stallTimer === null) {
        bestAccuracy = Math.min(bestAccuracy, acc);
        armStall();
      }
    };

    const timer = setTimeout(settle, timeoutMs);

    if (typeof geo.watchPosition === "function") {
      watchId = geo.watchPosition(
        ({ coords, timestamp }) => onFix(coords, timestamp),
        (err) => {
          // If anything usable was already captured, return it; else surface the error.
          if (filter.position || rawBest) settle();
          else {
            cleanup();
            reject(err);
          }
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: timeoutMs },
      );
    } else if (typeof geo.getCurrentPosition === "function") {
      // Environments without watchPosition: best-effort single high-accuracy fix.
      geo.getCurrentPosition(
        ({ coords, timestamp }) => {
          onFix(coords, readAccuracy(timestamp, Date.now()));
          settle();
        },
        (err) => {
          cleanup();
          reject(err);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: timeoutMs },
      );
    } else {
      cleanup();
      reject(new Error("Geolocalização não suportada"));
    }
  });
}
