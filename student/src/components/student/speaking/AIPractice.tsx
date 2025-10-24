import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  Search, 
  Filter,
  Mic, 
  Languages, 
  ThumbsUp, 
  ThumbsDown, 
  Smile, 
  HelpCircle,
  Send,
  X
} from 'lucide-react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'
import { Card } from '../../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'

import { Textarea } from '../../ui/textarea'

interface AICharacter {
  id: string
  name: string
  avatar: string
  level: string
  description: string
  features: string[]
  isRecommended?: boolean
}

const mockCharacters: AICharacter[] = [
  {
    id: '1',
    name: 'Chloe',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    level: 'Beginner',
    description: 'Friendly Tour Guide',
    features: ['Beginner Friendly', 'Encouraging']
  },
  {
    id: '2', 
    name: 'Daniel',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    level: 'Intermediate',
    description: 'Former Business Partner',
    features: ['Professional', 'Business Focus']
  },
  {
    id: '3',
    name: 'Ava',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 
    level: 'Intermediate',
    description: 'Career Fixer. Practice includes: Interviews, CVs, Networking. Instant Feedback',
    features: ['Career Focus', 'Interview Prep']
  },
  {
    id: '4',
    name: 'Noah',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    level: 'Advanced',
    description: 'Film Director. Practice includes: Creative Writing, Text Chat. Voice Call. Instant Feedback',
    features: ['Creative Focus', 'Advanced Level']
  },
  {
    id: '5',
    name: 'Ella',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    level: 'Beginner',  
    description: 'Science Teacher. Practice includes: Text Chat, Voice Call. Instant Feedback',
    features: ['Education Focus', 'Science Topics']
  },
  {
    id: '6',
    name: 'Jeffrey',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face',
    level: 'Advanced',
    description: 'Senior Professional. Practice includes: Text Chat, Voice Call. Instant Feedback',
    features: ['Professional', 'Advanced Level']
  },
  {
    id: '7',
    name: 'Sofia',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    level: 'Intermediate',
    description: 'Travel Blogger. Practice includes: Text Chat, Voice Call. Instant Feedback',
    features: ['Travel Focus', 'Cultural Topics']
  },
  {
    id: '8',
    name: 'Oliver',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    level: 'Intermediate',
    description: 'Tech Startup Founder. Practice includes: Text Chat, Voice Call. Instant Feedback',
    features: ['Tech Focus', 'Startup Culture']
  },
  {
    id: '9',
    name: 'Fiona',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face',
    level: 'Advanced',
    description: 'Human Engineer. Practice includes: Test Chat, Voice Call. Instant Feedback',
    features: ['Technical Focus', 'Engineering']
  }
]

interface ChatMessage {
  id: string
  sender: 'ai' | 'user'
  message: string
  timestamp: Date
}

const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'ai',
    message: 'Hello! How are you doing today?',
    timestamp: new Date()
  },
  {
    id: '2', 
    sender: 'user',
    message: "I'm doing great, thanks! How about you?",
    timestamp: new Date()
  },
  {
    id: '3',
    sender: 'ai',
    message: "I'm doing well too, thank you. Ready for our language practice?",
    timestamp: new Date()
  },
  {
    id: '4',
    sender: 'user', 
    message: "Absolutely! Let's start with some basic greetings in Spanish.",
    timestamp: new Date()
  },
  {
    id: '5',
    sender: 'ai',
    message: "Perfect! How would you say 'Hello, how are you?' in Spanish?",
    timestamp: new Date()
  }
]

