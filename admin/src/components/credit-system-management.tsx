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
import { Progress } from "./ui/progress";
import { 
  Search, 
  Plus, 
  Edit, 
  Coins, 
  TrendingUp,
  Users,
  Zap,
  Gift,
  CreditCard,
  BarChart3,
  Settings,
  MoreHorizontal
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface CreditSystemManagementProps {
  userRole: string;
}

export function CreditSystemManagement({ userRole }: CreditSystemManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatePackageOpen, setIsCreatePackageOpen] = useState(false);
  const [isAdjustBalanceOpen, setIsAdjustBalanceOpen] = useState(false);

  const creditPackages = [
    {
      id: 1,
      name: "Starter Pack",
      credits: 20,
      price: 4.99,
      discount: 0,
      popular: false,
      sales: 1247,
      revenue: 6212.53,
      status: "active"
    },
    {
      id: 2,
      name: "Value Pack",
      credits: 50,
      price: 9.99,
      discount: 20,
      popular: true,
      sales: 2341,
      revenue: 23396.59,
      status: "active"
    },
    {
      id: 3,
      name: "Power Pack",
      credits: 100,
      price: 17.99,
      discount: 28,
      popular: false,
      sales: 892,
      revenue: 16049.08,
      status: "active"
    },
    {
      id: 4,
      name: "Ultimate Pack",
      credits: 250,
      price: 39.99,
      discount: 36,
      popular: false,
      sales: 234,
      revenue: 9357.66,
      status: "active"
    }
  ];

  const aiUsageCosts = [
    {
      feature: "Grammar Check",
      costPerUse: 1,
      dailyUsage: 3247,
      description: "Real-time grammar correction and suggestions"
    },
    {
      feature: "Essay Evaluation",
      costPerUse: 3,
      dailyUsage: 892,
      description: "Comprehensive essay analysis and scoring"
    },
    {
      feature: "Speaking Practice",
      costPerUse: 2,
      dailyUsage: 1456,
      description: "AI-powered pronunciation feedback"
    },
    {
      feature: "Conversation Simulation",
      costPerUse: 5,
      dailyUsage: 456,
      description: "Interactive AI conversation practice"
    },
    {
      feature: "IELTS Mock Test",
      costPerUse: 10,
      dailyUsage: 234,
      description: "Full IELTS practice test with detailed feedback"
    }
  ];

  const userBalances = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      balance: 23,
      totalPurchased: 150,
      totalSpent: 127,
      lastPurchase: "2024-03-15",
      lastActivity: "2 hours ago",
      avatar: null
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@email.com",
      balance: 78,
      totalPurchased: 200,
      totalSpent: 122,
      lastPurchase: "2024-03-10",
      lastActivity: "1 day ago",
      avatar: null
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      email: "emma.r@email.com",
      balance: 5,
      totalPurchased: 50,
      totalSpent: 45,
      lastPurchase: "2024-03-08",
      lastActivity: "3 days ago",
      avatar: null
    },
    {
      id: 4,
      name: "Alex Thompson",
      email: "alex.t@email.com",
      balance: 156,
      totalPurchased: 300,
      totalSpent: 144,
      lastPurchase: "2024-03-12",
      lastActivity: "5 hours ago",
      avatar: null
    }
  ];

  const creditTransactions = [
    {
      id: 1,
      user: "Sarah Johnson",
      type: "purchase",
      amount: 50,
      cost: 9.99,
      description: "Value Pack purchase",
      date: "2024-03-15",
      status: "completed"
    },
    {
      id: 2,
      user: "Michael Chen",
      type: "usage",
      amount: -3,
      cost: 0,
      description: "Essay Evaluation",
      date: "2024-03-15",
      status: "completed"
    },
    {
      id: 3,
      user: "Emma Rodriguez",
      type: "admin_adjustment",
      amount: 10,
      cost: 0,
      description: "Compensation for technical issue",
      date: "2024-03-14",
      status: "completed"
    },
    {
      id: 4,
      user: "Alex Thompson",
      type: "usage",
      amount: -5,
      cost: 0,
      description: "Conversation Simulation",
      date: "2024-03-14",
      status: "completed"
    }
  ];

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "purchase": return "bg-green-100 text-green-800";
      case "usage": return "bg-red-100 text-red-800";
      case "admin_adjustment": return "bg-blue-100 text-blue-800";
      case "refund": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUsers = userBalances.filter(user => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalCreditsIssued = creditPackages.reduce((sum, pack) => sum + (pack.credits * pack.sales), 0);
  const totalRevenue = creditPackages.reduce((sum, pack) => sum + pack.revenue, 0);
  const totalDailyUsage = aiUsageCosts.reduce((sum, feature) => sum + feature.dailyUsage, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Credit System Management</h1>
          <p className="text-muted-foreground">
            Manage credit packages, AI usage costs, and user balances
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isCreatePackageOpen} onOpenChange={setIsCreatePackageOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Package
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Credit Package</DialogTitle>
                <DialogDescription>
                  Add a new credit package for users to purchase
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="package-name">Package Name</Label>
                  <Input id="package-name" placeholder="e.g., Mega Pack" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="package-credits">Credits</Label>
                    <Input id="package-credits" type="number" placeholder="500" />
                  </div>
                  <div>
                    <Label htmlFor="package-price">Price ($)</Label>
                    <Input id="package-price" type="number" step="0.01" placeholder="49.99" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="package-discount">Discount (%)</Label>
                  <Input id="package-discount" type="number" placeholder="40" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreatePackageOpen(false)}>
                    Cancel
                  </Button>
                  <Button>Create Package</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAdjustBalanceOpen} onOpenChange={setIsAdjustBalanceOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Gift className="w-4 h-4 mr-2" />
                Adjust Balance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adjust User Credit Balance</DialogTitle>
                <DialogDescription>
                  Add or remove credits from a user's account
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="user-email">User Email</Label>
                  <Input id="user-email" placeholder="user@example.com" />
                </div>
                <div>
                  <Label htmlFor="credit-adjustment">Credit Amount</Label>
                  <Input id="credit-adjustment" type="number" placeholder="10" />
                </div>
                <div>
                  <Label htmlFor="adjustment-reason">Reason</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="refund">Refund</SelectItem>
                      <SelectItem value="compensation">Compensation</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                      <SelectItem value="correction">Balance Correction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAdjustBalanceOpen(false)}>
                    Cancel
                  </Button>
                  <Button>Apply Adjustment</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{totalCreditsIssued.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Credits Issued</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Credit Sales Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalDailyUsage.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Daily AI Usage</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">3,247</p>
                <p className="text-sm text-muted-foreground">Active Credit Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="packages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="packages">Credit Packages</TabsTrigger>
          <TabsTrigger value="usage-costs">AI Usage Costs</TabsTrigger>
          <TabsTrigger value="balances">User Balances</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {creditPackages.map((package_) => (
              <Card key={package_.id} className={`relative ${package_.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {package_.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{package_.name}</span>
                    <Badge variant="outline">{package_.status}</Badge>
                  </CardTitle>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">
                      {package_.credits}
                    </div>
                    <div className="text-sm text-muted-foreground">credits</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">${package_.price}</div>
                    {package_.discount > 0 && (
                      <div className="text-sm text-green-600">
                        {package_.discount}% discount
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Sales</span>
                      <span className="font-medium">{package_.sales.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue</span>
                      <span className="font-medium">${package_.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Credits per $</span>
                      <span className="font-medium">{(package_.credits / package_.price).toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usage-costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Feature Usage Costs</CardTitle>
              <CardDescription>
                Configure how many credits each AI feature consumes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Cost (Credits)</TableHead>
                    <TableHead>Daily Usage</TableHead>
                    <TableHead>Daily Credits Consumed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aiUsageCosts.map((feature, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{feature.feature}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-bold">
                          {feature.costPerUse}
                        </Badge>
                      </TableCell>
                      <TableCell>{feature.dailyUsage.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {(feature.dailyUsage * feature.costPerUse).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balances" className="space-y-4">
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* User Balances */}
          <Card>
            <CardHeader>
              <CardTitle>User Credit Balances</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Current Balance</TableHead>
                    <TableHead>Total Purchased</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Last Purchase</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Coins className="w-4 h-4 text-yellow-600" />
                          <span className="font-bold text-lg">{user.balance}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.totalPurchased}</TableCell>
                      <TableCell>{user.totalSpent}</TableCell>
                      <TableCell>{user.lastPurchase}</TableCell>
                      <TableCell>{user.lastActivity}</TableCell>
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
                              <Gift className="w-4 h-4 mr-2" />
                              Add Credits
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="w-4 h-4 mr-2" />
                              View Usage History
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Coins className="w-4 h-4 mr-2" />
                              Deduct Credits
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
              <CardTitle>Credit Transactions</CardTitle>
              <CardDescription>All credit purchases, usage, and adjustments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creditTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.user}</TableCell>
                      <TableCell>
                        <Badge className={getTransactionTypeColor(transaction.type)}>
                          {transaction.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Coins className="w-4 h-4 text-yellow-600" />
                          <span className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.cost > 0 ? `$${transaction.cost}` : '-'}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}