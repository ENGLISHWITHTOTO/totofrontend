import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  Search, 
  Plus, 
  Edit, 
  DollarSign, 
  Users, 
  TrendingUp,
  CreditCard,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Calendar,
  MoreHorizontal
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface SubscriptionManagementProps {
  userRole: string;
}

export function SubscriptionManagement({ userRole }: SubscriptionManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);

  const subscriptionPlans = [
    {
      id: 1,
      name: "Free",
      price: 0,
      duration: "monthly",
      features: ["5 lessons per month", "Basic AI features", "Community access"],
      activeSubscribers: 8247,
      revenue: 0,
      status: "active"
    },
    {
      id: 2,
      name: "Premium",
      price: 19.99,
      duration: "monthly",
      features: ["Unlimited lessons", "Advanced AI features", "Priority support", "Offline downloads"],
      activeSubscribers: 2341,
      revenue: 46803.59,
      status: "active"
    },
    {
      id: 3,
      name: "Teacher Pro",
      price: 49.99,
      duration: "monthly", 
      features: ["All Premium features", "Marketplace access", "Analytics dashboard", "Custom branding"],
      activeSubscribers: 456,
      revenue: 22795.44,
      status: "active"
    },
    {
      id: 4,
      name: "Enterprise",
      price: 299.99,
      duration: "monthly",
      features: ["All features", "Custom integrations", "Dedicated support", "White-label solution"],
      activeSubscribers: 23,
      revenue: 6899.77,
      status: "active"
    }
  ];

  const subscribers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      plan: "Premium",
      status: "active",
      startDate: "2024-01-15",
      nextBilling: "2024-04-15",
      totalPaid: 59.97,
      avatar: null
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@email.com",
      plan: "Teacher Pro",
      status: "active",
      startDate: "2023-08-20",
      nextBilling: "2024-04-20",
      totalPaid: 399.92,
      avatar: null
    },
    {
      id: 3,
      name: "Cambridge Institute",
      email: "admin@cambridge.edu",
      plan: "Enterprise",
      status: "active",
      startDate: "2023-05-12",
      nextBilling: "2024-05-12",
      totalPaid: 3299.89,
      avatar: null
    },
    {
      id: 4,
      name: "Emma Rodriguez",
      email: "emma.r@email.com",
      plan: "Premium",
      status: "cancelled",
      startDate: "2024-02-01",
      nextBilling: null,
      totalPaid: 19.99,
      avatar: null
    },
    {
      id: 5,
      name: "Alex Thompson",
      email: "alex.t@email.com",
      plan: "Premium",
      status: "trial",
      startDate: "2024-03-15",
      nextBilling: "2024-03-22",
      totalPaid: 0,
      avatar: null
    }
  ];

  const transactions = [
    {
      id: 1,
      user: "Sarah Johnson",
      type: "subscription",
      plan: "Premium",
      amount: 19.99,
      status: "completed",
      date: "2024-03-15",
      paymentMethod: "Credit Card ****1234"
    },
    {
      id: 2,
      user: "Michael Chen",
      type: "marketplace",
      item: "Advanced Grammar Course",
      amount: 29.99,
      status: "completed",
      date: "2024-03-15",
      paymentMethod: "PayPal"
    },
    {
      id: 3,
      user: "Emma Rodriguez",
      type: "credit_pack",
      item: "50 Credit Pack",
      amount: 9.99,
      status: "completed",
      date: "2024-03-14",
      paymentMethod: "Credit Card ****5678"
    },
    {
      id: 4,
      user: "David Kim",
      type: "tutoring",
      item: "1-on-1 Session with Prof. Smith",
      amount: 45.00,
      status: "pending",
      date: "2024-03-14",
      paymentMethod: "Credit Card ****9012"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "trial": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "expired": return "bg-gray-100 text-gray-800";
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "subscription": return "bg-blue-100 text-blue-800";
      case "marketplace": return "bg-purple-100 text-purple-800";
      case "credit_pack": return "bg-orange-100 text-orange-800";
      case "tutoring": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === "all" || subscriber.plan === selectedPlan;
    
    return matchesSearch && matchesPlan;
  });

  const totalRevenue = subscriptionPlans.reduce((sum, plan) => sum + plan.revenue, 0);
  const totalSubscribers = subscriptionPlans.reduce((sum, plan) => sum + plan.activeSubscribers, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Subscriptions & Payments</h1>
          <p className="text-muted-foreground">
            Manage subscription plans, view transactions, and monitor revenue
          </p>
        </div>
        <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Subscription Plan</DialogTitle>
              <DialogDescription>
                Add a new subscription tier for your platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input id="plan-name" placeholder="e.g., Professional" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plan-price">Price</Label>
                  <Input id="plan-price" type="number" placeholder="29.99" />
                </div>
                <div>
                  <Label htmlFor="plan-duration">Duration</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreatePlanOpen(false)}>
                  Cancel
                </Button>
                <Button>Create Plan</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalSubscribers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">12.5%</p>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">$47.83</p>
                <p className="text-sm text-muted-foreground">Avg Revenue Per User</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Revenue Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status}
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{plan.duration === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Active Subscribers</span>
                      <span className="font-medium">{plan.activeSubscribers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Revenue</span>
                      <span className="font-medium">${plan.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search subscribers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    {subscriptionPlans.map(plan => (
                      <SelectItem key={plan.id} value={plan.name}>{plan.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Subscribers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Subscribers ({filteredSubscribers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subscriber</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Next Billing</TableHead>
                    <TableHead>Total Paid</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={subscriber.avatar} />
                            <AvatarFallback>{subscriber.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{subscriber.name}</p>
                            <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{subscriber.plan}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(subscriber.status)}>
                          {subscriber.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{subscriber.startDate}</TableCell>
                      <TableCell>
                        {subscriber.nextBilling ? (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>{subscriber.nextBilling}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>${subscriber.totalPaid}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Subscription
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Process Refund
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Cancel Subscription
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>All payment transactions across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Item/Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.user}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(transaction.type)}>
                          {transaction.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {transaction.plan || transaction.item}
                      </TableCell>
                      <TableCell>${transaction.amount}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {transaction.paymentMethod}
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
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscriptionPlans.filter(plan => plan.revenue > 0).map((plan) => (
                  <div key={plan.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{plan.name}</span>
                      <span className="font-medium">${plan.revenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(plan.revenue / totalRevenue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Recurring Revenue</span>
                    <span className="font-medium">${totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average Revenue Per User</span>
                    <span className="font-medium">${(totalRevenue / totalSubscribers).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Customer Lifetime Value</span>
                    <span className="font-medium">$247.50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Churn Rate</span>
                    <span className="font-medium">2.3%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Free to Paid Conversion</span>
                    <span className="font-medium">18.7%</span>
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