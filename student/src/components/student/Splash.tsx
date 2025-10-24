import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    // Check for existing session
    const isAuthenticated = localStorage.getItem('demo_authenticated') === 'true'
    const isEmailVerified = localStorage.getItem('demo_email_verified') === 'true'
    
    const timer = setTimeout(() => {
      if (isAuthenticated && isEmailVerified) {
        navigate('/', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex flex-col items-center justify-center text-primary-foreground">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
          <GraduationCap className="h-12 w-12" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">LearnHub</h1>
          <p className="text-lg opacity-90">Master languages with AI</p>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="flex gap-2 mb-4">
        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
      </div>

      {/* Status */}
      <p className="text-sm opacity-75">Starting your learning journey...</p>
    </div>
  )
}