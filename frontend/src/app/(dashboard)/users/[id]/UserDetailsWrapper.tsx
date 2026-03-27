"use client";

import dynamic from "next/dynamic";

const UserDetailsClient = dynamic(() => import("./UserDetailsClient"), {
  ssr: false,
});

export default function UserDetailsWrapper() {
  return <UserDetailsClient />;
}
