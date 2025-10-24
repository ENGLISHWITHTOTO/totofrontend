import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { 
  Home, 
  User,
  Bell,
  CreditCard,
  Search,
  Settings,
  Award,
  Zap,
  MessageCircle,
  Mic,
  GraduationCap,
  Plane,
  ShoppingBag,
  Grid3X3,
  Camera
} from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { cn } from '../ui/utils'
import LanguagePicker from '../student/LanguagePicker'

// Navigation item interface
interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  matchPaths?: string[]
}

// Main navigation items
const mainNavItems: NavItem[] = [
  { 
    id: 'home', 
    label: 'Home', 
    icon: Home, 
    path: '/',
    matchPaths: ['/']
  },
  { 
    id: 'speaking', 
    label: 'Speaking', 
    icon: Mic, 
    path: '/speaking',
    matchPaths: ['/speaking']
  },
  { 
    id: 'chat', 
    label: 'Chat', 
    icon: MessageCircle, 
    path: '/chat',
    matchPaths: ['/chat']
  },
  { 
    id: 'moments', 
    label: 'Moments', 
    icon: Camera, 
    path: '/moments',
    matchPaths: ['/moments']
  },
  { 
    id: 'market', 
    label: 'Market', 
    icon: ShoppingBag, 
    path: '/market',
    matchPaths: ['/market']
  },
  { 
    id: 'teachers', 
    label: 'Find Teacher', 
    icon: GraduationCap, 
    path: '/teachers',
    matchPaths: ['/teachers']
  },
  { 
    id: 'study-abroad', 
    label: 'Study Abroad', 
    icon: Plane, 
    path: '/study-abroad',
    matchPaths: ['/study-abroad']
  },
  { 
    id: 'categories', 
    label: 'Categories', 
    icon: Grid3X3, 
    path: '/categories',
    matchPaths: ['/categories', '/lesson', '/explore']
  }
]

