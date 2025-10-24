import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  DollarSign,
  Download,
  Calendar,
  Target,
  Globe,
  Clock,
  Star,
  MessageSquare,
  Zap
} from "lucide-react";

interface AnalyticsDashboardProps {
  userRole: string;
}

export function AnalyticsDashboard({ userRole }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState("7d");

  const keyMetrics = [
    {
      title: "Daily Active Users",
      value: "3,247",
      change: "+12.5%",
      changeType: "positive",
      icon: Users,
      description: "Users who accessed the platform today"
    },
    {
      title: "Lessons Completed",
      value: "1,832",
      change: "+8.2%",
      changeType: "positive",
      icon: BookOpen,
      description: "Total lessons completed today"
    },
    {
      title: "Revenue Today",
      value: "$2,847",
      change: "+23.1%",
      changeType: "positive",
      icon: DollarSign,
      description: "Total revenue generated today"
    },
    {
      title: "User Retention",
      value: "78.4%",
      change: "+5.4%",
      changeType: "positive",
      icon: Target,
      description: "7-day retention rate"
    }
  ];

  const userAnalytics = {
    totalUsers: 15847,
    newUsers: 89,
    activeUsers: 3247,
    usersByRole: [
      { role: "Students", count: 12847, percentage: 81 },
      { role: "Teachers", count: 2341, percentage: 15 },
      { role: "Institutions", count: 89, percentage: 0.6 },
      { role: "Homestays", count: 570, percentage: 3.6 }
    ],
    usersByCountry: [
      { country: "United States", users: 4254, percentage: 26.8 },
      { country: "United Kingdom", users: 2847, percentage: 18.0 },
      { country: "Canada", users: 1932, percentage: 12.2 },
      { country: "Australia", users: 1547, percentage: 9.8 },
      { country: "Others", users: 5267, percentage: 33.2 }
    ]
  };

  const engagementMetrics = [
    {
      metric: "Avg Session Duration",
      value: "24m 32s",
      change: "+3.2%",
      target: "25m"
    },
    {
      metric: "Lessons per User",
      value: "3.7",
      change: "+8.1%",
      target: "4.0"
    },
    {
      metric: "Voice Room Usage",
      value: "1,247",
      change: "+15.3%",
      target: "1,500"
    },
    {
      metric: "AI Feature Usage",
      value: "5,832",
      change: "+22.4%",
      target: "6,000"
    }
  ];

  const contentStats = [
    {
      category: "Grammar",
      lessons: 45,
      completions: 12847,
      avgRating: 4.7,
      trend: "up"
    },
    {
      category: "Speaking",
      lessons: 32,
      completions: 8932,
      avgRating: 4.8,
      trend: "up"
    },
    {
      category: "Writing",
      lessons: 28,
      completions: 6547,
      avgRating: 4.6,
      trend: "stable"
    },
    {
      category: "IELTS Prep",
      lessons: 15,
      completions: 4325,
      avgRating: 4.9,
      trend: "up"
    }
  ];

  const financialMetrics = [
    {
      metric: "Monthly Recurring Revenue",
      value: "$89,247",
      change: "+18.5%"
    },
    {
      metric: "Average Revenue Per User",
      value: "$47.83",
      change: "+12.3%"
    },
    {
      metric: "Customer Lifetime Value",
      value: "$247.50",
      change: "+8.7%"
    },
    {
      metric: "Conversion Rate",
      value: "18.7%",
      change: "+2.1%"
    }
  ];

  const topLessons = [
    {
      title: "Present Perfect Tense",
      category: "Grammar",
      views: 2847,
      completions: 2156,
      rating: 4.8,
      type: "Official"
    },
    {
      title: "Business English Conversations",
      category: "Speaking",
      views: 1932,
      completions: 1674,
      rating: 4.7,
      type: "Marketplace"
    },
    {
      title: "IELTS Writing Task 1",
      category: "Writing",
      views: 1547,
      completions: 1203,
      rating: 4.9,
      type: "Official"
    },
    {
      title: "Pronunciation Masterclass",
      category: "Speaking",
      views: 1234,
      completions: 987,
      rating: 4.6,
      type: "Marketplace"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive platform analytics and performance metrics
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`text-xs ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change}
                </span>
                <span className="text-xs text-muted-foreground">vs last period</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Overview */}
            <Card>
              <CardHeader>
                <CardTitle>User Overview</CardTitle>
                <CardDescription>Current user base statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{userAnalytics.totalUsers.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+{userAnalytics.newUsers}</div>
                    <div className="text-sm text-muted-foreground">New Today</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {userAnalytics.usersByRole.map((role, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{role.role}</span>
                        <span className="font-medium">{role.count.toLocaleString()} ({role.percentage}%)</span>
                      </div>
                      <Progress value={role.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Users by country</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userAnalytics.usersByCountry.map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{country.country}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{country.users.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{country.percentage}%</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>User behavior and platform usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {engagementMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <div className="text-right">
                        <div className="text-lg font-bold">{metric.value}</div>
                        <div className="text-xs text-green-600">{metric.change}</div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Target: {metric.target}</span>
                      <span>Progress</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
                <CardDescription>User activity over the past 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={index} className="text-xs text-muted-foreground">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {[3247, 3891, 4156, 3742, 4523, 2847, 2134].map((users, index) => (
                      <div key={index} className="text-center">
                        <div className="h-16 bg-blue-100 rounded flex items-end justify-center">
                          <div 
                            className="w-full bg-blue-600 rounded" 
                            style={{ height: `${(users / 5000) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs mt-1">{users}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Content Performance by Category</CardTitle>
                <CardDescription>Lesson statistics and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentStats.map((category, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{category.category}</h4>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{category.avgRating}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Lessons:</span>
                          <span className="font-medium ml-1">{category.lessons}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Completions:</span>
                          <span className="font-medium ml-1">{category.completions.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Lessons */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Lessons</CardTitle>
                <CardDescription>Most popular content this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topLessons.map((lesson, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{lesson.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {lesson.type}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {lesson.category} • {lesson.views} views • {lesson.completions} completed
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{lesson.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Financial Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Metrics</CardTitle>
                <CardDescription>Revenue and monetization statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {financialMetrics.map((metric, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-sm font-medium">{metric.metric}</span>
                    <div className="text-right">
                      <div className="font-bold">{metric.value}</div>
                      <div className="text-xs text-green-600">{metric.change}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue sources this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-600 rounded"></div>
                      <span className="text-sm">Subscriptions</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">$67,543</div>
                      <div className="text-xs text-muted-foreground">75.7%</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-600 rounded"></div>
                      <span className="text-sm">Marketplace</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">$15,234</div>
                      <div className="text-xs text-muted-foreground">17.1%</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-600 rounded"></div>
                      <span className="text-sm">Credits</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">$4,847</div>
                      <div className="text-xs text-muted-foreground">5.4%</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-600 rounded"></div>
                      <span className="text-sm">Tutoring</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">$1,623</div>
                      <div className="text-xs text-muted-foreground">1.8%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}