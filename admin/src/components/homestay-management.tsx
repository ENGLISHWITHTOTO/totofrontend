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
  Home, 
  MapPin, 
  Calendar,
  DollarSign,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  Wifi,
  Car,
  Utensils,
  MoreHorizontal,
  Clock,
  Users
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface HomestayManagementProps {
  userRole: string;
}

export function HomestayManagement({ userRole }: HomestayManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const homestays = [
    {
      id: 1,
      hostName: "Sarah Johnson",
      email: "sarah.host@email.com",
      phone: "+1 555 0123",
      address: "123 Maple Street, Vancouver, BC",
      country: "Canada",
      city: "Vancouver",
      status: "verified",
      verificationDate: "2023-09-15",
      rating: 4.8,
      reviews: 47,
      totalBookings: 156,
      activeBookings: 2,
      capacity: 3,
      pricePerNight: 65,
      amenities: ["WiFi", "Meals", "Airport Pickup", "Laundry"],
      languages: ["English", "French"],
      roomTypes: ["Single", "Shared"],
      photos: 8,
      joinDate: "2023-01-15"
    },
    {
      id: 2,
      hostName: "Maria Rodriguez",
      email: "maria.host@email.com",
      phone: "+34 91 123 4567",
      address: "Calle Mayor 45, Madrid",
      country: "Spain",
      city: "Madrid",
      status: "pending",
      verificationDate: null,
      rating: 0,
      reviews: 0,
      totalBookings: 0,
      activeBookings: 0,
      capacity: 2,
      pricePerNight: 55,
      amenities: ["WiFi", "Meals", "Kitchen Access"],
      languages: ["Spanish", "English"],
      roomTypes: ["Single"],
      photos: 5,
      joinDate: "2024-03-10"
    },
    {
      id: 3,
      hostName: "John Smith",
      email: "john.host@email.com",
      phone: "+44 20 7123 4567",
      address: "15 Oak Road, London",
      country: "United Kingdom",
      city: "London",
      status: "verified",
      verificationDate: "2023-06-20",
      rating: 4.6,
      reviews: 89,
      totalBookings: 234,
      activeBookings: 3,
      capacity: 4,
      pricePerNight: 85,
      amenities: ["WiFi", "Breakfast", "Transport Pass", "Study Room"],
      languages: ["English"],
      roomTypes: ["Single", "Shared", "En-suite"],
      photos: 12,
      joinDate: "2022-08-10"
    },
    {
      id: 4,
      hostName: "Hiroshi Tanaka",
      email: "hiroshi.host@email.com",
      phone: "+81 3 1234 5678",
      address: "2-15-8 Shibuya, Tokyo",
      country: "Japan",
      city: "Tokyo",
      status: "suspended",
      verificationDate: "2023-04-05",
      rating: 3.2,
      reviews: 23,
      totalBookings: 45,
      activeBookings: 0,
      capacity: 2,
      pricePerNight: 70,
      amenities: ["WiFi", "Kitchen Access"],
      languages: ["Japanese", "English"],
      roomTypes: ["Single"],
      photos: 6,
      joinDate: "2023-01-20"
    }
  ];

  const bookings = [
    {
      id: 1,
      homestayId: 1,
      studentName: "Alex Chen",
      studentEmail: "alex.chen@email.com",
      checkIn: "2024-03-20",
      checkOut: "2024-06-20",
      duration: "3 months",
      roomType: "Single",
      totalCost: 5850,
      status: "confirmed",
      specialRequests: "Vegetarian meals",
      bookingDate: "2024-02-15"
    },
    {
      id: 2,
      homestayId: 3,
      studentName: "Emma Wilson",
      studentEmail: "emma.w@email.com",
      checkIn: "2024-04-01",
      checkOut: "2024-07-01",
      duration: "3 months",
      roomType: "En-suite",
      totalCost: 7650,
      status: "pending",
      specialRequests: "Near public transport",
      bookingDate: "2024-03-10"
    },
    {
      id: 3,
      homestayId: 1,
      studentName: "Diego Martinez",
      studentEmail: "diego.m@email.com",
      checkIn: "2024-03-15",
      checkOut: "2024-05-15",
      duration: "2 months",
      roomType: "Shared",
      totalCost: 3900,
      status: "active",
      specialRequests: "None",
      bookingDate: "2024-02-20"
    }
  ];

  const applications = [
    {
      id: 1,
      hostName: "Lisa Brown",
      email: "lisa.brown@email.com",
      country: "Australia",
      city: "Melbourne",
      submittedDate: "2024-03-12",
      documents: ["ID Verification", "Property Photos", "Police Check"],
      roomsOffered: 2,
      priceRange: "60-80",
      status: "pending_review"
    },
    {
      id: 2,
      hostName: "Pierre Dubois",
      email: "pierre.dubois@email.com",
      country: "France",
      city: "Paris",
      submittedDate: "2024-03-08",
      documents: ["ID Verification", "Property Deed", "Insurance"],
      roomsOffered: 1,
      priceRange: "70-90",
      status: "under_verification"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "suspended": return "bg-red-100 text-red-800";
      case "confirmed": return "bg-green-100 text-green-800";
      case "active": return "bg-blue-100 text-blue-800";
      case "pending_review": return "bg-blue-100 text-blue-800";
      case "under_verification": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "WiFi": return <Wifi className="w-3 h-3" />;
      case "Airport Pickup": return <Car className="w-3 h-3" />;
      case "Meals": case "Breakfast": return <Utensils className="w-3 h-3" />;
      default: return <Home className="w-3 h-3" />;
    }
  };

  const filteredHomestays = homestays.filter(homestay => {
    const matchesSearch = homestay.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         homestay.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         homestay.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || homestay.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Homestay Management</h1>
          <p className="text-muted-foreground">
            Manage homestay hosts, properties, and bookings
          </p>
        </div>
        {userRole === "Admin" && (
          <Button>
            <Home className="w-4 h-4 mr-2" />
            Add Homestay
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Home className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{homestays.filter(h => h.status === 'verified').length}</p>
                <p className="text-sm text-muted-foreground">Active Homestays</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">Active Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">${bookings.reduce((sum, b) => sum + b.totalCost, 0).toLocaleString()}</p>
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

      <Tabs defaultValue="homestays" className="space-y-6">
        <TabsList>
          <TabsTrigger value="homestays">All Homestays</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="homestays" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search homestays..."
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

          {/* Homestays Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredHomestays.map((homestay) => (
              <Card key={homestay.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>
                          {homestay.hostName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{homestay.hostName}</CardTitle>
                        <CardDescription className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{homestay.city}, {homestay.country}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(homestay.status)}>
                      {homestay.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Price/night:</span>
                      <p className="font-medium">${homestay.pricePerNight}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Capacity:</span>
                      <p className="font-medium">{homestay.capacity} guests</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Active bookings:</span>
                      <p className="font-medium">{homestay.activeBookings}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rating:</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="font-medium">{homestay.rating}</span>
                        <span className="text-muted-foreground">({homestay.reviews})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground text-sm">Amenities:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {homestay.amenities.slice(0, 4).map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs flex items-center space-x-1">
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </Badge>
                      ))}
                      {homestay.amenities.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{homestay.amenities.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground text-sm">Room types:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {homestay.roomTypes.map((type, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Calendar className="w-4 h-4 mr-2" />
                          View Bookings
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Star className="w-4 h-4 mr-2" />
                          Reviews
                        </DropdownMenuItem>
                        {userRole === "Admin" && (
                          <>
                            <DropdownMenuSeparator />
                            {homestay.status === "pending" && (
                              <DropdownMenuItem>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Verify Homestay
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="w-4 h-4 mr-2" />
                              Suspend Homestay
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>Manage student homestay bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Homestay</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Room Type</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => {
                    const homestay = homestays.find(h => h.id === booking.homestayId);
                    return (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.studentName}</p>
                            <p className="text-sm text-muted-foreground">{booking.studentEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{homestay?.hostName}</p>
                            <p className="text-sm text-muted-foreground">{homestay?.city}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{booking.duration}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.checkIn} - {booking.checkOut}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{booking.roomType}</Badge>
                        </TableCell>
                        <TableCell>${booking.totalCost}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
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
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Booking
                              </DropdownMenuItem>
                              {booking.status === "pending" && (
                                <DropdownMenuItem>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Confirm Booking
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
              <CardDescription>Review and verify new homestay host applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((application) => (
                  <Card key={application.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{application.hostName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {application.email} • {application.city}, {application.country}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Submitted: {application.submittedDate} • {application.roomsOffered} rooms • ${application.priceRange}/night
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
                <CardTitle>Homestay Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Homestays</span>
                    <span className="font-medium">{homestays.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Verified Rate</span>
                    <span className="font-medium">
                      {Math.round((homestays.filter(h => h.status === 'verified').length / homestays.length) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average Rating</span>
                    <span className="font-medium">
                      {(homestays.filter(h => h.rating > 0).reduce((sum, h) => sum + h.rating, 0) / 
                        homestays.filter(h => h.rating > 0).length).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Occupancy Rate</span>
                    <span className="font-medium">
                      {Math.round((homestays.reduce((sum, h) => sum + h.activeBookings, 0) / 
                        homestays.reduce((sum, h) => sum + h.capacity, 0)) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Bookings</span>
                    <span className="font-medium">{bookings.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Active Bookings</span>
                    <span className="font-medium">{bookings.filter(b => b.status === 'active').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average Duration</span>
                    <span className="font-medium">2.7 months</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average Cost</span>
                    <span className="font-medium">
                      ${Math.round(bookings.reduce((sum, b) => sum + b.totalCost, 0) / bookings.length)}
                    </span>
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