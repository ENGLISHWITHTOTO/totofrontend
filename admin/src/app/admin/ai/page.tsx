"use client";

import { AIConfiguration } from "@/components/ai-configuration";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <AIConfiguration userRole={userRole} />;
}
