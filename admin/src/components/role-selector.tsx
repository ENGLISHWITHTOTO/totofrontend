import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { UserRole } from "../utils/permissions";

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  className?: string;
}

export function RoleSelector({ currentRole, onRoleChange, className }: RoleSelectorProps) {
  const roles: { value: UserRole; label: string; description: string }[] = [
    {
      value: "SUPER_ADMIN",
      label: "Super Admin",
      description: "Full access to everything"
    },
    {
      value: "COMPLIANCE",
      label: "Compliance",
      description: "Audits, privacy requests, policy enforcement"
    },
    {
      value: "FINANCE",
      label: "Finance",
      description: "Payments, subscriptions, refunds, payouts"
    },
    {
      value: "MODERATOR",
      label: "Moderator",
      description: "Safety & content moderation"
    },
    {
      value: "CONTENT_MANAGER",
      label: "Content Manager",
      description: "Manages taxonomy & library content"
    },
    {
      value: "SUPPORT",
      label: "Support",
      description: "Customer support, limited access"
    },
    {
      value: "ANALYST",
      label: "Analyst",
      description: "Analytics & reporting"
    },
    {
      value: "READ_ONLY",
      label: "Read Only",
      description: "Read-only access across non-sensitive areas"
    }
  ];

  const getRoleColor = (role: UserRole) => {
    const colors = {
      SUPER_ADMIN: "bg-red-100 text-red-800",
      COMPLIANCE: "bg-purple-100 text-purple-800",
      FINANCE: "bg-green-100 text-green-800",
      MODERATOR: "bg-orange-100 text-orange-800",
      CONTENT_MANAGER: "bg-blue-100 text-blue-800",
      SUPPORT: "bg-yellow-100 text-yellow-800",
      ANALYST: "bg-indigo-100 text-indigo-800",
      READ_ONLY: "bg-gray-100 text-gray-800"
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-medium">Demo Role:</span>
        <Badge className={getRoleColor(currentRole)}>
          {currentRole.replace('_', ' ')}
        </Badge>
      </div>
      
      <Select value={currentRole} onValueChange={onRoleChange}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              <div className="flex flex-col">
                <span className="font-medium">{role.label}</span>
                <span className="text-xs text-muted-foreground">{role.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}