import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Download, Calendar, Play, Star, Mail, Share2, Gift, ArrowRight, Home } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'

interface OrderData {
  orderId: string
  items: Array<{
    id: string
    title: string
    teacher: string
    price: number
    thumbnail: string
    quantity: number
  }>
  total: number
  paymentMethod: string
  purchaseDate: string
  customerEmail: string
}

export default function PurchaseConfirmation() {
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    // Load order data from localStorage
    const savedOrderData = localStorage.getItem('demo_order_data')
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData))
      // Simulate sending confirmation email
      setTimeout(() => setEmailSent(true), 2000)
    } else {
      // No order data, redirect to home
      navigate('/')
    }
  }, [navigate])

  const downloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    alert('Receipt download started!')
  }

  const shareSuccess = () => {
    // In a real app, this would open a share dialog
    alert('Share your learning journey with friends!')
  }

  const startLearning = (lessonId: string) => {
    // Navigate to the purchased lesson
    navigate(`/lesson/${lessonId}`)
  }

  const continueShopping = () => {
    navigate('/market')
  }

  const goHome = () => {
    navigate('/')
  }

  if (!orderData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2>Loading order details...</h2>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-green-600 mb-1">Payment Successful!</h1>
          <p className="text-sm text-muted-foreground">
            Your language learning journey begins now
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Order Details */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3>Order Details</h3>
              <Button variant="outline" size="sm" onClick={downloadReceipt} className="gap-2">
                <Download className="w-4 h-4" />
                Receipt
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Order ID</p>
                  <p className="font-medium">{orderData.orderId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(orderData.purchaseDate)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Method</p>
                  <p className="font-medium capitalize">{orderData.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Paid</p>
                  <p className="font-medium">${orderData.total.toFixed(2)}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-muted-foreground text-sm mb-2">Email Confirmation</p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{orderData.customerEmail}</span>
                  {emailSent ? (
                    <Badge variant="secondary" className="text-xs">Sent</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Sending...</Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Purchased Courses */}
          <Card className="p-4">
            <h3 className="mb-4">Your New Courses</h3>
            <div className="space-y-4">
              {orderData.items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium mb-1 line-clamp-2">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">by {item.teacher}</p>
                      
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">
                          Lifetime Access
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">4.8</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium mb-2">${item.price}</p>
                      <Button size="sm" onClick={() => startLearning(item.id)} className="gap-2">
                        <Play className="w-3 h-3" />
                        Start
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-4">
            <h3 className="mb-4">What's Next?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-primary">1</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Access Your Courses</h4>
                  <p className="text-sm text-muted-foreground">
                    Your courses are now available in your library. Start learning anytime, anywhere.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-primary">2</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Set Your Learning Schedule</h4>
                  <p className="text-sm text-muted-foreground">
                    Create a consistent study routine to maximize your learning progress.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-primary">3</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Join the Community</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect with other learners and practice your new language skills.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Special Offers */}
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Gift className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1 text-blue-900">Special Offer for You!</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Get 25% off your next course purchase. Offer valid for 7 days.
                </p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600 text-white">WELCOME25</Badge>
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                    Browse Courses
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Share Success */}
          <Card className="p-4">
            <h3 className="mb-3">Share Your Achievement</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Let your friends know about your new language learning journey!
            </p>
            <Button variant="outline" onClick={shareSuccess} className="w-full gap-2">
              <Share2 className="w-4 h-4" />
              Share Your Success
            </Button>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={continueShopping} variant="outline" className="gap-2">
              <ArrowRight className="w-4 h-4" />
              More Courses
            </Button>
            <Button onClick={goHome} className="gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </div>

          {/* Thank You Message */}
          <div className="text-center p-6 bg-accent rounded-lg">
            <h3 className="mb-2">Thank You for Choosing Us!</h3>
            <p className="text-sm text-muted-foreground">
              We're excited to be part of your language learning journey. 
              If you need any help, our support team is always here for you.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}