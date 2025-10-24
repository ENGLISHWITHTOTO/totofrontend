import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  MapPin, 
  Search, 
  Locate, 
  MousePointer2, 
  MoveHorizontal, 
  CheckCircle, 
  Play, 
  RotateCcw,
  Sparkles,
  Navigation,
  Clock
} from 'lucide-react';

const simulationSteps = [
  {
    id: 1,
    title: 'Search for Address',
    icon: Search,
    description: 'Type "25 Oxford Street, London" in the search box',
    duration: 2000,
    action: 'Searching address...',
    result: 'Address found! Pin dropping on map...'
  },
  {
    id: 2,
    title: 'Pin Drops on Map',
    icon: MapPin,
    description: 'Pin automatically drops at the searched location',
    duration: 1500,
    action: 'Placing marker...',
    result: 'Pin placed at coordinates: 51.515419, -0.141099'
  },
  {
    id: 3,
    title: 'Geocoding Address',
    icon: Sparkles,
    description: 'Converting coordinates to detailed address',
    duration: 1500,
    action: 'Running reverse geocoding...',
    result: 'Address components extracted successfully!'
  },
  {
    id: 4,
    title: 'Auto-fill Fields',
    icon: CheckCircle,
    description: 'All address fields populate automatically',
    duration: 2000,
    action: 'Populating fields...',
    result: 'All fields filled! Location ready to save.'
  }
];

const mockAddressData = {
  street: '25 Oxford Street',
  city: 'London',
  state: 'England',
  country: 'United Kingdom',
  postalCode: 'W1D 2DW',
  lat: 51.515419,
  lng: -0.141099,
  formattedAddress: '25 Oxford Street, London W1D 2DW, United Kingdom'
};

const alternativeLocations = [
  {
    name: 'Tokyo International School',
    street: '1-2-3 Shibuya',
    city: 'Shibuya City',
    state: 'Tokyo',
    country: 'Japan',
    postalCode: '150-0002',
    lat: 35.661777,
    lng: 139.704051
  },
  {
    name: 'Paris Language Academy',
    street: '15 Rue de Rivoli',
    city: 'Paris',
    state: 'Île-de-France',
    country: 'France',
    postalCode: '75001',
    lat: 48.856614,
    lng: 2.352222
  },
  {
    name: 'Berlin Learning Center',
    street: '42 Unter den Linden',
    city: 'Berlin',
    state: 'Berlin',
    country: 'Germany',
    postalCode: '10117',
    lat: 52.520008,
    lng: 13.404954
  }
];

