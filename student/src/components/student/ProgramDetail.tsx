import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Star, MapPin, Calendar, Users, Clock, Plane, 
  Globe, Award, BookOpen, Heart, Share2, Copy, Check,
  GraduationCap, Coffee, Camera, Music, Utensils, Car
} from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Progress } from '../ui/progress'
import { Avatar } from '../ui/avatar'
import { toast } from 'sonner'

interface Review {
  id: string
  studentName: string
  studentAvatar: string
  studentCountry: string
  rating: number
  comment: string
  date: string
  program: string
}

interface ProgramDetails {
  id: string
  title: string
  description: string
  detailedDescription: string
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
  gallery: string[]
  includes: string[]
  highlights: string[]
  isFavorited: boolean
  isPopular?: boolean
  ageRange: string
  schedule: {
    weeklyHours: number
    classSize: string
    levels: string[]
    materials: string[]
  }
  accommodation: {
    types: string[]
    priceRange: string
    amenities: string[]
  }
  activities: {
    cultural: string[]
    social: string[]
    excursions: string[]
  }
  requirements: {
    age: string
    language: string
    documents: string[]
    deadline: string
  }
  support: {
    airport: boolean
    orientation: boolean
    academic: boolean
    emergency: boolean
  }
  location: {
    description: string
    transport: string[]
    attractions: string[]
    climate: string
  }
  certification: {
    provided: boolean
    type: string
    accreditation: string[]
  }
  reviews: Review[]
}

// Mock program details
const mockProgramDetails: ProgramDetails = {
  id: '1',
  title: 'Spanish Immersion in Madrid',
  description: 'Complete Spanish language immersion program in the heart of Madrid with cultural activities and excursions.',
  detailedDescription: 'This comprehensive Spanish language immersion program is designed to rapidly improve your Spanish skills while experiencing authentic Spanish culture. Located in the vibrant heart of Madrid, students will study at our modern facilities just minutes from major attractions like the Prado Museum and Retiro Park. Our intensive program combines classroom learning with real-world practice through cultural activities, city tours, and interaction with local families.',
  country: 'Spain',
  city: 'Madrid',
  institution: 'Instituto Cervantes Madrid',
  duration: '4 weeks',
  price: 2499,
  language: 'Spanish',
  level: 'All Levels',
  type: 'Language School',
  startDates: ['Mar 15, 2024', 'Apr 12, 2024', 'May 10, 2024', 'Jun 7, 2024', 'Jul 5, 2024'],
  maxStudents: 15,
  currentEnrollment: 8,
  rating: 4.8,
  reviewCount: 234,
  image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=600&h=400&fit=crop',
  gallery: [
    'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1544026527-794b4666e30c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1606737187009-5d01c9d35c4b?w=400&h=300&fit=crop'
  ],
  includes: ['20 hours/week classes', 'Cultural activities', 'Airport transfer', 'Study materials', 'Welcome orientation', 'Certificate of completion'],
  highlights: ['Experienced native teachers', 'Small class sizes (max 12)', 'Central Madrid location', 'Cultural immersion', 'Certificate included', 'Student support'],
  isFavorited: false,
  isPopular: true,
  ageRange: '18-65',
  schedule: {
    weeklyHours: 20,
    classSize: '8-12 students',
    levels: ['A1 Beginner', 'A2 Elementary', 'B1 Intermediate', 'B2 Upper-Intermediate', 'C1 Advanced'],
    materials: ['Textbooks included', 'Digital resources', 'Audio materials', 'Grammar workbook']
  },
  accommodation: {
    types: ['Homestay', 'Student residence', 'Shared apartment', 'Hotel'],
    priceRange: '€180-450/week',
    amenities: ['WiFi', 'Breakfast included', 'Laundry facilities', '24/7 support']
  },
  activities: {
    cultural: ['Flamenco workshops', 'Spanish cooking classes', 'Art museum tours', 'Traditional festivals'],
    social: ['Welcome dinner', 'Student mixers', 'Language exchange', 'Movie nights'],
    excursions: ['Toledo day trip', 'Segovia excursion', 'Royal Palace tour', 'Park del Retiro walks']
  },
  requirements: {
    age: '18+ years old',
    language: 'No prior Spanish required',
    documents: ['Valid passport', 'Travel insurance', 'Emergency contact'],
    deadline: '2 weeks before start date'
  },
  support: {
    airport: true,
    orientation: true,
    academic: true,
    emergency: true
  },
  location: {
    description: 'Located in central Madrid, 5 minutes walk from Sol metro station',
    transport: ['Metro', 'Bus', 'Walking distance to major sites'],
    attractions: ['Prado Museum', 'Retiro Park', 'Royal Palace', 'Puerta del Sol'],
    climate: 'Mediterranean continental climate, warm summers, mild winters'
  },
  certification: {
    provided: true,
    type: 'Certificate of Completion',
    accreditation: ['Instituto Cervantes', 'DELE preparation', 'CEFR aligned']
  },
  reviews: [
    {
      id: '1',
      studentName: 'Emma Johnson',
      studentAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      studentCountry: 'USA',
      rating: 5,
      comment: 'Amazing experience! The teachers were incredibly patient and the cultural activities really helped me practice Spanish in real situations. Madrid is such a vibrant city.',
      date: '2 weeks ago',
      program: 'Spanish Immersion'
    },
    {
      id: '2',
      studentName: 'David Kim',
      studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      studentCountry: 'South Korea',
      rating: 5,
      comment: 'Perfect program for beginners. I went from zero Spanish to being able to have conversations in just 4 weeks. The homestay was incredible too!',
      date: '1 month ago',
      program: 'Spanish Immersion'
    },
    {
      id: '3',
      studentName: 'Sarah Miller',
      studentAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
      studentCountry: 'UK',
      rating: 4,
      comment: 'Great program with excellent organization. The only minor issue was that some activities were weather dependent, but overall fantastic experience.',
      date: '6 weeks ago',
      program: 'Spanish Immersion'
    }
  ]
}

