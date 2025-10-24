"use client";

import { UserVerification } from "@/components/user-verification";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <UserVerification userRole={userRole} />;
}
