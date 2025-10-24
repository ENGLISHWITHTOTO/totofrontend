import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  Search, Filter, ArrowLeft, Star, Clock, Users, Sliders,
  X, CheckCircle, Play, BookOpen, Headphones, MessageSquare
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import { Slider } from '../ui/slider'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'

interface SearchResult {
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
  tags: string[]
  isPopular?: boolean
  isNew?: boolean
  progress?: number
}

// Mock search results
const mockResults: SearchResult[] = [
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
    tags: ['Professional', 'Communication', 'Workplace'],
    isPopular: true,
    progress: 25
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
    tags: ['Presentation', 'Public Speaking', 'Visual Aids']
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
    tags: ['Speaking', 'Fluency', 'Practice'],
    isPopular: true,
    progress: 60
  },
  {
    id: 'email-writing',
    type: 'lesson',
    title: 'Professional Email Writing',
    description: 'Master the art of writing clear, professional emails',
    categoryName: 'Business English',
    categoryIcon: '💼',
    rating: 4.9,
    students: 1156,
    duration: 35,
    difficulty: 'Intermediate',
    level: 'B1-B2',
    thumbnail: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=300&h=200&fit=crop',
    tags: ['Email', 'Writing', 'Professional']
  },
  {
    id: 'pronunciation',
    type: 'category',
    title: 'Pronunciation',
    description: 'Perfect your pronunciation and accent reduction',
    icon: '🗣️',
    rating: 4.8,
    students: 7456,
    difficulty: 'Intermediate',
    level: 'A2-C1',
    tags: ['Speaking', 'Accent', 'Phonetics']
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
    tags: ['IELTS', 'Exam', 'Test Prep'],
    isPopular: true
  }
]

const difficulties = ['Beginner', 'Intermediate', 'Advanced']
const contentTypes = ['category', 'lesson']
const skillAreas = ['Speaking', 'Writing', 'Reading', 'Listening', 'Grammar', 'Vocabulary']

