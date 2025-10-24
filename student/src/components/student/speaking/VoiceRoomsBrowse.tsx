import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  ArrowLeft, 
  Users, 
  Clock, 
  Mic, 
  MicOff,
  Volume2,
  Star,
  Filter,
  SlidersHorizontal,
  TrendingUp,
  PlayCircle,
  Plus,
  X,
  ChevronDown
} from 'lucide-react'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { Card, CardContent } from '../../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Input } from '../../ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { useLanguage } from '../../contexts/LanguageContext'

const levels = [
  { value: 'A1', label: 'A1 - Beginner', color: 'bg-green-500' },
  { value: 'A2', label: 'A2 - Elementary', color: 'bg-green-600' },
  { value: 'B1', label: 'B1 - Intermediate', color: 'bg-yellow-500' },
  { value: 'B2', label: 'B2 - Upper Intermediate', color: 'bg-orange-500' },
  { value: 'C1', label: 'C1 - Advanced', color: 'bg-red-500' },
  { value: 'C2', label: 'C2 - Proficient', color: 'bg-purple-500' },
]

const topics = [
  { value: 'general', label: 'General Chat', emoji: '💬' },
  { value: 'ielts', label: 'IELTS Practice', emoji: '📚' },
  { value: 'business', label: 'Business English', emoji: '💼' },
  { value: 'travel', label: 'Travel Stories', emoji: '✈️' },
  { value: 'academic', label: 'Academic Discussion', emoji: '🎓' },
  { value: 'interview', label: 'Interview Prep', emoji: '🎯' },
  { value: 'culture', label: 'Culture Exchange', emoji: '🌍' },
  { value: 'technology', label: 'Tech Talk', emoji: '💻' },
]

const mockRooms = [
  {
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
      isVerified: true
    },
    currentSpeakers: 4,
    raisedHands: 2,
    description: 'Share your amazing travel stories and learn from others experiences around the world',
    tags: ['Beginner Friendly', 'Interactive', 'Stories'],
    backgroundImage: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBuZXR3b3JraW5nJTIwY29uZmVyZW5jZSUyMG1lZXRpbmd8ZW58MXx8fHwxNzU4NjM0Njc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    startedAt: '2 hours ago'
  },
  {
    id: 'room-2',
    title: 'IELTS Speaking Masterclass',
    subtitle: 'Part 2: Describe & Explain',
    level: 'B2',
    topic: 'ielts',
    isLive: true,
    participants: 18,
    maxParticipants: 20,
    duration: '60 min',
    moderator: {
      name: 'James Wilson',
      avatar: '',
      level: 'Expert',
      isVerified: true
    },
    currentSpeakers: 3,
    raisedHands: 5,
    description: 'Master IELTS Speaking Part 2 with expert guidance and practice with real exam topics',
    tags: ['IELTS', 'Expert Led', 'Practice'],
    backgroundImage: 'https://images.unsplash.com/photo-1621881319212-233c7a0e259c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2RjYXN0JTIwbWljcm9waG9uZSUyMGF1ZGlvJTIwc3R1ZGlvfGVufDF8fHx8MTc1ODYzNDY3MHww&ixlib=rb-4.1.0&q=80&w=1080',
    startedAt: '30 min ago'
  },
  {
    id: 'room-3',
    title: 'Business English Coffee Chat',
    subtitle: 'Networking & Professional Skills',
    level: 'C1',
    topic: 'business',
    isLive: true,
    participants: 12,
    maxParticipants: 15,
    duration: '90 min',
    moderator: {
      name: 'Emma Davis',
      avatar: '',
      level: 'Professional',
      isVerified: true
    },
    currentSpeakers: 2,
    raisedHands: 0,
    description: 'Network with professionals and practice business conversations in a casual setting',
    tags: ['Networking', 'Professional', 'Coffee Chat'],
    backgroundImage: 'https://images.unsplash.com/photo-1746021451691-4385f318ec13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBkaXNjdXNzaW9uJTIwd29ya3NwYWNlfGVufDF8fHx8MTc1ODYzNDY4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    startedAt: '15 min ago'
  },
  {
    id: 'room-4',
    title: 'Tech Talk Tuesday',
    subtitle: 'AI & Future of Learning',
    level: 'B2',
    topic: 'technology',
    isLive: false,
    participants: 0,
    maxParticipants: 25,
    duration: '60 min',
    scheduledFor: 'Starts in 2 hours',
    moderator: {
      name: 'Alex Kim',
      avatar: '',
      level: 'Tech Expert',
      isVerified: true
    },
    description: 'Discuss the latest in AI technology and how it\'s changing language learning',
    tags: ['Future Tech', 'AI', 'Discussion'],
    backgroundImage: 'https://images.unsplash.com/photo-1621881319212-233c7a0e259c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2RjYXN0JTIwbWljcm9waG9uZSUyMGF1ZGlvJTIwc3R1ZGlvfGVufDF8fHx8MTc1ODYzNDY3MHww&ixlib=rb-4.1.0&q=80&w=1080'
  }
]

