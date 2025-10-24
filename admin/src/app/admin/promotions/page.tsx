"use client";

import { PromotionsManager } from "@/components/promotions-manager";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <PromotionsManager userRole={userRole} />;
}