export default function ProgramDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [program] = useState<ProgramDetails>(mockProgramDetails)
  const [isFavorited, setIsFavorited] = useState(program.isFavorited)
  const [selectedStartDate, setSelectedStartDate] = useState(program.startDates[0])
  const [copied, setCopied] = useState(false)

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited)
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites')
  }

  const shareProgram = () => {
    if (navigator.share) {
      navigator.share({
        title: program.title,
        text: program.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true)
        toast.success('Link copied to clipboard')
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  const bookProgram = () => {
    navigate(`/study-abroad/programs/${id}/book`, {
      state: { program, selectedStartDate }
    })
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const getIconForActivity = (activity: string) => {
    if (activity.toLowerCase().includes('cooking')) return <Utensils className="w-4 h-4" />
    if (activity.toLowerCase().includes('museum')) return <Camera className="w-4 h-4" />
    if (activity.toLowerCase().includes('music')) return <Music className="w-4 h-4" />
    if (activity.toLowerCase().includes('flamenco')) return <Music className="w-4 h-4" />
    return <Coffee className="w-4 h-4" />
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1>Program Details</h1>
            <p className="text-sm text-muted-foreground">{program.institution}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFavorite}
              className="gap-2"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareProgram}
              className="gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-6">
          {/* Hero Image */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={program.image}
              alt={program.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-2">
                {program.isPopular && (
                  <Badge className="bg-orange-500">Popular</Badge>
                )}
                <Badge variant="secondary">{program.type}</Badge>
              </div>
              <h1 className="text-white text-xl mb-1">{program.title}</h1>
              <div className="flex items-center gap-4 text-white/90 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {program.city}, {program.country}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {program.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {program.currentEnrollment}/{program.maxStudents}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Quick Info */}
            <Card className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">${program.price.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Program Cost</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {renderStars(Math.floor(program.rating))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {program.rating} ({program.reviewCount} reviews)
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Language</div>
                    <div className="text-muted-foreground">{program.language}</div>
                  </div>
                  <div>
                    <div className="font-medium">Level</div>
                    <div className="text-muted-foreground">{program.level}</div>
                  </div>
                  <div>
                    <div className="font-medium">Age Range</div>
                    <div className="text-muted-foreground">{program.ageRange}</div>
                  </div>
                  <div>
                    <div className="font-medium">Class Size</div>
                    <div className="text-muted-foreground">{program.schedule.classSize}</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Enrollment Progress */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Enrollment Status</h3>
                <span className="text-sm text-muted-foreground">
                  {program.currentEnrollment} of {program.maxStudents} spots filled
                </span>
              </div>
              <Progress value={(program.currentEnrollment / program.maxStudents) * 100} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {program.maxStudents - program.currentEnrollment} spots remaining
              </p>
            </Card>

            {/* Start Dates */}
            <Card className="p-4">
              <h3 className="font-medium mb-3">Available Start Dates</h3>
              <div className="grid grid-cols-2 gap-2">
                {program.startDates.map((date) => (
                  <Button
                    key={date}
                    variant={selectedStartDate === date ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStartDate(date)}
                    className="gap-2 justify-start"
                  >
                    <Calendar className="w-4 h-4" />
                    {date}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Content Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="program">Program</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Description */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">About This Program</h3>
                  <p className="text-sm leading-relaxed mb-4">{program.detailedDescription}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Program Highlights</h4>
                      <ul className="space-y-1">
                        {program.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <Check className="w-3 h-3 text-green-500" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">What's Included</h4>
                      <ul className="space-y-1">
                        {program.includes.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <Check className="w-3 h-3 text-green-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Gallery */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Program Gallery</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {program.gallery.map((image, index) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Program ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="program" className="space-y-4">
                {/* Schedule */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Program Schedule</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Weekly Hours</div>
                      <div className="text-muted-foreground">{program.schedule.weeklyHours} hours</div>
                    </div>
                    <div>
                      <div className="font-medium">Class Size</div>
                      <div className="text-muted-foreground">{program.schedule.classSize}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="font-medium mb-2">Available Levels</div>
                    <div className="flex flex-wrap gap-2">
                      {program.schedule.levels.map((level) => (
                        <Badge key={level} variant="outline" className="text-xs">{level}</Badge>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Activities */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Cultural Activities</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Cultural Activities</h4>
                      <div className="space-y-2">
                        {program.activities.cultural.map((activity, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {getIconForActivity(activity)}
                            {activity}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Social Events</h4>
                      <div className="space-y-2">
                        {program.activities.social.map((activity, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Coffee className="w-4 h-4" />
                            {activity}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Excursions</h4>
                      <div className="space-y-2">
                        {program.activities.excursions.map((activity, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Car className="w-4 h-4" />
                            {activity}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Requirements */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Requirements</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Age requirement:</span>
                      <span>{program.requirements.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Language level:</span>
                      <span>{program.requirements.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Application deadline:</span>
                      <span>{program.requirements.deadline}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="font-medium mb-2">Required Documents</div>
                    <ul className="space-y-1">
                      {program.requirements.documents.map((doc, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-3 h-3 text-green-500" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                {/* Location Info */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Location & Transportation</h3>
                  <p className="text-sm text-muted-foreground mb-3">{program.location.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Transportation</h4>
                      <div className="flex flex-wrap gap-2">
                        {program.location.transport.map((transport) => (
                          <Badge key={transport} variant="outline" className="text-xs">{transport}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Nearby Attractions</h4>
                      <div className="flex flex-wrap gap-2">
                        {program.location.attractions.map((attraction) => (
                          <Badge key={attraction} variant="secondary" className="text-xs">{attraction}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Climate</h4>
                      <p className="text-sm text-muted-foreground">{program.location.climate}</p>
                    </div>
                  </div>
                </Card>

                {/* Accommodation */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Accommodation Options</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium text-sm mb-2">Available Types</div>
                      <div className="flex flex-wrap gap-2">
                        {program.accommodation.types.map((type) => (
                          <Badge key={type} variant="outline" className="text-xs">{type}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-sm mb-2">Price Range</div>
                      <div className="text-sm text-muted-foreground">{program.accommodation.priceRange}</div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-sm mb-2">Amenities</div>
                      <div className="flex flex-wrap gap-2">
                        {program.accommodation.amenities.map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="text-xs">{amenity}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Student Reviews</h3>
                    <p className="text-sm text-muted-foreground">{program.reviewCount} total reviews</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(Math.floor(program.rating))}</div>
                    <span className="font-medium">{program.rating}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {program.reviews.map((review) => (
                    <Card key={review.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <img src={review.studentAvatar} alt={review.studentName} className="w-full h-full object-cover rounded-full" />
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-medium text-sm">{review.studentName}</div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{review.studentCountry}</span>
                                <span>•</span>
                                <span>{review.date}</span>
                              </div>
                            </div>
                            <div className="flex">{renderStars(review.rating)}</div>
                          </div>
                          <p className="text-sm leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <Button variant="outline" className="w-full">
                  View All Reviews ({program.reviewCount})
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ScrollArea>

      {/* Book Button */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-sm text-muted-foreground">Selected start date</div>
            <div className="font-medium">{selectedStartDate}</div>
          </div>
          <Button 
            className="gap-2"
            onClick={bookProgram}
          >
            <Plane className="w-4 h-4" />
            Book Program - ${program.price.toLocaleString()}
          </Button>
        </div>
      </div>
    </div>
  )
}