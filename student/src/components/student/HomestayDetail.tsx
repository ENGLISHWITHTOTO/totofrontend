import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Star, MapPin, Clock, Home, Heart, Share2, Copy, Check,
  Wifi, Car, Coffee, Book, Music, Utensils, Calendar, Users, 
  MessageCircle, Phone, Mail, Globe, Shield
} from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
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
  stayDuration: string
}

interface HomestayDetails {
  id: string
  title: string
  hostName: string
  hostImage: string
  hostAge: string
  hostOccupation: string
  hostBio: string
  description: string
  detailedDescription: string
  country: string
  city: string
  address: string
  pricePerWeek: number
  roomType: 'Private' | 'Shared' | 'Single' | 'Double'
  mealsIncluded: string
  amenities: string[]
  rating: number
  reviewCount: number
  image: string
  gallery: string[]
  availability: string[]
  languages: string[]
  houseRules: string[]
  isFavorited: boolean
  responseTime: string
  verified: boolean
  familyMembers: {
    adults: number
    children: number
    pets: string[]
  }
  location: {
    neighborhood: string
    transport: string[]
    walkingDistance: {
      school: string
      supermarket: string
      restaurant: string
      metro: string
    }
    safety: string
  }
  accommodation: {
    roomSize: string
    furnishing: string[]
    privateItems: string[]
    sharedSpaces: string[]
  }
  policies: {
    checkIn: string
    checkOut: string
    guests: string
    smoking: boolean
    alcohol: boolean
    curfew: string
    cleaning: string
  }
  reviews: Review[]
}

// Mock homestay details
const mockHomestayDetails: HomestayDetails = {
  id: '1',
  title: 'Cozy Family Home in Barcelona',
  hostName: 'Maria & Carlos Gutierrez',
  hostImage: 'https://images.unsplash.com/photo-1705051239816-4cf3d4d6d153?w=200&h=200&fit=crop&crop=face',
  hostAge: '45 & 48 years old',
  hostOccupation: 'Teacher & Engineer',
  hostBio: 'We are a warm Spanish family who loves meeting people from different cultures. Maria teaches at a local school and Carlos works as an engineer. We have been hosting international students for over 8 years and enjoy sharing our Spanish culture and traditions.',
  description: 'Warm Spanish family welcomes international students. Located in quiet residential area with easy metro access.',
  detailedDescription: 'Our family home is located in a peaceful residential neighborhood in Barcelona, just 15 minutes by metro from the city center. We offer a comfortable and safe environment for international students who want to experience authentic Spanish family life while studying Spanish. Our home has a beautiful garden where we often have family barbecues and our guests are always welcome to join us.',
  country: 'Spain',
  city: 'Barcelona',
  address: 'Gràcia District, Barcelona',
  pricePerWeek: 280,
  roomType: 'Private',
  mealsIncluded: 'Breakfast & Dinner',
  amenities: ['WiFi', 'Laundry', 'Garden', 'Piano', 'Library', 'Air Conditioning', 'Heating', 'Kitchen Access'],
  rating: 4.9,
  reviewCount: 67,
  image: 'https://images.unsplash.com/photo-1705051239816-4cf3d4d6d153?w=600&h=400&fit=crop',
  gallery: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1501183007986-d0c5d9e53c68?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop'
  ],
  availability: ['March - December 2024'],
  languages: ['Spanish', 'English', 'Catalan'],
  houseRules: ['No smoking indoors', 'Quiet hours 10pm-8am', 'Guests welcome with advance notice', 'Help with dinner preparation appreciated'],
  isFavorited: false,
  responseTime: '< 2 hours',
  verified: true,
  familyMembers: {
    adults: 2,
    children: 1,
    pets: ['Cat (Mittens)']
  },
  location: {
    neighborhood: 'Gràcia - Safe, family-friendly area with local charm',
    transport: ['Metro L3 (Green line)', 'Bus lines 24, 27, 32', 'Bike lanes nearby'],
    walkingDistance: {
      school: '20 minutes walk to city center schools',
      supermarket: '5 minutes',
      restaurant: '3 minutes',
      metro: '8 minutes'
    },
    safety: 'Very safe neighborhood with low crime rate'
  },
  accommodation: {
    roomSize: '12 m² private room',
    furnishing: ['Single bed', 'Desk & chair', 'Wardrobe', 'Bookshelf', 'Reading lamp'],
    privateItems: ['Private key', 'Fresh linens weekly', 'Towels provided'],
    sharedSpaces: ['Living room', 'Kitchen', 'Garden', 'Bathroom (shared with 1 other student)']
  },
  policies: {
    checkIn: 'Flexible between 14:00-20:00',
    checkOut: 'Before 11:00',
    guests: 'Occasional guests welcome with 24h notice',
    smoking: false,
    alcohol: true,
    curfew: 'None, but please be respectful during quiet hours',
    cleaning: 'Weekly room cleaning included'
  },
  reviews: [
    {
      id: '1',
      studentName: 'Jennifer Walsh',
      studentAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      studentCountry: 'Ireland',
      rating: 5,
      comment: 'Maria and Carlos are the most welcoming hosts! They made me feel like part of the family from day one. The location is perfect and the Spanish practice over dinner was invaluable.',
      date: '2 weeks ago',
      stayDuration: '4 weeks'
    },
    {
      id: '2',
      studentName: 'Hans Mueller',
      studentAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      studentCountry: 'Germany',
      rating: 5,
      comment: 'Fantastic homestay experience! The room was comfortable, meals were delicious, and I learned so much Spanish just from daily conversations. Highly recommend!',
      date: '1 month ago',
      stayDuration: '6 weeks'
    },
    {
      id: '3',
      studentName: 'Yuki Tanaka',
      studentAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
      studentCountry: 'Japan',
      rating: 5,
      comment: 'Perfect family! They were so patient with my Spanish and always included me in family activities. The garden barbecues were my favorite memories.',
      date: '2 months ago',
      stayDuration: '8 weeks'
    }
  ]
}

