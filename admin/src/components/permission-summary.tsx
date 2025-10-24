import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Shield, 
  Users, 
  CreditCard, 
  Building, 
  Store, 
  FileText, 
  Settings, 
  CheckCircle, 
  X,
  Eye,
  EyeOff,
  Lock
} from "lucide-react";
import { 
  UserRole, 
  ROLE_PERMISSIONS, 
  MODULE_PERMISSIONS,
  hasPermission,
  canAccessPII,
  canAccessFinancialData,
  PERMISSION_DESCRIPTIONS,
  SESSION_SECURITY 
} from "../utils/permissions";

interface PermissionSummaryProps {
  userRole: UserRole;
}

export function PermissionSummary({ userRole }: PermissionSummaryProps) {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  const sessionSecurity = SESSION_SECURITY[userRole];

  // Calculate permission score
  const totalPermissions = Object.keys(MODULE_PERMISSIONS).length * 10; // 10 permissions per module
  const grantedPermissions = Object.entries(rolePermissions).reduce((count, [module, permissions]) => {
    return count + permissions.length;
  }, 0);
  const permissionScore = Math.round((grantedPermissions / totalPermissions) * 100);

  const getModuleIcon = (module: string) => {
    const icons = {
      users: Users,
      billing: CreditCard,
      institutions: Building,
      homestays: Building,
      marketplace: Store,
      taxonomy: FileText,
      analytics: FileText,
      moderation: Shield,
      verification: CheckCircle,
      credits: CreditCard,
      ai_config: Settings,
      settings: Settings,
      audit: FileText
    };
    return icons[module] || FileText;
  };

  const getPermissionColor = (permission: string) => {
    const colors = {
      R: "bg-blue-100 text-blue-800",
      C: "bg-green-100 text-green-800", 
      U: "bg-yellow-100 text-yellow-800",
      D: "bg-red-100 text-red-800",
      A: "bg-purple-100 text-purple-800",
      M: "bg-orange-100 text-orange-800",
      F: "bg-pink-100 text-pink-800",
      P: "bg-indigo-100 text-indigo-800",
      G: "bg-teal-100 text-teal-800",
      X: "bg-gray-100 text-gray-800"
    };
    return colors[permission] || "bg-gray-100 text-gray-800";
  };

  const securityScore = () => {
    let score = 0;
    if (sessionSecurity.requiresTwoFA) score += 25;
    if (sessionSecurity.trustedDeviceRequired) score += 20;
    if (sessionSecurity.ipWhitelistRequired) score += 25;
    if (sessionSecurity.autoLockMinutes <= 15) score += 15;
    if (sessionSecurity.maxSessionHours <= 8) score += 15;
    return score;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Permission Summary</h1>
        <p className="text-muted-foreground">
          Comprehensive overview of your role permissions and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Role: {userRole.replace('_', ' ')}</span>
            </CardTitle>
            <CardDescription>
              Your current access level and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Permission Coverage</span>
                  <span className="text-sm font-medium">{permissionScore}%</span>
                </div>
                <Progress value={permissionScore} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  {canAccessPII(userRole) ? (
                    <Eye className="w-4 h-4 text-green-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-red-600" />
                  )}
                  <span>PII Access</span>
                </div>
                <div className="flex items-center space-x-2">
                  {canAccessFinancialData(userRole) ? (
                    <Eye className="w-4 h-4 text-green-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-red-600" />
                  )}
                  <span>Financial Data</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Security Level</h4>
                <div className="space-y-1 text-xs">
                  <div>Auto-lock: {sessionSecurity.autoLockMinutes}min</div>
                  <div>Max session: {sessionSecurity.maxSessionHours}h</div>
                  <div>2FA: {sessionSecurity.requiresTwoFA ? "Required" : "Optional"}</div>
                </div>
                <div className="mt-2">
                  <Progress value={securityScore()} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    Security Score: {securityScore()}/100
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Module Permissions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Module Permissions</CardTitle>
            <CardDescription>
              Detailed breakdown of your access rights per module
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(rolePermissions).map(([module, permissions]) => {
                const IconComponent = getModuleIcon(module);
                const hasAnyPermission = permissions.length > 0;
                
                return (
                  <div key={module} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-4 h-4 text-blue-600" />
                        <span className="font-medium capitalize text-sm">
                          {module.replace('_', ' ')}
                        </span>
                      </div>
                      {!hasAnyPermission && (
                        <Lock className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    
                    {hasAnyPermission ? (
                      <div className="flex flex-wrap gap-1">
                        {permissions.map((permission, index) => (
                          <Badge 
                            key={`${module}-${permission}-${index}`}
                            className={getPermissionColor(permission)}
                            title={PERMISSION_DESCRIPTIONS[permission]}
                          >
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground flex items-center space-x-1">
                        <X className="w-3 h-3" />
                        <span>No access</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permission Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Code Reference</CardTitle>
          <CardDescription>
            Understanding what each permission code means
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(PERMISSION_DESCRIPTIONS).map(([code, description]) => (
              <div key={code} className="flex items-center space-x-2">
                <Badge className={getPermissionColor(code)}>
                  {code}
                </Badge>
                <div>
                  <div className="font-medium text-sm">{description.split(' - ')[0]}</div>
                  <div className="text-xs text-muted-foreground">
                    {description.split(' - ')[1]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Permission Changes */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Permission Changes</CardTitle>
          <CardDescription>
            Audit trail of recent permission modifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Role assigned: {userRole}</p>
                  <p className="text-xs text-muted-foreground">System initialization</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">Just now</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Session security configured</p>
                  <p className="text-xs text-muted-foreground">
                    Auto-lock: {sessionSecurity.autoLockMinutes}min, Max session: {sessionSecurity.maxSessionHours}h
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">Just now</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}