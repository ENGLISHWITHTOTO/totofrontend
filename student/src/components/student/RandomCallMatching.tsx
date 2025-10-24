import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Settings, 
  Star,
  Phone,
  Crown,
  Search,
  ChevronDown,
  Globe,
  Users,
  Shuffle,
  Zap
} from 'lucide-react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { toast } from 'sonner'
import exampleImage from 'figma:asset/5905d3b3fba72fd02ac8f3a342fd1855619dd447.png'

interface MatchProfile {
  id: string
  name: string
  avatar: string
  level: string
  rating: number
  country: string
  isOnline: boolean
  lastCallDuration: string
}

const mockMatches: MatchProfile[] = [
  {
    id: '1',
    name: 'Maria Santos',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    level: 'Intermediate',
    rating: 4.9,
    country: 'Brazil',
    isOnline: true,
    lastCallDuration: '15 min'
  },
  {
    id: '2',
    name: 'Ahmed Hassan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    level: 'Intermediate',
    rating: 4.7,
    country: 'Egypt',
    isOnline: true,
    lastCallDuration: '10 min'
  }
]

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Japanese', 'Korean', 'Chinese'
]

const partnerLevels = [
  { value: 'beginner', label: 'Beginner', description: 'A1-A2' },
  { value: 'intermediate', label: 'Intermediate', description: 'B1-B2' },
  { value: 'advanced', label: 'Advanced', description: 'C1-C2' }
]

const genderOptions = [
  { value: 'male', label: 'Male', icon: '♂' },
  { value: 'female', label: 'Female', icon: '♀' },
  { value: 'no-preference', label: 'No Preference', icon: '∞' }
]

const topics = [
  'Casual Chat', 'Travel', 'Exam Prep', 'Business', 'Culture Exchange', 'Hobbies'
]

const durations = [
  { value: '5', label: '5 min', description: 'Quick chat' },
  { value: '10', label: '10 min', description: 'Standard' },
  { value: '15', label: '15 min', description: 'Extended' },
  { value: 'unlimited', label: 'Unlimited', description: 'Open-ended' }
]