export default function VoiceRoomsBrowse() {
  const navigate = useNavigate()
  const { currentLanguage } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('')
  const [selectedTopic, setSelectedTopic] = useState<string>('')
  const [showLiveOnly, setShowLiveOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filteredRooms = mockRooms.filter(room => {
    const matchesSearch = !searchQuery || 
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesLevel = !selectedLevel || room.level === selectedLevel
    const matchesTopic = !selectedTopic || room.topic === selectedTopic
    const matchesLive = !showLiveOnly || room.isLive
    
    return matchesSearch && matchesLevel && matchesTopic && matchesLive
  })

  const activeFiltersCount = [selectedLevel, selectedTopic, showLiveOnly].filter(Boolean).length

  const clearFilter = (filterType: 'level' | 'topic' | 'live') => {
    switch (filterType) {
      case 'level':
        setSelectedLevel('')
        break
      case 'topic':
        setSelectedTopic('')
        break
      case 'live':
        setShowLiveOnly(false)
        break
    }
  }

  const clearAllFilters = () => {
    setSelectedLevel('')
    setSelectedTopic('')
    setShowLiveOnly(false)
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/speaking')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">Voice Rooms</h1>
          <Button 
            size="sm" 
            className="gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            onClick={() => navigate('/speaking/voice-rooms/create')}
          >
            <Plus className="h-4 w-4" />
            Create
          </Button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block p-6 pb-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Voice Rooms</h1>
              <p className="text-muted-foreground">Join live conversations and practice {currentLanguage.name} with speakers worldwide</p>
            </div>
            <Button 
              size="lg" 
              className="gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 h-12 px-6"
              onClick={() => navigate('/speaking/voice-rooms/create')}
            >
              <Plus className="h-5 w-5" />
              Create Room
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-4 lg:p-6 lg:pt-4">
          <div className="lg:max-w-6xl lg:mx-auto space-y-4">
            {/* Search and Filter Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rooms, topics, or moderators..."
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
                  <label className="text-sm font-medium mb-2 block">Room Status</label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={!showLiveOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowLiveOnly(false)}
                    >
                      All Rooms
                    </Button>
                    <Button
                      variant={showLiveOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowLiveOnly(true)}
                      className="gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Live Only
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Language Level</label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={!selectedLevel ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedLevel('')}
                    >
                      All Levels
                    </Button>
                    {levels.map((level) => (
                      <Button
                        key={level.value}
                        variant={selectedLevel === level.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedLevel(level.value)}
                        className="gap-2"
                      >
                        <div className={`w-2 h-2 rounded-full ${level.color}`} />
                        {level.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Topic</label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={!selectedTopic ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTopic('')}
                    >
                      All Topics
                    </Button>
                    {topics.map((topic) => (
                      <Button
                        key={topic.value}
                        variant={selectedTopic === topic.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTopic(topic.value)}
                        className="gap-2"
                      >
                        <span>{topic.emoji}</span>
                        {topic.label}
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
                
                {showLiveOnly && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    Live Now
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearFilter('live')}
                      className="h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {selectedLevel && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    <div className={`w-2 h-2 rounded-full ${levels.find(l => l.value === selectedLevel)?.color}`} />
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
                
                {selectedTopic && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    <span>{topics.find(t => t.value === selectedTopic)?.emoji}</span>
                    {topics.find(t => t.value === selectedTopic)?.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearFilter('topic')}
                      className="h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <div className="p-4 lg:p-6">
        <div className="lg:max-w-6xl lg:mx-auto">
          {filteredRooms.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full" />
                <div className="absolute inset-2 bg-gradient-to-br from-purple-500/40 to-blue-500/40 rounded-full" />
                <div className="absolute inset-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Mic className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">No rooms found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {activeFiltersCount > 0 
                  ? "Try adjusting your filters or search terms to find more rooms"
                  : "No voice rooms are currently available. Why not create your own?"
                }
              </p>
              <div className="flex gap-3 justify-center">
                {activeFiltersCount > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={clearAllFilters}
                  >
                    Clear all filters
                  </Button>
                )}
                <Button 
                  className="gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  onClick={() => navigate('/speaking/voice-rooms/create')}
                >
                  <Plus className="h-4 w-4" />
                  Create Room
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <Card 
                  key={room.id} 
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
                  onClick={() => navigate(`/speaking/voice-rooms/${room.id}/preview`)}
                >
                  <div className="relative">
                    <div 
                      className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${room.backgroundImage})` }}
                    >
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        {room.isLive ? (
                          <Badge className="bg-red-500 text-white gap-2 animate-pulse">
                            <div className="w-2 h-2 bg-white rounded-full" />
                            LIVE
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-black/40 text-white border-white/20">
                            <Clock className="h-3 w-3 mr-1" />
                            {room.scheduledFor}
                          </Badge>
                        )}
                      </div>

                      {/* Level Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge 
                          variant="secondary" 
                          className={`${levels.find(l => l.value === room.level)?.color} text-white border-none`}
                        >
                          {room.level}
                        </Badge>
                      </div>

                      {/* Room Info Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="font-bold text-lg mb-1 line-clamp-1">
                          {room.title}
                        </h3>
                        <p className="text-white/90 text-sm mb-2 line-clamp-1">
                          {room.subtitle}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {room.isLive ? room.participants : '0'}
                            </div>
                            {room.isLive && (
                              <>
                                <div className="flex items-center gap-1">
                                  <Mic className="h-3 w-3" />
                                  {room.currentSpeakers}
                                </div>
                                {room.raisedHands > 0 && (
                                  <div className="flex items-center gap-1">
                                    <span>🖐️</span>
                                    {room.raisedHands}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Avatar className="h-6 w-6 border border-white/20">
                              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                {room.moderator.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {room.moderator.isVerified && (
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {room.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs text-muted-foreground">
                        {room.isLive ? `Started ${room.startedAt}` : `Duration: ${room.duration}`}
                      </div>
                      <div className="text-xs font-medium">
                        by {room.moderator.name}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {room.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button 
                      className="w-full gap-2 group-hover:scale-105 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (room.isLive) {
                          navigate(`/speaking/voice-rooms/${room.id}/preview`)
                        } else {
                          // Handle scheduled room
                          navigate(`/speaking/voice-rooms/${room.id}/preview`)
                        }
                      }}
                    >
                      {room.isLive ? (
                        <>
                          <Volume2 className="h-4 w-4" />
                          Join Room
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-4 w-4" />
                          Set Reminder
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Button 
          size="lg" 
          className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover:scale-110 transition-all duration-200"
          onClick={() => navigate('/speaking/voice-rooms/create')}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}