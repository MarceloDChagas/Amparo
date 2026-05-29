import {
  AlertStatusType,
  emergencyAlertService,
} from "@/services/emergency-alert-service";

describe("emergencyAlertService", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    localStorage.setItem("token", "test-token");
    Object.defineProperty(global, "fetch", {
      value: fetchMock,
      writable: true,
      configurable: true,
    });
    fetchMock.mockReset();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should return [] when getAll receives 404", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 404 });

    const result = await emergencyAlertService.getAll();

    expect(result).toEqual([]);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/emergency-alerts/all"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      }),
    );
  });

  it("should return null when getActive receives 404", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 404 });

    const result = await emergencyAlertService.getActive();

    expect(result).toBeNull();
  });

  it("should throw when getById fails with non-404 error", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 });

    await expect(emergencyAlertService.getById("alert-1")).rejects.toThrow(
      "Failed to fetch emergency alert alert-1",
    );
  });

  it("should use backend message on updateStatus failure", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Transição inválida" }),
    });

    await expect(
      emergencyAlertService.updateStatus("alert-1", {
        status: "DISPATCHED" as AlertStatusType,
      }),
    ).rejects.toThrow("Transição inválida");
  });

  it("should return [] when getEvents returns empty body", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => "",
    });

    const result = await emergencyAlertService.getEvents("alert-1");

    expect(result).toEqual([]);
  });
});
