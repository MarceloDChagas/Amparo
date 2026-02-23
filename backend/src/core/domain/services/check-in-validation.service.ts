import {
  CheckInStatus,
  DistanceTolerances,
  DistanceType,
} from "../enums/distance-type.enum";

export class CheckInValidationService {
  /**
   * Validates if a check-in is on time or late based on the destination distance type.
   *
   * @param expectedArrivalTime Expected arrival time
   * @param actualArrivalTime The actual time the check-in occurred
   * @param distanceType The type of distance (SHORT, MEDIUM, LONG)
   * @returns The check-in status (ON_TIME or LATE)
   */
  public validateCheckIn(
    expectedArrivalTime: Date,
    actualArrivalTime: Date,
    distanceType: DistanceType,
  ): CheckInStatus {
    const toleranceMinutes = DistanceTolerances[distanceType];
    const toleranceMs = toleranceMinutes * 60 * 1000;

    const limitTime = new Date(expectedArrivalTime.getTime() + toleranceMs);

    if (actualArrivalTime <= limitTime) {
      return CheckInStatus.ON_TIME;
    }

    return CheckInStatus.LATE;
  }
}
