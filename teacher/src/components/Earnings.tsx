import { ArrowDownRight, ArrowUpRight, CreditCard, DollarSign, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useAppStore } from "../hooks/useAppStore"

export function Earnings() {
  const { setPayoutModalOpen } = useAppStore()
  const earningsOverview = {
    totalBalance: 2847.50,
    monthlyEarnings: 1243.75,
    marketplaceSales: 894.25,
    liveSessions: 1953.25,
    pendingPayouts: 0
  }

  const transactions = [
    {
      id: 1,
      type: "lesson_sale",
      description: "IELTS Speaking Practice - Part 1",
      student: "Maria Garcia",
      amount: 15.00,
      date: "Dec 23, 2024",
      status: "completed"
    },
    {
      id: 2,
      type: "live_session",
      description: "1-on-1 Business English Session",
      student: "John Smith",
      amount: 45.00,
      date: "Dec 23, 2024",
      status: "completed"
    },
    {
      id: 3,
      type: "lesson_sale",
      description: "Business Email Writing",
      student: "Lisa Wang",
      amount: 20.00,
      date: "Dec 22, 2024",
      status: "completed"
    },
    {
      id: 4,
      type: "live_session",
      description: "1-on-1 IELTS Preparation",
      student: "Ahmed Hassan",
      amount: 50.00,
      date: "Dec 22, 2024",
      status: "completed"
    },
    {
      id: 5,
      type: "lesson_sale",
      description: "Pronunciation Masterclass",
      student: "Sophie Martin",
      amount: 25.00,
      date: "Dec 21, 2024",
      status: "pending"
    },
    {
      id: 6,
      type: "payout",
      description: "Bank Transfer Payout",
      student: "",
      amount: -500.00,
      date: "Dec 20, 2024",
      status: "completed"
    }
  ]

  const monthlyData = [
    { month: "Jul", earnings: 1890 },
    { month: "Aug", earnings: 2156 },
    { month: "Sep", earnings: 1967 },
    { month: "Oct", earnings: 2234 },
    { month: "Nov", earnings: 2445 },
    { month: "Dec", earnings: 2847 }
  ]

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "lesson_sale":
      case "live_session":
        return <ArrowUpRight className="w-4 h-4 text-green-500" />
      case "payout":
        return <ArrowDownRight className="w-4 h-4 text-red-500" />
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Earnings</h1>
        <Button onClick={() => setPayoutModalOpen(true)}>
          <CreditCard className="w-4 h-4 mr-2" />
          Request Payout
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earningsOverview.totalBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Available for withdrawal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earningsOverview.monthlyEarnings.toFixed(2)}</div>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              +18.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketplace Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earningsOverview.marketplaceSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From lesson sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Sessions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earningsOverview.liveSessions.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From 1-on-1 sessions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          <div className="flex justify-between items-center">
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="lesson_sale">Lesson Sales</SelectItem>
                <SelectItem value="live_session">Live Sessions</SelectItem>
                <SelectItem value="payout">Payouts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your earnings and payout history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{transaction.description}</p>
                      {transaction.student && (
                        <p className="text-sm text-muted-foreground">from {transaction.student}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                      <div className={`text-lg font-semibold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Earnings Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Earnings Trend</CardTitle>
                <CardDescription>Last 6 months earnings overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{data.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(data.earnings / 3000) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-16 text-right">
                          ${data.earnings}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Earnings Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Earnings Breakdown</CardTitle>
                <CardDescription>This month's income sources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Live Sessions (65%)</span>
                    <span className="font-medium">${(earningsOverview.monthlyEarnings * 0.65).toFixed(2)}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-blue-500 rounded-full" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Lesson Sales (35%)</span>
                    <span className="font-medium">${(earningsOverview.monthlyEarnings * 0.35).toFixed(2)}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-[35%] h-full bg-green-500 rounded-full" />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total This Month</span>
                    <span className="font-bold text-lg">${earningsOverview.monthlyEarnings.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators for this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">43</div>
                  <p className="text-sm text-muted-foreground">Lessons Sold</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">28</div>
                  <p className="text-sm text-muted-foreground">Live Sessions</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">$28.95</div>
                  <p className="text-sm text-muted-foreground">Avg. Lesson Price</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">$69.75</div>
                  <p className="text-sm text-muted-foreground">Avg. Session Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}