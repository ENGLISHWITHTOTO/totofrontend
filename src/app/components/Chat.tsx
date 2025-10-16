import { useState } from 'react'
import { ArrowLeft, Search, SlidersHorizontal, Send, Phone, Video, MoreVertical, Camera, Mic, Smile, Share2, Link2, MessageSquare } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar } from './ui/avatar'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { toast } from 'sonner@2.0.3'

type ChatType = 'friend' | 'ai' | 'teacher' | 'group'

interface Contact {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  isOnline?: boolean
  unreadCount?: number
  type: ChatType
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
    name: 'Sophia Martinez',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'See you tomorrow!',
    timestamp: '10:30 AM',
    isOnline: true,
    unreadCount: 0,
    type: 'friend'
  },
  {
    id: '2',
    name: 'AI Tutor Assistant',
    avatar: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop',
    lastMessage: "Let's practice vocabulary",
    timestamp: '10:00 AM',
    isOnline: true,
    unreadCount: 1,
    type: 'ai'
  },
  {
    id: '3',
    name: 'Student: James Wilson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    lastMessage: "Thanks for today's lesson!",
    timestamp: '9:45 AM',
    isOnline: true,
    unreadCount: 2,
    type: 'teacher'
  },
  {
    id: '4',
    name: 'Isabella Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'Can we reschedule?',
    timestamp: '9:30 AM',
    isOnline: false,
    unreadCount: 0,
    type: 'friend'
  },
  {
    id: '5',
    name: 'IELTS Preparation Group',
    avatar: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=100&h=100&fit=crop',
    lastMessage: "Sarah: Don't forget tomorrow's class!",
    timestamp: '9:15 AM',
    isOnline: true,
    unreadCount: 3,
    type: 'group'
  },
  {
    id: '6',
    name: 'Emma Watson',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'Thanks for the feedback!',
    timestamp: 'Yesterday',
    isOnline: false,
    unreadCount: 0,
    type: 'friend'
  },
  {
    id: '7',
    name: 'Grammar AI Helper',
    avatar: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=100&h=100&fit=crop',
    lastMessage: 'Ready to help you teach!',
    timestamp: 'Yesterday',
    isOnline: true,
    unreadCount: 0,
    type: 'ai'
  },
  {
    id: '8',
    name: 'Student: Carlos Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'Question about homework',
    timestamp: '2 days ago',
    isOnline: false,
    unreadCount: 1,
    type: 'teacher'
  },
  {
    id: '9',
    name: 'Teacher Collaboration',
    avatar: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop',
    lastMessage: 'Marie: Great workshop idea!',
    timestamp: '2 days ago',
    isOnline: true,
    unreadCount: 0,
    type: 'group'
  },
  {
    id: '10',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'See you next week',
    timestamp: '3 days ago',
    isOnline: true,
    unreadCount: 0,
    type: 'friend'
  }
]

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '3',
    content: 'Hi! I had a question about today\'s lesson on phrasal verbs.',
    timestamp: '9:40 AM',
    type: 'text'
  },
  {
    id: '2',
    senderId: 'me',
    content: 'Of course! What would you like to know?',
    timestamp: '9:42 AM',
    type: 'text'
  },
  {
    id: '3',
    senderId: '3',
    content: 'I\'m confused about "look up" vs "look after". Can you explain the difference?',
    timestamp: '9:43 AM',
    type: 'text'
  },
  {
    id: '4',
    senderId: 'me',
    content: 'Great question! "Look up" means to search for information (like in a dictionary), while "look after" means to take care of someone or something.',
    timestamp: '9:45 AM',
    type: 'text'
  },
  {
    id: '5',
    senderId: '3',
    content: 'Oh, that makes sense now! So "I look up words in the dictionary" and "I look after my little sister"?',
    timestamp: '9:46 AM',
    type: 'text'
  },
  {
    id: '6',
    senderId: 'me',
    content: 'Exactly! You\'ve got it. Perfect examples! 👍',
    timestamp: '9:47 AM',
    type: 'text'
  }
]

type TabType = 'all' | 'students' | 'ai' | 'colleagues' | 'groups'

const tabs: { id: TabType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'students', label: 'Students' },
  { id: 'ai', label: 'AI' },
  { id: 'colleagues', label: 'Teachers' },
  { id: 'groups', label: 'Groups' }
]

