import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  Users, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  Hand,
  MessageSquare,
  Settings,
  MoreVertical,
  Share2,
  UserPlus,
  Bell,
  BellOff,
  Zap,
  Star,
  Send,
  ThumbsUp,
  Heart,
  Laugh,
  Zap,
  Music,
  Phone,
  PhoneOff
} from 'lucide-react'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Switch } from '../../ui/switch'
import { Input } from '../../ui/input'
import { ScrollArea } from '../../ui/scroll-area'
import { Separator } from '../../ui/separator'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '../../ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'

interface Participant {
  id: string
  name: string
  level: string
  isSpeaking: boolean
  isListening: boolean
  isModerator: boolean
  hasRaisedHand: boolean
  avatar?: string
  joinedAt: string
}

interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: string
  isReaction?: boolean
  reactionType?: string
}

const mockParticipants: Participant[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    level: 'Host',
    isSpeaking: true,
    isListening: false,
    isModerator: true,
    hasRaisedHand: false,
    joinedAt: '2h ago'
  },
  {
    id: '2',
    name: 'Mike Johnson',
    level: 'Speaking',
    isSpeaking: true,
    isListening: false,
    isModerator: false,
    hasRaisedHand: false,
    joinedAt: '45m ago'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    level: 'Listening',
    isSpeaking: false,
    isListening: true,
    isModerator: false,
    hasRaisedHand: false,
    joinedAt: '20m ago'
  },
  {
    id: '4',
    name: 'Alex Kim',
    level: 'Listening',
    isSpeaking: false,
    isListening: true,
    isModerator: false,
    hasRaisedHand: false,
    joinedAt: '15m ago'
  },
  {
    id: '5',
    name: 'Lisa Park',
    level: 'Raised Hand',
    isSpeaking: false,
    isListening: true,
    isModerator: false,
    hasRaisedHand: true,
    joinedAt: '2m ago'
  },
  {
    id: '6',
    name: 'David Brown',
    level: 'Raised Hand',
    isSpeaking: false,
    isListening: true,
    isModerator: false,
    hasRaisedHand: true,
    joinedAt: '5m ago'
  }
]

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    userId: '3',
    userName: 'Emma',
    message: 'Great topic! I love discussing travel experiences',
    timestamp: '2m ago'
  },
  {
    id: '2',
    userId: '4',
    userName: 'Alex',
    message: 'Amazing pronunciation!',
    timestamp: '1m ago'
  }
]

const quickReactions = [
  { emoji: '👏', label: 'Clap', icon: Music },
  { emoji: '❤️', label: 'Love', icon: Heart },
  { emoji: '😂', label: 'Laugh', icon: MessageSquare },
  { emoji: '👍', label: 'Like', icon: ThumbsUp },
  { emoji: '🔥', label: 'Fire', icon: Zap }
]

