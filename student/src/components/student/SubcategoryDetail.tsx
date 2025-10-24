import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Maximize, Settings, Download, Share2, BookOpen, CheckCircle,
  Clock, Users, Star, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Flag, ThumbsUp, MessageCircle
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { ScrollArea } from '../ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Avatar } from '../ui/avatar'
import { Textarea } from '../ui/textarea'
import { Slider } from '../ui/slider'
import { toast } from 'sonner'

interface Lesson {
  id: string
  title: string
  description: string
  duration: number
  thumbnail: string
  videoUrl: string
  transcript: string
  isCompleted: boolean
  isLocked: boolean
  type: 'Video' | 'Interactive' | 'Reading' | 'Audio'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  rating: number
  students: number
  instructor: {
    name: string
    avatar: string
    title: string
    bio: string
  }
  resources: {
    id: string
    title: string
    type: 'PDF' | 'Audio' | 'Text' | 'Exercise'
    url: string
    size?: string
  }[]
  objectives: string[]
  skills: string[]
  comments: {
    id: string
    user: {
      name: string
      avatar: string
    }
    content: string
    timestamp: number
    likes: number
    isLiked: boolean
    createdAt: string
  }[]
  notes: {
    id: string
    timestamp: number
    content: string
    createdAt: string
  }[]
}

interface Strategy {
  id: string
  title: string
  description: string
  examples?: string[]
  tips?: string[]
}

