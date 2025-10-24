"use client";

import { AdminPromotionsManager } from "@/components/admin-promotions-manager";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <AdminPromotionsManager userRole={userRole} />;
}
