import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Edit, 
  DollarSign,
  Star,
  Clock,
  Users,
  TrendingUp,
  MessageSquare,
  AlertTriangle
} from "lucide-react";

interface MarketplaceManagementProps {
  userRole: string;
}

export function MarketplaceManagement({ userRole }: MarketplaceManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const pendingSubmissions = [
    {
      id: 1,
      title: "Advanced Spanish Conversation Techniques",
      teacher: "Maria Rodriguez",
      teacherAvatar: null,
      category: "Conversation Practice",
      difficulty: "Advanced",
      duration: "45 min",
      price: 29.99,
      submittedDate: "2024-03-18",
      description: "Master advanced conversation techniques with native Spanish speakers. Includes real-world scenarios and cultural context.",
      tags: ["Spanish", "Conversation", "Advanced", "Culture"],
      status: "pending"
    },
    {
      id: 2,
      title: "Business English Presentation Skills",
      teacher: "Dr. James Wilson",
      teacherAvatar: null,
      category: "Business English",
      difficulty: "Intermediate",
      duration: "60 min",
      price: 39.99,
      submittedDate: "2024-03-17",
      description: "Learn to deliver compelling business presentations in English. Covers structure, language, and delivery techniques.",
      tags: ["Business", "Presentations", "Professional"],
      status: "pending"
    },
    {
      id: 3,
      title: "IELTS Writing Masterclass",
      teacher: "Prof. Sarah Chen",
      teacherAvatar: null,
      category: "IELTS Preparation",
      difficulty: "Advanced",
      duration: "90 min",
      price: 49.99,
      submittedDate: "2024-03-16",
      description: "Comprehensive IELTS writing preparation covering both Task 1 and Task 2 with proven strategies.",
      tags: ["IELTS", "Writing", "Exam Prep"],
      status: "under_review"
    }
  ];

  const publishedCourses = [
    {
      id: 1,
      title: "Everyday English Conversations",
      teacher: "Emma Thompson",
      teacherAvatar: null,
      category: "Conversation Practice",
      difficulty: "Beginner",
      price: 19.99,
      publishedDate: "2024-02-15",
      sales: 245,
      revenue: 4899.55,
      rating: 4.8,
      reviews: 67,
      status: "published"
    },
    {
      id: 2,
      title: "Grammar Essentials for Beginners",
      teacher: "Michael Foster",
      teacherAvatar: null,
      category: "Grammar",
      difficulty: "Beginner",
      price: 24.99,
      publishedDate: "2024-01-28",
      sales: 189,
      revenue: 4723.11,
      rating: 4.6,
      reviews: 42,
      status: "published"
    }
  ];

  const topTeachers = [
    {
      name: "Emma Thompson",
      courses: 5,
      totalSales: 1247,
      totalRevenue: 24889.35,
      avgRating: 4.8,
      joinDate: "2023-08-15"
    },
    {
      name: "Dr. James Wilson",
      courses: 3,
      totalSales: 892,
      totalRevenue: 19847.22,
      avgRating: 4.7,
      joinDate: "2023-10-03"
    },
    {
      name: "Maria Rodriguez",
      courses: 4,
      totalSales: 567,
      totalRevenue: 15678.45,
      avgRating: 4.9,
      joinDate: "2023-12-10"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "under_review": return "bg-blue-100 text-blue-800";
      case "published": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredSubmissions = pendingSubmissions.filter(submission => {
    const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || submission.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Marketplace Management</h1>
        <p className="text-muted-foreground">
          Review and moderate teacher-submitted courses and manage marketplace operations
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{pendingSubmissions.length}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">127</p>
                <p className="text-sm text-muted-foreground">Published Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">$89,247</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">67</p>
                <p className="text-sm text-muted-foreground">Active Teachers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="published">Published Courses</TabsTrigger>
          <TabsTrigger value="teachers">Top Teachers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search submissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pending Submissions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSubmissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{submission.title}</CardTitle>
                      <CardDescription className="mt-2">
                        by {submission.teacher} • Submitted {submission.submittedDate}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(submission.status)}>
                      {submission.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {submission.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {submission.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Category:</span>
                      <p className="font-medium">{submission.category}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Difficulty:</span>
                      <Badge className={getDifficultyColor(submission.difficulty)} size="sm">
                        {submission.difficulty}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <p className="font-medium">{submission.duration}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Price:</span>
                      <p className="font-medium">${submission.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" className="flex-1">
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Published Marketplace Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Published</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {publishedCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {course.category}
                            </Badge>
                            <Badge className={getDifficultyColor(course.difficulty)} size="sm">
                              {course.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={course.teacherAvatar} />
                            <AvatarFallback className="text-xs">
                              {course.teacher.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{course.teacher}</span>
                        </div>
                      </TableCell>
                      <TableCell>${course.price}</TableCell>
                      <TableCell>{course.sales}</TableCell>
                      <TableCell>${course.revenue.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{course.rating}</span>
                          <span className="text-sm text-muted-foreground">({course.reviews})</span>
                        </div>
                      </TableCell>
                      <TableCell>{course.publishedDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Teachers</CardTitle>
              <CardDescription>Teachers ranked by sales and ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTeachers.map((teacher, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                        #{index + 1}
                      </div>
                      <Avatar>
                        <AvatarFallback>
                          {teacher.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Member since {teacher.joinDate}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-8 text-center">
                      <div>
                        <p className="text-2xl font-bold">{teacher.courses}</p>
                        <p className="text-xs text-muted-foreground">Courses</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{teacher.totalSales}</p>
                        <p className="text-xs text-muted-foreground">Sales</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">${teacher.totalRevenue.toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{teacher.avgRating}</p>
                        <p className="text-xs text-muted-foreground">Avg Rating</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Marketplace Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Courses</span>
                    <span className="font-medium">127</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Active Teachers</span>
                    <span className="font-medium">67</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg Course Price</span>
                    <span className="font-medium">$32.45</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Platform Commission</span>
                    <span className="font-medium">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review Queue Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pending Submissions</span>
                    <span className="font-medium text-yellow-600">{pendingSubmissions.filter(s => s.status === 'pending').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Under Review</span>
                    <span className="font-medium text-blue-600">{pendingSubmissions.filter(s => s.status === 'under_review').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg Review Time</span>
                    <span className="font-medium">2.3 days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Approval Rate</span>
                    <span className="font-medium text-green-600">87%</span>
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