export function MapSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [locationData, setLocationData] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<'search' | 'gps' | 'click' | 'drag'>('search');
  const [progress, setProgress] = useState(0);

  const startSimulation = (method: 'search' | 'gps' | 'click' | 'drag') => {
    setSelectedMethod(method);
    setIsRunning(true);
    setCurrentStep(0);
    setSearchQuery('');
    setShowPin(false);
    setLocationData(null);
    setProgress(0);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setSearchQuery('');
    setShowPin(false);
    setLocationData(null);
    setProgress(0);
  };

  const loadAlternativeLocation = (location: any) => {
    setLocationData({
      street: location.street,
      city: location.city,
      state: location.state,
      country: location.country,
      postalCode: location.postalCode,
      lat: location.lat,
      lng: location.lng,
      formattedAddress: `${location.street}, ${location.city} ${location.postalCode}, ${location.country}`
    });
    setShowPin(true);
    setCurrentStep(4);
  };

  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      if (currentStep === 0) {
        // Step 1: Show typing animation
        const query = selectedMethod === 'search' ? '25 Oxford Street, London' : 'Detecting location...';
        let currentChar = 0;
        const typingInterval = setInterval(() => {
          if (currentChar <= query.length) {
            setSearchQuery(query.slice(0, currentChar));
            currentChar++;
          } else {
            clearInterval(typingInterval);
            setTimeout(() => setCurrentStep(1), 500);
          }
        }, 100);
      } else if (currentStep === 1) {
        // Step 2: Drop pin
        setShowPin(true);
        setTimeout(() => setCurrentStep(2), 1500);
      } else if (currentStep === 2) {
        // Step 3: Geocoding
        setTimeout(() => setCurrentStep(3), 1500);
      } else if (currentStep === 3) {
        // Step 4: Auto-fill fields
        setLocationData(mockAddressData);
        setTimeout(() => {
          setCurrentStep(4);
          setIsRunning(false);
        }, 2000);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, selectedMethod]);

  // Progress animation
  useEffect(() => {
    if (isRunning && currentStep < simulationSteps.length) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 2;
          return newProgress > 100 ? 0 : newProgress;
        });
      }, 50);
      return () => clearInterval(progressInterval);
    }
  }, [isRunning, currentStep]);

  const getMethodDescription = (method: string) => {
    switch (method) {
      case 'search':
        return '🔍 Type any address worldwide and select from suggestions';
      case 'gps':
        return '📍 Use device GPS to automatically detect your current location';
      case 'click':
        return '🖱️ Click anywhere on the map to place a pin';
      case 'drag':
        return '✋ Drag the pin to fine-tune the exact position';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Play className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                Interactive Map Simulation
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Live Demo
                </Badge>
              </CardTitle>
              <CardDescription>
                See how institutions set their location in 4 different ways
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose a Method to Simulate</CardTitle>
          <CardDescription>
            Each method demonstrates a different way to set your institution's location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={() => startSimulation('search')}
              disabled={isRunning}
              className="h-auto py-4 justify-start"
              variant={selectedMethod === 'search' && !isRunning ? 'default' : 'outline'}
            >
              <Search className="w-5 h-5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium">Method 1: Search Address</div>
                <div className="text-xs opacity-80 mt-1">
                  Use autocomplete to find any location
                </div>
              </div>
            </Button>

            <Button
              onClick={() => startSimulation('gps')}
              disabled={isRunning}
              className="h-auto py-4 justify-start"
              variant={selectedMethod === 'gps' && !isRunning ? 'default' : 'outline'}
            >
              <Locate className="w-5 h-5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium">Method 2: Use GPS</div>
                <div className="text-xs opacity-80 mt-1">
                  Detect your current location automatically
                </div>
              </div>
            </Button>

            <Button
              onClick={() => startSimulation('click')}
              disabled={isRunning}
              className="h-auto py-4 justify-start"
              variant={selectedMethod === 'click' && !isRunning ? 'default' : 'outline'}
            >
              <MousePointer2 className="w-5 h-5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium">Method 3: Click Map</div>
                <div className="text-xs opacity-80 mt-1">
                  Click anywhere to place a pin
                </div>
              </div>
            </Button>

            <Button
              onClick={() => startSimulation('drag')}
              disabled={isRunning}
              className="h-auto py-4 justify-start"
              variant={selectedMethod === 'drag' && !isRunning ? 'default' : 'outline'}
            >
              <MoveHorizontal className="w-5 h-5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium">Method 4: Drag Pin</div>
                <div className="text-xs opacity-80 mt-1">
                  Fine-tune position by dragging
                </div>
              </div>
            </Button>
          </div>

          {!isRunning && currentStep === 0 && (
            <Alert className="mt-4 bg-primary/5 border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <AlertDescription>
                Click any method above to see how it works! The simulation will show you step-by-step how address fields auto-populate.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Simulation Progress */}
      {(isRunning || currentStep > 0) && (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {selectedMethod === 'search' && 'Search Method Active'}
                    {selectedMethod === 'gps' && 'GPS Detection Active'}
                    {selectedMethod === 'click' && 'Click Method Active'}
                    {selectedMethod === 'drag' && 'Drag Method Active'}
                  </CardTitle>
                  <CardDescription>
                    {getMethodDescription(selectedMethod)}
                  </CardDescription>
                </div>
              </div>
              <Button
                onClick={resetSimulation}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Steps */}
            <div className="space-y-3">
              {simulationSteps.map((step, index) => {
                const isActive = currentStep === index;
                const isCompleted = currentStep > index;
                const StepIcon = step.icon;

                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isActive
                        ? 'border-primary bg-primary/10'
                        : isCompleted
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-border bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <StepIcon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">
                            Step {step.id}: {step.title}
                          </h4>
                          {isActive && (
                            <Badge variant="secondary" className="text-xs animate-pulse">
                              <Clock className="w-3 h-3 mr-1" />
                              In Progress
                            </Badge>
                          )}
                          {isCompleted && (
                            <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-500">
                              ✓ Complete
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                        {isActive && (
                          <p className="text-xs text-primary mt-2 font-medium">{step.action}</p>
                        )}
                        {isCompleted && (
                          <p className="text-xs text-green-500 mt-2">{step.result}</p>
                        )}
                      </div>
                    </div>
                    {isActive && (
                      <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-100"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Search Box Simulation */}
            {currentStep >= 0 && (
              <div className="p-4 bg-card border-2 border-border rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    readOnly
                    placeholder="Search for address, city, or landmark..."
                    className="bg-input"
                  />
                  <Button size="icon" variant="outline">
                    <Locate className="w-4 h-4" />
                  </Button>
                </div>

                {/* Mock Map */}
                <div className="relative w-full h-64 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg border-2 border-border overflow-hidden">
                  {/* Map Grid */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="grid grid-cols-8 grid-rows-8 h-full">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div key={i} className="border border-white/20" />
                      ))}
                    </div>
                  </div>

                  {/* Pin */}
                  {showPin && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full animate-bounce">
                      <MapPin className="w-12 h-12 text-primary drop-shadow-lg" fill="currentColor" />
                    </div>
                  )}

                  {/* Coordinates Overlay */}
                  {showPin && locationData && (
                    <div className="absolute bottom-3 left-3 bg-card/95 backdrop-blur px-3 py-2 rounded-lg border border-border text-xs">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span className="text-muted-foreground">
                          {locationData.lat.toFixed(6)}, {locationData.lng.toFixed(6)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Zoom Controls */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1">
                    <Button size="icon" variant="secondary" className="h-8 w-8">+</Button>
                    <Button size="icon" variant="secondary" className="h-8 w-8">−</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Location Data Display */}
            {locationData && (
              <Card className="border-2 border-green-500/30 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-500">
                    <CheckCircle className="w-5 h-5" />
                    Location Successfully Set!
                  </CardTitle>
                  <CardDescription>
                    All address fields have been auto-populated from the map
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Street Address</label>
                      <div className="mt-1 p-2 bg-input rounded-md border border-border">
                        <span className="text-sm">{locationData.street}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">City</label>
                      <div className="mt-1 p-2 bg-input rounded-md border border-border">
                        <span className="text-sm">{locationData.city}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">State/Province</label>
                      <div className="mt-1 p-2 bg-input rounded-md border border-border">
                        <span className="text-sm">{locationData.state}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Postal Code</label>
                      <div className="mt-1 p-2 bg-input rounded-md border border-border">
                        <span className="text-sm">{locationData.postalCode}</span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-muted-foreground">Country</label>
                      <div className="mt-1 p-2 bg-input rounded-md border border-border">
                        <span className="text-sm">{locationData.country}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <label className="text-xs text-muted-foreground">Full Formatted Address</label>
                    <div className="mt-1 p-3 bg-muted rounded-md">
                      <span className="text-sm">{locationData.formattedAddress}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <label className="text-xs text-muted-foreground">Latitude</label>
                      <div className="mt-1 p-2 bg-input rounded-md border border-green-500/30 font-mono">
                        <span className="text-sm text-green-500">{locationData.lat.toFixed(6)}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Longitude</label>
                      <div className="mt-1 p-2 bg-input rounded-md border border-green-500/30 font-mono">
                        <span className="text-sm text-green-500">{locationData.lng.toFixed(6)}</span>
                      </div>
                    </div>
                  </div>

                  <Alert className="bg-green-500/10 border-green-500/30">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <AlertDescription className="text-sm">
                      <strong className="text-green-500">Ready for Student App!</strong>
                      <div className="mt-2 space-y-1 text-xs">
                        <div>✓ Will appear on "Study Abroad" map</div>
                        <div>✓ Visible in "Nearby Institutions" discovery</div>
                        <div>✓ Used for homestay distance calculations</div>
                        <div>✓ Searchable by city/region</div>
                      </div>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}

      {/* Try Other Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Try Different Locations
          </CardTitle>
          <CardDescription>
            See how the system works with institutions from around the world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {alternativeLocations.map((location, index) => (
              <Button
                key={index}
                onClick={() => loadAlternativeLocation(location)}
                variant="outline"
                className="h-auto py-3 justify-start"
              >
                <MapPin className="w-4 h-4 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium text-sm">{location.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {location.city}, {location.country}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Info */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            What Happens Automatically
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Smart Autocomplete</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Type any address and get instant suggestions from Google Places
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Precision Coordinates</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Latitude and longitude calculated to 6 decimal places
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Reverse Geocoding</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Coordinates automatically converted to readable addresses
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">All Fields Auto-Fill</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Street, city, state, country, and postal code populate instantly
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
