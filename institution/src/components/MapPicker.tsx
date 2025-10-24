import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { MapPin, Search, Navigation, Loader2, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useIsMobile } from './ui/use-mobile';
import { 
  GOOGLE_MAPS_API_KEY, 
  GOOGLE_MAPS_LIBRARIES, 
  DEFAULT_MAP_CENTER,
  getMapOptions,
  isGoogleMapsConfigured,
  getConfigurationMessage 
} from './MapConfig';

interface LocationData {
  address: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  lat: number;
  lng: number;
  formattedAddress: string;
}

interface MapPickerProps {
  value?: LocationData | null;
  onChange: (location: LocationData) => void;
  label?: string;
  required?: boolean;
}

export function MapPicker({ value, onChange, label = 'Program Location', required = false }: MapPickerProps) {
  const isMobile = useIsMobile();
  const [location, setLocation] = useState<LocationData | null>(value || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(
    value ? { lat: value.lat, lng: value.lng } : { lat: 51.505, lng: -0.09 }
  );
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(
    value ? { lat: value.lat, lng: value.lng } : null
  );
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Map container style
  const mapContainerStyle = {
    width: '100%',
    height: isMobile ? '300px' : '400px',
  };

  // Get map options from config
  const mapOptions = getMapOptions(true);

  // Initialize location from value prop
  useEffect(() => {
    if (value) {
      setLocation(value);
      setMapCenter({ lat: value.lat, lng: value.lng });
      setMarkerPosition({ lat: value.lat, lng: value.lng });
    }
  }, [value]);

  // Reverse geocode using Google Maps Geocoding API
  const reverseGeocode = useCallback((lat: number, lng: number) => {
    if (!window.google) return;

    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const result = results[0];
        const addressComponents = result.address_components;

        // Parse address components
        const getComponent = (type: string) => {
          const component = addressComponents.find(c => c.types.includes(type));
          return component?.long_name || '';
        };

        const locationData: LocationData = {
          address: result.formatted_address,
          street: `${getComponent('street_number')} ${getComponent('route')}`.trim() || getComponent('route'),
          city: getComponent('locality') || getComponent('administrative_area_level_2'),
          state: getComponent('administrative_area_level_1'),
          country: getComponent('country'),
          postalCode: getComponent('postal_code'),
          lat,
          lng,
          formattedAddress: result.formatted_address,
        };

        setLocation(locationData);
        onChange(locationData);
      }
    });
  }, [onChange]);

  // Handle autocomplete place selection
  const onPlaceChanged = useCallback(() => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        setMapCenter({ lat, lng });
        setMarkerPosition({ lat, lng });
        
        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(15);
        }

        reverseGeocode(lat, lng);
      }
    }
  }, [autocomplete, map, reverseGeocode]);

  // Handle autocomplete load
  const onAutocompleteLoad = useCallback((autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
    autocompleteRef.current = autocompleteInstance;
  }, []);

  // Get current location using browser geolocation
  const handleGetCurrentLocation = useCallback(() => {
    setIsLoadingCurrentLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setMapCenter({ lat, lng });
          setMarkerPosition({ lat, lng });
          
          if (map) {
            map.panTo({ lat, lng });
            map.setZoom(15);
          }
          
          reverseGeocode(lat, lng);
          setIsLoadingCurrentLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingCurrentLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setIsLoadingCurrentLocation(false);
    }
  }, [map, reverseGeocode]);

  // Handle map click to place marker
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      
      setMarkerPosition({ lat, lng });
      reverseGeocode(lat, lng);
    }
  }, [reverseGeocode]);

  // Handle marker drag
  const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      
      setMarkerPosition({ lat, lng });
      reverseGeocode(lat, lng);
    }
  }, [reverseGeocode]);

  // Handle map load
  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    setIsMapLoaded(true);
  }, []);

  // Check if Google Maps is configured
  if (!isGoogleMapsConfigured()) {
    return (
      <div className="space-y-4">
        <div>
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
        </div>
        
        <Alert className="border-yellow-500/20 bg-yellow-500/10">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          <AlertTitle className="text-yellow-500">Google Maps Not Configured</AlertTitle>
          <AlertDescription className="text-xs space-y-2">
            <p>Please configure your Google Maps API key to enable location selection.</p>
            <div className="mt-2 p-3 bg-card rounded border border-border font-mono text-xs">
              <p className="text-muted-foreground mb-2">Steps to configure:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Get API key from Google Cloud Console</li>
                <li>Enable Maps JavaScript API, Places API, Geocoding API</li>
                <li>Update GOOGLE_MAPS_API_KEY in /components/MapConfig.tsx</li>
              </ol>
            </div>
            <p className="text-muted-foreground mt-2">
              See <code className="bg-card px-1 py-0.5 rounded">/components/GOOGLE_MAPS_SETUP.md</code> for detailed instructions.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={GOOGLE_MAPS_LIBRARIES}
      loadingElement={
        <div className="flex items-center justify-center h-[400px] bg-muted/30 rounded-lg">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Search for an address, click on the map, or drag the marker to set the program location
          </p>
        </div>

        {/* Search Bar with Google Places Autocomplete */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
              <Autocomplete
                onLoad={onAutocompleteLoad}
                onPlaceChanged={onPlaceChanged}
                options={{
                  fields: ['address_components', 'geometry', 'formatted_address', 'name'],
                }}
              >
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for address, city, or landmark..."
                  className="pl-10"
                />
              </Autocomplete>
            </div>
            <Button
              onClick={handleGetCurrentLocation}
              disabled={isLoadingCurrentLocation}
              variant="outline"
              title="Use my current location"
            >
              {isLoadingCurrentLocation ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Instructions */}
          <Alert className="bg-primary/5 border-primary/20">
            <Info className="w-4 h-4 text-primary" />
            <AlertDescription className="text-xs">
              <strong>Tip:</strong> Search above, use your location, click the map, or drag the pin to set your exact location
            </AlertDescription>
          </Alert>
        </div>

        {/* Google Map */}
        <Card className="overflow-hidden border-2 border-border">
          <div className="relative">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={markerPosition ? 15 : 12}
              options={mapOptions}
              onClick={handleMapClick}
              onLoad={onMapLoad}
            >
              {markerPosition && (
                <Marker
                  position={markerPosition}
                  draggable={true}
                  onDragEnd={handleMarkerDragEnd}
                  animation={google.maps.Animation.DROP}
                />
              )}
            </GoogleMap>

            {/* Coordinate Display Overlay */}
            {markerPosition && (
              <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur border border-border rounded-lg px-3 py-2 shadow-lg">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Coordinates:</span>{' '}
                  <span className="font-mono text-primary">
                    {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
                  </span>
                </p>
              </div>
            )}

            {/* Loading Overlay */}
            {!isMapLoaded && (
              <div className="absolute inset-0 bg-muted/30 backdrop-blur flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
          </div>
        </Card>

        {/* Address Details Form */}
        {location && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Location Set
              </CardTitle>
              <CardDescription>Review and edit the address details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="street" className="text-sm">Street Address</Label>
                  <Input
                    id="street"
                    value={location.street}
                    onChange={(e) => {
                      const updated = { ...location, street: e.target.value };
                      setLocation(updated);
                      onChange(updated);
                    }}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm">City</Label>
                  <Input
                    id="city"
                    value={location.city}
                    onChange={(e) => {
                      const updated = { ...location, city: e.target.value };
                      setLocation(updated);
                      onChange(updated);
                    }}
                    placeholder="New York"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm">State/Province</Label>
                  <Input
                    id="state"
                    value={location.state}
                    onChange={(e) => {
                      const updated = { ...location, state: e.target.value };
                      setLocation(updated);
                      onChange(updated);
                    }}
                    placeholder="New York"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-sm">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={location.postalCode}
                    onChange={(e) => {
                      const updated = { ...location, postalCode: e.target.value };
                      setLocation(updated);
                      onChange(updated);
                    }}
                    placeholder="10001"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="country" className="text-sm">Country</Label>
                  <Input
                    id="country"
                    value={location.country}
                    onChange={(e) => {
                      const updated = { ...location, country: e.target.value };
                      setLocation(updated);
                      onChange(updated);
                    }}
                    placeholder="United States"
                  />
                </div>
              </div>

              {/* Full Formatted Address Display */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <Label className="text-xs text-muted-foreground">Full Address</Label>
                <p className="text-sm mt-1 font-medium">{location.formattedAddress}</p>
              </div>

              {/* Coordinates Display */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-card border border-border rounded-lg">
                  <Label className="text-xs text-muted-foreground">Latitude</Label>
                  <p className="text-sm font-mono mt-1">{location.lat.toFixed(6)}</p>
                </div>
                <div className="p-3 bg-card border border-border rounded-lg">
                  <Label className="text-xs text-muted-foreground">Longitude</Label>
                  <p className="text-sm font-mono mt-1">{location.lng.toFixed(6)}</p>
                </div>
              </div>

              {/* Compatibility Info */}
              <Alert>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <AlertDescription className="text-xs">
                  ✅ This location will appear correctly on:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Student App "Study Abroad" map</li>
                    <li>"Nearby Homestays" location search</li>
                    <li>"Nearby Institutions" discovery</li>
                    <li>Distance-based program recommendations</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* No Location Set */}
        {!location && (
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription className="text-xs">
              Please set a location by searching for an address, using your current location, or clicking on the map. This ensures students can find your program on the map.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </LoadScript>
  );
}
