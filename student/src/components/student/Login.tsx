import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { toast } from 'sonner'

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    
    // Simulate login process
    setTimeout(() => {
      localStorage.setItem('demo_authenticated', 'true')
      localStorage.setItem('demo_email_verified', 'true')
      toast.success('Welcome back!')
      navigate('/', { replace: true })
    }, 1500)
  }

  const handleOAuthLogin = (provider: string) => {
    toast.info(`${provider} login would redirect to OAuth flow`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/splash')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 py-8 max-w-md mx-auto">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1>Welcome back</h1>
            <p className="text-muted-foreground">Sign in to continue your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Log in'}
            </Button>

            <div className="text-center">
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full gap-2"
              onClick={() => handleOAuthLogin('Google')}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full gap-2"
              onClick={() => handleOAuthLogin('Apple')}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C8.396 0 8.025.044 8.025.044c0 0 0 2.104 1.604 3.128 1.604 1.024 3.584.512 3.584.512s2.112-.512 3.584.512c1.472 1.024 1.604 3.128 1.604 3.128s-.371-.044-3.996-.044z"/>
                <path d="M15.104 3.456c-.544-.512-1.28-.768-2.208-.768s-1.664.256-2.208.768c-.544.512-.816 1.152-.816 1.92 0 .768.272 1.408.816 1.92.544.512 1.28.768 2.208.768s1.664-.256 2.208-.768c.544-.512.816-1.152.816-1.92 0-.768-.272-1.408-.816-1.92z"/>
              </svg>
              Continue with Apple
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Create account
            </Link>
          </div>

          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>By continuing, you agree to our</p>
            <div className="flex justify-center gap-4">
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}