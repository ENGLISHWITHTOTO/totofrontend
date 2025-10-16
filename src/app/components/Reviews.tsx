import { BarChart3, Calendar, Star, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Progress } from "./ui/progress"

export function Reviews() {
  const overallStats = {
    averageRating: 4.8,
    totalReviews: 156,
    totalSessions: 89,
    totalLessons: 67,
    weeklyEarnings: 1243,
    monthlyEarnings: 4876
  }

  const ratingDistribution = [
    { stars: 5, count: 124, percentage: 79.5 },
    { stars: 4, count: 23, percentage: 14.7 },
    { stars: 3, count: 6, percentage: 3.8 },
    { stars: 2, count: 2, percentage: 1.3 },
    { stars: 1, count: 1, percentage: 0.6 }
  ]

  const recentReviews = [
    {
      id: 1,
      student: "Maria Garcia",
      avatar: "MG",
      rating: 5,
      date: "Dec 23, 2024",
      lesson: "IELTS Speaking Practice - Part 1",
      comment: "Excellent lesson! Sarah's teaching style is very clear and engaging. The practice questions helped me gain confidence for my IELTS exam. Highly recommended!",
      helpful: true
    },
    {
      id: 2,
      student: "John Smith",
      avatar: "JS",
      rating: 5,
      date: "Dec 22, 2024",
      lesson: "Business Email Writing",
      comment: "Perfect for my needs! The lesson covered all the essential elements of professional email writing. The examples were very practical and relevant to my work.",
      helpful: true
    },
    {
      id: 3,
      student: "Lisa Wang",
      avatar: "LW",
      rating: 4,
      date: "Dec 21, 2024",
      lesson: "Live Session - Grammar Fundamentals",
      comment: "Very helpful session. Sarah explained complex grammar rules in a simple way. Would have liked more practice exercises during the session.",
      helpful: false
    },
    {
      id: 4,
      student: "Ahmed Hassan",
      avatar: "AH",
      rating: 5,
      date: "Dec 20, 2024",
      lesson: "Pronunciation Masterclass",
      comment: "Amazing pronunciation guide! The audio examples and techniques really helped me improve my accent. Sarah is patient and provides excellent feedback.",
      helpful: true
    },
    {
      id: 5,
      student: "Sophie Martin",
      avatar: "SM",
      rating: 5,
      date: "Dec 19, 2024",
      lesson: "Live Session - Travel English",
      comment: "Great session for travel preparation! Learned practical phrases and conversation skills that I can use during my trip. Very interactive and fun!",
      helpful: true
    }
  ]

  const performanceMetrics = [
    {
      period: "This Week",
      sessions: 12,
      lessonsSold: 8,
      avgRating: 4.9,
      earnings: 1243
    },
    {
      period: "Last Week",
      sessions: 10,
      lessonsSold: 6,
      avgRating: 4.7,
      earnings: 1089
    },
    {
      period: "This Month",
      sessions: 47,
      lessonsSold: 31,
      avgRating: 4.8,
      earnings: 4876
    },
    {
      period: "Last Month",
      sessions: 42,
      lessonsSold: 28,
      avgRating: 4.6,
      earnings: 4234
    }
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Reviews & Reports</h1>
        <Select defaultValue="all-time">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-time">All Time</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-1">
              <div className="text-2xl font-bold">{overallStats.averageRating}</div>
              <div className="flex">
                {renderStars(Math.floor(overallStats.averageRating))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">From {overallStats.totalReviews} reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions Taught</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">Live 1-on-1 sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons Sold</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalLessons}</div>
            <p className="text-xs text-muted-foreground">Marketplace purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${overallStats.monthlyEarnings}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              +15.2% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reviews" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reviews">Student Reviews</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rating Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
                <CardDescription>Breakdown of all ratings received</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ratingDistribution.map((rating) => (
                  <div key={rating.stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm">{rating.stars}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <Progress value={rating.percentage} className="flex-1" />
                        <span className="text-sm text-muted-foreground ml-3 w-12 text-right">
                          {rating.count}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>Latest feedback from your students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {recentReviews.map((review) => (
                  <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{review.avatar}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{review.student}</h4>
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">{review.lesson}</p>
                        <p className="text-sm mb-3">{review.comment}</p>
                        
                        <div className="flex items-center gap-2">
                          {review.helpful && (
                            <Badge variant="secondary" className="text-green-600">
                              Helpful Review
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>Compare your performance across different time periods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Period</th>
                      <th className="text-left py-3 px-4">Sessions</th>
                      <th className="text-left py-3 px-4">Lessons Sold</th>
                      <th className="text-left py-3 px-4">Avg. Rating</th>
                      <th className="text-left py-3 px-4">Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceMetrics.map((metric, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4 font-medium">{metric.period}</td>
                        <td className="py-3 px-4">{metric.sessions}</td>
                        <td className="py-3 px-4">{metric.lessonsSold}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {metric.avgRating}
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          </div>
                        </td>
                        <td className="py-3 px-4">${metric.earnings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
                <CardDescription>This week vs last week</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sessions Taught</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">12</span>
                    <Badge variant="secondary" className="text-green-600">+20%</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lessons Sold</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">8</span>
                    <Badge variant="secondary" className="text-green-600">+33%</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Rating</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">4.9</span>
                    <Badge variant="secondary" className="text-green-600">+0.2</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Earnings</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">$1,243</span>
                    <Badge variant="secondary" className="text-green-600">+14%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Satisfaction</CardTitle>
                <CardDescription>Feedback and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">5-Star Reviews</span>
                  <span className="font-medium">79.5%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Repeat Bookings</span>
                  <span className="font-medium">68%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Response Rate</span>
                  <span className="font-medium">95%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lesson Completion</span>
                  <span className="font-medium">92%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}