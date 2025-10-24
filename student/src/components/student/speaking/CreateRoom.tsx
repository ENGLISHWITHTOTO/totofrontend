import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  Globe,
  Lock,
  Unlock,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Plus,
  X
} from 'lucide-react'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Switch } from '../../ui/switch'
import { Label } from '../../ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { useLanguage } from '../../contexts/LanguageContext'

const topics = [
  { value: 'daily-conversation', label: 'Daily Conversation', emoji: '💬' },
  { value: 'business', label: 'Business', emoji: '💼' },
  { value: 'travel', label: 'Travel & Culture', emoji: '✈️' },
  { value: 'technology', label: 'Technology', emoji: '💻' },
  { value: 'food', label: 'Food & Cooking', emoji: '🍳' },
  { value: 'hobbies', label: 'Hobbies', emoji: '🎨' },
  { value: 'sports', label: 'Sports', emoji: '⚽' },
  { value: 'music', label: 'Music', emoji: '🎵' },
  { value: 'movies', label: 'Movies & TV', emoji: '🎬' },
  { value: 'books', label: 'Books & Literature', emoji: '📚' },
  { value: 'news', label: 'Current Events', emoji: '📰' },
  { value: 'education', label: 'Education', emoji: '🎓' }
]

const levels = [
  { value: 'beginner', label: 'Beginner', color: 'bg-green-500' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-500' },
  { value: 'advanced', label: 'Advanced', color: 'bg-red-500' },
  { value: 'mixed', label: 'Mixed Levels', color: 'bg-blue-500' }
]

const roomTypes = [
  { 
    value: 'open-discussion', 
    label: 'Open Discussion', 
    description: 'Free-flowing conversation',
    icon: Users 
  },
  { 
    value: 'structured-practice', 
    label: 'Structured Practice', 
    description: 'Guided exercises and activities',
    icon: Clock 
  },
  { 
    value: 'pronunciation', 
    label: 'Pronunciation Focus', 
    description: 'Focus on accent and pronunciation',
    icon: Mic 
  },
  { 
    value: 'debate', 
    label: 'Debate & Discussion', 
    description: 'Structured debates on topics',
    icon: Globe 
  }
]

export default function CreateRoom() {
  const navigate = useNavigate()
  const { currentLanguage } = useLanguage()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topic: '',
    level: '',
    roomType: '',
    maxParticipants: '10',
    isPrivate: false,
    requiresApproval: false,
    allowChat: true,
    allowVideo: true,
    scheduledTime: '',
    tags: [] as string[]
  })
  
  const [newTag, setNewTag] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }
  
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }
  
  const handleCreateRoom = async () => {
    setIsCreating(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate a mock room ID and navigate to the preview
    const mockRoomId = `room_${Date.now()}`
    navigate(`/speaking/voice-rooms/${mockRoomId}/preview`)
  }
  
  const isFormValid = formData.title && formData.topic && formData.level && formData.roomType
  
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
          <h1 className="font-semibold">Create Room</h1>
          <div className="w-9" />
        </div>
      </div>
      
      <div className="p-4 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Room Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Room Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {roomTypes.map((type) => {
                const Icon = type.icon
                return (
                  <div
                    key={type.value}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.roomType === type.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-border/80'
                    }`}
                    onClick={() => handleInputChange('roomType', type.value)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        formData.roomType === type.value ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{type.label}</h3>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
          
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Room Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter room title..."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this room is about..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-1 min-h-[80px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="topic">Topic *</Label>
                  <Select value={formData.topic} onValueChange={(value) => handleInputChange('topic', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic.value} value={topic.value}>
                          <div className="flex items-center gap-2">
                            <span>{topic.emoji}</span>
                            {topic.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="level">Level *</Label>
                  <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${level.color}`} />
                            {level.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Select value={formData.maxParticipants} onValueChange={(value) => handleInputChange('maxParticipants', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 participants</SelectItem>
                    <SelectItem value="10">10 participants</SelectItem>
                    <SelectItem value="15">15 participants</SelectItem>
                    <SelectItem value="20">20 participants</SelectItem>
                    <SelectItem value="30">30 participants</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1"
                />
                <Button onClick={addTag} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(tag)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Room Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Room Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {formData.isPrivate ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                  <div>
                    <Label>Private Room</Label>
                    <p className="text-sm text-muted-foreground">Only invited users can join</p>
                  </div>
                </div>
                <Switch
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) => handleInputChange('isPrivate', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5" />
                  <div>
                    <Label>Require Approval</Label>
                    <p className="text-sm text-muted-foreground">Manually approve join requests</p>
                  </div>
                </div>
                <Switch
                  checked={formData.requiresApproval}
                  onCheckedChange={(checked) => handleInputChange('requiresApproval', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {formData.allowVideo ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
                  <div>
                    <Label>Allow Video</Label>
                    <p className="text-sm text-muted-foreground">Participants can use video</p>
                  </div>
                </div>
                <Switch
                  checked={formData.allowVideo}
                  onCheckedChange={(checked) => handleInputChange('allowVideo', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {formData.allowChat ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  <div>
                    <Label>Allow Chat</Label>
                    <p className="text-sm text-muted-foreground">Enable text chat during room</p>
                  </div>
                </div>
                <Switch
                  checked={formData.allowChat}
                  onCheckedChange={(checked) => handleInputChange('allowChat', checked)}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Create Button */}
          <div className="flex gap-3 pt-6">
            <Button
              variant="outline"
              onClick={() => navigate('/speaking/voice-rooms/browse')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateRoom}
              disabled={!isFormValid || isCreating}
              className="flex-1 gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating Room...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Room
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}