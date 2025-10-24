"use client";

import { ChatManagement } from "@/components/chat-management";
import { type UserRole } from "@/utils/permissions";

export default function Page() {
  const userRole: UserRole = "SUPER_ADMIN";
  return <ChatManagement userRole={userRole} />;
}
