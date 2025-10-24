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
  Building,
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
  Users,
  Home,
  Award,
  BookOpen,
  Video,
  Camera,
  Shield
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "./ui/dropdown-menu";
import { UserRole, hasPermission } from "../utils/permissions";
import { PermissionGate } from "./permission-gate";

interface InstitutionApplication {
  id: string;
  name: string;
  logo?: string;
  country: string;
  city: string;
  languagesOffered: string[];
  programsCount: number;
  submittedAt: Date;
  trustScore: number;
  autoChecks: {
    accreditation: boolean;
    programs: boolean;
    media: boolean;
  };
  status: 'pending' | 'info_requested' | 'resubmitted' | 'approved' | 'rejected';
  slaHours: number;
  riskFlags: string[];
  profile: {
    legalName: string;
    tradingName: string;
    description: string;
    promoVideo?: string;
    location: {
      address: string;
      coordinates?: { lat: number; lng: number };
    };
    contact: {
      email: string;
      phone?: string;
      website?: string;
    };
  };
  accreditation: {
    id: string;
    type: string;
    fileName: string;
    uploadedAt: Date;
    expirationDate?: Date;
    verified: boolean;
  }[];
  programs: {
    id: string;
    title: string;
    language: string;
    duration: number; // weeks
    weeklyHours: number;
    nextStartDates: Date[];
    price: number;
    currency: string;
    includes: string[];
    brochure?: string;
    video?: string;
    isComplete: boolean;
  }[];
  teachers: {
    id: string;
    name: string;
    qualifications: string[];
    experience: string;
  }[];
  accommodation?: {
    type: 'residence' | 'homestay';
    options: string[];
  };
  media: {
    images: string[];
    videos: string[];
  };
  billing: {
    payoutMethod: {
      type: string;
      details: string;
      verified: boolean;
    };
    refundPolicy: string;
  };
  timeline: {
    id: string;
    type: 'submitted' | 'updated' | 'message' | 'status_change' | 'approved' | 'rejected';
    description: string;
    timestamp: Date;
    user?: string;
  }[];
}

interface InstitutionApplicationsProps {
  userRole: UserRole;
}

