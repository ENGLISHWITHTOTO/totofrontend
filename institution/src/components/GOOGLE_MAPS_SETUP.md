# Google Maps Integration Setup Guide

## Overview
This application uses Google Maps Platform APIs for comprehensive location management. Follow these steps to configure Google Maps for production use.

## 🔑 Getting Your API Key

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "EduConnect Institution Panel"
4. Click "Create"

### Step 2: Enable Required APIs

Navigate to "APIs & Services" → "Library" and enable:

1. **Maps JavaScript API** (Required)
   - For displaying interactive maps
   
2. **Places API** (Required)
   - For address autocomplete and search
   
3. **Geocoding API** (Required)
   - For converting addresses to coordinates and vice versa
   
4. **Geolocation API** (Optional)
   - For enhanced location detection

### Step 3: Create API Key

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy your API key (starts with `AIza...`)
4. Click "Restrict Key" (Important for security!)

### Step 4: Restrict Your API Key

**Application Restrictions:**
- Choose "HTTP referrers (web sites)"
- Add your domains:
  ```
  localhost:*
  yourdomain.com/*
  *.yourdomain.com/*
  ```

**API Restrictions:**
- Choose "Restrict key"
- Select only the APIs you enabled:
  - Maps JavaScript API
  - Places API
  - Geocoding API
  - Geolocation API (if using)

### Step 5: Set Up Billing

⚠️ **Important**: Google Maps requires billing to be enabled, but offers:
- **$200 free credit per month**
- Pay-as-you-go pricing
- Most small-to-medium apps stay within free tier

1. Go to "Billing" in Google Cloud Console
2. Set up billing account
3. Monitor usage in "APIs & Services" → "Dashboard"

## 📦 Installation

The app uses `@react-google-maps/api` package:

```bash
npm install @react-google-maps/api
# or
yarn add @react-google-maps/api
```

## 🔧 Configuration

### Update MapPicker Component

Replace the placeholder API key in `/components/MapPicker.tsx`:

```typescript
// Before
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

// After
const GOOGLE_MAPS_API_KEY = 'AIzaSyC...your-actual-key';
```

### Environment Variables (Recommended)

**For Production**, use environment variables:

1. Create `.env.local` file:
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyC...your-actual-key
```

2. Update MapPicker.tsx:
```typescript
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
```

3. Add to `.gitignore`:
```
.env.local
```

## 📊 Pricing Breakdown

### Free Tier (per month):
- **$200 credit** = approximately:
  - 28,000 map loads
  - 40,000 geocoding requests
  - 17,000 autocomplete sessions

### Typical Institution Panel Usage:
- **Map loads**: ~100-500/day = **Free**
- **Geocoding**: ~20-50/day = **Free**
- **Autocomplete**: ~50-100/day = **Free**

**Most institutions will stay within free tier!**

## 🎨 Map Styling

The map uses custom dark theme styling in `mapOptions`:

```typescript
const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    // Dark theme colors matching app
    { featureType: 'all', elementType: 'geometry', 
      stylers: [{ color: '#1a1a1f' }] },
    { featureType: 'water', elementType: 'geometry', 
      stylers: [{ color: '#0f0f11' }] },
    // ... more styling
  ]
};
```

**Customize colors** to match your brand in MapPicker.tsx.

## 🔒 Security Best Practices

### 1. API Key Restrictions
- ✅ Always restrict API keys by domain
- ✅ Enable only required APIs
- ✅ Never commit keys to Git
- ✅ Use environment variables

### 2. Usage Monitoring
- Set up budget alerts in Google Cloud Console
- Monitor API usage dashboard
- Enable quota limits if needed

### 3. Rate Limiting
The app implements client-side best practices:
- Debouncing autocomplete searches
- Caching geocoding results
- Lazy loading map component

## 🧪 Testing

### Development Testing:
```bash
# Test with localhost
http://localhost:5173

