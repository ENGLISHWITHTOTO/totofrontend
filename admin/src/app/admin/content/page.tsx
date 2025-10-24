"use client";

import { ContentManagement } from "@/components/content-management";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <ContentManagement userRole={userRole} />;
}
