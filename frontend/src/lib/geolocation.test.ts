import {
  GeoKalmanFilter,
  getBestPosition,
  type PositionResult,
  watchBestPosition,
} from "./geolocation";

// Valida o filtro de Kalman que funde leituras de GPS para melhorar a precisão.
describe("GeoKalmanFilter", () => {
  // Garante que o filtro começa sem posição e com precisão infinita.
  it("starts uninitialised", () => {
    const f = new GeoKalmanFilter();
    expect(f.position).toBeNull();
    expect(f.accuracy).toBe(Infinity);
  });

  // Garante que a primeira leitura é retornada sem alteração.
  it("returns the first fix unchanged", () => {
    const f = new GeoKalmanFilter();
    f.process(-23.5, -46.6, 10, 1000);
    expect(f.position).toMatchObject({ latitude: -23.5, longitude: -46.6 });
    expect(f.accuracy).toBeCloseTo(10, 5);
  });

  // Garante que fundir leituras repetidas melhora a precisão além de uma única leitura, sem exagerar.
  it("fuses repeated fixes to an accuracy far below any single reading", () => {
    const f = new GeoKalmanFilter(2);
    for (let i = 1; i <= 8; i++) f.process(-23.5, -46.6, 10, i * 1000);

    // 8 fused 10 m fixes converge to ~4.5 m — within the 5 m target, which a
    // single reading could never reach.
    expect(f.accuracy).toBeLessThan(5);
    // ...but it never claims absurd sub-metre precision out of 10 m noise.
    expect(f.accuracy).toBeGreaterThan(2);
    // The estimate stays locked on the consistent measurement.
    expect(f.position?.latitude).toBeCloseTo(-23.5, 6);
    expect(f.position?.longitude).toBeCloseTo(-46.6, 6);
  });

  // Garante que ruído simétrico é compensado, mantendo a estimativa centrada no ponto real.
  it("averages out symmetric jitter, staying centred on the true point", () => {
    const f = new GeoKalmanFilter(2);
    const trueLat = 10;
    const trueLng = 20;
    const jitter = 0.0001; // ~11 m at the equator
    for (let i = 1; i <= 12; i++) {
      const sign = i % 2 === 0 ? 1 : -1;
      f.process(trueLat + sign * jitter, trueLng + sign * jitter, 10, i * 1000);
    }
    // The fused estimate sits well inside a single fix's spread of the centre.
    expect(Math.abs(f.position!.latitude - trueLat)).toBeLessThan(jitter);
    expect(Math.abs(f.position!.longitude - trueLng)).toBeLessThan(jitter);
  });

  // Garante que precisão inválida (0/NaN) é tratada, evitando colapso da estimativa.
  it("clamps garbage accuracy so the estimate never over-collapses", () => {
    const f = new GeoKalmanFilter(2);
    f.process(0, 0, 0, 1000); // 0 → clamped to a 1 m floor
    f.process(0, 0, NaN, 2000); // NaN → treated as a coarse fallback
    expect(Number.isFinite(f.accuracy)).toBe(true);
    expect(f.accuracy).toBeGreaterThan(0);
  });
});

