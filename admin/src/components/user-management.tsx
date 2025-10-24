import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  Shield, 
  Mail,
  Calendar,
  Users,
  GraduationCap,
  Building,
  Home,
  FileText,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Ban,
  MessageSquare,
  MapPin,
  Globe
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { UserRole, hasPermission, canAccessPII } from "../utils/permissions";
import { PermissionGate } from "./permission-gate";
import { Alert, AlertDescription } from "./ui/alert";
import { TeacherApplications } from "./teacher-applications";
import { InstitutionApplications } from "./institution-applications";
import { HomestayApplications } from "./homestay-applications";

interface UserManagementProps {
  userRole: UserRole;
}

export function UserManagement({ userRole }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Permission checks
  const canViewUsers = hasPermission(userRole, "users", "R");
  const canCreateUsers = hasPermission(userRole, "users", "C");
  const canUpdateUsers = hasPermission(userRole, "users", "U");
  const canDeleteUsers = hasPermission(userRole, "users", "D");
  const canModerateUsers = hasPermission(userRole, "users", "M");
  const canApproveUsers = hasPermission(userRole, "users", "A");
  const canAccessUserPII = canAccessPII(userRole);

  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      role: "student",
      status: "active",
      country: "Canada",
      language: "English",
      joinDate: "2024-01-15",
      lastActive: "2 hours ago",
      subscription: "Premium",
      avatar: null,
      verified: true
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      email: "m.chen@university.edu",
      role: "teacher",
      status: "active",
      country: "United States",
      language: "English",
      joinDate: "2023-08-20",
      lastActive: "1 day ago",
      subscription: "Teacher Pro",
      avatar: null,
      verified: true
    },
    {
      id: 3,
      name: "Cambridge Institute",
      email: "admin@cambridge-inst.edu",
      role: "institution",
      status: "active",
      country: "United Kingdom",
      language: "English",
      joinDate: "2023-05-12",
      lastActive: "3 hours ago",
      subscription: "Enterprise",
      avatar: null,
      verified: true
    },
    {
      id: 4,
      name: "Emma Rodriguez",
      email: "emma.r@homestay.com",
      role: "homestay",
      status: "pending",
      country: "Spain",
      language: "Spanish",
      joinDate: "2024-03-10",
      lastActive: "5 days ago",
      subscription: "Basic",
      avatar: null,
      verified: false
    },
    {
      id: 5,
      name: "Alex Thompson",
      email: "alex.t@email.com",
      role: "student",
      status: "suspended",
      country: "Australia",
      language: "English",
      joinDate: "2024-02-28",
      lastActive: "1 week ago",
      subscription: "Free",
      avatar: null,
      verified: true
    }
  ];

  const teacherApplications = [
    {
      id: 1,
      name: "Dr. Maria Gonzalez",
      email: "maria.g@university.edu",
      country: "Mexico",
      appliedDate: "2024-03-18",
      credentials: [
        { type: "Degree", name: "PhD in Applied Linguistics", institution: "UNAM", verified: true },
        { type: "Certificate", name: "TESOL Certification", institution: "Cambridge", verified: true },
        { type: "Experience", name: "15 years teaching experience", verified: false }
      ],
      sampleLessons: [
        { title: "Advanced Grammar Structures", type: "Video", duration: "25 min", status: "uploaded" },
        { title: "Pronunciation Workshop", type: "Audio + Text", duration: "15 min", status: "uploaded" }
      ],
      languages: ["English", "Spanish"],
      specializations: ["Academic English", "IELTS Preparation"],
      status: "pending_review",
      reviewNotes: []
    },
    {
      id: 2,
      name: "Dr. James Wilson",
      email: "j.wilson@teachingcorp.edu",
      country: "United Kingdom",
      appliedDate: "2024-03-15",
      credentials: [
        { type: "Degree", name: "MA in TESOL", institution: "Oxford University", verified: true },
        { type: "Certificate", name: "Business English Certificate", institution: "British Council", verified: true }
      ],
      sampleLessons: [
        { title: "Business Presentation Skills", type: "Interactive", duration: "30 min", status: "uploaded" }
      ],
      languages: ["English"],
      specializations: ["Business English", "Professional Communication"],
      status: "under_review",
      reviewNotes: ["Excellent credentials", "Sample lesson needs minor adjustments"]
    }
  ];

  const institutionApplications = [
    {
      id: 1,
      name: "Madrid Language Academy",
      email: "admin@madrid-lang.es",
      country: "Spain",
      appliedDate: "2024-03-12",
      legalDocs: [
        { name: "Business Registration", status: "verified", uploadDate: "2024-03-12" },
        { name: "Educational License", status: "verified", uploadDate: "2024-03-12" },
        { name: "Tax Certificate", status: "pending", uploadDate: "2024-03-12" }
      ],
      accreditation: [
        { name: "Instituto Cervantes Accreditation", status: "verified" },
        { name: "EAQUALS Membership", status: "verified" }
      ],
      teamContacts: [
        { name: "Carlos Rodriguez", role: "Director", email: "carlos@madrid-lang.es" },
        { name: "Ana Martinez", role: "Academic Coordinator", email: "ana@madrid-lang.es" }
      ],
      programs: 8,
      languages: ["Spanish", "English"],
      status: "pending_verification"
    }
  ];

  const homestayApplications = [
    {
      id: 1,
      name: "Lisa Chen",
      email: "lisa.chen@email.com",
      country: "Canada",
      city: "Toronto",
      appliedDate: "2024-03-10",
      idVerification: { status: "verified", type: "Passport", verifiedDate: "2024-03-11" },
      propertyProofs: [
        { type: "Property Deed", status: "verified", uploadDate: "2024-03-10" },
        { type: "Utility Bill", status: "verified", uploadDate: "2024-03-10" },
        { type: "Property Photos", status: "verified", uploadDate: "2024-03-10" }
      ],
      backgroundCheck: { status: "pending", requestedDate: "2024-03-11" },
      roomsOffered: 2,
      priceRange: "$60-80/night",
      amenities: ["WiFi", "Meals", "Laundry", "Airport Pickup"],
      languages: ["English", "Mandarin"],
      status: "pending_background_check"
    }
  ];

  const auditLogs = [
    {
      id: 1,
      adminUser: "admin@platform.com",
      action: "User Role Changed",
      target: "sarah.j@email.com",
      details: "Changed role from Student to Teacher",
      timestamp: "2024-03-18 14:23:45",
      ipAddress: "192.168.1.100"
    },
    {
      id: 2,
      adminUser: "moderator@platform.com", 
      action: "User Suspended",
      target: "alex.t@email.com",
      details: "Suspended for inappropriate behavior - 7 days",
      timestamp: "2024-03-18 13:15:22",
      ipAddress: "192.168.1.101"
    },
    {
      id: 3,
      adminUser: "admin@platform.com",
      action: "Teacher Application Approved",
      target: "m.chen@university.edu",
      details: "Approved teacher application after credential verification",
      timestamp: "2024-03-18 11:45:18",
      ipAddress: "192.168.1.100"
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "student": return <GraduationCap className="w-4 h-4" />;
      case "teacher": return <Users className="w-4 h-4" />;
      case "institution": return <Building className="w-4 h-4" />;
      case "homestay": return <Home className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student": return "bg-blue-100 text-blue-800";
      case "teacher": return "bg-green-100 text-green-800";
      case "institution": return "bg-purple-100 text-purple-800";
      case "homestay": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "suspended": return "bg-red-100 text-red-800";
      case "pending_review": return "bg-blue-100 text-blue-800";
      case "under_review": return "bg-purple-100 text-purple-800";
      case "verified": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredUsers.map(user => user.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  if (!canViewUsers) {
    return (
      <div className="p-6">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to view user management.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>Users & Verification</h1>
          <p className="text-muted-foreground">
            Manage platform users and handle verification workflows
          </p>
        </div>
        <div className="flex space-x-2">
          {selectedItems.length > 0 && (
            <>
              <PermissionGate userRole={userRole} module="users" permission="U">
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Message ({selectedItems.length})
                </Button>
              </PermissionGate>
              <PermissionGate userRole={userRole} module="users" permission="M">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Bulk Edit
                </Button>
              </PermissionGate>
              <PermissionGate userRole={userRole} module="users" permission="M">
                <Button variant="destructive">
                  <UserX className="w-4 h-4 mr-2" />
                  Bulk Action
                </Button>
              </PermissionGate>
            </>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'student').length.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'teacher').length.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Teachers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'institution').length}</p>
                <p className="text-sm text-muted-foreground">Institutions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Home className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'homestay').length}</p>
                <p className="text-sm text-muted-foreground">Homestays</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all-users">All Users</TabsTrigger>
          <TabsTrigger value="teacher-applications">Teacher Applications</TabsTrigger>
          <TabsTrigger value="institution-applications">Institution Applications</TabsTrigger>
          <TabsTrigger value="homestay-applications">Homestay Applications</TabsTrigger>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="all-users" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by email, name, or country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="teacher">Teachers</SelectItem>
                    <SelectItem value="institution">Institutions</SelectItem>
                    <SelectItem value="homestay">Homestays</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedItems.length === filteredUsers.length && filteredUsers.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(user.id)}
                          onCheckedChange={(checked) => handleSelectItem(user.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {canAccessUserPII ? user.email : "***@***.***"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          <span className="flex items-center space-x-1">
                            {getRoleIcon(user.role)}
                            <span className="capitalize">{user.role}</span>
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                          {user.verified && (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{user.country}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Globe className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{user.language}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            {canUpdateUsers && (
                              <>
                                <DropdownMenuItem>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Reset Password
                                </DropdownMenuItem>
                              </>
                            )}
                            {canModerateUsers && (
                              <>
                                <DropdownMenuItem>
                                  <Shield className="w-4 h-4 mr-2" />
                                  Change Role
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <UserX className="w-4 h-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teacher-applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Verification Workflow</CardTitle>
              <CardDescription>Review credentials and sample lessons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {teacherApplications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{application.name}</CardTitle>
                          <CardDescription>
                            {application.email} • {application.country} • Applied {application.appliedDate}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Credentials */}
                      <div>
                        <h4 className="font-medium mb-2">Credentials & Experience</h4>
                        <div className="space-y-2">
                          {application.credentials.map((cred, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="text-sm font-medium">{cred.name}</p>
                                <p className="text-xs text-muted-foreground">{cred.type} • {cred.institution}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {cred.verified ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                )}
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sample Lessons */}
                      <div>
                        <h4 className="font-medium mb-2">Sample Lessons</h4>
                        <div className="space-y-2">
                          {application.sampleLessons.map((lesson, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="text-sm font-medium">{lesson.title}</p>
                                <p className="text-xs text-muted-foreground">{lesson.type} • {lesson.duration}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">{lesson.status}</Badge>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4 mr-1" />
                                  Review
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Languages & Specializations */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Languages</h4>
                          <div className="flex flex-wrap gap-1">
                            {application.languages.map((lang, index) => (
                              <Badge key={index} variant="outline" className="text-xs">{lang}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Specializations</h4>
                          <div className="flex flex-wrap gap-1">
                            {application.specializations.map((spec, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">{spec}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Review Notes */}
                      {application.reviewNotes.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Review Notes</h4>
                          <div className="space-y-2">
                            {application.reviewNotes.map((note, index) => (
                              <div key={index} className="p-2 bg-blue-50 rounded text-sm">
                                {note}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex justify-between">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Add Note
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-1" />
                            Request Documents
                          </Button>
                        </div>
                        {userRole === "Admin" && (
                          <div className="flex space-x-2">
                            <Button size="sm">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive">
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="institution-applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Institution Verification Workflow</CardTitle>
              <CardDescription>Review legal documents and accreditation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {institutionApplications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{application.name}</CardTitle>
                          <CardDescription>
                            {application.email} • {application.country} • Applied {application.appliedDate}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Legal Documents */}
                      <div>
                        <h4 className="font-medium mb-2">Legal Documents</h4>
                        <div className="space-y-2">
                          {application.legalDocs.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="text-sm font-medium">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">Uploaded {doc.uploadDate}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(doc.status)} size="sm">
                                  {doc.status}
                                </Badge>
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Accreditation */}
                      <div>
                        <h4 className="font-medium mb-2">Accreditation</h4>
                        <div className="space-y-2">
                          {application.accreditation.map((acc, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <p className="text-sm font-medium">{acc.name}</p>
                              <Badge className={getStatusColor(acc.status)} size="sm">
                                {acc.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Team Contacts */}
                      <div>
                        <h4 className="font-medium mb-2">Team Contacts</h4>
                        <div className="space-y-2">
                          {application.teamContacts.map((contact, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="text-sm font-medium">{contact.name}</p>
                                <p className="text-xs text-muted-foreground">{contact.role} • {contact.email}</p>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Mail className="w-4 h-4 mr-1" />
                                Contact
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded">
                        <div className="text-center">
                          <p className="text-lg font-bold">{application.programs}</p>
                          <p className="text-sm text-muted-foreground">Programs</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{application.languages.length}</p>
                          <p className="text-sm text-muted-foreground">Languages</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{application.teamContacts.length}</p>
                          <p className="text-sm text-muted-foreground">Staff</p>
                        </div>
                      </div>

                      {/* Actions */}
                      {userRole === "Admin" && (
                        <div className="flex justify-end space-x-2">
                          <Button size="sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve Institution
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject Application
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homestay-applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Homestay Verification Workflow</CardTitle>
              <CardDescription>Review ID verification and property proofs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {homestayApplications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{application.name}</CardTitle>
                          <CardDescription>
                            {application.email} • {application.city}, {application.country} • Applied {application.appliedDate}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* ID Verification */}
                      <div>
                        <h4 className="font-medium mb-2">ID Verification</h4>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <p className="text-sm font-medium">{application.idVerification.type}</p>
                            <p className="text-xs text-muted-foreground">
                              Verified: {application.idVerification.verifiedDate}
                            </p>
                          </div>
                          <Badge className={getStatusColor(application.idVerification.status)} size="sm">
                            {application.idVerification.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Property Proofs */}
                      <div>
                        <h4 className="font-medium mb-2">Property Verification</h4>
                        <div className="space-y-2">
                          {application.propertyProofs.map((proof, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="text-sm font-medium">{proof.type}</p>
                                <p className="text-xs text-muted-foreground">Uploaded {proof.uploadDate}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(proof.status)} size="sm">
                                  {proof.status}
                                </Badge>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Background Check */}
                      <div>
                        <h4 className="font-medium mb-2">Background Check</h4>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <p className="text-sm font-medium">Criminal Background Check</p>
                            <p className="text-xs text-muted-foreground">
                              Requested: {application.backgroundCheck.requestedDate}
                            </p>
                          </div>
                          <Badge className={getStatusColor(application.backgroundCheck.status)} size="sm">
                            {application.backgroundCheck.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Offering Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Offering</h4>
                          <div className="space-y-1 text-sm">
                            <p>Rooms: {application.roomsOffered}</p>
                            <p>Price: {application.priceRange}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Languages</h4>
                          <div className="flex flex-wrap gap-1">
                            {application.languages.map((lang, index) => (
                              <Badge key={index} variant="outline" className="text-xs">{lang}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div>
                        <h4 className="font-medium mb-2">Amenities</h4>
                        <div className="flex flex-wrap gap-1">
                          {application.amenities.map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">{amenity}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      {userRole === "Admin" && (
                        <div className="flex justify-end space-x-2">
                          <Button size="sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve Homestay
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject Application
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>Complete log of all administrative actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.adminUser}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell>{log.target}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm truncate">{log.details}</p>
                      </TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.ipAddress}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}