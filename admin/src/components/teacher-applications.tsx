import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  MessageSquare,
  Calendar,
  MapPin,
  Globe,
  FileText,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  GraduationCap,
  DollarSign,
  Bookmark,
  CreditCard,
  Flag,
  PlayCircle,
  Image,
  ExternalLink,
  Languages,
  MapPin as Location,
  Banknote,
  Trash2,
  Edit,
  Send,
  Plus,
  X,
  Shield
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "./ui/dropdown-menu";
import { UserRole, hasPermission } from "../utils/permissions";
import { PermissionGate } from "./permission-gate";

interface TeacherApplication {
  id: string;
  name: string;
  avatar?: string;
  country: string;
  city: string;
  languages: string[];
  submittedAt: Date;
  trustScore: number;
  autoChecks: {
    docs: boolean;
    price: boolean;
    sample: boolean;
  };
  status: 'pending' | 'info_requested' | 'resubmitted' | 'approved' | 'rejected';
  slaHours: number;
  riskFlags: string[];
  profile: {
    bio: string;
    languagesTaught: string[];
    linkedIn?: string;
    website?: string;
    contact: {
      email: string;
      phone?: string;
    };
  };
  qualifications: {
    id: string;
    type: string;
    fileName: string;
    uploadedAt: Date;
    verified: boolean;
  }[];
  availability: {
    timezone: string;
    weeklySlots: string[];
    sessionPrice: number;
    currency: string;
    cancelPolicy: string;
  };
  kyc: {
    idDocuments: {
      type: string;
      fileName: string;
      uploadedAt: Date;
      verified: boolean;
    }[];
    payoutMethod: {
      type: string;
      details: string;
      verified: boolean;
    };
  };
  timeline: {
    id: string;
    type: 'submitted' | 'updated' | 'message' | 'status_change' | 'approved' | 'rejected';
    description: string;
    timestamp: Date;
    user?: string;
  }[];
}

interface TeacherApplicationsProps {
  userRole: UserRole;
}

