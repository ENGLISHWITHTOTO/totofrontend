"use client";

import { ReportsManagement } from "@/components/reports-management";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <ReportsManagement userRole={userRole} />;
}
