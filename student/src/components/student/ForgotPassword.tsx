import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { toast } from 'sonner'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [canResend, setCanResend] = useState(true)
  const [countdown, setCountdown] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    
    // Simulate sending reset email
    setTimeout(() => {
      setIsLoading(false)
      setIsEmailSent(true)
      setCanResend(false)
      setCountdown(30)
      
      // Start countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      toast.success('Reset link sent! Check your email.')
    }, 1500)
  }

  const handleResend = () => {
    if (!canResend) return
    
    setCanResend(false)
    setCountdown(30)
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    toast.success('Reset link sent again!')
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="flex items-center p-4 border-b">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/login')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Button>
        </header>

        {/* Success State */}
        <div className="flex-1 px-6 py-8 max-w-md mx-auto">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1>Check your email</h1>
              <div className="space-y-1 text-muted-foreground">
                <p>We sent a password reset link to:</p>
                <p className="font-medium text-foreground break-all">{email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => window.open('mailto:', '_blank')}
                className="w-full gap-2"
              >
                <Mail className="h-4 w-4" />
                Open email app
              </Button>

              <Button
                variant="outline"
                onClick={handleResend}
                disabled={!canResend}
                className="w-full"
              >
                {canResend ? 'Resend link' : `Resend in ${countdown}s`}
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setIsEmailSent(false)
                  setEmail('')
                }}
                className="w-full"
              >
                Change email address
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>Didn't receive the email? Check your spam folder.</p>
              <p>
                Still having trouble?{' '}
                <a href="#" className="text-primary hover:underline">
                  Contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/login')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 py-8 max-w-md mx-auto">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1>Reset your password</h1>
            <p className="text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending reset link...' : 'Send reset link'}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}