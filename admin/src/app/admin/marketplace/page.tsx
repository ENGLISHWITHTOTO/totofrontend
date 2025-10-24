"use client";

import { MarketplaceManagement } from "@/components/marketplace-management";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <MarketplaceManagement userRole={userRole} />;
}
