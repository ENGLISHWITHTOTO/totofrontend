import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Play, 
  BookOpen, 
  TrendingUp, 
  Mic, 
  MessageCircle, 
  MessageSquare,
  Phone, 
  Users, 
  Star, 
  ChevronRight, 
  Target,
  Flame,
  Gift,
  MapPin,
  Zap,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  UserSearch,
  GraduationCap,
  Grid3X3,
  Camera,
  Bell
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import LanguagePicker from './LanguagePicker'
import { useLanguage } from '../contexts/LanguageContext'
import { getLanguageContent } from '../utils/languageContent'

const useAuth = () => {
  return {
    user: { 
      firstName: 'Alex', 
      dailyGoalMin: 30,
      todayMin: 18,
      streak: 5
    }
  }
}

export default function HomeFeed() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { currentLanguage } = useLanguage()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  const goalProgress = (user.todayMin / user.dailyGoalMin) * 100
  const goalCompleted = goalProgress >= 100
  const content = getLanguageContent(currentLanguage)

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-background via-background to-muted/10">
      {/* Mobile Header with Language Picker */}
      <div className="lg:hidden sticky top-0 z-10 bg-card/90 backdrop-blur-md border-b border-border/50 px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="text-3xl">{currentLanguage.flag}</div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {content.welcome}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground ml-12">Your personalized journey continues</p>
          </div>
          <LanguagePicker />
        </div>
      </div>

      {/* Desktop Welcome Section */}
      <div className="hidden lg:block px-8 py-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="text-6xl opacity-90">{currentLanguage.flag}</div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {content.welcome}
              </h1>
              <p className="text-muted-foreground text-lg">
                Let's make progress on your {currentLanguage.name} goals today
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Learning Language</p>
              <p className="font-medium text-primary">{currentLanguage.name}</p>
            </div>
            <LanguagePicker />
          </div>
        </div>
      </div>

      {/* Language-Specific Cultural Banner */}
      <div className="mx-4 lg:mx-8 mb-6">
        <div className={`relative p-4 lg:p-6 rounded-2xl overflow-hidden ${
          currentLanguage.code === 'ja' ? 'bg-gradient-to-r from-red-600 via-white to-red-600' :
          currentLanguage.code === 'es' ? 'bg-gradient-to-r from-red-500 via-yellow-400 to-red-500' :
          currentLanguage.code === 'fr' ? 'bg-gradient-to-r from-blue-600 via-white to-red-500' :
          currentLanguage.code === 'de' ? 'bg-gradient-to-r from-gray-800 via-red-500 to-yellow-400' :
          currentLanguage.code === 'it' ? 'bg-gradient-to-r from-green-600 via-white to-red-500' :
          currentLanguage.code === 'pt' ? 'bg-gradient-to-r from-green-500 via-yellow-400 to-blue-500' :
          currentLanguage.code === 'ru' ? 'bg-gradient-to-r from-white via-blue-500 to-red-500' :
          currentLanguage.code === 'ko' ? 'bg-gradient-to-r from-white via-red-500 to-blue-600' :
          currentLanguage.code === 'zh' ? 'bg-gradient-to-r from-red-600 via-yellow-400 to-red-600' :
          currentLanguage.code === 'ar' ? 'bg-gradient-to-r from-green-600 via-white to-green-600' :
          currentLanguage.code === 'hi' ? 'bg-gradient-to-r from-orange-500 via-white to-green-600' :
          'bg-gradient-to-r from-primary via-accent to-primary'
        }`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative flex items-center gap-4 text-white">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">
                {currentLanguage.code === 'ja' && '🎌 Welcome to Japanese Learning!'}
                {currentLanguage.code === 'es' && '¡Bienvenido al Español! 🎉'}
                {currentLanguage.code === 'fr' && 'Bienvenue dans l\'apprentissage du Français! 🇫🇷'}
                {currentLanguage.code === 'de' && 'Willkommen beim Deutsch lernen! 🇩🇪'}
                {currentLanguage.code === 'it' && 'Benvenuto nell\'apprendimento Italiano! 🇮🇹'}
                {currentLanguage.code === 'pt' && 'Bem-vindo ao aprendizado de Português! 🇧🇷'}
                {currentLanguage.code === 'ru' && 'Добро пожаловать в изучение русского! 🇷🇺'}
                {currentLanguage.code === 'ko' && '한국어 학습에 오신 것을 환영합니다! 🇰🇷'}
                {currentLanguage.code === 'zh' && '欢迎来到中文学习! 🇨🇳'}
                {currentLanguage.code === 'ar' && 'أهلاً بك في تعلم العربية! 🕌'}
                {currentLanguage.code === 'hi' && 'हिंदी सीखने में आपका स्वागत है! 🇮🇳'}
                {!['ja', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ko', 'zh', 'ar', 'hi'].includes(currentLanguage.code) && 'Welcome to Your Language Journey! 🌍'}
              </h3>
              <p className="text-white/90">
                {currentLanguage.code === 'ja' && 'Discover the beauty of Japanese culture through language'}
                {currentLanguage.code === 'es' && 'Descubre la riqueza cultural del mundo hispanohablante'}
                {currentLanguage.code === 'fr' && 'Explorez la richesse de la culture francophone'}
                {currentLanguage.code === 'de' && 'Entdecken Sie die deutsche Kultur und Tradition'}
                {currentLanguage.code === 'it' && 'Scopri la bellezza della cultura italiana'}
                {currentLanguage.code === 'pt' && 'Explore a diversidade da cultura lusófona'}
                {currentLanguage.code === 'ru' && 'Откройте для себя богатство русской культуры'}
                {currentLanguage.code === 'ko' && '한국의 아름다운 문화를 언어를 통해 발견하세요'}
                {currentLanguage.code === 'zh' && '通过语言探索中华文化的魅力'}
                {currentLanguage.code === 'ar' && 'اكتشف ثراء الثقافة العربية من خلال اللغة'}
                {currentLanguage.code === 'hi' && 'भाषा के माध्यम से भारतीय संस्कृति की समृद्धता खोजें'}
                {!['ja', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ko', 'zh', 'ar', 'hi'].includes(currentLanguage.code) && 'Immerse yourself in culture through language learning'}
              </p>
            </div>
            <Button variant="secondary" className="font-medium bg-white/20 hover:bg-white/30 border-white/30">
              Explore Culture
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 space-y-8 pb-8">
        {/* Daily Goal & Streak - Redesigned */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-card to-muted/20 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    {content.dailyGoal}
                  </h3>
                  <p className="text-muted-foreground">
                    {user.todayMin}/{user.dailyGoalMin} {content.minutesToday}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{Math.round(goalProgress)}%</div>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <Progress value={goalProgress} className="h-3 rounded-full" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full opacity-50"></div>
                </div>
                {goalCompleted ? (
                  <div className="text-center p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <p className="text-emerald-400 font-medium">
                      🎉 {content.goalComplete}
                    </p>
                  </div>
                ) : (
                  <Button className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90" onClick={() => navigate('/lesson/1')}>
                    <Play className="h-4 w-4" />
                    {content.startNow} ({user.dailyGoalMin - user.todayMin} min left)
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    Learning Streak
                  </h3>
                  <p className="text-muted-foreground">Keep it going!</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-500">{user.streak}</div>
                  <p className="text-xs text-muted-foreground">Days</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex gap-1">
                    {[...Array(7)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-6 h-6 rounded-full ${
                          i < user.streak 
                            ? 'bg-gradient-to-br from-orange-400 to-red-500' 
                            : 'bg-muted border-2 border-muted-foreground/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {user.streak < 7 ? `${7 - user.streak} more days for a week streak!` : 'Amazing consistency! 🔥'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Learning - Enhanced */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              {content.continueLeaning}
            </h2>
            <Button variant="outline" size="sm" className="gap-1 border-primary/20 hover:bg-primary/10">
              View all
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {/* Featured Lesson */}
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20" onClick={() => navigate('/lesson/1')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1565022536102-f7645c84354a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5ndWFnZSUyMGxlYXJuaW5nJTIwYm9va3N8ZW58MXx8fHwxNzU3MjgwMTcxfDA&ixlib=rb-4.1.0&q=80&w=200"
                      alt="Lesson cover"
                      className="w-20 h-20 lg:w-24 lg:h-24 rounded-xl object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                      <div className="p-3 bg-primary/90 rounded-full backdrop-blur-sm">
                        <Play className="h-5 w-5 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-bold">Business English Essentials</h4>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        In Progress
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">Intermediate • 12 min remaining</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium text-primary">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Lessons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group">
                <CardContent className="p-4">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1596247290824-e9f12b8c574f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBvbmxpbmV8ZW58MXx8fHwxNzU3MjgzOTE2fDA&ixlib=rb-4.1.0&q=80&w=200"
                    alt="Grammar lesson"
                    className="w-full h-32 rounded-xl object-cover mb-3 group-hover:scale-105 transition-transform"
                  />
                  <h5 className="font-medium mb-1">Advanced Grammar</h5>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Play className="h-3 w-3" />
                    15 min lesson
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group">
                <CardContent className="p-4">
                  <div className="w-full h-32 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 mb-3 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h5 className="font-medium mb-1">Vocabulary Builder</h5>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Zap className="h-3 w-3" />
                    8 min practice
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group md:col-span-2 lg:col-span-1">
                <CardContent className="p-4">
                  <div className="w-full h-32 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 mb-3 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Mic className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h5 className="font-medium mb-1">Pronunciation Practice</h5>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    AI-powered
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Language Learning Progress Overview */}
        <div className="bg-gradient-to-r from-card to-muted/20 rounded-2xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{currentLanguage.flag}</div>
              <div>
                <h3 className="text-lg font-bold">{currentLanguage.name} Progress</h3>
                <p className="text-sm text-muted-foreground">Your learning statistics</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
              Intermediate
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-b from-blue-500/10 to-blue-500/5 rounded-xl">
              <div className="text-2xl font-bold text-blue-400">247</div>
              <p className="text-sm text-muted-foreground">Words Learned</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-b from-emerald-500/10 to-emerald-500/5 rounded-xl">
              <div className="text-2xl font-bold text-emerald-400">18h</div>
              <p className="text-sm text-muted-foreground">Study Time</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-b from-purple-500/10 to-purple-500/5 rounded-xl">
              <div className="text-2xl font-bold text-purple-400">34</div>
              <p className="text-sm text-muted-foreground">Lessons Done</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-b from-orange-500/10 to-orange-500/5 rounded-xl">
              <div className="text-2xl font-bold text-orange-400">85%</div>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
          </div>
        </div>

        {/* All-in-One Platform Features */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Everything You Need for {currentLanguage.name}
            </h2>
            <p className="text-muted-foreground">Complete language learning ecosystem - no app switching needed</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Speaking Practice */}
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20" onClick={() => navigate('/speaking')}>
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-blue-500 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">AI Speaking Coach</h3>
                <p className="text-sm text-muted-foreground mb-3">Practice with AI, join voice rooms, get instant feedback</p>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  4 Practice Modes
                </Badge>
              </CardContent>
            </Card>

            {/* Chat & Community */}
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20" onClick={() => navigate('/chat')}>
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-emerald-500 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">Smart Chat Partner</h3>
                <p className="text-sm text-muted-foreground mb-3">AI conversations, real-time corrections, topic suggestions</p>
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  Always Available
                </Badge>
              </CardContent>
            </Card>

            {/* Marketplace */}
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20" onClick={() => navigate('/market')}>
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-purple-500 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">Course Marketplace</h3>
                <p className="text-sm text-muted-foreground mb-3">Premium courses, AI-enhanced lessons, expert content</p>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  1000+ Courses
                </Badge>
              </CardContent>
            </Card>

            {/* Find Teachers */}
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20" onClick={() => navigate('/teachers')}>
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-orange-500 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UserSearch className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">Expert Teachers</h3>
                <p className="text-sm text-muted-foreground mb-3">1-on-1 sessions, native speakers, instant booking</p>
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  200+ Teachers
                </Badge>
              </CardContent>
            </Card>

            {/* Study Abroad */}
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20" onClick={() => navigate('/study-abroad')}>
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-cyan-500 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">Study Abroad</h3>
                <p className="text-sm text-muted-foreground mb-3">Programs worldwide, homestays, complete packages</p>
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                  50+ Countries
                </Badge>
              </CardContent>
            </Card>

            {/* Social Learning */}
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-500/20" onClick={() => navigate('/moments')}>
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-pink-500 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">Social Learning</h3>
                <p className="text-sm text-muted-foreground mb-3">Share progress, connect with learners, get motivated</p>
                <Badge variant="secondary" className="bg-pink-500/20 text-pink-400 border-pink-500/30">
                  Community
                </Badge>
              </CardContent>
            </Card>

            {/* Smart Categories */}
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20" onClick={() => navigate('/categories')}>
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-violet-500 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Grid3X3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">Smart Categories</h3>
                <p className="text-sm text-muted-foreground mb-3">Organized learning paths, progress tracking, bookmarks</p>
                <Badge variant="secondary" className="bg-violet-500/20 text-violet-400 border-violet-500/30">
                  AI-Curated
                </Badge>
              </CardContent>
            </Card>

            {/* Quick Practice */}
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20" onClick={() => navigate('/flashcards')}>
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-amber-500 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">Quick Practice</h3>
                <p className="text-sm text-muted-foreground mb-3">Flashcards, writing eval, MCQ tests, mini-games</p>
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  Bite-sized
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trending & New Content */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">🔥 Trending Now</h2>
            <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
              Hot
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { 
                title: 'AI-Powered Pronunciation', 
                duration: '10 min', 
                badge: 'New',
                gradient: 'from-blue-500/20 to-cyan-500/20',
                border: 'border-blue-500/20',
                icon: Mic
              },
              { 
                title: 'IELTS Speaking Practice', 
                duration: '15 min', 
                badge: 'Hot',
                gradient: 'from-red-500/20 to-orange-500/20',
                border: 'border-red-500/20',
                icon: Target
              },
              { 
                title: 'Medical English Vocabulary', 
                duration: '20 min', 
                badge: 'New',
                gradient: 'from-emerald-500/20 to-teal-500/20',
                border: 'border-emerald-500/20',
                icon: BookOpen
              }
            ].map((lesson, index) => (
              <Card key={index} className={`cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] bg-gradient-to-br ${lesson.gradient} ${lesson.border} group`}>
                <CardContent className="p-6 relative">
                  <Badge 
                    variant={lesson.badge === 'Hot' ? 'destructive' : 'default'} 
                    className={`absolute -top-2 -right-2 text-xs ${lesson.badge === 'Hot' ? 'animate-pulse' : ''}`}
                  >
                    {lesson.badge}
                  </Badge>
                  
                  <div className="text-center space-y-3">
                    <div className="p-3 bg-white/10 rounded-xl w-fit mx-auto group-hover:scale-110 transition-transform">
                      <lesson.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-bold mb-2">{lesson.title}</h5>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center">
                        <Play className="h-3 w-3" />
                        {lesson.duration}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20" onClick={() => navigate('/chat')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-2xl">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">Start AI Chat</h4>
                    <p className="text-sm text-muted-foreground">Practice conversations instantly</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border-emerald-500/20" onClick={() => navigate('/speaking/voice-rooms')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl relative">
                    <Users className="h-6 w-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">Join Voice Room</h4>
                    <p className="text-sm text-muted-foreground">12 active rooms</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] bg-gradient-to-r from-orange-500/5 to-red-500/5 border-orange-500/20" onClick={() => navigate('/random-call')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">Random Call</h4>
                    <p className="text-sm text-muted-foreground">Match with a partner</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-purple-500/20" onClick={() => navigate('/flashcards')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">Quick Review</h4>
                    <p className="text-sm text-muted-foreground">12 cards due</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Premium Features Showcase */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Premium Features
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Study Abroad */}
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20" onClick={() => navigate('/study-abroad')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Study Abroad Programs</h3>
                    <p className="text-muted-foreground">Your gateway to immersive learning</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-4 bg-card/50 rounded-xl border border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">Oxford Language Center</h5>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          London, UK
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">4.8</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-card/50 rounded-xl border border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">Johnson Family Homestay</h5>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Toronto, CA
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">4.9</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Marketplace */}
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20" onClick={() => navigate('/market')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                    <ShoppingBag className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Premium Courses</h3>
                    <p className="text-muted-foreground">Expert-created content</p>
                  </div>
                </div>
                
                {/* Special Offer */}
                <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl mb-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5" />
                    <div className="flex-1">
                      <p className="font-bold">15% OFF IELTS Prep</p>
                      <p className="text-sm opacity-90">AI-powered course</p>
                    </div>
                    <Button variant="secondary" size="sm" className="text-emerald-600">
                      Claim
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'Business English Mastery', teacher: 'Sarah Johnson', rating: 4.9, price: 25 },
                    { title: 'Pronunciation Perfect', teacher: 'Dr. Chen', rating: 4.8, price: 18 }
                  ].map((course, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-card/50 rounded-xl border border-border/50">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{course.title}</h5>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>by {course.teacher}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span>{course.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{course.price}</p>
                        <p className="text-xs text-muted-foreground">credits</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Smart Reminders */}
        <Card className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-2xl">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-300 mb-1">
                  📚 12 vocabulary reviews due
                </h4>
                <p className="text-sm text-muted-foreground">
                  Keep your {user.streak}-day streak alive! Reviews are most effective now.
                </p>
              </div>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                onClick={() => navigate('/flashcards')}
              >
                Review Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Platform Integration Message */}
        <Card className="bg-gradient-to-r from-primary to-accent text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <CardContent className="p-8 relative">
            <div className="text-center space-y-4">
              <div className="p-4 bg-white/20 rounded-2xl w-fit mx-auto backdrop-blur-sm">
                <Sparkles className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Why Choose LinguaAll?</h3>
                <p className="text-white/90 mb-4">
                  No more juggling multiple apps! We've combined everything you need for language learning into one powerful platform.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>AI Tutoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Real Teachers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Study Abroad</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Social Learning</span>
                  </div>
                </div>
              </div>
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Explore All Features
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Padding */}
        <div className="h-16" />
      </div>
    </div>
  )
}