export default function CategorySearch() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<SearchResult[]>([])
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Filter states
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [ratingRange, setRatingRange] = useState([0])
  const [durationRange, setDurationRange] = useState([0])
  const [sortBy, setSortBy] = useState('relevance')

  // Mock search function
  const performSearch = async (searchQuery: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (!searchQuery.trim()) {
      setResults([])
      setFilteredResults([])
      setIsLoading(false)
      return
    }

    const filtered = mockResults.filter(result => 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    
    setResults(filtered)
    setFilteredResults(filtered)
    setIsLoading(false)
  }

  // Apply filters
  useEffect(() => {
    let filtered = [...results]

    // Filter by difficulty
    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter(result => selectedDifficulties.includes(result.difficulty))
    }

    // Filter by content type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(result => selectedTypes.includes(result.type))
    }

    // Filter by skills
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(result => 
        result.tags.some(tag => selectedSkills.includes(tag))
      )
    }

    // Filter by rating
    if (ratingRange[0] > 0) {
      filtered = filtered.filter(result => result.rating >= ratingRange[0])
    }

    // Filter by duration (for lessons)
    if (durationRange[0] > 0) {
      filtered = filtered.filter(result => 
        result.type === 'category' || (result.duration && result.duration <= durationRange[0])
      )
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'popularity':
          return b.students - a.students
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        case 'duration':
          return (a.duration || 0) - (b.duration || 0)
        default: // relevance
          return 0
      }
    })

    setFilteredResults(filtered)
  }, [results, selectedDifficulties, selectedTypes, selectedSkills, ratingRange, durationRange, sortBy])

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const clearFilters = () => {
    setSelectedDifficulties([])
    setSelectedTypes([])
    setSelectedSkills([])
    setRatingRange([0])
    setDurationRange([0])
  }

  const toggleFilter = (value: string, currentFilters: string[], setFilters: (filters: string[]) => void) => {
    if (currentFilters.includes(value)) {
      setFilters(currentFilters.filter(f => f !== value))
    } else {
      setFilters([...currentFilters, value])
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

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'category') {
      navigate(`/categories/${result.id}`)
    } else {
      navigate(`/categories/${result.categoryName?.toLowerCase().replace(/\s+/g, '-')}/lessons/${result.id}`)
    }
  }

  const difficultyColors = {
    'Beginner': 'bg-green-100 text-green-700',
    'Intermediate': 'bg-yellow-100 text-yellow-700',
    'Advanced': 'bg-red-100 text-red-700'
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
            <h1>Search</h1>
            <p className="text-sm text-muted-foreground">Find categories and lessons</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search for categories, lessons, or topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuery('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 flex-shrink-0">
                <Sliders className="w-4 h-4" />
                Filters
                {(selectedDifficulties.length + selectedTypes.length + selectedSkills.length + 
                  (ratingRange[0] > 0 ? 1 : 0) + (durationRange[0] > 0 ? 1 : 0)) > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {selectedDifficulties.length + selectedTypes.length + selectedSkills.length + 
                     (ratingRange[0] > 0 ? 1 : 0) + (durationRange[0] > 0 ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Filter Results</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-full pt-4">
                <div className="space-y-6">
                  {/* Difficulty */}
                  <div>
                    <h3 className="font-medium mb-3">Difficulty Level</h3>
                    <div className="space-y-2">
                      {difficulties.map((difficulty) => (
                        <div key={difficulty} className="flex items-center space-x-2">
                          <Checkbox
                            id={difficulty}
                            checked={selectedDifficulties.includes(difficulty)}
                            onCheckedChange={() => 
                              toggleFilter(difficulty, selectedDifficulties, setSelectedDifficulties)
                            }
                          />
                          <label htmlFor={difficulty} className="text-sm cursor-pointer">
                            {difficulty}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Content Type */}
                  <div>
                    <h3 className="font-medium mb-3">Content Type</h3>
                    <div className="space-y-2">
                      {contentTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={() => 
                              toggleFilter(type, selectedTypes, setSelectedTypes)
                            }
                          />
                          <label htmlFor={type} className="text-sm cursor-pointer capitalize">
                            {type}s
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Skills */}
                  <div>
                    <h3 className="font-medium mb-3">Skill Areas</h3>
                    <div className="space-y-2">
                      {skillAreas.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={skill}
                            checked={selectedSkills.includes(skill)}
                            onCheckedChange={() => 
                              toggleFilter(skill, selectedSkills, setSelectedSkills)
                            }
                          />
                          <label htmlFor={skill} className="text-sm cursor-pointer">
                            {skill}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Rating */}
                  <div>
                    <h3 className="font-medium mb-3">Minimum Rating</h3>
                    <div className="space-y-3">
                      <Slider
                        value={ratingRange}
                        onValueChange={setRatingRange}
                        max={5}
                        min={0}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Any</span>
                        <span>{ratingRange[0]} stars and up</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Duration */}
                  <div>
                    <h3 className="font-medium mb-3">Maximum Duration (minutes)</h3>
                    <div className="space-y-3">
                      <Slider
                        value={durationRange}
                        onValueChange={setDurationRange}
                        max={120}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Any</span>
                        <span>{durationRange[0] === 0 ? 'Any' : `${durationRange[0]} min max`}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={clearFilters} variant="outline" className="flex-1">
                      Clear All
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Active Filters */}
          {selectedDifficulties.map((difficulty) => (
            <Badge key={difficulty} variant="secondary" className="gap-1">
              {difficulty}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFilter(difficulty, selectedDifficulties, setSelectedDifficulties)}
                className="h-auto w-auto p-0 ml-1"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">Sort:</span>
            <select 
              className="text-sm border rounded px-2 py-1"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Rating</option>
              <option value="popularity">Popularity</option>
              <option value="newest">Newest</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        {query && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Searching...' : `${filteredResults.length} results for "${query}"`}
            </p>
          </div>
        )}
      </div>

      {/* Results */}
      <ScrollArea className="flex-1 p-4">
        {!query ? (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">Search for learning content</h3>
            <p className="text-sm text-muted-foreground">
              Find categories, lessons, and topics to improve your English skills
            </p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No results found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResults.map((result) => (
              <Card 
                key={`${result.type}-${result.id}`}
                className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                onClick={() => handleResultClick(result)}
              >
                <div className="flex p-4">
                  {/* Icon/Thumbnail */}
                  <div className="relative w-16 h-16 shrink-0 mr-4">
                    {result.type === 'category' ? (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center text-2xl">
                        {result.icon}
                      </div>
                    ) : (
                      <div className="w-full h-full relative">
                        <img 
                          src={result.thumbnail} 
                          alt={result.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}
                    
                    {/* Type indicator */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-background border rounded-full flex items-center justify-center">
                      {getTypeIcon(result.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium">{result.title}</h3>
                        {result.categoryName && (
                          <p className="text-sm text-muted-foreground">
                            {result.categoryIcon} {result.categoryName}
                          </p>
                        )}
                      </div>
                      {result.isPopular && (
                        <Badge className="text-xs bg-orange-500 ml-2">Popular</Badge>
                      )}
                      {result.isNew && (
                        <Badge className="text-xs bg-green-500 ml-2">New</Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {result.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      {result.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {result.duration} min
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {result.students.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(Math.floor(result.rating))}
                        <span>{result.rating}</span>
                      </div>
                    </div>

                    {/* Tags and Progress */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${difficultyColors[result.difficulty]}`}
                        >
                          {result.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {result.level}
                        </Badge>
                        {result.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {result.progress !== undefined && (
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-muted-foreground">
                            {result.progress}%
                          </div>
                          <div className="w-16 h-1 bg-muted rounded-full">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${result.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}