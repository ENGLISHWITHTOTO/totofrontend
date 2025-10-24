"use client";

import { PermissionSummary } from "@/components/permission-summary";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <PermissionSummary userRole={userRole} />;
}
