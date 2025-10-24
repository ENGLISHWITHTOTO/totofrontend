import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Globe,
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
  Target,
  Play,
  Pause,
  MoreHorizontal,
  Settings,
  Languages,
  GraduationCap,
  Building,
  Home as HomeIcon,
  Star,
  Crown,
  RefreshCw,
  Download,
  BarChart3,
  CheckCircle,
  AlertCircle,
  XCircle,
  Smartphone,
  Monitor,
  Save,
  ArrowRight,
  CreditCard,
  Zap
} from "lucide-react";
import { UserRole, hasPermission } from "../utils/permissions";
import { format, addDays, startOfWeek, endOfWeek } from "date-fns";

interface PromotionPrice {
  accountType: "teacher" | "homestay" | "institution";
  pricing: {
    hourly: number;
    daily: number;
    weekly: number;
  };
  currency: string;
  lastUpdated: Date;
}

interface ActivePromotion {
  id: string;
  accountId: string;
  accountName: string;
  accountType: "teacher" | "homestay" | "institution";
  accountImage: string;
  duration: "hourly" | "daily" | "weekly";
  startDate: Date;
  endDate: Date;
  totalCost: number;
  currency: string;
  targeting: {
    languages?: string[];
    countries?: string[];
    cities?: string[];
  };
  status: "active" | "scheduled" | "paused" | "expired";
  analytics: {
    impressions: number;
    clicks: number;
    ctr: number;
    conversions: number;
  };
  paymentStatus: "paid" | "pending" | "failed";
  createdAt: Date;
}

interface PromotionSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  accountType: "teacher" | "homestay" | "institution";
  isAvailable: boolean;
  reservedBy?: string;
  maxConcurrentPromotions: number;
  currentPromotions: number;
}

interface PromotionsManagerProps {
  userRole: UserRole;
}

