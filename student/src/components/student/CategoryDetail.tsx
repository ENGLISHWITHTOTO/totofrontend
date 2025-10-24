import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, BookOpen, Mic, PenTool, Headphones, 
  ChevronRight, Clock, Star
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { ScrollArea } from '../ui/scroll-area'

interface SubCategory {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  progress: number
  lessons: number
  color: string
  bgColor: string
}

interface CategoryData {
  id: string
  name: string
  mainDescription: string
  completionPercentage: number
  totalTime: string
  totalLessons: number
  rating: number
  subcategories: SubCategory[]
}

// Mock data based on IELTS category
const mockCategoryData: CategoryData = {
  id: 'ielts',
  name: 'IELTS',
  mainDescription: 'Complete IELTS preparation course',
  completionPercentage: 22,
  totalTime: '12 hr 30 min',
  totalLessons: 120,
  rating: 4.8,
  subcategories: [
    {
      id: 'reading',
      name: 'Reading',
      icon: BookOpen,
      description: 'Practice tests and strategies',
      progress: 45,
      lessons: 30,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      id: 'writing',
      name: 'Writing',
      icon: PenTool,
      description: 'Task 1 and Task 2 mastery',
      progress: 30,
      lessons: 25,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      id: 'listening',
      name: 'Listening',
      icon: Headphones,
      description: 'Audio skills and note-taking',
      progress: 60,
      lessons: 35,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      id: 'speaking',
      name: 'Speaking',
      icon: Mic,
      description: 'Fluency and pronunciation',
      progress: 15,
      lessons: 30,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    }
  ]
}

const levelFilters = ['Beginner', 'Intermediate', 'Advanced']

export default function CategoryDetail() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const [selectedLevel, setSelectedLevel] = useState('Beginner')
  const [categoryData] = useState<CategoryData>(mockCategoryData)

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">{categoryData.name}</h1>
        </div>

        {/* Featured IELTS Card */}
        <Card className="mb-6 overflow-hidden bg-gradient-to-r from-pink-500 to-pink-600 border-0">
          <CardContent className="p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">{categoryData.name} Preparation</h2>
                <p className="text-pink-100 text-sm mb-4">{categoryData.mainDescription}</p>
                
                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{categoryData.totalTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{categoryData.totalLessons} Lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(categoryData.rating)}
                    <span className="ml-1">{categoryData.rating}</span>
                  </div>
                </div>
              </div>
              
              {/* Circular Progress */}
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray={`${categoryData.completionPercentage}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{categoryData.completionPercentage}%</span>
                </div>
              </div>
            </div>
            
            <Button 
              className="bg-white text-pink-600 hover:bg-pink-50 font-medium"
              onClick={() => navigate(`/categories/${categoryId}/lessons/1`)}
            >
              Continue Learning
            </Button>
          </CardContent>
        </Card>

        {/* Level Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {levelFilters.map((level) => (
            <Button
              key={level}
              variant={selectedLevel === level ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel(level)}
              className="rounded-full px-4"
            >
              {level}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Sub-categories Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sub-categories</h3>
            <div className="grid grid-cols-2 gap-3">
              {categoryData.subcategories.map((subcategory) => {
                const IconComponent = subcategory.icon
                
                return (
                  <Card 
                    key={subcategory.id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 border border-border/50"
                    onClick={() => navigate(`/categories/${categoryId}/subcategories/${subcategory.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Icon and Progress */}
                        <div className="flex items-center justify-between">
                          <div className={`w-10 h-10 rounded-2xl ${subcategory.bgColor} flex items-center justify-center`}>
                            <IconComponent className={`w-5 h-5 ${subcategory.color}`} />
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground mb-1">Progress</div>
                            <div className="font-semibold text-sm">{subcategory.progress}%</div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm">{subcategory.name}</h4>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <p className="text-xs text-muted-foreground leading-tight">
                            {subcategory.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {subcategory.lessons} lessons
                          </p>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <Progress value={subcategory.progress} className="h-1.5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{categoryData.completionPercentage}%</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{categoryData.totalLessons}</div>
                <div className="text-xs text-muted-foreground">Total Lessons</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{categoryData.rating}</div>
                <div className="text-xs text-muted-foreground">Average Rating</div>
              </CardContent>
            </Card>
          </div>

          {/* Study Tips */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Study Tips</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>Practice regularly for at least 30 minutes daily</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>Focus on your weakest areas first</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>Take practice tests to track progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}