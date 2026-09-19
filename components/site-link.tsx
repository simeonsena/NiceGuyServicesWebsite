import type { ComponentPropsWithoutRef } from "react";

// Native navigation keeps public pages independent of client router availability.
export default function SiteLink({
  children,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  return <a {...props}>{children}</a>;
}