export function PromotionsManager({ userRole }: PromotionsManagerProps) {
  const [promotionPrices, setPromotionPrices] = useState<PromotionPrice[]>([
    {
      accountType: "teacher",
      pricing: { hourly: 5.99, daily: 29.99, weekly: 149.99 },
      currency: "USD",
      lastUpdated: new Date("2024-01-15")
    },
    {
      accountType: "homestay",
      pricing: { hourly: 4.99, daily: 24.99, weekly: 124.99 },
      currency: "USD",
      lastUpdated: new Date("2024-01-15")
    },
    {
      accountType: "institution",
      pricing: { hourly: 9.99, daily: 49.99, weekly: 249.99 },
      currency: "USD",
      lastUpdated: new Date("2024-01-15")
    }
  ]);

  const [activePromotions, setActivePromotions] = useState<ActivePromotion[]>([
    {
      id: "promo1",
      accountId: "teacher1",
      accountName: "Sarah Johnson",
      accountType: "teacher",
      accountImage: "/api/placeholder/40/40",
      duration: "weekly",
      startDate: new Date("2024-01-20"),
      endDate: new Date("2024-01-27"),
      totalCost: 149.99,
      currency: "USD",
      targeting: { languages: ["Spanish", "English"] },
      status: "active",
      analytics: { impressions: 15420, clicks: 1850, ctr: 12.0, conversions: 45 },
      paymentStatus: "paid",
      createdAt: new Date("2024-01-18")
    },
    {
      id: "promo2",
      accountId: "homestay1",
      accountName: "Barcelona Home Stay",
      accountType: "homestay",
      accountImage: "/api/placeholder/40/40",
      duration: "daily",
      startDate: new Date("2024-01-22"),
      endDate: new Date("2024-01-25"),
      totalCost: 74.97,
      currency: "USD",
      targeting: { countries: ["Spain"], cities: ["Barcelona"] },
      status: "active",
      analytics: { impressions: 8750, clicks: 524, ctr: 6.0, conversions: 12 },
      paymentStatus: "paid",
      createdAt: new Date("2024-01-20")
    },
    {
      id: "promo3",
      accountId: "institution1",
      accountName: "Global Language Institute",
      accountType: "institution",
      accountImage: "/api/placeholder/40/40",
      duration: "weekly",
      startDate: new Date("2024-01-25"),
      endDate: new Date("2024-02-01"),
      totalCost: 249.99,
      currency: "USD",
      targeting: { languages: ["French", "German"] },
      status: "scheduled",
      analytics: { impressions: 0, clicks: 0, ctr: 0, conversions: 0 },
      paymentStatus: "paid",
      createdAt: new Date("2024-01-22")
    }
  ]);

  const [selectedPromotion, setSelectedPromotion] = useState<ActivePromotion | null>(null);
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const [showUserAppPreview, setShowUserAppPreview] = useState(false);
  const [editingPrice, setEditingPrice] = useState<PromotionPrice | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterAccountType, setFilterAccountType] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [previewAccountType, setPreviewAccountType] = useState<string>("teacher");

  const languages = [
    "English", "Spanish", "French", "German", "Italian", "Portuguese", 
    "Chinese", "Japanese", "Korean", "Arabic", "Russian", "Dutch"
  ];

  const countries = [
    "United States", "Spain", "France", "Germany", "Italy", "Portugal",
    "China", "Japan", "South Korea", "United Kingdom", "Canada", "Australia"
  ];

  const cities = {
    "Spain": ["Madrid", "Barcelona", "Valencia", "Seville"],
    "France": ["Paris", "Lyon", "Marseille", "Nice"],
    "Germany": ["Berlin", "Munich", "Hamburg", "Frankfurt"],
    "Italy": ["Rome", "Milan", "Naples", "Florence"]
  };

  const handleUpdatePrice = () => {
    if (!editingPrice) return;
    
    setPromotionPrices(prev => 
      prev.map(price => 
        price.accountType === editingPrice.accountType 
          ? { ...editingPrice, lastUpdated: new Date() }
          : price
      )
    );
    setShowPricingDialog(false);
    setEditingPrice(null);
  };

  const handleTogglePromotionStatus = (promotionId: string) => {
    setActivePromotions(prev => 
      prev.map(promo => {
        if (promo.id === promotionId) {
          const newStatus = promo.status === "active" ? "paused" : "active";
          return { ...promo, status: newStatus };
        }
        return promo;
      })
    );
  };

  const filteredPromotions = activePromotions.filter(promo => {
    const matchesSearch = promo.accountName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || promo.status === filterStatus;
    const matchesType = filterAccountType === "all" || promo.accountType === filterAccountType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      case "expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4" />;
      case "scheduled": return <Clock className="w-4 h-4" />;
      case "paused": return <Pause className="w-4 h-4" />;
      case "expired": return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case "teacher": return <GraduationCap className="w-4 h-4" />;
      case "homestay": return <HomeIcon className="w-4 h-4" />;
      case "institution": return <Building className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getTotalRevenue = () => {
    return activePromotions
      .filter(p => p.paymentStatus === "paid")
      .reduce((sum, p) => sum + p.totalCost, 0);
  };

  const getActivePromotionsCount = () => {
    return activePromotions.filter(p => p.status === "active").length;
  };

  const getTotalImpressions = () => {
    return activePromotions.reduce((sum, p) => sum + p.analytics.impressions, 0);
  };

  const getAverageCTR = () => {
    const totalCTR = activePromotions.reduce((sum, p) => sum + p.analytics.ctr, 0);
    return activePromotions.length > 0 ? (totalCTR / activePromotions.length).toFixed(1) : "0";
  };

  const canCreate = hasPermission(userRole, "promotions", "C");
  const canUpdate = hasPermission(userRole, "promotions", "U");
  const canDelete = hasPermission(userRole, "promotions", "D");
  const canConfigure = hasPermission(userRole, "promotions", "G");
  const canExport = hasPermission(userRole, "promotions", "X");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Promotions Manager</h1>
          <p className="text-muted-foreground">
            Manage targeted self-service advertising for Teachers, Homestays, and Institutions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowUserAppPreview(true)}>
            <Smartphone className="w-4 h-4 mr-2" />
            Preview User App
          </Button>
          {canConfigure && (
            <Button variant="outline" onClick={() => setShowPricingDialog(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Manage Pricing
            </Button>
          )}
          {canExport && (
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Promotions</p>
                <p className="text-xl font-semibold">{getActivePromotionsCount()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-semibold">${getTotalRevenue().toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Impressions</p>
                <p className="text-xl font-semibold">{getTotalImpressions().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg CTR</p>
                <p className="text-xl font-semibold">{getAverageCTR()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <RefreshCw className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversions</p>
                <p className="text-xl font-semibold">
                  {activePromotions.reduce((sum, p) => sum + p.analytics.conversions, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Promotions</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Reports</TabsTrigger>
          <TabsTrigger value="targeting">Targeting Rules</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search promotions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterAccountType} onValueChange={setFilterAccountType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Account Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="teacher">Teachers</SelectItem>
                    <SelectItem value="homestay">Homestays</SelectItem>
                    <SelectItem value="institution">Institutions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Promotions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Active Promotions ({filteredPromotions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Targeting</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPromotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={promotion.accountImage} />
                            <AvatarFallback>{promotion.accountName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{promotion.accountName}</h4>
                            <p className="text-sm text-muted-foreground">{promotion.accountId}</p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getAccountTypeIcon(promotion.accountType)}
                          <Badge variant="outline" className="capitalize">
                            {promotion.accountType}
                          </Badge>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {promotion.duration}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          {promotion.targeting.languages && (
                            <div className="flex items-center space-x-1">
                              <Languages className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs">
                                {promotion.targeting.languages.slice(0, 2).join(", ")}
                                {promotion.targeting.languages.length > 2 && " +more"}
                              </span>
                            </div>
                          )}
                          {promotion.targeting.cities && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs">
                                {promotion.targeting.cities.slice(0, 2).join(", ")}
                                {promotion.targeting.cities.length > 2 && " +more"}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          <p>{format(promotion.startDate, "MMM dd")}</p>
                          <p className="text-muted-foreground">{format(promotion.endDate, "MMM dd")}</p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">${promotion.totalCost}</p>
                          <Badge className={promotion.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                            {promotion.paymentStatus}
                          </Badge>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(promotion.status)}
                          <Badge className={getStatusColor(promotion.status)}>
                            {promotion.status}
                          </Badge>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <p>{promotion.analytics.impressions.toLocaleString()} views</p>
                          <p className="text-muted-foreground">{promotion.analytics.ctr}% CTR</p>
                          <p className="text-muted-foreground">{promotion.analytics.conversions} conversions</p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPromotion(promotion)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {canUpdate && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleTogglePromotionStatus(promotion.id)}
                            >
                              {promotion.status === "active" ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
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
                                >
                                  <BarChart3 className="w-4 h-4 mr-2" />
                                  View Analytics
                                </Button>
                                
                                {canUpdate && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start"
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Promotion
                                  </Button>
                                )}
                                
                                {canDelete && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Cancel
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
        </TabsContent>
        
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Promotion Pricing</CardTitle>
              <p className="text-sm text-muted-foreground">
                Set fixed promotion prices for each account type
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {promotionPrices.map((price) => (
                  <Card key={price.accountType} className="border-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getAccountTypeIcon(price.accountType)}
                          <h3 className="font-semibold capitalize">{price.accountType}s</h3>
                        </div>
                        {canConfigure && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingPrice(price);
                              setShowPricingDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Hourly Rate</span>
                          <span className="font-medium">${price.pricing.hourly}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Daily Rate</span>
                          <span className="font-medium">${price.pricing.daily}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Weekly Rate</span>
                          <span className="font-medium">${price.pricing.weekly}</span>
                        </div>
                      </div>
                      <Separator />
                      <p className="text-xs text-muted-foreground">
                        Last updated: {format(price.lastUpdated, "MMM dd, yyyy")}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {promotionPrices.map((price) => {
                    const typeRevenue = activePromotions
                      .filter(p => p.accountType === price.accountType && p.paymentStatus === "paid")
                      .reduce((sum, p) => sum + p.totalCost, 0);
                    
                    return (
                      <div key={price.accountType} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getAccountTypeIcon(price.accountType)}
                          <span className="capitalize">{price.accountType}s</span>
                        </div>
                        <span className="font-medium">${typeRevenue.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Campaigns</span>
                    <span className="font-medium">{activePromotions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Campaigns</span>
                    <span className="font-medium">{getActivePromotionsCount()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Impressions</span>
                    <span className="font-medium">{getTotalImpressions().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Clicks</span>
                    <span className="font-medium">
                      {activePromotions.reduce((sum, p) => sum + p.analytics.clicks, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average CTR</span>
                    <span className="font-medium">{getAverageCTR()}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="targeting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Targeting Rules Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure how promotions are targeted to users
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-5 h-5" />
                      <h4 className="font-medium">Teachers</h4>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Promoted based on languages they teach
                    </p>
                    <div className="space-y-2">
                      <Label>Available Languages</Label>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        {languages.slice(0, 8).map(lang => (
                          <span key={lang} className="p-1 bg-muted rounded text-center">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <HomeIcon className="w-5 h-5" />
                      <h4 className="font-medium">Homestays</h4>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Promoted based on location (country & city)
                    </p>
                    <div className="space-y-2">
                      <Label>Available Locations</Label>
                      <div className="grid grid-cols-1 gap-1 text-xs">
                        {Object.entries(cities).slice(0, 4).map(([country, cityList]) => (
                          <span key={country} className="p-1 bg-muted rounded text-center">
                            {country}: {cityList.slice(0, 2).join(", ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Building className="w-5 h-5" />
                      <h4 className="font-medium">Institutions</h4>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Promoted based on program languages
                    </p>
                    <div className="space-y-2">
                      <Label>Program Languages</Label>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        {languages.slice(0, 8).map(lang => (
                          <span key={lang} className="p-1 bg-muted rounded text-center">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Display Rules</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Search Results</h5>
                    <p className="text-sm text-muted-foreground">
                      Promoted accounts appear at the top of search results with "Sponsored" label
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Carousel Display</h5>
                    <p className="text-sm text-muted-foreground">
                      Sponsored carousel shows at the top of listing pages, filtered by user preferences
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pricing Edit Dialog */}
      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit {editingPrice ? editingPrice.accountType : ""} Pricing
            </DialogTitle>
            <DialogDescription>
              Update the fixed promotion prices for this account type
            </DialogDescription>
          </DialogHeader>
          
          {editingPrice && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Hourly Rate ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editingPrice.pricing.hourly}
                  onChange={(e) => 
                    setEditingPrice(prev => prev ? {
                      ...prev,
                      pricing: { ...prev.pricing, hourly: parseFloat(e.target.value) || 0 }
                    } : null)
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label>Daily Rate ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editingPrice.pricing.daily}
                  onChange={(e) => 
                    setEditingPrice(prev => prev ? {
                      ...prev,
                      pricing: { ...prev.pricing, daily: parseFloat(e.target.value) || 0 }
                    } : null)
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label>Weekly Rate ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editingPrice.pricing.weekly}
                  onChange={(e) => 
                    setEditingPrice(prev => prev ? {
                      ...prev,
                      pricing: { ...prev.pricing, weekly: parseFloat(e.target.value) || 0 }
                    } : null)
                  }
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowPricingDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdatePrice}>
                  <Save className="w-4 h-4 mr-2" />
                  Update Pricing
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* User App Preview */}
      <Sheet open={showUserAppPreview} onOpenChange={setShowUserAppPreview}>
        <SheetContent side="right" className="w-96">
          <SheetHeader>
            <SheetTitle>User App Preview</SheetTitle>
            <SheetDescription>
              See how users view and purchase promotions
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            <Select value={previewAccountType} onValueChange={setPreviewAccountType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teacher">Teacher View</SelectItem>
                <SelectItem value="homestay">Homestay View</SelectItem>
                <SelectItem value="institution">Institution View</SelectItem>
              </SelectContent>
            </Select>
            
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
                  <h3 className="font-semibold">Promote Your Account</h3>
                </div>
                
                <ScrollArea className="h-[520px]">
                  <div className="p-4 space-y-6">
                    {/* Pricing Display */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Promotion Pricing</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Boost your visibility with targeted promotions
                        </p>
                      </CardHeader>
                      <CardContent>
                        {promotionPrices
                          .filter(p => p.accountType === previewAccountType)
                          .map(price => (
                            <div key={price.accountType} className="space-y-3">
                              <div className="space-y-2">
                                <div className="flex justify-between p-3 border rounded-lg">
                                  <div>
                                    <p className="font-medium">1 Hour</p>
                                    <p className="text-xs text-muted-foreground">Quick boost</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">${price.pricing.hourly}</p>
                                    <Button size="sm" className="text-xs h-6">
                                      Select
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between p-3 border rounded-lg border-primary">
                                  <div>
                                    <p className="font-medium">1 Day</p>
                                    <p className="text-xs text-muted-foreground">Popular choice</p>
                                    <Badge className="text-xs mt-1">Most Popular</Badge>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">${price.pricing.daily}</p>
                                    <Button size="sm" className="text-xs h-6">
                                      Select
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between p-3 border rounded-lg">
                                  <div>
                                    <p className="font-medium">1 Week</p>
                                    <p className="text-xs text-muted-foreground">Best value</p>
                                    <Badge variant="secondary" className="text-xs mt-1">Save 20%</Badge>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">${price.pricing.weekly}</p>
                                    <Button size="sm" className="text-xs h-6">
                                      Select
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </CardContent>
                    </Card>
                    
                    {/* Targeting Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Your Promotion Will Target</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {previewAccountType === "teacher" && (
                            <div className="flex items-center space-x-2">
                              <Languages className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">Students learning your languages</span>
                            </div>
                          )}
                          {previewAccountType === "homestay" && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">Students looking in your location</span>
                            </div>
                          )}
                          {previewAccountType === "institution" && (
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">Students interested in your programs</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Benefits */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Promotion Benefits</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">Appear first in search results</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">Featured in sponsored carousel</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">Increased visibility & bookings</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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