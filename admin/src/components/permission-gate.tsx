import React from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Shield } from "lucide-react";
import { UserRole, ModuleName, PermissionCode, hasPermission } from "../utils/permissions";

interface PermissionGateProps {
  userRole: UserRole;
  module: ModuleName;
  permission: PermissionCode;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({ 
  userRole, 
  module, 
  permission, 
  children, 
  fallback 
}: PermissionGateProps) {
  const hasAccess = hasPermission(userRole, module, permission);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to perform this action.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}