export default function AIPractice() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const characterId = searchParams.get('character')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedGoal, setSelectedGoal] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages)
  const [newMessage, setNewMessage] = useState('')

  const selectedCharacter = characterId ? mockCharacters.find(c => c.id === characterId) : null

  const filteredCharacters = mockCharacters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         character.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = !selectedLevel || character.level === selectedLevel
    const matchesLanguage = !selectedLanguage || true // All characters support all languages for now
    const matchesGoal = !selectedGoal || character.features.some(feature => 
      feature.toLowerCase().includes(selectedGoal.toLowerCase()) ||
      character.description.toLowerCase().includes(selectedGoal.toLowerCase())
    )
    return matchesSearch && matchesLevel && matchesLanguage && matchesGoal
  })

  const activeFiltersCount = [selectedLanguage, selectedLevel, selectedGoal].filter(Boolean).length

  const clearFilter = (type: 'language' | 'level' | 'goal') => {
    switch (type) {
      case 'language': setSelectedLanguage(''); break
      case 'level': setSelectedLevel(''); break 
      case 'goal': setSelectedGoal(''); break
    }
  }

  const clearAllFilters = () => {
    setSelectedLanguage('')
    setSelectedLevel('')
    setSelectedGoal('')
  }

  const recommendedCharacters = filteredCharacters.filter(c => ['1', '2'].includes(c.id))
  const allCharacters = filteredCharacters

  const handleCharacterSelect = (character: AICharacter) => {
    navigate(`/speaking/ai-practice?character=${character.id}`)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: newMessage,
      timestamp: new Date()
    }
    
    setChatMessages(prev => [...prev, userMessage])
    setNewMessage('')
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        message: "Great question! Let me help you with that...",
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  if (selectedCharacter) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b bg-card">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/speaking/ai-practice')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src={selectedCharacter.avatar} alt={selectedCharacter.name} />
            <AvatarFallback>{selectedCharacter.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">{selectedCharacter.name}</h2>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="flex items-start gap-2 max-w-[80%]">
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={selectedCharacter.avatar} alt={selectedCharacter.name} />
                    <AvatarFallback>{selectedCharacter.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div className="space-y-1">
                  {message.sender === 'ai' && (
                    <div className="text-xs text-muted-foreground">{selectedCharacter.name}</div>
                  )}
                  <div 
                    className={`rounded-2xl px-4 py-2 ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground ml-auto' 
                        : 'bg-muted'
                    }`}
                  >
                    {message.message}
                  </div>
                  {message.sender === 'user' && (
                    <div className="text-xs text-muted-foreground text-right">User</div>
                  )}
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Reaction Bar */}
        <div className="flex items-center justify-center gap-6 p-4 border-t border-b bg-card">
          <Button variant="ghost" size="sm" className="gap-2">
            <ThumbsUp className="h-4 w-4" />
            <span className="text-xs">2</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <ThumbsDown className="h-4 w-4" />
            <span className="text-xs">1</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Smile className="h-4 w-4" />
            <span className="text-xs">3</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="text-xs">1</span>
          </Button>
        </div>

        {/* Message Input */}
        <div className="p-4 bg-card">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Textarea
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="resize-none min-h-[44px] max-h-[120px]"
                rows={1}
              />
            </div>
            <Button variant="ghost" size="sm" className="p-2">
              <Mic className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Languages className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b bg-card space-y-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/speaking')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1>Practice with AI</h1>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for characters"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant={activeFiltersCount > 0 ? "default" : "outline"} 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs bg-white/20 text-white">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="space-y-4 p-4 bg-card rounded-lg border">
            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!selectedLanguage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLanguage('')}
                >
                  All Languages
                </Button>
                {['Spanish', 'French', 'German', 'Italian', 'Japanese', 'Chinese'].map((language) => (
                  <Button
                    key={language}
                    variant={selectedLanguage === language ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLanguage(language)}
                  >
                    {language}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Level</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!selectedLevel ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel('')}
                >
                  All Levels
                </Button>
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <Button
                    key={level}
                    variant={selectedLevel === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLevel(level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Goal</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!selectedGoal ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGoal('')}
                >
                  All Goals
                </Button>
                {['Business', 'Interview', 'Travel', 'Academic', 'Creative', 'Career', 'Professional'].map((goal) => (
                  <Button
                    key={goal}
                    variant={selectedGoal === goal ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedGoal(goal)}
                  >
                    {goal}
                  </Button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <div className="pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Active Filter Pills */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            
            {selectedLanguage && (
              <Badge variant="secondary" className="gap-1 pr-1">
                {selectedLanguage}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter('language')}
                  className="h-4 w-4 p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {selectedLevel && (
              <Badge variant="secondary" className="gap-1 pr-1">
                {selectedLevel}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter('level')}
                  className="h-4 w-4 p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {selectedGoal && (
              <Badge variant="secondary" className="gap-1 pr-1">
                {selectedGoal}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter('goal')}
                  className="h-4 w-4 p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Recommended Section */}
        {recommendedCharacters.length > 0 && (
          <div>
            <h2 className="mb-4">Recommended</h2>
            <div className="grid grid-cols-2 gap-3">
              {recommendedCharacters.map((character) => (
                <Card 
                  key={character.id} 
                  className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleCharacterSelect(character)}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={character.avatar} alt={character.name} />
                      <AvatarFallback>{character.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{character.name}</h3>
                      <p className="text-sm text-muted-foreground">{character.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Characters Section */}
        <div>
          <h2 className="mb-4">All Characters</h2>
          <div className="space-y-4">
            {allCharacters.map((character) => (
              <Card 
                key={character.id}
                className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => handleCharacterSelect(character)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={character.avatar} alt={character.name} />
                    <AvatarFallback>{character.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{character.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {character.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {character.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {character.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}