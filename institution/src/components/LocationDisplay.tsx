import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Navigation, Globe, CheckCircle } from 'lucide-react';

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

interface LocationDisplayProps {
  location: LocationData;
  showMap?: boolean;
  compact?: boolean;
}

export function LocationDisplay({ location, showMap = true, compact = false }: LocationDisplayProps) {
  if (compact) {
    return (
      <div className="flex items-start gap-2">
        <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{location.city}, {location.country}</p>
          <p className="text-xs text-muted-foreground truncate">{location.formattedAddress}</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Program Location
        </CardTitle>
        <CardDescription>Where classes are held</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address Details */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Street</p>
              <p className="text-sm font-medium">{location.street || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">City</p>
              <p className="text-sm font-medium">{location.city}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">State/Province</p>
              <p className="text-sm font-medium">{location.state || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Postal Code</p>
              <p className="text-sm font-medium">{location.postalCode || 'N/A'}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Country</p>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium">{location.country}</p>
            </div>
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Latitude</p>
            <p className="text-sm font-mono">{location.lat.toFixed(6)}</p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Longitude</p>
            <p className="text-sm font-mono">{location.lng.toFixed(6)}</p>
          </div>
        </div>

        {/* Map Preview */}
        {showMap && (
          <div className="relative bg-muted/30 h-[200px] rounded-lg overflow-hidden border border-border">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(to right, var(--border) 1px, transparent 1px),
                  linear-gradient(to bottom, var(--border) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px'
              }} />
            </div>
            
            {/* Marker */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-background">
                    <MapPin className="w-5 h-5 text-primary-foreground fill-current" />
                  </div>
                </div>
                <div className="w-2 h-2 bg-primary rounded-full shadow-lg" />
              </div>
            </div>

            {/* Coordinates Overlay */}
            <div className="absolute bottom-2 left-2 bg-card/95 backdrop-blur border border-border rounded px-2 py-1">
              <p className="text-xs font-mono">
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
            </div>
          </div>
        )}

        {/* Verification Badge */}
        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium text-green-500">Location Verified</p>
            <p className="text-xs text-muted-foreground">
              Will appear on student app maps
            </p>
          </div>
        </div>

        {/* Full Address */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Full Address</p>
          <p className="text-sm">{location.formattedAddress}</p>
        </div>
      </CardContent>
    </Card>
  );
}
