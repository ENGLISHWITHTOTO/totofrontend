import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Heart, MessageCircle, Share, Search, Languages } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from 'sonner'
import { useLanguage, SUPPORTED_LANGUAGES } from '../contexts/LanguageContext'
import exampleImagePlant from 'figma:asset/b0afacf61ddacc10de842dddfd845a88576bd510.png'

interface Post {
  id: string
  user: {
    name: string
    username: string
    avatar: string
    level: string
    verified?: boolean
  }
  time: string
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  hashtags: string[]
  language: string
}

const mockPosts: Post[] = [
  {
    id: '1',
    user: {
      name: 'Elena Ramirez',
      username: '@ElenaRamirez',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      level: 'Intermediate',
      verified: true
    },
    time: '2h',
    content: 'Just finished my Spanish lesson! Feeling confident and ready to practice more. #SpanishLearning',
    image: exampleImagePlant,
    likes: 23,
    comments: 5,
    shares: 2,
    isLiked: false,
    hashtags: ['SpanishLearning'],
    language: 'es'
  },
  {
    id: '2',
    user: {
      name: 'David Chen',
      username: '@DavidChen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      level: 'Advanced',
      verified: false
    },
    time: '4h',
    content: 'Anyone else struggling with French pronunciation? Any tips would be greatly appreciated! #FrenchLearning',
    image: 'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?w=400&h=300&fit=crop',
    likes: 18,
    comments: 3,
    shares: 1,
    isLiked: true,
    hashtags: ['FrenchLearning'],
    language: 'fr'
  },
  {
    id: '3',
    user: {
      name: 'Sophia Rossi',
      username: '@SophiaRossi',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      level: 'Beginner',
      verified: false
    },
    time: '6h',
    content: 'I\'m so excited! Just had my first conversation in Italian with a native speaker. It was challenging but so rewarding! #ItalianLearning',
    image: 'https://images.unsplash.com/photo-1523509343-da7c3d17f4c3?w=400&h=500&fit=crop',
    likes: 35,
    comments: 8,
    shares: 4,
    isLiked: false,
    hashtags: ['ItalianLearning'],
    language: 'it'
  },
  {
    id: '4',
    user: {
      name: 'Marcus Weber',
      username: '@MarcusWeber',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      level: 'Intermediate',
      verified: false
    },
    time: '8h',
    content: 'German grammar is tough, but I\'m making progress! Today I learned about the dative case. #GermanLearning',
    likes: 12,
    comments: 2,
    shares: 1,
    isLiked: false,
    hashtags: ['GermanLearning'],
    language: 'de'
  },
  {
    id: '5',
    user: {
      name: 'Yuki Tanaka',
      username: '@YukiTanaka',
      avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
      level: 'Advanced',
      verified: true
    },
    time: '10h',
    content: 'Today I read my first Japanese novel! It took me ages, but I understood most of it. #JapaneseLearning',
    image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=300&fit=crop',
    likes: 45,
    comments: 12,
    shares: 6,
    isLiked: true,
    hashtags: ['JapaneseLearning'],
    language: 'ja'
  },
  {
    id: '6',
    user: {
      name: 'Ana Silva',
      username: '@AnaSilva',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      level: 'Beginner',
      verified: false
    },
    time: '12h',
    content: 'Olá! Started learning Portuguese this week. Any tips for a beginner? #PortugueseLearning',
    likes: 8,
    comments: 4,
    shares: 0,
    isLiked: false,
    hashtags: ['PortugueseLearning'],
    language: 'pt'
  }
]

