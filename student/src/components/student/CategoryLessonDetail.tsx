import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Maximize, Settings, Download, Share2, BookOpen, CheckCircle,
  Clock, Users, Star, MessageCircle, ThumbsUp, Flag, MoreHorizontal
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Avatar } from '../ui/avatar'
import { Textarea } from '../ui/textarea'
import { Slider } from '../ui/slider'
import { toast } from 'sonner'

interface LessonNote {
  id: string
  timestamp: number
  content: string
  createdAt: string
}

interface Comment {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  timestamp: number
  likes: number
  isLiked: boolean
  replies: Comment[]
  createdAt: string
}

interface LessonDetail {
  id: string
  title: string
  description: string
  duration: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  type: 'Video' | 'Interactive' | 'Reading' | 'Listening' | 'Speaking'
  instructor: {
    name: string
    avatar: string
    title: string
    bio: string
  }
  videoUrl: string
  transcript: string
  resources: {
    id: string
    title: string
    type: 'PDF' | 'Audio' | 'Text' | 'Exercise'
    url: string
    size?: string
  }[]
  objectives: string[]
  skills: string[]
  rating: number
  reviewCount: number
  isCompleted: boolean
  progress: number
  nextLesson?: {
    id: string
    title: string
  }
  previousLesson?: {
    id: string
    title: string
  }
  relatedLessons: {
    id: string
    title: string
    duration: number
    thumbnail: string
  }[]
  comments: Comment[]
  notes: LessonNote[]
}

// Mock lesson data
const mockLesson: LessonDetail = {
  id: '3',
  title: 'Business Presentation Skills',
  description: 'Develop confidence and skills for delivering impactful business presentations. Learn how to structure your content, use visual aids effectively, and engage your audience.',
  duration: 45,
  level: 'Intermediate',
  type: 'Video',
  instructor: {
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
    title: 'Business English Expert',
    bio: 'Sarah has been teaching business English for over 10 years and has helped thousands of professionals improve their communication skills.'
  },
  videoUrl: 'https://example.com/video.mp4', // Mock URL
  transcript: `Welcome to Business Presentation Skills. In this lesson, we'll cover the essential elements of delivering powerful business presentations.

First, let's talk about structure. A good business presentation has three main parts: the introduction, the body, and the conclusion.

In the introduction, you should grab your audience's attention, state your purpose clearly, and preview what you'll be covering.

The body should contain your main points, supported by evidence and examples. Use clear transitions between points to help your audience follow along.

Finally, your conclusion should summarize your main points and end with a strong call to action.

Remember, practice makes perfect. The more you practice your presentation, the more confident you'll become.`,
  resources: [
    {
      id: '1',
      title: 'Presentation Structure Template',
      type: 'PDF',
      url: '#',
      size: '2.3 MB'
    },
    {
      id: '2',
      title: 'Business Vocabulary List',
      type: 'PDF',
      url: '#',
      size: '1.8 MB'
    },
    {
      id: '3',
      title: 'Practice Exercises',
      type: 'Exercise',
      url: '#'
    },
    {
      id: '4',
      title: 'Audio Pronunciation Guide',
      type: 'Audio',
      url: '#',
      size: '15.2 MB'
    }
  ],
  objectives: [
    'Structure compelling business presentations',
    'Use visual aids effectively',
    'Handle questions confidently',
    'Engage your audience throughout',
    'Deliver with confidence and clarity'
  ],
  skills: ['Public Speaking', 'Visual Aids', 'Q&A Handling', 'Audience Engagement'],
  rating: 4.7,
  reviewCount: 987,
  isCompleted: false,
  progress: 65,
  nextLesson: {
    id: '4',
    title: 'Meeting Participation & Leadership'
  },
  previousLesson: {
    id: '2',
    title: 'Professional Email Writing'
  },
  relatedLessons: [
    {
      id: '2',
      title: 'Professional Email Writing',
      duration: 35,
      thumbnail: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=200&h=120&fit=crop'
    },
    {
      id: '4',
      title: 'Meeting Participation',
      duration: 40,
      thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&h=120&fit=crop'
    },
    {
      id: '5',
      title: 'Negotiation Skills',
      duration: 50,
      thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200&h=120&fit=crop'
    }
  ],
  comments: [
    {
      id: '1',
      user: {
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
      },
      content: 'Excellent lesson! The structure template is really helpful for organizing my thoughts before presentations.',
      timestamp: 15.5,
      likes: 12,
      isLiked: false,
      replies: [
        {
          id: '1-1',
          user: {
            name: 'Sarah Johnson',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face'
          },
          content: 'Thank you, Michael! I\'m glad you found the template useful.',
          timestamp: 0,
          likes: 3,
          isLiked: false,
          replies: [],
          createdAt: '2 days ago'
        }
      ],
      createdAt: '3 days ago'
    },
    {
      id: '2',
      user: {
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
      },
      content: 'Could you provide more examples of effective opening statements?',
      timestamp: 8.2,
      likes: 5,
      isLiked: true,
      replies: [],
      createdAt: '1 day ago'
    }
  ],
  notes: [
    {
      id: '1',
      timestamp: 12.5,
      content: 'Remember: Introduction should grab attention and state purpose clearly',
      createdAt: '2 hours ago'
    },
    {
      id: '2',
      timestamp: 28.7,
      content: 'Practice transitions between main points - very important!',
      createdAt: '2 hours ago'
    }
  ]
}

