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
  Filter, 
  Building, 
  MapPin, 
  Users,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
  MoreHorizontal
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface InstitutionManagementProps {
  userRole: string;
}

export function InstitutionManagement({ userRole }: InstitutionManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const institutions = [
    {
      id: 1,
      name: "Cambridge English Institute",
      email: "admin@cambridge-inst.edu",
      country: "United Kingdom",
      city: "Cambridge",
      languages: ["English", "French"],
      status: "verified",
      verificationDate: "2023-08-15",
      programs: 12,
      students: 2847,
      teachers: 45,
      revenue: 284750,
      contactPerson: "Dr. Sarah Wilson",
      phone: "+44 1223 123456",
      website: "https://cambridge-inst.edu",
      facilities: ["Library", "Computer Lab", "Cafeteria", "Accommodation"],
      accreditation: "British Council Accredited"
    },
    {
      id: 2,
      name: "Tokyo Language Academy",
      email: "contact@tokyo-lang.jp",
      country: "Japan",
      city: "Tokyo",
      languages: ["Japanese", "English"],
      status: "pending",
      verificationDate: null,
      programs: 8,
      students: 1567,
      teachers: 23,
      revenue: 156780,
      contactPerson: "Hiroshi Tanaka",
      phone: "+81 3 1234 5678",
      website: "https://tokyo-lang.jp",
      facilities: ["Multimedia Room", "Student Lounge"],
      accreditation: "JALT Certified"
    },
    {
      id: 3,
      name: "Berlin Sprachschule",
      email: "info@berlin-sprach.de",
      country: "Germany",
      city: "Berlin",
      languages: ["German", "English", "Spanish"],
      status: "verified",
      verificationDate: "2023-11-22",
      programs: 15,
      students: 3421,
      teachers: 67,
      revenue: 421350,
      contactPerson: "Klaus Mueller",
      phone: "+49 30 123456",
      website: "https://berlin-sprach.de",
      facilities: ["Library", "Computer Lab", "Student Restaurant", "Gym"],
      accreditation: "EAQUALS Member"
    },
    {
      id: 4,
      name: "Sydney English College",
      email: "admin@sydney-english.au",
      country: "Australia",
      city: "Sydney",
      languages: ["English"],
      status: "suspended",
      verificationDate: "2023-05-10",
      programs: 6,
      students: 892,
      teachers: 18,
      revenue: 89200,
      contactPerson: "Emma Johnson",
      phone: "+61 2 9876 5432",
      website: "https://sydney-english.au",
      facilities: ["Computer Lab", "Student Lounge"],
      accreditation: "NEAS Accredited"
    }
  ];

  const programs = [
    {
      id: 1,
      institutionId: 1,
      title: "Intensive English Program",
      language: "English",
      level: "All Levels",
      duration: "12 weeks",
      hoursPerWeek: 20,
      price: 2400,
      startDates: ["2024-04-01", "2024-07-01", "2024-10-01"],
      maxStudents: 15,
      currentEnrollments: 12,
      includes: ["Course Materials", "Certificate"],
      description: "Comprehensive English program covering all four skills"
    },
    {
      id: 2,
      institutionId: 1,
      title: "IELTS Preparation Course",
      language: "English",
      level: "Intermediate+",
      duration: "8 weeks",
      hoursPerWeek: 15,
      price: 1800,
      startDates: ["2024-03-15", "2024-06-15", "2024-09-15"],
      maxStudents: 12,
      currentEnrollments: 9,
      includes: ["Mock Tests", "Individual Feedback", "Course Materials"],
      description: "Specialized preparation for IELTS Academic and General Training"
    },
    {
      id: 3,
      institutionId: 2,
      title: "Business Japanese",
      language: "Japanese",
      level: "Intermediate",
      duration: "16 weeks",
      hoursPerWeek: 10,
      price: 3200,
      startDates: ["2024-04-08", "2024-08-05"],
      maxStudents: 10,
      currentEnrollments: 7,
      includes: ["Business Etiquette Training", "Internship Opportunities"],
      description: "Professional Japanese for business environments"
    }
  ];

  const applications = [
    {
      id: 1,
      institutionName: "Madrid Language Center",
      contactPerson: "Carlos Rodriguez",
      email: "carlos@madrid-lang.es",
      country: "Spain",
      submittedDate: "2024-03-15",
      documents: ["Business License", "Accreditation Certificate", "Facility Photos"],
      status: "pending_review"
    },
    {
      id: 2,
      institutionName: "Toronto English Academy",
      contactPerson: "Jennifer Smith",
      email: "jennifer@toronto-eng.ca",
      country: "Canada",
      submittedDate: "2024-03-12",
      documents: ["Business Registration", "Teacher Certifications", "Insurance Documents"],
      status: "under_verification"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "suspended": return "bg-red-100 text-red-800";
      case "pending_review": return "bg-blue-100 text-blue-800";
      case "under_verification": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredInstitutions = institutions.filter(institution => {
    const matchesSearch = institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institution.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institution.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || institution.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Institution Management</h1>
          <p className="text-muted-foreground">
            Manage educational institutions, programs, and verifications
          </p>
        </div>
        {userRole === "Admin" && (
          <Button>
            <Building className="w-4 h-4 mr-2" />
            Add Institution
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{institutions.filter(i => i.status === 'verified').length}</p>
                <p className="text-sm text-muted-foreground">Verified Institutions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{institutions.reduce((sum, i) => sum + i.students, 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">${institutions.reduce((sum, i) => sum + i.revenue, 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{applications.length}</p>
                <p className="text-sm text-muted-foreground">Pending Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="institutions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="institutions">All Institutions</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="institutions" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search institutions..."
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
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Institutions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Institutions ({filteredInstitutions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Institution</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Languages</TableHead>
                    <TableHead>Programs</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstitutions.map((institution) => (
                    <TableRow key={institution.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>
                              {institution.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{institution.name}</p>
                            <p className="text-sm text-muted-foreground">{institution.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{institution.city}, {institution.country}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {institution.languages.map((lang, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{institution.programs}</TableCell>
                      <TableCell>{institution.students.toLocaleString()}</TableCell>
                      <TableCell>${institution.revenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(institution.status)}>
                          {institution.status}
                        </Badge>
                      </TableCell>
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
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Institution
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="w-4 h-4 mr-2" />
                              Manage Programs
                            </DropdownMenuItem>
                            {userRole === "Admin" && (
                              <>
                                <DropdownMenuSeparator />
                                {institution.status === "pending" && (
                                  <DropdownMenuItem>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Verify Institution
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Suspend Institution
                                </DropdownMenuItem>
                              </>
                            )}
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

        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Institution Programs</CardTitle>
              <CardDescription>Manage programs offered by institutions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Enrollments</TableHead>
                    <TableHead>Next Start</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programs.map((program) => {
                    const institution = institutions.find(i => i.id === program.institutionId);
                    return (
                      <TableRow key={program.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{program.title}</p>
                            <p className="text-sm text-muted-foreground">{program.level}</p>
                          </div>
                        </TableCell>
                        <TableCell>{institution?.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{program.language}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{program.duration}</p>
                            <p className="text-sm text-muted-foreground">{program.hoursPerWeek}h/week</p>
                          </div>
                        </TableCell>
                        <TableCell>${program.price}</TableCell>
                        <TableCell>
                          <div>
                            <p>{program.currentEnrollments}/{program.maxStudents}</p>
                            <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                              <div 
                                className="bg-blue-600 h-1 rounded-full" 
                                style={{ width: `${(program.currentEnrollments / program.maxStudents) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{program.startDates[0]}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Applications</CardTitle>
              <CardDescription>Review and verify new institution applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((application) => (
                  <Card key={application.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{application.institutionName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Contact: {application.contactPerson} ({application.email})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Location: {application.country} • Submitted: {application.submittedDate}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {application.documents.map((doc, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.replace('_', ' ')}
                          </Badge>
                          {userRole === "Admin" && (
                            <div className="flex space-x-2">
                              <Button size="sm">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button size="sm" variant="outline">
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Institution Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Institutions</span>
                    <span className="font-medium">{institutions.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Verified Rate</span>
                    <span className="font-medium">
                      {Math.round((institutions.filter(i => i.status === 'verified').length / institutions.length) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg Students per Institution</span>
                    <span className="font-medium">
                      {Math.round(institutions.reduce((sum, i) => sum + i.students, 0) / institutions.length)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Programs</span>
                    <span className="font-medium">{programs.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(
                  institutions.reduce((acc, inst) => {
                    acc[inst.country] = (acc[inst.country] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([country, count]) => (
                  <div key={country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{country}</span>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}