"use client";

import { AuditLog } from "@/components/audit-log";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <AuditLog userRole={userRole} />;
}
