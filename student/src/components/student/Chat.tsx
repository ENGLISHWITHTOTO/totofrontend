import { useState } from 'react'
import { ArrowLeft, Search, Plus, Send, Phone, Video, MoreVertical, Camera, Mic, Smile } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Avatar } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'

interface Contact {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  isOnline: boolean
  unreadCount: number
  language: string
  isTeacher?: boolean
}

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
  type: 'text' | 'voice' | 'image'
  isTranslated?: boolean
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
    lastMessage: '¡Hola! ¿Cómo está tu práctica de español?',
    timestamp: '2m ago',
    isOnline: true,
    unreadCount: 2,
    language: 'Spanish',
    isTeacher: true
  },
  {
    id: '2',
    name: 'Tanaka Hiroshi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'おはようございます！今日は漢字を勉強しましょう',
    timestamp: '15m ago',
    isOnline: true,
    unreadCount: 0,
    language: 'Japanese'
  },
  {
    id: '3',
    name: 'Marie Dubois',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'Bonjour! Comment allez-vous aujourd\'hui?',
    timestamp: '1h ago',
    isOnline: false,
    unreadCount: 1,
    language: 'French',
    isTeacher: true
  },
  {
    id: '4',
    name: 'Language Exchange Group',
    avatar: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'Lisa: Great pronunciation practice today!',
    timestamp: '3h ago',
    isOnline: true,
    unreadCount: 5,
    language: 'Mixed'
  },
  {
    id: '5',
    name: 'Ahmed Hassan',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'مرحبا! هل تريد ممارسة العربية اليوم؟',
    timestamp: '1d ago',
    isOnline: false,
    unreadCount: 0,
    language: 'Arabic'
  }
]

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    content: '¡Hola! ¿Cómo está tu práctica de español?',
    timestamp: '10:30 AM',
    type: 'text'
  },
  {
    id: '2',
    senderId: 'me',
    content: '¡Hola Sarah! Está yendo muy bien, gracias. Estoy trabajando en los verbos irregulares.',
    timestamp: '10:32 AM',
    type: 'text'
  },
  {
    id: '3',
    senderId: '1',
    content: '¡Excelente! Los verbos irregulares pueden ser difíciles. ¿Quieres que practiquemos juntos?',
    timestamp: '10:33 AM',
    type: 'text'
  },
  {
    id: '4',
    senderId: 'me',
    content: 'Sí, por favor. I\'m still struggling with ser vs estar.',
    timestamp: '10:35 AM',
    type: 'text'
  },
  {
    id: '5',
    senderId: '1',
    content: 'Perfect! "Ser" is for permanent characteristics, "estar" is for temporary states. Let\'s practice with some examples.',
    timestamp: '10:36 AM',
    type: 'text',
    isTranslated: true
  }
]

export default function Chat() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.language.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (message.trim()) {
      // In real app, send message via API
      setMessage('')
    }
  }

  if (selectedContact) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedContact(null)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Avatar className="w-10 h-10">
              <img src={selectedContact.avatar} alt={selectedContact.name} className="w-full h-full object-cover rounded-full" />
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{selectedContact.name}</h3>
                {selectedContact.isTeacher && (
                  <Badge variant="secondary" className="text-xs">Teacher</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedContact.isOnline ? 'Online' : 'Last seen 2h ago'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {mockMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${msg.senderId === 'me' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
                  <p className="text-sm">{msg.content}</p>
                  {msg.isTranslated && (
                    <p className="text-xs opacity-75 mt-1 italic">
                      Translated from Spanish
                    </p>
                  )}
                  <p className={`text-xs mt-1 ${msg.senderId === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input - Enhanced contrast */}
        <div className="p-4 border-t border-[#2a2a2f] bg-[#0f0f11]">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Camera className="w-5 h-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="pr-12"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 p-1">
                <Smile className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="p-2">
              <Mic className="w-5 h-5" />
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim()}
              size="sm"
              className="p-2"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Auto-translate is enabled • Powered by AI
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header - Enhanced contrast */}
      <div className="p-4 border-b border-[#2a2a2f] bg-[#0f0f11] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1>Messages</h1>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Contact List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#141418] cursor-pointer transition-all duration-300 border border-transparent hover:border-border/50"
            >
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover rounded-full" />
                </Avatar>
                {contact.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{contact.name}</h4>
                  {contact.isTeacher && (
                    <Badge variant="secondary" className="text-xs shrink-0">Teacher</Badge>
                  )}
                  <span className="text-xs text-muted-foreground shrink-0">{contact.language}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
                {contact.unreadCount > 0 && (
                  <Badge variant="default" className="w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {contact.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-4 border-t bg-card">
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Video className="w-4 h-4" />
            Video Chat
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Mic className="w-4 h-4" />
            Voice Room
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Search className="w-4 h-4" />
            Find Partners
          </Button>
        </div>
      </div>
    </div>
  )
}