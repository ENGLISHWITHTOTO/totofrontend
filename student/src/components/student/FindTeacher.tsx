import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Star, Clock, MapPin, Calendar, Heart, MessageCircle, Video, DollarSign } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { Avatar } from '../ui/avatar'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

interface Teacher {
  id: string
  name: string
  avatar: string
  bio: string
  languages: string[]
  nativeLanguage: string
  specialties: string[]
  rating: number
  reviewCount: number
  studentsCount: number
  lessonsTaught: number
  hourlyRate: number
  location: string
  timezone: string
  availability: 'Available' | 'Busy' | 'Offline'
  responseTime: string
  experience: string
  isVerified: boolean
  isFavorited: boolean
  nextAvailable: string
  certifications: string[]
  teachingStyle: string[]
}

const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Sofia Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1746513399803-e988cc54e812?w=100&h=100&fit=crop&crop=face',
    bio: 'Native Spanish speaker with 8+ years teaching experience. Specializing in conversational Spanish and business communication.',
    languages: ['Spanish', 'English', 'Portuguese'],
    nativeLanguage: 'Spanish',
    specialties: ['Conversation', 'Business Spanish', 'Grammar', 'Pronunciation'],
    rating: 4.9,
    reviewCount: 847,
    studentsCount: 234,
    lessonsTaught: 3420,
    hourlyRate: 25,
    location: 'Madrid, Spain',
    timezone: 'GMT+1',
    availability: 'Available',
    responseTime: '< 1 hour',
    experience: '8+ years',
    isVerified: true,
    isFavorited: false,
    nextAvailable: 'Today, 3:00 PM',
    certifications: ['DELE Certified', 'Universidad Complutense'],
    teachingStyle: ['Conversational', 'Interactive', 'Patient']
  },
  {
    id: '2',
    name: 'Hiroshi Tanaka',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    bio: 'Professional Japanese tutor specializing in business Japanese and JLPT preparation. Former corporate trainer.',
    languages: ['Japanese', 'English'],
    nativeLanguage: 'Japanese',
    specialties: ['Business Japanese', 'JLPT Prep', 'Kanji', 'Keigo'],
    rating: 4.8,
    reviewCount: 623,
    studentsCount: 156,
    lessonsTaught: 2840,
    hourlyRate: 30,
    location: 'Tokyo, Japan',
    timezone: 'GMT+9',
    availability: 'Busy',
    responseTime: '< 2 hours',
    experience: '10+ years',
    isVerified: true,
    isFavorited: true,
    nextAvailable: 'Tomorrow, 9:00 AM',
    certifications: ['JLPT N1', 'Tokyo University'],
    teachingStyle: ['Structured', 'Professional', 'Goal-oriented']
  },
  {
    id: '3',
    name: 'Marie Dubois',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    bio: 'French language expert with expertise in literature and culture. Perfect for intermediate to advanced learners.',
    languages: ['French', 'English', 'Italian'],
    nativeLanguage: 'French',
    specialties: ['Literature', 'Culture', 'Advanced Grammar', 'Pronunciation'],
    rating: 4.7,
    reviewCount: 234,
    studentsCount: 89,
    lessonsTaught: 1560,
    hourlyRate: 28,
    location: 'Paris, France',
    timezone: 'GMT+1',
    availability: 'Available',
    responseTime: '< 30 min',
    experience: '6+ years',
    isVerified: true,
    isFavorited: false,
    nextAvailable: 'Today, 6:00 PM',
    certifications: ['Sorbonne University', 'FLE Certification'],
    teachingStyle: ['Cultural', 'Literary', 'Immersive']
  },
  {
    id: '4',
    name: 'Klaus Mueller',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    bio: 'German engineer turned language teacher. Excellent for technical German and systematic grammar learning.',
    languages: ['German', 'English'],
    nativeLanguage: 'German',
    specialties: ['Grammar', 'Technical German', 'Business German', 'Test Prep'],
    rating: 4.6,
    reviewCount: 412,
    studentsCount: 167,
    lessonsTaught: 2100,
    hourlyRate: 22,
    location: 'Berlin, Germany',
    timezone: 'GMT+1',
    availability: 'Available',
    responseTime: '< 1 hour',
    experience: '5+ years',
    isVerified: true,
    isFavorited: false,
    nextAvailable: 'Today, 4:30 PM',
    certifications: ['Goethe Institute', 'Technical University Berlin'],
    teachingStyle: ['Systematic', 'Logical', 'Detail-oriented']
  }
]

