// Permission system configuration and utilities

export type UserRole = 
  | "SUPER_ADMIN" 
  | "MODERATOR" 
  | "CONTENT_MANAGER" 
  | "FINANCE" 
  | "SUPPORT" 
  | "ANALYST" 
  | "READ_ONLY" 
  | "COMPLIANCE";

export type PermissionCode = 
  | "R" // Read
  | "C" // Create
  | "U" // Update
  | "D" // Delete
  | "A" // Approve/Review
  | "M" // Moderate/Sanction
  | "F" // Refund
  | "P" // Payout
  | "G" // Configure (settings/templates/AI)
  | "X"; // Export

export type ModuleName = 
  | "users"
  | "verification" 
  | "taxonomy"
  | "marketplace"
  | "institutions"
  | "homestays"
  | "billing"
  | "credits"
  | "ai_config"
  | "moderation"
  | "support_tickets"
  | "chat"
  | "offers"
  | "promotions"
  | "referrals"
  | "static_content"
  | "analytics"
  | "settings"
  | "audit";

export interface PermissionMatrix {
  [key: string]: {
    [role in UserRole]?: string;
  };
}

// Permission matrix based on the detailed specification
export const PERMISSION_MATRIX: PermissionMatrix = {
  users: {
    SUPER_ADMIN: "RCUDAM",
    MODERATOR: "RM",
    CONTENT_MANAGER: "R",
    FINANCE: "R",
    SUPPORT: "R",
    ANALYST: "R",
    READ_ONLY: "R",
    COMPLIANCE: "R"
  },
  verification: {
    SUPER_ADMIN: "RA",
    MODERATOR: "RA",
    CONTENT_MANAGER: "R",
    FINANCE: "",
    SUPPORT: "",
    ANALYST: "R",
    READ_ONLY: "R",
    COMPLIANCE: "RA"
  },
  taxonomy: {
    SUPER_ADMIN: "RCUD",
    MODERATOR: "",
    CONTENT_MANAGER: "RCUD",
    FINANCE: "",
    SUPPORT: "",
    ANALYST: "R",
    READ_ONLY: "R",
    COMPLIANCE: "R"
  },
  marketplace: {
    SUPER_ADMIN: "RAUM",
    MODERATOR: "RAM",
    CONTENT_MANAGER: "RAU",
    FINANCE: "R",
    SUPPORT: "R",
    ANALYST: "R",
    READ_ONLY: "R",
    COMPLIANCE: "R"
  },
  institutions: {
    SUPER_ADMIN: "RCUDA",
    MODERATOR: "A",
    CONTENT_MANAGER: "RCU",
    FINANCE: "",
    SUPPORT: "RU",
    ANALYST: "R",
    READ_ONLY: "R",
    COMPLIANCE: "RA"
  },
  homestays: {
    SUPER_ADMIN: "RCUDAM",
    MODERATOR: "AM",
    CONTENT_MANAGER: "",
    FINANCE: "",
    SUPPORT: "RU",
    ANALYST: "R",
    READ_ONLY: "R",
    COMPLIANCE: "RA"
  },
  billing: {
    SUPER_ADMIN: "RCUFPX",
    MODERATOR: "",
    CONTENT_MANAGER: "",
    FINANCE: "RCUFPX",
    SUPPORT: "R",
    ANALYST: "RX",
    READ_ONLY: "R",
    COMPLIANCE: "RX"
  },
  credits: {
    SUPER_ADMIN: "RCUG",
    MODERATOR: "",
    CONTENT_MANAGER: "",
    FINANCE: "RU",
    SUPPORT: "U",
    ANALYST: "R",
    READ_ONLY: "R",
    COMPLIANCE: "R"
  },
  ai_config: {
    SUPER_ADMIN: "RCUDG",
    MODERATOR: "",
    CONTENT_MANAGER: "G",
    FINANCE: "",
    SUPPORT: "",
    ANALYST: "R",
    READ_ONLY: "R",
    COMPLIANCE: "R"
  },
  moderation: {
    SUPER_ADMIN: "RCUDMA",
    MODERATOR: "MA",
    CONTENT_MANAGER: "",
    FINANCE: "",
    SUPPORT: "R",
    ANALYST: "R",
    READ_ONLY: "R",
    COMPLIANCE: "RCUDMA"
  },
  support_tickets: {
    SUPER_ADMIN: "RCUDA",
    MODERATOR: "R",
    CONTENT_MANAGER: "",
    FINANCE: "R",
    SUPPORT: "RCUDA",
    ANALYST: "R",
    READ_ONLY: "R",
    COMPLIANCE: "RA"
  },
  chat: {
    SUPER_ADMIN: "RCUDM",
    MODERATOR: "RCUM",
    CONTENT_MANAGER: "R",
    FINANCE: "R",
    SUPPORT: "RCUD",
    ANALYST: "R",
    READ_ONLY: "R",
    COMPLIANCE: "RCUM"
  },
  offers: {
    SUPER_ADMIN: "RCUDG",
    MODERATOR: "RA",
    CONTENT_MANAGER: "RCUDG",
    FINANCE: "",
    SUPPORT: "R",
    ANALYST: "R",
    READ_ONLY: "R",
    COMPLIANCE: "RA"
  },
  promotions: {
    SUPER_ADMIN: "RCUDGX",
    MODERATOR: "RA",
    CONTENT_MANAGER: "RCUD",
    FINANCE: "RX",
    SUPPORT: "R",
    ANALYST: "RX",
    READ_ONLY: "R",
    COMPLIANCE: "RA"
  },
  referrals: {
    SUPER_ADMIN: "RCUDGX",
    MODERATOR: "RM",
    CONTENT_MANAGER: "R",
    FINANCE: "RCUDGX",
    SUPPORT: "R",
    ANALYST: "RX",
    READ_ONLY: "R",
    COMPLIANCE: "RM"
  },
  static_content: {
    SUPER_ADMIN: "RCUDG",
    MODERATOR: "R",
    CONTENT_MANAGER: "RCUDG",
    FINANCE: "",
    SUPPORT: "R",
    ANALYST: "",
    READ_ONLY: "R",
    COMPLIANCE: ""
  },
  analytics: {
    SUPER_ADMIN: "RX",
    MODERATOR: "R",
    CONTENT_MANAGER: "R",
    FINANCE: "RX",
    SUPPORT: "R",
    ANALYST: "RCX",
    READ_ONLY: "R",
    COMPLIANCE: "RX"
  },
  settings: {
    SUPER_ADMIN: "RCUDG",
    MODERATOR: "",
    CONTENT_MANAGER: "G",
    FINANCE: "",
    SUPPORT: "",
    ANALYST: "",
    READ_ONLY: "R",
    COMPLIANCE: "R"
  },
  audit: {
    SUPER_ADMIN: "RX",
    MODERATOR: "R",
    CONTENT_MANAGER: "R",
    FINANCE: "R",
    SUPPORT: "R",
    ANALYST: "RX",
    READ_ONLY: "R",
    COMPLIANCE: "RCX"
  }
};

