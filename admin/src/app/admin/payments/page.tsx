"use client";

import { SubscriptionManagement } from "@/components/subscription-management";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <SubscriptionManagement userRole={userRole} />;
}