export default function CategoryLessonDetail() {
  const { categoryId, lessonId } = useParams()
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const [lesson] = useState<LessonDetail>(mockLesson)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [newComment, setNewComment] = useState('')
  const [newNote, setNewNote] = useState('')
  const [showTranscript, setShowTranscript] = useState(false)

  useEffect(() => {
    // Mark lesson as viewed
    if (lesson.progress === 0) {
      // Start progress tracking
    }
  }, [lesson.progress])

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
      // Update progress
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      // Update lesson progress in real app
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

  const addNote = () => {
    if (newNote.trim()) {
      const note: LessonNote = {
        id: Date.now().toString(),
        timestamp: currentTime,
        content: newNote,
        createdAt: 'Just now'
      }
      // Add note to lesson in real app
      setNewNote('')
      toast.success('Note added!')
    }
  }

  const addComment = () => {
    if (newComment.trim()) {
      // Add comment in real app
      setNewComment('')
      toast.success('Comment added!')
    }
  }

  const markComplete = () => {
    // Mark lesson as complete in real app
    toast.success('Lesson marked as complete!')
    navigate(`/categories/${categoryId}`)
  }

  const goToNextLesson = () => {
    if (lesson.nextLesson) {
      navigate(`/categories/${categoryId}/lessons/${lesson.nextLesson.id}`)
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
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/categories/${categoryId}`)}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="truncate">{lesson.title}</h1>
            <p className="text-sm text-muted-foreground">
              {lesson.duration} min • {lesson.level}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
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
            >
              <source src={lesson.videoUrl} type="video/mp4" />
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
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="mb-2">{lesson.title}</h1>
                  <p className="text-muted-foreground mb-3">{lesson.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {lesson.duration} minutes
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {lesson.reviewCount} students
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(Math.floor(lesson.rating))}
                      <span>{lesson.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">{lesson.level}</Badge>
                    <Badge variant="outline">{lesson.type}</Badge>
                    {lesson.skills.map((skill) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{Math.round(lesson.progress)}% complete</span>
                </div>
                <Progress value={lesson.progress} className="h-2" />
              </div>

              {/* Instructor */}
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <img src={lesson.instructor.avatar} alt={lesson.instructor.name} className="w-full h-full object-cover rounded-full" />
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{lesson.instructor.name}</div>
                    <div className="text-sm text-muted-foreground">{lesson.instructor.title}</div>
                    <p className="text-sm text-muted-foreground mt-1">{lesson.instructor.bio}</p>
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
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Learning Objectives</h3>
                  <ul className="space-y-2">
                    {lesson.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Related Lessons */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Related Lessons</h3>
                  <div className="space-y-3">
                    {lesson.relatedLessons.map((related) => (
                      <div 
                        key={related.id} 
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => navigate(`/categories/${categoryId}/lessons/${related.id}`)}
                      >
                        <img
                          src={related.thumbnail}
                          alt={related.title}
                          className="w-16 h-10 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{related.title}</div>
                          <div className="text-xs text-muted-foreground">{related.duration} min</div>
                        </div>
                        <Play className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Downloadable Resources</h3>
                  <div className="space-y-3">
                    {lesson.resources.map((resource) => (
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
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="transcript" className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Lesson Transcript</h3>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                      {lesson.transcript}
                    </pre>
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
                  <h3 className="font-medium mb-3">Your Notes ({lesson.notes.length})</h3>
                  <div className="space-y-3">
                    {lesson.notes.map((note) => (
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
                    ))}
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
                  <h3 className="font-medium mb-3">Comments ({lesson.comments.length})</h3>
                  <div className="space-y-4">
                    {lesson.comments.map((comment) => (
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
                            <p className="text-sm mb-2">{comment.content}</p>
                            <div className="flex items-center gap-3">
                              <Button variant="ghost" size="sm" className="gap-1 h-auto p-1">
                                <ThumbsUp className={`w-3 h-3 ${comment.isLiked ? 'fill-current text-primary' : ''}`} />
                                <span className="text-xs">{comment.likes}</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-1 h-auto p-1">
                                <MessageCircle className="w-3 h-3" />
                                <span className="text-xs">Reply</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-1 h-auto p-1">
                                <Flag className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="ml-11 space-y-2">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-3">
                                <Avatar className="w-6 h-6">
                                  <img src={reply.user.avatar} alt={reply.user.name} className="w-full h-full object-cover rounded-full" />
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-xs">{reply.user.name}</span>
                                    <span className="text-xs text-muted-foreground">{reply.createdAt}</span>
                                  </div>
                                  <p className="text-xs">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ScrollArea>

      {/* Navigation */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-center gap-3">
          {lesson.previousLesson && (
            <Button 
              variant="outline" 
              onClick={() => navigate(`/categories/${categoryId}/lessons/${lesson.previousLesson?.id}`)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
          )}
          
          <div className="flex-1">
            {!lesson.isCompleted && (
              <Button onClick={markComplete} className="w-full gap-2">
                <CheckCircle className="w-4 h-4" />
                Mark Complete
              </Button>
            )}
          </div>
          
          {lesson.nextLesson && (
            <Button onClick={goToNextLesson} className="gap-2">
              Next
              <SkipForward className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}