interface KnowledgeCheck {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface SubcategoryData {
  id: string
  categoryId: string
  name: string
  description: string
  totalLessons: number
  completedLessons: number
  lessons: Lesson[]
  strategies: Strategy[]
  knowledgeChecks: KnowledgeCheck[]
}

// Mock data for IELTS Speaking Part 1
const mockSubcategoryData: SubcategoryData = {
  id: 'speaking',
  categoryId: 'ielts',
  name: 'IELTS Speaking Part 1',
  description: 'Speaking - Introduction',
  totalLessons: 5,
  completedLessons: 2,
  lessons: [
    {
      id: '1',
      title: 'Introduction to IELTS Speaking Part 1',
      description: 'Learn the structure and key strategies for IELTS Speaking Part 1. Understand what examiners are looking for in your responses.',
      duration: 15,
      thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop',
      videoUrl: 'https://example.com/video1.mp4',
      transcript: `Welcome to IELTS Speaking Part 1 preparation.

In this introductory lesson, we'll cover the fundamental structure of IELTS Speaking Part 1 and what examiners are looking for in your responses.

Speaking Part 1 typically lasts 4-5 minutes and consists of questions about yourself, your family, your work or studies, and your hometown. The examiner will ask you familiar questions to help you settle into the speaking test.

Key strategies we'll cover today:
1. Extend your answers beyond simple yes/no responses
2. Use natural speech patterns and linking words
3. Provide specific examples from your own experience
4. Show a range of vocabulary and grammar structures

Remember, Part 1 is designed to be conversational and relaxed. Think of it as a warm-up for the more challenging parts that follow.`,
      isCompleted: true,
      isLocked: false,
      type: 'Video',
      difficulty: 'Beginner',
      rating: 4.8,
      students: 1205,
      instructor: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
        title: 'IELTS Speaking Expert',
        bio: 'Sarah has been teaching IELTS for over 8 years and has helped thousands of students achieve their target scores.'
      },
      resources: [
        {
          id: '1',
          title: 'IELTS Speaking Part 1 Question Bank',
          type: 'PDF',
          url: '#',
          size: '1.5 MB'
        },
        {
          id: '2',
          title: 'Sample Responses Audio',
          type: 'Audio',
          url: '#',
          size: '8.2 MB'
        }
      ],
      objectives: [
        'Understand the structure of IELTS Speaking Part 1',
        'Learn key strategies for extended responses',
        'Practice natural conversation techniques',
        'Build confidence for the speaking test'
      ],
      skills: ['Speaking Fluency', 'Response Structure', 'Confidence Building'],
      comments: [
        {
          id: '1',
          user: {
            name: 'Michael Chen',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
          },
          content: 'Great introduction! This really helped me understand what to expect in Part 1.',
          timestamp: 8.5,
          likes: 15,
          isLiked: false,
          createdAt: '2 days ago'
        }
      ],
      notes: []
    },
    {
      id: '2',
      title: 'Personal Information Questions',
      description: 'Master common questions about yourself, family, work, and studies. Practice natural responses.',
      duration: 18,
      thumbnail: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=400&h=250&fit=crop',
      videoUrl: 'https://example.com/video2.mp4',
      transcript: `In this lesson, we'll focus on personal information questions - the most common type in IELTS Speaking Part 1.

Typical personal information questions include:
- What's your full name?
- Where are you from?
- Do you work or study?
- What do you do for a living/What's your major?
- Do you enjoy your work/studies?

The key is to provide extended answers that show your English ability. Instead of just "I'm a student," try "I'm currently a third-year student studying computer science at Beijing University."

Practice adding details about:
- Your feelings and opinions
- Specific examples
- Reasons for your choices
- Future plans

Remember to speak naturally and don't worry about perfect grammar - fluency and communication are more important.`,
      isCompleted: true,
      isLocked: false,
      type: 'Interactive',
      difficulty: 'Beginner',
      rating: 4.7,
      students: 987,
      instructor: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
        title: 'IELTS Speaking Expert',
        bio: 'Sarah has been teaching IELTS for over 8 years and has helped thousands of students achieve their target scores.'
      },
      resources: [
        {
          id: '1',
          title: 'Personal Information Practice Questions',
          type: 'PDF',
          url: '#',
          size: '900 KB'
        },
        {
          id: '2',
          title: 'Sample Answer Templates',
          type: 'Text',
          url: '#'
        }
      ],
      objectives: [
        'Answer personal questions with extended responses',
        'Use appropriate vocabulary for personal topics',
        'Practice natural conversation flow',
        'Build confidence in self-expression'
      ],
      skills: ['Personal Vocabulary', 'Extended Responses', 'Natural Speech'],
      comments: [],
      notes: []
    },
    {
      id: '3',
      title: 'Hometown and Living Area',
      description: 'Discuss your hometown, neighborhood, and living situation with confidence and detail.',
      duration: 20,
      thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop',
      videoUrl: 'https://example.com/video3.mp4',
      transcript: `Welcome to our lesson on hometown and living area questions.

These are extremely common in IELTS Speaking Part 1. You should be prepared to talk about:
- Your hometown or city
- What you like/dislike about it
- How it has changed
- Your neighborhood
- Your accommodation
- Whether you prefer city or countryside

Key vocabulary areas:
- Describing places (bustling, peaceful, historic, modern)
- Geography (mountains, coastline, plains, rivers)
- Facilities (shopping centers, parks, public transport)
- Atmosphere (lively, quiet, friendly, cosmopolitan)

Practice structure:
1. Direct answer
2. Add details
3. Give examples
4. Express opinion/feeling
5. Compare (past/present, different places)

Example: "I'm from Shanghai, which is a huge metropolitan city in eastern China. What I love most about it is the incredible energy - there's always something happening, whether it's new restaurants opening, cultural events, or business opportunities. The city has changed dramatically in the past decade, with more green spaces and better public transportation."`,
      isCompleted: false,
      isLocked: false,
      type: 'Video',
      difficulty: 'Intermediate',
      rating: 4.9,
      students: 876,
      instructor: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
        title: 'IELTS Speaking Expert',
        bio: 'Sarah has been teaching IELTS for over 8 years and has helped thousands of students achieve their target scores.'
      },
      resources: [
        {
          id: '1',
          title: 'Hometown Description Vocabulary',
          type: 'PDF',
          url: '#',
          size: '1.2 MB'
        },
        {
          id: '2',
          title: 'Comparison Language Structures',
          type: 'Text',
          url: '#'
        },
        {
          id: '3',
          title: 'Practice Recording Exercise',
          type: 'Exercise',
          url: '#'
        }
      ],
      objectives: [
        'Describe your hometown with rich vocabulary',
        'Compare places effectively',
        'Express opinions about living environments',
        'Use descriptive language naturally'
      ],
      skills: ['Descriptive Language', 'Comparison Skills', 'Place Vocabulary'],
      comments: [
        {
          id: '1',
          user: {
            name: 'Emma Wilson',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
          },
          content: 'The vocabulary section is really helpful! I never thought about using "bustling" to describe my city.',
          timestamp: 12.3,
          likes: 8,
          isLiked: true,
          createdAt: '1 day ago'
        }
      ],
      notes: [
        {
          id: '1',
          timestamp: 15.2,
          content: 'Remember to use comparison language when describing changes',
          createdAt: '1 hour ago'
        }
      ]
    },
    {
      id: '4',
      title: 'Hobbies and Interests',
      description: 'Express your interests, hobbies, and leisure activities using rich vocabulary.',
      duration: 16,
      thumbnail: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=250&fit=crop',
      videoUrl: 'https://example.com/video4.mp4',
      transcript: `In this lesson, we'll explore how to talk about hobbies and interests effectively in IELTS Speaking Part 1...`,
      isCompleted: false,
      isLocked: false,
      type: 'Interactive',
      difficulty: 'Intermediate',
      rating: 4.6,
      students: 765,
      instructor: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
        title: 'IELTS Speaking Expert',
        bio: 'Sarah has been teaching IELTS for over 8 years and has helped thousands of students achieve their target scores.'
      },
      resources: [],
      objectives: [],
      skills: [],
      comments: [],
      notes: []
    },
    {
      id: '5',
      title: 'Advanced Part 1 Strategies',
      description: 'Advanced techniques for achieving Band 7+ in IELTS Speaking Part 1.',
      duration: 25,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
      videoUrl: 'https://example.com/video5.mp4',
      transcript: `In this advanced lesson, we'll cover sophisticated strategies for achieving high scores in IELTS Speaking Part 1...`,
      isCompleted: false,
      isLocked: true,
      type: 'Video',
      difficulty: 'Advanced',
      rating: 4.9,
      students: 543,
      instructor: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
        title: 'IELTS Speaking Expert',
        bio: 'Sarah has been teaching IELTS for over 8 years and has helped thousands of students achieve their target scores.'
      },
      resources: [],
      objectives: [],
      skills: [],
      comments: [],
      notes: []
    }
  ],
  strategies: [
    {
      id: '1',
      title: 'Extend Your Answers',
      description: "Don't give one-word answers. Use phrases like 'Actually, I would say...' or 'To be honest...' to add personality and show natural speech patterns.",
      examples: [
        "Q: Do you like your hometown?",
        "A: Actually, I really love it. It's a vibrant city with great food culture and friendly people."
      ]
    },
    {
      id: '2',
      title: 'Use Personal Examples',
      description: 'When asked about hobbies or preferences, give specific examples from your own life. This makes your answers more authentic and interesting.',
      tips: [
        "Share specific details about your experiences",
        "Use past tense to describe what you did",
        "Include your feelings and opinions"
      ]
    }
  ],
  knowledgeChecks: [
    {
      id: '1',
      question: 'How long should your answers typically be in IELTS Speaking Part 1?',
      options: [
        'A) 1-2 words maximum',
        'B) 2-3 sentences per answer',
        'C) As long as possible',
        'D) Just yes/no answers'
      ],
      correctAnswer: 1,
      explanation: 'In Part 1, aim for 2-3 sentences per answer to show your English ability without being too lengthy.'
    }
  ]
}

