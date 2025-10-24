"use client";

import { SystemSettings } from "@/components/system-settings";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <SystemSettings userRole={userRole} />;
}
