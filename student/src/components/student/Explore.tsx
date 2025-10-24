import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Grid3X3, 
  ShoppingBag, 
  UserSearch, 
  GraduationCap, 
  Camera, 
  Mic, 
  MessageCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  BookOpen,
  Target,
  BarChart3
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { cn } from '../ui/utils'

const exploreItems = [
  {
    id: 'categories',
    title: 'Categories',
    description: 'Browse lessons by topic and level',
    icon: Grid3X3,
    path: '/categories',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    stats: '2.1k lessons'
  },
  {
    id: 'market',
    title: 'Market',
    description: 'Premium courses and materials',
    icon: ShoppingBag,
    path: '/market',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    stats: '850+ courses'
  },
  {
    id: 'teachers',
    title: 'Find Teachers',
    description: 'Connect with native speakers',
    icon: UserSearch,
    path: '/teachers',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
    stats: '1.5k teachers'
  },
  {
    id: 'study-abroad',
    title: 'Study Abroad',
    description: 'Immersive language programs',
    icon: GraduationCap,
    path: '/study-abroad',
    color: 'from-orange-500 to-red-500',
    bgColor: 'from-orange-500/20 to-red-500/20',
    borderColor: 'border-orange-500/30',
    stats: '120+ programs'
  },
  {
    id: 'moments',
    title: 'Moments',
    description: 'Community posts and progress',
    icon: Camera,
    path: '/moments',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'from-pink-500/20 to-rose-500/20',
    borderColor: 'border-pink-500/30',
    stats: '10k+ posts'
  },
  {
    id: 'speaking',
    title: 'Speaking Practice',
    description: 'Voice rooms and AI practice',
    icon: Mic,
    path: '/speaking',
    color: 'from-violet-500 to-purple-500',
    bgColor: 'from-violet-500/20 to-purple-500/20',
    borderColor: 'border-violet-500/30',
    stats: '24/7 practice'
  }
]

const trendingTopics = [
  { name: 'Spanish Grammar', posts: '1.2k', trending: true },
  { name: 'Business English', posts: '890', trending: true },
  { name: 'Japanese Kanji', posts: '756', trending: false },
  { name: 'French Pronunciation', posts: '634', trending: true },
  { name: 'Italian Conversation', posts: '523', trending: false }
]

const navigationTabs = [
  { id: 'discover', label: 'Discover', icon: BookOpen },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'challenges', label: 'Challenges', icon: Target },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 }
]

const featuredContent = [
  {
    title: 'Weekly Challenge',
    description: 'Complete 10 speaking exercises',
    progress: 60,
    icon: Sparkles,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    title: 'Community Goal',
    description: '50k lessons completed this week',
    progress: 85,
    icon: Users,
    color: 'from-green-500 to-emerald-500'
  }
]

const challengeData = [
  {
    title: 'Daily Streak Master',
    description: 'Maintain a 30-day learning streak',
    progress: 23,
    target: 30,
    reward: '500 XP + Badge',
    icon: Sparkles,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    title: 'Speaking Champion',
    description: 'Complete 100 speaking exercises this month',
    progress: 67,
    target: 100,
    reward: 'Premium Feature Access',
    icon: Mic,
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Community Helper',
    description: 'Help 10 learners in community posts',
    progress: 4,
    target: 10,
    reward: 'Mentor Badge',
    icon: Users,
    color: 'from-blue-500 to-cyan-500'
  }
]

const analyticsData = [
  {
    title: 'Weekly Progress',
    value: '87%',
    change: '+12%',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Study Time',
    value: '24h 32m',
    change: '+5h 12m',
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Accuracy Rate',
    value: '94.2%',
    change: '+2.1%',
    icon: Target,
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Streak Days',
    value: '7 days',
    change: '+7 days',
    icon: Sparkles,
    color: 'from-yellow-500 to-orange-500'
  }
]