export default function HomestayDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [homestay] = useState<HomestayDetails>(mockHomestayDetails)
  const [isFavorited, setIsFavorited] = useState(homestay.isFavorited)
  const [copied, setCopied] = useState(false)

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited)
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites')
  }

  const shareHomestay = () => {
    if (navigator.share) {
      navigator.share({
        title: homestay.title,
        text: homestay.description,
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

  const contactHost = () => {
    navigate(`/study-abroad/homestays/${id}/contact`, {
      state: { homestay }
    })
  }

  const bookHomestay = () => {
    navigate(`/study-abroad/homestays/${id}/book`, {
      state: { homestay }
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

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase()
    if (lower.includes('wifi')) return <Wifi className="w-4 h-4" />
    if (lower.includes('laundry')) return <Home className="w-4 h-4" />
    if (lower.includes('garden')) return <Coffee className="w-4 h-4" />
    if (lower.includes('piano')) return <Music className="w-4 h-4" />
    if (lower.includes('library')) return <Book className="w-4 h-4" />
    if (lower.includes('kitchen')) return <Utensils className="w-4 h-4" />
    if (lower.includes('car')) return <Car className="w-4 h-4" />
    return <Home className="w-4 h-4" />
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
            <h1>Homestay Details</h1>
            <p className="text-sm text-muted-foreground">{homestay.address}</p>
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
              onClick={shareHomestay}
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
              src={homestay.image}
              alt={homestay.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-2">
                {homestay.verified && (
                  <Badge className="bg-green-500 gap-1">
                    <Shield className="w-3 h-3" />
                    Verified Host
                  </Badge>
                )}
                <Badge variant="secondary">{homestay.roomType} Room</Badge>
              </div>
              <h1 className="text-white text-xl mb-1">{homestay.title}</h1>
              <div className="flex items-center gap-4 text-white/90 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {homestay.city}, {homestay.country}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Responds {homestay.responseTime}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Host Info */}
            <Card className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <img src={homestay.hostImage} alt={homestay.hostName} className="w-full h-full object-cover rounded-full" />
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{homestay.hostName}</h3>
                    {homestay.verified && (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Shield className="w-3 h-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {homestay.hostAge} • {homestay.hostOccupation}
                  </p>
                  <div className="flex items-center gap-4 text-sm mb-3">
                    <div className="flex items-center gap-1">
                      {renderStars(Math.floor(homestay.rating))}
                      <span className="font-medium">{homestay.rating}</span>
                      <span className="text-muted-foreground">({homestay.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Responds {homestay.responseTime}</span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{homestay.hostBio}</p>
                </div>
              </div>
            </Card>

            {/* Quick Info */}
            <Card className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">${homestay.pricePerWeek}</div>
                  <div className="text-sm text-muted-foreground">per week</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{homestay.roomType} Room</div>
                  <div className="text-sm text-muted-foreground">{homestay.mealsIncluded}</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Languages Spoken</div>
                    <div className="text-muted-foreground">{homestay.languages.join(', ')}</div>
                  </div>
                  <div>
                    <div className="font-medium">Family Size</div>
                    <div className="text-muted-foreground">
                      {homestay.familyMembers.adults} adults, {homestay.familyMembers.children} child
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Content Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="accommodation">Room</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Description */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">About This Homestay</h3>
                  <p className="text-sm leading-relaxed mb-4">{homestay.detailedDescription}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Family Members</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>{homestay.familyMembers.adults} adults, {homestay.familyMembers.children} child</p>
                        {homestay.familyMembers.pets.length > 0 && (
                          <p>Pets: {homestay.familyMembers.pets.join(', ')}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Languages Spoken</h4>
                      <div className="flex flex-wrap gap-2">
                        {homestay.languages.map((language) => (
                          <Badge key={language} variant="outline" className="text-xs">{language}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Amenities */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {homestay.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2 text-sm">
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* House Rules */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">House Rules</h3>
                  <ul className="space-y-2">
                    {homestay.houseRules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Gallery */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Home Gallery</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {homestay.gallery.map((image, index) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Home ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="accommodation" className="space-y-4">
                {/* Room Details */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Your Room</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Room Type</div>
                        <div className="text-muted-foreground">{homestay.roomType}</div>
                      </div>
                      <div>
                        <div className="font-medium">Room Size</div>
                        <div className="text-muted-foreground">{homestay.accommodation.roomSize}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Room Furnishing</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {homestay.accommodation.furnishing.map((item) => (
                          <div key={item} className="flex items-center gap-2 text-sm">
                            <Check className="w-3 h-3 text-green-500" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">What's Included</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {homestay.accommodation.privateItems.map((item) => (
                          <div key={item} className="flex items-center gap-2 text-sm">
                            <Check className="w-3 h-3 text-green-500" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Shared Spaces</h4>
                      <div className="flex flex-wrap gap-2">
                        {homestay.accommodation.sharedSpaces.map((space) => (
                          <Badge key={space} variant="outline" className="text-xs">{space}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Policies */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Policies</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Check-in:</span>
                      <span>{homestay.policies.checkIn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-out:</span>
                      <span>{homestay.policies.checkOut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guests:</span>
                      <span>{homestay.policies.guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Smoking:</span>
                      <span>{homestay.policies.smoking ? 'Allowed' : 'Not allowed'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Curfew:</span>
                      <span>{homestay.policies.curfew}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cleaning:</span>
                      <span>{homestay.policies.cleaning}</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                {/* Location Info */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Neighborhood</h3>
                  <p className="text-sm text-muted-foreground mb-3">{homestay.location.neighborhood}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Transportation</h4>
                      <div className="flex flex-wrap gap-2">
                        {homestay.location.transport.map((transport) => (
                          <Badge key={transport} variant="outline" className="text-xs">{transport}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Walking Distance</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Language school:</span>
                          <span>{homestay.location.walkingDistance.school}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Metro station:</span>
                          <span>{homestay.location.walkingDistance.metro}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Supermarket:</span>
                          <span>{homestay.location.walkingDistance.supermarket}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Restaurants:</span>
                          <span>{homestay.location.walkingDistance.restaurant}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Safety</h4>
                      <p className="text-sm text-muted-foreground">{homestay.location.safety}</p>
                    </div>
                  </div>
                </Card>

                {/* Availability */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Availability</h3>
                  <div className="space-y-2">
                    {homestay.availability.map((period, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{period}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Guest Reviews</h3>
                    <p className="text-sm text-muted-foreground">{homestay.reviewCount} total reviews</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(Math.floor(homestay.rating))}</div>
                    <span className="font-medium">{homestay.rating}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {homestay.reviews.map((review) => (
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
                                <span>{review.stayDuration}</span>
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
                  View All Reviews ({homestay.reviewCount})
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="p-4 border-t bg-card">
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={contactHost}
            className="gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Contact Host
          </Button>
          <Button 
            className="flex-1 gap-2"
            onClick={bookHomestay}
          >
            <Home className="w-4 h-4" />
            Book Homestay - ${homestay.pricePerWeek}/week
          </Button>
        </div>
      </div>
    </div>
  )
}