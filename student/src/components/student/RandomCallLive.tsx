import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Volume2,
  VolumeX,
  MessageSquare,
  Settings,
  MoreVertical,
  Share,
  ChevronDown,
  ChevronUp,
  Send,
  Star,
  Flag,
  Timer,
  Signal,
  Wifi,
  Monitor,
  Users,
  Heart,
  ThumbsUp,
  Zap,
  Globe
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu"

interface ChatMessage {
  id: string
  sender: 'me' | 'partner'
  message: string
  timestamp: string
  isTranslated?: boolean
  originalText?: string
}

interface CallStats {
  duration: number
  quality: 'excellent' | 'good' | 'poor'
  language: string
  partnerLevel: string
}

export default function RandomCallLive() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [callTimer, setCallTimer] = useState(0)
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent')
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showPartnerProfile, setShowPartnerProfile] = useState(false)

  // Get partner data from location state or use default
  const partner = location.state?.partner || {
    id: '1',
    name: 'Maria González',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    country: 'Spain',
    level: 'Intermediate',
    rating: 4.9,
    languages: ['Spanish', 'English'],
    interests: ['Travel', 'Culture', 'Music']
  }

  // Mock chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'partner',
      message: '¡Hola! Nice to meet you!',
      timestamp: '2:34',
      isTranslated: true,
      originalText: '¡Hola! ¡Encantada de conocerte!'
    },
    {
      id: '2',
      sender: 'me',
      message: 'Hello Maria! Great to practice with you.',
      timestamp: '2:35'
    },
    {
      id: '3',
      sender: 'partner',
      message: 'What topic would you like to discuss today?',
      timestamp: '2:36'
    }
  ])

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCallTimer(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Format timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleEndCall = () => {
    navigate('/speaking/random-call/complete', { 
      state: { 
        partner: {
          name: partner.name,
          avatar: partner.avatar,
          country: partner.country,
          level: partner.level
        },
        duration: formatTime(callTimer),
        language: 'Spanish'
      }
    })
  }

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'me',
        message: chatMessage,
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        })
      }
      setChatMessages(prev => [...prev, newMessage])
      setChatMessage('')
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-400'
      case 'good': return 'text-yellow-400'
      case 'poor': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent': return <Wifi className="h-4 w-4" />
      case 'good': return <Signal className="h-4 w-4" />
      case 'poor': return <Signal className="h-4 w-4" />
      default: return <Signal className="h-4 w-4" />
    }
  }

  return (
    <div className="h-full flex flex-col bg-black relative overflow-hidden">
      {/* Video Call Area */}
      <div className="flex-1 relative">
        {/* Partner Video (Main) */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-white/20">
                <AvatarImage src={partner.avatar} />
                <AvatarFallback className="bg-purple-600 text-white text-4xl">
                  {partner.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-2xl font-bold mb-2">{partner.name}</h3>
              <div className="flex items-center justify-center gap-2 text-white/80">
                <Globe className="h-4 w-4" />
                <span>{partner.country}</span>
                <span>•</span>
                <span>{partner.level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* My Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-xl border-2 border-gray-600 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-white">
            {isVideoOn ? (
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-600 rounded-full mx-auto mb-1"></div>
                <span className="text-xs">You</span>
              </div>
            ) : (
              <VideoOff className="h-6 w-6 text-gray-400" />
            )}
          </div>
        </div>

        {/* Call Info Overlay */}
        <div className="absolute top-4 left-4 flex items-center gap-3">
          {/* Call Timer */}
          <Card className="bg-black/60 border-gray-700/50 backdrop-blur-sm px-3 py-2">
            <div className="flex items-center gap-2 text-white">
              <Timer className="h-4 w-4 text-green-400" />
              <span className="font-mono text-sm">{formatTime(callTimer)}</span>
            </div>
          </Card>

          {/* Connection Quality */}
          <Card className="bg-black/60 border-gray-700/50 backdrop-blur-sm px-3 py-2">
            <div className={`flex items-center gap-2 ${getQualityColor(connectionQuality)}`}>
              {getQualityIcon(connectionQuality)}
              <span className="text-sm capitalize">{connectionQuality}</span>
            </div>
          </Card>

          {/* Language Badge */}
          <Badge className="bg-purple-600/80 hover:bg-purple-700/80 text-white">
            <Globe className="h-3 w-3 mr-1" />
            Spanish Practice
          </Badge>
        </div>

        {/* Partner Profile Toggle */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPartnerProfile(!showPartnerProfile)}
            className="bg-black/60 backdrop-blur-sm text-white hover:bg-black/80"
          >
            <Users className="h-4 w-4 mr-2" />
            Partner Info
            {showPartnerProfile ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </Button>
        </div>

        {/* Partner Profile Dropdown */}
        {showPartnerProfile && (
          <Card className="absolute top-16 left-1/2 transform -translate-x-1/2 w-80 bg-gray-900/95 border-gray-700/50 backdrop-blur-sm z-10">
            <div className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={partner.avatar} />
                  <AvatarFallback className="bg-purple-600 text-white">
                    {partner.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{partner.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span>{partner.rating}</span>
                    <span>•</span>
                    <span>{partner.country}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Languages</p>
                  <div className="flex gap-2">
                    {partner.languages.map((lang) => (
                      <Badge key={lang} variant="secondary" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-400 mb-1">Interests</p>
                  <div className="flex gap-2">
                    {partner.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Screen Sharing Indicator */}
        {isScreenSharing && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <Card className="bg-blue-600/90 border-blue-500/50 backdrop-blur-sm px-4 py-2">
              <div className="flex items-center gap-2 text-white">
                <Monitor className="h-4 w-4" />
                <span className="text-sm font-medium">Screen Sharing</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Chat Sidebar */}
      {isChatOpen && (
        <div className="absolute right-0 top-0 h-full w-80 bg-gray-900/95 border-l border-gray-700/50 backdrop-blur-sm z-20">
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Chat</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-3 py-2 ${
                        msg.sender === 'me'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-white'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      {msg.isTranslated && msg.originalText && (
                        <p className="text-xs opacity-70 mt-1 italic">
                          Original: {msg.originalText}
                        </p>
                      )}
                      <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-700/50">
              <div className="flex gap-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Control Bar */}
      <div className="bg-black/90 backdrop-blur-sm border-t border-gray-800/50 p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Audio Control */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAudioOn(!isAudioOn)}
            className={`w-12 h-12 rounded-full ${
              isAudioOn 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>

          {/* Video Control */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`w-12 h-12 rounded-full ${
              isVideoOn 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>

          {/* Speaker Control */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-12 h-12 rounded-full ${
              isSpeakerOn 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-500 text-white'
            }`}
          >
            {isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>

          {/* Chat Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`w-12 h-12 rounded-full ${
              isChatOpen 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-900 border-gray-700">
              <DropdownMenuItem
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className="text-white hover:bg-gray-800"
              >
                <Monitor className="h-4 w-4 mr-2" />
                {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-800">
                <Heart className="h-4 w-4 mr-2" />
                Add to Favorites
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-800">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Rate Partner
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="text-red-400 hover:bg-red-900/20">
                <Flag className="h-4 w-4 mr-2" />
                Report Issue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* End Call */}
          <Button
            onClick={handleEndCall}
            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}