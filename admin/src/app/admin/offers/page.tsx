"use client";

import { OffersManager } from "@/components/offers-manager";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <OffersManager userRole={userRole} />;
}
