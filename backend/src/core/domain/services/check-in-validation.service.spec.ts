import { CheckInStatus, DistanceType } from "../enums/distance-type.enum";
import { CheckInValidationService } from "./check-in-validation.service";

describe("CheckInValidationService", () => {
  let service: CheckInValidationService;

  beforeEach(() => {
    service = new CheckInValidationService();
  });

  describe("SHORT distance (10 minutes tolerance)", () => {
    it("should return ON_TIME when arrival is exactly on expected time", () => {
      const expected = new Date("2026-01-01T10:00:00Z");
      const actual = new Date("2026-01-01T10:00:00Z");
      const result = service.validateCheckIn(
        expected,
        actual,
        DistanceType.SHORT,
      );
      expect(result).toBe(CheckInStatus.ON_TIME);
    });

    it("should return ON_TIME when arrival is within tolerance (e.g. 5 mins late)", () => {
      const expected = new Date("2026-01-01T10:00:00Z");
      const actual = new Date("2026-01-01T10:05:00Z");
      const result = service.validateCheckIn(
        expected,
        actual,
        DistanceType.SHORT,
      );
      expect(result).toBe(CheckInStatus.ON_TIME);
    });

    it("should return ON_TIME when arrival is exactly at tolerance limit (10 mins late)", () => {
      const expected = new Date("2026-01-01T10:00:00Z");
      const actual = new Date("2026-01-01T10:10:00Z");
      const result = service.validateCheckIn(
        expected,
        actual,
        DistanceType.SHORT,
      );
      expect(result).toBe(CheckInStatus.ON_TIME);
    });

    it("should return LATE when arrival is beyond tolerance limit (11 mins late)", () => {
      const expected = new Date("2026-01-01T10:00:00Z");
      const actual = new Date("2026-01-01T10:11:00Z");
      const result = service.validateCheckIn(
        expected,
        actual,
        DistanceType.SHORT,
      );
      expect(result).toBe(CheckInStatus.LATE);
    });
  });

  describe("MEDIUM distance (30 minutes tolerance)", () => {
    it("should return ON_TIME when arrival is exactly at tolerance limit (30 mins late)", () => {
      const expected = new Date("2026-01-01T10:00:00Z");
      const actual = new Date("2026-01-01T10:30:00Z");
      const result = service.validateCheckIn(
        expected,
        actual,
        DistanceType.MEDIUM,
      );
      expect(result).toBe(CheckInStatus.ON_TIME);
    });

    it("should return LATE when arrival is beyond tolerance limit (31 mins late)", () => {
      const expected = new Date("2026-01-01T10:00:00Z");
      const actual = new Date("2026-01-01T10:31:00Z");
      const result = service.validateCheckIn(
        expected,
        actual,
        DistanceType.MEDIUM,
      );
      expect(result).toBe(CheckInStatus.LATE);
    });
  });

  describe("LONG distance (60 minutes tolerance)", () => {
    it("should return ON_TIME when arrival is exactly at tolerance limit (60 mins late)", () => {
      const expected = new Date("2026-01-01T10:00:00Z");
      const actual = new Date("2026-01-01T11:00:00Z");
      const result = service.validateCheckIn(
        expected,
        actual,
        DistanceType.LONG,
      );
      expect(result).toBe(CheckInStatus.ON_TIME);
    });

    it("should return LATE when arrival is beyond tolerance limit (61 mins late)", () => {
      const expected = new Date("2026-01-01T10:00:00Z");
      const actual = new Date("2026-01-01T11:01:00Z");
      const result = service.validateCheckIn(
        expected,
        actual,
        DistanceType.LONG,
      );
      expect(result).toBe(CheckInStatus.LATE);
    });
  });

  describe("Early arrivals", () => {
    it("should return ON_TIME when arrival is before expected time", () => {
      const expected = new Date("2026-01-01T10:00:00Z");
      const actual = new Date("2026-01-01T09:30:00Z");
      const result = service.validateCheckIn(
        expected,
        actual,
        DistanceType.SHORT,
      );
      expect(result).toBe(CheckInStatus.ON_TIME);
    });
  });
});
