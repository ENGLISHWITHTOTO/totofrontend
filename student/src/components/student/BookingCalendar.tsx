import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, ChevronLeft, ChevronRight, User } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Separator } from '../ui/separator'

interface TimeSlot {
  time: string
  available: boolean
  timezone: string
}

interface DaySchedule {
  date: string
  dayName: string
  dayNumber: number
  month: string
  year: number
  timeSlots: TimeSlot[]
}

export default function BookingCalendar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { packageType, teacher } = location.state || {}

  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date())

  // Generate mock schedule for the next 2 weeks
  const generateSchedule = (): DaySchedule[] => {
    const schedule: DaySchedule[] = []
    const startDate = new Date(currentWeekStart)
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
      const month = date.toLocaleDateString('en-US', { month: 'short' })
      
      // Generate time slots based on teacher availability
      const timeSlots: TimeSlot[] = []
      const availableTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM']
      
      availableTimes.forEach(time => {
        timeSlots.push({
          time,
          available: Math.random() > 0.4, // Some randomness for booking
          timezone: teacher?.timezone || 'GMT+1'
        })
      })
      
      schedule.push({
        date: date.toISOString().split('T')[0],
        dayName,
        dayNumber: date.getDate(),
        month,
        year: date.getFullYear(),
        timeSlots
      })
    }
    
    return schedule
  }

  const [schedule] = useState<DaySchedule[]>(generateSchedule())

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentWeekStart(newDate)
  }

  const handleTimeSelect = (date: string, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
  }

  const proceedToBooking = () => {
    if (!selectedDate || !selectedTime) return
    
    navigate(`/teachers/${id}/book/confirm`, {
      state: {
        packageType,
        teacher,
        selectedDate,
        selectedTime,
        timezone: teacher?.timezone
      }
    })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getPackageInfo = () => {
    if (!teacher?.lessonPackages || !packageType) return null
    
    const packages = teacher.lessonPackages as any
    return packages[packageType]
  }

  const packageInfo = getPackageInfo()

  const getPackageTitle = () => {
    switch (packageType) {
      case 'trial': return 'Trial Lesson'
      case 'single': return 'Individual Lesson'
      case 'package5': return '5-Lesson Package'
      case 'package10': return '10-Lesson Package'
      default: return 'Lesson'
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
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
            <h1 className="font-semibold">Select Date & Time</h1>
            <p className="text-sm text-muted-foreground">
              Choose your preferred lesson time
            </p>
          </div>
        </div>

        {/* Teacher & Package Summary */}
        <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50 dark:border-blue-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-12 h-12 ring-2 ring-blue-200 dark:ring-blue-800">
                <AvatarImage src={teacher?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                  {teacher?.name?.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{teacher?.name}</h3>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-0 text-xs">
                    Verified
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{teacher?.location}</p>
              </div>
            </div>
            
            <Separator className="my-3 bg-blue-200/50 dark:bg-blue-800/50" />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">{getPackageTitle()}</h4>
                <p className="text-xs text-muted-foreground">{packageInfo?.description}</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-600">${packageInfo?.price}</div>
                <div className="text-xs text-muted-foreground">{packageInfo?.duration} min</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Calendar Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('prev')}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="text-center">
              <div className="font-medium">
                {currentWeekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <div className="text-sm text-muted-foreground">
                Week of {currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('next')}
              className="gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Weekly Schedule */}
          <div className="space-y-4">
            {schedule.slice(0, 7).map((day) => {
              const availableSlots = day.timeSlots.filter(slot => slot.available)
              const isToday = day.date === new Date().toISOString().split('T')[0]
              
              return (
                <Card key={day.date} className={`transition-all ${isToday ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className={`text-xl font-bold ${isToday ? 'text-primary' : ''}`}>{day.dayNumber}</div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider">{day.month}</div>
                        </div>
                        <div>
                          <div className={`font-medium ${isToday ? 'text-primary' : ''}`}>
                            {day.dayName}
                            {isToday && <span className="ml-2 text-xs text-primary">(Today)</span>}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {teacher?.timezone} • {availableSlots.length} slots available
                          </div>
                        </div>
                      </div>
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardHeader>

                  <CardContent>
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {day.timeSlots.map((slot) => (
                          <Button
                            key={slot.time}
                            variant={
                              selectedDate === day.date && selectedTime === slot.time
                                ? 'default'
                                : 'outline'
                            }
                            size="sm"
                            disabled={!slot.available}
                            onClick={() => handleTimeSelect(day.date, slot.time)}
                            className={`text-sm h-10 transition-all ${
                              selectedDate === day.date && selectedTime === slot.time
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg scale-105'
                                : slot.available
                                ? 'hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/50'
                                : 'opacity-40'
                            }`}
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-sm text-muted-foreground">
                        <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        No available slots for this day
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Time Zone Info */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <span className="font-medium">All times shown in {teacher?.timezone}</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Times will be automatically converted to your local timezone during checkout
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Time Summary */}
          {selectedDate && selectedTime && (
            <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Clock className="w-5 h-5" />
                  Selected Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium">{formatDate(selectedDate)}</div>
                    <div className="text-sm text-muted-foreground">at {selectedTime} ({teacher?.timezone})</div>
                  </div>
                  
                  <Separator className="bg-blue-200/50 dark:bg-blue-800/50" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <div className="font-medium">{packageInfo?.duration} minutes</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Price:</span>
                      <div className="font-medium text-blue-600">${packageInfo?.price}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/30 rounded-lg p-2">
                    <User className="w-4 h-4" />
                    <span>You'll receive a calendar invite and Zoom link after booking</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Bottom Action */}
      <div className="p-4 border-t border-border/50 bg-card/80 backdrop-blur-sm">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 h-12"
          onClick={proceedToBooking}
          disabled={!selectedDate || !selectedTime}
        >
          {selectedDate && selectedTime ? (
            <>
              Continue to Payment • ${packageInfo?.price}
            </>
          ) : (
            'Select a time slot to continue'
          )}
        </Button>
        
        {selectedDate && selectedTime && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            You can reschedule or cancel up to 24 hours before your lesson
          </p>
        )}
      </div>
    </div>
  )
}