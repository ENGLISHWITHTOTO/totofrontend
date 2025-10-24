import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Search, MessageSquare, User, GraduationCap, Calendar, CheckCircle } from 'lucide-react';

const mockStudents = [
  {
    id: 1,
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    nationality: 'Spain',
    age: 24,
    program: 'English Intensive Course',
    startDate: '2025-08-15',
    endDate: '2025-11-07',
    accommodation: 'University Residence Hall A',
    progress: 75,
    attendance: 92,
    status: 'active',
    photo: null
  },
  {
    id: 2,
    name: 'John Smith',
    email: 'john.smith@email.com',
    nationality: 'USA',
    age: 28,
    program: 'French Beginners',
    startDate: '2025-07-01',
    endDate: '2025-08-26',
    accommodation: 'Thompson Family',
    progress: 100,
    attendance: 98,
    status: 'completed',
    photo: null
  },
  {
    id: 3,
    name: 'Yuki Tanaka',
    email: 'yuki.tanaka@email.com',
    nationality: 'Japan',
    age: 22,
    program: 'English Intensive Course',
    startDate: '2025-09-01',
    endDate: '2025-11-24',
    accommodation: null,
    progress: 25,
    attendance: 88,
    status: 'active',
    photo: null
  },
  {
    id: 4,
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    nationality: 'Egypt',
    age: 26,
    program: 'French Beginners',
    startDate: '2025-09-15',
    endDate: '2025-11-10',
    accommodation: 'International Student House',
    progress: 45,
    attendance: 85,
    status: 'active',
    photo: null
  },
  {
    id: 5,
    name: 'Sophie Laurent',
    email: 'sophie.laurent@email.com',
    nationality: 'France',
    age: 23,
    program: 'Japanese Business Language',
    startDate: '2025-06-01',
    endDate: '2025-09-22',
    accommodation: 'Johnson Homestay',
    progress: 100,
    attendance: 95,
    status: 'completed',
    photo: null
  }
];

export function StudentsManagement() {
  const [students, setStudents] = useState(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'withdrawn':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return 'text-green-600';
    if (attendance >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.program.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && student.status === activeTab;
  });

  const StudentDetails = ({ student }: any) => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={student.photo || undefined} />
          <AvatarFallback>
            {student.name.split(' ').map((n: string) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-medium">{student.name}</h3>
          <p className="text-sm text-muted-foreground">{student.email}</p>
          <p className="text-sm text-muted-foreground">
            {student.nationality} • Age {student.age}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Program Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="font-medium">{student.program}</p>
              <p className="text-sm text-muted-foreground">
                Start: {new Date(student.startDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                End: {new Date(student.endDate).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Accommodation</CardTitle>
          </CardHeader>
          <CardContent>
            {student.accommodation ? (
              <p className="font-medium">{student.accommodation}</p>
            ) : (
              <p className="text-sm text-muted-foreground">No accommodation</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Course Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Progress</span>
                <span>{student.progress}%</span>
              </div>
              <Progress value={student.progress} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Attendance Rate</span>
                <span className={getAttendanceColor(student.attendance)}>
                  {student.attendance}%
                </span>
              </div>
              <Progress value={student.attendance} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button>
          <MessageSquare className="w-4 h-4 mr-2" />
          Send Message
        </Button>
        <Button variant="outline">
          View Full Profile
        </Button>
        <Button variant="outline">
          Mark Attendance
        </Button>
      </div>
    </div>
  );

  const activeStudents = students.filter(s => s.status === 'active').length;
  const completedStudents = students.filter(s => s.status === 'completed').length;
  const averageAttendance = Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length);
  const averageProgress = Math.round(students.filter(s => s.status === 'active').reduce((acc, s) => acc + s.progress, 0) / activeStudents);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Students Management</h2>
          <p className="text-sm text-muted-foreground">Monitor student progress and manage enrollments</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedStudents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageAttendance}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Students</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="withdrawn">Withdrawn</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Accommodation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={student.photo || undefined} />
                          <AvatarFallback>
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.nationality}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{student.program}</div>
                    </TableCell>
                    <TableCell>{new Date(student.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={student.progress} className="w-16 h-2" />
                        <span className="text-sm">{student.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={getAttendanceColor(student.attendance)}>
                        {student.attendance}%
                      </span>
                    </TableCell>
                    <TableCell>
                      {student.accommodation ? (
                        <span className="text-sm">{student.accommodation}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedStudent(student)}>
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Student Details</DialogTitle>
                            <DialogDescription>
                              View detailed information about the student's progress and status.
                            </DialogDescription>
                          </DialogHeader>
                          {selectedStudent && <StudentDetails student={selectedStudent} />}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}