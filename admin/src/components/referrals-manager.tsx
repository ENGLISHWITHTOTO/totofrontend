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
import { Textarea } from "./ui/textarea";
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
  UserPlus,
  Copy,
  QrCode,
  Link as LinkIcon,
  Play,
  Pause,
  MoreHorizontal,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  BarChart3,
  Shield,
  Smartphone,
  Monitor,
  Save,
  ArrowRight,
  CreditCard,
  Zap,
  Flag,
  Ban,
  Check,
  X,
  Coins,
  Activity,
  TrendingDown,
  Mail,
  Phone,
  Wifi,
  WifiOff,
  UserX,
  FileText,
  Calendar as CalendarDays,
  Star
} from "lucide-react";
import { UserRole, hasPermission } from "../utils/permissions";
import { format, addDays, subDays } from "date-fns";

interface ReferralSettings {
  isActive: boolean;
  referrerCredit: number;
  referredUserCredit: number;
  triggerEvent: "install_signup" | "first_booking" | "first_purchase" | "first_lesson";
  maxCreditsPerReferrerDaily: number;
  maxCreditsPerReferrerMonthly: number;
  maxReferralsPerDevice: number;
  maxReferralsPerIP: number;
  cooldownMinutes: number;
  referralLinkExpiryDays: number;
  creditExpiryDays: number;
  iosAppStoreLink: string;
  androidPlayLink: string;
  webFallbackUrl: string;
  autoGenerateQR: boolean;
  fraudControls: {
    blockSelfReferrals: boolean;
    blockVpnTor: boolean;
    requireVerification: boolean;
  };
}

interface ReferralCode {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerRole: "student" | "teacher" | "institution" | "homestay";
  ownerImage: string;
  referralCode: string;
  referralLink: string;
  totalInstalls: number;
  qualifiedSignups: number;
  creditsIssued: number;
  status: "active" | "blocked";
  lastActivity: Date;
  createdAt: Date;
}

interface CreditTransaction {
  id: string;
  date: Date;
  referrerId: string;
  referrerName: string;
  referredUserId: string;
  referredUserName: string;
  event: "install_signup" | "first_booking" | "first_purchase" | "first_lesson";
  creditsChange: number;
  balance: number;
  notes: string;
  adminActor?: string;
  country: string;
  platform: "ios" | "android" | "web";
}

interface SuspiciousActivity {
  id: string;
  type: "duplicate_device" | "same_ip_burst" | "self_referral" | "high_velocity";
  referrerId: string;
  referrerName: string;
  referredUserId: string;
  referredUserName: string;
  details: string;
  flaggedAt: Date;
  status: "pending" | "legitimate" | "reversed" | "blocked";
  creditsInvolved: number;
  adminActor?: string;
}

interface ReferralsManagerProps {
  userRole: UserRole;
}

