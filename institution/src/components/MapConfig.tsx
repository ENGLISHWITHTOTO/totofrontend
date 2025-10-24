/**
 * Google Maps API Configuration
 * 
 * IMPORTANT: Replace 'YOUR_GOOGLE_MAPS_API_KEY_HERE' with your actual Google Maps API key
 * 
 * To get your API key:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a new project or select existing
 * 3. Enable Maps JavaScript API, Places API, and Geocoding API
 * 4. Create credentials → API Key
 * 5. Restrict the API key to your domain
 * 
 * For production, use environment variables:
 * - Create .env.local file
 * - Add: VITE_GOOGLE_MAPS_API_KEY=your_key_here
 * - Use: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
 * 
 * Free tier includes $200/month credit which covers:
 * - ~28,000 map loads
 * - ~40,000 geocoding requests  
 * - ~17,000 autocomplete sessions
 * 
 * See /components/GOOGLE_MAPS_SETUP.md for detailed instructions
 */

// Development/Demo Key (Replace with your key)
export const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

// Production Configuration (Recommended)
// export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Libraries required for the map functionality
export const GOOGLE_MAPS_LIBRARIES: ("places" | "geometry")[] = ['places', 'geometry'];

// Default map center (London, UK)
export const DEFAULT_MAP_CENTER = {
  lat: 51.505,
  lng: -0.09
};

// Default map zoom level
export const DEFAULT_MAP_ZOOM = 12;

// Map styling for dark theme (matches app design)
export const DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [{ color: '#1a1a1f' }]
  },
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#a1a1aa' }]
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#0a0a0b' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0f0f11' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6366f1' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#27272a' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1e1e23' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#a1a1aa' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#2d2d32' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#27272a' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#1e1e23' }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1e1e23' }]
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#27272a' }]
  }
];

// Map options configuration
export const getMapOptions = (isDark: boolean = true): google.maps.MapOptions => ({
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  clickableIcons: false,
  gestureHandling: 'greedy',
  styles: isDark ? DARK_MAP_STYLES : undefined,
});

// Check if API key is configured
export const isGoogleMapsConfigured = (): boolean => {
  return GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE' && 
         GOOGLE_MAPS_API_KEY.length > 0;
};

// Get configuration status message
export const getConfigurationMessage = (): string => {
  if (!isGoogleMapsConfigured()) {
    return '⚠️ Google Maps API key not configured. Please update GOOGLE_MAPS_API_KEY in MapConfig.tsx';
  }
  return '✅ Google Maps configured';
};
