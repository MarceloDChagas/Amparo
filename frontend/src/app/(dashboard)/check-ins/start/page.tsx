import { redirect } from "next/navigation";

export default function CheckInStartRedirect() {
  redirect("/check-ins");
}
