"use client";

import { DataExport } from "@/components/data-export";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <DataExport userRole={userRole} />;
}
