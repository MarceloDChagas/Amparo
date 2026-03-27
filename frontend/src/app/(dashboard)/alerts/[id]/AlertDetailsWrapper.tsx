"use client";

import dynamic from "next/dynamic";

const AlertDetailsClient = dynamic(() => import("./AlertDetailsClient"), {
  ssr: false,
});

export default function AlertDetailsWrapper() {
  return <AlertDetailsClient />;
}
