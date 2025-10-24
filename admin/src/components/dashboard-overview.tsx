import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Building,
  Home,
  Store,
  CreditCard,
  UserCheck,
  Clock,
  Bell
} from "lucide-react";
import { UserRole, hasPermission, canAccessFinancialData } from "../utils/permissions";

interface DashboardOverviewProps {
  userRole: UserRole;
}

export function DashboardOverview({ userRole }: DashboardOverviewProps) {
  // Permission checks for different sections
  const canViewAnalytics = hasPermission(userRole, "analytics", "R");
  const canViewFinancials = canAccessFinancialData(userRole);
  const canViewUsers = hasPermission(userRole, "users", "R");
  const canViewModeration = hasPermission(userRole, "moderation", "R");

  const kpiCards = [
    {
      title: "Daily Active Users",
      value: "3,247",
      change: "+8.2%",
      period: "vs yesterday",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Monthly Active Users", 
      value: "15,847",
      change: "+12.5%",
      period: "vs last month",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "New Signups",
      value: "89",
      change: "+15.3%",
      period: "today",
      icon: UserCheck,
      color: "text-green-600"
    },
    {
      title: "Active Teachers",
      value: "2,341",
      change: "+5.7%",
      period: "this month",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Active Institutions",
      value: "156",
      change: "+8.9%",
      period: "verified",
      icon: Building,
      color: "text-indigo-600"
    },
    {
      title: "Active Homestays",
      value: "567",
      change: "+12.3%",
      period: "verified",
      icon: Home,
      color: "text-orange-600"
    },
    {
      title: "Marketplace GMV",
      value: "$47,582",
      change: "+23.1%",
      period: "this month",
      icon: Store,
      color: "text-green-600"
    },
    {
      title: "Subscription Revenue",
      value: "$89,247",
      change: "+18.5%",
      period: "this month",
      icon: CreditCard,
      color: "text-blue-600"
    },
    {
      title: "Refunds Processed",
      value: "$2,847",
      change: "-5.2%",
      period: "this month",
      icon: DollarSign,
      color: "text-red-600"
    },
    {
      title: "Credit Purchases",
      value: "$12,456",
      change: "+28.7%",
      period: "this month",
      icon: DollarSign,
      color: "text-yellow-600"
    }
  ];

  const alertsAndQueues = [
    {
      title: "Teacher Verifications",
      count: 23,
      priority: "high",
      description: "Teachers awaiting credential verification",
      action: "Review Applications",
      icon: Users,
      link: "/users?tab=applications&filter=teacher"
    },
    {
      title: "Institution Verifications", 
      count: 5,
      priority: "medium",
      description: "New institutions pending approval",
      action: "Review Institutions",
      icon: Building,
      link: "/institutions?tab=applications"
    },
    {
      title: "Homestay Verifications",
      count: 3,
      priority: "medium", 
      description: "Homestay hosts awaiting verification",
      action: "Review Homestays",
      icon: Home,
      link: "/homestays?tab=applications"
    },
    {
      title: "Marketplace Submissions",
      count: 12,
      priority: "high",
      description: "Courses pending review and approval",
      action: "Review Courses",
      icon: Store,
      link: "/marketplace?status=pending"
    },
    {
      title: "Abuse Reports",
      count: 18,
      priority: "critical",
      description: "User reports requiring immediate attention",
      action: "Handle Reports",
      icon: AlertTriangle,
      link: "/moderation?tab=reports"
    },
    {
      title: "Payout Requests",
      count: 7,
      priority: "medium",
      description: "Teacher and host payment requests",
      action: "Process Payouts",
      icon: CreditCard,
      link: "/payments?tab=payouts"
    }
  ];

  const quickActions = [
    {
      title: "Approve 23 Teachers",
      description: "Bulk approve verified teacher applications",
      action: "Approve All",
      variant: "default" as const,
      icon: UserCheck
    },
    {
      title: "Review 12 Marketplace Items",
      description: "Review pending course submissions",
      action: "Start Review",
      variant: "outline" as const,
      icon: Store
    },
    {
      title: "Run Weekly Payouts",
      description: "Process scheduled payments to teachers/hosts",
      action: "Run Payouts",
      variant: "default" as const,
      icon: CreditCard
    },
    {
      title: "Update AI Templates",
      description: "Review and update AI prompt templates",
      action: "Edit Templates",
      variant: "outline" as const,
      icon: BookOpen
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Platform Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening on your learning platform today.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={kpi.change.startsWith('+') ? "text-green-600" : "text-red-600"}>
                  {kpi.change}
                </span> {kpi.period}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts and Queues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-orange-600" />
              <span>Alerts & Queues</span>
            </CardTitle>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertsAndQueues.filter(item => userRole === "Admin" || 
              (userRole === "Moderator" && item.title.includes("Reports")) ||
              (userRole === "Finance" && item.title.includes("Payout")) ||
              (userRole === "Content Manager" && item.title.includes("Marketplace"))
            ).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-4 h-4 ${
                    item.priority === 'critical' ? 'text-red-600' :
                    item.priority === 'high' ? 'text-orange-600' :
                    'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">{item.title}</p>
                      <Badge 
                        variant={item.priority === 'critical' ? 'destructive' : 
                                item.priority === 'high' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {item.count}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  {item.action}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.filter(action => {
              if (action.title.includes("User")) return canViewUsers;
              if (action.title.includes("Payouts") || action.title.includes("Revenue")) return canViewFinancials;
              if (action.title.includes("Marketplace")) return hasPermission(userRole, "marketplace", "R");
              if (action.title.includes("Report")) return canViewModeration;
              return canViewAnalytics;
            }).map((action, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <action.icon className="w-4 h-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <Button variant={action.variant} size="sm">
                  {action.action}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>System Health</span>
          </CardTitle>
          <CardDescription>Platform performance and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">145ms</div>
              <p className="text-sm text-muted-foreground">Avg Response</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">2.3GB</div>
              <p className="text-sm text-muted-foreground">Storage Used</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">12,847</div>
              <p className="text-sm text-muted-foreground">API Calls Today</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}