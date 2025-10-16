import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Calendar } from "./ui/calendar"
import { 
  TrendingUp, 
  Eye, 
  MousePointerClick, 
  Calendar as CalendarIcon,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Check,
  Clock,
  Sparkles,
  Search,
  BarChart3,
  Plus,
  X
} from "lucide-react"
import { Progress } from "./ui/progress"
import { CreatePromotionModal } from "./modals/CreatePromotionModal"
import { ConfirmPromotionModal } from "./modals/ConfirmPromotionModal"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

export function Promotions() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null)

  // Mock data for current promotions
  const activePromotions = [
    {
      id: 1,
      type: "Carousel",
      target: "Business English Course",
      targetType: "course",
      dateRange: "Oct 8 - Oct 14, 2025",
      status: "active",
      views: 4523,
      clicks: 287,
      ctr: 6.3,
      spent: 75,
      budget: 150
    },
    {
      id: 2,
      type: "Search Boost",
      target: "Teacher Profile",
      targetType: "profile",
      dateRange: "Oct 10 - Oct 16, 2025",
      status: "pending",
      views: 0,
      clicks: 0,
      ctr: 0,
      spent: 0,
      budget: 100
    }
  ]

  const pastPromotions = [
    {
      id: 3,
      type: "Both",
      target: "IELTS Preparation Course",
      targetType: "course",
      dateRange: "Sep 25 - Oct 1, 2025",
      status: "completed",
      views: 8921,
      clicks: 634,
      ctr: 7.1,
      spent: 200,
      budget: 200
    }
  ]

  // Mock calendar data - unavailable dates (already booked)
  const bookedSlots = {
    carousel: ['2025-10-08', '2025-10-09', '2025-10-10', '2025-10-11', '2025-10-12', '2025-10-13', '2025-10-14'],
    searchBoost: ['2025-10-10', '2025-10-11', '2025-10-12', '2025-10-13', '2025-10-14', '2025-10-15', '2025-10-16']
  }

  // Mock insights data
  const performanceData = [
    { date: 'Oct 1', views: 523, clicks: 34 },
    { date: 'Oct 2', views: 612, clicks: 45 },
    { date: 'Oct 3', views: 734, clicks: 52 },
    { date: 'Oct 4', views: 891, clicks: 67 },
    { date: 'Oct 5', views: 756, clicks: 48 },
    { date: 'Oct 6', views: 623, clicks: 41 },
    { date: 'Oct 7', views: 384, clicks: 30 }
  ]

  // Pricing
  const pricing = {
    carousel: 25,
    searchBoost: 15,
    both: 35
  }

  const getMonthName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">Active</Badge>
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">Pending Approval</Badge>
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Carousel":
        return <Sparkles className="w-4 h-4" />
      case "Search Boost":
        return <Search className="w-4 h-4" />
      case "Both":
        return <TrendingUp className="w-4 h-4" />
      default:
        return <TrendingUp className="w-4 h-4" />
    }
  }

  const handleCreatePromotion = () => {
    setShowCreateModal(true)
  }

  const handleConfirmBooking = (promotionData: any) => {
    setSelectedPromotion(promotionData)
    setShowCreateModal(false)
    setShowConfirmModal(true)
  }

  // Calculate total stats
  const totalViews = activePromotions.reduce((sum, p) => sum + p.views, 0)
  const totalClicks = activePromotions.reduce((sum, p) => sum + p.clicks, 0)
  const totalSpent = activePromotions.reduce((sum, p) => sum + p.spent, 0)
  const avgCTR = activePromotions.length > 0 
    ? (totalClicks / totalViews * 100).toFixed(1)
    : 0

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1>Promotions</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Boost your courses and profile visibility
          </p>
        </div>

        <Button
          onClick={handleCreatePromotion}
          className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Promotion
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Views</p>
                <p className="text-xl font-semibold mt-1">{totalViews.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Clicks</p>
                <p className="text-xl font-semibold mt-1">{totalClicks}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                <MousePointerClick className="w-5 h-5 text-violet-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg CTR</p>
                <p className="text-xl font-semibold mt-1">{avgCTR}%</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
                <p className="text-xl font-semibold mt-1">${totalSpent}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full sm:w-auto sm:inline-grid grid-cols-3">
          <TabsTrigger value="active">
            Active ({activePromotions.filter(p => p.status !== 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({activePromotions.filter(p => p.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Active Promotions */}
        <TabsContent value="active" className="space-y-3">
          {activePromotions.filter(p => p.status === 'active').length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">No Active Promotions</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-4">
                  Start promoting your courses or profile to reach more students
                </p>
                <Button onClick={handleCreatePromotion} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Promotion
                </Button>
              </CardContent>
            </Card>
          ) : (
            activePromotions
              .filter(p => p.status === 'active')
              .map((promo) => (
                <Card key={promo.id} className="overflow-hidden border-primary/20">
                  <CardContent className="p-0">
                    <div className="p-4">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-violet-600/20 border border-primary/30 flex items-center justify-center">
                            {getTypeIcon(promo.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{promo.target}</h3>
                              {getStatusBadge(promo.status)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {promo.type} • {promo.dateRange}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Views</p>
                          <p className="font-semibold">{promo.views.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Clicks</p>
                          <p className="font-semibold">{promo.clicks}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">CTR</p>
                          <p className="font-semibold text-emerald-500">{promo.ctr}%</p>
                        </div>
                      </div>

                      {/* Budget Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Budget Used</span>
                          <span className="font-medium">
                            ${promo.spent} / ${promo.budget}
                          </span>
                        </div>
                        <Progress value={(promo.spent / promo.budget) * 100} className="h-2" />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 px-4 pb-4 border-t border-border pt-3 bg-muted/20">
                      <Button variant="outline" size="sm" className="flex-1">
                        <BarChart3 className="w-3 h-3 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50">
                        <X className="w-3 h-3 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        {/* Pending Promotions */}
        <TabsContent value="pending" className="space-y-3">
          {activePromotions.filter(p => p.status === 'pending').length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">No Pending Approvals</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  All your promotions have been processed
                </p>
              </CardContent>
            </Card>
          ) : (
            activePromotions
              .filter(p => p.status === 'pending')
              .map((promo) => (
                <Card key={promo.id} className="overflow-hidden border-amber-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{promo.target}</h3>
                            {getStatusBadge(promo.status)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {promo.type} • {promo.dateRange}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <div className="text-xs text-amber-200">
                        <p className="font-medium mb-1">Awaiting Admin Approval</p>
                        <p className="text-amber-300/80">
                          Your promotion is under review. This typically takes 24-48 hours.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50">
                        Cancel Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          {/* Performance Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Performance Overview</CardTitle>
              <CardDescription className="text-xs">Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#a1a1aa"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#a1a1aa"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1f',
                      border: '1px solid #27272a',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#7c3aed" 
                    strokeWidth={2}
                    dot={{ fill: '#7c3aed', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#a855f7" 
                    strokeWidth={2}
                    dot={{ fill: '#a855f7', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span>Views</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                  <span>Clicks</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Performing */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Best Performing Promotion</CardTitle>
            </CardHeader>
            <CardContent>
              {pastPromotions[0] && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{pastPromotions[0].target}</h3>
                      <p className="text-xs text-muted-foreground">{pastPromotions[0].dateRange}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Views</p>
                      <p className="font-semibold">{pastPromotions[0].views.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Clicks</p>
                      <p className="font-semibold">{pastPromotions[0].clicks}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">CTR</p>
                      <p className="font-semibold text-emerald-500">{pastPromotions[0].ctr}%</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing Info */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-violet-600/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Promotion Pricing</CardTitle>
              <CardDescription className="text-xs">Cost per day</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Carousel Promotion</span>
                </div>
                <span className="font-semibold text-primary">${pricing.carousel}/day</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-violet-500" />
                  <span className="text-sm font-medium">Search Boost</span>
                </div>
                <span className="font-semibold text-violet-500">${pricing.searchBoost}/day</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-violet-600/10 rounded-lg border border-primary/30">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Both (Bundle)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs line-through text-muted-foreground">$40</span>
                  <span className="font-semibold text-emerald-500">${pricing.both}/day</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center pt-2">
                💡 Save ${pricing.carousel + pricing.searchBoost - pricing.both}/day with bundle pricing
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreatePromotionModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onConfirm={handleConfirmBooking}
        pricing={pricing}
        bookedSlots={bookedSlots}
      />

      <ConfirmPromotionModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        promotion={selectedPromotion}
      />
    </div>
  )
}
