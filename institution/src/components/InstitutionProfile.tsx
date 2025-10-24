import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Upload, MapPin, Phone, Mail, CheckCircle, AlertCircle, Clock, Globe, Play } from 'lucide-react';
import { MapPicker } from './MapPicker';
import { LocationDisplay } from './LocationDisplay';
import { MapSimulation } from './MapSimulation';
import { FacilitiesSelector } from './FacilitiesSelector';
import { Alert, AlertDescription } from './ui/alert';

const supportedLanguages = [
  'English', 'French', 'Japanese', 'Arabic', 'Spanish', 'German', 'Italian', 'Portuguese', 'Mandarin', 'Korean'
];

const facilities = [
  'Modern Classrooms', 'Language Lab', 'Computer Lab', 'Library', 'Cafeteria', 
  'Sports Facilities', 'Student Lounge', 'Wi-Fi Campus', 'Parking', 'Accessibility Features'
];

interface LocationData {
  address?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  lat: number;
  lng: number;
  formattedAddress: string;
}

export function InstitutionProfile() {
  const [profileData, setProfileData] = useState({
    name: 'International Language Institute',
    description: 'Leading language education institution with over 20 years of experience in teaching multiple languages to international students.',
    email: 'info@ili.edu',
    phone: '+1 (555) 123-4567',
    website: 'www.ili.edu',
    selectedLanguages: ['English', 'French', 'Japanese', 'Arabic'],
    selectedFacilities: ['Modern Classrooms', 'Language Lab', 'Library', 'Cafeteria', 'Wi-Fi Campus'],
    customFacilities: [] as string[],
    verificationStatus: 'approved',
    location: null as LocationData | null
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation for Profile vs Simulation */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="profile">Institution Profile</TabsTrigger>
          <TabsTrigger value="simulation" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Map Demo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Institution Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={profileData.description}
                onChange={(e) => setProfileData({...profileData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Institution Logo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload logo</p>
                <Button variant="outline" className="mt-2">
                  Upload Image
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Promotional Video</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Upload promotional video</p>
                <Button variant="outline" className="mt-2">
                  Upload Video
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex gap-2 items-center">
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  placeholder="info@institution.edu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="flex gap-2 items-center">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="flex gap-2 items-center">
                <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Input
                  id="website"
                  value={profileData.website}
                  onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                  placeholder="www.institution.edu"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supported Languages */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {supportedLanguages.map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={language}
                    checked={profileData.selectedLanguages.includes(language)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setProfileData({
                          ...profileData,
                          selectedLanguages: [...profileData.selectedLanguages, language]
                        });
                      } else {
                        setProfileData({
                          ...profileData,
                          selectedLanguages: profileData.selectedLanguages.filter(l => l !== language)
                        });
                      }
                    }}
                  />
                  <Label htmlFor={language} className="text-sm">{language}</Label>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Selected Languages:</p>
              <div className="flex flex-wrap gap-2">
                {profileData.selectedLanguages.map((language) => (
                  <Badge key={language} variant="secondary">{language}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Facilities */}
        <FacilitiesSelector
          predefinedFacilities={facilities}
          selectedFacilities={profileData.selectedFacilities}
          customFacilities={profileData.customFacilities}
          onChange={(selected, custom) => setProfileData({
            ...profileData,
            selectedFacilities: selected,
            customFacilities: custom
          })}
          maxCharacters={35}
        />
      </div>

      {/* Institution Location - Map Integration */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Institution Address
                <Badge variant="outline" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Student App Compatible
                </Badge>
              </CardTitle>
              <CardDescription>
                Set your institution's exact location for Student App discovery
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-primary/5 border-primary/20">
            <MapPin className="w-4 h-4 text-primary" />
            <AlertDescription className="text-xs">
              <strong>Important:</strong> This address will appear on:
              <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                <li>"Study Abroad" map in Student App</li>
                <li>"Nearby Institutions" discovery feature</li>
                <li>Distance calculations for homestay matching</li>
                <li>Program location searches</li>
              </ul>
            </AlertDescription>
          </Alert>

          <MapPicker
            value={profileData.location}
            onChange={(location) => setProfileData({ ...profileData, location })}
            label="Institution Address"
            required={true}
          />

          {profileData.location && (
            <div className="pt-4 border-t border-border">
              <LocationDisplay location={profileData.location} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {getStatusIcon(profileData.verificationStatus)}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(profileData.verificationStatus)}`}>
                {profileData.verificationStatus.charAt(0).toUpperCase() + profileData.verificationStatus.slice(1)}
              </span>
            </div>
            <Button variant="outline" size="sm">
              Upload Documents
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Your institution verification is complete. All submitted documents have been approved.
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button>Save Changes</Button>
        <Button variant="outline">Preview Profile</Button>
      </div>
        </TabsContent>

        <TabsContent value="simulation" className="mt-6">
          <MapSimulation />
        </TabsContent>
      </Tabs>
    </div>
  );
}