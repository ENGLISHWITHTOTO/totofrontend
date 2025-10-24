import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  Settings, 
  Award, 
  Target, 
  Calendar,
  TrendingUp,
  Book,
  Clock,
  Star,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Edit3,
  Camera,
  Zap,
  Crown,
  ChevronRight,
  BarChart3
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Separator } from '../ui/separator'
import { useLanguage } from '../contexts/LanguageContext'

// Mock user data
const useAuth = () => {
  return {
    user: { 
      firstName: 'Alex',
      lastName: 'Johnson',
      email: 'alex.johnson@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      credits: 25,
      isPremium: true,
      streak: 7,
      level: 12,
      xp: 2450,
      nextLevelXp: 3000,
      joinDate: '2024-01-15',
      completedLessons: 127,
      studyTime: 45, // hours
      achievements: 12
    }
  }
}

const achievements = [
  { id: 1, name: 'First Steps', description: 'Complete your first lesson', icon: Target, earned: true },
  { id: 2, name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: Calendar, earned: true },
  { id: 3, name: 'Conversation Master', description: 'Complete 50 speaking exercises', icon: Award, earned: true },
  { id: 4, name: 'Vocabulary Expert', description: 'Learn 500+ new words', icon: Book, earned: false },
  { id: 5, name: 'Night Owl', description: 'Study after midnight', icon: Clock, earned: true },
  { id: 6, name: 'Social Butterfly', description: 'Make 10 friends', icon: Star, earned: false }
]

const stats = [
  { label: 'Lessons Completed', value: '127', icon: Book, color: 'text-blue-500' },
  { label: 'Study Time', value: '45h', icon: Clock, color: 'text-green-500' },
  { label: 'Current Streak', value: '7 days', icon: Zap, color: 'text-yellow-500' },
  { label: 'Level', value: '12', icon: TrendingUp, color: 'text-purple-500' }
]

const menuItems = [
  { id: 'account', label: 'Account Settings', icon: User, path: '/settings/account' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/settings/notifications' },
  { id: 'billing', label: 'Billing & Credits', icon: CreditCard, path: '/settings/billing' },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield, path: '/settings/privacy' },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, path: '/help' }
]

export default function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { currentLanguage } = useLanguage()
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'settings'>('overview')

  const handleLogout = () => {
    localStorage.removeItem('demo_authenticated')
    localStorage.removeItem('demo_email_verified')
    navigate('/login')
  }

  const progressToNextLevel = (user.xp / user.nextLevelXp) * 100

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Profile Header - Enhanced contrast */}
        <Card className="mb-6 bg-[#0f0f11] border-[#2a2a2f] shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20 md:h-24 md:w-24 ring-4 ring-primary/20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
                      {user.isPremium && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">{user.email}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Learning {currentLanguage.name}</span>
                      <span>•</span>
                      <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="gap-2">
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
                
                {/* Level Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Level {user.level}</span>
                    <span className="text-sm text-muted-foreground">{user.xp} / {user.nextLevelXp} XP</span>
                  </div>
                  <Progress value={progressToNextLevel} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'achievements'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="border-border/50 bg-gradient-to-br from-card to-card/50">
                    <CardContent className="p-4 text-center">
                      <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Recent Activity */}
            <Card className="border-border/50 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Completed Spanish Grammar Lesson</span>
                    </div>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>Joined speaking practice room</span>
                    </div>
                    <span className="text-sm text-muted-foreground">5 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span>Posted in community moments</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Yesterday</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <Card className="border-border/50 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>
                  You've earned {achievements.filter(a => a.earned).length} out of {achievements.length} achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon
                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border transition-all ${
                          achievement.earned
                            ? 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30'
                            : 'bg-muted/30 border-border/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            achievement.earned 
                              ? 'bg-gradient-to-r from-primary/20 to-accent/20' 
                              : 'bg-muted/50'
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              achievement.earned ? 'text-primary' : 'text-muted-foreground'
                            }`} />
                          </div>
                          <div>
                            <h3 className={`font-medium ${
                              achievement.earned ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {achievement.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card className="border-border/50 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your account and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <div key={item.id}>
                        <button
                          onClick={() => navigate(item.path)}
                          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                        {index < menuItems.length - 1 && <Separator className="my-1" />}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Logout */}
            <Card className="border-border/50 bg-gradient-to-br from-card to-card/50">
              <CardContent className="p-6">
                <Button 
                  variant="outline" 
                  className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}