export function ReferralsManager({ userRole }: ReferralsManagerProps) {
  const [settings, setSettings] = useState<ReferralSettings>({
    isActive: true,
    referrerCredit: 50,
    referredUserCredit: 25,
    triggerEvent: "first_booking",
    maxCreditsPerReferrerDaily: 500,
    maxCreditsPerReferrerMonthly: 2000,
    maxReferralsPerDevice: 5,
    maxReferralsPerIP: 10,
    cooldownMinutes: 60,
    referralLinkExpiryDays: 30,
    creditExpiryDays: 365,
    iosAppStoreLink: "https://apps.apple.com/app/learning-platform/id123456789",
    androidPlayLink: "https://play.google.com/store/apps/details?id=com.learningplatform.app",
    webFallbackUrl: "https://learningplatform.com/signup",
    autoGenerateQR: true,
    fraudControls: {
      blockSelfReferrals: true,
      blockVpnTor: true,
      requireVerification: true
    }
  });

  const [referralCodes] = useState<ReferralCode[]>([
    {
      id: "ref1",
      ownerId: "user1",
      ownerName: "Sarah Johnson",
      ownerRole: "teacher",
      ownerImage: "/api/placeholder/40/40",
      referralCode: "SARAH2024",
      referralLink: "https://learningplatform.com/signup?ref=SARAH2024",
      totalInstalls: 45,
      qualifiedSignups: 32,
      creditsIssued: 1600,
      status: "active",
      lastActivity: new Date("2024-01-22"),
      createdAt: new Date("2023-11-15")
    },
    {
      id: "ref2",
      ownerId: "user2",
      ownerName: "Barcelona Language School",
      ownerRole: "institution",
      ownerImage: "/api/placeholder/40/40",
      referralCode: "BARCELONA24",
      referralLink: "https://learningplatform.com/signup?ref=BARCELONA24",
      totalInstalls: 128,
      qualifiedSignups: 85,
      creditsIssued: 4250,
      status: "active",
      lastActivity: new Date("2024-01-23"),
      createdAt: new Date("2023-10-20")
    },
    {
      id: "ref3",
      ownerId: "user3",
      ownerName: "Maria's Homestay",
      ownerRole: "homestay",
      ownerImage: "/api/placeholder/40/40",
      referralCode: "MARIAHOME",
      referralLink: "https://learningplatform.com/signup?ref=MARIAHOME",
      totalInstalls: 23,
      qualifiedSignups: 18,
      creditsIssued: 900,
      status: "blocked",
      lastActivity: new Date("2024-01-10"),
      createdAt: new Date("2023-12-01")
    }
  ]);

  const [creditTransactions] = useState<CreditTransaction[]>([
    {
      id: "tx1",
      date: new Date("2024-01-23"),
      referrerId: "user1",
      referrerName: "Sarah Johnson",
      referredUserId: "newuser1",
      referredUserName: "John Smith",
      event: "first_booking",
      creditsChange: 50,
      balance: 1650,
      notes: "Automatic credit for first booking",
      country: "United States",
      platform: "ios"
    },
    {
      id: "tx2",
      date: new Date("2024-01-22"),
      referrerId: "user2",
      referrerName: "Barcelona Language School",
      referredUserId: "newuser2",
      referredUserName: "Emma Wilson",
      event: "first_booking",
      creditsChange: 50,
      balance: 4300,
      notes: "Automatic credit for first booking",
      country: "United Kingdom",
      platform: "android"
    },
    {
      id: "tx3",
      date: new Date("2024-01-21"),
      referrerId: "user1",
      referrerName: "Sarah Johnson",
      referredUserId: "admin1",
      referredUserName: "System Adjustment",
      event: "first_booking",
      creditsChange: -100,
      balance: 1600,
      notes: "Manual adjustment - suspicious activity",
      adminActor: "admin@learningplatform.com",
      country: "United States",
      platform: "web"
    }
  ]);

  const [suspiciousActivities] = useState<SuspiciousActivity[]>([
    {
      id: "sus1",
      type: "same_ip_burst",
      referrerId: "user4",
      referrerName: "Quick Tutoring",
      referredUserId: "multiple",
      referredUserName: "Multiple Users",
      details: "15 referrals from same IP address within 2 hours",
      flaggedAt: new Date("2024-01-22"),
      status: "pending",
      creditsInvolved: 750
    },
    {
      id: "sus2",
      type: "self_referral",
      referrerId: "user5",
      referrerName: "Mike Chen",
      referredUserId: "user5_alt",
      referredUserName: "Michael Chen",
      details: "Similar email pattern and device fingerprint",
      flaggedAt: new Date("2024-01-21"),
      status: "reversed",
      creditsInvolved: 50,
      adminActor: "admin@learningplatform.com"
    },
    {
      id: "sus3",
      type: "high_velocity",
      referrerId: "user6",
      referrerName: "Language Hub",
      referredUserId: "multiple",
      referredUserName: "Multiple Users",
      details: "50+ referrals in 24 hours, unusual pattern",
      flaggedAt: new Date("2024-01-20"),
      status: "legitimate",
      creditsInvolved: 2500,
      adminActor: "admin@learningplatform.com"
    }
  ]);

  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showManualCreditDialog, setShowManualCreditDialog] = useState(false);
  const [showUserAppPreview, setShowUserAppPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [manualCreditForm, setManualCreditForm] = useState({
    userId: "",
    amount: 0,
    reason: "",
    type: "add" as "add" | "remove"
  });

  const triggerEventOptions = [
    { value: "install_signup", label: "App Install + Sign-up" },
    { value: "first_booking", label: "First Booking" },
    { value: "first_purchase", label: "First Purchase" },
    { value: "first_lesson", label: "First Lesson Completion" }
  ];

  const handleSaveSettings = () => {
    // In a real app, this would make an API call to save settings
    setShowSettingsDialog(false);
  };

  const handleManualCreditAdjustment = () => {
    // In a real app, this would make an API call to adjust credits
    setShowManualCreditDialog(false);
    setManualCreditForm({ userId: "", amount: 0, reason: "", type: "add" });
  };

  const handleSuspiciousActivityAction = (activityId: string, action: "legitimate" | "reverse" | "block") => {
    // In a real app, this would make an API call to handle the suspicious activity
    console.log(`Action ${action} taken on activity ${activityId}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getTotalCreditsIssued = () => {
    return referralCodes.reduce((sum, code) => sum + code.creditsIssued, 0);
  };

  const getTotalInstalls = () => {
    return referralCodes.reduce((sum, code) => sum + code.totalInstalls, 0);
  };

  const getTotalQualifiedSignups = () => {
    return referralCodes.reduce((sum, code) => sum + code.qualifiedSignups, 0);
  };

  const getConversionRate = () => {
    const installs = getTotalInstalls();
    const signups = getTotalQualifiedSignups();
    return installs > 0 ? ((signups / installs) * 100).toFixed(1) : "0";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "blocked": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "legitimate": return "bg-green-100 text-green-800";
      case "reversed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "teacher": return "👨‍🏫";
      case "student": return "🎓";
      case "institution": return "🏫";
      case "homestay": return "🏠";
      default: return "👤";
    }
  };

  const canConfigure = hasPermission(userRole, "referrals", "G");
  const canUpdate = hasPermission(userRole, "referrals", "U");
  const canDelete = hasPermission(userRole, "referrals", "D");
  const canExport = hasPermission(userRole, "referrals", "X");
  const canModerate = hasPermission(userRole, "referrals", "M");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Referrals Manager</h1>
          <p className="text-muted-foreground">
            Manage the "Invite & Earn" referral program with credit rewards and fraud protection
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowUserAppPreview(true)}>
            <Smartphone className="w-4 h-4 mr-2" />
            Preview User App
          </Button>
          {canConfigure && (
            <Button variant="outline" onClick={() => setShowSettingsDialog(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Program Settings
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

      {/* Program Status */}
      <Card className={settings.isActive ? "border-green-200" : "border-red-200"}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${settings.isActive ? "bg-green-100" : "bg-red-100"}`}>
                {settings.isActive ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <h3 className="font-medium">
                  Referral Program is {settings.isActive ? "Active" : "Inactive"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {settings.isActive 
                    ? `Users earn ${settings.referrerCredit} credits per ${settings.triggerEvent.replace('_', ' ')}`
                    : "Referral program is currently disabled"
                  }
                </p>
              </div>
            </div>
            {canConfigure && (
              <Switch
                checked={settings.isActive}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, isActive: checked }))}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserPlus className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Installs</p>
                <p className="text-xl font-semibold">{getTotalInstalls().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Qualified Signups</p>
                <p className="text-xl font-semibold">{getTotalQualifiedSignups().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-xl font-semibold">{getConversionRate()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Coins className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Credits Issued</p>
                <p className="text-xl font-semibold">{getTotalCreditsIssued().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="text-xl font-semibold">
                  {suspiciousActivities.filter(a => a.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="codes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="codes">Codes & Links</TabsTrigger>
          <TabsTrigger value="ledger">Credit Ledger</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="abuse">Abuse Review</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="codes" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterRole} onValueChange={setFilterRole}>
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

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Referral Codes Table */}
          <Card>
            <CardHeader>
              <CardTitle>Referral Codes & Links ({referralCodes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Owner</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Installs</TableHead>
                    <TableHead>Signups</TableHead>
                    <TableHead>Credits Issued</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referralCodes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={code.ownerImage} />
                            <AvatarFallback>{getRoleIcon(code.ownerRole)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{code.ownerName}</h4>
                            <p className="text-sm text-muted-foreground capitalize">{code.ownerRole}</p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                            {code.referralCode}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(code.referralCode)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2 max-w-xs">
                          <span className="text-sm truncate">{code.referralLink}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(code.referralLink)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      
                      <TableCell>{code.totalInstalls}</TableCell>
                      <TableCell>{code.qualifiedSignups}</TableCell>
                      <TableCell>{code.creditsIssued}</TableCell>
                      
                      <TableCell>
                        <Badge className={getStatusColor(code.status)}>
                          {code.status}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm">
                          {format(code.lastActivity, "MMM dd, yyyy")}
                        </span>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(code.referralLink)}
                          >
                            <LinkIcon className="w-4 h-4" />
                          </Button>
                          
                          <Button variant="ghost" size="sm">
                            <QrCode className="w-4 h-4" />
                          </Button>
                          
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48" align="end">
                              <div className="space-y-1">
                                {canUpdate && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start"
                                    >
                                      {code.status === "active" ? (
                                        <>
                                          <Ban className="w-4 h-4 mr-2" />
                                          Block Code
                                        </>
                                      ) : (
                                        <>
                                          <Check className="w-4 h-4 mr-2" />
                                          Unblock Code
                                        </>
                                      )}
                                    </Button>
                                    
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start"
                                    >
                                      <RefreshCw className="w-4 h-4 mr-2" />
                                      Reset Code
                                    </Button>
                                    
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start"
                                      onClick={() => setShowManualCreditDialog(true)}
                                    >
                                      <Coins className="w-4 h-4 mr-2" />
                                      Adjust Credits
                                    </Button>
                                  </>
                                )}
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start"
                                >
                                  <BarChart3 className="w-4 h-4 mr-2" />
                                  View Analytics
                                </Button>
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
        
        <TabsContent value="ledger" className="space-y-4">
          {/* Ledger Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-10"
                  />
                </div>

                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="install_signup">Install + Signup</SelectItem>
                    <SelectItem value="first_booking">First Booking</SelectItem>
                    <SelectItem value="first_purchase">First Purchase</SelectItem>
                    <SelectItem value="first_lesson">First Lesson</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="ios">iOS</SelectItem>
                    <SelectItem value="android">Android</SelectItem>
                    <SelectItem value="web">Web</SelectItem>
                  </SelectContent>
                </Select>

                {canUpdate && (
                  <Button onClick={() => setShowManualCreditDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Manual Adjustment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Credit Ledger Table */}
          <Card>
            <CardHeader>
              <CardTitle>Credit Transaction Ledger</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Referrer</TableHead>
                    <TableHead>Referred User</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Admin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creditTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {format(transaction.date, "MMM dd, yyyy HH:mm")}
                      </TableCell>
                      
                      <TableCell>{transaction.referrerName}</TableCell>
                      <TableCell>{transaction.referredUserName}</TableCell>
                      
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {transaction.event.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <span className={transaction.creditsChange > 0 ? "text-green-600" : "text-red-600"}>
                          {transaction.creditsChange > 0 ? "+" : ""}{transaction.creditsChange}
                        </span>
                      </TableCell>
                      
                      <TableCell>{transaction.balance}</TableCell>
                      
                      <TableCell>
                        <Badge variant="secondary" className="uppercase">
                          {transaction.platform}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm">{transaction.notes}</span>
                      </TableCell>
                      
                      <TableCell>
                        {transaction.adminActor && (
                          <span className="text-sm text-muted-foreground">
                            {transaction.adminActor}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Referrers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {referralCodes
                    .sort((a, b) => b.creditsIssued - a.creditsIssued)
                    .slice(0, 5)
                    .map((code, index) => (
                      <div key={code.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                            {index + 1}
                          </div>
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={code.ownerImage} />
                            <AvatarFallback>{getRoleIcon(code.ownerRole)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{code.ownerName}</h4>
                            <p className="text-sm text-muted-foreground">{code.qualifiedSignups} signups</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{code.creditsIssued} credits</p>
                          <p className="text-sm text-muted-foreground">
                            {((code.qualifiedSignups / getTotalQualifiedSignups()) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Platform Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4" />
                      <span>iOS</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">45%</p>
                      <p className="text-sm text-muted-foreground">128 signups</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4" />
                      <span>Android</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">38%</p>
                      <p className="text-sm text-muted-foreground">108 signups</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Monitor className="w-4 h-4" />
                      <span>Web</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">17%</p>
                      <p className="text-sm text-muted-foreground">49 signups</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Referral Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium">Average Credits per Referrer</h4>
                  <p className="text-2xl font-semibold mt-2">
                    {referralCodes.length > 0 ? Math.round(getTotalCreditsIssued() / referralCodes.length) : 0}
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium">Best Conversion Rate</h4>
                  <p className="text-2xl font-semibold mt-2">89.5%</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium">Monthly Growth</h4>
                  <p className="text-2xl font-semibold mt-2">+24%</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium">Revenue Influenced</h4>
                  <p className="text-2xl font-semibold mt-2">$12,450</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="abuse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suspicious Activity Queue ({suspiciousActivities.filter(a => a.status === "pending").length} pending)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Review flagged referral activities and take appropriate action
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Referrer</TableHead>
                    <TableHead>Referred User</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Credits Involved</TableHead>
                    <TableHead>Flagged</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-40">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suspiciousActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {activity.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>{activity.referrerName}</TableCell>
                      <TableCell>{activity.referredUserName}</TableCell>
                      
                      <TableCell>
                        <span className="text-sm">{activity.details}</span>
                      </TableCell>
                      
                      <TableCell>{activity.creditsInvolved}</TableCell>
                      
                      <TableCell>
                        {format(activity.flaggedAt, "MMM dd, yyyy")}
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        {activity.status === "pending" && canModerate ? (
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuspiciousActivityAction(activity.id, "legitimate")}
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuspiciousActivityAction(activity.id, "reverse")}
                            >
                              <RefreshCw className="w-3 h-3" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuspiciousActivityAction(activity.id, "block")}
                            >
                              <Ban className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {activity.adminActor ? `By ${activity.adminActor}` : "Resolved"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Credit Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Referrer Credit Amount</Label>
                  <Input
                    type="number"
                    value={settings.referrerCredit}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      referrerCredit: parseInt(e.target.value) || 0 
                    }))}
                    disabled={!canConfigure}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Referred User Credit Amount</Label>
                  <Input
                    type="number"
                    value={settings.referredUserCredit}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      referredUserCredit: parseInt(e.target.value) || 0 
                    }))}
                    disabled={!canConfigure}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Trigger Event</Label>
                  <Select
                    value={settings.triggerEvent}
                    onValueChange={(value: any) => setSettings(prev => ({ 
                      ...prev, 
                      triggerEvent: value 
                    }))}
                    disabled={!canConfigure}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerEventOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Limits & Caps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Max Credits per Referrer (Daily)</Label>
                  <Input
                    type="number"
                    value={settings.maxCreditsPerReferrerDaily}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      maxCreditsPerReferrerDaily: parseInt(e.target.value) || 0 
                    }))}
                    disabled={!canConfigure}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Max Credits per Referrer (Monthly)</Label>
                  <Input
                    type="number"
                    value={settings.maxCreditsPerReferrerMonthly}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      maxCreditsPerReferrerMonthly: parseInt(e.target.value) || 0 
                    }))}
                    disabled={!canConfigure}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Max Referrals per Device</Label>
                  <Input
                    type="number"
                    value={settings.maxReferralsPerDevice}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      maxReferralsPerDevice: parseInt(e.target.value) || 0 
                    }))}
                    disabled={!canConfigure}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Cooldown Between Referrals (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.cooldownMinutes}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      cooldownMinutes: parseInt(e.target.value) || 0 
                    }))}
                    disabled={!canConfigure}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Fraud Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Block Self-Referrals</Label>
                    <p className="text-sm text-muted-foreground">
                      Prevent users from referring themselves
                    </p>
                  </div>
                  <Switch
                    checked={settings.fraudControls.blockSelfReferrals}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      fraudControls: { ...prev.fraudControls, blockSelfReferrals: checked }
                    }))}
                    disabled={!canConfigure}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Block VPN/Tor</Label>
                    <p className="text-sm text-muted-foreground">
                      Block known VPN and Tor IP ranges
                    </p>
                  </div>
                  <Switch
                    checked={settings.fraudControls.blockVpnTor}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      fraudControls: { ...prev.fraudControls, blockVpnTor: checked }
                    }))}
                    disabled={!canConfigure}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Require email/phone verification
                    </p>
                  </div>
                  <Switch
                    checked={settings.fraudControls.requireVerification}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      fraudControls: { ...prev.fraudControls, requireVerification: checked }
                    }))}
                    disabled={!canConfigure}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {canConfigure && (
            <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Manual Credit Adjustment Dialog */}
      <Dialog open={showManualCreditDialog} onOpenChange={setShowManualCreditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Credit Adjustment</DialogTitle>
            <DialogDescription>
              Add or remove credits from a user's account with a reason
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>User ID or Email</Label>
              <Input
                value={manualCreditForm.userId}
                onChange={(e) => setManualCreditForm(prev => ({ 
                  ...prev, 
                  userId: e.target.value 
                }))}
                placeholder="Enter user ID or email"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Adjustment Type</Label>
              <Select
                value={manualCreditForm.type}
                onValueChange={(value: "add" | "remove") => 
                  setManualCreditForm(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Credits</SelectItem>
                  <SelectItem value="remove">Remove Credits</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                value={manualCreditForm.amount}
                onChange={(e) => setManualCreditForm(prev => ({ 
                  ...prev, 
                  amount: parseInt(e.target.value) || 0 
                }))}
                placeholder="Enter credit amount"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                value={manualCreditForm.reason}
                onChange={(e) => setManualCreditForm(prev => ({ 
                  ...prev, 
                  reason: e.target.value 
                }))}
                placeholder="Enter reason for adjustment"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowManualCreditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleManualCreditAdjustment}>
                <Save className="w-4 h-4 mr-2" />
                Apply Adjustment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* User App Preview */}
      <Sheet open={showUserAppPreview} onOpenChange={setShowUserAppPreview}>
        <SheetContent side="right" className="w-96">
          <SheetHeader>
            <SheetTitle>User App Preview</SheetTitle>
            <SheetDescription>
              See how the "Invite & Earn" page appears to users
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
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
                  <h3 className="font-semibold">Invite & Earn</h3>
                </div>
                
                <ScrollArea className="h-[520px]">
                  <div className="p-4 space-y-6">
                    {/* Referral Code Display */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Your Referral Code</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center space-y-4">
                          <div className="p-4 bg-primary rounded-lg text-primary-foreground">
                            <p className="text-2xl font-mono font-bold">SARAH2024</p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button size="sm" className="flex-1">
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Code
                            </Button>
                            <Button size="sm" className="flex-1">
                              <QrCode className="w-4 h-4 mr-2" />
                              QR Code
                            </Button>
                          </div>
                          
                          <Button variant="outline" className="w-full">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Share Referral Link
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Earnings Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Your Earnings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Total Referrals</span>
                            <span className="font-semibold">32</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Credits Earned</span>
                            <span className="font-semibold">1,600</span>
                          </div>
                          <div className="flex justify-between">
                            <span>This Month</span>
                            <span className="font-semibold">+150</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* How It Works */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">How It Works</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-primary rounded-full text-primary-foreground text-sm flex items-center justify-center">
                              1
                            </div>
                            <div>
                              <p className="font-medium">Share your code</p>
                              <p className="text-sm text-muted-foreground">
                                Send your referral code to friends
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-primary rounded-full text-primary-foreground text-sm flex items-center justify-center">
                              2
                            </div>
                            <div>
                              <p className="font-medium">Friend signs up</p>
                              <p className="text-sm text-muted-foreground">
                                They download the app and create an account
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-primary rounded-full text-primary-foreground text-sm flex items-center justify-center">
                              3
                            </div>
                            <div>
                              <p className="font-medium">Earn credits</p>
                              <p className="text-sm text-muted-foreground">
                                Get {settings.referrerCredit} credits when they make their first booking
                              </p>
                            </div>
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