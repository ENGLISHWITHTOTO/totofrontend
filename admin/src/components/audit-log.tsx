import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Calendar as CalendarIcon,
  Eye,
  AlertTriangle,
  Shield,
  DollarSign,
  Settings,
  User,
  Clock,
  MapPin
} from "lucide-react";
import { 
  UserRole, 
  AuditEvent, 
  AuditEventType,
  ModuleName,
  hasPermission 
} from "../utils/permissions";

interface AuditLogProps {
  userRole: UserRole;
}

export function AuditLog({ userRole }: AuditLogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventType, setSelectedEventType] = useState<AuditEventType | "all">("all");
  const [selectedModule, setSelectedModule] = useState<ModuleName | "all">("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  const canAccessAudit = hasPermission(userRole, "audit", "R");
  const canExportAudit = hasPermission(userRole, "audit", "X");

  // Mock audit events - in real app this would come from your backend
  const [auditEvents] = useState<AuditEvent[]>([
    {
      id: "1",
      timestamp: new Date("2024-01-15T10:30:00"),
      userId: "john@company.com",
      userRole: "SUPER_ADMIN",
      eventType: "role_change",
      module: "users",
      targetId: "user_123",
      targetType: "user",
      description: "Changed user role from SUPPORT to MODERATOR",
      details: {
        previousRole: "SUPPORT",
        newRole: "MODERATOR",
        reason: "Promotion to team lead"
      },
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      sessionId: "sess_abc123"
    },
    {
      id: "2",
      timestamp: new Date("2024-01-15T14:20:00"),
      userId: "sarah@company.com",
      userRole: "CONTENT_MANAGER",
      eventType: "marketplace_approval",
      module: "marketplace",
      targetId: "course_456",
      targetType: "course",
      description: "Approved marketplace course submission",
      details: {
        courseTitle: "Advanced React Development",
        instructor: "Alice Smith",
        price: 99.99,
        category: "Programming"
      },
      ipAddress: "192.168.1.105",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      sessionId: "sess_def456"
    },
    {
      id: "3",
      timestamp: new Date("2024-01-15T16:45:00"),
      userId: "emma@company.com",
      userRole: "FINANCE",
      eventType: "refund_execution",
      module: "billing",
      targetId: "txn_789",
      targetType: "transaction",
      description: "Processed refund for subscription cancellation",
      details: {
        amount: 299.99,
        currency: "USD",
        reason: "Customer request - technical issues",
        customerId: "cust_123",
        originalTransactionId: "txn_original_789"
      },
      ipAddress: "192.168.1.110",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      sessionId: "sess_ghi789"
    },
    {
      id: "4",
      timestamp: new Date("2024-01-15T09:15:00"),
      userId: "mike@company.com",
      userRole: "MODERATOR",
      eventType: "user_suspension",
      module: "moderation",
      targetId: "user_999",
      targetType: "user",
      description: "Suspended user account for policy violations",
      details: {
        reason: "Repeated inappropriate content posting",
        duration: "7 days",
        violationType: "content_policy",
        reportCount: 5
      },
      ipAddress: "192.168.1.115",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      sessionId: "sess_jkl012"
    },
    {
      id: "5",
      timestamp: new Date("2024-01-14T11:30:00"),
      userId: "alex@company.com",
      userRole: "SUPPORT",
      eventType: "impersonation_start",
      module: "users",
      targetId: "user_555",
      targetType: "user",
      description: "Started user impersonation session for support",
      details: {
        customerEmail: "customer@example.com",
        supportTicket: "TICK-12345",
        reason: "Account access issues"
      },
      ipAddress: "192.168.1.120",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      sessionId: "sess_mno345"
    },
    {
      id: "6",
      timestamp: new Date("2024-01-14T08:45:00"),
      userId: "john@company.com",
      userRole: "SUPER_ADMIN",
      eventType: "system_config_change",
      module: "settings",
      targetId: "config_ai_limits",
      targetType: "configuration",
      description: "Updated AI credit limits and pricing",
      details: {
        previousLimits: { daily: 100, monthly: 2000 },
        newLimits: { daily: 150, monthly: 3000 },
        priceChange: { from: 0.05, to: 0.045 },
        reason: "Optimization based on usage patterns"
      },
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      sessionId: "sess_pqr678"
    }
  ]);

  const filteredEvents = auditEvents.filter(event => {
    const matchesSearch = event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEventType = selectedEventType === "all" || event.eventType === selectedEventType;
    const matchesModule = selectedModule === "all" || event.module === selectedModule;
    const matchesUser = selectedUser === "all" || event.userId === selectedUser;
    
    let matchesDate = true;
    if (dateRange.from && dateRange.to) {
      matchesDate = event.timestamp >= dateRange.from && event.timestamp <= dateRange.to;
    }
    
    return matchesSearch && matchesEventType && matchesModule && matchesUser && matchesDate;
  });

  const getEventTypeIcon = (eventType: AuditEventType) => {
    const icons = {
      role_change: User,
      permission_change: Shield,
      user_ban: AlertTriangle,
      user_suspension: AlertTriangle,
      user_warning: AlertTriangle,
      marketplace_approval: Shield,
      marketplace_rejection: Shield,
      content_edit: FileText,
      price_change: DollarSign,
      refund_execution: DollarSign,
      payout_execution: DollarSign,
      ai_template_change: Settings,
      credit_policy_change: Settings,
      impersonation_start: User,
      impersonation_end: User,
      sensitive_data_access: Shield,
      bulk_action: FileText,
      system_config_change: Settings
    };
    return icons[eventType] || FileText;
  };

  const getEventTypeColor = (eventType: AuditEventType) => {
    const colors = {
      role_change: "bg-blue-100 text-blue-800",
      permission_change: "bg-purple-100 text-purple-800",
      user_ban: "bg-red-100 text-red-800",
      user_suspension: "bg-orange-100 text-orange-800",
      user_warning: "bg-yellow-100 text-yellow-800",
      marketplace_approval: "bg-green-100 text-green-800",
      marketplace_rejection: "bg-red-100 text-red-800",
      content_edit: "bg-blue-100 text-blue-800",
      price_change: "bg-indigo-100 text-indigo-800",
      refund_execution: "bg-pink-100 text-pink-800",
      payout_execution: "bg-green-100 text-green-800",
      ai_template_change: "bg-cyan-100 text-cyan-800",
      credit_policy_change: "bg-teal-100 text-teal-800",
      impersonation_start: "bg-orange-100 text-orange-800",
      impersonation_end: "bg-gray-100 text-gray-800",
      sensitive_data_access: "bg-purple-100 text-purple-800",
      bulk_action: "bg-indigo-100 text-indigo-800",
      system_config_change: "bg-red-100 text-red-800"
    };
    return colors[eventType] || "bg-gray-100 text-gray-800";
  };

  const getRiskLevel = (eventType: AuditEventType) => {
    const highRisk = [
      "role_change", "permission_change", "user_ban", "payout_execution", 
      "system_config_change", "sensitive_data_access"
    ];
    const mediumRisk = [
      "user_suspension", "refund_execution", "ai_template_change", 
      "credit_policy_change", "bulk_action"
    ];
    
    if (highRisk.includes(eventType)) return "HIGH";
    if (mediumRisk.includes(eventType)) return "MEDIUM";
    return "LOW";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  if (!canAccessAudit) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3>Access Denied</h3>
              <p className="text-muted-foreground">
                You don't have permission to access the audit log.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Audit Log</h1>
          <p className="text-muted-foreground">
            Track all administrative actions and system changes
          </p>
        </div>
        {canExportAudit && (
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Log
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Events</CardTitle>
          <CardDescription>
            Comprehensive log of all administrative actions and system changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="events" className="space-y-4">
            <TabsList>
              <TabsTrigger value="events">All Events</TabsTrigger>
              <TabsTrigger value="high-risk">High Risk</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="space-y-4">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedEventType} onValueChange={(value) => setSelectedEventType(value as AuditEventType | "all")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="role_change">Role Change</SelectItem>
                    <SelectItem value="user_ban">User Ban</SelectItem>
                    <SelectItem value="user_suspension">User Suspension</SelectItem>
                    <SelectItem value="marketplace_approval">Marketplace Approval</SelectItem>
                    <SelectItem value="refund_execution">Refund</SelectItem>
                    <SelectItem value="payout_execution">Payout</SelectItem>
                    <SelectItem value="system_config_change">System Config</SelectItem>
                    <SelectItem value="impersonation_start">Impersonation</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedModule} onValueChange={(value) => setSelectedModule(value as ModuleName | "all")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="marketplace">Marketplace</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="moderation">Moderation</SelectItem>
                    <SelectItem value="settings">Settings</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="john@company.com">John Smith</SelectItem>
                    <SelectItem value="sarah@company.com">Sarah Johnson</SelectItem>
                    <SelectItem value="emma@company.com">Emma Davis</SelectItem>
                    <SelectItem value="mike@company.com">Mike Chen</SelectItem>
                    <SelectItem value="alex@company.com">Alex Wilson</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Date Range
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Events Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => {
                    const IconComponent = getEventTypeIcon(event.eventType);
                    const riskLevel = getRiskLevel(event.eventType);
                    
                    return (
                      <TableRow key={event.id}>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            {formatDate(event.timestamp)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">{event.userId}</div>
                            <Badge variant="outline" className="text-xs">
                              {event.userRole.replace('_', ' ')}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" />
                            <Badge className={getEventTypeColor(event.eventType)}>
                              {event.eventType.replace('_', ' ')}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {event.module.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={riskLevel === "HIGH" ? "destructive" : riskLevel === "MEDIUM" ? "default" : "secondary"}
                          >
                            {riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate">{event.description}</div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="high-risk">
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3>High Risk Events</h3>
                <p className="text-muted-foreground">
                  Critical system changes and sensitive operations
                </p>
              </div>
            </TabsContent>

            <TabsContent value="financial">
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3>Financial Events</h3>
                <p className="text-muted-foreground">
                  Refunds, payouts, and billing-related activities
                </p>
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3>Security Events</h3>
                <p className="text-muted-foreground">
                  Authentication, authorization, and access control events
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Event Details</DialogTitle>
            <DialogDescription>
              Complete information about this audit event
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Timestamp</Label>
                  <p className="text-sm">{formatDate(selectedEvent.timestamp)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Event ID</Label>
                  <p className="text-sm font-mono">{selectedEvent.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">User</Label>
                  <p className="text-sm">{selectedEvent.userId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                  <Badge className="text-xs">{selectedEvent.userRole.replace('_', ' ')}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Module</Label>
                  <Badge variant="outline" className="text-xs">{selectedEvent.module}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Event Type</Label>
                  <Badge className={getEventTypeColor(selectedEvent.eventType)}>
                    {selectedEvent.eventType.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="text-sm mt-1">{selectedEvent.description}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Technical Details</Label>
                <div className="bg-muted p-3 rounded-md mt-1">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(selectedEvent.details, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>IP: {selectedEvent.ipAddress}</span>
                  </div>
                </div>
                <div>
                  <span>Session: {selectedEvent.sessionId}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}