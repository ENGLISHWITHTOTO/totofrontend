import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, MapPin, Calendar, Users, Star, Heart, Clock, Plane, Home, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface StudyProgram {
  id: string
  title: string
  description: string
  country: string
  city: string
  institution: string
  duration: string
  price: number
  language: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
  type: 'Language School' | 'University' | 'Immersion' | 'Homestay'
  startDates: string[]
  maxStudents: number
  currentEnrollment: number
  rating: number
  reviewCount: number
  image: string
  includes: string[]
  highlights: string[]
  isFavorited: boolean
  isPopular?: boolean
  ageRange: string
  // New fields for enhanced filtering
  includesAccommodation: boolean
  includesMeals: boolean
  hoursPerWeek: number
}

interface Homestay {
  id: string
  title: string
  hostName: string
  hostImage: string
  description: string
  country: string
  city: string
  pricePerWeek: number
  roomType: 'Private' | 'Shared' | 'Single' | 'Double'
  mealsIncluded: string
  amenities: string[]
  rating: number
  reviewCount: number
  image: string
  availability: string[]
  languages: string[]
  houseRules: string[]
  isFavorited: boolean
  responseTime: string
  // New fields for enhanced filtering
  includesAccommodation: boolean
  includesMeals: boolean
}

// Dynamic filter configuration - this could be managed from Admin Panel
interface FilterConfig {
  id: string
  label: string
  type: 'select' | 'boolean' | 'range'
  options?: string[]
  defaultValue: any
  appliesToPrograms: boolean
  appliesToHomestays: boolean
}

const dynamicFilters: FilterConfig[] = [
  {
    id: 'country',
    label: 'Country',
    type: 'select',
    options: ['All Countries', 'Spain', 'France', 'Japan', 'Germany', 'Italy', 'China', 'South Korea'],
    defaultValue: 'All Countries',
    appliesToPrograms: true,
    appliesToHomestays: true
  },
  {
    id: 'language',
    label: 'Language',
    type: 'select',
    options: ['All Languages', 'Spanish', 'French', 'Japanese', 'German', 'Italian', 'Chinese', 'Korean'],
    defaultValue: 'All Languages',
    appliesToPrograms: true,
    appliesToHomestays: false
  },
  {
    id: 'duration',
    label: 'Duration',
    type: 'select',
    options: ['All Durations', '2-4 weeks', '1-2 months', '3-6 months', '6+ months'],
    defaultValue: 'All Durations',
    appliesToPrograms: true,
    appliesToHomestays: false
  },
  {
    id: 'includesAccommodation',
    label: 'Includes Accommodation',
    type: 'boolean',
    defaultValue: null,
    appliesToPrograms: true,
    appliesToHomestays: true
  },
  {
    id: 'includesMeals',
    label: 'Includes Meals',
    type: 'boolean',
    defaultValue: null,
    appliesToPrograms: true,
    appliesToHomestays: true
  },
  {
    id: 'hoursPerWeek',
    label: 'Hours per Week',
    type: 'select',
    options: ['Any Hours', '10-15 hours', '16-20 hours', '21-25 hours', '26+ hours'],
    defaultValue: 'Any Hours',
    appliesToPrograms: true,
    appliesToHomestays: false
  }
]

