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
  Flag, 
  Eye, 
  MessageSquare,
  AlertTriangle,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  FileText,
  Users
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface ReportsManagementProps {
  userRole: string;
}

export function ReportsManagement({ userRole }: ReportsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const userReports = [
    {
      id: 1,
      reporterId: "sarah.j@email.com",
      reportedUser: "bad.user@email.com",
      reportedUserName: "BadUser123",
      type: "inappropriate_chat",
      category: "Harassment",
      description: "User was sending inappropriate messages in the chat room and using offensive language towards other learners.",
      chatLogs: [
        { timestamp: "2024-03-18 14:23", user: "BadUser123", message: "This is completely inappropriate content..." },
        { timestamp: "2024-03-18 14:24", user: "SarahJ", message: "Please stop, this is not appropriate." },
        { timestamp: "2024-03-18 14:25", user: "BadUser123", message: "More offensive content here..." }
      ],
      severity: "high",
      status: "pending",
      reportDate: "2024-03-18",
      lastAction: null
    },
    {
      id: 2,
      reporterId: "student1@email.com",
      reportedUser: "teacher.fake@email.com",
      reportedUserName: "FakeTeacher",
      type: "fake_credentials",
      category: "Fraud",
      description: "This teacher claims to have a PhD from Cambridge but I suspect the credentials are fake. The teaching quality is very poor.",
      evidence: ["credential_screenshot.png", "university_verification_failed.pdf"],
      severity: "high",
      status: "investigating",
      reportDate: "2024-03-17",
      lastAction: "Credentials sent for verification"
    },
    {
      id: 3,
      reporterId: "concerned.user@email.com",
      reportedUser: "spammer123@email.com",
      reportedUserName: "SpamBot",
      type: "spam",
      category: "Spam",
      description: "User is constantly posting promotional content and links to external websites in lesson comments.",
      severity: "medium",
      status: "resolved",
      reportDate: "2024-03-16",
      lastAction: "User warned and content removed"
    }
  ];

  const contentReports = [
    {
      id: 1,
      reporterId: "quality.checker@email.com",
      contentType: "lesson",
      contentTitle: "Advanced Grammar Rules",
      contentCreator: "questionable.teacher@email.com",
      type: "quality_issue",
      category: "Poor Quality",
      description: "Lesson contains multiple grammatical errors and outdated information. Not suitable for advanced learners.",
      severity: "medium",
      status: "pending",
      reportDate: "2024-03-18"
    },
    {
      id: 2,
      reporterId: "copyright.monitor@email.com",
      contentType: "marketplace_course",
      contentTitle: "IELTS Preparation Complete",
      contentCreator: "copycat.teacher@email.com",
      type: "copyright",
      category: "Copyright Violation",
      description: "Course appears to be directly copied from official IELTS preparation materials without permission.",
      severity: "high",
      status: "investigating",
      reportDate: "2024-03-17"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "investigating": return "bg-blue-100 text-blue-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "dismissed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "inappropriate_chat": return "bg-red-100 text-red-800";
      case "fake_credentials": return "bg-purple-100 text-purple-800";
      case "spam": return "bg-orange-100 text-orange-800";
      case "copyright": return "bg-blue-100 text-blue-800";
      case "quality_issue": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUserReports = userReports.filter(report => {
    const matchesSearch = report.reportedUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || report.status === selectedStatus;
    const matchesType = selectedType === "all" || report.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Reports Management</h1>
        <p className="text-muted-foreground">
          Handle user reports, content violations, and platform safety issues
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Flag className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{userReports.filter(r => r.status === 'pending').length}</p>
                <p className="text-sm text-muted-foreground">Pending Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{userReports.filter(r => r.severity === 'high').length}</p>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{userReports.filter(r => r.status === 'investigating').length}</p>
                <p className="text-sm text-muted-foreground">Under Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{userReports.filter(r => r.status === 'resolved').length}</p>
                <p className="text-sm text-muted-foreground">Resolved Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="user-reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="user-reports">User Reports</TabsTrigger>
          <TabsTrigger value="content-reports">Content Reports</TabsTrigger>
          <TabsTrigger value="automated-flags">Automated Flags</TabsTrigger>
        </TabsList>

        <TabsContent value="user-reports" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
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
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="inappropriate_chat">Inappropriate Chat</SelectItem>
                    <SelectItem value="fake_credentials">Fake Credentials</SelectItem>
                    <SelectItem value="spam">Spam</SelectItem>
                    <SelectItem value="harassment">Harassment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredUserReports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getTypeColor(report.type)}>
                          {report.type.replace('_', ' ')}
                        </Badge>
                        <Badge className={getSeverityColor(report.severity)}>
                          {report.severity} priority
                        </Badge>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">
                        Report against {report.reportedUserName}
                      </CardTitle>
                      <CardDescription>
                        Reported by {report.reporterId} on {report.reportDate}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          View Chat Logs
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="w-4 h-4 mr-2" />
                          Warn User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Ban className="w-4 h-4 mr-2" />
                          Suspend User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                  
                  {report.chatLogs && (
                    <div>
                      <h4 className="font-medium mb-2">Chat Evidence</h4>
                      <div className="bg-gray-50 p-3 rounded-lg space-y-2 max-h-48 overflow-y-auto">
                        {report.chatLogs.map((log, index) => (
                          <div key={index} className="text-sm">
                            <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                            <span className="font-medium ml-2">{log.user}:</span>
                            <span className="ml-1">{log.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {report.evidence && (
                    <div>
                      <h4 className="font-medium mb-2">Evidence Files</h4>
                      <div className="flex flex-wrap gap-2">
                        {report.evidence.map((file, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <FileText className="w-3 h-3 mr-1" />
                            {file}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {report.lastAction && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Last Action:</span>
                        <span className="text-sm">{report.lastAction}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark Resolved
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Investigate
                    </Button>
                    <Button size="sm" variant="destructive" className="flex-1">
                      <XCircle className="w-4 h-4 mr-1" />
                      Dismiss
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content-reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Violation Reports</CardTitle>
              <CardDescription>Reports about inappropriate or low-quality content</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contentReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{report.contentTitle}</p>
                          <p className="text-sm text-muted-foreground">{report.contentType}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(report.type)}>
                          {report.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.contentCreator}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm truncate">{report.description}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(report.severity)}>
                          {report.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.reportDate}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Review Content
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Contact Creator
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Ban className="w-4 h-4 mr-2" />
                              Remove Content
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

        <TabsContent value="automated-flags" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automated Content Flags</CardTitle>
              <CardDescription>Content automatically flagged by AI moderation systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <p className="text-muted-foreground">No automated flags at this time.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Content that triggers AI moderation will appear here for review.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}