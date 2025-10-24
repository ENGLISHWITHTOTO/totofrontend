import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Calendar } from "../ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Clock, Star, Users, Award, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useState } from "react"

interface AvailabilityPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dateAvailability: Record<string, boolean[]>
  selectedTimeZone: string
}

export function AvailabilityPreviewModal({ 
  open, 
  onOpenChange,
  dateAvailability,
  selectedTimeZone
}: AvailabilityPreviewModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Get date string in YYYY-MM-DD format
  const getDateString = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  // Get availability for a specific date
  const getAvailabilityForDate = (date: Date): boolean[] => {
    const dateStr = getDateString(date)
    return dateAvailability[dateStr] || Array(24).fill(false)
  }

  // Check if a date has any availability
  const hasAvailability = (date: Date): boolean => {
    const dateStr = getDateString(date)
    return dateAvailability[dateStr]?.some(slot => slot) || false
  }

  const formatTime = (hour24: number): string => {
    if (hour24 === 0) return '12 AM'
    if (hour24 === 12) return '12 PM'
    if (hour24 < 12) return `${hour24} AM`
    return `${hour24 - 12} PM`
  }

  const formatTimeRange = (hour24: number): string => {
    const start = formatTime(hour24)
    const end = formatTime((hour24 + 1) % 24)
    return `${start} - ${end}`
  }

  const getMonthName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }

  // Mock teacher data
  const teacherData = {
    name: "Sarah Johnson",
    avatar: "SJ",
    rating: 4.9,
    totalReviews: 247,
    totalStudents: 892,
    expertise: ["IELTS Preparation", "Business English", "Conversation"],
    hourlyRate: 35,
    responseTime: "within 2 hours"
  }

  const availableSlots = selectedDate ? getAvailabilityForDate(selectedDate)
    .map((available, hour) => available ? hour : null)
    .filter(hour => hour !== null) : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle>Student View Preview</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                This is how students see your availability when booking sessions
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-6 pt-4">
            {/* Teacher Profile Card */}
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-violet-600/5">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Avatar and Basic Info */}
                  <div className="flex flex-col items-center sm:items-start gap-4">
                    <Avatar className="h-24 w-24 border-4 border-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white text-2xl">
                        {teacherData.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center sm:text-left">
                      <h3 className="font-semibold text-lg">{teacherData.name}</h3>
                      <p className="text-sm text-muted-foreground">English Language Teacher</p>
                    </div>
                  </div>

                  {/* Stats and Info */}
                  <div className="flex-1 space-y-4">
                    {/* Rating and Stats */}
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                        <span className="font-semibold">{teacherData.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({teacherData.totalReviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{teacherData.totalStudents} students</span>
                      </div>
                    </div>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2">
                      {teacherData.expertise.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {/* Pricing and Response Time */}
                    <div className="flex flex-wrap gap-4 pt-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-semibold text-primary">${teacherData.hourlyRate}</span>
                        <span className="text-sm text-muted-foreground">/hour</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        <span className="text-muted-foreground">
                          Responds <span className="text-emerald-500 font-medium">{teacherData.responseTime}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Section */}
            <div className="grid lg:grid-cols-[340px_1fr] gap-6">
              {/* Calendar */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-base">Select Date</CardTitle>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={goToPreviousMonth}
                        className="h-7 w-7 p-0"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={goToToday}
                        className="h-7 px-2 text-xs"
                      >
                        Today
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={goToNextMonth}
                        className="h-7 w-7 p-0"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{getMonthName(currentMonth)}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    className="rounded-md border-0 p-0"
                    disabled={(date) => !hasAvailability(date) || date < new Date(new Date().setHours(0, 0, 0, 0))}
                    modifiers={{
                      available: (date) => hasAvailability(date) && date >= new Date(new Date().setHours(0, 0, 0, 0))
                    }}
                    modifiersClassNames={{
                      available: "bg-emerald-500/20 text-emerald-600 font-semibold hover:bg-emerald-500/30"
                    }}
                  />
                  
                  {/* Legend */}
                  <div className="pt-3 border-t border-border space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40"></div>
                      <span className="text-muted-foreground">Available dates</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-muted/50 border-2 border-border"></div>
                      <span className="text-muted-foreground">Unavailable</span>
                    </div>
                  </div>

                  {/* Timezone Info */}
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Timezone:</span> {selectedTimeZone}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Time Slots */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {selectedDate ? 'Available Time Slots' : 'Select a date'}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {selectedDate 
                      ? `${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`
                      : 'Choose a date to see available times'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!selectedDate || availableSlots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-1">
                        {!selectedDate ? 'No Date Selected' : 'No Available Slots'}
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        {!selectedDate 
                          ? 'Please select a date from the calendar to view available time slots'
                          : 'This teacher has no available slots on this date. Please choose another date.'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Available slots info */}
                      <div className="flex items-center justify-between px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <p className="text-sm text-emerald-600 font-medium">
                          {availableSlots.length} time slot{availableSlots.length !== 1 ? 's' : ''} available
                        </p>
                      </div>

                      {/* Time slot grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-1 smooth-scroll">
                        {availableSlots.map((hour) => (
                          <Button
                            key={hour}
                            variant="outline"
                            className="h-14 flex flex-col items-center justify-center gap-1 hover:bg-primary/10 hover:border-primary/50 transition-all"
                          >
                            <span className="font-semibold">{formatTime(hour as number)}</span>
                            <span className="text-xs text-muted-foreground">${teacherData.hourlyRate}</span>
                          </Button>
                        ))}
                      </div>

                      {/* Booking info */}
                      <div className="pt-3 border-t border-border">
                        <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                          <Award className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <div className="text-xs text-muted-foreground">
                            <p className="font-medium text-foreground mb-1">Flexible Booking Policy</p>
                            <p>Cancel or reschedule up to 24 hours before your session for a full refund.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sample Reviews */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    name: "Michael Chen",
                    rating: 5,
                    date: "2 weeks ago",
                    comment: "Excellent teacher! Very patient and explains concepts clearly. My IELTS score improved significantly."
                  },
                  {
                    name: "Emma Rodriguez",
                    rating: 5,
                    date: "1 month ago",
                    comment: "Great business English sessions. Helped me prepare for important presentations at work."
                  }
                ].map((review, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {review.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{review.name}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              💡 This preview shows how students will see your profile and availability
            </p>
            <Button onClick={() => onOpenChange(false)}>
              Close Preview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