const mockPrograms: StudyProgram[] = [
  {
    id: '1',
    title: 'Spanish Immersion in Madrid',
    description: 'Complete Spanish language immersion program in the heart of Madrid with cultural activities and excursions.',
    country: 'Spain',
    city: 'Madrid',
    institution: 'Instituto Cervantes Madrid',
    duration: '4 weeks',
    price: 2499,
    language: 'Spanish',
    level: 'All Levels',
    type: 'Language School',
    startDates: ['Mar 15', 'Apr 12', 'May 10', 'Jun 7'],
    maxStudents: 15,
    currentEnrollment: 8,
    rating: 4.8,
    reviewCount: 234,
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=400&h=250&fit=crop',
    includes: ['20 hours/week classes', 'Cultural activities', 'Airport transfer', 'Study materials'],
    highlights: ['Experienced teachers', 'Small class sizes', 'Central location', 'Certificate included'],
    isFavorited: false,
    isPopular: true,
    ageRange: '18-65',
    includesAccommodation: true,
    includesMeals: false,
    hoursPerWeek: 20
  },
  {
    id: '2',
    title: 'Japanese Language & Culture Tokyo',
    description: 'Intensive Japanese language program combined with traditional cultural experiences in Tokyo.',
    country: 'Japan',
    city: 'Tokyo',
    institution: 'Tokyo International School',
    duration: '8 weeks',
    price: 4299,
    language: 'Japanese',
    level: 'Beginner',
    type: 'University',
    startDates: ['Apr 1', 'Jul 1', 'Oct 1'],
    maxStudents: 20,
    currentEnrollment: 12,
    rating: 4.9,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=250&fit=crop',
    includes: ['25 hours/week classes', 'Tea ceremony', 'Calligraphy lessons', 'City tours'],
    highlights: ['University partnership', 'Cultural immersion', 'JLPT preparation', 'Job placement support'],
    isFavorited: true,
    ageRange: '18-35',
    includesAccommodation: true,
    includesMeals: true,
    hoursPerWeek: 25
  },
  {
    id: '3',
    title: 'French Cuisine & Language Lyon',
    description: 'Learn French while discovering French cuisine in the gastronomic capital of France.',
    country: 'France',
    city: 'Lyon',
    institution: 'École Lyonnaise',
    duration: '6 weeks',
    price: 3199,
    language: 'French',
    level: 'Intermediate',
    type: 'Immersion',
    startDates: ['May 1', 'Sep 1'],
    maxStudents: 12,
    currentEnrollment: 7,
    rating: 4.7,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=250&fit=crop',
    includes: ['French classes', 'Cooking workshops', 'Market visits', 'Restaurant tours'],
    highlights: ['Professional chefs', 'Local markets', 'Wine tasting', 'Recipe collection'],
    isFavorited: false,
    ageRange: '21-55',
    includesAccommodation: false,
    includesMeals: true,
    hoursPerWeek: 15
  },
  {
    id: '4',
    title: 'German Business Language Course',
    description: 'Professional German language course designed for business professionals and career advancement.',
    country: 'Germany',
    city: 'Berlin',
    institution: 'Berlin Business Academy',
    duration: '12 weeks',
    price: 3899,
    language: 'German',
    level: 'Intermediate',
    type: 'Language School',
    startDates: ['Jan 8', 'Apr 8', 'Jul 8', 'Oct 8'],
    maxStudents: 18,
    currentEnrollment: 14,
    rating: 4.6,
    reviewCount: 127,
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=250&fit=crop',
    includes: ['30 hours/week classes', 'Business workshops', 'Company visits', 'Certificate'],
    highlights: ['Industry connections', 'Job placement assistance', 'Modern facilities', 'Small groups'],
    isFavorited: false,
    ageRange: '22-45',
    includesAccommodation: true,
    includesMeals: false,
    hoursPerWeek: 30
  },
  {
    id: '5',
    title: 'Italian Art & Language Florence',
    description: 'Combine Italian language learning with Renaissance art history in beautiful Florence.',
    country: 'Italy',
    city: 'Florence',
    institution: 'Accademia Italiana',
    duration: '3 weeks',
    price: 1899,
    language: 'Italian',
    level: 'All Levels',
    type: 'Immersion',
    startDates: ['Jun 5', 'Jul 10', 'Aug 14'],
    maxStudents: 10,
    currentEnrollment: 6,
    rating: 4.9,
    reviewCount: 78,
    image: 'https://images.unsplash.com/photo-1543832923-44667a7c84d0?w=400&h=250&fit=crop',
    includes: ['Italian classes', 'Art history tours', 'Museum visits', 'Cooking class'],
    highlights: ['Expert art guides', 'Exclusive museum access', 'Local artists', 'Cultural immersion'],
    isFavorited: false,
    ageRange: '18-60',
    includesAccommodation: false,
    includesMeals: false,
    hoursPerWeek: 12
  }
]