// Check if user has specific permission for a module
export function hasPermission(
  userRole: UserRole, 
  module: ModuleName, 
  permission: PermissionCode
): boolean {
  const modulePermissions = PERMISSION_MATRIX[module];
  if (!modulePermissions) return false;
  
  const userPermissions = modulePermissions[userRole] || "";
  return userPermissions.includes(permission);
}

// Check if user can access a module at all
export function canAccessModule(userRole: UserRole, module: ModuleName): boolean {
  const modulePermissions = PERMISSION_MATRIX[module];
  if (!modulePermissions) return false;
  
  const userPermissions = modulePermissions[userRole] || "";
  return userPermissions.length > 0;
}

// Get all permissions for a user in a module
export function getUserPermissions(userRole: UserRole, module: ModuleName): PermissionCode[] {
  const modulePermissions = PERMISSION_MATRIX[module];
  if (!modulePermissions) return [];
  
  const userPermissions = modulePermissions[userRole] || "";
  return userPermissions.split('') as PermissionCode[];
}

// Operational guardrails
export interface OperationalLimits {
  maxRefundAmount: number;
  maxPayoutAmount: number;
  maxHourlyRefunds: number;
  maxDailyPriceChanges: number;
  requiresTwoPersonApproval: (amount: number, action: string) => boolean;
  requiresDualControl: (amount: number, action: string) => boolean;
}

