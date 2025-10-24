import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Heart, Star, Clock, Users, Play, BookOpen,
  Search, Filter, MoreHorizontal, Share2, Download, X
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { toast } from 'sonner'

interface BookmarkedItem {
  id: string
  type: 'category' | 'lesson'
  title: string
  description: string
  categoryName?: string
  categoryIcon?: string
  icon?: string
  rating: number
  students: number
  duration?: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  level: string
  thumbnail?: string
  bookmarkedAt: string
  progress?: number
  lastAccessed?: string
}

// Mock bookmarked items
const mockBookmarks: BookmarkedItem[] = [
  {
    id: 'business-english',
    type: 'category',
    title: 'Business English',
    description: 'Master professional communication skills for the workplace',
    icon: '💼',
    rating: 4.8,
    students: 12543,
    difficulty: 'Intermediate',
    level: 'A2-C1',
    bookmarkedAt: '2 days ago',
    progress: 25,
    lastAccessed: '1 hour ago'
  },
  {
    id: 'business-presentation',
    type: 'lesson',
    title: 'Business Presentation Skills',
    description: 'Learn to deliver compelling business presentations',
    categoryName: 'Business English',
    categoryIcon: '💼',
    rating: 4.7,
    students: 987,
    duration: 45,
    difficulty: 'Intermediate',
    level: 'B1-B2',
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&h=200&fit=crop',
    bookmarkedAt: '3 days ago',
    lastAccessed: '2 days ago'
  },
  {
    id: 'ielts-preparation',
    type: 'category',
    title: 'IELTS Preparation',
    description: 'Comprehensive IELTS exam preparation course',
    icon: '🎯',
    rating: 4.9,
    students: 9876,
    difficulty: 'Advanced',
    level: 'B1-C2',
    bookmarkedAt: '1 week ago',
    progress: 45,
    lastAccessed: '3 days ago'
  },
  {
    id: 'pronunciation-basics',
    type: 'lesson',
    title: 'English Pronunciation Basics',
    description: 'Master the fundamentals of English pronunciation',
    categoryName: 'Pronunciation',
    categoryIcon: '🗣️',
    rating: 4.8,
    students: 1543,
    duration: 30,
    difficulty: 'Beginner',
    level: 'A1-A2',
    thumbnail: 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=300&h=200&fit=crop',
    bookmarkedAt: '1 week ago',
    lastAccessed: '4 days ago'
  },
  {
    id: 'conversation-practice',
    type: 'category',
    title: 'Conversation Practice',
    description: 'Improve fluency through structured conversation practice',
    icon: '💬',
    rating: 4.7,
    students: 15678,
    difficulty: 'Intermediate',
    level: 'A1-C1',
    bookmarkedAt: '2 weeks ago',
    progress: 60,
    lastAccessed: '1 week ago'
  }
]