const mockHomestays: Homestay[] = [
  {
    id: '1',
    title: 'Cozy Family Home in Barcelona',
    hostName: 'Maria & Carlos Gutierrez',
    hostImage: 'https://images.unsplash.com/photo-1705051239816-4cf3d4d6d153?w=100&h=100&fit=crop&crop=face',
    description: 'Warm Spanish family welcomes international students. Located in quiet residential area with easy metro access.',
    country: 'Spain',
    city: 'Barcelona',
    pricePerWeek: 280,
    roomType: 'Private',
    mealsIncluded: 'Breakfast & Dinner',
    amenities: ['WiFi', 'Laundry', 'Garden', 'Piano', 'Library'],
    rating: 4.9,
    reviewCount: 67,
    image: 'https://images.unsplash.com/photo-1705051239816-4cf3d4d6d153?w=400&h=250&fit=crop',
    availability: ['Mar - Dec'],
    languages: ['Spanish', 'English', 'Catalan'],
    houseRules: ['No smoking', 'Quiet hours 10pm-8am', 'Guests welcome'],
    isFavorited: false,
    responseTime: '< 2 hours',
    includesAccommodation: true,
    includesMeals: true
  },
  {
    id: '2',
    title: 'Modern Apartment Tokyo Center',
    hostName: 'Yuki Tanaka',
    hostImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
    description: 'Modern apartment in Shibuya district. Perfect for students wanting to experience Tokyo life.',
    country: 'Japan',
    city: 'Tokyo',
    pricePerWeek: 420,
    roomType: 'Private',
    mealsIncluded: 'Breakfast only',
    amenities: ['WiFi', 'Kitchen access', 'Gym', 'Rooftop terrace'],
    rating: 4.8,
    reviewCount: 134,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop',
    availability: ['Year round'],
    languages: ['Japanese', 'English'],
    houseRules: ['No parties', 'Shoes off indoors', 'Keep common areas clean'],
    isFavorited: true,
    responseTime: '< 1 hour',
    includesAccommodation: true,
    includesMeals: true
  },
  {
    id: '3',
    title: 'Charming Parisian Flat',
    hostName: 'Claire Moreau',
    hostImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    description: 'Classic Parisian apartment in Montmartre with artistic atmosphere and great local connections.',
    country: 'France',
    city: 'Paris',
    pricePerWeek: 380,
    roomType: 'Shared',
    mealsIncluded: 'Breakfast & Dinner',
    amenities: ['WiFi', 'Art studio', 'Balcony', 'Book collection'],
    rating: 4.6,
    reviewCount: 92,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
    availability: ['Apr - Oct'],
    languages: ['French', 'English', 'Italian'],
    houseRules: ['No smoking', 'Cultural discussions encouraged', 'Help with cooking'],
    isFavorited: false,
    responseTime: '< 3 hours',
    includesAccommodation: true,
    includesMeals: true
  },
  {
    id: '4',
    title: 'Student Residence Berlin',
    hostName: 'Thomas Weber',
    hostImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    description: 'Modern student residence in central Berlin with international community and excellent facilities.',
    country: 'Germany',
    city: 'Berlin',
    pricePerWeek: 320,
    roomType: 'Private',
    mealsIncluded: 'None',
    amenities: ['WiFi', 'Shared kitchen', 'Study rooms', 'Bike rental'],
    rating: 4.4,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop',
    availability: ['Year round'],
    languages: ['German', 'English'],
    houseRules: ['No smoking', 'Quiet study hours', 'Community events welcome'],
    isFavorited: false,
    responseTime: '< 4 hours',
    includesAccommodation: true,
    includesMeals: false
  }
]

