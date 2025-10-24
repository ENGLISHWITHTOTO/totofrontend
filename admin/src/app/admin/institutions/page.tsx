"use client";

import { InstitutionManagement } from "@/components/institution-management";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <InstitutionManagement userRole={userRole} />;
}
