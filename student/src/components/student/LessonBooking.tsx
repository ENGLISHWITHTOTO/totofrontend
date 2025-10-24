import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, User, CreditCard, Video, Shield, Star, CheckCircle2, Apple, Smartphone } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Checkbox } from '../ui/checkbox'
import { ScrollArea } from '../ui/scroll-area'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Separator } from '../ui/separator'
import { toast } from 'sonner'

interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'apple' | 'google'
  label: string
  details?: string
  isDefault?: boolean
  icon: React.ReactNode
}

export default function LessonBooking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { packageType, teacher, selectedDate, selectedTime, timezone } = location.state || {}

  const [lessonType, setLessonType] = useState('conversation')
  const [lessonGoal, setLessonGoal] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card1')
  const [isProcessing, setIsProcessing] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  // Mock payment methods with modern icons
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card1',
      type: 'card',
      label: 'Credit Card',
      details: 'Visa •••• 4242',
      isDefault: true,
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: 'apple',
      type: 'apple',
      label: 'Apple Pay',
      details: 'Touch or Face ID',
      icon: <Apple className="w-5 h-5" />
    },
    {
      id: 'google',
      type: 'google',
      label: 'Google Pay',
      details: 'Quick & secure',
      icon: <Smartphone className="w-5 h-5" />
    }
  ]

  const lessonTypes = [
    { id: 'conversation', label: 'Conversation Practice', description: 'Focus on speaking fluency and natural communication', popular: true },
    { id: 'grammar', label: 'Grammar Lesson', description: 'Structured grammar rules and practical exercises', popular: false },
    { id: 'pronunciation', label: 'Pronunciation Training', description: 'Improve accent, intonation, and speech clarity', popular: false },
    { id: 'business', label: 'Business Communication', description: 'Professional language for workplace success', popular: true },
    { id: 'exam', label: 'Test Preparation', description: 'IELTS, TOEFL, and other certification prep', popular: false },
    { id: 'custom', label: 'Custom Focus', description: 'Tell your teacher what you\'d like to work on', popular: false }
  ]

  const getPackageInfo = () => {
    if (!teacher?.lessonPackages || !packageType) return null
    
    const packages = teacher.lessonPackages as any
    return packages[packageType]
  }

  const packageInfo = getPackageInfo()

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getPackageTitle = () => {
    switch (packageType) {
      case 'trial': return 'Trial Lesson'
      case 'single': return 'Individual Lesson'
      case 'package5': return '5-Lesson Package'
      case 'package10': return '10-Lesson Package'
      default: return 'Lesson'
    }
  }

  const handleBooking = async () => {
    if (!agreeToTerms) {
      toast.error('Please agree to the terms and conditions')
      return
    }

    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock successful booking
      const bookingData = {
        bookingId: `BK${Date.now()}`,
        teacherId: teacher.id,
        teacherName: teacher.name,
        packageType,
        lessonType,
        date: selectedDate,
        time: selectedTime,
        timezone,
        price: packageInfo?.price,
        duration: packageInfo?.duration,
        paymentMethod: paymentMethods.find(pm => pm.id === paymentMethod)?.label,
        specialRequests
      }

      // Navigate to confirmation
      navigate(`/teachers/${id}/book/success`, {
        state: { bookingData }
      })

      toast.success('Lesson booked successfully!')

    } catch (error) {
      toast.error('Failed to book lesson. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!teacher || !packageInfo) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Missing booking information. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold">Confirm Booking</h1>
            <p className="text-sm text-muted-foreground">
              Review and complete your lesson booking
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Booking Summary */}
          <Card className="border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-950/10 dark:to-indigo-950/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <CheckCircle2 className="w-5 h-5" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-14 h-14 ring-2 ring-blue-200 dark:ring-blue-800">
                  <AvatarImage src={teacher.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                    {teacher.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{teacher.name}</h3>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-0 text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      {teacher.rating}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{teacher.location}</p>
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                    {getPackageTitle()}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-600">${packageInfo.price}</div>
                  <div className="text-sm text-muted-foreground">{packageInfo.duration} minutes</div>
                </div>
              </div>

              <Separator className="my-4 bg-blue-200/50 dark:bg-blue-800/50" />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Date & Time</span>
                  </div>
                  <div className="font-medium">{formatDate(selectedDate)}</div>
                  <div className="text-muted-foreground">{selectedTime} ({timezone})</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Video className="w-4 h-4" />
                    <span>Meeting Type</span>
                  </div>
                  <div className="font-medium">Video Call</div>
                  <div className="text-muted-foreground">Zoom link will be sent</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lesson Focus */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">What would you like to focus on?</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={lessonType} onValueChange={setLessonType} className="space-y-3">
                {lessonTypes.map((type) => (
                  <div key={type.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Label htmlFor={type.id} className="font-medium cursor-pointer">
                          {type.label}
                        </Label>
                        {type.popular && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-0 text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              <div className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="goal" className="font-medium mb-2 block">
                    Specific Learning Goal (Optional)
                  </Label>
                  <Input
                    id="goal"
                    placeholder="e.g., Practice job interview questions, Learn travel vocabulary..."
                    value={lessonGoal}
                    onChange={(e) => setLessonGoal(e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div>
                  <Label htmlFor="requests" className="font-medium mb-2 block">
                    Message for Your Teacher (Optional)
                  </Label>
                  <Textarea
                    id="requests"
                    placeholder="Share your current level, interests, or anything else that would help your teacher prepare..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={3}
                    className="bg-background"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-3 p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={method.id} className="font-medium cursor-pointer">
                          {method.label}
                        </Label>
                        {method.details && (
                          <p className="text-sm text-muted-foreground">{method.details}</p>
                        )}
                      </div>
                      {method.isDefault && (
                        <Badge variant="outline" className="text-xs">Default</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </RadioGroup>

              <Button variant="outline" className="w-full mt-4 border-dashed">
                + Add New Payment Method
              </Button>
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Price Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Lesson ({packageInfo.duration} min)</span>
                  <span className="font-medium">${packageInfo.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Platform fee</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Booking protection</span>
                  <span className="font-medium text-green-600">Included</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-blue-600">${packageInfo.price}</span>
                </div>

                {packageType !== 'trial' && packageType !== 'single' && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      You're saving money with this package deal!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Terms and Policies */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="text-sm">
                    <Label htmlFor="terms" className="cursor-pointer font-medium">
                      I agree to the{' '}
                      <a href="#" className="text-primary underline hover:no-underline">Terms of Service</a>{' '}
                      and{' '}
                      <a href="#" className="text-primary underline hover:no-underline">Cancellation Policy</a>
                    </Label>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1 pl-6">
                  <p>• Free cancellation up to 24 hours before your lesson</p>
                  <p>• Reschedule anytime with 4+ hours notice</p>
                  <p>• 100% refund if teacher cancels</p>
                  <p>• Technical support available during lessons</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Bottom Action */}
      <div className="p-4 border-t border-border/50 bg-card/80 backdrop-blur-sm">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 h-12"
          onClick={handleBooking}
          disabled={isProcessing || !agreeToTerms}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <Video className="w-4 h-4" />
              Confirm Booking • ${packageInfo.price}
            </>
          )}
        </Button>
        
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
          <Shield className="w-3 h-3" />
          <span>Secure payment • Protected by encryption</span>
        </div>
      </div>
    </div>
  )
}