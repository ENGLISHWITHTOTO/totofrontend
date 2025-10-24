import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar } from './ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Check, X, MessageSquare, Calendar as CalendarIcon, Clock, User, DollarSign } from 'lucide-react';

const mockApplications = [
  {
    id: 1,
    student: {
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      nationality: 'Spain',
      age: 24,
      photo: null
    },
    program: 'English Intensive Course',
    startDate: '2025-10-01',
    duration: '12 weeks',
    price: 2800,
    accommodation: 'University Residence Hall A',
    accommodationPrice: 180,
    appliedDate: '2025-09-15',
    status: 'pending',
    paymentStatus: 'pending',
    documents: ['passport', 'visa', 'medical']
  },
  {
    id: 2,
    student: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      nationality: 'USA',
      age: 28,
      photo: null
    },
    program: 'French Beginners',
    startDate: '2025-09-30',
    duration: '8 weeks',
    price: 1800,
    accommodation: 'Thompson Family',
    accommodationPrice: 200,
    appliedDate: '2025-09-10',
    status: 'accepted',
    paymentStatus: 'paid',
    documents: ['passport', 'visa']
  },
  {
    id: 3,
    student: {
      name: 'Yuki Tanaka',
      email: 'yuki.tanaka@email.com',
      nationality: 'Japan',
      age: 22,
      photo: null
    },
    program: 'English Intensive Course',
    startDate: '2025-10-15',
    duration: '12 weeks',
    price: 2800,
    accommodation: null,
    accommodationPrice: 0,
    appliedDate: '2025-09-20',
    status: 'review',
    paymentStatus: 'pending',
    documents: ['passport']
  }
];

const startDates = [
  { date: '2025-09-30', program: 'French Beginners', enrolled: 12, capacity: 25 },
  { date: '2025-10-01', program: 'English Intensive Course', enrolled: 18, capacity: 20 },
  { date: '2025-10-15', program: 'Japanese Business Language', enrolled: 8, capacity: 15 },
  { date: '2025-10-28', program: 'Arabic Elementary', enrolled: 5, capacity: 15 },
  { date: '2025-11-15', program: 'French Beginners', enrolled: 3, capacity: 25 }
];

export function BookingsApplications() {
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeTab, setActiveTab] = useState('applications');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = (applicationId: number, newStatus: string) => {
    setApplications(applications.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));
  };

  const filteredApplications = applications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  const ApplicationDetails = ({ application }: any) => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={application.student.photo || undefined} />
          <AvatarFallback>
            {application.student.name.split(' ').map((n: string) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-medium">{application.student.name}</h3>
          <p className="text-sm text-muted-foreground">{application.student.email}</p>
          <p className="text-sm text-muted-foreground">
            {application.student.nationality} • Age {application.student.age}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Program Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="font-medium">{application.program}</p>
              <p className="text-sm text-muted-foreground">Duration: {application.duration}</p>
              <p className="text-sm text-muted-foreground">Start Date: {new Date(application.startDate).toLocaleDateString()}</p>
              <p className="text-sm font-medium">Price: ${application.price}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Accommodation</CardTitle>
          </CardHeader>
          <CardContent>
            {application.accommodation ? (
              <div>
                <p className="font-medium">{application.accommodation}</p>
                <p className="text-sm font-medium">Price: ${application.accommodationPrice}/week</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No accommodation selected</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Documents Submitted</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {application.documents.map((doc: string, index: number) => (
              <Badge key={index} variant="secondary">{doc}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button 
          onClick={() => handleStatusUpdate(application.id, 'accepted')}
          className="bg-green-600 hover:bg-green-700"
        >
          <Check className="w-4 h-4 mr-2" />
          Accept Application
        </Button>
        <Button 
          variant="destructive"
          onClick={() => handleStatusUpdate(application.id, 'rejected')}
        >
          <X className="w-4 h-4 mr-2" />
          Reject Application
        </Button>
        <Button variant="outline">
          <MessageSquare className="w-4 h-4 mr-2" />
          Request More Info
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Bookings & Applications</h2>
          <p className="text-sm text-muted-foreground">Manage student applications and program enrollments</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => app.status === 'pending' || app.status === 'review').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => app.status === 'accepted').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${applications
                .filter(app => app.status === 'accepted')
                .reduce((acc, app) => acc + app.price + (app.accommodationPrice * 12), 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="calendar">Start Dates Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          <div className="flex gap-4 items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Accommodation</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={application.student.photo || undefined} />
                          <AvatarFallback>
                            {application.student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{application.student.name}</div>
                          <div className="text-sm text-muted-foreground">{application.student.nationality}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{application.program}</div>
                        <div className="text-sm text-muted-foreground">{application.duration}</div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(application.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>${application.price}</TableCell>
                    <TableCell>
                      {application.accommodation ? (
                        <div>
                          <div className="text-sm">{application.accommodation}</div>
                          <div className="text-xs text-muted-foreground">${application.accommodationPrice}/week</div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(application.appliedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(application.paymentStatus)}`}>
                        {application.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedApplication(application)}>
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Application Details</DialogTitle>
                            <DialogDescription>
                              Review the student's application and take appropriate action.
                            </DialogDescription>
                          </DialogHeader>
                          {selectedApplication && <ApplicationDetails application={selectedApplication} />}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Start Dates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {startDates.map((startDate, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{startDate.program}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(startDate.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{startDate.enrolled}/{startDate.capacity}</div>
                        <div className="text-sm text-muted-foreground">enrolled</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}