import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { 
  Users, 
  Shield, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { 
  UserRole, 
  PERMISSION_MATRIX, 
  hasPermission, 
  getUserPermissions,
  ROLE_HIERARCHY,
  SESSION_SECURITY 
} from "../utils/permissions";

interface RoleManagementProps {
  userRole: UserRole;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "suspended" | "pending";
  lastLogin: Date;
  createdAt: Date;
  twoFactorEnabled: boolean;
  trustedDevice: boolean;
  ipWhitelisted: boolean;
}

interface RoleChangeRequest {
  id: string;
  userId: string;
  currentRole: UserRole;
  requestedRole: UserRole;
  requestedBy: string;
  requestedAt: Date;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  approvedAt?: Date;
}

export function RoleManagement({ userRole }: RoleManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showRoleChangeDialog, setShowRoleChangeDialog] = useState(false);

  // Mock data - in real app this would come from your backend
  const [adminUsers] = useState<AdminUser[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john@company.com",
      role: "SUPER_ADMIN",
      status: "active",
      lastLogin: new Date("2024-01-15T10:30:00"),
      createdAt: new Date("2023-06-01"),
      twoFactorEnabled: true,
      trustedDevice: true,
      ipWhitelisted: true
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "CONTENT_MANAGER",
      status: "active",
      lastLogin: new Date("2024-01-15T14:20:00"),
      createdAt: new Date("2023-08-15"),
      twoFactorEnabled: true,
      trustedDevice: false,
      ipWhitelisted: false
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike@company.com",
      role: "MODERATOR",
      status: "active",
      lastLogin: new Date("2024-01-15T09:15:00"),
      createdAt: new Date("2023-09-20"),
      twoFactorEnabled: true,
      trustedDevice: true,
      ipWhitelisted: false
    },
    {
      id: "4",
      name: "Emma Davis",
      email: "emma@company.com",
      role: "FINANCE",
      status: "active",
      lastLogin: new Date("2024-01-14T16:45:00"),
      createdAt: new Date("2023-07-10"),
      twoFactorEnabled: true,
      trustedDevice: true,
      ipWhitelisted: true
    },
    {
      id: "5",
      name: "Alex Wilson",
      email: "alex@company.com",
      role: "SUPPORT",
      status: "suspended",
      lastLogin: new Date("2024-01-10T11:30:00"),
      createdAt: new Date("2023-11-05"),
      twoFactorEnabled: false,
      trustedDevice: false,
      ipWhitelisted: false
    }
  ]);

  const [roleChangeRequests] = useState<RoleChangeRequest[]>([
    {
      id: "1",
      userId: "6",
      currentRole: "SUPPORT",
      requestedRole: "MODERATOR",
      requestedBy: "sarah@company.com",
      requestedAt: new Date("2024-01-14T10:00:00"),
      reason: "Need moderation capabilities for new team responsibilities",
      status: "pending"
    },
    {
      id: "2",
      userId: "7",
      currentRole: "READ_ONLY",
      requestedRole: "ANALYST",
      requestedBy: "john@company.com",
      requestedAt: new Date("2024-01-13T15:30:00"),
      reason: "Promotion to analytics team lead position",
      status: "pending"
    }
  ]);

  const canManageRoles = hasPermission(userRole, "users", "C") && hasPermission(userRole, "users", "U");
  const canDeleteUsers = hasPermission(userRole, "users", "D");

  const filteredUsers = adminUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "suspended": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!canManageRoles) {
    return (
      <div className="p-6">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to manage user roles and permissions.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Role & Permission Management</h1>
          <p className="text-muted-foreground">
            Manage admin user roles, permissions, and access controls
          </p>
        </div>
        {canManageRoles && (
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Admin User
          </Button>
        )}
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Admin Users</TabsTrigger>
          <TabsTrigger value="permissions">Role Permissions</TabsTrigger>
          <TabsTrigger value="requests">Role Change Requests</TabsTrigger>
          <TabsTrigger value="security">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>
                Manage admin user accounts and their role assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole | "all")}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    <SelectItem value="COMPLIANCE">Compliance</SelectItem>
                    <SelectItem value="FINANCE">Finance</SelectItem>
                    <SelectItem value="MODERATOR">Moderator</SelectItem>
                    <SelectItem value="CONTENT_MANAGER">Content Manager</SelectItem>
                    <SelectItem value="SUPPORT">Support</SelectItem>
                    <SelectItem value="ANALYST">Analyst</SelectItem>
                    <SelectItem value="READ_ONLY">Read Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Security</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {user.twoFactorEnabled && (
                            <Badge variant="outline" className="text-xs">2FA</Badge>
                          )}
                          {user.trustedDevice && (
                            <Badge variant="outline" className="text-xs">Trusted</Badge>
                          )}
                          {user.ipWhitelisted && (
                            <Badge variant="outline" className="text-xs">IP Safe</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(user.lastLogin)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEditDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {canDeleteUsers && user.role !== "SUPER_ADMIN" && (
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Permission Matrix</CardTitle>
              <CardDescription>
                View and configure permissions for each role across all modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead>Super Admin</TableHead>
                      <TableHead>Compliance</TableHead>
                      <TableHead>Finance</TableHead>
                      <TableHead>Moderator</TableHead>
                      <TableHead>Content Mgr</TableHead>
                      <TableHead>Support</TableHead>
                      <TableHead>Analyst</TableHead>
                      <TableHead>Read Only</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(PERMISSION_MATRIX).map(([module, permissions]) => (
                      <TableRow key={module}>
                        <TableCell className="font-medium">
                          {module.replace('_', ' ').toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{permissions.SUPER_ADMIN || "—"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{permissions.COMPLIANCE || "—"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{permissions.FINANCE || "—"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{permissions.MODERATOR || "—"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{permissions.CONTENT_MANAGER || "—"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{permissions.SUPPORT || "—"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{permissions.ANALYST || "—"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{permissions.READ_ONLY || "—"}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Permission Codes:</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                  <div><strong>R</strong> - Read</div>
                  <div><strong>C</strong> - Create</div>
                  <div><strong>U</strong> - Update</div>
                  <div><strong>D</strong> - Delete</div>
                  <div><strong>A</strong> - Approve/Review</div>
                  <div><strong>M</strong> - Moderate/Sanction</div>
                  <div><strong>F</strong> - Refund</div>
                  <div><strong>P</strong> - Payout</div>
                  <div><strong>G</strong> - Configure</div>
                  <div><strong>X</strong> - Export</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Change Requests</CardTitle>
              <CardDescription>
                Review and approve pending role change requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Requested Role</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roleChangeRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>User #{request.userId}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(request.currentRole)}>
                          {request.currentRole.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(request.requestedRole)}>
                          {request.requestedRole.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.requestedBy}</TableCell>
                      <TableCell>{formatDate(request.requestedAt)}</TableCell>
                      <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="default">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings by Role</CardTitle>
              <CardDescription>
                Configure security requirements for different admin roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>2FA Required</TableHead>
                    <TableHead>Auto-Lock (min)</TableHead>
                    <TableHead>Max Session (hrs)</TableHead>
                    <TableHead>Trusted Device</TableHead>
                    <TableHead>IP Whitelist</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(SESSION_SECURITY).map(([role, settings]) => (
                    <TableRow key={role}>
                      <TableCell>
                        <Badge className={getRoleColor(role as UserRole)}>
                          {role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {settings.requiresTwoFA ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </TableCell>
                      <TableCell>{settings.autoLockMinutes}</TableCell>
                      <TableCell>{settings.maxSessionHours}</TableCell>
                      <TableCell>
                        {settings.trustedDeviceRequired ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </TableCell>
                      <TableCell>
                        {settings.ipWhitelistRequired ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Admin User</DialogTitle>
            <DialogDescription>
              Create a new admin account with appropriate role and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter full name" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="Enter email address" />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="READ_ONLY">Read Only</SelectItem>
                  <SelectItem value="SUPPORT">Support</SelectItem>
                  <SelectItem value="ANALYST">Analyst</SelectItem>
                  <SelectItem value="CONTENT_MANAGER">Content Manager</SelectItem>
                  <SelectItem value="MODERATOR">Moderator</SelectItem>
                  <SelectItem value="FINANCE">Finance</SelectItem>
                  <SelectItem value="COMPLIANCE">Compliance</SelectItem>
                  {userRole === "SUPER_ADMIN" && (
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddDialog(false)}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}