export default function MomentsFeed() {
  const navigate = useNavigate()
  const { currentLanguage } = useLanguage()
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [activeTab, setActiveTab] = useState<'trending' | 'recent' | 'following'>('trending')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        }
      }
      return post
    }))
  }

  const handleComment = (postId: string) => {
    navigate(`/moments/post/${postId}`)
  }

  const handleShare = (postId: string) => {
    toast.success('Post shared!')
  }

  const handleCreatePost = () => {
    navigate('/moments/create')
  }

  const filteredPosts = posts.filter(post => {
    // Filter by search query
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    // Filter by language
    const matchesLanguage = selectedLanguage === 'all' || post.language === selectedLanguage
    
    return matchesSearch && matchesLanguage
  })

  const trendingHashtags = [
    { tag: 'SpanishLearning', posts: '1.2k' },
    { tag: 'FrenchGrammar', posts: '856' },
    { tag: 'ItalianPractice', posts: '642' },
    { tag: 'StudyTips', posts: '1.5k' },
    { tag: 'LanguageExchange', posts: '923' }
  ]

  const suggestedUsers = [
    { name: 'Maria Santos', username: '@mariasantos', followers: '2.3k', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
    { name: 'Jean Pierre', username: '@jeanpierre', followers: '1.8k', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { name: 'Anna Mueller', username: '@annamueller', followers: '3.1k', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' }
  ]

  return (
    <div className="h-full flex bg-background">
      {/* Desktop: Main Feed */}
      <div className="flex-1 flex flex-col lg:max-w-2xl lg:mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border lg:px-6">
          <h1 className="text-xl font-semibold text-foreground">Moments</h1>
          <Button 
            onClick={handleCreatePost}
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline">Create Post</span>
          </Button>
        </div>

        {/* Search and Language Filter */}
        <div className="p-4 border-b border-border lg:px-6">
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts, users, hashtags..."
                className="pl-10 bg-input border-input"
              />
            </div>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full sm:w-48 bg-input border-input">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by language" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
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
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 py-2 border-b border-border lg:px-6">
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'trending'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Trending
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'recent'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Most recent
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'following'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Following
          </button>
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-y-auto">
          {filteredPosts.map((post) => (
            <div key={post.id} className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => handleComment(post.id)}>
              {/* User info */}
              <div className="flex items-center gap-3 p-4 pb-2 lg:px-6">
                <Avatar className="h-10 w-10 lg:h-12 lg:w-12">
                  <AvatarImage src={post.user.avatar} />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {post.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{post.user.name}</span>
                    <span className="text-sm text-muted-foreground">{post.time}</span>
                    {/* Language Badge */}
                    <Badge variant="secondary" className="text-xs">
                      {SUPPORTED_LANGUAGES.find(lang => lang.code === post.language)?.flag}
                      {SUPPORTED_LANGUAGES.find(lang => lang.code === post.language)?.name}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{post.user.username}</p>
                </div>
              </div>

              {/* Content */}
              <div className="px-4 pb-2 lg:px-6">
                <p className="text-foreground leading-relaxed">{post.content}</p>
              </div>

              {/* Image */}
              {post.image && (
                <div className="px-4 pb-3 lg:px-6">
                  <img 
                    src={post.image} 
                    alt="Post content"
                    className="w-full rounded-lg max-h-96 object-cover"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between px-4 py-3 lg:px-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Heart 
                      className={`h-5 w-5 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} 
                    />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button
                    onClick={() => handleComment(post.id)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                </div>
                <button
                  onClick={() => handleShare(post.id)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Share className="h-5 w-5" />
                  <span className="text-sm">{post.shares}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Right Sidebar */}
      <div className="hidden lg:block w-80 border-l border-border bg-card/30 p-6 overflow-y-auto">
        {/* Trending Hashtags */}
        <div className="mb-8">
          <h3 className="font-semibold text-foreground mb-4">Trending Hashtags</h3>
          <div className="space-y-3">
            {trendingHashtags.map((hashtag, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-foreground">#{hashtag.tag}</p>
                  <p className="text-sm text-muted-foreground">{hashtag.posts} posts</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Users */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Who to Follow</h3>
          <div className="space-y-4">
            {suggestedUsers.map((user, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.followers} followers</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs px-3">
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}