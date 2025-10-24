import React, { useState } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "./components/ui/sidebar";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./components/ui/sheet";
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  Store, 
  CreditCard, 
  Coins, 
  Bot, 
  Flag, 
  TrendingUp, 
  Settings,
  Bell,
  Search,
  Building,
  Home,
  Shield,
  BarChart3,
  FileText,
  UserCog,
  Download,
  Headphones,
  MessageSquare,
  MessageCircle,
  Megaphone,
  Target,
  UserPlus,
  BookOpen,
  MoreHorizontal,
  Crown
} from "lucide-react";
import { DashboardOverview } from "./components/dashboard-overview";
import { UserManagement } from "./components/user-management";
import { UserVerification } from "./components/user-verification";
import { ContentManagement } from "./components/content-management";
import { MarketplaceManagement } from "./components/marketplace-management";
import { InstitutionManagement } from "./components/institution-management";
import { HomestayManagement } from "./components/homestay-management";
import { SubscriptionManagement } from "./components/subscription-management";
import { CreditSystemManagement } from "./components/credit-system-management";
import { AIConfiguration } from "./components/ai-configuration";
import { AICharactersManager } from "./components/ai-characters-manager";
import { ReportsManagement } from "./components/reports-management";
import { AnalyticsDashboard } from "./components/analytics-dashboard";
import { SystemSettings } from "./components/system-settings";
import { RoleManagement } from "./components/role-management";
import { AuditLog } from "./components/audit-log";
import { DataExport } from "./components/data-export";
import { PermissionSummary } from "./components/permission-summary";
import { CustomerSupport } from "./components/customer-support";
import { ChatManagement } from "./components/chat-management";
import { OffersManager } from "./components/offers-manager";
import { PromotionsManager } from "./components/promotions-manager";
import { AdminPromotionsManager } from "./components/admin-promotions-manager";
import { ReferralsManager } from "./components/referrals-manager";
import { StaticContentManager } from "./components/static-content-manager";
import { Input } from "./components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import { UserRole, canAccessModule, hasPermission } from "./utils/permissions";
import { RoleSelector } from "./components/role-selector";
import { NotificationSystem } from "./components/notification-system";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    key: "dashboard",
    module: "analytics" as const,
    notifications: 0
  },
  {
    title: "Users & Verification",
    icon: Users,
    key: "users",
    module: "users" as const,
    notifications: 23
  },
  {
    title: "Content & Taxonomy",
    icon: FolderOpen,
    key: "content",
    module: "taxonomy" as const,
    notifications: 0
  },
  {
    title: "Marketplace",
    icon: Store,
    key: "marketplace",
    module: "marketplace" as const,
    notifications: 12
  },
  {
    title: "Institutions",
    icon: Building,
    key: "institutions",
    module: "institutions" as const,
    notifications: 5
  },
  {
    title: "Homestays",
    icon: Home,
    key: "homestays",
    module: "homestays" as const,
    notifications: 3
  },
  {
    title: "Payments & Payouts",
    icon: CreditCard,
    key: "payments",
    module: "billing" as const,
    notifications: 7
  },
  {
    title: "Credits",
    icon: Coins,
    key: "credits",
    module: "credits" as const,
    notifications: 0
  },
  {
    title: "AI Configuration",
    icon: Bot,
    key: "ai",
    module: "ai_config" as const,
    notifications: 0
  },
  {
    title: "AI Characters",
    icon: MessageSquare,
    key: "ai-characters",
    module: "ai_config" as const,
    notifications: 0
  },
  {
    title: "Safety & Moderation",
    icon: Shield,
    key: "moderation",
    module: "moderation" as const,
    notifications: 18
  },
  {
    title: "Customer Support",
    icon: Headphones,
    key: "support",
    module: "support_tickets" as const,
    notifications: 8
  },
  {
    title: "Chat",
    icon: MessageCircle,
    key: "chat",
    module: "chat" as const,
    notifications: 15
  },
  {
    title: "Offers Manager",
    icon: Megaphone,
    key: "offers",
    module: "offers" as const,
    notifications: 2
  },
  {
    title: "Promotions Manager",
    icon: Target,
    key: "promotions",
    module: "promotions" as const,
    notifications: 4
  },
  {
    title: "Admin Promotions",
    icon: Crown,
    key: "admin-promotions",
    module: "promotions" as const,
    notifications: 4
  },
  {
    title: "Referrals",
    icon: UserPlus,
    key: "referrals",
    module: "referrals" as const,
    notifications: 6
  },
  {
    title: "Content Manager",
    icon: BookOpen,
    key: "static-content",
    module: "static_content" as const,
    notifications: 0
  },
  {
    title: "Analytics",
    icon: BarChart3,
    key: "analytics",
    module: "analytics" as const,
    notifications: 0
  },
  {
    title: "Role Management",
    icon: UserCog,
    key: "roles",
    module: "users" as const,
    notifications: 2
  },
  {
    title: "My Permissions",
    icon: Shield,
    key: "permissions",
    module: "settings" as const,
    notifications: 0
  },
  {
    title: "Audit Log",
    icon: FileText,
    key: "audit",
    module: "audit" as const,
    notifications: 0
  },
  {
    title: "Data Export",
    icon: Download,
    key: "export",
    module: "analytics" as const,
    notifications: 0
  },
  {
    title: "Settings",
    icon: Settings,
    key: "settings",
    module: "settings" as const,
    notifications: 0
  }
];

