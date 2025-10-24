"use client";

import { StaticContentManager } from "@/components/static-content-manager";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <StaticContentManager userRole={userRole} />;
}
