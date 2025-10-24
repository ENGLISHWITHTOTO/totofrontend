import { useState, useEffect } from 'react'
import { Search, Filter, Star, Clock, Users, Heart, Play, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { Avatar } from '../ui/avatar'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

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
}

const mockLessons: LessonPackage[] = [
  {
    id: '1',
    title: 'Spanish Conversation Mastery',
    description: 'Master everyday Spanish conversations with interactive lessons and real-world scenarios.',
    teacher: {
      name: 'Sofia Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
      rating: 4.9,
      reviewCount: 847,
      isVerified: true
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
    isFavorited: false
  },
  {
    id: '2',
    title: 'Japanese Kanji Fundamentals',
    description: 'Learn essential Kanji characters through proven memory techniques and spaced repetition.',
    teacher: {
      name: 'Hiroshi Tanaka',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 4.8,
      reviewCount: 623,
      isVerified: true
    },
    price: 49.99,
    duration: '8 weeks',
    level: 'Beginner',
    language: 'Japanese',
    category: 'Writing',
    studentsEnrolled: 1876,
    lessonsCount: 32,
    thumbnail: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=250&fit=crop',
    tags: ['Kanji', 'Writing', 'Memory'],
    isFavorited: true
  },
  {
    id: '3',
    title: 'French Business Communication',
    description: 'Professional French for business meetings, presentations, and workplace interactions.',
    teacher: {
      name: 'Marie Dubois',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 4.7,
      reviewCount: 234,
      isVerified: true
    },
    price: 79.99,
    duration: '10 weeks',
    level: 'Advanced',
    language: 'French',
    category: 'Business',
    studentsEnrolled: 567,
    lessonsCount: 40,
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop',
    tags: ['Business', 'Professional', 'Speaking'],
    isFavorited: false
  },
  {
    id: '4',
    title: 'German Grammar Bootcamp',
    description: 'Intensive German grammar course covering cases, verb conjugations, and sentence structure.',
    teacher: {
      name: 'Klaus Mueller',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 4.6,
      reviewCount: 412,
      isVerified: true
    },
    price: 34.99,
    originalPrice: 49.99,
    duration: '4 weeks',
    level: 'Intermediate',
    language: 'German',
    category: 'Grammar',
    studentsEnrolled: 891,
    lessonsCount: 20,
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop',
    tags: ['Grammar', 'Structure', 'Cases'],
    isFavorited: false
  }
]

const categories = ['All', 'Conversation', 'Grammar', 'Writing', 'Business', 'Culture', 'Pronunciation']
const languages = ['All Languages', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Arabic']
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']

export default function Market() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')
  const [showFilters, setShowFilters] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)

  useEffect(() => {
    // Update cart count when component mounts
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('demo_cart') || '[]')
      setCartItemCount(cart.length)
    }
    
    updateCartCount()
    
    // Listen for storage changes (cart updates)
    window.addEventListener('storage', updateCartCount)
    
    return () => {
      window.removeEventListener('storage', updateCartCount)
    }
  }, [])

  const filteredLessons = mockLessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'All' || lesson.category === selectedCategory
    const matchesLanguage = selectedLanguage === 'All Languages' || lesson.language === selectedLanguage
    const matchesLevel = selectedLevel === 'All Levels' || lesson.level === selectedLevel
    
    return matchesSearch && matchesCategory && matchesLanguage && matchesLevel
  })

  const toggleFavorite = (lessonId: string) => {
    // In real app, update favorites via API
    console.log('Toggle favorite:', lessonId)
  }

  const addToCart = (lessonId: string) => {
    // Get existing cart or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem('demo_cart') || '[]')
    
    // Find the lesson to add
    const lesson = mockLessons.find(l => l.id === lessonId)
    if (!lesson) return
    
    // Check if lesson already in cart
    const isInCart = existingCart.some((item: any) => item.id === lessonId)
    
    if (!isInCart) {
      const cartItem = {
        id: lesson.id,
        title: lesson.title,
        teacher: lesson.teacher.name,
        price: lesson.price,
        originalPrice: lesson.originalPrice,
        thumbnail: lesson.thumbnail,
        duration: lesson.duration,
        lessonsCount: lesson.lessonsCount,
        quantity: 1
      }
      
      const updatedCart = [...existingCart, cartItem]
      localStorage.setItem('demo_cart', JSON.stringify(updatedCart))
      setCartItemCount(updatedCart.length)
    }
  }

  const viewLessonDetail = (lessonId: string) => {
    navigate(`/market/lesson/${lessonId}`)
  }

  const goToCart = () => {
    navigate('/market/cart')
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header - Enhanced contrast */}
      <div className="p-4 border-b border-[#2a2a2f] bg-[#0f0f11] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1>Marketplace</h1>
          <Button variant="outline" size="sm" onClick={goToCart} className="gap-2 relative">
            <ShoppingCart className="w-4 h-4" />
            Cart
            {cartItemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search lessons, teachers, or topics..."
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
            <Tabs defaultValue="category" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="category">Category</TabsTrigger>
                <TabsTrigger value="language">Language</TabsTrigger>
                <TabsTrigger value="level">Level</TabsTrigger>
              </TabsList>
              
              <TabsContent value="category" className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
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
              
              <TabsContent value="level" className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {levels.map((level) => (
                    <Button
                      key={level}
                      variant={selectedLevel === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedLevel(level)}
                    >
                      {level}
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
              {filteredLessons.length} lessons found
            </p>
            <Button variant="outline" size="sm">
              Sort by: Popular
            </Button>
          </div>

          {/* Lesson Cards */}
          <div className="grid gap-4">
            {filteredLessons.map((lesson) => (
              <Card key={lesson.id} className="overflow-hidden">
                <div className="flex">
                  {/* Thumbnail */}
                  <div className="relative w-32 h-24 shrink-0">
                    <img 
                      src={lesson.thumbnail} 
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                    {lesson.isPopular && (
                      <Badge className="absolute top-2 left-2 text-xs">Popular</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 p-1 h-auto bg-black/20 hover:bg-black/40"
                      onClick={() => toggleFavorite(lesson.id)}
                    >
                      <Heart 
                        className={`w-4 h-4 ${lesson.isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                      />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="cursor-pointer" onClick={() => viewLessonDetail(lesson.id)}>
                        <h3 className="font-medium mb-1 hover:text-primary">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {lesson.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {lesson.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              ${lesson.originalPrice}
                            </span>
                          )}
                          <span className="font-medium">${lesson.price}</span>
                        </div>
                      </div>
                    </div>

                    {/* Teacher Info */}
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="w-6 h-6">
                        <img src={lesson.teacher.avatar} alt={lesson.teacher.name} className="w-full h-full object-cover rounded-full" />
                      </Avatar>
                      <span className="text-sm">{lesson.teacher.name}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{lesson.teacher.rating}</span>
                        <span className="text-xs text-muted-foreground">({lesson.teacher.reviewCount})</span>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        {lesson.lessonsCount} lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {lesson.studentsEnrolled.toLocaleString()} students
                      </div>
                    </div>

                    {/* Tags and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">{lesson.level}</Badge>
                        <Badge variant="outline" className="text-xs">{lesson.language}</Badge>
                        {lesson.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="gap-2"
                        onClick={() => addToCart(lesson.id)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
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