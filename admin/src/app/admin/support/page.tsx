"use client";

import { CustomerSupport } from "@/components/customer-support";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <CustomerSupport userRole={userRole} />;
}
