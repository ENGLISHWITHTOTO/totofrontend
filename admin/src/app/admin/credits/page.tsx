"use client";

import { CreditSystemManagement } from "@/components/credit-system-management";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <CreditSystemManagement userRole={userRole} />;
}
