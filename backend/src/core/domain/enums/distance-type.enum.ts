export enum DistanceType {
  SHORT = "SHORT",
  MEDIUM = "MEDIUM",
  LONG = "LONG",
}

export const DistanceTolerances: Record<DistanceType, number> = {
  [DistanceType.SHORT]: 10,
  [DistanceType.MEDIUM]: 30,
  [DistanceType.LONG]: 60,
};

export enum CheckInStatus {
  ON_TIME = "ON_TIME",
  LATE = "LATE",
}
