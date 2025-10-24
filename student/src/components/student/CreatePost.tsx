import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Type, Image, Video, Mic, Languages } from 'lucide-react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from 'sonner'
import { useLanguage, SUPPORTED_LANGUAGES, Language } from '../contexts/LanguageContext'

interface HashtagOption {
  id: string
  name: string
  posts: number
}

const suggestedHashtags: HashtagOption[] = [
  { id: '1', name: 'languagelearning', posts: 12500 },
  { id: '2', name: 'studygram', posts: 8900 },
  { id: '3', name: 'motivation', posts: 6200 }
]

type PrivacySetting = 'public' | 'friends' | 'private'

export default function CreatePost() {
  const navigate = useNavigate()
  const { currentLanguage } = useLanguage()
  const [content, setContent] = useState('')
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([])
  const [privacy, setPrivacy] = useState<PrivacySetting>('public')
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(currentLanguage)
  const [isPosting, setIsPosting] = useState(false)

  const currentUser = {
    name: 'You',
    username: '@You',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
  }

  const handleHashtagToggle = (hashtag: string) => {
    setSelectedHashtags(prev => 
      prev.includes(hashtag) 
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    )
  }

  const handlePost = async () => {
    if (!content.trim()) {
      toast.error('Please write something to share!')
      return
    }

    setIsPosting(true)
    
    // Simulate API call with language data
    const postData = {
      content,
      hashtags: selectedHashtags,
      privacy,
      language: selectedLanguage.code
    }
    
    console.log('Creating post with data:', postData)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success(`Post shared successfully in ${selectedLanguage.name}!`)
    setIsPosting(false)
    navigate('/moments')
  }

  const handleCancel = () => {
    if (content.trim() || selectedHashtags.length > 0) {
      if (window.confirm('Are you sure you want to discard this post?')) {
        navigate('/moments')
      }
    } else {
      navigate('/moments')
    }
  }

  const characterCount = content.length
  const maxCharacters = 280

  return (
    <div className="h-full flex bg-background">
      {/* Desktop: Main Create Area */}
      <div className="flex-1 flex flex-col lg:max-w-2xl lg:mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="p-2"
            >
              <X className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Create Post</h1>
          </div>
          <Button
            onClick={handlePost}
            disabled={!content.trim() || isPosting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
          >
            {isPosting ? 'Posting...' : 'Post'}
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:px-6">
            {/* User Info */}
            <div className="flex gap-3 mb-6">
              <Avatar className="h-12 w-12 lg:h-14 lg:w-14">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{currentUser.name}</h3>
                <p className="text-sm text-muted-foreground">{currentUser.username}</p>
              </div>
            </div>

            {/* Text Input */}
            <div className="mb-8">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts or progress..."
                className="min-h-[120px] lg:min-h-[160px] text-lg border-0 resize-none focus:ring-0 p-0 bg-transparent"
                maxLength={maxCharacters}
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Type className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Image className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Mic className="h-5 w-5" />
                  </Button>
                </div>
                <div className={`text-sm ${
                  characterCount > maxCharacters * 0.8 
                    ? characterCount >= maxCharacters 
                      ? 'text-destructive' 
                      : 'text-yellow-500'
                    : 'text-muted-foreground'
                }`}>
                  {characterCount}/{maxCharacters}
                </div>
              </div>
            </div>

            {/* Add Hashtags */}
            <div className="mb-8">
              <h3 className="font-semibold text-foreground mb-4">Add Hashtags</h3>
              <div className="flex flex-wrap gap-2">
                {suggestedHashtags.map((hashtag) => (
                  <Button
                    key={hashtag.id}
                    variant={selectedHashtags.includes(hashtag.name) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleHashtagToggle(hashtag.name)}
                    className="text-sm"
                  >
                    #{hashtag.name}
                  </Button>
                ))}
              </div>
              {selectedHashtags.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Selected hashtags:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedHashtags.map((hashtag) => (
                      <Badge key={hashtag} variant="secondary" className="text-xs">
                        #{hashtag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Selection */}
            <div className="mb-8">
              <h3 className="font-semibold text-foreground mb-4">Post Language</h3>
              <Select 
                value={selectedLanguage.code} 
                onValueChange={(value) => {
                  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === value)
                  if (language) setSelectedLanguage(language)
                }}
              >
                <SelectTrigger className="w-full bg-input border-input">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select language" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      <div className="flex items-center gap-2">
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-2">
                This post will be categorized under {selectedLanguage.name} learning content.
              </p>
            </div>

            {/* Privacy Settings */}
            <div className="mb-8">
              <h3 className="font-semibold text-foreground mb-4">Privacy</h3>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={privacy === 'public' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPrivacy('public')}
                  className="flex-1"
                >
                  Public
                </Button>
                <Button
                  variant={privacy === 'friends' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPrivacy('friends')}
                  className="flex-1"
                >
                  Friends Only
                </Button>
                <Button
                  variant={privacy === 'private' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPrivacy('private')}
                  className="flex-1"
                >
                  Private
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {privacy === 'public' && 'Anyone can see this post'}
                {privacy === 'friends' && 'Only your friends can see this post'}
                {privacy === 'private' && 'Only you can see this post'}
              </p>
            </div>

            {/* Post Preview */}
            {content.trim() && (
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-4">Preview</h3>
                <div className="border border-border rounded-lg p-4 bg-card">
                  <div className="flex gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        {currentUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{currentUser.name}</h4>
                        <p className="text-sm text-muted-foreground">now</p>
                        <Badge variant="secondary" className="text-xs">
                          {selectedLanguage.flag} {selectedLanguage.name}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-foreground mb-3">{content}</p>
                  {selectedHashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {selectedHashtags.map((hashtag) => (
                        <span key={hashtag} className="text-primary text-sm">
                          #{hashtag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span className="text-sm">0 likes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">0 comments</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">0 shares</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop: Right Sidebar - Tips & Guidelines */}
        <div className="hidden lg:block w-80 border-l border-border bg-card/30 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Post Tips */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Tips for Great Posts</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                  <p className="text-sm font-medium text-foreground mb-1">Share Your Progress</p>
                  <p className="text-xs text-muted-foreground">Let others know about your learning milestones and achievements.</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                  <p className="text-sm font-medium text-foreground mb-1">Use Hashtags</p>
                  <p className="text-xs text-muted-foreground">Add relevant hashtags to help others discover your content.</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                  <p className="text-sm font-medium text-foreground mb-1">Ask Questions</p>
                  <p className="text-xs text-muted-foreground">Engage with the community by asking for help or advice.</p>
                </div>
              </div>
            </div>

            {/* Community Guidelines */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Community Guidelines</h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>• Be respectful and supportive</p>
                <p>• Share authentic learning experiences</p>
                <p>• Help others in their language journey</p>
                <p>• Keep content appropriate and educational</p>
                <p>• Use clear and constructive feedback</p>
              </div>
            </div>

            {/* Trending Topics */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Trending Today</h3>
              <div className="space-y-2">
                {['#SpanishGrammar', '#PronunciationTips', '#StudyMotivation', '#LanguageExchange'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleHashtagToggle(tag.slice(1))}
                    className="block text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}