export function TeacherApplications({ userRole }: TeacherApplicationsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [flagsFilter, setFlagsFilter] = useState("all");
  const [slaFilter, setSlaFilter] = useState("all");
  const [savedView, setSavedView] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<TeacherApplication | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showRequestInfoDialog, setShowRequestInfoDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);

  // Mock data
  const applications: TeacherApplication[] = [
    {
      id: "teacher-001",
      name: "Emily Rodriguez",
      avatar: undefined,
      country: "Spain",
      city: "Madrid",
      languages: ["Spanish", "English"],
      submittedAt: new Date("2024-01-15T10:30:00"),
      trustScore: 78,
      autoChecks: {
        docs: true,
        price: true,
        sample: false
      },
      status: "pending",
      slaHours: 18,
      riskFlags: [],
      profile: {
        bio: "Native Spanish teacher with 8 years of experience teaching students from all levels...",
        languagesTaught: ["Spanish", "English"],
        linkedIn: "https://linkedin.com/in/emily-rodriguez",
        website: "https://emilyteaches.com",
        contact: {
          email: "emily.r@email.com",
          phone: "+34 612 345 678"
        }
      },
      qualifications: [
        {
          id: "qual-001",
          type: "DELE Certificate",
          fileName: "DELE_Certificate.pdf",
          uploadedAt: new Date("2024-01-15T10:30:00"),
          verified: true
        }
      ],
      availability: {
        timezone: "Europe/Madrid",
        weeklySlots: ["Mon 9-17", "Tue 9-17", "Wed 9-17"],
        sessionPrice: 25,
        currency: "EUR",
        cancelPolicy: "24 hours notice required"
      },
      kyc: {
        idDocuments: [
          {
            type: "Passport",
            fileName: "passport.pdf",
            uploadedAt: new Date("2024-01-15T10:30:00"),
            verified: true
          }
        ],
        payoutMethod: {
          type: "Bank Transfer",
          details: "IBAN ending in 4567",
          verified: true
        }
      },
      timeline: [
        {
          id: "timeline-001",
          type: "submitted",
          description: "Application submitted with all required documents",
          timestamp: new Date("2024-01-15T10:30:00")
        }
      ]
    },
    {
      id: "teacher-002",
      name: "David Kim",
      avatar: undefined,
      country: "South Korea",
      city: "Seoul",
      languages: ["Korean", "English"],
      submittedAt: new Date("2024-01-14T14:20:00"),
      trustScore: 45,
      autoChecks: {
        docs: false,
        price: true,
        sample: true
      },
      status: "info_requested",
      slaHours: 6,
      riskFlags: ["missing_qualification", "pricing_outlier"],
      profile: {
        bio: "Korean language instructor specializing in business Korean...",
        languagesTaught: ["Korean", "English"],
        contact: {
          email: "david.kim@email.com"
        }
      },
      qualifications: [],
      availability: {
        timezone: "Asia/Seoul",
        weeklySlots: ["Mon 19-22", "Wed 19-22", "Fri 19-22"],
        sessionPrice: 45,
        currency: "USD",
        cancelPolicy: "12 hours notice required"
      },
      kyc: {
        idDocuments: [],
        payoutMethod: {
          type: "PayPal",
          details: "david.kim@email.com",
          verified: false
        }
      },
      timeline: [
        {
          id: "timeline-002",
          type: "submitted",
          description: "Initial application submitted",
          timestamp: new Date("2024-01-14T14:20:00")
        },
        {
          id: "timeline-003",
          type: "status_change",
          description: "Additional information requested - missing qualifications",
          timestamp: new Date("2024-01-15T09:15:00"),
          user: "Admin User"
        }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "info_requested":
        return <Badge variant="outline">Info Requested</Badge>;
      case "resubmitted":
        return <Badge variant="secondary">Resubmitted</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTrustScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">{score}</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">{score}</Badge>;
    return <Badge className="bg-red-100 text-red-800">{score}</Badge>;
  };

  const getSlaStatus = (hours: number) => {
    if (hours <= 6) return <Badge variant="destructive" className="flex items-center gap-1"><Clock className="w-3 h-3" />{hours}h</Badge>;
    if (hours <= 24) return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1"><Clock className="w-3 h-3" />{hours}h</Badge>;
    return <Badge variant="outline" className="flex items-center gap-1"><Clock className="w-3 h-3" />{hours}h</Badge>;
  };

  const filteredApplications = applications.filter(app => {
    if (searchQuery && !app.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !app.country.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== "all" && app.status !== statusFilter) return false;
    if (countryFilter !== "all" && app.country !== countryFilter) return false;
    if (flagsFilter === "flagged" && app.riskFlags.length === 0) return false;
    if (slaFilter === "urgent" && app.slaHours > 6) return false;
    if (slaFilter === "due_soon" && app.slaHours > 24) return false;
    
    // Saved views
    if (savedView === "pending" && app.status !== "pending") return false;
    if (savedView === "flags" && app.riskFlags.length === 0) return false;
    if (savedView === "expiring" && app.slaHours > 6) return false;
    
    return true;
  });

  const renderSmartChecklist = (application: TeacherApplication) => {
    const checklistItems = [
      {
        category: "Identity/KYC",
        items: [
          { name: "ID Document Verified", status: application.kyc.idDocuments.length > 0 && application.kyc.idDocuments[0].verified ? "complete" : "incomplete" },
          { name: "Contact Information", status: application.profile.contact.email ? "complete" : "incomplete" }
        ]
      },
      {
        category: "Qualifications",
        items: [
          { name: "Teaching Certificates", status: application.qualifications.length > 0 ? "complete" : "incomplete" },
          { name: "Language Proficiency", status: application.profile.languagesTaught.length > 0 ? "complete" : "incomplete" }
        ]
      },
      {
        category: "Media Quality",
        items: [
          { name: "Profile Photo", status: application.avatar ? "complete" : "incomplete" },
          { name: "Sample Video", status: application.autoChecks.sample ? "complete" : "incomplete" }
        ]
      },
      {
        category: "Pricing & Availability",
        items: [
          { name: "Pricing Sanity", status: application.autoChecks.price ? "complete" : "warning" },
          { name: "Availability Set", status: application.availability.weeklySlots.length > 0 ? "complete" : "incomplete" }
        ]
      },
      {
        category: "Payout Setup",
        items: [
          { name: "Payout Method", status: application.kyc.payoutMethod.verified ? "complete" : "incomplete" }
        ]
      }
    ];

    const getStatusIcon = (status: string) => {
      switch (status) {
        case "complete": return <CheckCircle className="w-4 h-4 text-green-600" />;
        case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
        case "incomplete": return <XCircle className="w-4 h-4 text-red-600" />;
        default: return <XCircle className="w-4 h-4 text-gray-400" />;
      }
    };

    const completionPercentage = Math.round(
      (checklistItems.flatMap(cat => cat.items).filter(item => item.status === "complete").length / 
       checklistItems.flatMap(cat => cat.items).length) * 100
    );

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4>Application Completeness</h4>
            <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {checklistItems.map((category) => (
          <div key={category.category} className="space-y-2">
            <h5 className="text-sm font-medium text-muted-foreground">{category.category}</h5>
            <div className="space-y-1 pl-2">
              {category.items.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  {getStatusIcon(item.status)}
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {application.riskFlags.length > 0 && (
          <div className="pt-4 border-t space-y-2">
            <h5 className="text-sm font-medium text-red-600 flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Risk Flags
            </h5>
            <div className="space-y-1 pl-6">
              {application.riskFlags.map((flag, index) => (
                <div key={index} className="text-sm text-red-600">
                  • {flag.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderApplicationDetail = () => {
    if (!selectedApplication) return null;

    return (
      <Sheet open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <SheetContent className="w-[900px] sm:max-w-[900px] p-0">
          <div className="flex h-full">
            {/* Left Sidebar - Smart Checklist */}
            <div className="w-80 border-r bg-muted/10 p-6">
              <div className="sticky top-6">
                {renderSmartChecklist(selectedApplication)}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              <SheetHeader className="p-6 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={selectedApplication.avatar} />
                      <AvatarFallback>{selectedApplication.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <SheetTitle className="flex items-center gap-2">
                        {selectedApplication.name}
                        <Badge variant="outline">Teacher</Badge>
                      </SheetTitle>
                      <SheetDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {selectedApplication.country}
                        </span>
                        {getStatusBadge(selectedApplication.status)}
                        {getTrustScoreBadge(selectedApplication.trustScore)}
                      </SheetDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <PermissionGate userRole={userRole} module="users" permission="A">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </PermissionGate>
                    <PermissionGate userRole={userRole} module="users" permission="U">
                      <Button size="sm" variant="outline" onClick={() => setShowRequestInfoDialog(true)}>
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Request Info
                      </Button>
                    </PermissionGate>
                    <PermissionGate userRole={userRole} module="users" permission="D">
                      <Button size="sm" variant="destructive" onClick={() => setShowRejectDialog(true)}>
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </PermissionGate>
                    <Button size="sm" variant="outline" onClick={() => setShowMessageDialog(true)}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Audit Log
                    </Button>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-auto">
                <Tabs defaultValue="profile" className="h-full flex flex-col">
                  <div className="px-6 pt-4">
                    <TabsList>
                      <TabsTrigger value="profile">Profile</TabsTrigger>
                      <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
                      <TabsTrigger value="availability">Availability & Pricing</TabsTrigger>
                      <TabsTrigger value="kyc">KYC & Payout</TabsTrigger>
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 p-6">
                    <TabsContent value="profile" className="space-y-6 m-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Basic Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label>Bio</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.profile.bio}
                              </p>
                            </div>
                            <div>
                              <Label>Languages Taught</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedApplication.profile.languagesTaught.map((lang) => (
                                  <Badge key={lang} variant="outline">{lang}</Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              Links & Contact
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {selectedApplication.profile.linkedIn && (
                              <div>
                                <Label>LinkedIn</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <ExternalLink className="w-3 h-3" />
                                  <a href={selectedApplication.profile.linkedIn} className="text-sm text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                    View Profile
                                  </a>
                                </div>
                              </div>
                            )}
                            {selectedApplication.profile.website && (
                              <div>
                                <Label>Website</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <ExternalLink className="w-3 h-3" />
                                  <a href={selectedApplication.profile.website} className="text-sm text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                    Visit Website
                                  </a>
                                </div>
                              </div>
                            )}
                            <div>
                              <Label>Email</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.profile.contact.email}
                              </p>
                            </div>
                            {selectedApplication.profile.contact.phone && (
                              <div>
                                <Label>Phone</Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {selectedApplication.profile.contact.phone}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="qualifications" className="space-y-6 m-0">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            Certificates & Qualifications
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedApplication.qualifications.length > 0 ? (
                            <div className="space-y-4">
                              {selectedApplication.qualifications.map((qual) => (
                                <div key={qual.id} className="flex items-center justify-between p-4 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <FileText className="w-8 h-8 text-blue-600" />
                                    <div>
                                      <p className="font-medium">{qual.type}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {qual.fileName} • Uploaded {qual.uploadedAt.toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {qual.verified ? (
                                      <Badge className="bg-green-100 text-green-800">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Verified
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline">Pending</Badge>
                                    )}
                                    <Button size="sm" variant="outline">
                                      <Eye className="w-4 h-4 mr-2" />
                                      View
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                              <p>No qualifications uploaded</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="availability" className="space-y-6 m-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Availability
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label>Timezone</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.availability.timezone}
                              </p>
                            </div>
                            <div>
                              <Label>Weekly Slots</Label>
                              <div className="mt-1 space-y-1">
                                {selectedApplication.availability.weeklySlots.map((slot, index) => (
                                  <Badge key={index} variant="outline">{slot}</Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              Pricing
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label>Session Price</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.availability.sessionPrice} {selectedApplication.availability.currency} per hour
                              </p>
                            </div>
                            <div>
                              <Label>Cancellation Policy</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.availability.cancelPolicy}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="kyc" className="space-y-6 m-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Identity Documents
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {selectedApplication.kyc.idDocuments.length > 0 ? (
                              <div className="space-y-4">
                                {selectedApplication.kyc.idDocuments.map((doc, index) => (
                                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <FileText className="w-8 h-8 text-blue-600" />
                                      <div>
                                        <p className="font-medium">{doc.type}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {doc.fileName}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {doc.verified ? (
                                        <Badge className="bg-green-100 text-green-800">
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                          Verified
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline">Pending</Badge>
                                      )}
                                      <Button size="sm" variant="outline">
                                        <Eye className="w-4 h-4 mr-2" />
                                        View
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-muted-foreground">
                                <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No ID documents uploaded</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              Payout Method
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label>Method</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.kyc.payoutMethod.type}
                              </p>
                            </div>
                            <div>
                              <Label>Details</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.kyc.payoutMethod.details}
                              </p>
                            </div>
                            <div>
                              <Label>Status</Label>
                              <div className="mt-1">
                                {selectedApplication.kyc.payoutMethod.verified ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">Pending</Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="timeline" className="space-y-6 m-0">
                      <Card>
                        <CardHeader>
                          <CardTitle>Application Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {selectedApplication.timeline.map((event) => (
                              <div key={event.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{event.description}</p>
                                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                    <Calendar className="w-3 h-3" />
                                    {event.timestamp.toLocaleString()}
                                    {event.user && (
                                      <>
                                        <span>•</span>
                                        <span>{event.user}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              {/* Sticky Decision Bar */}
              <div className="border-t bg-background p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      SLA: {selectedApplication.slaHours}h remaining
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <PermissionGate userRole={userRole} module="users" permission="A">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </PermissionGate>
                    <PermissionGate userRole={userRole} module="users" permission="U">
                      <Button variant="outline" onClick={() => setShowRequestInfoDialog(true)}>
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Request Info
                      </Button>
                    </PermissionGate>
                    <PermissionGate userRole={userRole} module="users" permission="D">
                      <Button variant="destructive" onClick={() => setShowRejectDialog(true)}>
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </PermissionGate>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2>Teacher Applications</h2>
          <p className="text-muted-foreground">
            Review and verify teacher applications
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="info_requested">Info Requested</SelectItem>
                <SelectItem value="resubmitted">Resubmitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="Spain">Spain</SelectItem>
                <SelectItem value="South Korea">South Korea</SelectItem>
                <SelectItem value="United States">United States</SelectItem>
              </SelectContent>
            </Select>

            <Select value={flagsFilter} onValueChange={setFlagsFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Flags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="flagged">Flagged Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={slaFilter} onValueChange={setSlaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="SLA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="urgent">Urgent (less than 6h)</SelectItem>
                <SelectItem value="due_soon">Due Soon (less than 24h)</SelectItem>
              </SelectContent>
            </Select>

            <PermissionGate userRole={userRole} module="users" permission="U">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={selectedItems.length === 0}>
                    Bulk Actions ({selectedItems.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <PermissionGate userRole={userRole} module="users" permission="A">
                    <DropdownMenuItem>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Selected
                    </DropdownMenuItem>
                  </PermissionGate>
                  <DropdownMenuItem>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Request Info
                  </DropdownMenuItem>
                  <PermissionGate userRole={userRole} module="users" permission="D">
                    <DropdownMenuItem>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Selected
                    </DropdownMenuItem>
                  </PermissionGate>
                </DropdownMenuContent>
              </DropdownMenu>
            </PermissionGate>
          </div>
          
          {/* Saved Views */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
            <span className="text-sm text-muted-foreground">Saved Views:</span>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={savedView === "all" ? "default" : "outline"}
                onClick={() => setSavedView("all")}
              >
                All Applications
              </Button>
              <Button 
                size="sm" 
                variant={savedView === "pending" ? "default" : "outline"}
                onClick={() => setSavedView("pending")}
              >
                All Pending
              </Button>
              <Button 
                size="sm" 
                variant={savedView === "flags" ? "default" : "outline"}
                onClick={() => setSavedView("flags")}
              >
                Flags Only
              </Button>
              <Button 
                size="sm" 
                variant={savedView === "expiring" ? "default" : "outline"}
                onClick={() => setSavedView("expiring")}
              >
                Expiring SLA
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedItems.length === filteredApplications.length && filteredApplications.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedItems(filteredApplications.map(app => app.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Country/City</TableHead>
                <TableHead>Languages</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Trust Score</TableHead>
                <TableHead>Auto Checks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow 
                  key={application.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedApplication(application)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedItems.includes(application.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedItems([...selectedItems, application.id]);
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== application.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={application.avatar} />
                        <AvatarFallback>{application.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{application.name}</p>
                        {application.riskFlags.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <Flag className="w-3 h-3 text-red-500" />
                            <span className="text-xs text-red-500">{application.riskFlags.length} flag(s)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      {application.country}, {application.city}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {application.languages.slice(0, 2).map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                      ))}
                      {application.languages.length > 2 && (
                        <Badge variant="outline" className="text-xs">+{application.languages.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {application.submittedAt.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTrustScoreBadge(application.trustScore)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {application.autoChecks.docs ? 
                        <CheckCircle className="w-4 h-4 text-green-600" title="Documents OK" /> : 
                        <XCircle className="w-4 h-4 text-red-600" title="Documents Missing" />
                      }
                      {application.autoChecks.price ? 
                        <CheckCircle className="w-4 h-4 text-green-600" title="Price OK" /> : 
                        <XCircle className="w-4 h-4 text-red-600" title="Price Issue" />
                      }
                      {application.autoChecks.sample ? 
                        <CheckCircle className="w-4 h-4 text-green-600" title="Sample OK" /> : 
                        <XCircle className="w-4 h-4 text-red-600" title="Sample Missing" />
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(application.status)}
                  </TableCell>
                  <TableCell>
                    {getSlaStatus(application.slaHours)}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedApplication(application)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <PermissionGate userRole={userRole} module="users" permission="A">
                          <DropdownMenuItem>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                        </PermissionGate>
                        <PermissionGate userRole={userRole} module="users" permission="U">
                          <DropdownMenuItem>
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Request Info
                          </DropdownMenuItem>
                        </PermissionGate>
                        <DropdownMenuItem>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </DropdownMenuItem>
                        <PermissionGate userRole={userRole} module="users" permission="D">
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        </PermissionGate>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Application Detail Drawer */}
      {renderApplicationDetail()}

      {/* Request Info Dialog */}
      <Dialog open={showRequestInfoDialog} onOpenChange={setShowRequestInfoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Additional Information</DialogTitle>
            <DialogDescription>
              Select a template or provide custom requirements
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Template</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="certificate">Upload teaching certificate</SelectItem>
                  <SelectItem value="sample">Add sample teaching video</SelectItem>
                  <SelectItem value="pricing">Adjust pricing to market range</SelectItem>
                  <SelectItem value="profile">Complete profile information</SelectItem>
                  <SelectItem value="custom">Custom request</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Additional Requirements</Label>
              <Textarea placeholder="Describe what information is needed..." />
            </div>
            
            <div>
              <Label>Response Deadline</Label>
              <Input type="date" />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="reminder" />
              <Label htmlFor="reminder">Send automatic reminders</Label>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRequestInfoDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowRequestInfoDialog(false)}>
                Send Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Reason</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qualifications">Insufficient qualifications</SelectItem>
                  <SelectItem value="experience">Lacks teaching experience</SelectItem>
                  <SelectItem value="documents">Invalid or missing documents</SelectItem>
                  <SelectItem value="quality">Poor sample quality</SelectItem>
                  <SelectItem value="fraud">Suspected fraud</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Additional Details</Label>
              <Textarea placeholder="Provide additional details..." />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="block" />
              <Label htmlFor="block">Block for suspected fraud</Label>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => setShowRejectDialog(false)}>
                Reject Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Send a message to the applicant
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Template</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Welcome message</SelectItem>
                  <SelectItem value="clarification">Request clarification</SelectItem>
                  <SelectItem value="update">Application update</SelectItem>
                  <SelectItem value="custom">Custom message</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Message</Label>
              <Textarea placeholder="Type your message..." rows={4} />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="requirement" />
              <Label htmlFor="requirement">Mark as requirement</Label>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowMessageDialog(false)}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}