export default function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userRole, setUserRole] = useState<UserRole>("SUPER_ADMIN"); // Could be: SUPER_ADMIN, MODERATOR, FINANCE, CONTENT_MANAGER, etc.
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview userRole={userRole} />;
      case "users":
        return <UserVerification userRole={userRole} />;
      case "content":
        return <ContentManagement userRole={userRole} />;
      case "marketplace":
        return <MarketplaceManagement userRole={userRole} />;
      case "institutions":
        return <InstitutionManagement userRole={userRole} />;
      case "homestays":
        return <HomestayManagement userRole={userRole} />;
      case "payments":
        return <SubscriptionManagement userRole={userRole} />;
      case "credits":
        return <CreditSystemManagement userRole={userRole} />;
      case "ai":
        return <AIConfiguration userRole={userRole} />;
      case "ai-characters":
        return <AICharactersManager userRole={userRole} />;
      case "moderation":
        return <ReportsManagement userRole={userRole} />;
      case "support":
        return <CustomerSupport userRole={userRole} />;
      case "chat":
        return <ChatManagement userRole={userRole} />;
      case "offers":
        return <OffersManager userRole={userRole} />;
      case "promotions":
        return <PromotionsManager userRole={userRole} />;
      case "admin-promotions":
        return <AdminPromotionsManager userRole={userRole} />;
      case "referrals":
        return <ReferralsManager userRole={userRole} />;
      case "static-content":
        return <StaticContentManager userRole={userRole} />;
      case "analytics":
        return <AnalyticsDashboard userRole={userRole} />;
      case "roles":
        return <RoleManagement userRole={userRole} />;
      case "permissions":
        return <PermissionSummary userRole={userRole} />;
      case "audit":
        return <AuditLog userRole={userRole} />;
      case "export":
        return <DataExport userRole={userRole} />;
      case "settings":
        return <SystemSettings userRole={userRole} />;
      default:
        return <DashboardOverview userRole={userRole} />;
    }
  };

  // Filter menu items based on user permissions
  const accessibleMenuItems = menuItems.filter(item => 
    canAccessModule(userRole, item.module)
  );

  // Bottom navigation items (most important 4 + More)
  const bottomNavItems = [
    {
      title: "Home",
      icon: LayoutDashboard,
      id: "dashboard"
    },
    {
      title: "Users",
      icon: Users,
      id: "users"
    },
    {
      title: "Content",
      icon: FolderOpen,
      id: "content"
    },
    {
      title: "Support",
      icon: Headphones,
      id: "support"
    },
    {
      title: "More",
      icon: MoreHorizontal,
      id: "more"
    }
  ];

  // Overflow menu items (items not in bottom nav)
  const overflowMenuItems = accessibleMenuItems.filter(item => 
    !["dashboard", "users", "content", "support"].includes(item.key)
  );

  const handleBottomNavClick = (id: string) => {
    if (id === "more") {
      setIsMoreMenuOpen(true);
    } else {
      setActiveSection(id);
    }
  };

  const handleOverflowItemClick = (key: string) => {
    setActiveSection(key);
    setIsMoreMenuOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Desktop Sidebar - Hidden on mobile */}
        <Sidebar variant="sidebar" className="border-r hidden lg:flex">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">LearningAdmin</h2>
                <p className="text-xs text-muted-foreground">Platform Dashboard</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {accessibleMenuItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.key)}
                        isActive={activeSection === item.key}
                        className="w-full justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </div>
                        {item.notifications > 0 && (
                          <Badge variant="destructive" className="ml-auto h-5 min-w-5 text-xs">
                            {item.notifications > 99 ? "99+" : item.notifications}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>

        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="border-b bg-background p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 lg:space-x-4">
                {/* Desktop sidebar trigger */}
                <div className="hidden lg:block">
                  <SidebarTrigger />
                </div>
                
                {/* Mobile logo */}
                <div className="lg:hidden flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <h2 className="font-semibold">LearningAdmin</h2>
                </div>
                
                {/* Desktop search */}
                <div className="relative hidden lg:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search users, content, or reports..." 
                    className="pl-10 w-80"
                  />
                </div>
                
                {/* Desktop role selector */}
                <div className="hidden lg:block">
                  <RoleSelector 
                    currentRole={userRole} 
                    onRoleChange={setUserRole}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <NotificationSystem userRole={userRole} />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium">Admin User</p>
                        <p className="text-xs text-muted-foreground">{userRole.replace('_', ' ')}</p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                    <DropdownMenuItem>Change Password</DropdownMenuItem>
                    <DropdownMenuItem>Audit Log</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-4 lg:p-6 pb-20 lg:pb-6">
              {renderContent()}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="grid grid-cols-5 h-16">
            {bottomNavItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleBottomNavClick(item.id)}
                  className={`flex flex-col items-center justify-center gap-1 transition-colors active:text-foreground ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                  <span className="text-xs">{item.title}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Mobile Overflow Menu (Bottom Sheet) */}
        <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>More Options</SheetTitle>
            </SheetHeader>
            <div className="mt-6 grid grid-cols-3 gap-4 overflow-y-auto max-h-[calc(80vh-100px)]">
              {overflowMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.key;
                
                return (
                  <button
                    key={item.key}
                    onClick={() => handleOverflowItemClick(item.key)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-muted/50 text-foreground hover:bg-muted'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-primary/20' : 'bg-background'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs text-center">{item.title}</span>
                    {item.notifications > 0 && (
                      <Badge variant="destructive" className="absolute top-2 right-2 h-5 min-w-5 text-xs">
                        {item.notifications > 99 ? "99+" : item.notifications}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </SidebarProvider>
  );
}