"use client";

import { AICharactersManager } from "@/components/ai-characters-manager";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <AICharactersManager userRole={userRole} />;
}
