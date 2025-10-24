import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Switch } from './ui/switch';
import { Plus, Edit, Trash2, Upload, Eye, Home, Users, Building, Calendar, DollarSign } from 'lucide-react';

const amenities = [
  'Wi-Fi', 'Air Conditioning', 'Heating', 'Private Bathroom', 'Shared Bathroom',
  'Kitchen Access', 'Laundry', 'Study Area', 'Common Room', 'Garden/Balcony',
  'Parking', 'Security', 'Cleaning Service', 'Meals Included', 'Gym Access',
  'Library Access', '24/7 Reception', 'Bike Storage', 'TV Room', 'Outdoor Space'
];

const roomTypes = [
  { value: 'single', label: 'Single Room', description: 'Private room with shared facilities' },
  { value: 'double', label: 'Double Room', description: 'Shared room with another student' },
  { value: 'ensuite', label: 'Ensuite Room', description: 'Private room with private bathroom' },
  { value: 'studio', label: 'Studio Apartment', description: 'Self-contained unit with kitchenette' },
  { value: 'apartment', label: 'Apartment', description: 'Multi-room apartment with kitchen' },
  { value: 'suite', label: 'Suite', description: 'Premium accommodation with living area' }
];

const durationOptions = [
  { value: 'weekly', label: 'Per Week', multiplier: 1 },
  { value: 'monthly', label: 'Per Month', multiplier: 4.33 },
  { value: 'term', label: 'Per Term (12 weeks)', multiplier: 12 },
  { value: 'semester', label: 'Per Semester (16 weeks)', multiplier: 16 },
  { value: 'academic_year', label: 'Academic Year (32 weeks)', multiplier: 32 }
];

const mockAccommodations = [
  {
    id: 1,
    name: 'University Residence Hall A',
    type: 'institution',
    roomType: 'single',
    capacity: 120,
    occupancy: 95,
    totalRooms: 120,
    pricePerWeek: 180,
    pricing: {
      weekly: 180,
      monthly: 720,
      term: 2160,
      semester: 2880,
      academic_year: 5760
    },
    availableDurations: ['weekly', 'monthly', 'term', 'semester', 'academic_year'],
    amenities: ['Wi-Fi', 'Shared Bathroom', 'Kitchen Access', 'Laundry', 'Common Room', '24/7 Reception'],
    description: 'Modern residence hall with shared facilities. Perfect for students who want to be part of a vibrant community.',
    location: 'On Campus - Building A',
    address: '123 University Drive, Campus Center',
    status: 'available',
    photos: 8,
    isBookable: true,
    availableFrom: '2024-01-15',
    minStay: 4,
    maxStay: 52
  },
  {
    id: 2,
    name: 'International Student Apartments',
    type: 'institution',
    roomType: 'apartment',
    capacity: 50,
    occupancy: 45,
    totalRooms: 50,
    pricePerWeek: 280,
    pricing: {
      weekly: 280,
      monthly: 1120,
      term: 3360,
      semester: 4480,
      academic_year: 8960
    },
    availableDurations: ['weekly', 'monthly', 'term', 'semester', 'academic_year'],
    amenities: ['Wi-Fi', 'Private Bathroom', 'Full Kitchen', 'Living Room', 'Cleaning Service', 'Parking'],
    description: 'Self-contained apartments perfect for independent living. Each unit accommodates 2-4 students.',
    location: 'Near Campus - 5 min walk',
    address: '456 Student Village, University District',
    status: 'available',
    photos: 12,
    isBookable: true,
    availableFrom: '2024-02-01',
    minStay: 8,
    maxStay: 52
  },
  {
    id: 3,
    name: 'Premium Ensuite Rooms',
    type: 'institution',
    roomType: 'ensuite',
    capacity: 80,
    occupancy: 72,
    totalRooms: 80,
    pricePerWeek: 220,
    pricing: {
      weekly: 220,
      monthly: 880,
      term: 2640,
      semester: 3520,
      academic_year: 7040
    },
    availableDurations: ['weekly', 'monthly', 'term', 'semester', 'academic_year'],
    amenities: ['Wi-Fi', 'Private Bathroom', 'Kitchen Access', 'Study Area', 'Gym Access', 'Library Access'],
    description: 'Private rooms with ensuite bathrooms. Great balance of privacy and community living.',
    location: 'On Campus - Building B',
    address: '789 Campus Road, University Center',
    status: 'available',
    photos: 6,
    isBookable: true,
    availableFrom: '2024-01-20',
    minStay: 4,
    maxStay: 52
  },
  {
    id: 4,
    name: 'Thompson Family Homestay',
    type: 'homestay',
    roomType: 'single',
    capacity: 2,
    occupancy: 1,
    totalRooms: 2,
    pricePerWeek: 200,
    pricing: {
      weekly: 200,
      monthly: 800,
      term: 2400
    },
    availableDurations: ['weekly', 'monthly', 'term'],
    amenities: ['Wi-Fi', 'Private Bathroom', 'Meals Included', 'Garden/Balcony'],
    description: 'Welcoming family home in quiet neighborhood with experienced hosts.',
    location: 'Residential Area - 15 min by bus',
    address: '321 Maple Street, Quiet Suburbs',
    status: 'available',
    photos: 4,
    isBookable: true,
    availableFrom: '2024-01-10',
    minStay: 2,
    maxStay: 26,
    contactName: 'Sarah Thompson',
    contactPhone: '+1 (555) 123-4567',
    contactEmail: 'sarah@thompson.com'
  }
];

