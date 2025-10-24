"use client";

import { HomestayManagement } from "@/components/homestay-management";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <HomestayManagement userRole={userRole} />;
}