export default function SubcategoryDetail() {
  const { categoryId, subcategoryId, lessonNumber } = useParams()
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const [subcategoryData] = useState<SubcategoryData>(mockSubcategoryData)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(() => {
    const lessonNum = lessonNumber ? parseInt(lessonNumber) - 1 : 0
    return Math.max(0, Math.min(lessonNum, subcategoryData.lessons.length - 1))
  })
  
  const currentLesson = subcategoryData.lessons[currentLessonIndex]
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  
  // UI state
  const [expandedTranscript, setExpandedTranscript] = useState(false)
  const [expandedStrategies, setExpandedStrategies] = useState(false)
  const [expandedKnowledge, setExpandedKnowledge] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [newNote, setNewNote] = useState('')

  useEffect(() => {
    // Update URL when lesson changes
    const lessonNum = currentLessonIndex + 1
    navigate(`/categories/${categoryId}/subcategories/${subcategoryId}/lesson/${lessonNum}`, { replace: true })
  }, [currentLessonIndex, categoryId, subcategoryId, navigate])

  const progressPercentage = (subcategoryData.completedLessons / subcategoryData.totalLessons) * 100

  const goToNextLesson = () => {
    if (currentLessonIndex < subcategoryData.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
      // Reset video player state
      setCurrentTime(0)
      setIsPlaying(false)
      setExpandedTranscript(false)
      setExpandedStrategies(false)
      setExpandedKnowledge(false)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1)
      // Reset video player state
      setCurrentTime(0)
      setIsPlaying(false)
      setExpandedTranscript(false)
      setExpandedStrategies(false)
      setExpandedKnowledge(false)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const markLessonComplete = () => {
    // Mark current lesson as complete
    toast.success('Lesson marked as complete!')
    // Automatically go to next lesson
    if (currentLessonIndex < subcategoryData.lessons.length - 1) {
      goToNextLesson()
    } else {
      // All lessons completed
      navigate(`/categories/${categoryId}/subcategories/${subcategoryId}`)
    }
  }

  // Video player functions
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const newTime = (value[0] / 100) * duration
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds))
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)
  }

  const addNote = () => {
    if (newNote.trim()) {
      setNewNote('')
      toast.success('Note added!')
    }
  }

  const addComment = () => {
    if (newComment.trim()) {
      setNewComment('')
      toast.success('Comment added!')
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  if (currentLesson.isLocked) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="p-4 border-b bg-card">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">Lesson Locked</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Complete Previous Lessons</h3>
            <p className="text-muted-foreground mb-4">
              You need to complete the previous lessons to unlock this content.
            </p>
            <Button onClick={() => setCurrentLessonIndex(0)}>
              Start from Beginning
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/categories/${categoryId}`)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{subcategoryData.name}</h1>
            <p className="text-sm text-muted-foreground">
              Lesson {currentLessonIndex + 1} of {subcategoryData.totalLessons}
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Course Progress</span>
            <span className="font-medium">
              {subcategoryData.completedLessons} of {subcategoryData.totalLessons} lessons completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-6">
          {/* Video Player */}
          <div className="relative bg-black">
            <video
              ref={videoRef}
              className="w-full aspect-video"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              poster={currentLesson.thumbnail}
            >
              <source src={currentLesson.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <Slider
                  value={[duration ? (currentTime / duration) * 100 : 0]}
                  onValueChange={handleSeek}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => skipTime(-10)}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => skipTime(10)}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <div className="w-20">
                      <Slider
                        value={[isMuted ? 0 : volume * 100]}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                      />
                    </div>
                  </div>
                  
                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 text-sm"
                    onClick={() => {
                      if (videoRef.current) {
                        const newSpeed = playbackSpeed >= 2 ? 0.5 : playbackSpeed + 0.25
                        videoRef.current.playbackRate = newSpeed
                        setPlaybackSpeed(newSpeed)
                      }
                    }}
                  >
                    {playbackSpeed}x
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Lesson Info */}
            <div>
              <h1 className="mb-2">{currentLesson.title}</h1>
              <p className="text-muted-foreground mb-3">{currentLesson.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {currentLesson.duration} minutes
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {currentLesson.students} students
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(currentLesson.rating)}
                  <span>{currentLesson.rating}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={`text-xs ${getDifficultyColor(currentLesson.difficulty)}`}>
                  {currentLesson.difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {currentLesson.type}
                </Badge>
                {currentLesson.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Instructor */}
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <img src={currentLesson.instructor.avatar} alt={currentLesson.instructor.name} className="w-full h-full object-cover rounded-full" />
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{currentLesson.instructor.name}</div>
                    <div className="text-sm text-muted-foreground">{currentLesson.instructor.title}</div>
                    <p className="text-sm text-muted-foreground mt-1">{currentLesson.instructor.bio}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Follow
                  </Button>
                </div>
              </Card>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Learning Objectives */}
                {currentLesson.objectives.length > 0 && (
                  <Card className="p-4">
                    <h3 className="font-medium mb-3">Learning Objectives</h3>
                    <ul className="space-y-2">
                      {currentLesson.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* Strategies - only show for first lesson */}
                {currentLessonIndex === 0 && (
                  <Card>
                    <Collapsible open={expandedStrategies} onOpenChange={setExpandedStrategies}>
                      <CollapsibleTrigger asChild>
                        <CardContent className="p-4 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <h3 className="font-semibold">Key Points & Strategies</h3>
                            </div>
                            {expandedStrategies ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </CardContent>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-4">
                            {subcategoryData.strategies.map((strategy, index) => (
                              <div key={strategy.id} className="border-l-4 border-primary/30 pl-4">
                                <div className="flex items-start gap-3 mb-2">
                                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm mb-1">{strategy.title}</h4>
                                    <p className="text-sm text-muted-foreground">{strategy.description}</p>
                                  </div>
                                </div>
                                
                                {strategy.examples && (
                                  <div className="ml-9 mt-2">
                                    {strategy.examples.map((example, idx) => (
                                      <p key={idx} className="text-xs text-muted-foreground mb-1">
                                        {example}
                                      </p>
                                    ))}
                                  </div>
                                )}
                                
                                {strategy.tips && (
                                  <div className="ml-9 mt-2">
                                    <ul className="text-xs text-muted-foreground space-y-1">
                                      {strategy.tips.map((tip, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                          <span className="text-primary">•</span>
                                          {tip}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}

                {/* Knowledge Check */}
                <Card>
                  <Collapsible open={expandedKnowledge} onOpenChange={setExpandedKnowledge}>
                    <CollapsibleTrigger asChild>
                      <CardContent className="p-4 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <h3 className="font-semibold">Knowledge Check</h3>
                            <Badge variant="outline" className="text-xs">
                              Question 1 of {subcategoryData.knowledgeChecks.length}
                            </Badge>
                          </div>
                          {expandedKnowledge ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="p-4 pt-0">
                        {subcategoryData.knowledgeChecks.map((question) => (
                          <div key={question.id} className="space-y-4">
                            <h4 className="font-medium">{question.question}</h4>
                            
                            <div className="space-y-2">
                              {question.options.map((option, index) => (
                                <Button
                                  key={index}
                                  variant={selectedAnswer === index ? 
                                    (index === question.correctAnswer ? "default" : "destructive") : 
                                    "outline"
                                  }
                                  className="w-full text-left justify-start h-auto p-3"
                                  onClick={() => handleAnswerSelect(index)}
                                  disabled={showExplanation}
                                >
                                  {option}
                                </Button>
                              ))}
                            </div>
                            
                            {showExplanation && question.explanation && (
                              <div className="bg-muted/30 p-3 rounded-lg">
                                <p className="text-sm">
                                  <span className="font-medium">Explanation: </span>
                                  {question.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Downloadable Resources</h3>
                  <div className="space-y-3">
                    {currentLesson.resources.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No resources available for this lesson.</p>
                    ) : (
                      currentLesson.resources.map((resource) => (
                        <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{resource.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {resource.type} {resource.size && `• ${resource.size}`}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="transcript" className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Lesson Transcript</h3>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                      {currentLesson.transcript}
                    </pre>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                {/* Add Note */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Add Note at {formatTime(currentTime)}</h3>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add your note here..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={addNote} disabled={!newNote.trim()}>
                      Add Note
                    </Button>
                  </div>
                </Card>

                {/* Notes List */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Your Notes ({currentLesson.notes.length})</h3>
                  <div className="space-y-3">
                    {currentLesson.notes.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No notes yet. Add a note while watching the video!</p>
                    ) : (
                      currentLesson.notes.map((note) => (
                        <div key={note.id} className="border-l-2 border-primary pl-3">
                          <div className="flex items-center justify-between mb-1">
                            <button 
                              className="text-sm text-primary hover:underline"
                              onClick={() => {
                                if (videoRef.current) {
                                  videoRef.current.currentTime = note.timestamp
                                }
                              }}
                            >
                              {formatTime(note.timestamp)}
                            </button>
                            <span className="text-xs text-muted-foreground">{note.createdAt}</span>
                          </div>
                          <p className="text-sm">{note.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="comments" className="space-y-4">
                {/* Add Comment */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Add a Comment</h3>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Share your thoughts about this lesson..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={addComment} disabled={!newComment.trim()}>
                      Post Comment
                    </Button>
                  </div>
                </Card>

                {/* Comments List */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Comments ({currentLesson.comments.length})</h3>
                  <div className="space-y-4">
                    {currentLesson.comments.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
                    ) : (
                      currentLesson.comments.map((comment) => (
                        <div key={comment.id} className="space-y-2">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                              <img src={comment.user.avatar} alt={comment.user.name} className="w-full h-full object-cover rounded-full" />
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{comment.user.name}</span>
                                <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                                {comment.timestamp > 0 && (
                                  <button 
                                    className="text-xs text-primary hover:underline"
                                    onClick={() => {
                                      if (videoRef.current) {
                                        videoRef.current.currentTime = comment.timestamp
                                      }
                                    }}
                                  >
                                    {formatTime(comment.timestamp)}
                                  </button>
                                )}
                              </div>
                              <p className="text-sm">{comment.content}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                                >
                                  <ThumbsUp className="w-3 h-3 mr-1" />
                                  {comment.likes}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                                >
                                  Reply
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                                >
                                  <Flag className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ScrollArea>

      {/* Navigation Footer */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-center justify-between gap-4">
          {/* Previous Lesson */}
          {currentLessonIndex > 0 ? (
            <Button
              variant="outline"
              onClick={goToPreviousLesson}
              className="flex-1 justify-start gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Previous</div>
                <div className="text-sm font-medium truncate">
                  Lesson {currentLessonIndex}
                </div>
              </div>
            </Button>
          ) : (
            <div className="flex-1" />
          )}

          {/* Mark Complete Button */}
          <Button
            onClick={markLessonComplete}
            className="gap-2"
            disabled={currentLesson.isCompleted}
          >
            {currentLesson.isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Completed
              </>
            ) : (
              'Mark Complete'
            )}
          </Button>

          {/* Next Lesson */}
          {currentLessonIndex < subcategoryData.lessons.length - 1 ? (
            <Button
              onClick={goToNextLesson}
              className="flex-1 justify-end gap-2"
            >
              <div className="text-right">
                <div className="text-xs text-primary-foreground/80">Next</div>
                <div className="text-sm font-medium truncate">
                  Lesson {currentLessonIndex + 2}
                </div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={() => navigate(`/categories/${categoryId}`)}
              className="flex-1 justify-end gap-2"
              variant="outline"
            >
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Back to</div>
                <div className="text-sm font-medium">Categories</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}