export function AccommodationManagement() {
  const [accommodations, setAccommodations] = useState(mockAccommodations);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [newAccommodation, setNewAccommodation] = useState({
    name: '',
    type: 'institution',
    roomType: 'single',
    capacity: 1,
    totalRooms: 1,
    pricePerWeek: '',
    pricing: {
      weekly: '',
      monthly: '',
      term: '',
      semester: '',
      academic_year: ''
    },
    availableDurations: ['weekly'],
    description: '',
    amenities: [],
    location: '',
    address: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    isBookable: true,
    availableFrom: '',
    minStay: 1,
    maxStay: 52
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'full':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOccupancyColor = (occupancy: number, capacity: number) => {
    const ratio = occupancy / capacity;
    if (ratio === 1) return 'text-red-600';
    if (ratio >= 0.8) return 'text-yellow-600';
    return 'text-green-600';
  };

  const AccommodationForm = ({ accommodation, onSave, onCancel }: any) => {
    const handlePricingChange = (duration: string, value: string) => {
      setNewAccommodation({
        ...accommodation,
        pricing: {
          ...accommodation.pricing,
          [duration]: value
        }
      });
    };

    const handleDurationToggle = (duration: string, checked: boolean) => {
      if (checked) {
        setNewAccommodation({
          ...accommodation,
          availableDurations: [...accommodation.availableDurations, duration]
        });
      } else {
        setNewAccommodation({
          ...accommodation,
          availableDurations: accommodation.availableDurations.filter((d: string) => d !== duration)
        });
      }
    };

    return (
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="font-medium">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Accommodation Name</Label>
              <Input
                id="name"
                value={accommodation.name}
                onChange={(e) => setNewAccommodation({...accommodation, name: e.target.value})}
                placeholder="e.g., University Residence Hall A"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Provider Type</Label>
              <Select value={accommodation.type} onValueChange={(value) => setNewAccommodation({...accommodation, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="institution">Institution Provided</SelectItem>
                  <SelectItem value="homestay">Homestay Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomType">Room Type</Label>
              <Select value={accommodation.roomType} onValueChange={(value) => setNewAccommodation({...accommodation, roomType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((room) => (
                    <SelectItem key={room.value} value={room.value}>
                      <div>
                        <div>{room.label}</div>
                        <div className="text-xs text-muted-foreground">{room.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalRooms">Total Rooms/Spaces</Label>
              <Input
                id="totalRooms"
                type="number"
                value={accommodation.totalRooms}
                onChange={(e) => setNewAccommodation({...accommodation, totalRooms: parseInt(e.target.value)})}
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Total Capacity (students)</Label>
              <Input
                id="capacity"
                type="number"
                value={accommodation.capacity}
                onChange={(e) => setNewAccommodation({...accommodation, capacity: parseInt(e.target.value)})}
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={accommodation.location}
                onChange={(e) => setNewAccommodation({...accommodation, location: e.target.value})}
                placeholder="e.g., On Campus - Building A"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Availability */}
        <div className="space-y-4">
          <h3 className="font-medium">Pricing & Duration Options</h3>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Available Booking Durations</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {durationOptions.map((duration) => (
                  <div key={duration.value} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Checkbox
                      id={duration.value}
                      checked={accommodation.availableDurations?.includes(duration.value)}
                      onCheckedChange={(checked) => handleDurationToggle(duration.value, !!checked)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={duration.value} className="text-sm font-medium">{duration.label}</Label>
                      {accommodation.availableDurations?.includes(duration.value) && (
                        <div className="mt-1">
                          <Input
                            type="number"
                            value={accommodation.pricing?.[duration.value] || ''}
                            onChange={(e) => handlePricingChange(duration.value, e.target.value)}
                            placeholder="Price"
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="availableFrom">Available From</Label>
              <Input
                id="availableFrom"
                type="date"
                value={accommodation.availableFrom}
                onChange={(e) => setNewAccommodation({...accommodation, availableFrom: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minStay">Minimum Stay (weeks)</Label>
              <Input
                id="minStay"
                type="number"
                value={accommodation.minStay}
                onChange={(e) => setNewAccommodation({...accommodation, minStay: parseInt(e.target.value)})}
                placeholder="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxStay">Maximum Stay (weeks)</Label>
              <Input
                id="maxStay"
                type="number"
                value={accommodation.maxStay}
                onChange={(e) => setNewAccommodation({...accommodation, maxStay: parseInt(e.target.value)})}
                placeholder="52"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isBookable"
              checked={accommodation.isBookable}
              onCheckedChange={(checked) => setNewAccommodation({...accommodation, isBookable: checked})}
            />
            <Label htmlFor="isBookable">Allow student bookings</Label>
          </div>
        </div>

        {/* Description & Location */}
        <div className="space-y-4">
          <h3 className="font-medium">Description & Location</h3>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={accommodation.description}
              onChange={(e) => setNewAccommodation({...accommodation, description: e.target.value})}
              placeholder="Describe the accommodation, facilities, and what makes it special..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <Textarea
              id="address"
              rows={2}
              value={accommodation.address}
              onChange={(e) => setNewAccommodation({...accommodation, address: e.target.value})}
              placeholder="Complete address including postal code"
            />
          </div>
        </div>

        {/* Contact Information (for homestays) */}
        {accommodation.type === 'homestay' && (
          <div className="space-y-4">
            <h3 className="font-medium">Host Family Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  value={accommodation.contactName}
                  onChange={(e) => setNewAccommodation({...accommodation, contactName: e.target.value})}
                  placeholder="Host family name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  value={accommodation.contactPhone}
                  onChange={(e) => setNewAccommodation({...accommodation, contactPhone: e.target.value})}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={accommodation.contactEmail}
                  onChange={(e) => setNewAccommodation({...accommodation, contactEmail: e.target.value})}
                  placeholder="host@email.com"
                />
              </div>
            </div>
          </div>
        )}

        {/* Amenities */}
        <div className="space-y-4">
          <h3 className="font-medium">Amenities & Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {amenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={accommodation.amenities?.includes(amenity)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setNewAccommodation({
                        ...accommodation,
                        amenities: [...(accommodation.amenities || []), amenity]
                      });
                    } else {
                      setNewAccommodation({
                        ...accommodation,
                        amenities: (accommodation.amenities || []).filter((a: string) => a !== amenity)
                      });
                    }
                  }}
                />
                <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="space-y-4">
          <h3 className="font-medium">Photos</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">Upload accommodation photos to showcase your property</p>
            <p className="text-xs text-gray-400 mb-4">Recommended: 6-12 high-quality photos showing rooms, common areas, and facilities</p>
            <Button variant="outline" size="sm">
              Upload Photos
            </Button>
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={onSave} className="flex-1">
            <Building className="w-4 h-4 mr-2" />
            Save Accommodation
          </Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    );
  };

  const filteredAccommodations = accommodations.filter(acc => {
    if (activeTab === 'all') return true;
    if (activeTab === 'institution') return acc.type === 'institution';
    if (activeTab === 'homestay') return acc.type === 'homestay';
    if (activeTab === 'available') return acc.status === 'available';
    if (activeTab === 'full') return acc.status === 'full';
    return true;
  });

  const institutionAccommodations = accommodations.filter(acc => acc.type === 'institution');
  const homestayAccommodations = accommodations.filter(acc => acc.type === 'homestay');
  const availableRooms = accommodations.reduce((acc, room) => acc + (room.capacity - room.occupancy), 0);
  const totalRevenue = accommodations.reduce((acc, room) => {
    return acc + (room.occupancy * room.pricePerWeek * 4); // Monthly revenue estimate
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2>Accommodation Management</h2>
          <p className="text-sm text-muted-foreground">Manage institution accommodations and homestay partnerships for student bookings</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddingRoom} onOpenChange={setIsAddingRoom}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Accommodation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Accommodation</DialogTitle>
                <DialogDescription>
                  Create a new accommodation option that students can book through the Student App. 
                  Complete all sections to ensure students have comprehensive information for their booking decision.
                </DialogDescription>
              </DialogHeader>
              <AccommodationForm
                accommodation={newAccommodation}
                onSave={() => {
                  const newAccommodationData = { 
                    ...newAccommodation, 
                    id: Date.now(), 
                    occupancy: 0, 
                    status: 'available',
                    photos: 0,
                    pricePerWeek: newAccommodation.pricing?.weekly || newAccommodation.pricePerWeek
                  };
                  setAccommodations([...accommodations, newAccommodationData]);
                  setIsAddingRoom(false);
                  setNewAccommodation({
                    name: '', type: 'institution', roomType: 'single', capacity: 1, totalRooms: 1,
                    pricePerWeek: '', pricing: { weekly: '', monthly: '', term: '', semester: '', academic_year: '' },
                    availableDurations: ['weekly'], description: '', amenities: [], location: '', address: '',
                    contactName: '', contactPhone: '', contactEmail: '', isBookable: true, availableFrom: '',
                    minStay: 1, maxStay: 52
                  });
                }}
                onCancel={() => setIsAddingRoom(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Institution Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{institutionAccommodations.length}</div>
            <p className="text-xs text-muted-foreground">
              {institutionAccommodations.reduce((acc, room) => acc + room.capacity, 0)} total beds
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Homestay Partners</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{homestayAccommodations.length}</div>
            <p className="text-xs text-muted-foreground">
              {homestayAccommodations.reduce((acc, room) => acc + room.capacity, 0)} total spaces
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Spaces</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableRooms}</div>
            <p className="text-xs text-muted-foreground">Ready for booking</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((accommodations.reduce((acc, room) => acc + room.occupancy, 0) / 
                accommodations.reduce((acc, room) => acc + room.capacity, 0)) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {accommodations.reduce((acc, room) => acc + room.occupancy, 0)} occupied
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Est. from occupancy</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Accommodations</TabsTrigger>
          <TabsTrigger value="institution">Institution Properties</TabsTrigger>
          <TabsTrigger value="homestay">Homestay Partners</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="full">Full</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property Details</TableHead>
                  <TableHead>Room Type</TableHead>
                  <TableHead>Occupancy</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Booking Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccommodations.map((accommodation) => (
                  <TableRow key={accommodation.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{accommodation.name}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant={accommodation.type === 'institution' ? 'default' : 'secondary'}>
                            {accommodation.type === 'institution' ? 'Institution' : 'Homestay'}
                          </Badge>
                          {accommodation.isBookable && (
                            <Badge variant="outline" className="text-green-700 border-green-200">
                              Bookable
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="capitalize font-medium">
                          {roomTypes.find(r => r.value === accommodation.roomType)?.label || accommodation.roomType}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {accommodation.totalRooms} {accommodation.totalRooms === 1 ? 'room' : 'rooms'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className={getOccupancyColor(accommodation.occupancy, accommodation.capacity)}>
                          {accommodation.occupancy}/{accommodation.capacity}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          {accommodation.capacity - accommodation.occupancy} available
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">${accommodation.pricePerWeek}/week</div>
                        {accommodation.pricing?.monthly && (
                          <div className="text-xs text-muted-foreground">
                            ${accommodation.pricing.monthly}/month
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {accommodation.availableDurations?.length} duration options
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(accommodation.status)}`}>
                          {accommodation.status}
                        </span>
                        {accommodation.availableFrom && (
                          <div className="text-xs text-muted-foreground">
                            Available from {new Date(accommodation.availableFrom).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{accommodation.location}</div>
                        <div className="flex flex-wrap gap-1">
                          {accommodation.amenities.slice(0, 2).map((amenity, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {accommodation.amenities.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{accommodation.amenities.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" title="View Details">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Manage Bookings">
                          <Calendar className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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