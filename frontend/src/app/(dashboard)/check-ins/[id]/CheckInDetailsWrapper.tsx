"use client";

import dynamic from "next/dynamic";

const CheckInDetailsClient = dynamic(() => import("./CheckInDetailsClient"), {
  ssr: false,
});

export default function CheckInDetailsWrapper() {
  return <CheckInDetailsClient />;
}
