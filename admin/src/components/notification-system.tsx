import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Bell, 
  AlertTriangle, 
  Shield, 
  DollarSign, 
  Users, 
  Store, 
  Building, 
  Home, 
  CheckCircle,
  Clock,
  Eye,
  X
} from "lucide-react";
import { UserRole, hasPermission } from "../utils/permissions";

interface NotificationSystemProps {
  userRole: UserRole;
}

interface Notification {
  id: string;
  type: "security" | "financial" | "user" | "content" | "system" | "verification";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionRequired: boolean;
  relatedModule: string;
  relatedId?: string;
}

export function NotificationSystem({ userRole }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "security",
      priority: "critical",
      title: "Multiple Failed Login Attempts",
      message: "User account john.doe@example.com has 5 consecutive failed login attempts",
      timestamp: new Date("2024-01-15T10:30:00"),
      read: false,
      actionRequired: true,
      relatedModule: "users",
      relatedId: "user_123"
    },
    {
      id: "2",
      type: "financial",
      priority: "high",
      title: "Large Refund Request",
      message: "Refund request of $2,500 pending approval for subscription cancellation",
      timestamp: new Date("2024-01-15T09:15:00"),
      read: false,
      actionRequired: true,
      relatedModule: "billing",
      relatedId: "refund_456"
    },
    {
      id: "3",
      type: "verification",
      priority: "medium",
      title: "Teacher Verification Pending",
      message: "New teacher verification application from Dr. Sarah Wilson requires review",
      timestamp: new Date("2024-01-15T08:45:00"),
      read: false,
      actionRequired: true,
      relatedModule: "verification",
      relatedId: "teacher_789"
    },
    {
      id: "4",
      type: "content",
      priority: "medium",
      title: "Marketplace Course Review",
      message: "Course 'Advanced JavaScript' submitted for marketplace approval",
      timestamp: new Date("2024-01-14T16:20:00"),
      read: true,
      actionRequired: true,
      relatedModule: "marketplace",
      relatedId: "course_321"
    },
    {
      id: "5",
      type: "user",
      priority: "low",
      title: "User Report Filed",
      message: "Report filed against user for inappropriate content in discussion forum",
      timestamp: new Date("2024-01-14T14:30:00"),
      read: true,
      actionRequired: false,
      relatedModule: "moderation",
      relatedId: "report_654"
    }
  ]);

  // Filter notifications based on user permissions
  const filteredNotifications = notifications.filter(notification => {
    switch (notification.type) {
      case "security":
        return hasPermission(userRole, "users", "R") || hasPermission(userRole, "moderation", "R");
      case "financial":
        return hasPermission(userRole, "billing", "R");
      case "user":
        return hasPermission(userRole, "users", "R") || hasPermission(userRole, "moderation", "R");
      case "content":
        return hasPermission(userRole, "marketplace", "R") || hasPermission(userRole, "taxonomy", "R");
      case "verification":
        return hasPermission(userRole, "verification", "R");
      case "system":
        return hasPermission(userRole, "settings", "R");
      default:
        return true;
    }
  });

  const unreadCount = filteredNotifications.filter(n => !n.read).length;
  const criticalCount = filteredNotifications.filter(n => n.priority === "critical" && !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "security": return Shield;
      case "financial": return DollarSign;
      case "user": return Users;
      case "content": return Store;
      case "verification": return CheckCircle;
      case "system": return AlertTriangle;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const groupedNotifications = {
    critical: filteredNotifications.filter(n => n.priority === "critical"),
    actionRequired: filteredNotifications.filter(n => n.actionRequired && n.priority !== "critical"),
    recent: filteredNotifications.filter(n => !n.actionRequired && n.priority !== "critical")
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge 
              variant={criticalCount > 0 ? "destructive" : "default"} 
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-96 sm:w-[480px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="all" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              All ({filteredNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="critical">
              Critical ({groupedNotifications.critical.length})
            </TabsTrigger>
            <TabsTrigger value="action">
              Action ({groupedNotifications.actionRequired.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No notifications</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => {
                    const IconComponent = getNotificationIcon(notification.type);
                    
                    return (
                      <Card 
                        key={notification.id} 
                        className={`relative ${!notification.read ? 'border-blue-200 bg-blue-50/50' : ''}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="mt-1">
                                <IconComponent className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <p className="font-medium text-sm">{notification.title}</p>
                                  <Badge className={getPriorityColor(notification.priority)}>
                                    {notification.priority}
                                  </Badge>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>{formatRelativeTime(notification.timestamp)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    {notification.actionRequired && (
                                      <Button size="sm" variant="outline">
                                        <Eye className="w-3 h-3 mr-1" />
                                        View
                                      </Button>
                                    )}
                                    {!notification.read && (
                                      <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => markAsRead(notification.id)}
                                      >
                                        Mark read
                                      </Button>
                                    )}
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      onClick={() => dismissNotification(notification.id)}
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="critical" className="mt-4">
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {groupedNotifications.critical.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">No critical notifications</p>
                  </div>
                ) : (
                  groupedNotifications.critical.map((notification) => {
                    const IconComponent = getNotificationIcon(notification.type);
                    
                    return (
                      <Card key={notification.id} className="border-red-200 bg-red-50/50">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-4 h-4 text-red-600 mt-1" />
                            <div className="flex-1">
                              <p className="font-medium text-sm text-red-900">{notification.title}</p>
                              <p className="text-sm text-red-700 mb-2">{notification.message}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-red-600">
                                  {formatRelativeTime(notification.timestamp)}
                                </span>
                                <Button size="sm" variant="destructive">
                                  Take Action
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="action" className="mt-4">
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {groupedNotifications.actionRequired.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">No actions required</p>
                  </div>
                ) : (
                  groupedNotifications.actionRequired.map((notification) => {
                    const IconComponent = getNotificationIcon(notification.type);
                    
                    return (
                      <Card key={notification.id} className="border-orange-200 bg-orange-50/50">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <IconComponent className="w-4 h-4 text-orange-600 mt-1" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {formatRelativeTime(notification.timestamp)}
                                </span>
                                <Button size="sm" variant="default">
                                  Review
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}