export function Chat() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [shareMode, setShareMode] = useState<'options' | 'contacts'>('options')
  const [shareSearchQuery, setShareSearchQuery] = useState('')

  const filteredContacts = mockContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'students' && contact.type === 'friend') ||
                      (activeTab === 'ai' && contact.type === 'ai') ||
                      (activeTab === 'colleagues' && contact.type === 'teacher') ||
                      (activeTab === 'groups' && contact.type === 'group')
    
    return matchesSearch && matchesTab
  })

  const handleSendMessage = () => {
    if (message.trim()) {
      toast.success('Message sent')
      setMessage('')
    }
  }

  const handleShare = () => {
    setShowShareDialog(true)
    setShareMode('options')
  }

  const handleCopyLink = async () => {
    const chatLink = `${window.location.origin}/chat/${selectedContact?.id}`
    try {
      await navigator.clipboard.writeText(chatLink)
      toast.success('Link copied to clipboard')
      setShowShareDialog(false)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleShareInChat = () => {
    setShareMode('contacts')
  }

  const handleShareToContact = (contact: Contact) => {
    toast.success(`Shared with ${contact.name}`)
    setShowShareDialog(false)
    setShareMode('options')
    setShareSearchQuery('')
  }

  const closeShareDialog = () => {
    setShowShareDialog(false)
    setTimeout(() => {
      setShareMode('options')
      setShareSearchQuery('')
    }, 200)
  }

  const filteredShareContacts = mockContacts
    .filter(c => c.id !== selectedContact?.id)
    .filter(contact => 
      contact.name.toLowerCase().includes(shareSearchQuery.toLowerCase())
    )

  // Chat conversation view
  if (selectedContact) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-3rem)] bg-background border border-border rounded-xl overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedContact(null)}
              className="p-2 hover:bg-secondary flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Avatar className="w-10 h-10 flex-shrink-0">
              <img src={selectedContact.avatar} alt={selectedContact.name} className="w-full h-full object-cover rounded-full" />
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate">{selectedContact.name}</h3>
                {selectedContact.type === 'teacher' && (
                  <Badge variant="secondary" className="text-xs px-2 py-0 flex-shrink-0">Teacher</Badge>
                )}
                {selectedContact.type === 'ai' && (
                  <Badge variant="secondary" className="text-xs px-2 py-0 flex-shrink-0 bg-primary/10 text-primary border-primary/20">AI</Badge>
                )}
                {selectedContact.type === 'group' && (
                  <Badge variant="secondary" className="text-xs px-2 py-0 flex-shrink-0">Group</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedContact.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button variant="ghost" size="sm" className="p-2 hover:bg-secondary">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 hover:bg-secondary">
              <Video className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 hover:bg-secondary"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 hover:bg-secondary">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {mockMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] md:max-w-[60%] ${
                  msg.senderId === 'me' 
                    ? 'bg-gradient-to-r from-primary to-violet-600 text-primary-foreground' 
                    : 'bg-secondary'
                } rounded-2xl px-4 py-2.5`}>
                  <p className="text-sm">{msg.content}</p>
                  {msg.isTranslated && (
                    <p className="text-xs opacity-75 mt-1 italic">
                      Translated
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

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-card/50 backdrop-blur">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2 hover:bg-secondary flex-shrink-0">
              <Camera className="w-5 h-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="pr-12 bg-input border-border"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary">
                <Smile className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="p-2 hover:bg-secondary flex-shrink-0">
              <Mic className="w-5 h-5" />
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim()}
              size="sm"
              className="p-2 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Auto-translate enabled • AI-powered
          </p>
        </div>

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={closeShareDialog}>
          <DialogContent className="sm:max-w-[425px] p-0 gap-0">
            {shareMode === 'options' && (
              <>
                <DialogHeader className="p-6 pb-4">
                  <DialogTitle>Share Chat</DialogTitle>
                </DialogHeader>

                <div className="px-4 pb-6">
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 rounded-xl transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Link2 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">Copy Link</p>
                      <p className="text-sm text-muted-foreground">Share this chat via link</p>
                    </div>
                  </button>

                  <button
                    onClick={handleShareInChat}
                    className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 rounded-xl transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">Forward to Chat</p>
                      <p className="text-sm text-muted-foreground">Forward this conversation</p>
                    </div>
                  </button>
                </div>
              </>
            )}

            {shareMode === 'contacts' && (
              <>
                <DialogHeader className="p-6 pb-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShareMode('options')}
                      className="p-1 h-auto hover:bg-secondary -ml-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <DialogTitle>Forward to Chat</DialogTitle>
                  </div>
                </DialogHeader>

                <div className="px-6 pb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search contacts..."
                      value={shareSearchQuery}
                      onChange={(e) => setShareSearchQuery(e.target.value)}
                      className="pl-10 bg-secondary border-0"
                    />
                  </div>
                </div>

                <ScrollArea className="max-h-[400px] px-4 pb-6">
                  <div className="space-y-1">
                    {filteredShareContacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => handleShareToContact(contact)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-secondary/50 rounded-xl transition-colors"
                      >
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <img 
                            src={contact.avatar} 
                            alt={contact.name}
                            className="w-full h-full object-cover rounded-full" 
                          />
                        </Avatar>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{contact.name}</p>
                            {contact.type === 'teacher' && (
                              <Badge variant="secondary" className="text-xs px-2 py-0 flex-shrink-0">Teacher</Badge>
                            )}
                            {contact.type === 'ai' && (
                              <Badge variant="secondary" className="text-xs px-2 py-0 flex-shrink-0">AI</Badge>
                            )}
                            {contact.type === 'group' && (
                              <Badge variant="secondary" className="text-xs px-2 py-0 flex-shrink-0">Group</Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Chats list view
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-3rem)] bg-background border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur">
        <div className="flex items-center justify-between p-4">
          <div className="w-10" />
          <h1 className="text-center">Messages</h1>
          <Button variant="ghost" size="sm" className="p-2 hover:bg-secondary">
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search chats"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-0 rounded-xl"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4">
          <div className="flex items-center gap-6 border-b border-border overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 relative transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contact List */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-border">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 cursor-pointer transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="w-14 h-14">
                    <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover rounded-full" />
                  </Avatar>
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="truncate">{contact.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                </div>
                
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{contact.timestamp}</span>
                  {contact.unreadCount && contact.unreadCount > 0 && (
                    <Badge variant="default" className="w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-primary to-violet-600">
                      {contact.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <p className="text-muted-foreground text-center">No chats found</p>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
