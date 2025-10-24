"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Store,
  CreditCard,
  Coins,
  Bot,
  MessageSquare,
  MessageCircle,
  Megaphone,
  Target,
  UserPlus,
  BookOpen,
  Shield,
  BarChart3,
  FileText,
  UserCog,
  Download,
  Building,
  Home,
  MoreHorizontal,
  Search,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationSystem } from "@/components/notification-system";

const adminLinks = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    notifications: 0,
  },
  {
    title: "Users & Verification",
    icon: Users,
    href: "/admin/users",
    notifications: 0,
  },
  {
    title: "Content & Taxonomy",
    icon: FolderOpen,
    href: "/admin/content",
    notifications: 0,
  },
  {
    title: "Marketplace",
    icon: Store,
    href: "/admin/marketplace",
    notifications: 0,
  },
  {
    title: "Institutions",
    icon: Building,
    href: "/admin/institutions",
    notifications: 0,
  },
  {
    title: "Homestays",
    icon: Home,
    href: "/admin/homestays",
    notifications: 0,
  },
  {
    title: "Payments & Payouts",
    icon: CreditCard,
    href: "/admin/payments",
    notifications: 0,
  },
  { title: "Credits", icon: Coins, href: "/admin/credits", notifications: 0 },
  { title: "AI Configuration", icon: Bot, href: "/admin/ai", notifications: 0 },
  {
    title: "AI Characters",
    icon: MessageSquare,
    href: "/admin/ai-characters",
    notifications: 0,
  },
  {
    title: "Safety & Moderation",
    icon: Shield,
    href: "/admin/moderation",
    notifications: 0,
  },
  {
    title: "Customer Support",
    icon: MessageCircle,
    href: "/admin/support",
    notifications: 0,
  },
  { title: "Chat", icon: MessageCircle, href: "/admin/chat", notifications: 0 },
  {
    title: "Offers Manager",
    icon: Megaphone,
    href: "/admin/offers",
    notifications: 0,
  },
  {
    title: "Promotions Manager",
    icon: Target,
    href: "/admin/promotions",
    notifications: 0,
  },
  {
    title: "Admin Promotions",
    icon: Target,
    href: "/admin/admin-promotions",
    notifications: 0,
  },
  {
    title: "Referrals",
    icon: UserPlus,
    href: "/admin/referrals",
    notifications: 0,
  },
  {
    title: "Content Manager",
    icon: BookOpen,
    href: "/admin/static-content",
    notifications: 0,
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
    notifications: 0,
  },
  {
    title: "Role Management",
    icon: UserCog,
    href: "/admin/roles",
    notifications: 0,
  },
  {
    title: "My Permissions",
    icon: Shield,
    href: "/admin/permissions",
    notifications: 0,
  },
  {
    title: "Audit Log",
    icon: FileText,
    href: "/admin/audit",
    notifications: 0,
  },
  {
    title: "Data Export",
    icon: Download,
    href: "/admin/export",
    notifications: 0,
  },
  {
    title: "Settings",
    icon: UserCog,
    href: "/admin/settings",
    notifications: 0,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Build simple breadcrumbs from the current pathname
  const breadcrumbs = useMemo(() => {
    if (!pathname) return [] as { href: string; label: string }[];
    const segments = pathname.split("/").filter(Boolean);
    const crumbs: { href: string; label: string }[] = [];
    let href = "";
    for (const segment of segments) {
      href += `/${segment}`;
      crumbs.push({
        href,
        label: segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      });
    }
    return crumbs;
  }, [pathname]);

  const bottomNavItems = [
    {
      title: "Home",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
      id: "dashboard",
    },
    { title: "Users", icon: Users, href: "/admin/users", id: "users" },
    {
      title: "Content",
      icon: FolderOpen,
      href: "/admin/content",
      id: "content",
    },
    {
      title: "Support",
      icon: MessageCircle,
      href: "/admin/support",
      id: "support",
    },
    { title: "More", icon: MoreHorizontal, href: "#more", id: "more" },
  ];

  const mainIds = new Set(["dashboard", "users", "content", "support"]);
  const overflowLinks = adminLinks.filter(
    (l) => !mainIds.has(l.title.toLowerCase().split(" ")[0])
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <Sidebar variant="sidebar" className="border-r hidden lg:flex">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">LearningAdmin</h2>
                <p className="text-xs text-muted-foreground">
                  Platform Dashboard
                </p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminLinks.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        className="w-full justify-between"
                        isActive={pathname.startsWith(item.href)}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center w-full"
                        >
                          <div className="flex items-center space-x-2">
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                          </div>
                          {item.notifications > 0 && (
                            <Badge
                              variant="destructive"
                              className="ml-auto h-5 min-w-5 text-xs"
                            >
                              {item.notifications > 99
                                ? "99+"
                                : item.notifications}
                            </Badge>
                          )}
                        </Link>
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
          <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
            <div className="px-4 lg:px-6 py-3 flex items-center gap-3">
              <SidebarTrigger className="md:hidden" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg hidden md:flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="hidden md:block">
                  <h2 className="font-semibold leading-none">LearningAdmin</h2>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <nav className="hidden md:flex items-center text-sm text-muted-foreground gap-1 truncate">
                  {breadcrumbs.map((c, i) => (
                    <React.Fragment key={c.href}>
                      {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
                      <Link
                        href={c.href}
                        className={`hover:text-foreground transition-colors ${
                          i === breadcrumbs.length - 1 ? "text-foreground" : ""
                        } truncate max-w-[16ch]`}
                        title={c.label}
                      >
                        {c.label}
                      </Link>
                    </React.Fragment>
                  ))}
                </nav>
              </div>
              <div className="hidden lg:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users, content, or reports..."
                  className="pl-10 w-80"
                />
              </div>
              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="hidden sm:inline-flex"
                >
                  Quick Action
                </Button>
                <NotificationSystem userRole="SUPER_ADMIN" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 h-auto p-2"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium leading-none">
                          Admin User
                        </p>
                        <p className="text-xs text-muted-foreground">
                          SUPER_ADMIN
                        </p>
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
          <main className="flex-1 overflow-auto">
            <div className="p-4 lg:p-6 pb-20 lg:pb-6">{children}</div>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="grid grid-cols-5 h-16">
            {bottomNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "more") setIsMoreMenuOpen(true);
                    else window.location.href = item.href;
                  }}
                  className={`flex flex-col items-center justify-center gap-1 transition-colors active:text-foreground ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "stroke-[2.5]" : "stroke-[2]"
                    }`}
                  />
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
              {overflowLinks.map((item) => {
                const Icon = item.icon as any;
                const active = pathname.startsWith(item.href);
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      window.location.href = item.href;
                    }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        active ? "bg-primary/20" : "bg-background"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs text-center">{item.title}</span>
                    {item.notifications > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute top-2 right-2 h-5 min-w-5 text-xs"
                      >
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
