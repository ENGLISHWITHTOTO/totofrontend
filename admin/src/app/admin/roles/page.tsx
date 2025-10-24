"use client";

import { RoleManagement } from "@/components/role-management";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <RoleManagement userRole={userRole} />;
}
