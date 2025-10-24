"use client"
import { Bell, Calendar, DollarSign, Plus, TrendingUp, Users, Video } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useAppStore } from "../hooks/useAppStore"
import { MobileHeader, MobileGrid, MobileStack } from "./MobileOptimizedLayout"

export function Dashboard() {
  const { setCreateCourseModalOpen, setActiveSection, setPayoutModalOpen } = useAppStore()
  const overviewCards = [
    {
      title: "Total Earnings",
      value: "$2,847",
      description: "This month",
      icon: DollarSign,
      trend: "+12.5%"
    },
    {
      title: "Active Students",
      value: "127",
      description: "Currently enrolled",
      icon: Users,
      trend: "+8.2%"
    },
    {
      title: "Lessons Sold",
      value: "43",
      description: "This week",
      icon: TrendingUp,
      trend: "+23.1%"
    },
    {
      title: "Live Sessions",
      value: "18",
      description: "This week",
      icon: Video,
      trend: "+4.3%"
    }
  ]

  const notifications = [
    {
      type: "booking",
      title: "New session booking",
      description: "Sarah Chen booked a 1-on-1 session for tomorrow 3 PM",
      time: "2 min ago",
      avatar: "SC"
    },
    {
      type: "review",
      title: "New 5-star review",
      description: "\"Amazing teacher! Very patient and helpful.\"",
      time: "1 hour ago",
      avatar: "MK"
    },
    {
      type: "admin",
      title: "Lesson approved",
      description: "Your 'IELTS Speaking Practice' lesson has been approved",
      time: "3 hours ago",
      avatar: "AD"
    },
    {
      type: "booking",
      title: "Session reminder",
      description: "Live session with Alex Rodriguez in 30 minutes",
      time: "30 min",
      avatar: "AR"
    }
  ]

  const upcomingSessions = [
    {
      student: "Maria Garcia",
      time: "2:00 PM - 3:00 PM",
      topic: "Business English Conversation",
      avatar: "MG"
    },
    {
      student: "John Smith",
      time: "4:30 PM - 5:30 PM", 
      topic: "IELTS Speaking Preparation",
      avatar: "JS"
    },
    {
      student: "Lisa Wang",
      time: "6:00 PM - 7:00 PM",
      topic: "Grammar Fundamentals",
      avatar: "LW"
    }
  ]

  return (
    <MobileStack spacing="lg">
      <MobileHeader
        title="Welcome back, Sarah!"
        subtitle="Here's what's happening with your teaching today."
        action={
          <Button 
            size="sm" 
            className="hidden sm:flex"
            onClick={() => setCreateCourseModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Course
          </Button>
        }
      />

      {/* Mobile Action Buttons */}
      <div className="flex gap-2 sm:hidden">
        <Button 
          size="sm" 
          className="flex-1"
          onClick={() => setCreateCourseModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Course
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setActiveSection("live-sessions")}
        >
          <Calendar className="w-4 h-4" />
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {overviewCards.map((card, index) => (
          <Card key={index} className="lg:hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 lg:p-6">
              <CardTitle className="text-xs lg:text-sm font-medium truncate">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
              <div className="text-xl lg:text-2xl font-bold">{card.value}</div>
              <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2 text-xs text-muted-foreground mt-1">
                <span className="truncate">{card.description}</span>
                <Badge variant="secondary" className="text-green-600 w-fit">
                  {card.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Recent Notifications
            </CardTitle>
            <CardDescription>Stay updated with your latest activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0 lg:p-6 lg:pt-0">
            {notifications.map((notification, index) => (
              <button
                key={index}
                className="w-full flex items-start gap-3 p-3 rounded-lg bg-muted/50 active:bg-muted transition-colors text-left"
              >
                <Avatar className="h-9 w-9 flex-shrink-0">
                  <AvatarFallback className="text-xs">{notification.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notification.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Sessions
            </CardTitle>
            <CardDescription>Your scheduled live sessions for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0 lg:p-6 lg:pt-0">
            {upcomingSessions.map((session, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback>{session.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{session.student}</p>
                  <p className="text-sm text-muted-foreground truncate">{session.topic}</p>
                  <p className="text-xs text-muted-foreground">{session.time}</p>
                </div>
                <Button size="sm" variant="outline" className="flex-shrink-0">
                  <Video className="w-4 h-4 lg:mr-2" />
                  <span className="hidden lg:inline">Join</span>
                </Button>
              </div>
            ))}
            
            {upcomingSessions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No sessions scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="p-4 lg:p-6">
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used actions to manage your teaching</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
          <MobileGrid columns={3}>
            <Button 
              variant="outline" 
              className="h-20 lg:h-24 flex-col gap-2 active:scale-95 transition-transform"
              onClick={() => setCreateCourseModalOpen(true)}
            >
              <Plus className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="text-xs lg:text-sm">Create Course</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 lg:h-24 flex-col gap-2 active:scale-95 transition-transform"
              onClick={() => setActiveSection("live-sessions")}
            >
              <Calendar className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="text-xs lg:text-sm">Availability</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 lg:h-24 flex-col gap-2 active:scale-95 transition-transform"
              onClick={() => setPayoutModalOpen(true)}
            >
              <DollarSign className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="text-xs lg:text-sm">Payout</span>
            </Button>
          </MobileGrid>
        </CardContent>
      </Card>
    </MobileStack>
  )
}