export default function Explore() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('discover')

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Explore
          </h1>
          <p className="text-muted-foreground">Discover new ways to learn and practice languages</p>
        </div>

        {/* Navigation Menu - Enhanced contrast */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 p-2 bg-[#141418] rounded-xl border border-[#2a2a2f] shadow-lg">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 h-11 px-5 rounded-lg transition-all font-medium",
                    isActive 
                      ? 'bg-gradient-to-r from-primary/25 to-accent/25 text-primary border border-primary/40 shadow-lg shadow-primary/20 bg-[#1f1f24]' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-[#1f1f24] border border-transparent hover:border-border/50'
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                  <span>{tab.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'discover' && (
          <>
            {/* Featured Content - Enhanced contrast */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Featured
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredContent.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <Card key={index} className="border-[#2a2a2f] bg-[#0f0f11] shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color}/20 border ${item.color.split(' ')[0].replace('from-', 'border-')}/30 shadow-inner`}>
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                            <CardDescription className="text-muted-foreground">{item.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 bg-[#1e1e23] rounded-full h-3 mr-4 shadow-inner">
                            <div 
                              className={`h-3 rounded-full bg-gradient-to-r ${item.color} shadow-sm`}
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-base font-semibold text-foreground">{item.progress}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Main Features Grid - Enhanced contrast */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Learning Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exploreItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Card 
                      key={item.id} 
                      className="group cursor-pointer border-[#2a2a2f] hover:border-primary/60 transition-all duration-300 bg-[#0f0f11] hover:bg-[#141418] shadow-lg hover:shadow-xl hover:shadow-primary/15 hover:-translate-y-1"
                      onClick={() => navigate(item.path)}
                    >
                      <CardHeader className="pb-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-4 rounded-xl bg-gradient-to-r ${item.bgColor} border ${item.borderColor} shadow-inner`}>
                            <Icon className="h-7 w-7 text-primary" />
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs bg-[#1e1e23] border-[#2a2a2f] font-medium">
                            {item.stats}
                          </Badge>
                          <div className="text-xs text-muted-foreground group-hover:text-primary/80 transition-colors font-medium">
                            Explore →
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions - Enhanced contrast */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-24 flex-col gap-3 bg-[#0f0f11] border-[#2a2a2f] hover:border-primary/60 hover:bg-[#141418] transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                  onClick={() => navigate('/chat')}
                >
                  <MessageCircle className="h-7 w-7 text-primary" />
                  <span className="text-sm font-medium">AI Chat</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex-col gap-3 bg-[#0f0f11] border-[#2a2a2f] hover:border-primary/60 hover:bg-[#141418] transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                  onClick={() => navigate('/speaking/random')}
                >
                  <Users className="h-7 w-7 text-primary" />
                  <span className="text-sm font-medium">Random Match</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex-col gap-3 bg-[#0f0f11] border-[#2a2a2f] hover:border-primary/60 hover:bg-[#141418] transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                  onClick={() => navigate('/flashcards')}
                >
                  <BookOpen className="h-7 w-7 text-primary" />
                  <span className="text-sm font-medium">Flashcards</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex-col gap-3 bg-[#0f0f11] border-[#2a2a2f] hover:border-primary/60 hover:bg-[#141418] transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                  onClick={() => navigate('/writing')}
                >
                  <Sparkles className="h-7 w-7 text-primary" />
                  <span className="text-sm font-medium">AI Writing</span>
                </Button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'trending' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Trending Topics
            </h2>
            <Card className="border-[#2a2a2f] bg-[#0f0f11] shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-[#141418] hover:bg-[#1f1f24] transition-all duration-300 cursor-pointer border border-[#2a2a2f] hover:border-primary/40 hover:shadow-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">{topic.name}</span>
                          {topic.trending && (
                            <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30 font-medium">
                              Trending
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">{topic.posts} posts</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground ml-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Active Challenges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challengeData.map((challenge, index) => {
                const Icon = challenge.icon
                const progressPercentage = (challenge.progress / challenge.target) * 100
                return (
                  <Card key={index} className="border-[#2a2a2f] bg-[#0f0f11] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${challenge.color}/20 border ${challenge.color.split(' ')[0].replace('from-', 'border-')}/30 shadow-inner`}>
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold">{challenge.title}</CardTitle>
                          <CardDescription className="text-muted-foreground">{challenge.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground font-medium">Progress</span>
                          <span className="font-semibold text-foreground">{challenge.progress}/{challenge.target}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 bg-[#1e1e23] rounded-full h-3 mr-4 shadow-inner">
                            <div 
                              className={`h-3 rounded-full bg-gradient-to-r ${challenge.color} shadow-sm`}
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-foreground">{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="pt-2">
                          <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30 font-medium">
                            🏆 {challenge.reward}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Learning Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analyticsData.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="border-[#2a2a2f] bg-[#0f0f11] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}/20 border ${stat.color.split(' ')[0].replace('from-', 'border-')}/30 shadow-inner`}>
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30 font-medium">
                          {stat.change}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                        <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}