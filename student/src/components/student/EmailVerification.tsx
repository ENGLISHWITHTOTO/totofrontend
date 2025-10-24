import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, CheckCircle, RefreshCw } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { toast } from 'sonner'

export default function EmailVerification() {
  const navigate = useNavigate()
  const [email] = useState('alex@example.com') // In real app, get from auth context
  const [canResend, setCanResend] = useState(true)
  const [countdown, setCountdown] = useState(0)
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    // Check if already verified
    if (localStorage.getItem('demo_email_verified') === 'true') {
      navigate('/', { replace: true })
    }
  }, [navigate])

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
    
    toast.success('Verification email sent!')
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!verificationCode) {
      toast.error('Please enter the verification code')
      return
    }

    setIsVerifying(true)
    
    // Simulate verification
    setTimeout(() => {
      if (verificationCode === '123456' || verificationCode.length >= 6) {
        localStorage.setItem('demo_email_verified', 'true')
        toast.success('Email verified successfully!')
        navigate('/', { replace: true })
      } else {
        toast.error('Invalid verification code')
        setIsVerifying(false)
      }
    }, 1500)
  }

  const handleChangeEmail = () => {
    // In real app, this would allow changing email
    toast.info('Change email functionality would be implemented here')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Content */}
      <div className="flex-1 px-6 py-8 max-w-md mx-auto min-h-screen flex flex-col justify-center">
        <div className="space-y-6">
          {/* Illustration */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Mail className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1>Verify your email</h1>
              <div className="space-y-1 text-muted-foreground">
                <p>We sent a verification code to:</p>
                <p className="font-medium text-foreground break-all">{email}</p>
              </div>
            </div>
          </div>

          {/* Code Input */}
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground text-center">
                For demo: use any 6-digit code or "123456"
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify email'
              )}
            </Button>
          </form>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              onClick={() => window.open('mailto:', '_blank')}
              variant="outline"
              className="w-full gap-2"
            >
              <Mail className="h-4 w-4" />
              Open email app
            </Button>

            <Button
              variant="ghost"
              onClick={handleResend}
              disabled={!canResend}
              className="w-full"
            >
              {canResend ? 'Resend code' : `Resend in ${countdown}s`}
            </Button>

            <Button
              variant="ghost"
              onClick={handleChangeEmail}
              className="w-full"
            >
              Change email address
            </Button>
          </div>

          {/* Help */}
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Didn't receive the code? Check your spam folder.</p>
            <p>
              Still having trouble?{' '}
              <a href="#" className="text-primary hover:underline">
                Contact support
              </a>
            </p>
          </div>

          {/* Skip for demo */}
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                localStorage.setItem('demo_email_verified', 'true')
                navigate('/', { replace: true })
              }}
              className="w-full"
            >
              Skip verification (Demo only)
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}