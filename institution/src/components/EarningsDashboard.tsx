import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, CreditCard, Download, Calendar } from 'lucide-react';

const monthlyEarnings = [
  { month: 'Jan', tuition: 45000, accommodation: 18000, total: 63000 },
  { month: 'Feb', tuition: 52000, accommodation: 21000, total: 73000 },
  { month: 'Mar', tuition: 48000, accommodation: 19000, total: 67000 },
  { month: 'Apr', tuition: 58000, accommodation: 23000, total: 81000 },
  { month: 'May', tuition: 61000, accommodation: 24000, total: 85000 },
  { month: 'Jun', tuition: 55000, accommodation: 22000, total: 77000 },
  { month: 'Jul', tuition: 72000, accommodation: 29000, total: 101000 },
  { month: 'Aug', tuition: 78000, accommodation: 31000, total: 109000 },
  { month: 'Sep', tuition: 84000, accommodation: 33000, total: 117000 }
];

const programEarnings = [
  { name: 'English Intensive', earnings: 156000, color: '#0088FE' },
  { name: 'French Beginners', earnings: 98000, color: '#00C49F' },
  { name: 'Japanese Business', earnings: 125000, color: '#FFBB28' },
  { name: 'Arabic Elementary', earnings: 67000, color: '#FF8042' },
  { name: 'Spanish Conversation', earnings: 54000, color: '#8884D8' }
];

const mockTransactions = [
  {
    id: 1,
    student: 'Maria Garcia',
    program: 'English Intensive Course',
    type: 'tuition',
    amount: 2800,
    date: '2025-09-15',
    status: 'completed',
    method: 'Credit Card'
  },
  {
    id: 2,
    student: 'John Smith',
    program: 'French Beginners',
    type: 'tuition',
    amount: 1800,
    date: '2025-09-10',
    status: 'completed',
    method: 'Bank Transfer'
  },
  {
    id: 3,
    student: 'Yuki Tanaka',
    program: 'Accommodation',
    type: 'accommodation',
    amount: 720,
    date: '2025-09-20',
    status: 'pending',
    method: 'Credit Card'
  },
  {
    id: 4,
    student: 'Ahmed Hassan',
    program: 'French Beginners',
    type: 'tuition',
    amount: 1800,
    date: '2025-09-18',
    status: 'completed',
    method: 'PayPal'
  },
  {
    id: 5,
    student: 'Sophie Laurent',
    program: 'Japanese Business Language',
    type: 'tuition',
    amount: 3500,
    date: '2025-09-12',
    status: 'failed',
    method: 'Credit Card'
  }
];

export function EarningsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [transactions, setTransactions] = useState(mockTransactions);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalEarnings = monthlyEarnings.reduce((acc, month) => acc + month.total, 0);
  const tuitionRevenue = monthlyEarnings.reduce((acc, month) => acc + month.tuition, 0);
  const accommodationRevenue = monthlyEarnings.reduce((acc, month) => acc + month.accommodation, 0);
  const pendingPayments = transactions.filter(t => t.status === 'pending').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Earnings Dashboard</h2>
          <p className="text-sm text-muted-foreground">Track revenue and payment analytics</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tuition Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${tuitionRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accommodation</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${accommodationRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {transactions.filter(t => t.status === 'pending').length} transactions
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyEarnings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, '']} />
                    <Line type="monotone" dataKey="tuition" stroke="#0088FE" strokeWidth={2} name="Tuition" />
                    <Line type="monotone" dataKey="accommodation" stroke="#00C49F" strokeWidth={2} name="Accommodation" />
                    <Line type="monotone" dataKey="total" stroke="#FF8042" strokeWidth={2} name="Total" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Program Earnings Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Earnings by Program</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={programEarnings}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="earnings"
                    >
                      {programEarnings.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, 'Earnings']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, '']} />
                  <Bar dataKey="tuition" fill="#0088FE" name="Tuition" />
                  <Bar dataKey="accommodation" fill="#00C49F" name="Accommodation" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Program/Service</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.student}</TableCell>
                      <TableCell>{transaction.program}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === 'tuition' ? 'default' : 'secondary'}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.method}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Monthly Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Detailed monthly earnings breakdown with student enrollment data.
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quarterly Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Quarterly performance analysis with growth metrics and trends.
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Annual Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive annual financial report with tax documentation.
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payout Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Available Balance</p>
                    <p className="text-2xl font-bold">${(totalEarnings * 0.15).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Last payout: August 31, 2025</p>
                  </div>
                  <Button>Request Payout</Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>• Minimum payout amount: $500</p>
                  <p>• Processing time: 3-5 business days</p>
                  <p>• Transaction fee: 2.5% per payout</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}