export default function RandomCallMatching() {
  const navigate = useNavigate()
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [selectedLevel, setSelectedLevel] = useState('intermediate')
  const [selectedGender, setSelectedGender] = useState('no-preference')
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Casual Chat', 'Travel'])
  const [selectedDuration, setSelectedDuration] = useState('10')
  const [isSearching, setIsSearching] = useState(false)

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    )
  }

  const handleStartSearch = () => {
    setIsSearching(true)
    toast.success('Starting search for language partner...')
    
    // Simulate search and redirect to actual call
    setTimeout(() => {
      toast.success('Found a match! Connecting...')
      setIsSearching(false)
      // Navigate to live call
      navigate('/speaking/random-call/live')
    }, 3000)
  }

  const handleCallMatch = (match: MatchProfile) => {
    toast.success(`Calling ${match.name}...`)
    // Navigate to live call with specific partner
    navigate('/speaking/random-call/live', { 
      state: { 
        partner: match 
      }
    })
  }

  if (isSearching) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-black">
        <div className="text-center space-y-6 max-w-sm">
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 rounded-full mx-auto flex items-center justify-center">
              <Search className="h-12 w-12 text-white animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          <div className="space-y-2 text-white">
            <h2 className="text-xl font-semibold">Searching for your perfect match...</h2>
            <p className="text-white/80">This may take a few moments</p>
          </div>

          <Button 
            variant="outline" 
            onClick={() => setIsSearching(false)}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Cancel Search
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/speaking')}
            className="p-2 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">Random Call</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">8 left</span>
          </div>
          <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-white/10">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Hero Section */}
          <div className="text-center space-y-4 text-white py-6">
            <div className="relative mx-auto w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl animate-pulse"></div>
              <div className="absolute inset-1 bg-black rounded-xl flex items-center justify-center">
                <div className="relative">
                  <Users className="h-8 w-8 text-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Find Your Perfect Match
              </h2>
              <p className="text-white/70 text-sm max-w-xs mx-auto leading-relaxed">
                Get instantly connected with native speakers and language learners worldwide
              </p>
            </div>
            <div className="flex items-center justify-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-xs text-white/60">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>1,247 online</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Zap className="h-3 w-3 text-yellow-400" />
                <span>~30s match</span>
              </div>
            </div>
          </div>

          {/* Practice Language */}
          <Card className="bg-gray-900/60 border-gray-700/50 hover:bg-gray-900/70 transition-colors">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">Practice Language</h3>
                  <p className="text-gray-400 text-sm">Choose which language you want to practice</p>
                </div>
              </div>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="bg-gray-800/70 border-gray-600/70 text-white h-12 rounded-xl hover:bg-gray-800/90 transition-colors">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Partner Level */}
          <Card className="bg-gray-900/60 border-gray-700/50 hover:bg-gray-900/70 transition-colors">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="flex flex-col items-center text-white">
                    <div className="w-3 h-1 bg-white rounded mb-0.5"></div>
                    <div className="w-2 h-1 bg-white/60 rounded mb-0.5"></div>
                    <div className="w-1 h-1 bg-white/30 rounded"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">Partner Level</h3>
                  <p className="text-gray-400 text-sm">Match with people of similar skill</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {partnerLevels.map((level) => (
                  <Button
                    key={level.value}
                    variant={selectedLevel === level.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLevel(level.value)}
                    className={`flex flex-col h-auto py-4 px-3 rounded-xl transition-all ${selectedLevel === level.value 
                      ? "bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-purple-500 shadow-lg" 
                      : "bg-gray-800/70 border-gray-600/70 text-white hover:bg-gray-700/80"
                    }`}
                  >
                    <span className="font-semibold text-xs">{level.label}</span>
                    <span className="text-xs opacity-80 mt-1">({level.description})</span>
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Gender Preference */}
          <Card className="bg-gray-900/60 border-gray-700/50 hover:bg-gray-900/70 transition-colors">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">Gender Preference</h3>
                  <p className="text-gray-400 text-sm">Choose your preference (optional)</p>
                </div>
              </div>
              <div className="space-y-3">
                {genderOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                      selectedGender === option.value 
                        ? 'bg-gray-800/80 border border-purple-500/50 shadow-lg' 
                        : 'bg-gray-800/40 hover:bg-gray-800/60 border border-transparent'
                    }`}
                    onClick={() => setSelectedGender(option.value)}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedGender === option.value 
                        ? 'border-purple-400 bg-purple-400' 
                        : 'border-gray-400'
                    }`}>
                      {selectedGender === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-white font-medium flex-1">{option.label}</span>
                    <span className="text-gray-400 text-xl">{option.icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Topic of Interest */}
          <Card className="bg-gray-900/60 border-gray-700/50 hover:bg-gray-900/70 transition-colors">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="flex gap-0.5 text-white">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">Topic of Interest</h3>
                  <p className="text-gray-400 text-sm">Select conversation themes</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {topics.map((topic) => (
                  <Button
                    key={topic}
                    variant={selectedTopics.includes(topic) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTopicToggle(topic)}
                    className={`text-xs py-3 px-4 rounded-xl transition-all ${selectedTopics.includes(topic)
                      ? "bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white border-orange-500 shadow-lg"
                      : "bg-gray-800/70 border-gray-600/70 text-white hover:bg-gray-700/80"
                    }`}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Session Duration */}
          <Card className="bg-gray-900/60 border-gray-700/50 hover:bg-gray-900/70 transition-colors">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="relative text-white">
                    <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                    <div className="absolute top-0.5 left-2 w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="absolute top-1.5 left-1.5 w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">Session Duration</h3>
                  <p className="text-gray-400 text-sm">Choose how long the chat should last</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {durations.map((duration) => (
                  <Button
                    key={duration.value}
                    variant={selectedDuration === duration.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDuration(duration.value)}
                    className={`flex flex-col h-auto py-4 px-3 rounded-xl transition-all ${
                      selectedDuration === duration.value
                        ? "bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-purple-500 shadow-lg"
                        : "bg-gray-800/70 border-gray-600/70 text-white hover:bg-gray-700/80"
                    }`}
                  >
                    <span className="font-semibold text-xs">{duration.label}</span>
                    <span className="text-xs opacity-80 mt-1">{duration.description}</span>
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Recent Matches */}
          <Card className="bg-gray-900/60 border-gray-700/50 hover:bg-gray-900/70 transition-colors">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Recent Matches</h3>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white text-xs hover:bg-gray-800/50 rounded-lg">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {mockMatches.map((match) => (
                  <div key={match.id} className="flex items-center gap-4 p-3 bg-gray-800/40 rounded-xl hover:bg-gray-800/60 transition-colors">
                    <div className="relative">
                      <Avatar className="h-12 w-12 border-2 border-gray-600">
                        <AvatarImage src={match.avatar} />
                        <AvatarFallback className="bg-gray-600 text-white font-semibold">
                          {match.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {match.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-semibold text-sm truncate">{match.name}</p>
                        <Badge variant="secondary" className="text-xs bg-gray-700/50 text-gray-300 border-0">
                          {match.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>{match.lastCallDuration} call</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span>{match.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleCallMatch(match)}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-10 w-10 p-0 rounded-xl shadow-lg"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Your Stats */}
          <Card className="bg-gray-900/60 border-gray-700/50 hover:bg-gray-900/70 transition-colors">
            <div className="p-5">
              <h3 className="text-white font-semibold mb-4">Your Stats</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl mx-auto mb-2 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">47</div>
                  <div className="text-gray-400 text-xs">Total Calls</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl mx-auto mb-2 flex items-center justify-center">
                    <Star className="h-6 w-6 text-white fill-current" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">4.8</div>
                  <div className="text-gray-400 text-xs">Avg Rating</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mx-auto mb-2 flex items-center justify-center">
                    <div className="relative text-white">
                      <div className="w-5 h-5 border-2 border-white rounded-full"></div>
                      <div className="absolute top-1 left-2 w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">12h</div>
                  <div className="text-gray-400 text-xs">Practice Time</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Go Premium */}
          <Card className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 border-0 shadow-lg">
            <div className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Crown className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">Go Premium</h3>
                <p className="text-white/90 text-sm leading-relaxed">Skip filters, priority matches, and unlimited features</p>
              </div>
              <Button 
                size="sm" 
                className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Upgrade
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-6 space-y-4 bg-gradient-to-t from-black via-gray-900/20 to-transparent">        
        {/* Start Searching Button */}
        <Button 
          onClick={handleStartSearch}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-14 font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
          size="lg"
        >
          <Shuffle className="h-6 w-6 mr-3" />
          Start Searching
        </Button>
        
        {/* Status Info */}
        <div className="flex items-center justify-center gap-8 text-white/70 text-sm bg-gray-900/40 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>1,247 online</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span>~30s wait time</span>
          </div>
        </div>
      </div>
    </div>
  )
}