export function InstitutionApplications({ userRole }: InstitutionApplicationsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [accreditationFilter, setAccreditationFilter] = useState("all");
  const [slaFilter, setSlaFilter] = useState("all");
  const [savedView, setSavedView] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<InstitutionApplication | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showRequestInfoDialog, setShowRequestInfoDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);

  // Mock data
  const applications: InstitutionApplication[] = [
    {
      id: "inst-001",
      name: "Madrid Language Academy",
      logo: undefined,
      country: "Spain",
      city: "Madrid",
      languagesOffered: ["Spanish", "English"],
      programsCount: 8,
      submittedAt: new Date("2024-01-15T09:00:00"),
      trustScore: 85,
      autoChecks: {
        accreditation: true,
        programs: true,
        media: false
      },
      status: "pending",
      slaHours: 42,
      riskFlags: [],
      profile: {
        legalName: "Madrid Language Academy S.L.",
        tradingName: "Madrid Language Academy",
        description: "Leading Spanish language school in Madrid with over 20 years of experience...",
        promoVideo: "promo_video.mp4",
        location: {
          address: "Calle Gran Vía 123, Madrid, Spain",
          coordinates: { lat: 40.4168, lng: -3.7038 }
        },
        contact: {
          email: "info@madridlanguage.com",
          phone: "+34 915 123 456",
          website: "https://madridlanguage.com"
        }
      },
      accreditation: [
        {
          id: "acc-001",
          type: "Instituto Cervantes Accreditation",
          fileName: "cervantes_accreditation.pdf",
          uploadedAt: new Date("2024-01-15T09:00:00"),
          expirationDate: new Date("2025-12-31"),
          verified: true
        }
      ],
      programs: [
        {
          id: "prog-001",
          title: "Intensive Spanish Course",
          language: "Spanish",
          duration: 12,
          weeklyHours: 20,
          nextStartDates: [new Date("2024-02-05"), new Date("2024-03-05")],
          price: 2400,
          currency: "EUR",
          includes: ["Materials", "Certificate", "Cultural Activities"],
          brochure: "intensive_spanish.pdf",
          video: "course_overview.mp4",
          isComplete: true
        },
        {
          id: "prog-002",
          title: "Business Spanish",
          language: "Spanish",
          duration: 8,
          weeklyHours: 15,
          nextStartDates: [new Date("2024-02-12")],
          price: 1800,
          currency: "EUR",
          includes: ["Materials", "Certificate"],
          isComplete: true
        }
      ],
      teachers: [
        {
          id: "teacher-001",
          name: "Prof. Maria Gonzalez",
          qualifications: ["PhD in Spanish Literature", "DELE Examiner"],
          experience: "15 years teaching experience"
        }
      ],
      accommodation: {
        type: "homestay",
        options: ["Single room with breakfast", "Shared apartment"]
      },
      media: {
        images: ["school_exterior.jpg", "classroom1.jpg", "common_area.jpg"],
        videos: ["virtual_tour.mp4"]
      },
      billing: {
        payoutMethod: {
          type: "Bank Transfer",
          details: "IBAN ending in 7890",
          verified: true
        },
        refundPolicy: "Full refund up to 14 days before course start"
      },
      timeline: [
        {
          id: "timeline-001",
          type: "submitted",
          description: "Institution application submitted with all documents",
          timestamp: new Date("2024-01-15T09:00:00")
        }
      ]
    },
    {
      id: "inst-002",
      name: "Seoul International School",
      logo: undefined,
      country: "South Korea",
      city: "Seoul",
      languagesOffered: ["Korean", "English"],
      programsCount: 3,
      submittedAt: new Date("2024-01-14T11:30:00"),
      trustScore: 52,
      autoChecks: {
        accreditation: false,
        programs: false,
        media: true
      },
      status: "info_requested",
      slaHours: 8,
      riskFlags: ["missing_accreditation", "incomplete_programs"],
      profile: {
        legalName: "Seoul International Language School Ltd.",
        tradingName: "Seoul International School",
        description: "Modern Korean language school in the heart of Seoul...",
        location: {
          address: "Gangnam-gu, Seoul, South Korea"
        },
        contact: {
          email: "admin@seoulintl.edu",
          phone: "+82 2 123 4567"
        }
      },
      accreditation: [],
      programs: [
        {
          id: "prog-003",
          title: "Korean Intensive",
          language: "Korean",
          duration: 10,
          weeklyHours: 0, // Missing
          nextStartDates: [],
          price: 0, // Missing
          currency: "KRW",
          includes: [],
          isComplete: false
        }
      ],
      teachers: [],
      media: {
        images: ["school_front.jpg"],
        videos: []
      },
      billing: {
        payoutMethod: {
          type: "Bank Transfer",
          details: "Account pending verification",
          verified: false
        },
        refundPolicy: "Refund policy to be determined"
      },
      timeline: [
        {
          id: "timeline-002",
          type: "submitted",
          description: "Initial application submitted",
          timestamp: new Date("2024-01-14T11:30:00")
        },
        {
          id: "timeline-003",
          type: "status_change",
          description: "Additional information requested - missing accreditation and incomplete program details",
          timestamp: new Date("2024-01-16T14:20:00"),
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
    if (accreditationFilter === "with_accreditation" && app.accreditation.length === 0) return false;
    if (slaFilter === "urgent" && app.slaHours > 6) return false;
    if (slaFilter === "due_soon" && app.slaHours > 24) return false;
    
    // Saved views
    if (savedView === "pending" && app.status !== "pending") return false;
    if (savedView === "flags" && app.riskFlags.length === 0) return false;
    if (savedView === "expiring" && app.slaHours > 6) return false;
    
    return true;
  });

  const renderSmartChecklist = (application: InstitutionApplication) => {
    const checklistItems = [
      {
        category: "Accreditation",
        items: [
          { name: "Accreditation Documents", status: application.accreditation.length > 0 ? "complete" : "incomplete" },
          { name: "Document Verification", status: application.accreditation.some(acc => acc.verified) ? "complete" : "incomplete" }
        ]
      },
      {
        category: "Programs",
        items: [
          { name: "Program Details Complete", status: application.programs.every(p => p.isComplete) ? "complete" : "incomplete" },
          { name: "Pricing Set", status: application.programs.every(p => p.price > 0) ? "complete" : "incomplete" },
          { name: "Start Dates Scheduled", status: application.programs.every(p => p.nextStartDates.length > 0) ? "complete" : "incomplete" }
        ]
      },
      {
        category: "Staff & Faculty",
        items: [
          { name: "Teachers Listed", status: application.teachers.length > 0 ? "complete" : "incomplete" },
          { name: "Qualifications Provided", status: application.teachers.every(t => t.qualifications.length > 0) ? "complete" : "warning" }
        ]
      },
      {
        category: "Media Quality",
        items: [
          { name: "Property Images", status: application.media.images.length >= 3 ? "complete" : "incomplete" },
          { name: "Promotional Video", status: application.profile.promoVideo ? "complete" : "incomplete" }
        ]
      },
      {
        category: "Business Setup",
        items: [
          { name: "Billing Method", status: application.billing.payoutMethod.verified ? "complete" : "incomplete" },
          { name: "Policies Set", status: application.billing.refundPolicy.length > 10 ? "complete" : "incomplete" }
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
                      <AvatarImage src={selectedApplication.logo} />
                      <AvatarFallback><Building className="w-6 h-6" /></AvatarFallback>
                    </Avatar>
                    <div>
                      <SheetTitle className="flex items-center gap-2">
                        {selectedApplication.name}
                        <Badge variant="outline">Institution</Badge>
                      </SheetTitle>
                      <SheetDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {selectedApplication.country}, {selectedApplication.city}
                        </span>
                        {getStatusBadge(selectedApplication.status)}
                        {getTrustScoreBadge(selectedApplication.trustScore)}
                      </SheetDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <PermissionGate userRole={userRole} module="institutions" permission="A">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </PermissionGate>
                    <PermissionGate userRole={userRole} module="institutions" permission="U">
                      <Button size="sm" variant="outline" onClick={() => setShowRequestInfoDialog(true)}>
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Request Info
                      </Button>
                    </PermissionGate>
                    <PermissionGate userRole={userRole} module="institutions" permission="D">
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
                      <TabsTrigger value="accreditation">Accreditation</TabsTrigger>
                      <TabsTrigger value="programs">Programs</TabsTrigger>
                      <TabsTrigger value="teachers">Teachers</TabsTrigger>
                      <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
                      <TabsTrigger value="media">Media</TabsTrigger>
                      <TabsTrigger value="billing">Billing & Policies</TabsTrigger>
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 p-6">
                    <TabsContent value="profile" className="space-y-6 m-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              Institution Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label>Legal Name</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.profile.legalName}
                              </p>
                            </div>
                            <div>
                              <Label>Trading Name</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.profile.tradingName}
                              </p>
                            </div>
                            <div>
                              <Label>Description</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.profile.description}
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              Contact & Location
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label>Address</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.profile.location.address}
                              </p>
                            </div>
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
                            {selectedApplication.profile.contact.website && (
                              <div>
                                <Label>Website</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <ExternalLink className="w-3 h-3" />
                                  <a href={selectedApplication.profile.contact.website} className="text-sm text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                    Visit Website
                                  </a>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>

                      {selectedApplication.profile.promoVideo && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Video className="w-4 h-4" />
                              Promotional Video
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-3 p-4 border rounded-lg">
                              <PlayCircle className="w-8 h-8 text-blue-600" />
                              <div>
                                <p className="font-medium">Promotional Video</p>
                                <p className="text-sm text-muted-foreground">
                                  {selectedApplication.profile.promoVideo}
                                </p>
                              </div>
                              <Button size="sm" variant="outline" className="ml-auto">
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="accreditation" className="space-y-6 m-0">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Accreditation Documents
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedApplication.accreditation.length > 0 ? (
                            <div className="space-y-4">
                              {selectedApplication.accreditation.map((acc) => (
                                <div key={acc.id} className="flex items-center justify-between p-4 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <FileText className="w-8 h-8 text-blue-600" />
                                    <div>
                                      <p className="font-medium">{acc.type}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {acc.fileName} • Uploaded {acc.uploadedAt.toLocaleDateString()}
                                        {acc.expirationDate && (
                                          <span> • Expires {acc.expirationDate.toLocaleDateString()}</span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {acc.verified ? (
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
                              <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                              <p>No accreditation documents uploaded</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="programs" className="space-y-6 m-0">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Language Programs
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedApplication.programs.length > 0 ? (
                            <div className="space-y-4">
                              {selectedApplication.programs.map((program) => (
                                <div key={program.id} className="border rounded-lg p-4">
                                  <div className="flex items-start justify-between mb-4">
                                    <div>
                                      <h4 className="font-medium">{program.title}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {program.language} • {program.duration} weeks • {program.weeklyHours} hours/week
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {program.isComplete ? (
                                        <Badge className="bg-green-100 text-green-800">Complete</Badge>
                                      ) : (
                                        <Badge variant="destructive">Incomplete</Badge>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                      <Label>Price</Label>
                                      <p className="text-sm text-muted-foreground">
                                        {program.price > 0 ? `${program.price} ${program.currency}` : "Not set"}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Next Start Dates</Label>
                                      <p className="text-sm text-muted-foreground">
                                        {program.nextStartDates.length > 0 
                                          ? program.nextStartDates.map(date => date.toLocaleDateString()).join(", ")
                                          : "Not scheduled"
                                        }
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Includes</Label>
                                      <p className="text-sm text-muted-foreground">
                                        {program.includes.length > 0 ? program.includes.join(", ") : "Not specified"}
                                      </p>
                                    </div>
                                  </div>

                                  {(program.brochure || program.video) && (
                                    <div className="flex gap-2">
                                      {program.brochure && (
                                        <Button size="sm" variant="outline">
                                          <FileText className="w-4 h-4 mr-2" />
                                          Brochure
                                        </Button>
                                      )}
                                      {program.video && (
                                        <Button size="sm" variant="outline">
                                          <PlayCircle className="w-4 h-4 mr-2" />
                                          Video
                                        </Button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                              <p>No programs defined</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="teachers" className="space-y-6 m-0">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Key Teachers
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedApplication.teachers.length > 0 ? (
                            <div className="space-y-4">
                              {selectedApplication.teachers.map((teacher) => (
                                <div key={teacher.id} className="flex items-start gap-4 p-4 border rounded-lg">
                                  <Avatar className="w-12 h-12">
                                    <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <h4 className="font-medium">{teacher.name}</h4>
                                    <p className="text-sm text-muted-foreground mb-2">{teacher.experience}</p>
                                    <div className="flex flex-wrap gap-1">
                                      {teacher.qualifications.map((qual, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">{qual}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                              <p>No teachers listed</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="accommodation" className="space-y-6 m-0">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            Accommodation Options
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedApplication.accommodation ? (
                            <div className="space-y-4">
                              <div>
                                <Label>Type</Label>
                                <p className="text-sm text-muted-foreground mt-1 capitalize">
                                  {selectedApplication.accommodation.type}
                                </p>
                              </div>
                              <div>
                                <Label>Available Options</Label>
                                <div className="mt-1 space-y-1">
                                  {selectedApplication.accommodation.options.map((option, index) => (
                                    <div key={index} className="text-sm text-muted-foreground">
                                      • {option}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
                              <p>No accommodation options provided</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="media" className="space-y-6 m-0">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            Images & Videos
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div>
                              <Label>Images ({selectedApplication.media.images.length})</Label>
                              {selectedApplication.media.images.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                  {selectedApplication.media.images.map((image, index) => (
                                    <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                      <Image className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground mt-1">No images uploaded</p>
                              )}
                            </div>

                            <div>
                              <Label>Videos ({selectedApplication.media.videos.length})</Label>
                              {selectedApplication.media.videos.length > 0 ? (
                                <div className="space-y-2 mt-2">
                                  {selectedApplication.media.videos.map((video, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                      <PlayCircle className="w-6 h-6 text-blue-600" />
                                      <span className="text-sm">{video}</span>
                                      <Button size="sm" variant="outline" className="ml-auto">
                                        Preview
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground mt-1">No videos uploaded</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="billing" className="space-y-6 m-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                {selectedApplication.billing.payoutMethod.type}
                              </p>
                            </div>
                            <div>
                              <Label>Details</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.billing.payoutMethod.details}
                              </p>
                            </div>
                            <div>
                              <Label>Status</Label>
                              <div className="mt-1">
                                {selectedApplication.billing.payoutMethod.verified ? (
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

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Policies
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label>Refund Policy</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.billing.refundPolicy}
                              </p>
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
                    <PermissionGate userRole={userRole} module="institutions" permission="A">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </PermissionGate>
                    <PermissionGate userRole={userRole} module="institutions" permission="U">
                      <Button variant="outline" onClick={() => setShowRequestInfoDialog(true)}>
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Request Info
                      </Button>
                    </PermissionGate>
                    <PermissionGate userRole={userRole} module="institutions" permission="D">
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
          <h2>Institution Applications</h2>
          <p className="text-muted-foreground">
            Review and verify institution applications
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
                placeholder="Search institutions..."
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

            <Select value={accreditationFilter} onValueChange={setAccreditationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Accreditation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="with_accreditation">With Accreditation</SelectItem>
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

            <PermissionGate userRole={userRole} module="institutions" permission="U">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={selectedItems.length === 0}>
                    Bulk Actions ({selectedItems.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <PermissionGate userRole={userRole} module="institutions" permission="A">
                    <DropdownMenuItem>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Selected
                    </DropdownMenuItem>
                  </PermissionGate>
                  <DropdownMenuItem>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Request Info
                  </DropdownMenuItem>
                  <PermissionGate userRole={userRole} module="institutions" permission="D">
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
                <TableHead>Institution</TableHead>
                <TableHead>Country/City</TableHead>
                <TableHead>Languages</TableHead>
                <TableHead>Programs</TableHead>
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
                        <AvatarImage src={application.logo} />
                        <AvatarFallback><Building className="w-4 h-4" /></AvatarFallback>
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
                      {application.languagesOffered.slice(0, 2).map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                      ))}
                      {application.languagesOffered.length > 2 && (
                        <Badge variant="outline" className="text-xs">+{application.languagesOffered.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{application.programsCount}</Badge>
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
                      {application.autoChecks.accreditation ? 
                        <CheckCircle className="w-4 h-4 text-green-600" title="Accreditation OK" /> : 
                        <XCircle className="w-4 h-4 text-red-600" title="Accreditation Missing" />
                      }
                      {application.autoChecks.programs ? 
                        <CheckCircle className="w-4 h-4 text-green-600" title="Programs Complete" /> : 
                        <XCircle className="w-4 h-4 text-red-600" title="Programs Incomplete" />
                      }
                      {application.autoChecks.media ? 
                        <CheckCircle className="w-4 h-4 text-green-600" title="Media OK" /> : 
                        <XCircle className="w-4 h-4 text-red-600" title="Media Missing" />
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
                        <PermissionGate userRole={userRole} module="institutions" permission="A">
                          <DropdownMenuItem>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                        </PermissionGate>
                        <PermissionGate userRole={userRole} module="institutions" permission="U">
                          <DropdownMenuItem>
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Request Info
                          </DropdownMenuItem>
                        </PermissionGate>
                        <DropdownMenuItem>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </DropdownMenuItem>
                        <PermissionGate userRole={userRole} module="institutions" permission="D">
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
                  <SelectItem value="accreditation">Upload accreditation documents</SelectItem>
                  <SelectItem value="programs">Complete program fields: duration, weekly hours, start dates, price</SelectItem>
                  <SelectItem value="media">Add classroom photos and facility images</SelectItem>
                  <SelectItem value="teachers">Provide teacher qualifications</SelectItem>
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
                  <SelectItem value="accreditation">Missing or invalid accreditation</SelectItem>
                  <SelectItem value="programs">Incomplete program information</SelectItem>
                  <SelectItem value="facilities">Inadequate facilities</SelectItem>
                  <SelectItem value="teachers">Insufficient qualified teachers</SelectItem>
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
              Send a message to the institution
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