export default function CategoryBookmarks() {
  const navigate = useNavigate()
  const [bookmarks, setBookmarks] = useState<BookmarkedItem[]>(mockBookmarks)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'category' | 'lesson'>('all')

  const filteredBookmarks = bookmarks.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || item.type === filterType
    return matchesSearch && matchesType
  })

  const removeBookmark = (id: string, type: string) => {
    setBookmarks(prev => prev.filter(item => !(item.id === id && item.type === type)))
    toast.success('Removed from bookmarks')
  }

  const handleItemClick = (item: BookmarkedItem) => {
    if (item.type === 'category') {
      navigate(`/categories/${item.id}`)
    } else {
      navigate(`/categories/${item.categoryName?.toLowerCase().replace(/\s+/g, '-')}/lessons/${item.id}`)
    }
  }

  const shareBookmark = (item: BookmarkedItem) => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'category':
        return <BookOpen className="w-4 h-4" />
      case 'lesson':
        return <Play className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const difficultyColors = {
    'Beginner': 'bg-green-100 text-green-700',
    'Intermediate': 'bg-yellow-100 text-yellow-700',
    'Advanced': 'bg-red-100 text-red-700'
  }

  const categorizedBookmarks = {
    categories: filteredBookmarks.filter(item => item.type === 'category'),
    lessons: filteredBookmarks.filter(item => item.type === 'lesson'),
    recent: filteredBookmarks.sort((a, b) => {
      const timeA = a.lastAccessed ? new Date(a.lastAccessed).getTime() : 0
      const timeB = b.lastAccessed ? new Date(b.lastAccessed).getTime() : 0
      return timeB - timeA
    }).slice(0, 5)
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
            <h1>Bookmarks</h1>
            <p className="text-sm text-muted-foreground">
              {bookmarks.length} saved items
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('all')}
            className="flex-shrink-0"
          >
            All ({bookmarks.length})
          </Button>
          <Button
            variant={filterType === 'category' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('category')}
            className="flex-shrink-0"
          >
            Categories ({bookmarks.filter(b => b.type === 'category').length})
          </Button>
          <Button
            variant={filterType === 'lesson' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('lesson')}
            className="flex-shrink-0"
          >
            Lessons ({bookmarks.filter(b => b.type === 'lesson').length})
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-8 px-4">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">
              {searchQuery ? 'No matching bookmarks' : 'No bookmarks yet'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Save categories and lessons you want to revisit later'
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate('/categories')}>
                Browse Categories
              </Button>
            )}
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <div className="p-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="px-4 space-y-4">
              {filteredBookmarks.map((item) => (
                <Card 
                  key={`${item.type}-${item.id}`}
                  className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex p-4">
                    {/* Icon/Thumbnail */}
                    <div className="relative w-16 h-16 shrink-0 mr-4">
                      {item.type === 'category' ? (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center text-2xl">
                          {item.icon}
                        </div>
                      ) : (
                        <div className="w-full h-full relative">
                          <img 
                            src={item.thumbnail} 
                            alt={item.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                            <Play className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {/* Type indicator */}
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-background border rounded-full flex items-center justify-center">
                        {getTypeIcon(item.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium">{item.title}</h3>
                          {item.categoryName && (
                            <p className="text-sm text-muted-foreground">
                              {item.categoryIcon} {item.categoryName}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              shareBookmark(item)
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Share2 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeBookmark(item.id, item.type)
                            }}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {item.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        {item.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.duration} min
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {item.students.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(Math.floor(item.rating))}
                          <span>{item.rating}</span>
                        </div>
                      </div>

                      {/* Tags and Progress */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${difficultyColors[item.difficulty]}`}
                          >
                            {item.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.level}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Saved {item.bookmarkedAt}
                          </span>
                        </div>

                        {item.progress !== undefined && (
                          <div className="flex items-center gap-2">
                            <div className="text-xs text-muted-foreground">
                              {item.progress}%
                            </div>
                            <div className="w-16 h-1 bg-muted rounded-full">
                              <div 
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="categories" className="px-4 space-y-4">
              {categorizedBookmarks.categories.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">No bookmarked categories</p>
                </div>
              ) : (
                categorizedBookmarks.categories.map((item) => (
                  <Card 
                    key={item.id}
                    className="cursor-pointer hover:shadow-md transition-shadow p-4"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center text-xl">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                        {item.progress !== undefined && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="text-xs text-muted-foreground">
                              {item.progress}% complete
                            </div>
                            <div className="w-20 h-1 bg-muted rounded-full">
                              <div 
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeBookmark(item.id, item.type)
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="recent" className="px-4 space-y-4">
              {categorizedBookmarks.recent.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              ) : (
                categorizedBookmarks.recent.map((item) => (
                  <Card 
                    key={`recent-${item.type}-${item.id}`}
                    className="cursor-pointer hover:shadow-md transition-shadow p-4"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {item.type === 'category' ? (
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center text-xl">
                            {item.icon}
                          </div>
                        ) : (
                          <div className="w-12 h-12 relative">
                            <img 
                              src={item.thumbnail} 
                              alt={item.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-background border rounded-full flex items-center justify-center">
                          {getTypeIcon(item.type)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.title}</h3>
                        {item.categoryName && (
                          <p className="text-xs text-muted-foreground">
                            {item.categoryIcon} {item.categoryName}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Last accessed {item.lastAccessed}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </ScrollArea>
    </div>
  )
}