// Desktop navigation items (includes additional tools)
const desktopNavItems = [
  ...mainNavItems.map(item => ({ 
    ...item, 
    description: getItemDescription(item.id) 
  })),
  // Additional desktop-only items
  { id: 'writing', label: 'AI Writing', icon: Zap, path: '/writing', description: 'Essay evaluation' },
  { id: 'flashcards', label: 'Flashcards', icon: Award, path: '/flashcards', description: 'Quick vocabulary' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile', description: 'Account & progress' }
]

function getItemDescription(id: string): string {
  const descriptions: Record<string, string> = {
    home: 'Personal learning dashboard',
    speaking: 'Voice practice & rooms',
    chat: 'Practice with AI tutor',
    moments: 'Connect with learners',
    market: 'Premium courses',
    teachers: '1-on-1 lessons',
    'study-abroad': 'Programs worldwide',
    categories: 'Browse lessons by topic'
  }
  return descriptions[id] || ''
}

const useAuth = () => {
  return {
    user: { 
      firstName: 'Alex',
      lastName: 'Chen', 
      avatar: '',
      level: 12,
      xp: 2450,
      streak: 15,
      credits: 240,
      progress: 78,
      isPremium: true
    }
  }
}

// Custom hook for navigation logic
function useNavigationState() {
  const location = useLocation()

  // Determine active navigation item based on current route
  const activeItem = useMemo(() => {
    return mainNavItems.find(item => {
      if (item.path === '/') {
        return location.pathname === '/'
      }
      
      // Check if current path matches any of the item's match paths
      return item.matchPaths?.some(matchPath => {
        if (matchPath === '/') {
          return location.pathname === '/'
        }
        return location.pathname.startsWith(matchPath)
      }) || location.pathname.startsWith(item.path)
    })
  }, [location.pathname])

  return {
    activeItem
  }
}



export default function StudentLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { activeItem } = useNavigationState()

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Desktop Header */}
      <header className="hidden lg:flex items-center justify-between p-6 border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                LinguaAll
              </h1>
              <p className="text-sm text-muted-foreground">Complete Language Learning</p>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search lessons, teachers, programs..."
              className="pl-10 pr-4 py-2 w-80 bg-input rounded-xl border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{user.streak} day streak</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30">
              <Award className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium">Level {user.level}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <LanguagePicker />
            <Button variant="outline" size="sm" className="gap-2 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
              <CreditCard className="h-4 w-4" />
              {user.credits} credits
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                {user.firstName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Hi, {user.firstName}!</p>
              {user.isPremium && (
                <Badge variant="secondary" className="text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300">
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b border-border/50 bg-card/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
              {user.firstName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">Hi, {user.firstName}!</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-muted-foreground">{user.streak} day streak</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-3 w-3 text-emerald-500" />
                <span className="text-xs text-muted-foreground">Level {user.level}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-200"
            onClick={() => navigate('/categories')}
          >
            <Search className="h-4 w-4" />
          </Button>
          
          <LanguagePicker />
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 text-xs px-2 py-1 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 rounded-xl hover:bg-primary/20 transition-all duration-200"
            onClick={() => navigate('/market')}
          >
            <CreditCard className="h-3 w-3" />
            <span className="hidden xs:inline">{user.credits}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative p-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-200"
          >
            <Bell className="h-4 w-4" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </Button>
        </div>
      </header>

      {/* Desktop Sidebar + Main Content */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Desktop Sidebar - Main Navigation */}
        <nav className="w-72 bg-[#0a0a0b] border-r border-[#2a2a2f] p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Main Navigation */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                Main Features
              </h3>
              <div className="space-y-2">
                {mainNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeItem?.id === item.id
                  
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 h-auto p-3 rounded-xl transition-all",
                        isActive 
                          ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      )}
                      onClick={() => navigate(item.path)}
                    >
                      <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{getItemDescription(item.id)}</div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Additional Tools */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                Additional Tools
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'writing', label: 'AI Writing', icon: Zap, path: '/writing', description: 'Essay evaluation' },
                  { id: 'flashcards', label: 'Flashcards', icon: Award, path: '/flashcards', description: 'Quick vocabulary' },
                  { id: 'profile', label: 'Profile', icon: User, path: '/profile', description: 'Account & progress' }
                ].map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path || 
                    (item.path !== '/' && location.pathname.startsWith(item.path))
                  
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 h-auto p-3 rounded-xl transition-all",
                        isActive 
                          ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      )}
                      onClick={() => navigate(item.path)}
                    >
                      <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="pt-4 border-t border-border/50">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4">
                <h4 className="font-medium text-sm mb-2">Your Progress</h4>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Lessons completed</span>
                    <span className="text-primary font-medium">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Study time</span>
                    <span className="text-primary font-medium">45h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
          <Outlet />
        </main>
      </div>

      {/* Mobile Main Content */}
      <main className="lg:hidden flex-1 overflow-hidden">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden border-t border-border bg-card/95 backdrop-blur-lg">
        {/* Navigation Grid - 8 items in 2 rows */}
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem?.id === item.id
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "group flex flex-col items-center gap-1 h-auto py-3 px-2 rounded-2xl",
                  "transition-all duration-300 ease-out",
                  "hover:scale-[1.05] active:scale-[0.95]",
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive 
                    ? 'text-primary bg-primary/15 shadow-lg shadow-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-interactive'
                )}
                onClick={() => navigate(item.path)}
                aria-label={`Navigate to ${item.label}`}
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-xl",
                  "transition-all duration-300 ease-out",
                  "group-hover:scale-110 group-active:scale-95",
                  isActive 
                    ? 'bg-primary/20 text-primary shadow-sm' 
                    : 'bg-muted/40 group-hover:bg-muted/60'
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className={cn(
                  "text-xs font-medium leading-tight text-center",
                  "transition-all duration-300 ease-out",
                  "group-hover:scale-105 group-active:scale-95",
                  isActive && "text-primary"
                )}>
                  {item.label}
                </span>
              </Button>
            )
          })}
        </div>
      </nav>


    </div>
  )
}