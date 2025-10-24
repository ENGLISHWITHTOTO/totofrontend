"use client";

import { ReferralsManager } from "@/components/referrals-manager";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <ReferralsManager userRole={userRole} />;
}
