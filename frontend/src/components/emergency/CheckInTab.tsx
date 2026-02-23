import { motion } from "framer-motion";
import { useState } from "react";

import {
  useCompleteCheckIn,
  useGetActiveCheckIn,
  useStartCheckIn,
} from "@/hooks/use-check-in";
import { DistanceType } from "@/services/check-in-service";

import { CheckInActive } from "./CheckInActive";
import { CheckInInstructionalCard } from "./CheckInInstructionalCard";
import { CheckInStart } from "./CheckInStart";

export function CheckInTab() {
  const [selectedDistance, setSelectedDistance] = useState<DistanceType>(
    DistanceType.SHORT,
  );

  const { data: activeCheckIn, isLoading } = useGetActiveCheckIn();
  const startCheckIn = useStartCheckIn();
  const completeCheckIn = useCompleteCheckIn();

  const handleStart = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          startCheckIn.mutate({
            distanceType: selectedDistance,
            startLatitude: position.coords.latitude,
            startLongitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation error/denied:", error);
          startCheckIn.mutate({ distanceType: selectedDistance });
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    } else {
      startCheckIn.mutate({ distanceType: selectedDistance });
    }
  };

  const handleComplete = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          completeCheckIn.mutate({
            finalLatitude: position.coords.latitude,
            finalLongitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation error/denied:", error);
          completeCheckIn.mutate({});
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    } else {
      completeCheckIn.mutate({});
    }
  };

  if (isLoading) {
    return <div className="text-white text-center mt-12">Carregando...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center justify-start w-full max-w-md mx-auto relative px-4 mt-2"
    >
      {!activeCheckIn ? (
        <CheckInStart
          selectedDistance={selectedDistance}
          setSelectedDistance={setSelectedDistance}
          onStart={handleStart}
          isPending={startCheckIn.isPending}
        />
      ) : (
        <CheckInActive
          expectedArrivalTime={activeCheckIn.expectedArrivalTime}
          onComplete={handleComplete}
          isPending={completeCheckIn.isPending}
        />
      )}

      <CheckInInstructionalCard />
    </motion.div>
  );
}