// Valida a obtenção da melhor posição possível dentro de prazos/limites de precisão.
describe("getBestPosition", () => {
  const FIX = { latitude: -23.5505, longitude: -46.6333 };

  const setGeo = (geo: unknown) =>
    Object.defineProperty(global.navigator, "geolocation", {
      value: geo,
      configurable: true,
      writable: true,
    });

  afterEach(() => setGeo(undefined));

  // Garante que resolve cedo quando leituras precisas convergem ao alvo.
  it("resolves early with a converged fix from a stream of tight readings", async () => {
    setGeo({
      watchPosition: jest.fn().mockImplementation((success) => {
        let i = 0;
        const emit = () => {
          if (i >= 5) return;
          success({
            coords: { ...FIX, accuracy: 4 },
            timestamp: 1000 + i * 1000,
          });
          i += 1;
          queueMicrotask(emit);
        };
        queueMicrotask(emit);
        return 7;
      }),
      clearWatch: jest.fn(),
    });

    const pos = await getBestPosition(5, 15_000);
    expect(pos.latitude).toBeCloseTo(FIX.latitude, 6);
    expect(pos.longitude).toBeCloseTo(FIX.longitude, 6);
    expect(pos.accuracy).toBeLessThanOrEqual(5);
  });

  // Regressão: garante que devolve a posição imprecisa em vez de cair para (0,0).
  it("returns the coarse fix (never 0,0) when nothing better arrives", async () => {
    setGeo({
      watchPosition: jest.fn().mockImplementation((success) => {
        queueMicrotask(() =>
          success({ coords: { ...FIX, accuracy: 500 }, timestamp: 1000 }),
        );
        return 7;
      }),
      clearWatch: jest.fn(),
    });

    // No GPS-grade fix arrives, but the coarse one must still be handed back —
    // this is the regression: a coarse fix must never be dropped to (0, 0).
    const pos = await getBestPosition(5, 50);
    expect(pos.latitude).toBeCloseTo(FIX.latitude, 6);
    expect(pos.accuracy).toBe(500);
  });

  // Garante que resolve por estagnação (sem novas leituras) antes do timeout máximo.
  it("resolves on stall, well before the hard timeout, when topped out", async () => {
    jest.useFakeTimers();
    setGeo({
      watchPosition: jest.fn().mockImplementation((success) => {
        // One mediocre fix, then silence — must resolve via the stall deadline.
        success({ coords: { ...FIX, accuracy: 80 }, timestamp: 1000 });
        return 7;
      }),
      clearWatch: jest.fn(),
    });

    const pending = getBestPosition(5, 30_000); // long hard cap
    await jest.advanceTimersByTimeAsync(4_000); // stall (3.5 s) fires first
    const pos = await pending;
    expect(pos.latitude).toBeCloseTo(FIX.latitude, 6);
    expect(pos.accuracy).toBeGreaterThan(5); // never reached the 5 m target
    jest.useRealTimers();
  });

  // Garante que rejeita quando a geolocalização não está disponível.
  it("rejects when geolocation is unavailable", async () => {
    setGeo(undefined);
    await expect(getBestPosition()).rejects.toThrow(
      "Geolocalização não suportada",
    );
  });
});

// Valida o acompanhamento contínuo da posição (watch) e a parada do monitoramento.
describe("watchBestPosition", () => {
  // Garante um handle inofensivo (stop não quebra) quando não há geolocalização.
  it("returns an inert handle when geolocation is unavailable", () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: undefined,
      configurable: true,
      writable: true,
    });
    const handle = watchBestPosition(() => undefined);
    expect(() => handle.stop()).not.toThrow();
  });

  // Garante que entrega atualizações fundidas e limpa o watch ao parar.
  it("delivers fused updates and clears the watch on stop", () => {
    const clearWatch = jest.fn();
    Object.defineProperty(global.navigator, "geolocation", {
      value: {
        watchPosition: jest.fn().mockImplementation((success) => {
          success({
            coords: { latitude: 1, longitude: 2, accuracy: 8 },
            timestamp: 1000,
          });
          success({
            coords: { latitude: 1, longitude: 2, accuracy: 8 },
            timestamp: 2000,
          });
          return 42;
        }),
        clearWatch,
      },
      configurable: true,
      writable: true,
    });

    const updates: number[] = [];
    const handle = watchBestPosition((p) => updates.push(p.accuracy));

    expect(updates.length).toBeGreaterThanOrEqual(2);
    // Fusing the second fix tightened the estimate below the raw 8 m.
    expect(updates[updates.length - 1]).toBeLessThan(8);

    handle.stop();
    expect(clearWatch).toHaveBeenCalledWith(42);
  });

  // Regressão: garante que até leituras imprecisas são entregues, nunca deixando o chamador sem posição.
  it("surfaces even coarse fixes so the caller is never left without a position", () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: {
        watchPosition: jest.fn().mockImplementation((success) => {
          // A coarse network fix (desktop / weak signal) must still update —
          // this is exactly the fix that was previously dropped, leaving the
          // emergency button with no position and sending (0, 0).
          success({
            coords: { latitude: 1, longitude: 2, accuracy: 1500 },
            timestamp: 1000,
          });
          return 1;
        }),
        clearWatch: jest.fn(),
      },
      configurable: true,
      writable: true,
    });

    const updates: PositionResult[] = [];
    watchBestPosition((p) => updates.push(p));

    expect(updates).toHaveLength(1);
    expect(updates[0].latitude).toBe(1);
    expect(updates[0].accuracy).toBeGreaterThan(100); // coarse, but NOT dropped
  });
});