export default function VoiceRoomLive() {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const [isMuted, setIsMuted] = useState(true)
  const [hasRaisedHand, setHasRaisedHand] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)
  const [chatMessage, setChatMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants)

  const currentUser = {
    id: 'current-user',
    name: 'You',
    level: 'Listening',
    isSpeaking: false,
    isListening: true,
    isModerator: false,
    hasRaisedHand: hasRaisedHand
  }

  const speakers = participants.filter(p => p.isSpeaking)
  const listeners = participants.filter(p => p.isListening && !p.isSpeaking && !p.hasRaisedHand)
  const raisedHands = participants.filter(p => p.hasRaisedHand)
  const totalParticipants = participants.length + 1 // +1 for current user
  const audienceCount = listeners.length + (currentUser.isListening && !currentUser.isSpeaking ? 1 : 0)

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      message: chatMessage,
      timestamp: 'now'
    }
    
    setMessages(prev => [...prev, newMessage])
    setChatMessage('')
  }

  const handleQuickReaction = (reaction: typeof quickReactions[0]) => {
    // Add reaction animation or send to room
    console.log('Quick reaction:', reaction.emoji)
  }

  const handleLeaveRoom = () => {
    navigate('/speaking/voice-rooms/browse')
  }

  const handleInviteSpeaker = (participantId: string) => {
    setParticipants(prev => 
      prev.map(p => 
        p.id === participantId 
          ? { ...p, hasRaisedHand: false, isSpeaking: true, isListening: false, level: 'Speaking' }
          : p
      )
    )
  }

  const handleIgnoreRequest = (participantId: string) => {
    setParticipants(prev => 
      prev.map(p => 
        p.id === participantId 
          ? { ...p, hasRaisedHand: false }
          : p
      )
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-900/20 via-background to-background">
      {/* Header */}
      <div className="bg-card/90 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/speaking/voice-rooms/browse')}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold">English Practice Room</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{totalParticipants} participants</span>
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                <span className="text-green-500">● Live</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Copy room link</DropdownMenuItem>
                <DropdownMenuItem>Share on social</DropdownMenuItem>
                <DropdownMenuItem>Invite friends</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Report room</DropdownMenuItem>
                <DropdownMenuItem>Block moderator</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">Leave room</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Topic Banner */}
        <div className="px-4 pb-4">
          <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  Daily English Conversation
                </Badge>
                <span className="text-sm text-muted-foreground">Topic: Travel Experiences</span>
              </div>
              <p className="text-sm font-medium">
                Share your most memorable travel experience and what you learned from it
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Speakers Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-green-500" />
                  Speakers ({speakers.length})
                </div>
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {speakers.map((speaker) => (
                  <div key={speaker.id} className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className={speaker.isModerator ? 'bg-purple-500 text-white' : 'bg-green-500 text-white'}>
                          {speaker.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                      {speaker.isModerator && (
                        <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 fill-current" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{speaker.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {speaker.isModerator ? 'Host' : 'Speaking now'}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Volume2 className="h-4 w-4 text-green-500" />
                      <Mic className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                ))}
                
                {/* Empty speaker slots */}
                <div className="flex items-center justify-center p-3 border-2 border-dashed border-muted rounded-lg">
                  <div className="text-center">
                    <UserPlus className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                    <div className="text-sm text-muted-foreground">Invite Speaker</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Raised Hands Section */}
          {raisedHands.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hand className="h-5 w-5 text-yellow-500" />
                    Raised Hands ({raisedHands.length})
                  </div>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {raisedHands.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-yellow-500 text-white">
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{participant.name}</div>
                          <div className="text-sm text-muted-foreground">Raised hand {participant.joinedAt}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => handleInviteSpeaker(participant.id)}>
                          Invite
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleIgnoreRequest(participant.id)}>
                          Ignore
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Audience Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Audience ({audienceCount})
                </div>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {/* Current user */}
                <div className="flex flex-col items-center gap-1 min-w-0 flex-shrink-0">
                  <Avatar className="h-10 w-10 ring-2 ring-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      You
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-center truncate">You</span>
                </div>
                
                {listeners.slice(0, 14).map((listener) => (
                  <div key={listener.id} className="flex flex-col items-center gap-1 min-w-0 flex-shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {listener.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-center truncate w-12">{listener.name.split(' ')[0]}</span>
                  </div>
                ))}
                
                {listeners.length > 14 && (
                  <div className="flex flex-col items-center gap-1 min-w-0 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs">
                      +{listeners.length - 14} more
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Sidebar - Desktop */}
        <div className="hidden lg:block w-80 border-l border-border bg-card/50">
          <div className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Chat</h3>
                <Button variant="ghost" size="sm">
                  Clear
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{message.userName}</span>
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Chat Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reactions */}
      <div className="p-4 bg-card/90 backdrop-blur-sm border-t border-border">
        <div className="flex items-center justify-center gap-4 mb-4">
          {quickReactions.map((reaction) => (
            <Button
              key={reaction.label}
              variant="ghost"
              size="sm"
              onClick={() => handleQuickReaction(reaction)}
              className="flex flex-col gap-1 h-auto py-2 px-3 hover:bg-primary/10"
            >
              <span className="text-lg">{reaction.emoji}</span>
              <span className="text-xs">{reaction.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="bg-card/95 backdrop-blur-sm border-t border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Room Settings */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Room Settings</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span>Sound Effects</span>
                    </div>
                    <Switch checked={soundEffects} onCheckedChange={setSoundEffects} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-3">
            {/* Mute/Unmute */}
            <Button
              variant={isMuted ? "outline" : "default"}
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className={`gap-2 ${!isMuted ? 'bg-red-500 hover:bg-red-600' : ''}`}
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isMuted ? 'Muted' : 'Live'}
            </Button>

            {/* Raise Hand */}
            <Button
              variant={hasRaisedHand ? "default" : "outline"}
              size="sm"
              onClick={() => setHasRaisedHand(!hasRaisedHand)}
              className={`gap-2 ${hasRaisedHand ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
            >
              <Hand className="h-4 w-4" />
              {hasRaisedHand ? 'Hand Raised' : 'Raise Hand'}
            </Button>

            {/* Chat Toggle - Mobile */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChat(!showChat)}
              className="gap-2 lg:hidden"
            >
              <MessageSquare className="h-4 w-4" />
              Chat
            </Button>

            {/* Leave */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLeaveRoom}
              className="gap-2 text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
            >
              <PhoneOff className="h-4 w-4" />
              Leave
            </Button>
          </div>
        </div>

        {/* Request to Speak - Prominent Button */}
        <div className="mt-4">
          <Button className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
            Request to Speak
          </Button>
        </div>
      </div>

      {/* Mobile Chat Sheet */}
      <Sheet open={showChat} onOpenChange={setShowChat}>
        <SheetContent side="bottom" className="h-[70vh]">
          <SheetHeader>
            <SheetTitle>Chat</SheetTitle>
          </SheetHeader>
          <div className="mt-4 h-full flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{message.userName}</span>
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}