const specialties = ['All', 'Conversation', 'Business', 'Grammar', 'Pronunciation', 'Test Prep', 'Literature', 'Culture']
const languages = ['All Languages', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Arabic', 'Italian']
const priceRanges = ['All Prices', '$10-20/hr', '$20-30/hr', '$30-40/hr', '$40+/hr']

export default function FindTeacher() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All')
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages')
  const [selectedPriceRange, setSelectedPriceRange] = useState('All Prices')
  const [showFilters, setShowFilters] = useState(false)

  const filteredTeachers = mockTeachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesSpecialty = selectedSpecialty === 'All' || teacher.specialties.includes(selectedSpecialty)
    const matchesLanguage = selectedLanguage === 'All Languages' || teacher.languages.includes(selectedLanguage)
    
    let matchesPrice = true
    if (selectedPriceRange !== 'All Prices') {
      const [min, max] = selectedPriceRange.replace('/hr', '').replace('$', '').split('-').map(p => parseInt(p) || Infinity)
      matchesPrice = teacher.hourlyRate >= min && teacher.hourlyRate <= max
    }
    
    return matchesSearch && matchesSpecialty && matchesLanguage && matchesPrice
  })

  const toggleFavorite = (teacherId: string) => {
    // In real app, update favorites via API
    console.log('Toggle favorite:', teacherId)
  }

  const bookLesson = (teacherId: string) => {
    navigate(`/teachers/${teacherId}`)
  }

  const sendMessage = (teacherId: string) => {
    // In real app, open chat with teacher
    console.log('Send message to:', teacherId)
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'bg-green-500'
      case 'Busy': return 'bg-yellow-500'
      case 'Offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <h1 className="mb-4">Find a Teacher</h1>
        
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search teachers by name, specialty, or language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Filter Tabs */}
          {showFilters && (
            <Tabs defaultValue="specialty" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="specialty">Specialty</TabsTrigger>
                <TabsTrigger value="language">Language</TabsTrigger>
                <TabsTrigger value="price">Price</TabsTrigger>
              </TabsList>
              
              <TabsContent value="specialty" className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty) => (
                    <Button
                      key={specialty}
                      variant={selectedSpecialty === specialty ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSpecialty(specialty)}
                    >
                      {specialty}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="language" className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {languages.map((language) => (
                    <Button
                      key={language}
                      variant={selectedLanguage === language ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedLanguage(language)}
                    >
                      {language}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="price" className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range) => (
                    <Button
                      key={range}
                      variant={selectedPriceRange === range ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPriceRange(range)}
                    >
                      {range}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      {/* Results */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredTeachers.length} teachers found
            </p>
            <Button variant="outline" size="sm">
              Sort by: Rating
            </Button>
          </div>

          {/* Teacher Cards */}
          <div className="grid gap-4">
            {filteredTeachers.map((teacher) => (
              <Card key={teacher.id} className="p-4">
                <div className="flex gap-4">
                  {/* Avatar and Status */}
                  <div className="relative">
                    <Avatar className="w-16 h-16">
                      <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover rounded-full" />
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getAvailabilityColor(teacher.availability)} border-2 border-background rounded-full`} />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 
                            className="font-medium cursor-pointer hover:text-primary"
                            onClick={() => navigate(`/teachers/${teacher.id}`)}
                          >
                            {teacher.name}
                          </h3>
                          {teacher.isVerified && (
                            <Badge variant="secondary" className="text-xs">Verified</Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-auto"
                            onClick={() => toggleFavorite(teacher.id)}
                          >
                            <Heart 
                              className={`w-4 h-4 ${teacher.isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                            />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{teacher.rating}</span>
                            <span className="text-sm text-muted-foreground">({teacher.reviewCount} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {teacher.location}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-medium">${teacher.hourlyRate}/hr</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{teacher.availability}</p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{teacher.bio}</p>

                    {/* Languages and Specialties */}
                    <div className="space-y-2 mb-3">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Native: {teacher.nativeLanguage}</Badge>
                        {teacher.languages.filter(lang => lang !== teacher.nativeLanguage).map((lang) => (
                          <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {teacher.specialties.slice(0, 3).map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">{specialty}</Badge>
                        ))}
                        {teacher.specialties.length > 3 && (
                          <Badge variant="secondary" className="text-xs">+{teacher.specialties.length - 3} more</Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span>{teacher.studentsCount} students</span>
                      <span>{teacher.lessonsTaught.toLocaleString()} lessons</span>
                      <span>{teacher.experience} experience</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Responds in {teacher.responseTime}
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Next available: {teacher.nextAvailable}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 gap-2"
                        onClick={() => bookLesson(teacher.id)}
                      >
                        <Video className="w-4 h-4" />
                        Book Lesson
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => sendMessage(teacher.id)}
                        className="gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}