import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Lock, CheckCircle, PaypalIcon as Paypal, Gift, MapPin, User, Mail, Phone } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Checkbox } from '../ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface CheckoutData {
  items: Array<{
    id: string
    title: string
    teacher: string
    price: number
    thumbnail: string
    quantity: number
  }>
  subtotal: number
  promoCode?: string
  promoDiscount: number
  total: number
}

export default function Checkout() {
  const navigate = useNavigate()
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    // Billing Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Billing Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Payment Info
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    
    // Preferences
    savePaymentMethod: false,
    emailUpdates: true,
    createAccount: false
  })

  useEffect(() => {
    // Load checkout data from localStorage
    const savedCheckoutData = localStorage.getItem('demo_checkout_data')
    if (savedCheckoutData) {
      setCheckoutData(JSON.parse(savedCheckoutData))
    } else {
      // No checkout data, redirect to cart
      navigate('/market/cart')
    }
  }, [navigate])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email']
    if (paymentMethod === 'card') {
      required.push('cardNumber', 'expiryDate', 'cvv', 'cardholderName')
    }
    
    return required.every(field => formData[field as keyof typeof formData])
  }

  const processPayment = async () => {
    if (!validateForm()) {
      alert('Please fill in all required fields')
      return
    }

    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      // Clear cart and checkout data
      localStorage.removeItem('demo_cart')
      localStorage.removeItem('demo_checkout_data')
      
      // Save order data for confirmation
      const orderData = {
        orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        items: checkoutData?.items || [],
        total: checkoutData?.total || 0,
        paymentMethod,
        purchaseDate: new Date().toISOString(),
        customerEmail: formData.email
      }
      localStorage.setItem('demo_order_data', JSON.stringify(orderData))
      
      setIsProcessing(false)
      navigate('/market/confirmation')
    }, 3000)
  }

  if (!checkoutData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2>Loading checkout...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1>Checkout</h1>
          <div className="ml-auto flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">Secure</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Order Summary */}
          <Card className="p-4">
            <h3 className="mb-3">Order Summary</h3>
            <div className="space-y-3">
              {checkoutData.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-9 rounded overflow-hidden shrink-0">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground">by {item.teacher}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">${item.price}</p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    )}
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${checkoutData.subtotal.toFixed(2)}</span>
                </div>
                {checkoutData.promoDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({checkoutData.promoCode})</span>
                    <span>-${checkoutData.promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${checkoutData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-4">
            <h3 className="mb-4">Contact Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="mt-3">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="mt-3">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </Card>

          {/* Billing Address */}
          <Card className="p-4">
            <h3 className="mb-4">Billing Address</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="NY"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="10001"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="es">Spain</SelectItem>
                      <SelectItem value="jp">Japan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-4">
            <h3 className="mb-4">Payment Method</h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Credit/Debit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  PayPal
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === 'card' && (
              <div className="mt-4 space-y-3">
                <div>
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardholderName">Cardholder Name *</Label>
                  <Input
                    id="cardholderName"
                    value={formData.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  You will be redirected to PayPal to complete your payment securely.
                </p>
              </div>
            )}
          </Card>

          {/* Additional Options */}
          <Card className="p-4">
            <h3 className="mb-4">Additional Options</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="savePayment"
                  checked={formData.savePaymentMethod}
                  onCheckedChange={(checked) => handleInputChange('savePaymentMethod', checked as boolean)}
                />
                <Label htmlFor="savePayment" className="text-sm">
                  Save payment method for future purchases
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="emailUpdates"
                  checked={formData.emailUpdates}
                  onCheckedChange={(checked) => handleInputChange('emailUpdates', checked as boolean)}
                />
                <Label htmlFor="emailUpdates" className="text-sm">
                  Send me course updates and learning tips
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="createAccount"
                  checked={formData.createAccount}
                  onCheckedChange={(checked) => handleInputChange('createAccount', checked as boolean)}
                />
                <Label htmlFor="createAccount" className="text-sm">
                  Create an account for easier future purchases
                </Label>
              </div>
            </div>
          </Card>

          {/* Terms and Privacy */}
          <div className="text-xs text-muted-foreground">
            <p>
              By completing your purchase, you agree to our{' '}
              <a href="#" className="text-primary underline">Terms of Service</a> and{' '}
              <a href="#" className="text-primary underline">Privacy Policy</a>.
              You also agree to our{' '}
              <a href="#" className="text-primary underline">Refund Policy</a>.
            </p>
          </div>
        </div>
      </ScrollArea>

      {/* Footer - Payment Button */}
      <div className="p-4 border-t bg-card">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total: ${checkoutData.total.toFixed(2)}</span>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Lock className="w-3 h-3" />
              <span>Secure Payment</span>
            </div>
          </div>
          <Button 
            onClick={processPayment} 
            disabled={isProcessing || !validateForm()}
            className="w-full gap-2"
            size="lg"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {paymentMethod === 'card' ? <CreditCard className="w-4 h-4" /> : <div className="w-4 h-4 bg-white rounded"></div>}
                Complete Payment
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}