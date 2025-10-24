import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  Plus, 
  MessageSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  MoreHorizontal,
  User,
  Calendar,
  Tag,
  ArrowRight,
  Paperclip,
  Send,
  UserPlus,
  TrendingUp,
  AlertCircle,
  FileText,
  Download,
  Settings,
  Edit
} from "lucide-react";
import { UserRole, hasPermission } from "../utils/permissions";
import { PermissionGate } from "./permission-gate";

interface TicketData {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'account' | 'content' | 'marketplace' | 'other';
  customer: {
    id: string;
    name: string;
    email: string;
    type: 'student' | 'teacher' | 'institution' | 'homestay';
    avatar?: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  resolution?: string;
  tags: string[];
  messages: TicketMessage[];
  attachments: string[];
  escalated: boolean;
  slaStatus: 'on_time' | 'at_risk' | 'overdue';
}

interface TicketMessage {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    type: 'customer' | 'support' | 'system';
    avatar?: string;
  };
  timestamp: Date;
  isInternal: boolean;
  attachments?: string[];
}

interface TicketType {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultPriority: 'low' | 'medium' | 'high' | 'urgent';
  slaHours: number;
  autoAssignTo: string;
  requiredFields: string[];
  escalationRules: {
    escalateAfterHours: number;
    escalateTo: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomerSupportProps {
  userRole: UserRole;
}

export function CustomerSupport({ userRole }: CustomerSupportProps) {
  const [selectedTab, setSelectedTab] = useState("tickets");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [showCreateTicketType, setShowCreateTicketType] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null);
  const [ticketTypeSearchQuery, setTicketTypeSearchQuery] = useState("");

  // Mock ticket types data
  const ticketTypes: TicketType[] = [
    {
      id: "type-001",
      name: "Payment Issue",
      description: "Issues related to payments, refunds, and billing",
      category: "billing",
      defaultPriority: "high",
      slaHours: 24,
      autoAssignTo: "billing-team",
      requiredFields: ["transaction_id", "amount", "payment_method"],
      escalationRules: {
        escalateAfterHours: 48,
        escalateTo: "finance-manager"
      },
      isActive: true,
      createdAt: new Date("2024-01-01T10:00:00"),
      updatedAt: new Date("2024-01-15T14:30:00")
    },
    {
      id: "type-002",
      name: "Course Access Problem",
      description: "Students unable to access purchased courses or content",
      category: "technical",
      defaultPriority: "high",
      slaHours: 12,
      autoAssignTo: "tech-support",
      requiredFields: ["course_id", "purchase_date", "user_account"],
      escalationRules: {
        escalateAfterHours: 24,
        escalateTo: "senior-tech-lead"
      },
      isActive: true,
      createdAt: new Date("2024-01-01T10:00:00"),
      updatedAt: new Date("2024-01-10T09:15:00")
    },
    {
      id: "type-003",
      name: "Account Verification",
      description: "Issues with document verification for institutions and homestays",
      category: "account",
      defaultPriority: "medium",
      slaHours: 72,
      autoAssignTo: "verification-team",
      requiredFields: ["document_type", "rejection_reason", "user_type"],
      escalationRules: {
        escalateAfterHours: 96,
        escalateTo: "compliance-manager"
      },
      isActive: true,
      createdAt: new Date("2024-01-01T10:00:00"),
      updatedAt: new Date("2024-01-12T16:45:00")
    },
    {
      id: "type-004",
      name: "Content Quality Report",
      description: "Reports about course content quality, accuracy, or inappropriate material",
      category: "content",
      defaultPriority: "medium",
      slaHours: 48,
      autoAssignTo: "content-moderation",
      requiredFields: ["content_id", "issue_type", "evidence"],
      escalationRules: {
        escalateAfterHours: 72,
        escalateTo: "content-manager"
      },
      isActive: true,
      createdAt: new Date("2024-01-01T10:00:00"),
      updatedAt: new Date("2024-01-08T11:20:00")
    },
    {
      id: "type-005",
      name: "General Inquiry",
      description: "General questions and support requests",
      category: "other",
      defaultPriority: "low",
      slaHours: 48,
      autoAssignTo: "manual",
      requiredFields: ["inquiry_type"],
      escalationRules: {
        escalateAfterHours: 120,
        escalateTo: "support-supervisor"
      },
      isActive: true,
      createdAt: new Date("2024-01-01T10:00:00"),
      updatedAt: new Date("2024-01-05T13:10:00")
    }
  ];

  // Mock ticket data
  const tickets: TicketData[] = [
    {
      id: "TICK-001",
      title: "Unable to access course content after payment",
      description: "Customer paid for premium course but cannot access the content. Payment was processed successfully.",
      status: "open",
      priority: "high",
      category: "technical",
      customer: {
        id: "user-123",
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        type: "student"
      },
      assignedTo: {
        id: "agent-001",
        name: "Alex Chen",
        role: "Senior Support Agent"
      },
      createdAt: new Date("2024-01-15T10:30:00"),
      updatedAt: new Date("2024-01-15T14:22:00"),
      dueDate: new Date("2024-01-16T10:30:00"),
      tags: ["payment", "course-access", "urgent"],
      messages: [
        {
          id: "msg-001",
          content: "I paid for the advanced Spanish course yesterday but I still can't access it. The payment went through on my credit card.",
          author: {
            id: "user-123",
            name: "Sarah Johnson",
            type: "customer"
          },
          timestamp: new Date("2024-01-15T10:30:00"),
          isInternal: false
        },
        {
          id: "msg-002",
          content: "Hi Sarah, I can see your payment was processed successfully. Let me check your course enrollment status.",
          author: {
            id: "agent-001",
            name: "Alex Chen",
            type: "support"
          },
          timestamp: new Date("2024-01-15T14:22:00"),
          isInternal: false
        }
      ],
      attachments: ["payment_receipt.pdf"],
      escalated: false,
      slaStatus: "at_risk"
    },
    {
      id: "TICK-002",
      title: "Homestay verification documents rejected",
      description: "Homestay provider's documents were rejected but they believe they meet all requirements.",
      status: "in_progress",
      priority: "medium",
      category: "account",
      customer: {
        id: "host-456",
        name: "Maria Rodriguez",
        email: "maria.r@homestay.com",
        type: "homestay"
      },
      assignedTo: {
        id: "agent-002",
        name: "Jessica Wong",
        role: "Verification Specialist"
      },
      createdAt: new Date("2024-01-14T16:45:00"),
      updatedAt: new Date("2024-01-15T09:15:00"),
      tags: ["verification", "homestay", "documents"],
      messages: [
        {
          id: "msg-003",
          content: "My verification documents were rejected but I don't understand why. I have all the required certificates.",
          author: {
            id: "host-456",
            name: "Maria Rodriguez",
            type: "customer"
          },
          timestamp: new Date("2024-01-14T16:45:00"),
          isInternal: false
        }
      ],
      attachments: ["certificate.pdf", "license.jpg"],
      escalated: false,
      slaStatus: "on_time"
    },
    {
      id: "TICK-003",
      title: "Institution billing discrepancy",
      description: "University claims they were charged incorrect amount for monthly subscription.",
      status: "waiting_customer",
      priority: "high",
      category: "billing",
      customer: {
        id: "uni-789",
        name: "Cambridge University",
        email: "billing@cambridge.edu",
        type: "institution"
      },
      assignedTo: {
        id: "agent-003",
        name: "Michael Brown",
        role: "Billing Specialist"
      },
      createdAt: new Date("2024-01-13T11:20:00"),
      updatedAt: new Date("2024-01-14T15:30:00"),
      dueDate: new Date("2024-01-17T11:20:00"),
      tags: ["billing", "institution", "subscription"],
      messages: [],
      attachments: ["billing_statement.pdf"],
      escalated: true,
      slaStatus: "on_time"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { variant: "destructive" as const, icon: AlertCircle, text: "Open" },
      in_progress: { variant: "default" as const, icon: Clock, text: "In Progress" },
      waiting_customer: { variant: "secondary" as const, icon: MessageSquare, text: "Waiting Customer" },
      resolved: { variant: "outline" as const, icon: CheckCircle, text: "Resolved" },
      closed: { variant: "outline" as const, icon: XCircle, text: "Closed" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { variant: "outline" as const, text: "Low" },
      medium: { variant: "secondary" as const, text: "Medium" },
      high: { variant: "default" as const, text: "High" },
      urgent: { variant: "destructive" as const, text: "Urgent" }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getSlaStatusBadge = (slaStatus: string) => {
    const slaConfig = {
      on_time: { variant: "outline" as const, icon: CheckCircle, text: "On Time", color: "text-green-600" },
      at_risk: { variant: "secondary" as const, icon: AlertTriangle, text: "At Risk", color: "text-yellow-600" },
      overdue: { variant: "destructive" as const, icon: XCircle, text: "Overdue", color: "text-red-600" }
    };
    
    const config = slaConfig[slaStatus as keyof typeof slaConfig];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const getCustomerTypeBadge = (type: string) => {
    const typeConfig = {
      student: { variant: "outline" as const, text: "Student" },
      teacher: { variant: "secondary" as const, text: "Teacher" },
      institution: { variant: "default" as const, text: "Institution" },
      homestay: { variant: "outline" as const, text: "Homestay" }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesAssigned = assignedFilter === "all" || 
      (assignedFilter === "unassigned" && !ticket.assignedTo) ||
      (assignedFilter === "assigned" && ticket.assignedTo);
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssigned;
  });

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    overdue: tickets.filter(t => t.slaStatus === 'overdue').length,
    escalated: tickets.filter(t => t.escalated).length
  };

  const renderTicketsList = () => (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets by title, customer, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="waiting_customer">Waiting Customer</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={assignedFilter} onValueChange={setAssignedFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Assignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tickets</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
            </SelectContent>
          </Select>

          <PermissionGate
            userRole={userRole}
            module="support_tickets"
            permission="C"
          >
            <Button onClick={() => setShowCreateTicket(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </PermissionGate>
        </div>
      </div>

      {/* Tickets Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow 
                key={ticket.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedTicket(ticket)}
              >
                <TableCell>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{ticket.id}</span>
                      {ticket.escalated && (
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate max-w-60">
                      {ticket.title}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {ticket.customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{ticket.customer.name}</p>
                      <div className="flex items-center gap-1">
                        {getCustomerTypeBadge(ticket.customer.type)}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                <TableCell>
                  {ticket.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {ticket.assignedTo.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{ticket.assignedTo.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>{getSlaStatusBadge(ticket.slaStatus)}</TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {ticket.updatedAt.toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedTicket(ticket)}>
                        View Details
                      </DropdownMenuItem>
                      <PermissionGate userRole={userRole} module="support_tickets" permission="U">
                        <DropdownMenuItem>Assign to Me</DropdownMenuItem>
                        <DropdownMenuItem>Change Status</DropdownMenuItem>
                        <DropdownMenuItem>Escalate</DropdownMenuItem>
                      </PermissionGate>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );

  const renderTicketDetail = () => {
    if (!selectedTicket) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedTicket(null)}
            className="mb-4"
          >
            ← Back to Tickets
          </Button>
          
          <div className="flex gap-2">
            <PermissionGate userRole={userRole} module="support_tickets" permission="U">
              <Button variant="outline">
                <UserPlus className="w-4 h-4 mr-2" />
                Assign
              </Button>
              <Button variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Escalate
              </Button>
            </PermissionGate>
            <PermissionGate userRole={userRole} module="support_tickets" permission="A">
              <Button>
                <CheckCircle className="w-4 h-4 mr-2" />
                Resolve
              </Button>
            </PermissionGate>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {selectedTicket.id}
                      {selectedTicket.escalated && (
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {selectedTicket.title}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    {getStatusBadge(selectedTicket.status)}
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{selectedTicket.description}</p>
                
                {selectedTicket.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-4">
                    {selectedTicket.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle>Conversation</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {selectedTicket.messages.map((message) => (
                      <div 
                        key={message.id}
                        className={`flex gap-3 ${message.author.type === 'customer' ? 'flex-row' : 'flex-row-reverse'}`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {message.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className={`flex-1 ${message.author.type === 'customer' ? 'text-left' : 'text-right'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{message.author.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleString()}
                            </span>
                            {message.isInternal && (
                              <Badge variant="secondary" className="text-xs">Internal</Badge>
                            )}
                          </div>
                          
                          <div className={`p-3 rounded-lg max-w-md ${
                            message.author.type === 'customer' 
                              ? 'bg-muted text-foreground' 
                              : 'bg-primary text-primary-foreground'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Separator className="my-4" />

                <PermissionGate userRole={userRole} module="support_tickets" permission="U">
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Type your response..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Paperclip className="w-4 h-4 mr-2" />
                          Attach
                        </Button>
                        <Button variant="outline" size="sm">
                          Internal Note
                        </Button>
                      </div>
                      <Button disabled={!newMessage.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </PermissionGate>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedTicket.customer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedTicket.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedTicket.customer.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    {getCustomerTypeBadge(selectedTicket.customer.type)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Customer ID:</span>
                    <span className="text-sm font-mono">{selectedTicket.customer.id}</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Ticket Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Category:</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {selectedTicket.category}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Created:</span>
                    <span className="text-sm">{selectedTicket.createdAt.toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Updated:</span>
                    <span className="text-sm">{selectedTicket.updatedAt.toLocaleDateString()}</span>
                  </div>
                  
                  {selectedTicket.dueDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Due Date:</span>
                      <span className="text-sm">{selectedTicket.dueDate.toLocaleDateString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">SLA Status:</span>
                    {getSlaStatusBadge(selectedTicket.slaStatus)}
                  </div>
                </div>

                {selectedTicket.assignedTo && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Assigned To:</p>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {selectedTicket.assignedTo.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{selectedTicket.assignedTo.name}</p>
                          <p className="text-xs text-muted-foreground">{selectedTicket.assignedTo.role}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {selectedTicket.attachments.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Attachments:</p>
                      <div className="space-y-1">
                        {selectedTicket.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4" />
                            <span className="flex-1 truncate">{attachment}</span>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tickets</p>
                <p className="text-2xl font-semibold">{ticketStats.total}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-2xl font-semibold text-red-600">{ticketStats.open}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-semibold text-blue-600">{ticketStats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-semibold text-orange-600">{ticketStats.overdue}</p>
              </div>
              <XCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Escalated</p>
                <p className="text-2xl font-semibold text-yellow-600">{ticketStats.escalated}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
          <CardDescription>Latest customer support requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.slice(0, 5).map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{ticket.id}</span>
                      {ticket.escalated && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{ticket.title}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {getStatusBadge(ticket.status)}
                  {getPriorityBadge(ticket.priority)}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setSelectedTab("tickets");
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTicketTypes = () => {
    const filteredTicketTypes = ticketTypes.filter(type => 
      type.name.toLowerCase().includes(ticketTypeSearchQuery.toLowerCase()) ||
      type.description.toLowerCase().includes(ticketTypeSearchQuery.toLowerCase()) ||
      type.category.toLowerCase().includes(ticketTypeSearchQuery.toLowerCase())
    );

    return (
      <div className="space-y-6">
        {/* Header and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2>Ticket Type Management</h2>
            <p className="text-muted-foreground">
              Configure ticket types that will be available across all dashboards and the app
            </p>
          </div>
          
          <PermissionGate userRole={userRole} module="support_tickets" permission="C">
            <Button onClick={() => setShowCreateTicketType(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Ticket Type
            </Button>
          </PermissionGate>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search ticket types..."
            value={ticketTypeSearchQuery}
            onChange={(e) => setTicketTypeSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Ticket Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTicketTypes.map((ticketType) => (
            <Card key={ticketType.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {ticketType.name}
                      {!ticketType.isActive && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {ticketType.description}
                    </CardDescription>
                  </div>
                  
                  <PermissionGate userRole={userRole} module="support_tickets" permission="U">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedTicketType(ticketType)}>
                          Edit Type
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {ticketType.isActive ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <PermissionGate userRole={userRole} module="support_tickets" permission="D">
                          <DropdownMenuItem className="text-destructive">
                            Delete Type
                          </DropdownMenuItem>
                        </PermissionGate>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </PermissionGate>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <p className="font-medium capitalize">{ticketType.category}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Default Priority:</span>
                    <div className="mt-1">
                      {getPriorityBadge(ticketType.defaultPriority)}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">SLA:</span>
                    <p className="font-medium">{ticketType.slaHours}h</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Auto-assign:</span>
                    <p className="font-medium">{ticketType.autoAssignTo === 'manual' ? 'Manual' : ticketType.autoAssignTo || 'Manual'}</p>
                  </div>
                </div>

                {ticketType.requiredFields.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground">Required Fields:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {ticketType.requiredFields.slice(0, 3).map((field) => (
                        <Badge key={field} variant="outline" className="text-xs">
                          {field.replace('_', ' ')}
                        </Badge>
                      ))}
                      {ticketType.requiredFields.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{ticketType.requiredFields.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground pt-2 border-t">
                  <p>Escalates after {ticketType.escalationRules.escalateAfterHours}h to {ticketType.escalationRules.escalateTo}</p>
                  <p>Updated: {ticketType.updatedAt.toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTicketTypes.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No ticket types found</h3>
              <p className="text-muted-foreground mb-4">
                {ticketTypeSearchQuery ? 'No ticket types match your search.' : 'Get started by creating your first ticket type.'}
              </p>
              <PermissionGate userRole={userRole} module="support_tickets" permission="C">
                <Button onClick={() => setShowCreateTicketType(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ticket Type
                </Button>
              </PermissionGate>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Customer Support</h1>
          <p className="text-muted-foreground">
            Manage customer support tickets and provide assistance
          </p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="tickets">All Tickets</TabsTrigger>
          <PermissionGate userRole={userRole} module="support_tickets" permission="C">
            <TabsTrigger value="ticket-types">Ticket Types</TabsTrigger>
          </PermissionGate>
        </TabsList>

        <TabsContent value="dashboard">
          {renderDashboard()}
        </TabsContent>

        <TabsContent value="tickets">
          {selectedTicket ? renderTicketDetail() : renderTicketsList()}
        </TabsContent>

        <TabsContent value="ticket-types">
          {renderTicketTypes()}
        </TabsContent>
      </Tabs>

      {/* Create Ticket Dialog */}
      <Dialog open={showCreateTicket} onOpenChange={setShowCreateTicket}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>
              Create a new support ticket for a customer
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="customer">Customer</Label>
              <Input id="customer" placeholder="Search for customer..." />
            </div>
            
            <div>
              <Label htmlFor="ticket-type">Ticket Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select ticket type" />
                </SelectTrigger>
                <SelectContent>
                  {ticketTypes.filter(type => type.isActive).map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Brief description of the issue" />
            </div>
            
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Detailed description of the issue" />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateTicket(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCreateTicket(false)}>
                Create Ticket
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Ticket Type Dialog */}
      <Dialog open={showCreateTicketType || selectedTicketType !== null} onOpenChange={(open) => {
        if (!open) {
          setShowCreateTicketType(false);
          setSelectedTicketType(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTicketType ? 'Edit Ticket Type' : 'Create New Ticket Type'}
            </DialogTitle>
            <DialogDescription>
              {selectedTicketType 
                ? 'Update the ticket type configuration'
                : 'Define a new ticket type that will be available across all dashboards and the app'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium">Basic Information</h4>
              
              <div>
                <Label htmlFor="type-name">Name</Label>
                <Input 
                  id="type-name" 
                  placeholder="e.g., Payment Issue"
                  defaultValue={selectedTicketType?.name || ''}
                />
              </div>
              
              <div>
                <Label htmlFor="type-description">Description</Label>
                <Textarea 
                  id="type-description" 
                  placeholder="Brief description of what this ticket type covers"
                  defaultValue={selectedTicketType?.description || ''}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="type-category">Category</Label>
                <Select defaultValue={selectedTicketType?.category || 'other'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                    <SelectItem value="marketplace">Marketplace</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="default-priority">Default Priority</Label>
                <Select defaultValue={selectedTicketType?.defaultPriority || 'medium'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select default priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Configuration */}
            <div className="space-y-4">
              <h4 className="font-medium">Configuration</h4>
              
              <div>
                <Label htmlFor="sla-hours">SLA Hours</Label>
                <Input 
                  id="sla-hours" 
                  type="number"
                  placeholder="24"
                  defaultValue={selectedTicketType?.slaHours || ''}
                />
              </div>
              
              <div>
                <Label htmlFor="auto-assign">Auto-assign to Team</Label>
                <Select defaultValue={selectedTicketType?.autoAssignTo || 'manual'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual Assignment</SelectItem>
                    <SelectItem value="tech-support">Tech Support</SelectItem>
                    <SelectItem value="billing-team">Billing Team</SelectItem>
                    <SelectItem value="content-moderation">Content Moderation</SelectItem>
                    <SelectItem value="verification-team">Verification Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="escalation-hours">Escalation After (Hours)</Label>
                <Input 
                  id="escalation-hours" 
                  type="number"
                  placeholder="48"
                  defaultValue={selectedTicketType?.escalationRules.escalateAfterHours || 48}
                />
              </div>
              
              <div>
                <Label htmlFor="escalate-to">Escalate To</Label>
                <Input 
                  id="escalate-to" 
                  placeholder="e.g., finance-manager"
                  defaultValue={selectedTicketType?.escalationRules.escalateTo || 'support-supervisor'}
                />
              </div>
              
              <div>
                <Label htmlFor="required-fields">Required Fields (comma-separated)</Label>
                <Textarea 
                  id="required-fields" 
                  placeholder="e.g., transaction_id, amount, payment_method"
                  defaultValue={selectedTicketType?.requiredFields.join(', ') || ''}
                  rows={2}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setShowCreateTicketType(false);
              setSelectedTicketType(null);
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowCreateTicketType(false);
              setSelectedTicketType(null);
            }}>
              {selectedTicketType ? 'Update Type' : 'Create Type'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}