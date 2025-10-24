import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Calendar } from "./ui/calendar";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  TrendingUp,
  Target,
  MoreHorizontal,
  Settings,
  GraduationCap,
  Building,
  Home as HomeIcon,
  Crown,
  RefreshCw,
  Download,
  BarChart3,
  CheckCircle,
  AlertCircle,
  XCircle,
  Package,
  AlertTriangle,
  FileText,
  Zap,
  ChevronDown,
  ExternalLink,
  Store,
  Percent
} from "lucide-react";
import { UserRole, hasPermission } from "../utils/permissions";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

interface GlobalPricingConfig {
  carouselPromotion: {
    hourly: number;
    daily: number;
    weekly: number;
  };
  searchBoost: {
    hourly: number;
    daily: number;
    weekly: number;
  };
  bundleDiscounts: {
    threeDay: number; // percentage
    sevenDay: number;
    fourteenDay: number;
  };
  slotsPerDay: {
    carousel: number;
    searchBoost: number;
  };
  currency: string;
}

interface PendingPromotion {
  id: string;
  userId: string;
  userName: string;
  userType: "teacher" | "homestay" | "institution" | "marketplace";
  userAvatar: string;
  promotionType: "carousel" | "searchBoost" | "both";
  duration: "hourly" | "daily" | "weekly";
  startDate: Date;
  endDate: Date;
  targetAudience: {
    languages?: string[];
    countries?: string[];
    cities?: string[];
  };
  requestedSlots: number;
  totalCost: number;
  currency: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;
  itemPreview: {
    title: string;
    description: string;
    image: string;
    rating: number;
  };
}

interface CalendarPromotion {
  id: string;
  userName: string;
  userType: "teacher" | "homestay" | "institution" | "marketplace";
  promotionType: "carousel" | "searchBoost";
  date: Date;
  status: "scheduled" | "active" | "completed";
}

interface PromotionAnalytics {
  totalRevenue: number;
  totalPromotions: number;
  activePromotions: number;
  avgDuration: number;
  topPromoted: {
    name: string;
    type: string;
    revenue: number;
    promotions: number;
  }[];
  revenueByType: {
    teacher: number;
    homestay: number;
    institution: number;
    marketplace: number;
  };
  utilizationRate: number;
}

interface ConflictDetection {
  date: Date;
  promotionType: "carousel" | "searchBoost";
  maxSlots: number;
  bookedSlots: number;
  conflicts: {
    id: string;
    userName: string;
    userType: string;
    timeSlot: string;
  }[];
}

interface AdminPromotionsManagerProps {
  userRole: UserRole;
}