export const OPERATIONAL_LIMITS: OperationalLimits = {
  maxRefundAmount: 500,
  maxPayoutAmount: 5000,
  maxHourlyRefunds: 10,
  maxDailyPriceChanges: 5,
  requiresTwoPersonApproval: (amount: number, action: string) => {
    if (action === "payout" && amount > 5000) return true;
    if (action === "refund" && amount > 500) return true;
    return false;
  },
  requiresDualControl: (amount: number, action: string) => {
    if (action === "refund" && amount > 500) return true;
    return false;
  }
};

// Role hierarchy for escalation
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  READ_ONLY: 1,
  SUPPORT: 2,
  ANALYST: 3,
  CONTENT_MANAGER: 4,
  MODERATOR: 5,
  FINANCE: 6,
  COMPLIANCE: 7,
  SUPER_ADMIN: 8
};

// Check if user role has higher or equal privileges than required role
export function hasRoleLevel(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

// Audit event types
export type AuditEventType = 
  | "role_change"
  | "permission_change"
  | "user_ban"
  | "user_suspension"
  | "user_warning"
  | "marketplace_approval"
  | "marketplace_rejection"
  | "content_edit"
  | "price_change"
  | "refund_execution"
  | "payout_execution"
  | "ai_template_change"
  | "credit_policy_change"
  | "impersonation_start"
  | "impersonation_end"
  | "sensitive_data_access"
  | "bulk_action"
  | "system_config_change";

export interface AuditEvent {
  id: string;
  timestamp: Date;
  userId: string;
  userRole: UserRole;
  eventType: AuditEventType;
  module: ModuleName;
  targetId?: string;
  targetType?: string;
  description: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
}

// Session security settings
export interface SessionSecurity {
  requiresTwoFA: boolean;
  autoLockMinutes: number;
  maxSessionHours: number;
  trustedDeviceRequired: boolean;
  ipWhitelistRequired: boolean;
}

export const SESSION_SECURITY: Record<UserRole, SessionSecurity> = {
  SUPER_ADMIN: {
    requiresTwoFA: true,
    autoLockMinutes: 15,
    maxSessionHours: 8,
    trustedDeviceRequired: true,
    ipWhitelistRequired: true
  },
  COMPLIANCE: {
    requiresTwoFA: true,
    autoLockMinutes: 15,
    maxSessionHours: 8,
    trustedDeviceRequired: true,
    ipWhitelistRequired: true
  },
  FINANCE: {
    requiresTwoFA: true,
    autoLockMinutes: 20,
    maxSessionHours: 10,
    trustedDeviceRequired: true,
    ipWhitelistRequired: false
  },
  MODERATOR: {
    requiresTwoFA: true,
    autoLockMinutes: 30,
    maxSessionHours: 12,
    trustedDeviceRequired: false,
    ipWhitelistRequired: false
  },
  CONTENT_MANAGER: {
    requiresTwoFA: true,
    autoLockMinutes: 30,
    maxSessionHours: 10,
    trustedDeviceRequired: false,
    ipWhitelistRequired: false
  },
  SUPPORT: {
    requiresTwoFA: false,
    autoLockMinutes: 45,
    maxSessionHours: 8,
    trustedDeviceRequired: false,
    ipWhitelistRequired: false
  },
  ANALYST: {
    requiresTwoFA: false,
    autoLockMinutes: 60,
    maxSessionHours: 8,
    trustedDeviceRequired: false,
    ipWhitelistRequired: false
  },
  READ_ONLY: {
    requiresTwoFA: false,
    autoLockMinutes: 60,
    maxSessionHours: 6,
    trustedDeviceRequired: false,
    ipWhitelistRequired: false
  }
};

// PII access restrictions
export function canAccessPII(userRole: UserRole): boolean {
  return ["SUPER_ADMIN", "COMPLIANCE", "MODERATOR"].includes(userRole);
}

// Financial data access
export function canAccessFinancialData(userRole: UserRole): boolean {
  return ["SUPER_ADMIN", "FINANCE", "COMPLIANCE"].includes(userRole);
}

// Impersonation permissions
export function canImpersonateUser(userRole: UserRole): boolean {
  return ["SUPER_ADMIN", "SUPPORT", "COMPLIANCE"].includes(userRole);
}

// Role permissions mapping (derived from PERMISSION_MATRIX)
export const ROLE_PERMISSIONS: Record<UserRole, Record<string, PermissionCode[]>> = {};

// Initialize ROLE_PERMISSIONS from PERMISSION_MATRIX
Object.keys(PERMISSION_MATRIX).forEach(module => {
  Object.keys(PERMISSION_MATRIX[module]).forEach(role => {
    if (!ROLE_PERMISSIONS[role as UserRole]) {
      ROLE_PERMISSIONS[role as UserRole] = {};
    }
    const permissions = PERMISSION_MATRIX[module][role as UserRole] || "";
    // Remove duplicates by converting to Set and back to array
    const uniquePermissions = Array.from(new Set(permissions.split(''))) as PermissionCode[];
    ROLE_PERMISSIONS[role as UserRole][module] = uniquePermissions.filter(p => p !== ''); // Remove empty strings
  });
});

// Fill in missing modules for each role with empty arrays
Object.keys(ROLE_PERMISSIONS).forEach(role => {
  Object.keys(PERMISSION_MATRIX).forEach(module => {
    if (!ROLE_PERMISSIONS[role as UserRole][module]) {
      ROLE_PERMISSIONS[role as UserRole][module] = [];
    }
  });
});

// Module permissions definition
export const MODULE_PERMISSIONS: Record<string, PermissionCode[]> = {
  users: ["R", "C", "U", "D", "A", "M"],
  verification: ["R", "A"],
  taxonomy: ["R", "C", "U", "D"],
  marketplace: ["R", "A", "U", "M"],
  institutions: ["R", "C", "U", "D", "A"],
  homestays: ["R", "C", "U", "D", "A", "M"],
  billing: ["R", "C", "U", "F", "P", "X"],
  credits: ["R", "C", "U", "G"],
  ai_config: ["R", "C", "U", "D", "G"],
  moderation: ["R", "C", "U", "D", "M", "A"],
  support_tickets: ["R", "C", "U", "D", "A"],
  chat: ["R", "C", "U", "D", "M"],
  offers: ["R", "C", "U", "D", "G"],
  promotions: ["R", "C", "U", "D", "G", "X"],
  referrals: ["R", "C", "U", "D", "G", "X", "M"],
  static_content: ["R", "C", "U", "D", "G"],
  analytics: ["R", "C", "X"],
  settings: ["R", "C", "U", "D", "G"],
  audit: ["R", "C", "X"]
};

// Permission descriptions
export const PERMISSION_DESCRIPTIONS: Record<PermissionCode, string> = {
  R: "Read - View and access data",
  C: "Create - Add new records or content",  
  U: "Update - Modify existing records",
  D: "Delete - Remove records permanently",
  A: "Approve - Review and approve submissions",
  M: "Moderate - Apply sanctions and moderate content",
  F: "Refund - Process payment refunds",
  P: "Payout - Process payment payouts",
  G: "Configure - Modify system settings and templates",
  X: "Export - Download and export data"
};