export default function StudyAbroad() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('programs')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // Dynamic filter state
  const [filterValues, setFilterValues] = useState<Record<string, any>>(() => {
    const initialValues: Record<string, any> = {}
    dynamicFilters.forEach(filter => {
      initialValues[filter.id] = filter.defaultValue
    })
    return initialValues
  })

  // Get applicable filters for current tab
  const getApplicableFilters = () => {
    return dynamicFilters.filter(filter => 
      activeTab === 'programs' ? filter.appliesToPrograms : filter.appliesToHomestays
    )
  }

  // Update filter value
  const updateFilter = (filterId: string, value: any) => {
    setFilterValues(prev => ({
      ...prev,
      [filterId]: value
    }))
  }

  // Clear all filters
  const clearAllFilters = () => {
    const clearedValues: Record<string, any> = {}
    dynamicFilters.forEach(filter => {
      clearedValues[filter.id] = filter.defaultValue
    })
    setFilterValues(clearedValues)
  }

  // Filter programs
  const filteredPrograms = mockPrograms.filter(program => {
    // Search query
    const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.city.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Dynamic filters
    let matchesFilters = true
    
    // Country filter
    if (filterValues.country && filterValues.country !== 'All Countries') {
      matchesFilters = matchesFilters && program.country === filterValues.country
    }
    
    // Language filter
    if (filterValues.language && filterValues.language !== 'All Languages') {
      matchesFilters = matchesFilters && program.language === filterValues.language
    }
    
    // Duration filter
    if (filterValues.duration && filterValues.duration !== 'All Durations') {
      const weeks = parseInt(program.duration)
      switch (filterValues.duration) {
        case '2-4 weeks': matchesFilters = matchesFilters && weeks >= 2 && weeks <= 4; break
        case '1-2 months': matchesFilters = matchesFilters && weeks >= 4 && weeks <= 8; break
        case '3-6 months': matchesFilters = matchesFilters && weeks >= 12 && weeks <= 24; break
        case '6+ months': matchesFilters = matchesFilters && weeks >= 24; break
      }
    }
    
    // Accommodation filter
    if (filterValues.includesAccommodation !== null) {
      matchesFilters = matchesFilters && program.includesAccommodation === filterValues.includesAccommodation
    }
    
    // Meals filter
    if (filterValues.includesMeals !== null) {
      matchesFilters = matchesFilters && program.includesMeals === filterValues.includesMeals
    }
    
    // Hours per week filter
    if (filterValues.hoursPerWeek && filterValues.hoursPerWeek !== 'Any Hours') {
      const hours = program.hoursPerWeek
      switch (filterValues.hoursPerWeek) {
        case '10-15 hours': matchesFilters = matchesFilters && hours >= 10 && hours <= 15; break
        case '16-20 hours': matchesFilters = matchesFilters && hours >= 16 && hours <= 20; break
        case '21-25 hours': matchesFilters = matchesFilters && hours >= 21 && hours <= 25; break
        case '26+ hours': matchesFilters = matchesFilters && hours >= 26; break
      }
    }
    
    return matchesSearch && matchesFilters
  })

  // Filter homestays
  const filteredHomestays = mockHomestays.filter(homestay => {
    // Search query
    const matchesSearch = homestay.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         homestay.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         homestay.city.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Dynamic filters
    let matchesFilters = true
    
    // Country filter
    if (filterValues.country && filterValues.country !== 'All Countries') {
      matchesFilters = matchesFilters && homestay.country === filterValues.country
    }
    
    // Accommodation filter (always true for homestays, but included for consistency)
    if (filterValues.includesAccommodation !== null) {
      matchesFilters = matchesFilters && homestay.includesAccommodation === filterValues.includesAccommodation
    }
    
    // Meals filter
    if (filterValues.includesMeals !== null) {
      matchesFilters = matchesFilters && homestay.includesMeals === filterValues.includesMeals
    }
    
    return matchesSearch && matchesFilters
  })

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0
    dynamicFilters.forEach(filter => {
      const value = filterValues[filter.id]
      if (filter.type === 'boolean' && value !== null) count++
      else if (filter.type === 'select' && value !== filter.defaultValue) count++
    })
    return count
  }

  const toggleFavorite = (id: string, type: 'program' | 'homestay') => {
    // In real app, update favorites via API
    console.log('Toggle favorite:', type, id)
  }

  const bookProgram = (id: string) => {
    navigate(`/study-abroad/programs/${id}`)
  }

  const contactHost = (id: string) => {
    navigate(`/study-abroad/homestays/${id}`)
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <h1 className="mb-4">Study Abroad</h1>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="programs" className="gap-2">
              <Plane className="w-4 h-4" />
              Programs
            </TabsTrigger>
            <TabsTrigger value="homestays" className="gap-2">
              <Home className="w-4 h-4" />
              Homestays
            </TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={activeTab === 'programs' ? "Search programs, cities, or schools..." : "Search homestays or locations..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 relative"
              >
                <Filter className="w-4 h-4" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Dynamic Filter Options */}
            {showFilters && (
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-auto p-1 text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </Button>
                </div>

                {getApplicableFilters().map((filter) => (
                  <div key={filter.id}>
                    <Label className="text-sm font-medium mb-2 block">{filter.label}</Label>
                    
                    {filter.type === 'select' && (
                      <Select
                        value={filterValues[filter.id]}
                        onValueChange={(value) => updateFilter(filter.id, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`Select ${filter.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {filter.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {filter.type === 'boolean' && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${filter.id}-yes`}
                            checked={filterValues[filter.id] === true}
                            onCheckedChange={(checked) => updateFilter(filter.id, checked ? true : null)}
                          />
                          <Label htmlFor={`${filter.id}-yes`} className="text-sm">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${filter.id}-no`}
                            checked={filterValues[filter.id] === false}
                            onCheckedChange={(checked) => updateFilter(filter.id, checked ? false : null)}
                          />
                          <Label htmlFor={`${filter.id}-no`} className="text-sm">No</Label>
                        </div>
                        {filterValues[filter.id] !== null && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateFilter(filter.id, null)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Tabs>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        <Tabs value={activeTab} className="w-full">
          {/* Programs Tab */}
          <TabsContent value="programs" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredPrograms.length} programs found
              </p>
              <Button variant="outline" size="sm">
                Sort by: Popular
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredPrograms.map((program) => (
                <Card key={program.id} className="overflow-hidden">
                  <div className="flex">
                    {/* Image */}
                    <div className="relative w-32 h-32 shrink-0">
                      <img 
                        src={program.image} 
                        alt={program.title}
                        className="w-full h-full object-cover"
                      />
                      {program.isPopular && (
                        <Badge className="absolute top-2 left-2 text-xs">Popular</Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 p-1 h-auto bg-black/20 hover:bg-black/40"
                        onClick={() => toggleFavorite(program.id, 'program')}
                      >
                        <Heart 
                          className={`w-4 h-4 ${program.isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                        />
                      </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 
                            className="font-medium mb-1 cursor-pointer hover:text-primary"
                            onClick={() => navigate(`/study-abroad/programs/${program.id}`)}
                          >
                            {program.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <MapPin className="w-3 h-3" />
                            {program.city}, {program.country}
                          </div>
                          <p className="text-sm text-muted-foreground">{program.institution}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-lg">${program.price.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{program.duration}</p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{program.description}</p>

                      {/* Enhanced Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        <Badge variant="secondary" className="text-xs">{program.language}</Badge>
                        <Badge variant="outline" className="text-xs">{program.level}</Badge>
                        <Badge variant="outline" className="text-xs">{program.hoursPerWeek}h/week</Badge>
                        {program.includesAccommodation && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            Accommodation ✓
                          </Badge>
                        )}
                        {program.includesMeals && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            Meals ✓
                          </Badge>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {program.rating} ({program.reviewCount})
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {program.currentEnrollment}/{program.maxStudents} enrolled
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Next: {program.startDates[0]}
                        </div>
                      </div>

                      {/* Action */}
                      <Button 
                        className="w-full"
                        onClick={() => bookProgram(program.id)}
                      >
                        View Details & Book
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Homestays Tab */}
          <TabsContent value="homestays" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredHomestays.length} homestays found
              </p>
              <Button variant="outline" size="sm">
                Sort by: Rating
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredHomestays.map((homestay) => (
                <Card key={homestay.id} className="overflow-hidden">
                  <div className="flex">
                    {/* Image */}
                    <div className="relative w-32 h-32 shrink-0">
                      <img 
                        src={homestay.image} 
                        alt={homestay.title}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 p-1 h-auto bg-black/20 hover:bg-black/40"
                        onClick={() => toggleFavorite(homestay.id, 'homestay')}
                      >
                        <Heart 
                          className={`w-4 h-4 ${homestay.isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                        />
                      </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 
                            className="font-medium mb-1 cursor-pointer hover:text-primary"
                            onClick={() => navigate(`/study-abroad/homestays/${homestay.id}`)}
                          >
                            {homestay.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <MapPin className="w-3 h-3" />
                            {homestay.city}, {homestay.country}
                          </div>
                          <p className="text-sm">Host: {homestay.hostName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-lg">${homestay.pricePerWeek}/week</p>
                          <p className="text-xs text-muted-foreground">{homestay.roomType} room</p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{homestay.description}</p>

                      {/* Enhanced Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        <Badge variant="secondary" className="text-xs">{homestay.roomType}</Badge>
                        {homestay.includesMeals && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {homestay.mealsIncluded}
                          </Badge>
                        )}
                        {homestay.languages.slice(0, 2).map((lang) => (
                          <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                        ))}
                        {homestay.languages.length > 2 && (
                          <Badge variant="outline" className="text-xs">+{homestay.languages.length - 2}</Badge>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {homestay.rating} ({homestay.reviewCount})
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Responds {homestay.responseTime}
                        </div>
                      </div>

                      {/* Action */}
                      <Button 
                        className="w-full"
                        onClick={() => contactHost(homestay.id)}
                      >
                        Contact Host
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  )
}