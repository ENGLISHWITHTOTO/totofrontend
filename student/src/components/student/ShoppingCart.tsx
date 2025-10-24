import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart, Tag, Clock, Play } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'

interface CartItem {
  id: string
  title: string
  teacher: string
  price: number
  originalPrice?: number
  thumbnail: string
  duration: string
  lessonsCount: number
  quantity?: number
}

export default function ShoppingCart() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromoCode, setAppliedPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('demo_cart') || '[]')
    setCartItems(savedCart)
  }, [])

  const updateCart = (newCartItems: CartItem[]) => {
    setCartItems(newCartItems)
    localStorage.setItem('demo_cart', JSON.stringify(newCartItems))
  }

  const removeItem = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId)
    updateCart(updatedCart)
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }
    
    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    )
    updateCart(updatedCart)
  }

  const applyPromoCode = () => {
    // Mock promo codes
    const promoCodes: Record<string, number> = {
      'SAVE20': 0.20,
      'NEWUSER': 0.15,
      'STUDENT10': 0.10
    }

    const discount = promoCodes[promoCode.toUpperCase()]
    if (discount) {
      setAppliedPromoCode(promoCode.toUpperCase())
      setPromoDiscount(discount)
      setPromoCode('')
    } else {
      // Show error - invalid promo code
      alert('Invalid promo code')
    }
  }

  const removePromoCode = () => {
    setAppliedPromoCode('')
    setPromoDiscount(0)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
  const originalSubtotal = cartItems.reduce((sum, item) => {
    const price = item.originalPrice || item.price
    return sum + (price * (item.quantity || 1))
  }, 0)
  const courseDiscount = originalSubtotal - subtotal
  const promoDiscountAmount = subtotal * promoDiscount
  const total = subtotal - promoDiscountAmount

  const proceedToCheckout = () => {
    if (cartItems.length === 0) return
    
    // Save cart state for checkout
    const checkoutData = {
      items: cartItems,
      subtotal,
      promoCode: appliedPromoCode,
      promoDiscount: promoDiscountAmount,
      total
    }
    localStorage.setItem('demo_checkout_data', JSON.stringify(checkoutData))
    navigate('/market/checkout')
  }

  const continueShopping = () => {
    navigate('/market')
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <div className="p-4 border-b bg-card">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1>Shopping Cart</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground">Add some lessons to get started with your language learning journey!</p>
            </div>
            <Button onClick={continueShopping} className="gap-2">
              Browse Lessons
            </Button>
          </div>
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
          <h1>Shopping Cart</h1>
          <Badge variant="secondary" className="ml-auto">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </Badge>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Cart Items */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">by {item.teacher}</p>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        {item.lessonsCount} lessons
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${item.originalPrice}
                          </span>
                        )}
                        <span className="font-medium">${item.price}</span>
                        {item.originalPrice && (
                          <Badge variant="destructive" className="text-xs">
                            {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                          </Badge>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity || 1}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {/* Cart Summary */}
        <div className="border-t bg-card">
          <div className="p-4 space-y-4">
            {/* Promo Code */}
            <div className="space-y-3">
              <h3 className="font-medium">Promo Code</h3>
              {appliedPromoCode ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">{appliedPromoCode}</span>
                    <span className="text-sm text-green-600">-{(promoDiscount * 100)}%</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removePromoCode} className="text-green-600 hover:text-green-700">
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={applyPromoCode} disabled={!promoCode.trim()}>
                    Apply
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Try: SAVE20, NEWUSER, or STUDENT10
              </p>
            </div>

            <Separator />

            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {courseDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Course discount</span>
                  <span>-${courseDiscount.toFixed(2)}</span>
                </div>
              )}
              
              {promoDiscountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Promo discount ({appliedPromoCode})</span>
                  <span>-${promoDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={continueShopping}>
                Continue Shopping
              </Button>
              <Button onClick={proceedToCheckout} className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}