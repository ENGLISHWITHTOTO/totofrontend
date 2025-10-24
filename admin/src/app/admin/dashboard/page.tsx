"use client";

import { DashboardOverview } from "@/components/dashboard-overview";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <DashboardOverview userRole={userRole} />;
}
