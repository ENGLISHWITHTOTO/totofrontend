import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  Users, 
  Mic, 
  Star, 
  Share2, 
  Heart, 
  Volume2,
  Clock,
  Shield,
  CheckCircle,
  UserPlus,
  Settings,
  MessageSquare,
  PlayCircle
} from 'lucide-react'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Separator } from '../../ui/separator'
import { Progress } from '../../ui/progress'

const mockRoom = {
  id: 'room-1',
  title: 'Daily English Conversation',
  subtitle: 'Travel Experiences',
  level: 'B1',
  topic: 'travel',
  isLive: true,
  participants: 24,
  maxParticipants: 30,
  duration: '45 min',
  moderator: {
    name: 'Sarah Chen',
    avatar: '',
    level: 'Host',
    isVerified: true,
    bio: 'Certified English teacher with 8+ years of experience. Passionate about travel and cultural exchange.',
    rating: 4.9,
    totalSessions: 156
  },
  currentSpeakers: 4,
  raisedHands: 2,
  totalListeners: 18,
  description: 'Share your amazing travel stories and learn from others experiences around the world. This is a beginner-friendly environment where everyone is encouraged to participate and practice their English speaking skills.',
  tags: ['Beginner Friendly', 'Interactive', 'Stories', 'Cultural Exchange'],
  backgroundImage: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBuZXR3b3JraW5nJTIwY29uZmVyZW5jZSUyMG1lZXRpbmd8ZW58MXx8fHwxNzU4NjM0Njc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  startedAt: '2 hours ago',
  estimatedEndTime: '6:30 PM',
  currentTopic: 'Share your most memorable travel experience and what you learned from it',
  upcomingTopics: [
    'Budget travel tips and tricks',
    'Cultural differences you\'ve noticed',
    'Food experiences around the world'
  ],
  rules: [
    'Be respectful and patient with all speakers',
    'Raise your hand to request speaking time',
    'Keep conversations travel-related',
    'No offensive language or inappropriate content'
  ],
  recentJoined: [
    { name: 'Mike Johnson', level: 'B1', joinedAgo: '2 min ago' },
    { name: 'Emma Wilson', level: 'A2', joinedAgo: '5 min ago' },
    { name: 'Alex Kim', level: 'B2', joinedAgo: '8 min ago' }
  ]
}

export default function VoiceRoomPreview() {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const [isLiked, setIsLiked] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

  const handleJoinRoom = async () => {
    setIsJoining(true)
    // Simulate permission check and room joining
    setTimeout(() => {
      navigate(`/speaking/voice-rooms/${roomId}/live`)
    }, 1500)
  }

  const participationLevel = (mockRoom.participants / mockRoom.maxParticipants) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/speaking/voice-rooms/browse')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className="p-2"
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden">
          <div 
            className="h-64 lg:h-80 bg-gradient-to-br from-primary/20 to-accent/20 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${mockRoom.backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            
            {/* Live indicator and stats */}
            <div className="absolute top-6 left-6 flex items-center gap-3">
              <Badge className="bg-red-500 text-white gap-2 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full" />
                LIVE
              </Badge>
              <Badge variant="secondary" className="bg-black/40 text-white border-white/20">
                {mockRoom.level}
              </Badge>
            </div>

            <div className="absolute top-6 right-6 flex items-center gap-3 text-white text-sm">
              <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg">
                <Users className="h-4 w-4" />
                {mockRoom.participants}
              </div>
              <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg">
                <Mic className="h-4 w-4" />
                {mockRoom.currentSpeakers}
              </div>
            </div>

            {/* Main content */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                {mockRoom.title}
              </h1>
              <p className="text-white/90 text-lg mb-4">
                {mockRoom.subtitle}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span>Started {mockRoom.startedAt}</span>
                  <span>Ends ~{mockRoom.estimatedEndTime}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border-2 border-white/20">
                    <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                      {mockRoom.moderator.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{mockRoom.moderator.name}</span>
                      {mockRoom.moderator.isVerified && (
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      )}
                    </div>
                    <div className="text-xs text-white/70">{mockRoom.moderator.level}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Topic */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-primary" />
                  Current Topic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-4">{mockRoom.currentTopic}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Room Activity</span>
                    <span className="font-medium">Very Active</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-primary">{mockRoom.currentSpeakers}</div>
                      <div className="text-xs text-muted-foreground">Speaking</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-yellow-500">{mockRoom.raisedHands}</div>
                      <div className="text-xs text-muted-foreground">Hands Raised</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-500">{mockRoom.totalListeners}</div>
                      <div className="text-xs text-muted-foreground">Listening</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Room</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{mockRoom.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {mockRoom.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Upcoming Topics</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {mockRoom.upcomingTopics.map((topic, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Room Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Room Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mockRoom.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Button */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold text-primary">
                    {mockRoom.participants}/{mockRoom.maxParticipants}
                  </div>
                  <div className="text-sm text-muted-foreground">participants</div>
                  
                  <Progress value={participationLevel} className="h-2" />
                  
                  <Button 
                    className="w-full gap-2 h-12"
                    onClick={handleJoinRoom}
                    disabled={isJoining || mockRoom.participants >= mockRoom.maxParticipants}
                  >
                    {isJoining ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Joining...
                      </>
                    ) : mockRoom.participants >= mockRoom.maxParticipants ? (
                      'Room Full'
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Join Room
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground">
                    You'll join as a listener. Raise your hand to speak.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Moderator Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Moderator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {mockRoom.moderator.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{mockRoom.moderator.name}</span>
                      {mockRoom.moderator.isVerified && (
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{mockRoom.moderator.level}</div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">{mockRoom.moderator.bio}</p>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold">{mockRoom.moderator.rating}</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{mockRoom.moderator.totalSessions}</div>
                    <div className="text-xs text-muted-foreground">Sessions</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Participants */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRoom.recentJoined.map((participant, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{participant.name}</div>
                          <div className="text-xs text-muted-foreground">{participant.level}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{participant.joinedAgo}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}