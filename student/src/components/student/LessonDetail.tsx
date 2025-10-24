import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Star, 
  Download, 
  Bookmark,
  Play,
  Headphones,
  Video,
  MessageSquare,
  Brain,
  Mic
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { toast } from 'sonner'

const mockLessons = {
  '1': {
    id: '1',
    title: 'Business English Essentials',
    level: 'Intermediate',
    duration: '15 min',
    rating: 4.8,
    ratingCount: 124,
    summary: 'Master professional communication skills for the modern workplace. Learn key vocabulary, formal writing, and presentation techniques.',
    estimatedTime: '15-20 minutes',
    tags: ['Grammar', 'Vocabulary', 'Business'],
    isPremium: false,
    contents: [
      { type: 'read', title: 'Introduction to Business Terms', duration: '3 min' },
      { type: 'audio', title: 'Listen: Office Conversations', duration: '4 min' },
      { type: 'mcq', title: 'Vocabulary Quiz', duration: '3 min' },
      { type: 'ai', title: 'AI Writing Practice', duration: '5 min' }
    ],
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmd8ZW58MXx8fHwxNzU3MjgzOTE2fDA&ixlib=rb-4.1.0&q=80&w=400'
  }
}

const getContentIcon = (type: string) => {
  switch (type) {
    case 'read': return BookOpen
    case 'audio': return Headphones
    case 'video': return Video
    case 'mcq': return MessageSquare
    case 'ai': return Brain
    case 'voice': return Mic
    default: return Play
  }
}

export default function LessonDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [saved, setSaved] = useState(false)
  
  const lesson = mockLessons[id as keyof typeof mockLessons]
  
  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <h2>Lesson not found</h2>
        <p className="text-muted-foreground mb-4">The lesson you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(-1)}>Go back</Button>
      </div>
    )
  }

  const handleSave = () => {
    setSaved(!saved)
    toast.success(saved ? 'Removed from saved lessons' : 'Lesson saved!')
  }

  const handleBeginLesson = () => {
    navigate(`/lesson/${id}/player`)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className={saved ? 'text-primary' : ''}
        >
          <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div className="relative">
          <img 
            src={lesson.cover} 
            alt={lesson.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {lesson.level}
              </Badge>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{lesson.duration}</span>
              </div>
            </div>
            <h1 className="text-xl font-semibold">{lesson.title}</h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{lesson.rating}</span>
              <span className="text-sm text-muted-foreground">({lesson.ratingCount} reviews)</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-muted-foreground">{lesson.estimatedTime}</span>
          </div>

          {/* Summary */}
          <div>
            <h3>About this lesson</h3>
            <p className="text-muted-foreground mt-2">{lesson.summary}</p>
          </div>

          {/* Tags */}
          <div>
            <h4>What you'll practice</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {lesson.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>

          {/* Contents Outline */}
          <div>
            <h3>Lesson Contents</h3>
            <div className="space-y-3 mt-4">
              {lesson.contents.map((content, index) => {
                const Icon = getContentIcon(content.type)
                return (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium">{content.title}</h5>
                          <p className="text-sm text-muted-foreground">{content.duration}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {index + 1}/{lesson.contents.length}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button className="w-full" size="lg" onClick={handleBeginLesson}>
              <Play className="h-5 w-5 mr-2" />
              Begin Lesson
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handleSave} className="gap-2">
                <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
                {saved ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>

          {/* Offline Notice */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/40 rounded">
                  <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h5 className="font-medium text-blue-900 dark:text-blue-100">
                    Available offline
                  </h5>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    This lesson is cached and can be completed without internet connection.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer padding */}
          <div className="h-6" />
        </div>
      </div>
    </div>
  )
}