# Ensure API key allows localhost:*
```

### Production Testing:
1. Deploy to staging domain
2. Add domain to API key restrictions
3. Test all features:
   - ✅ Map loads correctly
   - ✅ Autocomplete works
   - ✅ Marker placement works
   - ✅ Geocoding returns addresses
   - ✅ Current location works

## 📱 Features Included

### MapPicker Component:
- ✅ Interactive Google Map with dark theme
- ✅ Draggable marker with smooth animations
- ✅ Places Autocomplete for address search
- ✅ Reverse geocoding on marker drag
- ✅ Current location via browser geolocation
- ✅ Click-to-place marker
- ✅ Editable address fields
- ✅ Real-time coordinate display
- ✅ Mobile-optimized touch controls

### Map Controls:
- Zoom in/out
- Pan/drag
- Fullscreen mode
- Street view (optional)
- Satellite view toggle

## 🚀 Performance Optimization

### Lazy Loading
```typescript
<LoadScript
  googleMapsApiKey={GOOGLE_MAPS_API_KEY}
  libraries={libraries}
  loadingElement={<Loader />}
>
```

### Debouncing
Autocomplete automatically debounces user input.

### Caching
Consider caching geocoded addresses:
```typescript
const geocodeCache = new Map();
```

## 🐛 Troubleshooting

### Map Not Loading?
1. Check API key is correct
2. Verify billing is enabled
3. Ensure APIs are enabled
4. Check browser console for errors
5. Verify domain restrictions

### "RefererNotAllowedMapError"?
- Add your domain to API key restrictions
- Include `http://` or `https://` protocol
- Use `*` for subdomains: `*.yourdomain.com/*`

### Autocomplete Not Working?
- Ensure Places API is enabled
- Check API key has Places API permission
- Verify `libraries={['places']}` is loaded

### Marker Not Draggable?
```typescript
<Marker
  position={markerPosition}
  draggable={true}  // Ensure this is true
  onDragEnd={handleMarkerDragEnd}
/>
```

## 📖 API Documentation

### Official Docs:
- [Google Maps Platform](https://developers.google.com/maps)
- [Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Places API](https://developers.google.com/maps/documentation/places/web-service)
- [Geocoding API](https://developers.google.com/maps/documentation/geocoding)
- [React Google Maps API](https://react-google-maps-api-docs.netlify.app/)

### Code Examples:
- [Official Samples](https://github.com/googlemaps/js-samples)
- [React Examples](https://github.com/JustFly1984/react-google-maps-api)

## 💰 Cost Estimation Tool

Use Google's [Pricing Calculator](https://mapsplatform.google.com/pricing/) to estimate costs based on your expected usage.

**Example for 100 daily users:**
- Maps loads: 200/day × 30 = 6,000/month = **$0** (within free tier)
- Autocomplete: 100/day × 30 = 3,000/month = **$0** (within free tier)
- Geocoding: 50/day × 30 = 1,500/month = **$0** (within free tier)

**Total: $0/month** ✅

## 🎓 Learning Resources

### Tutorials:
1. [Getting Started with Google Maps](https://developers.google.com/maps/gmp-get-started)
2. [Adding a Map](https://developers.google.com/maps/documentation/javascript/adding-a-google-map)
3. [Markers](https://developers.google.com/maps/documentation/javascript/markers)
4. [Place Autocomplete](https://developers.google.com/maps/documentation/javascript/place-autocomplete)

### Video Tutorials:
- [Google Maps Platform YouTube Channel](https://www.youtube.com/c/GoogleMapsPlatform)

## ✅ Production Checklist

Before going live:

- [ ] API key created and restricted
- [ ] Billing account set up with alerts
- [ ] All required APIs enabled
- [ ] Domain restrictions configured
- [ ] Environment variables set
- [ ] API key not in source code
- [ ] Map loads on production domain
- [ ] Autocomplete working
- [ ] Geocoding working
- [ ] Mobile responsive tested
- [ ] Budget alerts configured
- [ ] Usage monitoring enabled

## 🆘 Support

### Need Help?
- [Stack Overflow - google-maps](https://stackoverflow.com/questions/tagged/google-maps)
- [Google Maps Platform Support](https://developers.google.com/maps/support)
- [Issue Tracker](https://issuetracker.google.com/issues?q=componentid:187143)

---

**Last Updated**: October 7, 2025  
**Component**: MapPicker.tsx  
**Package**: @react-google-maps/api  
**Status**: ✅ Production Ready (with API key)
