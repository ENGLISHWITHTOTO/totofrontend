import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Calendar, Users, CreditCard, Plane, Home, Check, AlertTriangle } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Checkbox } from '../ui/checkbox'
import { ScrollArea } from '../ui/scroll-area'
import { Badge } from '../ui/badge'
import { Avatar } from '../ui/avatar'
import { Separator } from '../ui/separator'
import { toast } from 'sonner'

interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'bank'
  label: string
  details?: string
  isDefault?: boolean
}

export default function StudyAbroadBooking() {
  const { id, type } = useParams() // type: 'programs' or 'homestays'
  const navigate = useNavigate()
  const location = useLocation()
  const { program, homestay, selectedStartDate } = location.state || {}

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    emergencyContact: '',
    emergencyPhone: ''
  })

  const [bookingDetails, setBookingDetails] = useState({
    startDate: selectedStartDate || '',
    duration: type === 'programs' ? '4' : '2',
    accommodationType: type === 'programs' ? 'homestay' : '',
    dietaryRequirements: '',
    medicalInfo: '',
    specialRequests: '',
    previousExperience: '',
    learningGoals: ''
  })

  const [paymentMethod, setPaymentMethod] = useState('card1')
  const [agreeToPolicies, setAgreeToPolicies] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card1',
      type: 'card',
      label: 'Visa ending in 4242',
      details: 'Expires 12/25',
      isDefault: true
    },
    {
      id: 'paypal',
      type: 'paypal',
      label: 'PayPal',
      details: 'student@email.com'
    },
    {
      id: 'bank',
      type: 'bank',
      label: 'Bank Transfer',
      details: 'Direct bank transfer'
    }
  ]

  const durationOptions = type === 'programs' 
    ? [
        { value: '2', label: '2 weeks', multiplier: 0.5 },
        { value: '4', label: '4 weeks', multiplier: 1 },
        { value: '8', label: '8 weeks', multiplier: 2 },
        { value: '12', label: '12 weeks', multiplier: 3 }
      ]
    : [
        { value: '1', label: '1 week', multiplier: 1 },
        { value: '2', label: '2 weeks', multiplier: 2 },
        { value: '4', label: '4 weeks', multiplier: 4 },
        { value: '8', label: '8 weeks', multiplier: 8 },
        { value: '12', label: '12 weeks', multiplier: 12 }
      ]

  const accommodationOptions = program ? [
    { id: 'homestay', label: 'Homestay Family', price: 180, description: 'Stay with local family' },
    { id: 'residence', label: 'Student Residence', price: 220, description: 'Shared student accommodation' },
    { id: 'apartment', label: 'Shared Apartment', price: 280, description: 'Independent living' },
    { id: 'hotel', label: 'Hotel', price: 450, description: 'Private hotel room' }
  ] : []

  const calculateTotal = () => {
    const item = program || homestay
    if (!item) return 0

    const duration = durationOptions.find(d => d.value === bookingDetails.duration)
    const multiplier = duration?.multiplier || 1

    if (type === 'programs') {
      const basePrice = program.price * multiplier
      const accommodation = accommodationOptions.find(a => a.id === bookingDetails.accommodationType)
      const accommodationPrice = accommodation ? (accommodation.price * parseInt(bookingDetails.duration)) : 0
      return basePrice + accommodationPrice
    } else {
      return homestay.pricePerWeek * multiplier
    }
  }

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleBookingDetailsChange = (field: string, value: string) => {
    setBookingDetails(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const requiredPersonal = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'nationality']
    const missingPersonal = requiredPersonal.filter(field => !personalInfo[field as keyof typeof personalInfo])
    
    if (missingPersonal.length > 0) {
      toast.error('Please fill in all required personal information')
      return false
    }

    if (!bookingDetails.startDate) {
      toast.error('Please select a start date')
      return false
    }

    if (type === 'programs' && !bookingDetails.accommodationType) {
      toast.error('Please select accommodation type')
      return false
    }

    if (!agreeToPolicies || !agreeToTerms) {
      toast.error('Please agree to all terms and policies')
      return false
    }

    return true
  }

  const handleBooking = async () => {
    if (!validateForm()) return

    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const bookingData = {
        bookingId: `SA${Date.now()}`,
        type,
        item: program || homestay,
        personalInfo,
        bookingDetails,
        total: calculateTotal(),
        paymentMethod: paymentMethods.find(pm => pm.id === paymentMethod)?.label,
        status: 'confirmed'
      }

      navigate(`/study-abroad/${type}/${id}/success`, {
        state: { bookingData }
      })

      toast.success('Booking confirmed successfully!')

    } catch (error) {
      toast.error('Failed to process booking. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const item = program || homestay
  if (!item) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Missing booking information. Please try again.</p>
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
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1>Complete Your Booking</h1>
            <p className="text-sm text-muted-foreground">
              {type === 'programs' ? 'Study Abroad Program' : 'Homestay'} Reservation
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Booking Summary */}
          <Card className="p-4">
            <h2 className="font-medium mb-4">Booking Summary</h2>
            
            <div className="flex items-start gap-3 mb-4">
              {type === 'programs' ? (
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plane className="w-6 h-6 text-blue-600" />
                </div>
              ) : (
                <Avatar className="w-12 h-12">
                  <img src={homestay.hostImage} alt={homestay.hostName} className="w-full h-full object-cover rounded-full" />
                </Avatar>
              )}
              
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.city}, {item.country}
                </p>
                {type === 'programs' && (
                  <p className="text-sm text-muted-foreground">{program.institution}</p>
                )}
                {type === 'homestays' && (
                  <p className="text-sm text-muted-foreground">Host: {homestay.hostName}</p>
                )}
              </div>
              
              <div className="text-right">
                <Badge variant="secondary">
                  {type === 'programs' ? 'Program' : 'Homestay'}
                </Badge>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Start Date:</span>
                <span>{bookingDetails.startDate || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{durationOptions.find(d => d.value === bookingDetails.duration)?.label}</span>
              </div>
              {type === 'programs' && bookingDetails.accommodationType && (
                <div className="flex justify-between">
                  <span>Accommodation:</span>
                  <span>{accommodationOptions.find(a => a.id === bookingDetails.accommodationType)?.label}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="p-4">
            <h2 className="font-medium mb-4">Personal Information</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={personalInfo.firstName}
                  onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                  placeholder="John"
                />
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={personalInfo.lastName}
                  onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                  placeholder="Doe"
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  placeholder="john.doe@email.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={personalInfo.phone}
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>
              
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="nationality">Nationality *</Label>
                <Input
                  id="nationality"
                  value={personalInfo.nationality}
                  onChange={(e) => handlePersonalInfoChange('nationality', e.target.value)}
                  placeholder="American"
                />
              </div>
              
              <div>
                <Label htmlFor="passportNumber">Passport Number</Label>
                <Input
                  id="passportNumber"
                  value={personalInfo.passportNumber}
                  onChange={(e) => handlePersonalInfoChange('passportNumber', e.target.value)}
                  placeholder="A12345678"
                />
              </div>
            </div>

            <Separator className="my-4" />

            <h3 className="font-medium mb-3">Emergency Contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyContact">Contact Name</Label>
                <Input
                  id="emergencyContact"
                  value={personalInfo.emergencyContact}
                  onChange={(e) => handlePersonalInfoChange('emergencyContact', e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
              
              <div>
                <Label htmlFor="emergencyPhone">Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  value={personalInfo.emergencyPhone}
                  onChange={(e) => handlePersonalInfoChange('emergencyPhone', e.target.value)}
                  placeholder="+1 234 567 8901"
                />
              </div>
            </div>
          </Card>

          {/* Booking Details */}
          <Card className="p-4">
            <h2 className="font-medium mb-4">Booking Details</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={bookingDetails.startDate}
                  onChange={(e) => handleBookingDetailsChange('startDate', e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Duration *</Label>
                <RadioGroup value={bookingDetails.duration} onValueChange={(value) => handleBookingDetailsChange('duration', value)}>
                  <div className="grid grid-cols-2 gap-3">
                    {durationOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 border rounded-lg p-3">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">
                            ${Math.round(calculateTotal() / (parseInt(bookingDetails.duration) || 1) * option.multiplier).toLocaleString()}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {type === 'programs' && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Accommodation Type *</Label>
                  <RadioGroup value={bookingDetails.accommodationType} onValueChange={(value) => handleBookingDetailsChange('accommodationType', value)}>
                    <div className="space-y-3">
                      {accommodationOptions.map((option) => (
                        <div key={option.id} className="flex items-start space-x-2 border rounded-lg p-3">
                          <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={option.id} className="cursor-pointer">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">{option.label}</span>
                                <span className="text-sm">${option.price}/week</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{option.description}</p>
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}

              <div>
                <Label htmlFor="dietaryRequirements">Dietary Requirements</Label>
                <Input
                  id="dietaryRequirements"
                  value={bookingDetails.dietaryRequirements}
                  onChange={(e) => handleBookingDetailsChange('dietaryRequirements', e.target.value)}
                  placeholder="Vegetarian, allergies, etc."
                />
              </div>

              <div>
                <Label htmlFor="medicalInfo">Medical Information</Label>
                <Textarea
                  id="medicalInfo"
                  value={bookingDetails.medicalInfo}
                  onChange={(e) => handleBookingDetailsChange('medicalInfo', e.target.value)}
                  placeholder="Any medical conditions or medications..."
                  rows={2}
                />
              </div>

              {type === 'programs' && (
                <>
                  <div>
                    <Label htmlFor="previousExperience">Previous Language Learning Experience</Label>
                    <Textarea
                      id="previousExperience"
                      value={bookingDetails.previousExperience}
                      onChange={(e) => handleBookingDetailsChange('previousExperience', e.target.value)}
                      placeholder="Describe your previous experience with the language..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="learningGoals">Learning Goals</Label>
                    <Textarea
                      id="learningGoals"
                      value={bookingDetails.learningGoals}
                      onChange={(e) => handleBookingDetailsChange('learningGoals', e.target.value)}
                      placeholder="What do you hope to achieve during this program?"
                      rows={2}
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  value={bookingDetails.specialRequests}
                  onChange={(e) => handleBookingDetailsChange('specialRequests', e.target.value)}
                  placeholder="Any special requests or preferences..."
                  rows={2}
                />
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-4">
            <h2 className="font-medium mb-4">Payment Method</h2>
            
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={method.id} className="font-medium text-sm cursor-pointer">
                          {method.label}
                        </Label>
                        {method.details && (
                          <p className="text-xs text-muted-foreground">{method.details}</p>
                        )}
                      </div>
                      {method.isDefault && (
                        <Badge variant="outline" className="text-xs">Default</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </Card>

          {/* Price Breakdown */}
          <Card className="p-4">
            <h2 className="font-medium mb-4">Price Breakdown</h2>
            
            <div className="space-y-2 text-sm">
              {type === 'programs' ? (
                <>
                  <div className="flex justify-between">
                    <span>Program ({durationOptions.find(d => d.value === bookingDetails.duration)?.label})</span>
                    <span>${(program.price * (durationOptions.find(d => d.value === bookingDetails.duration)?.multiplier || 1)).toLocaleString()}</span>
                  </div>
                  {bookingDetails.accommodationType && (
                    <div className="flex justify-between">
                      <span>Accommodation ({bookingDetails.duration} weeks)</span>
                      <span>${((accommodationOptions.find(a => a.id === bookingDetails.accommodationType)?.price || 0) * parseInt(bookingDetails.duration)).toLocaleString()}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-between">
                  <span>Homestay ({durationOptions.find(d => d.value === bookingDetails.duration)?.label})</span>
                  <span>${(homestay.pricePerWeek * (durationOptions.find(d => d.value === bookingDetails.duration)?.multiplier || 1)).toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between text-muted-foreground">
                <span>Processing Fee</span>
                <span>$0</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Taxes</span>
                <span>Included</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>${calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Terms and Policies */}
          <Card className="p-4">
            <h2 className="font-medium mb-4">Terms & Policies</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="policies"
                  checked={agreeToPolicies}
                  onCheckedChange={(checked) => setAgreeToPolicies(checked as boolean)}
                />
                <div className="text-sm">
                  <Label htmlFor="policies" className="cursor-pointer">
                    I have read and agree to the{' '}
                    <a href="#" className="text-primary underline">Cancellation Policy</a> and{' '}
                    <a href="#" className="text-primary underline">House Rules</a>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Free cancellation up to 30 days before arrival. 50% refund 7-30 days before.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <div className="text-sm">
                  <Label htmlFor="terms" className="cursor-pointer">
                    I agree to the{' '}
                    <a href="#" className="text-primary underline">Terms of Service</a> and{' '}
                    <a href="#" className="text-primary underline">Privacy Policy</a>
                  </Label>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-700">
                  <p className="font-medium mb-1">Important Notice</p>
                  <p>Your booking will be confirmed within 24 hours. You will receive a confirmation email with all details and next steps.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>

      {/* Book Button */}
      <div className="p-4 border-t bg-card">
        <Button
          className="w-full gap-2"
          onClick={handleBooking}
          disabled={isProcessing || !agreeToPolicies || !agreeToTerms}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {type === 'programs' ? <Plane className="w-4 h-4" /> : <Home className="w-4 h-4" />}
              Confirm Booking - ${calculateTotal().toLocaleString()}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}