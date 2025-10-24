import { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { 
  Bot, 
  ArrowLeft,
  Mic,
  Globe,
  MessageSquare
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import AIPractice from './speaking/AIPractice'
import VoiceRooms from './speaking/VoiceRooms'
import RandomCallMatching from './RandomCallMatching'
import RandomCallLive from './RandomCallLive'
import RandomCallComplete from './RandomCallComplete'
import InstantTranslate from './speaking/InstantTranslate'


const speakingFeatures = [
  { 
    id: 'voice-rooms', 
    title: 'Voice Rooms', 
    icon: Mic, 
    path: '/speaking/voice-rooms',
    description: 'Join topic-based group conversations',
    bgClass: 'bg-gradient-to-br from-teal-200 via-orange-200 to-pink-200',
    iconBg: 'bg-teal-600/20',
    iconColor: 'text-teal-700'
  },
  { 
    id: 'random-call', 
    title: 'Random Call', 
    icon: MessageSquare, 
    path: '/speaking/random-call',
    description: 'Get matched with a random partner',
    bgClass: 'bg-gradient-to-br from-pink-200 via-orange-200 to-yellow-200',
    iconBg: 'bg-orange-600/20',
    iconColor: 'text-orange-700'
  },
  { 
    id: 'ai-practice', 
    title: 'Practice with AI', 
    icon: Bot, 
    path: '/speaking/ai-practice',
    description: 'Practice with AI-powered conversation',
    bgClass: 'bg-gradient-to-br from-gray-200 via-blue-200 to-purple-200',
    iconBg: 'bg-blue-600/20',
    iconColor: 'text-blue-700'
  },
  { 
    id: 'instant-translate', 
    title: 'Instant Translation', 
    icon: Globe, 
    path: '/speaking/instant-translate',
    description: 'Real-time translation and pronunciation help',
    bgClass: 'bg-gradient-to-br from-amber-200 via-orange-200 to-red-200',
    iconBg: 'bg-amber-600/20',
    iconColor: 'text-amber-700'
  },
]

const SpeakingMenu = () => {
  const navigate = useNavigate()
  const { currentLanguage } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header - Hidden on Desktop */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border/50">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Practice</h1>
        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block p-8 pb-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Speaking Practice</h1>
          <p className="text-muted-foreground">Choose how you want to practice speaking {currentLanguage.name}</p>
        </div>
      </div>

      {/* Speaking Features */}
      <div className="p-4 lg:p-8 lg:pt-4">
        <div className="lg:max-w-6xl lg:mx-auto">
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-4">
            {/* Voice Rooms - Large card with microphone background */}
            <div
              className="relative rounded-3xl h-48 cursor-pointer transition-all duration-200 hover:scale-[1.02] overflow-hidden"
              onClick={() => navigate('/speaking/voice-rooms/browse')}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-1643652631396-181154ca7d8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBtaWNyb3Bob25lJTIwcmVjb3JkaW5nJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1ODYzMzc5OXww&ixlib=rb-4.1.0&q=80&w=1080)`
                }}
              />
              <div className="absolute inset-0 bg-black/40 rounded-3xl" />
              
              <div className="absolute bottom-6 left-6 z-10">
                <h2 className="text-white text-2xl font-bold mb-1">
                  Voice Rooms
                </h2>
                <p className="text-white/90 text-sm">
                  Join topic-based group conversations
                </p>
              </div>
            </div>

            {/* Random Call - Single card with phone background */}
            <div
              className="relative rounded-3xl h-40 cursor-pointer transition-all duration-200 hover:scale-[1.02] overflow-hidden"
              onClick={() => navigate('/speaking/random-call')}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-1592647416962-838a003e9859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBwaG9uZSUyMHNtYXJ0cGhvbmUlMjBtb2Rlcm58ZW58MXx8fHwxNzU4NjMzNzkzfDA&ixlib=rb-4.1.0&q=80&w=1080)`
                }}
              />
              <div className="absolute inset-0 bg-black/40 rounded-3xl" />
              
              <div className="absolute bottom-6 left-6 z-10">
                <h2 className="text-white text-xl font-bold mb-1">
                  Random Call
                </h2>
                <p className="text-white/90 text-sm">
                  Get matched with a random partner
                </p>
              </div>
            </div>

            {/* Practice with AI - Single card with robot background */}
            <div
              className="relative rounded-3xl h-40 cursor-pointer transition-all duration-200 hover:scale-[1.02] overflow-hidden"
              onClick={() => navigate('/speaking/ai-practice')}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-1641312874336-6279a832a3dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdCUyMGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2UlMjBtb2Rlcm58ZW58MXx8fHwxNzU4NjMzNzk2fDA&ixlib=rb-4.1.0&q=80&w=1080)`
                }}
              />
              <div className="absolute inset-0 bg-black/40 rounded-3xl" />
              
              <div className="absolute bottom-6 left-6 z-10">
                <h2 className="text-white text-xl font-bold mb-1">
                  Practice with AI
                </h2>
                <p className="text-white/90 text-sm">
                  Practice with AI-powered conversation
                </p>
              </div>
            </div>

            {/* Instant Translation - Single card with translation background */}
            <div
              className="relative rounded-3xl h-40 cursor-pointer transition-all duration-200 hover:scale-[1.02] overflow-hidden"
              onClick={() => navigate('/speaking/instant-translate')}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-1621691187532-bbeb671757ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFuc2xhdGlvbiUyMGFwcCUyMGludGVyZmFjZSUyMG1vYmlsZXxlbnwxfHx8fDE3NTg2MzI5NDd8MA&ixlib=rb-4.1.0&q=80&w=1080)`
                }}
              />
              <div className="absolute inset-0 bg-black/40 rounded-3xl" />
              
              <div className="absolute bottom-6 left-6 z-10">
                <h2 className="text-white text-xl font-bold mb-1">
                  Instant Translation
                </h2>
                <p className="text-white/90 text-sm">
                  Real-time translation and pronunciation help
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-6">
              {/* Top Row - Voice Rooms (Large) and Random Call */}
              <div className="col-span-2 grid grid-cols-3 gap-6">
                {/* Voice Rooms - Takes 2 columns */}
                <div
                  className="col-span-2 relative rounded-3xl h-64 cursor-pointer transition-all duration-200 hover:scale-[1.02] overflow-hidden"
                  onClick={() => navigate('/speaking/voice-rooms/browse')}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(https://images.unsplash.com/photo-1643652631396-181154ca7d8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBtaWNyb3Bob25lJTIwcmVjb3JkaW5nJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1ODYzMzc5OXww&ixlib=rb-4.1.0&q=80&w=1080)`
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-3xl" />
                  
                  <div className="absolute bottom-8 left-8 z-10">
                    <h2 className="text-white text-3xl font-bold mb-2">
                      Voice Rooms
                    </h2>
                    <p className="text-white/90 text-lg">
                      Join topic-based group conversations
                    </p>
                  </div>
                </div>

                {/* Random Call - Takes 1 column */}
                <div
                  className="relative rounded-3xl h-64 cursor-pointer transition-all duration-200 hover:scale-[1.02] overflow-hidden"
                  onClick={() => navigate('/speaking/random-call')}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(https://images.unsplash.com/photo-1592647416962-838a003e9859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBwaG9uZSUyMHNtYXJ0cGhvbmUlMjBtb2Rlcm58ZW58MXx8fHwxNzU4NjMzNzkzfDA&ixlib=rb-4.1.0&q=80&w=1080)`
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-3xl" />
                  
                  <div className="absolute bottom-6 left-6 z-10">
                    <h2 className="text-white text-xl font-bold mb-1">
                      Random Call
                    </h2>
                    <p className="text-white/90 text-sm">
                      Get matched with a random partner
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Row - AI Practice and Instant Translation */}
              <div
                className="relative rounded-3xl h-64 cursor-pointer transition-all duration-200 hover:scale-[1.02] overflow-hidden"
                onClick={() => navigate('/speaking/ai-practice')}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1641312874336-6279a832a3dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdCUyMGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2UlMjBtb2Rlcm58ZW58MXx8fHwxNzU4NjMzNzk2fDA&ixlib=rb-4.1.0&q=80&w=1080)`
                  }}
                />
                <div className="absolute inset-0 bg-black/40 rounded-3xl" />
                
                <div className="absolute bottom-6 left-6 z-10">
                  <h2 className="text-white text-xl font-bold mb-1">
                    Practice with AI
                  </h2>
                  <p className="text-white/90 text-sm">
                    Practice with AI-powered conversation
                  </p>
                </div>
              </div>

              <div
                className="relative rounded-3xl h-64 cursor-pointer transition-all duration-200 hover:scale-[1.02] overflow-hidden"
                onClick={() => navigate('/speaking/instant-translate')}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1621691187532-bbeb671757ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFuc2xhdGlvbiUyMGFwcCUyMGludGVyZmFjZSUyMG1vYmlsZXxlbnwxfHx8fDE3NTg2MzI5NDd8MA&ixlib=rb-4.1.0&q=80&w=1080)`
                  }}
                />
                <div className="absolute inset-0 bg-black/40 rounded-3xl" />
                
                <div className="absolute bottom-6 left-6 z-10">
                  <h2 className="text-white text-xl font-bold mb-1">
                    Instant Translation
                  </h2>
                  <p className="text-white/90 text-sm">
                    Real-time translation and pronunciation help
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Speaking() {
  const navigate = useNavigate()
  const location = useLocation()

  // If we're on the root speaking path, show the menu
  useEffect(() => {
    if (location.pathname === '/speaking') {
      // Don't redirect, show the menu instead
    }
  }, [location.pathname])

  // Show menu for root path, otherwise show the specific feature
  if (location.pathname === '/speaking') {
    return <SpeakingMenu />
  }

  return (
    <div className="h-full">
      <Routes>
        <Route path="ai-practice" element={<AIPractice />} />
        <Route path="voice-rooms/*" element={<VoiceRooms />} />
        <Route path="random-call" element={<RandomCallMatching />} />
        <Route path="random-call/live" element={<RandomCallLive />} />
        <Route path="random-call/complete" element={<RandomCallComplete />} />
        <Route path="instant-translate" element={<InstantTranslate />} />
      </Routes>
    </div>
  )
}