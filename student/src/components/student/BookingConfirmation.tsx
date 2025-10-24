import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { X, Calendar, Eye, User } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Dialog, DialogContent } from '../ui/dialog'
import { toast } from 'sonner'
import celebrationImage from 'figma:asset/56c236867d2a5cf143715298b254d33594264dc2.png'

export default function BookingConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { bookingData } = location.state || {}
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    // Add booking confirmation to localStorage (simulate database)
    if (bookingData) {
      const existingBookings = JSON.parse(localStorage.getItem('user_bookings') || '[]')
      existingBookings.push(bookingData)
      localStorage.setItem('user_bookings', JSON.stringify(existingBookings))
    }
  }, [bookingData])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const addToCalendar = () => {
    // Create ICS calendar event
    const startDate = new Date(`${bookingData.date} ${bookingData.time}`)
    const endDate = new Date(startDate.getTime() + (bookingData.duration * 60000))
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Language Learning Platform//EN
BEGIN:VEVENT
UID:${bookingData.bookingId}@languageapp.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:Language Lesson with ${bookingData.teacherName}
DESCRIPTION:${bookingData.lessonType} lesson\\nBooking ID: ${bookingData.bookingId}
LOCATION:Online Video Call
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lesson-${bookingData.bookingId}.ics`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Calendar event downloaded')
  }

  const viewBookings = () => {
    setIsOpen(false)
    navigate('/profile') // Navigate to profile where user can see their bookings
  }

  const returnToTeacherProfile = () => {
    setIsOpen(false)
    navigate(`/teachers/${bookingData.teacherId}`)
  }

  const handleClose = () => {
    setIsOpen(false)
    navigate('/')
  }

  if (!bookingData) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-muted-foreground mb-4">No booking information found.</p>
        <Button onClick={() => navigate('/teachers')}>Find Teachers</Button>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm mx-auto p-0 gap-0 bg-background border-border rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-1 h-auto"
          >
            <X className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold">Booking Confirmed</h1>
          <div className="w-8"></div>
        </div>

        {/* Celebration Image */}
        <div className="px-6 pt-6">
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 rounded-2xl p-6 mb-6">
            <img 
              src={celebrationImage} 
              alt="Celebration" 
              className="w-full h-32 object-contain"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Main Message */}
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Your booking is confirmed!</h2>
            <p className="text-sm text-muted-foreground">
              You're all set to learn with {bookingData.teacherName}. We've sent you a confirmation email with all the details.
            </p>
          </div>

          {/* Teacher Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-2xl">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/api/placeholder/48/48" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                {bookingData.teacherName.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{bookingData.teacherName}</h3>
              <p className="text-sm text-muted-foreground">
                {bookingData.lessonType || 'Language Lesson'}
              </p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{formatDate(bookingData.date)}</span>
            </div>
            
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium">{bookingData.time}</span>
            </div>
            
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Price</span>
              <span className="font-medium">${bookingData.price}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={addToCalendar}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white gap-2"
            >
              <Calendar className="w-4 h-4" />
              Add to Calendar
            </Button>
            
            <Button 
              variant="secondary"
              onClick={viewBookings}
              className="w-full gap-2"
            >
              <Eye className="w-4 h-4" />
              View Bookings
            </Button>
            
            <Button 
              variant="secondary"
              onClick={returnToTeacherProfile}
              className="w-full gap-2"
            >
              <User className="w-4 h-4" />
              Return to Teacher Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}