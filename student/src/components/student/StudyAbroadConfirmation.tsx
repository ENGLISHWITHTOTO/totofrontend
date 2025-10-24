import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  CheckCircle, Calendar, MapPin, Users, Plane, Home, 
  Download, Share2, Copy, Check, Phone, Mail, 
  FileText, Clock, CreditCard, AlertCircle
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Avatar } from '../ui/avatar'
import { Separator } from '../ui/separator'
import { toast } from 'sonner'

export default function StudyAbroadConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { bookingData } = location.state || {}
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Add booking to localStorage (simulate database)
    if (bookingData) {
      const existingBookings = JSON.parse(localStorage.getItem('study_abroad_bookings') || '[]')
      existingBookings.push(bookingData)
      localStorage.setItem('study_abroad_bookings', JSON.stringify(existingBookings))
    }
  }, [bookingData])

  const copyBookingDetails = () => {
    const details = `
Study Abroad Booking Confirmation
Booking ID: ${bookingData.bookingId}
${bookingData.type === 'programs' ? 'Program' : 'Homestay'}: ${bookingData.item.title}
Location: ${bookingData.item.city}, ${bookingData.item.country}
Start Date: ${bookingData.bookingDetails.startDate}
Duration: ${bookingData.bookingDetails.duration} weeks
Total: $${bookingData.total.toLocaleString()}
    `.trim()

    navigator.clipboard.writeText(details).then(() => {
      setCopied(true)
      toast.success('Booking details copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const downloadConfirmation = () => {
    // Create a simple text file with booking details
    const details = `
STUDY ABROAD BOOKING CONFIRMATION

Booking ID: ${bookingData.bookingId}
Status: ${bookingData.status.toUpperCase()}
Booking Date: ${new Date().toLocaleDateString()}

PROGRAM/HOMESTAY DETAILS:
${bookingData.type === 'programs' ? 'Study Program' : 'Homestay'}: ${bookingData.item.title}
Location: ${bookingData.item.city}, ${bookingData.item.country}
${bookingData.type === 'programs' ? `Institution: ${bookingData.item.institution}` : `Host: ${bookingData.item.hostName}`}

BOOKING DETAILS:
Start Date: ${bookingData.bookingDetails.startDate}
Duration: ${bookingData.bookingDetails.duration} weeks
${bookingData.type === 'programs' && bookingData.bookingDetails.accommodationType ? `Accommodation: ${bookingData.bookingDetails.accommodationType}` : ''}

PERSONAL INFORMATION:
Name: ${bookingData.personalInfo.firstName} ${bookingData.personalInfo.lastName}
Email: ${bookingData.personalInfo.email}
Phone: ${bookingData.personalInfo.phone}
Nationality: ${bookingData.personalInfo.nationality}

PAYMENT DETAILS:
Payment Method: ${bookingData.paymentMethod}
Total Amount: $${bookingData.total.toLocaleString()}
Status: Paid

IMPORTANT NOTES:
- Your booking will be confirmed within 24 hours
- You will receive detailed information via email
- Please ensure your passport is valid for at least 6 months
- Contact us for any questions or changes

Thank you for choosing our study abroad program!
    `.trim()

    const blob = new Blob([details], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `booking-confirmation-${bookingData.bookingId}.txt`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Confirmation downloaded')
  }

  const shareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Study Abroad Booking Confirmed',
        text: `I just booked ${bookingData.item.title} in ${bookingData.item.city}!`,
        url: window.location.href
      })
    } else {
      copyBookingDetails()
    }
  }

  if (!bookingData) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-muted-foreground mb-4">No booking information found.</p>
        <Button onClick={() => navigate('/study-abroad')}>Browse Programs</Button>
      </div>
    )
  }

  const isProgram = bookingData.type === 'programs'
  const item = bookingData.item

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-6">
          {/* Success Header */}
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your {isProgram ? 'study abroad program' : 'homestay'} booking has been successfully submitted.
            </p>
            <div className="mt-4">
              <Badge variant="outline" className="gap-1">
                Booking ID: {bookingData.bookingId}
              </Badge>
            </div>
          </div>

          {/* Booking Details */}
          <Card className="p-4">
            <h2 className="font-medium mb-4">{isProgram ? 'Program' : 'Homestay'} Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {isProgram ? (
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Plane className="w-6 h-6 text-blue-600" />
                  </div>
                ) : (
                  <Avatar className="w-12 h-12">
                    <img src={item.hostImage} alt={item.hostName} className="w-full h-full object-cover rounded-full" />
                  </Avatar>
                )}
                
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {isProgram ? item.institution : `Host: ${item.hostName}`}
                  </div>
                </div>
                
                <Badge variant="secondary">
                  {bookingData.status.charAt(0).toUpperCase() + bookingData.status.slice(1)}
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.city}, {item.country}</div>
                  <div className="text-sm text-muted-foreground">Destination</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{bookingData.bookingDetails.startDate}</div>
                  <div className="text-sm text-muted-foreground">
                    {bookingData.bookingDetails.duration} weeks duration
                  </div>
                </div>
              </div>

              {isProgram && bookingData.bookingDetails.accommodationType && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <Home className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium capitalize">{bookingData.bookingDetails.accommodationType}</div>
                    <div className="text-sm text-muted-foreground">Accommodation</div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="p-4">
            <h2 className="font-medium mb-4">Personal Information</h2>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium">Name</div>
                <div className="text-muted-foreground">
                  {bookingData.personalInfo.firstName} {bookingData.personalInfo.lastName}
                </div>
              </div>
              
              <div>
                <div className="font-medium">Email</div>
                <div className="text-muted-foreground">{bookingData.personalInfo.email}</div>
              </div>
              
              <div>
                <div className="font-medium">Phone</div>
                <div className="text-muted-foreground">{bookingData.personalInfo.phone}</div>
              </div>
              
              <div>
                <div className="font-medium">Nationality</div>
                <div className="text-muted-foreground">{bookingData.personalInfo.nationality}</div>
              </div>
            </div>
          </Card>

          {/* Payment Information */}
          <Card className="p-4">
            <h2 className="font-medium mb-4">Payment Summary</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{isProgram ? 'Program Fee' : 'Homestay Fee'}</span>
                <span>${bookingData.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Payment Method</span>
                <span>{bookingData.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Status</span>
                <Badge variant="outline" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Paid
                </Badge>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total Paid</span>
                <span>${bookingData.total.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4">
            <h2 className="font-medium mb-4">Quick Actions</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={downloadConfirmation}
                className="gap-2 h-auto py-3 flex-col"
              >
                <Download className="w-5 h-5" />
                <span className="text-xs">Download PDF</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={copyBookingDetails}
                className="gap-2 h-auto py-3 flex-col"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                <span className="text-xs">{copied ? 'Copied!' : 'Copy Details'}</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={shareBooking}
                className="gap-2 h-auto py-3 flex-col"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-xs">Share</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/chat')}
                className="gap-2 h-auto py-3 flex-col"
              >
                <Mail className="w-5 h-5" />
                <span className="text-xs">Contact Support</span>
              </Button>
            </div>
          </Card>

          {/* What's Next */}
          <Card className="p-4">
            <h2 className="font-medium mb-4">What's Next?</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                  1
                </div>
                <div>
                  <div className="font-medium">Confirmation Email</div>
                  <div className="text-muted-foreground">You'll receive a detailed confirmation email within 24 hours</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                  2
                </div>
                <div>
                  <div className="font-medium">Document Preparation</div>
                  <div className="text-muted-foreground">Prepare your travel documents and any required paperwork</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                  3
                </div>
                <div>
                  <div className="font-medium">Pre-Departure Information</div>
                  <div className="text-muted-foreground">We'll send you detailed arrival instructions and local information</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                  4
                </div>
                <div>
                  <div className="font-medium">Start Your Adventure</div>
                  <div className="text-muted-foreground">Arrive at your destination and begin your study abroad experience!</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Important Information */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-blue-900 mb-1">Important Reminders</div>
                <ul className="text-blue-700 space-y-1">
                  <li>• Ensure your passport is valid for at least 6 months from your departure date</li>
                  <li>• Check visa requirements for your destination country</li>
                  <li>• Consider purchasing travel insurance</li>
                  <li>• Review cancellation policy: Free cancellation up to 30 days before departure</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-4">
            <h2 className="font-medium mb-4">Need Help?</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Emergency Support</div>
                  <div className="text-muted-foreground">+1 (555) 123-4567 (24/7)</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Email Support</div>
                  <div className="text-muted-foreground">support@studyabroad.com</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Student Portal</div>
                  <div className="text-muted-foreground">Access pre-departure resources and guides</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t bg-card space-y-2">
        <Button
          className="w-full gap-2"
          onClick={() => navigate('/study-abroad')}
        >
          <Calendar className="w-4 h-4" />
          Browse More Programs
        </Button>
        
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => navigate('/')}
        >
          Return to Home
        </Button>
      </div>
    </div>
  )
}