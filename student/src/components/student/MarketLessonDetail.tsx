import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Clock, Users, Play, Heart, ShoppingCart, CheckCircle, Gift, Globe, Award, Calendar, Download } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { Avatar } from '../ui/avatar'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Progress } from '../ui/progress'
import { Separator } from '../ui/separator'

interface LessonPackage {
  id: string
  title: string
  description: string
  teacher: {
    name: string
    avatar: string
    rating: number
    reviewCount: number
    isVerified: boolean
    bio: string
    yearsExperience: number
    specializations: string[]
  }
  price: number
  originalPrice?: number
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  language: string
  category: string
  studentsEnrolled: number
  lessonsCount: number
  thumbnail: string
  tags: string[]
  isPopular?: boolean
  isFavorited?: boolean
  curriculum: Array<{
    title: string
    lessons: Array<{
      title: string
      duration: string
      type: 'video' | 'exercise' | 'quiz'
    }>
  }>
  whatYouLearn: string[]
  requirements: string[]
  features: string[]
  reviews: Array<{
    id: string
    user: string
    avatar: string
    rating: number
    comment: string
    date: string
  }>
}

// Mock detailed lesson data
const mockDetailedLesson: LessonPackage = {
  id: '1',
  title: 'Spanish Conversation Mastery',
  description: 'Master everyday Spanish conversations with interactive lessons and real-world scenarios. This comprehensive course covers everything from basic greetings to complex discussions, helping you build confidence in speaking Spanish naturally.',
  teacher: {
    name: 'Sofia Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
    rating: 4.9,
    reviewCount: 847,
    isVerified: true,
    bio: 'Native Spanish speaker with 8+ years of teaching experience. Specializes in conversational Spanish and cultural immersion techniques.',
    yearsExperience: 8,
    specializations: ['Conversational Spanish', 'Business Spanish', 'Cultural Studies']
  },
  price: 39.99,
  originalPrice: 59.99,
  duration: '6 weeks',
  level: 'Intermediate',
  language: 'Spanish',
  category: 'Conversation',
  studentsEnrolled: 2341,
  lessonsCount: 24,
  thumbnail: 'https://images.unsplash.com/photo-1673515335586-f9f662c01482?w=400&h=250&fit=crop',
  tags: ['Speaking', 'Grammar', 'Culture'],
  isPopular: true,
  isFavorited: false,
  whatYouLearn: [
    'Hold natural conversations in Spanish with confidence',
    'Use proper grammar structures in speaking contexts',
    'Understand cultural nuances and expressions',
    'Navigate real-world scenarios like shopping, dining, and travel',
    'Build a vocabulary of 500+ common conversational words',
    'Master pronunciation and accent reduction techniques'
  ],
  requirements: [
    'Basic Spanish vocabulary (A2 level or equivalent)',
    'Willingness to practice speaking regularly',
    'Smartphone or computer with microphone',
    'Dedication of 30 minutes per day'
  ],
  features: [
    'HD video lessons with subtitles',
    'Interactive speaking exercises with AI feedback',
    'Downloadable audio files for offline practice',
    'Weekly live group practice sessions',
    'Personalized progress tracking',
    'Certificate of completion',
    'Lifetime access to course materials',
    '30-day money-back guarantee'
  ],
  curriculum: [
    {
      title: 'Week 1: Everyday Greetings and Introductions',
      lessons: [
        { title: 'Formal vs Informal Greetings', duration: '12 min', type: 'video' },
        { title: 'Introducing Yourself and Others', duration: '15 min', type: 'video' },
        { title: 'Practice: Meeting New People', duration: '10 min', type: 'exercise' },
        { title: 'Week 1 Assessment', duration: '8 min', type: 'quiz' }
      ]
    },
    {
      title: 'Week 2: Shopping and Daily Activities',
      lessons: [
        { title: 'At the Market: Buying Groceries', duration: '18 min', type: 'video' },
        { title: 'Describing Daily Routines', duration: '14 min', type: 'video' },
        { title: 'Role Play: Shopping Scenarios', duration: '12 min', type: 'exercise' },
        { title: 'Week 2 Assessment', duration: '10 min', type: 'quiz' }
      ]
    },
    {
      title: 'Week 3: Food, Restaurants, and Culture',
      lessons: [
        { title: 'Ordering Food Like a Native', duration: '16 min', type: 'video' },
        { title: 'Spanish Food Culture and Etiquette', duration: '20 min', type: 'video' },
        { title: 'Practice: Restaurant Conversations', duration: '15 min', type: 'exercise' },
        { title: 'Week 3 Assessment', duration: '8 min', type: 'quiz' }
      ]
    },
    {
      title: 'Week 4: Travel and Transportation',
      lessons: [
        { title: 'Getting Around: Transport Vocabulary', duration: '14 min', type: 'video' },
        { title: 'Asking for Directions', duration: '12 min', type: 'video' },
        { title: 'Travel Scenarios Practice', duration: '18 min', type: 'exercise' },
        { title: 'Week 4 Assessment', duration: '10 min', type: 'quiz' }
      ]
    }
  ],
  reviews: [
    {
      id: '1',
      user: 'Maria Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      rating: 5,
      comment: 'Excellent course! Sofia\'s teaching style is engaging and the practice sessions really helped me gain confidence.',
      date: '2 days ago'
    },
    {
      id: '2',
      user: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      rating: 5,
      comment: 'Best Spanish conversation course I\'ve taken. The cultural insights are particularly valuable.',
      date: '1 week ago'
    },
    {
      id: '3',
      user: 'Lisa Park',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face',
      rating: 4,
      comment: 'Great content and structure. Would recommend to anyone looking to improve their Spanish speaking skills.',
      date: '2 weeks ago'
    }
  ]
}

