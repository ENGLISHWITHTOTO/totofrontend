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
  Home,
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
  Building,
  Award,
  BookOpen,
  Video,
  Camera,
  Bed,
  Car,
  Wifi,
  UtensilsCrossed,
  Shield,
  Navigation
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "./ui/dropdown-menu";
import { UserRole, hasPermission } from "../utils/permissions";
import { PermissionGate } from "./permission-gate";

interface HomestayApplication {
  id: string;
  hostName: string;
  propertyName?: string;
  avatar?: string;
  city: string;
  area: string;
  roomsCount: number;
  photosCount: number;
  submittedAt: Date;
  trustScore: number;
  autoChecks: {
    id: boolean;
    photos: boolean;
    address: boolean;
    pricing: boolean;
  };
  status: 'pending' | 'info_requested' | 'resubmitted' | 'approved' | 'rejected';
  slaHours: number;
  riskFlags: string[];
  hostProfile: {
    bio: string;
    languages: string[];
    contact: {
      email: string;
      phone?: string;
    };
    experience: string;
  };
  property: {
    type: string;
    description: string;
    rooms: {
      id: string;
      type: string;
      capacity: number;
      amenities: string[];
      description: string;
    }[];
    houseRules: string[];
    amenities: string[];
    location: {
      address: string;
      coordinates?: { lat: number; lng: number };
    };
    nearbyInstitutions?: {
      name: string;
      distance: string;
      travelTime: string;
    }[];
  };
  media: {
    photos: string[];
    videos: string[];
  };
  pricing: {
    perNight?: number;
    perWeek?: number;
    perMonth?: number;
    currency: string;
    minStay: number;
    maxStay?: number;
    deposits: {
      security: number;
      cleaning?: number;
    };
  };
  availability: {
    calendar: string; // Calendar data/URL
    availableFrom: Date;
    availableTo?: Date;
  };
  verification: {
    idDocuments: {
      type: string;
      fileName: string;
      uploadedAt: Date;
      verified: boolean;
    }[];
    propertyProof: {
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

interface HomestayApplicationsProps {
  userRole: UserRole;
}

export function HomestayApplications({ userRole }: HomestayApplicationsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [flagsFilter, setFlagsFilter] = useState("all");
  const [slaFilter, setSlaFilter] = useState("all");
  const [savedView, setSavedView] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<HomestayApplication | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showRequestInfoDialog, setShowRequestInfoDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);

  // Mock data
  const applications: HomestayApplication[] = [
    {
      id: "homestay-001",
      hostName: "Maria Santos",
      propertyName: "Casa Maria",
      avatar: undefined,
      city: "Barcelona",
      area: "Eixample",
      roomsCount: 3,
      photosCount: 12,
      submittedAt: new Date("2024-01-16T08:30:00"),
      trustScore: 92,
      autoChecks: {
        id: true,
        photos: true,
        address: true,
        pricing: true
      },
      status: "pending",
      slaHours: 28,
      riskFlags: [],
      hostProfile: {
        bio: "Experienced host with 5 years welcoming international students. I love sharing Spanish culture and helping students feel at home.",
        languages: ["Spanish", "English", "French"],
        contact: {
          email: "maria.santos@email.com",
          phone: "+34 612 345 789"
        },
        experience: "5 years hosting international students"
      },
      property: {
        type: "Apartment",
        description: "Beautiful 4-bedroom apartment in the heart of Barcelona, close to universities and metro stations.",
        rooms: [
          {
            id: "room-001",
            type: "Single Room",
            capacity: 1,
            amenities: ["Private bathroom", "Desk", "Wardrobe", "WiFi"],
            description: "Bright single room with private bathroom and study area"
          },
          {
            id: "room-002",
            type: "Double Room",
            capacity: 2,
            amenities: ["Shared bathroom", "Twin beds", "Desk", "Wardrobe", "WiFi"],
            description: "Spacious double room perfect for friends studying together"
          }
        ],
        houseRules: [
          "No smoking indoors",
          "Quiet hours after 10 PM",
          "Kitchen cleaning after use",
          "Guests welcome with prior notice"
        ],
        amenities: [
          "WiFi", "Kitchen access", "Laundry", "TV room", "Terrace", "Air conditioning"
        ],
        location: {
          address: "Carrer de Balmes 123, Barcelona, Spain",
          coordinates: { lat: 41.3874, lng: 2.1686 }
        },
        nearbyInstitutions: [
          {
            name: "Universidad de Barcelona",
            distance: "800m",
            travelTime: "10 min walk"
          },
          {
            name: "ESADE Business School",
            distance: "1.2km",
            travelTime: "15 min metro"
          }
        ]
      },
      media: {
        photos: [
          "exterior.jpg", "living_room.jpg", "kitchen.jpg", "single_room.jpg",
          "double_room.jpg", "bathroom1.jpg", "bathroom2.jpg", "terrace.jpg",
          "study_area.jpg", "common_area.jpg", "neighborhood.jpg", "metro_station.jpg"
        ],
        videos: ["house_tour.mp4"]
      },
      pricing: {
        perNight: 35,
        perWeek: 220,
        perMonth: 850,
        currency: "EUR",
        minStay: 14,
        maxStay: 365,
        deposits: {
          security: 300,
          cleaning: 50
        }
      },
      availability: {
        calendar: "google_calendar_link",
        availableFrom: new Date("2024-02-01"),
        availableTo: new Date("2024-12-31")
      },
      verification: {
        idDocuments: [
          {
            type: "DNI (Spanish ID)",
            fileName: "dni_maria_santos.pdf",
            uploadedAt: new Date("2024-01-16T08:30:00"),
            verified: true
          }
        ],
        propertyProof: [
          {
            type: "Property Registration",
            fileName: "property_registration.pdf",
            uploadedAt: new Date("2024-01-16T08:30:00"),
            verified: true
          }
        ],
        payoutMethod: {
          type: "Bank Transfer",
          details: "IBAN ending in 5678",
          verified: true
        }
      },
      timeline: [
        {
          id: "timeline-001",
          type: "submitted",
          description: "Homestay application submitted with all required documents and photos",
          timestamp: new Date("2024-01-16T08:30:00")
        }
      ]
    },
    {
      id: "homestay-002",
      hostName: "James Wilson",
      avatar: undefined,
      city: "London",
      area: "Camden",
      roomsCount: 2,
      photosCount: 4,
      submittedAt: new Date("2024-01-15T14:20:00"),
      trustScore: 48,
      autoChecks: {
        id: true,
        photos: false,
        address: true,
        pricing: false
      },
      status: "info_requested",
      slaHours: 4,
      riskFlags: ["insufficient_photos", "pricing_below_minimum"],
      hostProfile: {
        bio: "First-time host looking to welcome international students to London.",
        languages: ["English"],
        contact: {
          email: "james.wilson@email.com"
        },
        experience: "New host"
      },
      property: {
        type: "House",
        description: "Cozy house in Camden with easy access to central London.",
        rooms: [
          {
            id: "room-003",
            type: "Single Room",
            capacity: 1,
            amenities: ["Shared bathroom", "Desk"],
            description: "Simple single room"
          }
        ],
        houseRules: [
          "No smoking",
          "No parties"
        ],
        amenities: ["WiFi", "Kitchen access"],
        location: {
          address: "Camden High Street, London, UK"
        }
      },
      media: {
        photos: ["front_door.jpg", "living_room.jpg", "bedroom.jpg", "kitchen.jpg"],
        videos: []
      },
      pricing: {
        perWeek: 120,
        currency: "GBP",
        minStay: 7,
        deposits: {
          security: 150
        }
      },
      availability: {
        calendar: "manual_calendar",
        availableFrom: new Date("2024-02-15")
      },
      verification: {
        idDocuments: [
          {
            type: "UK Passport",
            fileName: "passport_james.pdf",
            uploadedAt: new Date("2024-01-15T14:20:00"),
            verified: true
          }
        ],
        propertyProof: [],
        payoutMethod: {
          type: "PayPal",
          details: "james.wilson@email.com",
          verified: false
        }
      },
      timeline: [
        {
          id: "timeline-002",
          type: "submitted",
          description: "Initial homestay application submitted",
          timestamp: new Date("2024-01-15T14:20:00")
        },
        {
          id: "timeline-003",
          type: "status_change",
          description: "Additional information requested - need more photos and pricing adjustment",
          timestamp: new Date("2024-01-17T11:15:00"),
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
    if (searchQuery && !app.hostName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !app.city.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !app.area.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== "all" && app.status !== statusFilter) return false;
    if (cityFilter !== "all" && app.city !== cityFilter) return false;
    if (flagsFilter === "flagged" && app.riskFlags.length === 0) return false;
    if (slaFilter === "urgent" && app.slaHours > 6) return false;
    if (slaFilter === "due_soon" && app.slaHours > 24) return false;
    
    // Saved views
    if (savedView === "pending" && app.status !== "pending") return false;
    if (savedView === "flags" && app.riskFlags.length === 0) return false;
    if (savedView === "expiring" && app.slaHours > 6) return false;
    
    return true;
  });

  const renderSmartChecklist = (application: HomestayApplication) => {
    const checklistItems = [
      {
        category: "Identity Verification",
        items: [
          { name: "ID Document Verified", status: application.verification.idDocuments.length > 0 && application.verification.idDocuments[0].verified ? "complete" : "incomplete" },
          { name: "Contact Information", status: application.hostProfile.contact.email ? "complete" : "incomplete" }
        ]
      },
      {
        category: "Property Verification",
        items: [
          { name: "Address Mappable", status: application.autoChecks.address ? "complete" : "incomplete" },
          { name: "Property Proof", status: application.verification.propertyProof.length > 0 ? "complete" : "incomplete" }
        ]
      },
      {
        category: "Media Quality",
        items: [
          { name: "Minimum 6 Photos", status: application.photosCount >= 6 ? "complete" : "incomplete" },
          { name: "High-Quality Photos", status: application.autoChecks.photos ? "complete" : "warning" },
          { name: "Property Video", status: application.media.videos.length > 0 ? "complete" : "incomplete" }
        ]
      },
      {
        category: "Property Details",
        items: [
          { name: "Room Details Complete", status: application.property.rooms.every(r => r.description && r.amenities.length > 0) ? "complete" : "incomplete" },
          { name: "House Rules Set", status: application.property.houseRules.length > 0 ? "complete" : "incomplete" },
          { name: "Amenities Listed", status: application.property.amenities.length > 0 ? "complete" : "incomplete" }
        ]
      },
      {
        category: "Pricing & Availability",
        items: [
          { name: "Pricing Within Range", status: application.autoChecks.pricing ? "complete" : "warning" },
          { name: "Availability Set", status: application.availability.availableFrom ? "complete" : "incomplete" },
          { name: "Minimum Stay Defined", status: application.pricing.minStay > 0 ? "complete" : "incomplete" }
        ]
      },
      {
        category: "Payout Setup",
        items: [
          { name: "Payout Method", status: application.verification.payoutMethod.verified ? "complete" : "incomplete" }
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
                      <AvatarFallback>{selectedApplication.hostName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <SheetTitle className="flex items-center gap-2">
                        {selectedApplication.propertyName || selectedApplication.hostName}
                        <Badge variant="outline">Homestay</Badge>
                      </SheetTitle>
                      <SheetDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {selectedApplication.city}, {selectedApplication.area}
                        </span>
                        {getStatusBadge(selectedApplication.status)}
                        {getTrustScoreBadge(selectedApplication.trustScore)}
                      </SheetDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <PermissionGate userRole={userRole} module="homestays" permission="A">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </PermissionGate>
                    <PermissionGate userRole={userRole} module="homestays" permission="U">
                      <Button size="sm" variant="outline" onClick={() => setShowRequestInfoDialog(true)}>
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Request Info
                      </Button>
                    </PermissionGate>
                    <PermissionGate userRole={userRole} module="homestays" permission="D">
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
                <Tabs defaultValue="host" className="h-full flex flex-col">
                  <div className="px-6 pt-4">
                    <TabsList>
                      <TabsTrigger value="host">Host Profile</TabsTrigger>
                      <TabsTrigger value="property">Property & Rooms</TabsTrigger>
                      <TabsTrigger value="photos">Photos/Video</TabsTrigger>
                      <TabsTrigger value="pricing">Pricing</TabsTrigger>
                      <TabsTrigger value="availability">Availability</TabsTrigger>
                      <TabsTrigger value="verification">Verification & Payout</TabsTrigger>
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 p-6">
                    <TabsContent value="host" className="space-y-6 m-0">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Host Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label>Bio</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedApplication.hostProfile.bio}
                            </p>
                          </div>
                          <div>
                            <Label>Languages Spoken</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedApplication.hostProfile.languages.map((lang) => (
                                <Badge key={lang} variant="outline">{lang}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label>Hosting Experience</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedApplication.hostProfile.experience}
                            </p>
                          </div>
                          <div>
                            <Label>Contact Email</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedApplication.hostProfile.contact.email}
                            </p>
                          </div>
                          {selectedApplication.hostProfile.contact.phone && (
                            <div>
                              <Label>Phone</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.hostProfile.contact.phone}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="property" className="space-y-6 m-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Home className="w-4 h-4" />
                              Property Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label>Property Type</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.property.type}
                              </p>
                            </div>
                            <div>
                              <Label>Description</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.property.description}
                              </p>
                            </div>
                            <div>
                              <Label>Address</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.property.location.address}
                              </p>
                            </div>
                            <div>
                              <Label>Property Amenities</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedApplication.property.amenities.map((amenity) => (
                                  <Badge key={amenity} variant="outline" className="text-xs">{amenity}</Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Bed className="w-4 h-4" />
                              House Rules
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-1">
                              {selectedApplication.property.houseRules.map((rule, index) => (
                                <div key={index} className="text-sm text-muted-foreground">
                                  • {rule}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Bed className="w-4 h-4" />
                            Available Rooms
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {selectedApplication.property.rooms.map((room) => (
                              <div key={room.id} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-medium">{room.type}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Capacity: {room.capacity} guest{room.capacity > 1 ? 's' : ''}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{room.description}</p>
                                <div className="flex flex-wrap gap-1">
                                  {room.amenities.map((amenity) => (
                                    <Badge key={amenity} variant="outline" className="text-xs">{amenity}</Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {selectedApplication.property.nearbyInstitutions && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Navigation className="w-4 h-4" />
                              Nearby Institutions
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {selectedApplication.property.nearbyInstitutions.map((inst, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div>
                                    <p className="font-medium">{inst.name}</p>
                                    <p className="text-sm text-muted-foreground">{inst.distance} • {inst.travelTime}</p>
                                  </div>
                                  <Button size="sm" variant="outline">
                                    <Navigation className="w-4 h-4 mr-2" />
                                    View Route
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="photos" className="space-y-6 m-0">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            Property Photos ({selectedApplication.photosCount})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedApplication.media.photos.length > 0 ? (
                            <div className="grid grid-cols-3 gap-4">
                              {selectedApplication.media.photos.map((photo, index) => (
                                <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80">
                                  <div className="text-center">
                                    <Image className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-xs text-muted-foreground">{photo}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                              <p>No photos uploaded</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {selectedApplication.media.videos.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Video className="w-4 h-4" />
                              Property Videos
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {selectedApplication.media.videos.map((video, index) => (
                                <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                                  <PlayCircle className="w-8 h-8 text-blue-600" />
                                  <div className="flex-1">
                                    <p className="font-medium">Property Tour Video</p>
                                    <p className="text-sm text-muted-foreground">{video}</p>
                                  </div>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Preview
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="pricing" className="space-y-6 m-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              Rates
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {selectedApplication.pricing.perNight && (
                              <div>
                                <Label>Per Night</Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {selectedApplication.pricing.perNight} {selectedApplication.pricing.currency}
                                </p>
                              </div>
                            )}
                            {selectedApplication.pricing.perWeek && (
                              <div>
                                <Label>Per Week</Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {selectedApplication.pricing.perWeek} {selectedApplication.pricing.currency}
                                </p>
                              </div>
                            )}
                            {selectedApplication.pricing.perMonth && (
                              <div>
                                <Label>Per Month</Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {selectedApplication.pricing.perMonth} {selectedApplication.pricing.currency}
                                </p>
                              </div>
                            )}
                            <div>
                              <Label>Minimum Stay</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.pricing.minStay} days
                              </p>
                            </div>
                            {selectedApplication.pricing.maxStay && (
                              <div>
                                <Label>Maximum Stay</Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {selectedApplication.pricing.maxStay} days
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              Deposits & Fees
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label>Security Deposit</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.pricing.deposits.security} {selectedApplication.pricing.currency}
                              </p>
                            </div>
                            {selectedApplication.pricing.deposits.cleaning && (
                              <div>
                                <Label>Cleaning Fee</Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {selectedApplication.pricing.deposits.cleaning} {selectedApplication.pricing.currency}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="availability" className="space-y-6 m-0">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Availability Calendar
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label>Available From</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedApplication.availability.availableFrom.toLocaleDateString()}
                            </p>
                          </div>
                          {selectedApplication.availability.availableTo && (
                            <div>
                              <Label>Available Until</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedApplication.availability.availableTo.toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          <div>
                            <Label>Calendar Integration</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedApplication.availability.calendar}
                            </p>
                          </div>
                          <div className="p-4 border rounded-lg bg-muted/20">
                            <p className="text-sm text-muted-foreground text-center">
                              Calendar preview would be displayed here
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="verification" className="space-y-6 m-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Identity Documents
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {selectedApplication.verification.idDocuments.length > 0 ? (
                              <div className="space-y-4">
                                {selectedApplication.verification.idDocuments.map((doc, index) => (
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
                              <Home className="w-4 h-4" />
                              Property Proof
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {selectedApplication.verification.propertyProof.length > 0 ? (
                              <div className="space-y-4">
                                {selectedApplication.verification.propertyProof.map((doc, index) => (
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
                                <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No property proof uploaded</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>

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
                              {selectedApplication.verification.payoutMethod.type}
                            </p>
                          </div>
                          <div>
                            <Label>Details</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedApplication.verification.payoutMethod.details}
                            </p>
                          </div>
                          <div>
                            <Label>Status</Label>
                            <div className="mt-1">
                              {selectedApplication.verification.payoutMethod.verified ? (
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
                    <PermissionGate userRole={userRole} module="homestays" permission="A">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </PermissionGate>
                    <PermissionGate userRole={userRole} module="homestays" permission="U">
                      <Button variant="outline" onClick={() => setShowRequestInfoDialog(true)}>
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Request Info
                      </Button>
                    </PermissionGate>
                    <PermissionGate userRole={userRole} module="homestays" permission="D">
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
          <h2>Homestay Applications</h2>
          <p className="text-muted-foreground">
            Review and verify homestay applications
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
                placeholder="Search homestays..."
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

            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="Barcelona">Barcelona</SelectItem>
                <SelectItem value="London">London</SelectItem>
                <SelectItem value="Madrid">Madrid</SelectItem>
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

            <PermissionGate userRole={userRole} module="homestays" permission="U">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={selectedItems.length === 0}>
                    Bulk Actions ({selectedItems.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <PermissionGate userRole={userRole} module="homestays" permission="A">
                    <DropdownMenuItem>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Selected
                    </DropdownMenuItem>
                  </PermissionGate>
                  <DropdownMenuItem>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Request Info
                  </DropdownMenuItem>
                  <PermissionGate userRole={userRole} module="homestays" permission="D">
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
                <TableHead>Host</TableHead>
                <TableHead>City/Area</TableHead>
                <TableHead>Rooms</TableHead>
                <TableHead>Photos</TableHead>
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
                        <AvatarFallback>{application.hostName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{application.hostName}</p>
                        {application.propertyName && (
                          <p className="text-xs text-muted-foreground">{application.propertyName}</p>
                        )}
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
                      {application.city}, {application.area}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{application.roomsCount}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{application.photosCount}</Badge>
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
                      {application.autoChecks.id ? 
                        <CheckCircle className="w-4 h-4 text-green-600" title="ID Verified" /> : 
                        <XCircle className="w-4 h-4 text-red-600" title="ID Missing" />
                      }
                      {application.autoChecks.photos ? 
                        <CheckCircle className="w-4 h-4 text-green-600" title="Photos OK" /> : 
                        <XCircle className="w-4 h-4 text-red-600" title="Photos Issue" />
                      }
                      {application.autoChecks.address ? 
                        <CheckCircle className="w-4 h-4 text-green-600" title="Address OK" /> : 
                        <XCircle className="w-4 h-4 text-red-600" title="Address Issue" />
                      }
                      {application.autoChecks.pricing ? 
                        <CheckCircle className="w-4 h-4 text-green-600" title="Pricing OK" /> : 
                        <XCircle className="w-4 h-4 text-red-600" title="Pricing Issue" />
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
                        <PermissionGate userRole={userRole} module="homestays" permission="A">
                          <DropdownMenuItem>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                        </PermissionGate>
                        <PermissionGate userRole={userRole} module="homestays" permission="U">
                          <DropdownMenuItem>
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Request Info
                          </DropdownMenuItem>
                        </PermissionGate>
                        <DropdownMenuItem>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </DropdownMenuItem>
                        <PermissionGate userRole={userRole} module="homestays" permission="D">
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
                  <SelectItem value="photos">Need at least 6 high-quality photos</SelectItem>
                  <SelectItem value="address">Clarify address (map location)</SelectItem>
                  <SelectItem value="amenities">Room amenities missing</SelectItem>
                  <SelectItem value="pricing">Adjust pricing to market standards</SelectItem>
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
                  <SelectItem value="photos">Insufficient or poor quality photos</SelectItem>
                  <SelectItem value="location">Unsuitable location</SelectItem>
                  <SelectItem value="verification">Failed identity verification</SelectItem>
                  <SelectItem value="property">Property doesn't meet standards</SelectItem>
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
              Send a message to the host
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