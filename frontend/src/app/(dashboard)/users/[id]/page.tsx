import UserDetailsWrapper from "./UserDetailsWrapper";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function Page() {
  return <UserDetailsWrapper />;
}