export function AdminPromotionsManager({ userRole }: AdminPromotionsManagerProps) {
  const [activeTab, setActiveTab] = useState("settings");
  const [globalPricing, setGlobalPricing] = useState<GlobalPricingConfig>({
    carouselPromotion: { hourly: 15.99, daily: 49.99, weekly: 299.99 },
    searchBoost: { hourly: 9.99, daily: 29.99, weekly: 179.99 },
    bundleDiscounts: { threeDay: 5, sevenDay: 10, fourteenDay: 15 },
    slotsPerDay: { carousel: 5, searchBoost: 10 },
    currency: "USD"
  });

  const [pendingPromotions, setPendingPromotions] = useState<PendingPromotion[]>([
    {
      id: "pending1",
      userId: "user1",
      userName: "Sarah Johnson",
      userType: "teacher",
      userAvatar: "/api/placeholder/40/40",
      promotionType: "carousel",
      duration: "weekly",
      startDate: new Date(2025, 9, 10),
      endDate: new Date(2025, 9, 17),
      targetAudience: { languages: ["Spanish", "English"] },
      requestedSlots: 1,
      totalCost: 299.99,
      currency: "USD",
      status: "pending",
      submittedAt: new Date(2025, 9, 7, 14, 30),
      itemPreview: {
        title: "Advanced Spanish Conversation",
        description: "Master conversational Spanish with native speaker",
        image: "/api/placeholder/100/100",
        rating: 4.9
      }
    },
    {
      id: "pending2",
      userId: "user2",
      userName: "Tokyo Language House",
      userType: "homestay",
      userAvatar: "/api/placeholder/40/40",
      promotionType: "both",
      duration: "daily",
      startDate: new Date(2025, 9, 8),
      endDate: new Date(2025, 9, 11),
      targetAudience: { countries: ["Japan"], cities: ["Tokyo"] },
      requestedSlots: 2,
      totalCost: 239.96,
      currency: "USD",
      status: "pending",
      submittedAt: new Date(2025, 9, 7, 10, 15),
      itemPreview: {
        title: "Central Tokyo Homestay",
        description: "Experience authentic Japanese culture",
        image: "/api/placeholder/100/100",
        rating: 4.8
      }
    },
    {
      id: "pending3",
      userId: "user3",
      userName: "Global Institute Berlin",
      userType: "institution",
      userAvatar: "/api/placeholder/40/40",
      promotionType: "searchBoost",
      duration: "weekly",
      startDate: new Date(2025, 9, 15),
      endDate: new Date(2025, 9, 22),
      targetAudience: { languages: ["German", "English"] },
      requestedSlots: 1,
      totalCost: 179.99,
      currency: "USD",
      status: "pending",
      submittedAt: new Date(2025, 9, 6, 16, 45),
      itemPreview: {
        title: "Intensive German Program",
        description: "Professional German language certification",
        image: "/api/placeholder/100/100",
        rating: 4.7
      }
    },
    {
      id: "pending4",
      userId: "user4",
      userName: "Language Mastery Course",
      userType: "marketplace",
      userAvatar: "/api/placeholder/40/40",
      promotionType: "carousel",
      duration: "daily",
      startDate: new Date(2025, 9, 9),
      endDate: new Date(2025, 9, 12),
      targetAudience: { languages: ["French"] },
      requestedSlots: 1,
      totalCost: 149.97,
      currency: "USD",
      status: "pending",
      submittedAt: new Date(2025, 9, 7, 9, 20),
      itemPreview: {
        title: "Complete French Language Bundle",
        description: "Beginner to advanced French course",
        image: "/api/placeholder/100/100",
        rating: 4.6
      }
    }
  ]);

  const [calendarPromotions, setCalendarPromotions] = useState<CalendarPromotion[]>([
    {
      id: "cal1",
      userName: "Emma Chen",
      userType: "teacher",
      promotionType: "carousel",
      date: new Date(2025, 9, 8),
      status: "active"
    },
    {
      id: "cal2",
      userName: "Paris Homestay",
      userType: "homestay",
      promotionType: "searchBoost",
      date: new Date(2025, 9, 8),
      status: "active"
    },
    {
      id: "cal3",
      userName: "Madrid Academy",
      userType: "institution",
      promotionType: "carousel",
      date: new Date(2025, 9, 10),
      status: "scheduled"
    },
    {
      id: "cal4",
      userName: "Korean Basics",
      userType: "marketplace",
      promotionType: "searchBoost",
      date: new Date(2025, 9, 12),
      status: "scheduled"
    }
  ]);

  const [analytics, setAnalytics] = useState<PromotionAnalytics>({
    totalRevenue: 45678.90,
    totalPromotions: 156,
    activePromotions: 23,
    avgDuration: 5.2,
    topPromoted: [
      { name: "Sarah Johnson", type: "Teacher", revenue: 1299.95, promotions: 5 },
      { name: "Tokyo Language House", type: "Homestay", revenue: 899.94, promotions: 4 },
      { name: "Global Institute Berlin", type: "Institution", revenue: 1499.95, promotions: 6 },
      { name: "French Master Course", type: "Marketplace", revenue: 749.97, promotions: 3 }
    ],
    revenueByType: {
      teacher: 15234.50,
      homestay: 12456.30,
      institution: 13567.80,
      marketplace: 4420.30
    },
    utilizationRate: 78.5
  });

  const [conflicts, setConflicts] = useState<ConflictDetection[]>([
    {
      date: new Date(2025, 9, 10),
      promotionType: "carousel",
      maxSlots: 5,
      bookedSlots: 5,
      conflicts: [
        { id: "c1", userName: "Sarah Johnson", userType: "teacher", timeSlot: "Slot 1" },
        { id: "c2", userName: "Madrid Academy", userType: "institution", timeSlot: "Slot 2" }
      ]
    }
  ]);

  const [selectedPromotion, setSelectedPromotion] = useState<PendingPromotion | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterUserType, setFilterUserType] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const canManagePromotions = hasPermission(userRole, "promotions", "A");
  const canViewAnalytics = hasPermission(userRole, "analytics", "R");

  const handleReviewPromotion = (promotion: PendingPromotion, action: "approve" | "reject") => {
    setSelectedPromotion(promotion);
    setReviewAction(action);
    setShowReviewDialog(true);
    setReviewNotes("");
  };

  const submitReview = () => {
    if (!selectedPromotion || !reviewAction) return;

    setPendingPromotions(prev =>
      prev.map(p =>
        p.id === selectedPromotion.id
          ? {
              ...p,
              status: reviewAction === "approve" ? "approved" : "rejected",
              reviewedAt: new Date(),
              reviewedBy: "Admin User",
              reviewNotes: reviewNotes
            }
          : p
      )
    );

    setShowReviewDialog(false);
    setSelectedPromotion(null);
    setReviewAction(null);
    setReviewNotes("");
  };

  const filteredPromotions = pendingPromotions.filter(promo => {
    const matchesSearch = promo.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         promo.itemPreview.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || promo.promotionType === filterType;
    const matchesStatus = filterStatus === "all" || promo.status === filterStatus;
    const matchesUserType = filterUserType === "all" || promo.userType === filterUserType;
    
    return matchesSearch && matchesType && matchesStatus && matchesUserType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Rejected</Badge>;
      case "active":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Active</Badge>;
      case "scheduled":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case "teacher":
        return <GraduationCap className="w-4 h-4" />;
      case "homestay":
        return <HomeIcon className="w-4 h-4" />;
      case "institution":
        return <Building className="w-4 h-4" />;
      case "marketplace":
        return <Store className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPromotionTypeColor = (type: string) => {
    switch (type) {
      case "teacher":
        return "bg-blue-500";
      case "homestay":
        return "bg-green-500";
      case "institution":
        return "bg-purple-500";
      case "marketplace":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth)
  });

  const getPromotionsForDay = (day: Date) => {
    return calendarPromotions.filter(promo => isSameDay(promo.date, day));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1>Admin Promotions Manager</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Manage global promotion settings, approvals, and analytics
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All-time promotion revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Active Promotions</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{analytics.activePromotions}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{pendingPromotions.filter(p => p.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Utilization Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{analytics.utilizationRate}%</div>
            <p className="text-xs text-muted-foreground">Slot occupancy</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">Settings</span>
          </TabsTrigger>
          <TabsTrigger value="approvals" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Approvals</span>
            <span className="sm:hidden">Approvals</span>
            {pendingPromotions.filter(p => p.status === "pending").length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1">
                {pendingPromotions.filter(p => p.status === "pending").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Calendar</span>
            <span className="sm:hidden">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="conflicts" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Conflicts</span>
            <span className="sm:hidden">Conflicts</span>
            {conflicts.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1">
                {conflicts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Global Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Promotion Pricing Configuration</CardTitle>
              <CardDescription>
                Set global pricing for carousel and search boost promotions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Carousel Promotion Pricing */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <Crown className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h3>Carousel Promotion</h3>
                    <p className="text-sm text-muted-foreground">Featured placement in app carousels</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Hourly Rate</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={globalPricing.carouselPromotion.hourly}
                        onChange={(e) =>
                          setGlobalPricing({
                            ...globalPricing,
                            carouselPromotion: {
                              ...globalPricing.carouselPromotion,
                              hourly: parseFloat(e.target.value)
                            }
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Daily Rate</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={globalPricing.carouselPromotion.daily}
                        onChange={(e) =>
                          setGlobalPricing({
                            ...globalPricing,
                            carouselPromotion: {
                              ...globalPricing.carouselPromotion,
                              daily: parseFloat(e.target.value)
                            }
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Weekly Rate</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={globalPricing.carouselPromotion.weekly}
                        onChange={(e) =>
                          setGlobalPricing({
                            ...globalPricing,
                            carouselPromotion: {
                              ...globalPricing.carouselPromotion,
                              weekly: parseFloat(e.target.value)
                            }
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Search Boost Pricing */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Zap className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3>Search Boost Promotion</h3>
                    <p className="text-sm text-muted-foreground">Priority ranking in search results</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Hourly Rate</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={globalPricing.searchBoost.hourly}
                        onChange={(e) =>
                          setGlobalPricing({
                            ...globalPricing,
                            searchBoost: {
                              ...globalPricing.searchBoost,
                              hourly: parseFloat(e.target.value)
                            }
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Daily Rate</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={globalPricing.searchBoost.daily}
                        onChange={(e) =>
                          setGlobalPricing({
                            ...globalPricing,
                            searchBoost: {
                              ...globalPricing.searchBoost,
                              daily: parseFloat(e.target.value)
                            }
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Weekly Rate</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={globalPricing.searchBoost.weekly}
                        onChange={(e) =>
                          setGlobalPricing({
                            ...globalPricing,
                            searchBoost: {
                              ...globalPricing.searchBoost,
                              weekly: parseFloat(e.target.value)
                            }
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Bundle Discounts */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <Percent className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3>Bundle Discounts</h3>
                    <p className="text-sm text-muted-foreground">Percentage discounts for longer durations</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>3-Day Bundle</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={globalPricing.bundleDiscounts.threeDay}
                        onChange={(e) =>
                          setGlobalPricing({
                            ...globalPricing,
                            bundleDiscounts: {
                              ...globalPricing.bundleDiscounts,
                              threeDay: parseFloat(e.target.value)
                            }
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>7-Day Bundle</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={globalPricing.bundleDiscounts.sevenDay}
                        onChange={(e) =>
                          setGlobalPricing({
                            ...globalPricing,
                            bundleDiscounts: {
                              ...globalPricing.bundleDiscounts,
                              sevenDay: parseFloat(e.target.value)
                            }
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>14-Day Bundle</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={globalPricing.bundleDiscounts.fourteenDay}
                        onChange={(e) =>
                          setGlobalPricing({
                            ...globalPricing,
                            bundleDiscounts: {
                              ...globalPricing.bundleDiscounts,
                              fourteenDay: parseFloat(e.target.value)
                            }
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Slot Configuration */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg">Daily Slot Limits</h3>
                  <p className="text-sm text-muted-foreground">Maximum concurrent promotions per day</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Carousel Slots</Label>
                    <Input
                      type="number"
                      value={globalPricing.slotsPerDay.carousel}
                      onChange={(e) =>
                        setGlobalPricing({
                          ...globalPricing,
                          slotsPerDay: {
                            ...globalPricing.slotsPerDay,
                            carousel: parseInt(e.target.value)
                          }
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Search Boost Slots</Label>
                    <Input
                      type="number"
                      value={globalPricing.slotsPerDay.searchBoost}
                      onChange={(e) =>
                        setGlobalPricing({
                          ...globalPricing,
                          slotsPerDay: {
                            ...globalPricing.slotsPerDay,
                            searchBoost: parseInt(e.target.value)
                          }
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Currency */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg">Currency</h3>
                  <p className="text-sm text-muted-foreground">Default currency for all promotions</p>
                </div>
                <Select
                  value={globalPricing.currency}
                  onValueChange={(value) =>
                    setGlobalPricing({ ...globalPricing, currency: value })
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">Reset to Defaults</Button>
                <Button disabled={!canManagePromotions}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Promotion Approvals</CardTitle>
              <CardDescription>Review and approve pending promotion requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by user or item..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Promotion Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="carousel">Carousel</SelectItem>
                    <SelectItem value="searchBoost">Search Boost</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterUserType} onValueChange={setFilterUserType}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="User Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All User Types</SelectItem>
                    <SelectItem value="teacher">Teachers</SelectItem>
                    <SelectItem value="homestay">Homestays</SelectItem>
                    <SelectItem value="institution">Institutions</SelectItem>
                    <SelectItem value="marketplace">Marketplace</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Promotions Table */}
              <div className="rounded-lg border">
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User & Item</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPromotions.map((promo) => (
                        <TableRow key={promo.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={promo.userAvatar} />
                                <AvatarFallback>{promo.userName[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium truncate">{promo.userName}</p>
                                  {getUserTypeIcon(promo.userType)}
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                  {promo.itemPreview.title}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {promo.promotionType === "both" ? "Carousel + Boost" : promo.promotionType}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">{promo.duration}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{format(promo.startDate, "MMM d")}</div>
                              <div className="text-muted-foreground">to {format(promo.endDate, "MMM d")}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              ${promo.totalCost.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(promo.status)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {format(promo.submittedAt, "MMM d, HH:mm")}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedPromotion(promo);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {promo.status === "pending" && canManagePromotions && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleReviewPromotion(promo, "approve")}
                                  >
                                    <Check className="w-4 h-4 text-green-500" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleReviewPromotion(promo, "reject")}
                                  >
                                    <X className="w-4 h-4 text-red-500" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>

              {filteredPromotions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <AlertCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1">No promotions found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Promotions Calendar</CardTitle>
              <CardDescription>
                View all scheduled and active promotions across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Month Selector */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMonth(addDays(selectedMonth, -30))}
                    >
                      Previous
                    </Button>
                    <div className="text-lg">
                      {format(selectedMonth, "MMMM yyyy")}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMonth(addDays(selectedMonth, 30))}
                    >
                      Next
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">Teacher</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <span className="text-muted-foreground">Homestay</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-purple-500" />
                      <span className="text-muted-foreground">Institution</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-orange-500" />
                      <span className="text-muted-foreground">Marketplace</span>
                    </div>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="overflow-hidden rounded-lg border">
                  <div className="grid grid-cols-7 border-b bg-muted/30">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="border-r p-3 text-center text-sm last:border-r-0">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7">
                    {daysInMonth.map((day, idx) => {
                      const promotions = getPromotionsForDay(day);
                      const isToday = isSameDay(day, new Date());

                      return (
                        <div
                          key={idx}
                          className={`min-h-28 border-r border-b p-2 last:border-r-0 ${
                            isToday ? "bg-primary/5" : ""
                          }`}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className={`text-sm ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                              {format(day, "d")}
                            </span>
                            {promotions.length > 0 && (
                              <Badge variant="secondary" className="h-5 text-xs">
                                {promotions.length}
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-1">
                            {promotions.slice(0, 3).map((promo) => (
                              <div
                                key={promo.id}
                                className={`truncate rounded p-1 text-xs text-white ${getPromotionTypeColor(promo.userType)}`}
                              >
                                {promo.userName}
                              </div>
                            ))}
                            {promotions.length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{promotions.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Revenue by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by User Type</CardTitle>
                <CardDescription>Total promotion revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-blue-500" />
                        <span>Teachers</span>
                      </div>
                      <span>${analytics.revenueByType.teacher.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all"
                        style={{
                          width: `${(analytics.revenueByType.teacher / analytics.totalRevenue) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <HomeIcon className="h-4 w-4 text-green-500" />
                        <span>Homestays</span>
                      </div>
                      <span>${analytics.revenueByType.homestay.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-green-500 transition-all"
                        style={{
                          width: `${(analytics.revenueByType.homestay / analytics.totalRevenue) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-purple-500" />
                        <span>Institutions</span>
                      </div>
                      <span>${analytics.revenueByType.institution.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-purple-500 transition-all"
                        style={{
                          width: `${(analytics.revenueByType.institution / analytics.totalRevenue) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-orange-500" />
                        <span>Marketplace</span>
                      </div>
                      <span>${analytics.revenueByType.marketplace.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-orange-500 transition-all"
                        style={{
                          width: `${(analytics.revenueByType.marketplace / analytics.totalRevenue) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Promoted */}
            <Card>
              <CardHeader>
                <CardTitle>Top Promoted Items</CardTitle>
                <CardDescription>Most active promotion users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topPromoted.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex-1">
                        <p>{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.type}</p>
                      </div>
                      <div className="text-right">
                        <p>${item.revenue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{item.promotions} promotions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Statistics</CardTitle>
              <CardDescription>Overall performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Promotions</p>
                  <p className="text-2xl">{analytics.totalPromotions}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Average Duration</p>
                  <p className="text-2xl">{analytics.avgDuration} days</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Slot Utilization</p>
                  <p className="text-2xl">{analytics.utilizationRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conflicts Tab */}
        <TabsContent value="conflicts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conflict Detection</CardTitle>
              <CardDescription>
                Overbooked slots and scheduling conflicts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {conflicts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-green-500/10 p-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="mb-1">No Conflicts Detected</h3>
                  <p className="text-sm text-muted-foreground">All promotion slots are within capacity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {conflicts.map((conflict, idx) => (
                    <Alert key={idx} variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-3">
                          <div>
                            <p>
                              {format(conflict.date, "MMMM d, yyyy")} - {conflict.promotionType === "carousel" ? "Carousel" : "Search Boost"}
                            </p>
                            <p className="text-sm">
                              Overbooked: {conflict.bookedSlots}/{conflict.maxSlots} slots used
                            </p>
                          </div>
                          <div>
                            <p className="mb-2 text-sm">Conflicting promotions:</p>
                            <div className="space-y-1.5">
                              {conflict.conflicts.map((c) => (
                                <div key={c.id} className="flex items-center gap-2 text-sm">
                                  {getUserTypeIcon(c.userType)}
                                  <span>{c.userName}</span>
                                  <Badge variant="outline" className="text-xs">{c.timeSlot}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Review Bookings
                            </Button>
                            <Button size="sm">
                              Resolve Conflict
                            </Button>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "approve" ? "Approve" : "Reject"} Promotion Request
            </DialogTitle>
            <DialogDescription>
              {selectedPromotion && (
                <>
                  {reviewAction === "approve"
                    ? "Approve this promotion request to make it active"
                    : "Reject this promotion request and provide a reason"}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedPromotion && (
            <div className="space-y-4">
              {/* Preview */}
              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <img
                    src={selectedPromotion.itemPreview.image}
                    alt={selectedPromotion.itemPreview.title}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3>{selectedPromotion.itemPreview.title}</h3>
                      {getStatusBadge(selectedPromotion.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedPromotion.itemPreview.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        {getUserTypeIcon(selectedPromotion.userType)}
                        <span className="capitalize text-muted-foreground">{selectedPromotion.userType}</span>
                      </div>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="text-muted-foreground">${selectedPromotion.totalCost}</span>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="text-muted-foreground">
                        {format(selectedPromotion.startDate, "MMM d")} - {format(selectedPromotion.endDate, "MMM d")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Notes */}
              <div className="space-y-2">
                <Label htmlFor="review-notes">
                  {reviewAction === "approve" ? "Approval Notes (Optional)" : "Rejection Reason *"}
                </Label>
                <Textarea
                  id="review-notes"
                  placeholder={
                    reviewAction === "approve"
                      ? "Add any notes for this approval..."
                      : "Please provide a reason for rejecting this promotion..."
                  }
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={submitReview}
              disabled={reviewAction === "reject" && !reviewNotes.trim()}
              variant={reviewAction === "approve" ? "default" : "destructive"}
            >
              {reviewAction === "approve" ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Approve Promotion
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Reject Promotion
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
