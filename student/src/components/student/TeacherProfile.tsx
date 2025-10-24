import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Star, ChevronLeft, ChevronRight, UserPlus, 
  BookOpen, Clock, Users, Play, MessageCircle
} from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import { Progress } from '../ui/progress'

interface Review {
  id: string
  studentName: string
  studentAvatar: string
  rating: number
  comment: string
  date: string
  lessonType: string
}

interface CalendarDay {
  date: number
  isToday: boolean
  isAvailable: boolean
  timeSlots: string[]
}

interface TeacherDetails {
  id: string
  name: string
  title: string
  avatar: string
  bio: string
  specialties: string[]
  rating: number
  reviewCount: number
  totalStudents: number
  yearsExperience: number
  hourlyRate: number
  languages: string[]
  isFollowed: boolean
  availableLessons: {
    id: string
    title: string
    description: string
    duration: number
    price: number
    level: string
    category: string
    students: number
  }[]
  calendar: {
    month: string
    year: number
    days: CalendarDay[]
    availableTimeSlots: string[]
  }
  reviews: Review[]
}

// Mock teacher data based on the image
const mockTeacherDetails: TeacherDetails = {
  id: '1',
  name: 'Sophia Chen',
  title: 'IELTS Teacher',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b812c8f9?w=200&h=200&fit=crop&crop=face',
  bio: 'Certified IELTS instructor and Business English specialist. Over 5 years of experience. She specializes in IELTS conversation and Business English, helping students achieve their language goals.',
  specialties: ['IELTS Prep', 'Business English', 'Conversation', 'Grammar'],
  rating: 4.8,
  reviewCount: 234,
  totalStudents: 1250,
  yearsExperience: 5,
  hourlyRate: 25,
  languages: ['English', 'Mandarin'],
  isFollowed: false,
  availableLessons: [
    {
      id: '1',
      title: 'IELTS Speaking Mastery',
      description: 'Complete guide for IELTS speaking tasks',
      duration: 60,
      price: 45,
      level: 'Intermediate',
      category: 'IELTS Prep',
      students: 89
    },
    {
      id: '2',
      title: 'Business English Professionals',
      description: 'Professional communication and presentation skills',
      duration: 45,
      price: 40,
      level: 'Advanced',
      category: 'Business English',
      students: 156
    },
    {
      id: '3',
      title: 'Advanced Writing',
      description: 'Master academic and professional writing',
      duration: 50,
      price: 38,
      level: 'Advanced',
      category: 'Writing',
      students: 67
    }
  ],
  calendar: {
    month: 'July',
    year: 2024,
    days: [
      // Generate calendar days for July 2024
      ...Array.from({ length: 31 }, (_, i) => ({
        date: i + 1,
        isToday: i + 1 === 15, // July 15th as today
        isAvailable: [1, 2, 3, 8, 9, 10, 15, 16, 17, 22, 23, 24, 29, 30, 31].includes(i + 1),
        timeSlots: [1, 2, 3, 8, 9, 10, 15, 16, 17, 22, 23, 24, 29, 30, 31].includes(i + 1) 
          ? ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'] 
          : []
      }))
    ],
    availableTimeSlots: ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM']
  },
  reviews: [
    {
      id: '1',
      studentName: 'William Watson',
      studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      rating: 5,
      comment: 'Sophia has made learning business English so much easier. Her structured approach and practical examples have significantly improved my confidence and score.',
      date: '2 days ago',
      lessonType: 'Business English'
    },
    {
      id: '2',
      studentName: 'Ana Harper',
      studentAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      rating: 4,
      comment: 'The business English course was well-structured. I learned a lot about professional communication and improved my presentation skills.',
      date: '1 week ago',
      lessonType: 'Business English'
    }
  ]
}

