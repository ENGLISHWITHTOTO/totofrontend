"use client";

import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <AnalyticsDashboard userRole={userRole} />;
}
