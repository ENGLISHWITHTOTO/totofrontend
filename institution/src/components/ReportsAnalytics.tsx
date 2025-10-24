import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Globe, GraduationCap, Download, Calendar } from 'lucide-react';

const enrollmentTrends = [
  { month: 'Jan', English: 45, French: 28, Japanese: 15, Arabic: 12, Spanish: 8 },
  { month: 'Feb', English: 52, French: 32, Japanese: 18, Arabic: 15, Spanish: 12 },
  { month: 'Mar', English: 48, French: 29, Japanese: 22, Arabic: 18, Spanish: 15 },
  { month: 'Apr', English: 58, French: 35, Japanese: 25, Arabic: 20, Spanish: 18 },
  { month: 'May', English: 61, French: 38, Japanese: 28, Arabic: 22, Spanish: 20 },
  { month: 'Jun', English: 55, French: 42, Japanese: 30, Arabic: 25, Spanish: 22 },
  { month: 'Jul', English: 72, French: 45, Japanese: 35, Arabic: 28, Spanish: 25 },
  { month: 'Aug', English: 78, French: 48, Japanese: 38, Arabic: 30, Spanish: 28 },
  { month: 'Sep', English: 84, French: 52, Japanese: 42, Arabic: 35, Spanish: 32 }
];

const studentDemographics = {
  age: [
    { range: '18-22', count: 156, percentage: 32 },
    { range: '23-27', count: 189, percentage: 39 },
    { range: '28-32', count: 98, percentage: 20 },
    { range: '33-37', count: 34, percentage: 7 },
    { range: '38+', count: 12, percentage: 2 }
  ],
  nationality: [
    { country: 'Spain', count: 89, color: '#0088FE' },
    { country: 'USA', count: 67, color: '#00C49F' },
    { country: 'Japan', count: 54, color: '#FFBB28' },
    { country: 'Germany', count: 43, color: '#FF8042' },
    { country: 'France', count: 38, color: '#8884D8' },
    { country: 'Others', count: 198, color: '#82CA9D' }
  ]
};

const programPopularity = [
  { program: 'English Intensive', enrolled: 184, capacity: 200, occupancy: 92, revenue: 156000 },
  { program: 'French Beginners', enrolled: 148, capacity: 175, occupancy: 85, revenue: 98000 },
  { program: 'Japanese Business', enrolled: 95, capacity: 120, occupancy: 79, revenue: 125000 },
  { program: 'Arabic Elementary', enrolled: 67, capacity: 100, occupancy: 67, revenue: 67000 },
  { program: 'Spanish Conversation', enrolled: 45, capacity: 80, occupancy: 56, revenue: 54000 }
];

const teacherWorkload = [
  { teacher: 'Sarah Johnson', weeklyHours: 28, students: 67, programs: 3, rating: 4.8 },
  { teacher: 'Pierre Dubois', weeklyHours: 32, students: 89, programs: 2, rating: 4.6 },
  { teacher: 'Takeshi Yamamoto', weeklyHours: 26, students: 43, programs: 2, rating: 4.9 },
  { teacher: 'Maria Rodriguez', weeklyHours: 24, students: 52, programs: 2, rating: 4.7 },
  { teacher: 'Ahmed Al-Hassan', weeklyHours: 20, students: 35, programs: 1, rating: 4.5 }
];

const accommodationOccupancy = [
  { type: 'University Residence', total: 48, occupied: 42, rate: 88 },
  { type: 'Homestay', total: 32, occupied: 28, rate: 88 },
  { type: 'Student Apartments', total: 24, occupied: 18, rate: 75 },
  { type: 'Shared Housing', total: 16, occupied: 12, rate: 75 }
];

export function ReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedMetric, setSelectedMetric] = useState('enrollment');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Reports & Analytics</h2>
          <p className="text-sm text-muted-foreground">Comprehensive insights into your institution's performance</p>
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
            Export All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18%</span> from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Occupancy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3</span> new countries
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="enrollment" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
        </TabsList>

        <TabsContent value="enrollment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Trends by Language</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={enrollmentTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="English" stackId="1" stroke="#0088FE" fill="#0088FE" />
                  <Area type="monotone" dataKey="French" stackId="1" stroke="#00C49F" fill="#00C49F" />
                  <Area type="monotone" dataKey="Japanese" stackId="1" stroke="#FFBB28" fill="#FFBB28" />
                  <Area type="monotone" dataKey="Arabic" stackId="1" stroke="#FF8042" fill="#FF8042" />
                  <Area type="monotone" dataKey="Spanish" stackId="1" stroke="#8884D8" fill="#8884D8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Age Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentDemographics.age.map((age, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{age.range} years</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${age.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">{age.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Nationality Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={studentDemographics.nationality}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ country, count }) => `${country} (${count})`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {studentDemographics.nationality.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Program Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {programPopularity.map((program, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{program.program}</h4>
                      <Badge variant={program.occupancy >= 80 ? 'default' : 'secondary'}>
                        {program.occupancy}% occupied
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Enrollment</p>
                        <p className="font-medium">{program.enrolled}/{program.capacity}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Revenue</p>
                        <p className="font-medium">${program.revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Occupancy Rate</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${program.occupancy}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Program Revenue Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={programPopularity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="program" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Workload Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teacherWorkload.map((teacher, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{teacher.teacher}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{teacher.rating} ⭐</Badge>
                        <Badge variant={teacher.weeklyHours > 30 ? 'destructive' : 'default'}>
                          {teacher.weeklyHours}h/week
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Students</p>
                        <p className="font-medium">{teacher.students}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Programs</p>
                        <p className="font-medium">{teacher.programs}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Weekly Hours</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${teacher.weeklyHours > 30 ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${(teacher.weeklyHours / 40) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accommodation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Accommodation Occupancy Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accommodationOccupancy.map((acc, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{acc.type}</h4>
                      <Badge variant={acc.rate >= 80 ? 'default' : 'secondary'}>
                        {acc.rate}% occupied
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>{acc.occupied}/{acc.total} rooms occupied</span>
                      <span>{acc.total - acc.occupied} available</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${acc.rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accommodation Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={accommodationOccupancy.map(acc => ({
                  ...acc,
                  revenue: acc.occupied * 200 * 4 // Assuming avg $200/week * 4 weeks
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, 'Monthly Revenue']} />
                  <Bar dataKey="revenue" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}