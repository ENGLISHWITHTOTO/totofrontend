import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Bell, Plus, Upload, Calendar, Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react';

const kpiData = [
  {
    title: 'Total Students',
    value: '1,247',
    change: '+12%',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    title: 'Active Programs',
    value: '23',
    change: '+3',
    icon: BookOpen,
    color: 'text-green-600'
  },
  {
    title: 'Total Earnings',
    value: '$84,329',
    change: '+18%',
    icon: DollarSign,
    color: 'text-purple-600'
  },
  {
    title: 'Teachers',
    value: '47',
    change: '+5',
    icon: TrendingUp,
    color: 'text-orange-600'
  }
];

const notifications = [
  {
    id: 1,
    type: 'application',
    title: 'New Application',
    message: 'Maria Garcia applied for Spanish Intensive Course',
    time: '5 min ago',
    status: 'new'
  },
  {
    id: 2,
    type: 'verification',
    title: 'Pending Verification',
    message: 'John Smith submitted verification documents',
    time: '2 hours ago',
    status: 'pending'
  },
  {
    id: 3,
    type: 'inquiry',
    title: 'Student Inquiry',
    message: 'Sarah Johnson asked about French program schedule',
    time: '1 day ago',
    status: 'unread'
  },
  {
    id: 4,
    type: 'start_date',
    title: 'Program Starting Soon',
    message: 'Japanese Beginner Course starts in 3 days',
    time: '2 days ago',
    status: 'info'
  }
];

const upcomingStartDates = [
  {
    program: 'Japanese Beginner',
    language: 'Japanese',
    startDate: '2025-09-26',
    enrolled: 15,
    capacity: 20
  },
  {
    program: 'French Intensive',
    language: 'French',
    startDate: '2025-09-30',
    enrolled: 22,
    capacity: 25
  },
  {
    program: 'Arabic Elementary',
    language: 'Arabic',
    startDate: '2025-10-07',
    enrolled: 8,
    capacity: 15
  }
];

export function Dashboard() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{kpi.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 md:space-y-3">
            <Button className="w-full justify-start h-auto py-2.5" variant="outline">
              <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">Add New Program</span>
            </Button>
            <Button className="w-full justify-start h-auto py-2.5" variant="outline">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">Update Availability</span>
            </Button>
            <Button className="w-full justify-start h-auto py-2.5" variant="outline">
              <Upload className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">Upload Video</span>
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <CardTitle>Notifications</CardTitle>
            <Bell className="w-4 h-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {notifications.slice(0, 4).map((notification) => (
                <div key={notification.id} className="flex items-start space-x-2 md:space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{notification.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                  {notification.status === 'new' && (
                    <Badge variant="destructive" className="text-xs flex-shrink-0">New</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Start Dates */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Upcoming Start Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {upcomingStartDates.map((program, index) => (
                <div key={index} className="border-l-4 border-primary pl-2 md:pl-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{program.program}</p>
                      <p className="text-xs text-muted-foreground">{program.language}</p>
                    </div>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {program.enrolled}/{program.capacity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Starts: {new Date(program.startDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}