import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Copy,
  Calendar as CalendarIcon,
  Clock,
  Globe,
  Link as LinkIcon,
  Upload,
  Play,
  Pause,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Smartphone,
  Image as ImageIcon,
  Video,
  ExternalLink,
  GripVertical,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Save,
  Settings,
  Languages,
  Target
} from "lucide-react";
import { UserRole, hasPermission } from "../utils/permissions";
import { format } from "date-fns";

interface Offer {
  id: string;
  type: "story" | "banner";
  title: string;
  description?: string;
  thumbnail: string;
  media: {
    [language: string]: {
      type: "image" | "video";
      url: string;
      duration?: number; // for videos
    };
  };
  content: {
    [language: string]: {
      caption?: string;
      ctaLabel?: string;
    };
  };
  linkType: "none" | "lesson" | "program" | "institution" | "external";
  linkTarget?: string;
  linkUrl?: string;
  placement?: {
    row: number;
    position: number;
  };
  priority: number;
  status: "draft" | "scheduled" | "live" | "paused" | "expired";
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  languages: string[];
  analytics: {
    impressions: number;
    clicks: number;
    ctr: number;
  };
}

interface OffersManagerProps {
  userRole: UserRole;
}

export function OffersManager({ userRole }: OffersManagerProps) {
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: "1",
      type: "story",
      title: "Spanish Beginner Course Launch",
      thumbnail: "/api/placeholder/60/60",
      media: {
        en: { type: "video", url: "/api/placeholder/400/400", duration: 25 },
        es: { type: "video", url: "/api/placeholder/400/400", duration: 23 }
      },
      content: {
        en: { 
          caption: "Start your Spanish journey today! 🇪🇸",
          ctaLabel: "Enroll Now"
        },
        es: {
          caption: "¡Comienza tu viaje en español hoy! 🇪🇸",
          ctaLabel: "Inscríbete Ahora"
        }
      },
      linkType: "lesson",
      linkTarget: "spanish-beginner-course",
      priority: 1,
      status: "live",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-03-01"),
      createdAt: new Date("2023-12-15"),
      updatedAt: new Date("2024-01-05"),
      createdBy: "admin1",
      languages: ["en", "es"],
      analytics: { impressions: 15420, clicks: 1850, ctr: 12.0 }
    },
    {
      id: "2",
      type: "banner",
      title: "Language Immersion Program",
      description: "Experience authentic language learning with our homestay programs",
      thumbnail: "/api/placeholder/400/200",
      media: {
        en: { type: "image", url: "/api/placeholder/800/400" },
        fr: { type: "image", url: "/api/placeholder/800/400" }
      },
      content: {
        en: {
          caption: "Live. Learn. Experience the culture.",
          ctaLabel: "Explore Programs"
        },
        fr: {
          caption: "Vivre. Apprendre. Découvrir la culture.",
          ctaLabel: "Explorer les Programmes"
        }
      },
      linkType: "program",
      linkTarget: "immersion-programs",
      placement: { row: 1, position: 1 },
      priority: 2,
      status: "live",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-06-15"),
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-12"),
      createdBy: "content1",
      languages: ["en", "fr"],
      analytics: { impressions: 8750, clicks: 524, ctr: 6.0 }
    },
    {
      id: "3",
      type: "story",
      title: "AI Practice Feature Demo",
      thumbnail: "/api/placeholder/60/60",
      media: {
        en: { type: "video", url: "/api/placeholder/400/400", duration: 30 }
      },
      content: {
        en: {
          caption: "Practice conversations with AI tutors anytime! 🤖",
          ctaLabel: "Try Now"
        }
      },
      linkType: "external",
      linkUrl: "https://app.learningplatform.com/ai-practice",
      priority: 3,
      status: "scheduled",
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-02-29"),
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-20"),
      createdBy: "admin1",
      languages: ["en"],
      analytics: { impressions: 0, clicks: 0, ctr: 0 }
    }
  ]);

  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewLanguage, setPreviewLanguage] = useState("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("priority");
  const [editingOffer, setEditingOffer] = useState<Partial<Offer> | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableLanguages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" }
  ];

  const linkTypes = [
    { value: "none", label: "No Link (Media Only)" },
    { value: "lesson", label: "Link to Lesson" },
    { value: "program", label: "Link to Program" },
    { value: "institution", label: "Link to Institution" },
    { value: "external", label: "External URL" }
  ];

  const handleCreateOffer = () => {
    setEditingOffer({
      type: "story",
      title: "",
      description: "",
      media: {},
      content: {},
      linkType: "none",
      priority: offers.length + 1,
      status: "draft",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      languages: ["en"]
    });
    setSelectedLanguage("en");
    setShowCreateDialog(true);
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer({ ...offer });
    setSelectedLanguage(offer.languages[0] || "en");
    setShowCreateDialog(true);
  };

  const handleSaveOffer = () => {
    if (!editingOffer) return;

    const now = new Date();
    const offerData: Offer = {
      id: editingOffer.id || `offer_${Date.now()}`,
      type: editingOffer.type || "story",
      title: editingOffer.title || "",
      description: editingOffer.description,
      thumbnail: editingOffer.thumbnail || "/api/placeholder/60/60",
      media: editingOffer.media || {},
      content: editingOffer.content || {},
      linkType: editingOffer.linkType || "none",
      linkTarget: editingOffer.linkTarget,
      linkUrl: editingOffer.linkUrl,
      placement: editingOffer.placement,
      priority: editingOffer.priority || offers.length + 1,
      status: editingOffer.status || "draft",
      startDate: editingOffer.startDate || now,
      endDate: editingOffer.endDate || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      createdAt: editingOffer.createdAt || now,
      updatedAt: now,
      createdBy: editingOffer.createdBy || "current_user",
      languages: editingOffer.languages || ["en"],
      analytics: editingOffer.analytics || { impressions: 0, clicks: 0, ctr: 0 }
    };

    if (editingOffer.id) {
      setOffers(prev => prev.map(offer => offer.id === editingOffer.id ? offerData : offer));
    } else {
      setOffers(prev => [...prev, offerData]);
    }

    setShowCreateDialog(false);
    setEditingOffer(null);
  };

  const handleDeleteOffer = (offerId: string) => {
    setOffers(prev => prev.filter(offer => offer.id !== offerId));
  };

  const toggleOfferStatus = (offerId: string) => {
    setOffers(prev => prev.map(offer => {
      if (offer.id === offerId) {
        const newStatus = offer.status === "live" ? "paused" : 
                         offer.status === "paused" ? "live" : 
                         offer.status;
        return { ...offer, status: newStatus, updatedAt: new Date() };
      }
      return offer;
    }));
  };

  const moveOfferPriority = (offerId: string, direction: "up" | "down") => {
    setOffers(prev => {
      const offerIndex = prev.findIndex(o => o.id === offerId);
      if (offerIndex === -1) return prev;

      const newOffers = [...prev];
      const currentOffer = newOffers[offerIndex];
      
      if (direction === "up" && offerIndex > 0) {
        [newOffers[offerIndex], newOffers[offerIndex - 1]] = [newOffers[offerIndex - 1], newOffers[offerIndex]];
      } else if (direction === "down" && offerIndex < newOffers.length - 1) {
        [newOffers[offerIndex], newOffers[offerIndex + 1]] = [newOffers[offerIndex + 1], newOffers[offerIndex]];
      }
      
      return newOffers.map((offer, index) => ({
        ...offer,
        priority: index + 1,
        updatedAt: new Date()
      }));
    });
  };

  const duplicateOffer = (offer: Offer) => {
    const duplicated: Offer = {
      ...offer,
      id: `offer_${Date.now()}`,
      title: `${offer.title} (Copy)`,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: offers.length + 1,
      analytics: { impressions: 0, clicks: 0, ctr: 0 }
    };
    setOffers(prev => [...prev, duplicated]);
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         offer.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || offer.type === filterType;
    const matchesStatus = filterStatus === "all" || offer.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case "priority": return a.priority - b.priority;
      case "created": return b.createdAt.getTime() - a.createdAt.getTime();
      case "status": return a.status.localeCompare(b.status);
      case "type": return a.type.localeCompare(b.type);
      default: return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-green-100 text-green-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      case "draft": return "bg-gray-100 text-gray-800";
      case "expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live": return <CheckCircle className="w-4 h-4" />;
      case "scheduled": return <Clock className="w-4 h-4" />;
      case "paused": return <Pause className="w-4 h-4" />;
      case "draft": return <Edit className="w-4 h-4" />;
      case "expired": return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const canCreate = hasPermission(userRole, "offers", "C");
  const canUpdate = hasPermission(userRole, "offers", "U");
  const canDelete = hasPermission(userRole, "offers", "D");
  const canConfigure = hasPermission(userRole, "offers", "G");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Offers Manager</h1>
          <p className="text-muted-foreground">
            Manage story offers and banner carousels for the student app home page
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Smartphone className="w-4 h-4 mr-2" />
            Preview App
          </Button>
          {canCreate && (
            <Button onClick={handleCreateOffer}>
              <Plus className="w-4 h-4 mr-2" />
              New Offer
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Play className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Live Offers</p>
                <p className="text-xl font-semibold">{offers.filter(o => o.status === "live").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Impressions</p>
                <p className="text-xl font-semibold">
                  {offers.reduce((sum, o) => sum + o.analytics.impressions, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-xl font-semibold">
                  {offers.reduce((sum, o) => sum + o.analytics.clicks, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <RefreshCw className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg CTR</p>
                <p className="text-xl font-semibold">
                  {(offers.reduce((sum, o) => sum + o.analytics.ctr, 0) / offers.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search offers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="story">Story Offers</SelectItem>
                <SelectItem value="banner">Banner Offers</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="created">Created Date</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Offers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Offers List ({filteredOffers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Order</TableHead>
                <TableHead>Offer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Placement</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOffers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-muted-foreground">#{offer.priority}</span>
                      {canUpdate && (
                        <div className="flex flex-col">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 p-0"
                            onClick={() => moveOfferPriority(offer.id, "up")}
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 p-0"
                            onClick={() => moveOfferPriority(offer.id, "down")}
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12 rounded-lg">
                        <AvatarImage src={offer.thumbnail} />
                        <AvatarFallback>
                          {offer.type === "story" ? <Video className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{offer.title}</h4>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {offer.description}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          {offer.languages.map(lang => (
                            <Badge key={lang} variant="secondary" className="text-xs">
                              {availableLanguages.find(l => l.code === lang)?.flag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {offer.type}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    {offer.type === "banner" && offer.placement ? (
                      <span className="text-sm">Row {offer.placement.row}, Pos {offer.placement.position}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Story Bar</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {offer.linkType !== "none" && (
                        <>
                          <LinkIcon className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm capitalize">{offer.linkType}</span>
                        </>
                      )}
                      {offer.linkType === "none" && (
                        <span className="text-sm text-muted-foreground">No Link</span>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <p>{format(offer.startDate, "MMM dd")}</p>
                      <p className="text-muted-foreground">{format(offer.endDate, "MMM dd")}</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(offer.status)}
                      <Badge className={getStatusColor(offer.status)}>
                        {offer.status}
                      </Badge>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <p>{offer.analytics.impressions.toLocaleString()} views</p>
                      <p className="text-muted-foreground">{offer.analytics.ctr}% CTR</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedOffer(offer);
                          setShowPreview(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {canUpdate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditOffer(offer)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48" align="end">
                          <div className="space-y-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() => duplicateOffer(offer)}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </Button>
                            
                            {canUpdate && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => toggleOfferStatus(offer.id)}
                              >
                                {offer.status === "live" ? (
                                  <>
                                    <Pause className="w-4 h-4 mr-2" />
                                    Pause
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-4 h-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </Button>
                            )}
                            
                            {canDelete && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-destructive"
                                onClick={() => handleDeleteOffer(offer.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Offer Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {editingOffer?.id ? "Edit Offer" : "Create New Offer"}
            </DialogTitle>
            <DialogDescription>
              Configure offer content, targeting, and scheduling
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="targeting">Targeting</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="offer-type">Offer Type</Label>
                    <Select
                      value={editingOffer?.type}
                      onValueChange={(value: "story" | "banner") => 
                        setEditingOffer(prev => prev ? { ...prev, type: value } : null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="story">Story Offer</SelectItem>
                        <SelectItem value="banner">Banner Offer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={editingOffer?.priority || 1}
                      onChange={(e) => 
                        setEditingOffer(prev => prev ? { 
                          ...prev, 
                          priority: parseInt(e.target.value) || 1 
                        } : null)
                      }
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingOffer?.title || ""}
                    onChange={(e) => 
                      setEditingOffer(prev => prev ? { ...prev, title: e.target.value } : null)
                    }
                    placeholder="Enter offer title"
                  />
                </div>
                
                {editingOffer?.type === "banner" && (
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editingOffer?.description || ""}
                      onChange={(e) => 
                        setEditingOffer(prev => prev ? { ...prev, description: e.target.value } : null)
                      }
                      placeholder="Enter offer description"
                    />
                  </div>
                )}
                
                {editingOffer?.type === "banner" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Placement Row</Label>
                      <Input
                        type="number"
                        value={editingOffer?.placement?.row || 1}
                        onChange={(e) => 
                          setEditingOffer(prev => prev ? { 
                            ...prev, 
                            placement: { 
                              ...prev.placement, 
                              row: parseInt(e.target.value) || 1,
                              position: prev.placement?.position || 1
                            }
                          } : null)
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Position in Row</Label>
                      <Input
                        type="number"
                        value={editingOffer?.placement?.position || 1}
                        onChange={(e) => 
                          setEditingOffer(prev => prev ? { 
                            ...prev, 
                            placement: { 
                              ...prev.placement, 
                              row: prev.placement?.row || 1,
                              position: parseInt(e.target.value) || 1
                            }
                          } : null)
                        }
                      />
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="content" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Multilingual Content</h4>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLanguages.map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border rounded-lg p-4 space-y-4">
                  <h5 className="font-medium">
                    {availableLanguages.find(l => l.code === selectedLanguage)?.flag} {" "}
                    {availableLanguages.find(l => l.code === selectedLanguage)?.name} Content
                  </h5>
                  
                  <div className="space-y-2">
                    <Label>Media Upload</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {editingOffer?.type === "story" 
                          ? "Upload video (MP4, max 30 seconds)" 
                          : "Upload image or video"
                        }
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Choose File
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Caption</Label>
                    <Textarea
                      value={editingOffer?.content?.[selectedLanguage]?.caption || ""}
                      onChange={(e) => 
                        setEditingOffer(prev => prev ? {
                          ...prev,
                          content: {
                            ...prev.content,
                            [selectedLanguage]: {
                              ...prev.content?.[selectedLanguage],
                              caption: e.target.value
                            }
                          }
                        } : null)
                      }
                      placeholder="Enter caption for this language"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>CTA Button Label (Optional)</Label>
                    <Input
                      value={editingOffer?.content?.[selectedLanguage]?.ctaLabel || ""}
                      onChange={(e) => 
                        setEditingOffer(prev => prev ? {
                          ...prev,
                          content: {
                            ...prev.content,
                            [selectedLanguage]: {
                              ...prev.content?.[selectedLanguage],
                              ctaLabel: e.target.value
                            }
                          }
                        } : null)
                      }
                      placeholder="e.g., Learn More, Enroll Now"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="targeting" className="space-y-4">
                <div className="space-y-2">
                  <Label>Link Type</Label>
                  <Select
                    value={editingOffer?.linkType}
                    onValueChange={(value) => 
                      setEditingOffer(prev => prev ? { ...prev, linkType: value as any } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {linkTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {editingOffer?.linkType === "external" && (
                  <div className="space-y-2">
                    <Label>External URL</Label>
                    <Input
                      value={editingOffer?.linkUrl || ""}
                      onChange={(e) => 
                        setEditingOffer(prev => prev ? { ...prev, linkUrl: e.target.value } : null)
                      }
                      placeholder="https://example.com"
                    />
                  </div>
                )}
                
                {editingOffer?.linkType && !["none", "external"].includes(editingOffer.linkType) && (
                  <div className="space-y-2">
                    <Label>Link Target ID</Label>
                    <Input
                      value={editingOffer?.linkTarget || ""}
                      onChange={(e) => 
                        setEditingOffer(prev => prev ? { ...prev, linkTarget: e.target.value } : null)
                      }
                      placeholder={`Enter ${editingOffer.linkType} ID`}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>Languages</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableLanguages.map(lang => (
                      <div key={lang.code} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`lang-${lang.code}`}
                          checked={editingOffer?.languages?.includes(lang.code) || false}
                          onChange={(e) => {
                            const languages = editingOffer?.languages || [];
                            const newLanguages = e.target.checked
                              ? [...languages, lang.code]
                              : languages.filter(l => l !== lang.code);
                            setEditingOffer(prev => prev ? { ...prev, languages: newLanguages } : null);
                          }}
                        />
                        <Label htmlFor={`lang-${lang.code}`} className="text-sm">
                          {lang.flag} {lang.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {editingOffer?.startDate 
                            ? format(editingOffer.startDate, "PPP")
                            : "Select date"
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={editingOffer?.startDate}
                          onSelect={(date) => 
                            date && setEditingOffer(prev => prev ? { ...prev, startDate: date } : null)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {editingOffer?.endDate 
                            ? format(editingOffer.endDate, "PPP")
                            : "Select date"
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={editingOffer?.endDate}
                          onSelect={(date) => 
                            date && setEditingOffer(prev => prev ? { ...prev, endDate: date } : null)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editingOffer?.status}
                    onValueChange={(value) => 
                      setEditingOffer(prev => prev ? { ...prev, status: value as any } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveOffer}>
              <Save className="w-4 h-4 mr-2" />
              Save Offer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile App Preview */}
      <Sheet open={showPreview} onOpenChange={setShowPreview}>
        <SheetContent side="right" className="w-96">
          <SheetHeader>
            <SheetTitle>Mobile App Preview</SheetTitle>
            <SheetDescription>
              Preview how offers appear in the student app home page
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            <div className="mb-4">
              <Select value={previewLanguage} onValueChange={setPreviewLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Mobile Frame */}
            <div className="bg-gray-900 rounded-[2rem] p-2">
              <div className="bg-white rounded-[1.5rem] h-[600px] overflow-hidden">
                {/* Mobile Status Bar */}
                <div className="bg-gray-50 px-4 py-2 text-xs flex justify-between">
                  <span>9:41 AM</span>
                  <span>100%</span>
                </div>
                
                {/* App Header */}
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Home</h3>
                </div>
                
                <ScrollArea className="h-[520px]">
                  <div className="p-4 space-y-6">
                    {/* Story Bar */}
                    <div>
                      <h4 className="font-medium mb-3">Stories</h4>
                      <div className="flex space-x-3 overflow-x-auto">
                        {offers
                          .filter(o => o.type === "story" && o.status === "live")
                          .filter(o => o.languages.includes(previewLanguage))
                          .map(offer => (
                            <div key={offer.id} className="flex-shrink-0">
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-1">
                                <div className="w-full h-full rounded-full overflow-hidden">
                                  <img
                                    src={offer.thumbnail}
                                    alt={offer.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                              <p className="text-xs text-center mt-1 truncate w-16">
                                {offer.title.split(' ')[0]}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    {/* Banner Rows */}
                    {[1, 2, 3].map(rowNum => {
                      const rowOffers = offers
                        .filter(o => o.type === "banner" && o.status === "live")
                        .filter(o => o.placement?.row === rowNum)
                        .filter(o => o.languages.includes(previewLanguage));
                      
                      if (rowOffers.length === 0) return null;
                      
                      return (
                        <div key={rowNum}>
                          <h4 className="font-medium mb-3">Featured {rowNum === 1 ? "Courses" : rowNum === 2 ? "Programs" : "Offers"}</h4>
                          <div className="flex space-x-3 overflow-x-auto">
                            {rowOffers.map(offer => (
                              <div key={offer.id} className="flex-shrink-0 w-64">
                                <div className="rounded-lg overflow-hidden border">
                                  <img
                                    src={offer.thumbnail}
                                    alt={offer.title}
                                    className="w-full h-32 object-cover"
                                  />
                                  <div className="p-3">
                                    <h5 className="font-medium text-sm">{offer.title}</h5>
                                    <p className="text-xs text-gray-600 mt-1">
                                      {offer.content[previewLanguage]?.caption}
                                    </p>
                                    {offer.content[previewLanguage]?.ctaLabel && (
                                      <Button size="sm" className="mt-2 text-xs h-8">
                                        {offer.content[previewLanguage].ctaLabel}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}