export default function MarketLessonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isFavorited, setIsFavorited] = useState(mockDetailedLesson.isFavorited)
  const [selectedTab, setSelectedTab] = useState('overview')

  const addToCart = () => {
    // Get existing cart or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem('demo_cart') || '[]')
    
    // Check if lesson already in cart
    const isInCart = existingCart.some((item: any) => item.id === mockDetailedLesson.id)
    
    if (!isInCart) {
      const cartItem = {
        id: mockDetailedLesson.id,
        title: mockDetailedLesson.title,
        teacher: mockDetailedLesson.teacher.name,
        price: mockDetailedLesson.price,
        originalPrice: mockDetailedLesson.originalPrice,
        thumbnail: mockDetailedLesson.thumbnail,
        duration: mockDetailedLesson.duration,
        lessonsCount: mockDetailedLesson.lessonsCount
      }
      
      const updatedCart = [...existingCart, cartItem]
      localStorage.setItem('demo_cart', JSON.stringify(updatedCart))
      
      // Navigate to cart
      navigate('/market/cart')
    }
  }

  const buyNow = () => {
    // Add to cart and navigate directly to checkout
    const cartItem = {
      id: mockDetailedLesson.id,
      title: mockDetailedLesson.title,
      teacher: mockDetailedLesson.teacher.name,
      price: mockDetailedLesson.price,
      originalPrice: mockDetailedLesson.originalPrice,
      thumbnail: mockDetailedLesson.thumbnail,
      duration: mockDetailedLesson.duration,
      lessonsCount: mockDetailedLesson.lessonsCount
    }
    
    localStorage.setItem('demo_cart', JSON.stringify([cartItem]))
    navigate('/market/checkout')
  }

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited)
    // In real app, update favorites via API
  }

  const getIconForLessonType = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />
      case 'exercise': return <CheckCircle className="w-4 h-4" />
      case 'quiz': return <Award className="w-4 h-4" />
      default: return <Play className="w-4 h-4" />
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="flex-1">Lesson Details</h1>
          <Button variant="ghost" size="sm" onClick={toggleFavorite}>
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <img 
                src={mockDetailedLesson.thumbnail} 
                alt={mockDetailedLesson.title}
                className="w-full h-full object-cover"
              />
              {mockDetailedLesson.isPopular && (
                <Badge className="absolute top-3 left-3">Popular</Badge>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="mb-2">{mockDetailedLesson.title}</h2>
                  <p className="text-muted-foreground">{mockDetailedLesson.description}</p>
                </div>
              </div>
              
              {/* Price and CTA */}
              <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    {mockDetailedLesson.originalPrice && (
                      <span className="text-muted-foreground line-through">
                        ${mockDetailedLesson.originalPrice}
                      </span>
                    )}
                    <span className="text-xl font-medium">${mockDetailedLesson.price}</span>
                    {mockDetailedLesson.originalPrice && (
                      <Badge variant="destructive" className="text-xs">
                        {Math.round(((mockDetailedLesson.originalPrice - mockDetailedLesson.price) / mockDetailedLesson.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">One-time payment • Lifetime access</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={buyNow} className="gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Buy Now
                </Button>
                <Button variant="outline" onClick={addToCart} className="gap-2">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Students</p>
                  <p className="font-medium">{mockDetailedLesson.studentsEnrolled.toLocaleString()}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="font-medium">{mockDetailedLesson.teacher.rating} ({mockDetailedLesson.teacher.reviewCount})</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Instructor */}
          <Card className="p-4">
            <h3 className="mb-3">Instructor</h3>
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12">
                <img src={mockDetailedLesson.teacher.avatar} alt={mockDetailedLesson.teacher.name} className="w-full h-full object-cover rounded-full" />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{mockDetailedLesson.teacher.name}</span>
                  {mockDetailedLesson.teacher.isVerified && (
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{mockDetailedLesson.teacher.bio}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{mockDetailedLesson.teacher.yearsExperience} years experience</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{mockDetailedLesson.teacher.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* What You'll Learn */}
              <Card className="p-4">
                <h4 className="mb-3">What you'll learn</h4>
                <div className="space-y-2">
                  {mockDetailedLesson.whatYouLearn.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Requirements */}
              <Card className="p-4">
                <h4 className="mb-3">Requirements</h4>
                <div className="space-y-2">
                  {mockDetailedLesson.requirements.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Course Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{mockDetailedLesson.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{mockDetailedLesson.lessonsCount} lessons</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{mockDetailedLesson.language}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{mockDetailedLesson.level}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="curriculum" className="space-y-4 mt-4">
              {mockDetailedLesson.curriculum.map((week, weekIndex) => (
                <Card key={weekIndex} className="p-4">
                  <h4 className="mb-3">{week.title}</h4>
                  <div className="space-y-3">
                    {week.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50">
                        <div className="p-1.5 bg-primary/10 rounded">
                          {getIconForLessonType(lesson.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                        </div>
                        <Badge variant="outline" className="text-xs capitalize">
                          {lesson.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4 mt-4">
              {/* Rating Overview */}
              <Card className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-medium">{mockDetailedLesson.teacher.rating}</div>
                    <div className="flex items-center gap-1 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-3 h-3 ${star <= Math.floor(mockDetailedLesson.teacher.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{mockDetailedLesson.teacher.reviewCount} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-xs w-3">{rating}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <Progress value={rating === 5 ? 85 : rating === 4 ? 10 : 3} className="flex-1 h-1" />
                        <span className="text-xs text-muted-foreground w-8">
                          {rating === 5 ? '85%' : rating === 4 ? '10%' : '3%'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {mockDetailedLesson.reviews.map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <img src={review.avatar} alt={review.user} className="w-full h-full object-cover rounded-full" />
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{review.user}</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4 mt-4">
              <Card className="p-4">
                <h4 className="mb-3">Course Features</h4>
                <div className="space-y-3">
                  {mockDetailedLesson.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  )
}