export default function TeacherProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [teacher] = useState<TeacherDetails>(mockTeacherDetails)
  const [isFollowed, setIsFollowed] = useState(teacher.isFollowed)
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(0) // 0 for current month

  const toggleFollow = () => {
    setIsFollowed(!isFollowed)
  }

  const handleDateSelect = (date: number, timeSlots: string[]) => {
    if (timeSlots.length > 0) {
      setSelectedDate(date)
      setSelectedTimeSlot(null) // Reset time slot when changing date
    }
  }

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot)
  }

  const bookSelectedLesson = () => {
    if (selectedDate && selectedTimeSlot) {
      navigate(`/teachers/${id}/book/confirm`, {
        state: {
          packageType: 'single',
          teacher,
          selectedDate: `2024-07-${selectedDate.toString().padStart(2, '0')}`,
          selectedTime: selectedTimeSlot,
          timezone: 'GMT+8'
        }
      })
    }
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < fullStars 
                ? 'fill-yellow-400 text-yellow-400' 
                : i === fullStars && hasHalfStar
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const selectedDay = teacher.calendar.days.find(day => day.date === selectedDate)

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Teacher Profile</h1>
          <div></div>
        </div>

        {/* Teacher Info */}
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={teacher.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
              {teacher.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-bold mb-1">{teacher.name}</h2>
          <p className="text-muted-foreground mb-4">{teacher.title}</p>
          
          <Button 
            variant={isFollowed ? "secondary" : "default"}
            onClick={toggleFollow}
            className="gap-2 px-8"
          >
            <UserPlus className="w-4 h-4" />
            {isFollowed ? 'Following' : 'Follow'}
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">{teacher.bio}</p>
            
            <div className="flex flex-wrap gap-2">
              {teacher.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          {/* Lessons Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Lessons</h3>
            <div className="space-y-3">
              {teacher.availableLessons.map((lesson) => (
                <Card key={lesson.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{lesson.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{lesson.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{lesson.level}</span>
                        <span>•</span>
                        <span>{lesson.duration} min</span>
                        <span>•</span>
                        <span>{lesson.students} students</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">${lesson.price}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Availability Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Availability</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(currentMonth - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium px-3">
                  {teacher.calendar.month} {teacher.calendar.year}
                </span>
                <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(currentMonth + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <Card className="p-4 mb-4">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div key={`day-header-${index}`} className="text-center text-xs font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: 2 }, (_, i) => (
                  <div key={`empty-start-${i}`} className="h-10" />
                ))}
                
                {teacher.calendar.days.map((day, index) => (
                  <button
                    key={`calendar-day-${day.date}-${index}`}
                    onClick={() => handleDateSelect(day.date, day.timeSlots)}
                    disabled={!day.isAvailable}
                    className={`
                      h-10 rounded-lg text-sm transition-colors
                      ${day.isToday 
                        ? 'bg-primary text-primary-foreground font-semibold' 
                        : day.isAvailable
                        ? selectedDate === day.date
                          ? 'bg-primary/20 text-primary border-2 border-primary'
                          : 'hover:bg-muted text-foreground'
                        : 'text-muted-foreground cursor-not-allowed opacity-50'
                      }
                    `}
                  >
                    {day.date}
                  </button>
                ))}
              </div>
            </Card>

            {/* Time Slots */}
            {selectedDate && selectedDay && (
              <div>
                <h4 className="font-medium mb-3">Time Slots</h4>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {selectedDay.timeSlots.map((timeSlot, index) => (
                    <Button
                      key={`time-slot-${selectedDate}-${timeSlot}-${index}`}
                      variant={selectedTimeSlot === timeSlot ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTimeSlotSelect(timeSlot)}
                      className="justify-center"
                    >
                      {timeSlot}
                    </Button>
                  ))}
                </div>
                
                {selectedTimeSlot && (
                  <Button
                    onClick={bookSelectedLesson}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Book Lesson
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reviews</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{teacher.rating}</span>
                <div className="flex flex-col items-end">
                  {renderStars(teacher.rating)}
                  <span className="text-xs text-muted-foreground">{teacher.reviewCount} reviews</span>
                </div>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2 mb-6">
              {[5, 4, 3, 2, 1].map((stars, index) => (
                <div key={`rating-${stars}-${index}`} className="flex items-center gap-3">
                  <span className="text-sm w-3">{stars}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <Progress value={stars === 5 ? 85 : stars === 4 ? 12 : 3} className="flex-1 h-2" />
                  <span className="text-xs text-muted-foreground w-8">
                    {stars === 5 ? '85%' : stars === 4 ? '12%' : '3%'}
                  </span>
                </div>
              ))}
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4">
              {teacher.reviews.map((review) => (
                <Card key={review.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.studentAvatar} />
                      <AvatarFallback>{review.studentName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{review.studentName}</h4>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-border/50 bg-background">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 gap-2"
            onClick={() => navigate('/chat', { state: { teacherId: teacher.id } })}
          >
            <MessageCircle className="w-4 h-4" />
            Message
          </Button>
          <Button 
            className="flex-1 gap-2 bg-primary hover:bg-primary/90"
            onClick={() => selectedDate && selectedTimeSlot ? bookSelectedLesson() : handleDateSelect(15, ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'])}
          >
            <Clock className="w-4 h-4" />
            Book Session
          </Button>
        </div>
      </div>
    </div>
  )
}