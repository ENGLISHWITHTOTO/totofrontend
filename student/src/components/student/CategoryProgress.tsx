import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Trophy, Calendar, Target, Award, Download, 
  Share2, Star, Clock, Users, BookOpen, CheckCircle,
  TrendingUp, BarChart3, PlayCircle
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Avatar } from '../ui/avatar'
import { toast } from 'sonner'

interface CategoryStats {
  totalTime: number
  lessonsCompleted: number
  totalLessons: number
  streakDays: number
  averageScore: number
  certificates: number
  rank: string
  pointsEarned: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earnedAt: string
  category: string
}

interface Certificate {
  id: string
  categoryName: string
  categoryIcon: string
  completedAt: string
  grade: string
  downloadUrl: string
}

interface RecentActivity {
  id: string
  type: 'lesson_completed' | 'milestone_reached' | 'certificate_earned'
  title: string
  categoryName: string
  categoryIcon: string
  timestamp: string
  points?: number
}

// Mock data
const mockStats: CategoryStats = {
  totalTime: 127,
  lessonsCompleted: 45,
  totalLessons: 180,
  streakDays: 12,
  averageScore: 87,
  certificates: 3,
  rank: 'Advanced Learner',
  pointsEarned: 2450
}

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Business Master',
    description: 'Completed all Business English lessons',
    icon: '💼',
    earnedAt: '2 days ago',
    category: 'Business English'
  },
  {
    id: '2',
    title: 'Conversation Champion',
    description: 'Maintained a 7-day learning streak',
    icon: '🏆',
    earnedAt: '1 week ago',
    category: 'Conversation Practice'
  },
  {
    id: '3',
    title: 'Grammar Guru',
    description: 'Scored 95%+ on all grammar exercises',
    icon: '📚',
    earnedAt: '2 weeks ago',
    category: 'Grammar Essentials'
  },
  {
    id: '4',
    title: 'Early Bird',
    description: 'Completed lessons for 5 consecutive mornings',
    icon: '🌅',
    earnedAt: '3 weeks ago',
    category: 'General'
  }
]

const mockCertificates: Certificate[] = [
  {
    id: '1',
    categoryName: 'Business English',
    categoryIcon: '💼',
    completedAt: 'Dec 15, 2024',
    grade: 'A',
    downloadUrl: '#'
  },
  {
    id: '2',
    categoryName: 'Grammar Essentials',
    categoryIcon: '📚',
    completedAt: 'Nov 30, 2024',
    grade: 'A+',
    downloadUrl: '#'
  },
  {
    id: '3',
    categoryName: 'Pronunciation',
    categoryIcon: '🗣️',
    completedAt: 'Nov 15, 2024',
    grade: 'B+',
    downloadUrl: '#'
  }
]

const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'lesson_completed',
    title: 'Business Presentation Skills',
    categoryName: 'Business English',
    categoryIcon: '💼',
    timestamp: '2 hours ago',
    points: 50
  },
  {
    id: '2',
    type: 'milestone_reached',
    title: '50% Progress Milestone',
    categoryName: 'Conversation Practice',
    categoryIcon: '💬',
    timestamp: '1 day ago',
    points: 100
  },
  {
    id: '3',
    type: 'certificate_earned',
    title: 'Certificate Earned',
    categoryName: 'Business English',
    categoryIcon: '💼',
    timestamp: '2 days ago',
    points: 200
  },
  {
    id: '4',
    type: 'lesson_completed',
    title: 'Advanced Grammar Rules',
    categoryName: 'Grammar Essentials',
    categoryIcon: '📚',
    timestamp: '3 days ago',
    points: 40
  }
]

const gradeColors = {
  'A+': 'bg-green-100 text-green-700',
  'A': 'bg-green-100 text-green-600', 
  'A-': 'bg-green-100 text-green-600',
  'B+': 'bg-blue-100 text-blue-700',
  'B': 'bg-blue-100 text-blue-600',
  'B-': 'bg-blue-100 text-blue-600',
  'C+': 'bg-yellow-100 text-yellow-700',
  'C': 'bg-yellow-100 text-yellow-600',
  'C-': 'bg-yellow-100 text-yellow-600'
}

export default function CategoryProgress() {
  const navigate = useNavigate()
  const [stats] = useState<CategoryStats>(mockStats)
  const [achievements] = useState<Achievement[]>(mockAchievements)
  const [certificates] = useState<Certificate[]>(mockCertificates)
  const [recentActivity] = useState<RecentActivity[]>(mockRecentActivity)

  const progressPercentage = (stats.lessonsCompleted / stats.totalLessons) * 100

  const downloadCertificate = (certificate: Certificate) => {
    // In real app, this would download the actual certificate
    toast.success(`Downloading ${certificate.categoryName} certificate`)
  }

  const shareCertificate = (certificate: Certificate) => {
    if (navigator.share) {
      navigator.share({
        title: `${certificate.categoryName} Certificate`,
        text: `I just earned a certificate in ${certificate.categoryName}!`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Certificate link copied to clipboard')
    }
  }

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'lesson_completed':
        return <PlayCircle className="w-4 h-4 text-green-500" />
      case 'milestone_reached':
        return <Target className="w-4 h-4 text-blue-500" />
      case 'certificate_earned':
        return <Award className="w-4 h-4 text-purple-500" />
      default:
        return <CheckCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/categories')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1>My Progress</h1>
            <p className="text-sm text-muted-foreground">Track your learning journey</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{stats.totalTime}h</div>
                  <div className="text-sm text-muted-foreground">Total Time</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">{stats.lessonsCompleted}</div>
                  <div className="text-sm text-muted-foreground">Lessons Done</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-medium">{stats.streakDays}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">{stats.averageScore}%</div>
                  <div className="text-sm text-muted-foreground">Avg Score</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Overall Progress */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium">Overall Progress</h2>
              <Badge variant="secondary">{stats.rank}</Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Lessons Completed</span>
                <span>{stats.lessonsCompleted}/{stats.totalLessons}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round(progressPercentage)}% Complete</span>
                <span>{stats.pointsEarned} Points Earned</span>
              </div>
            </div>
          </Card>

          {/* Content Tabs */}
          <Tabs defaultValue="achievements" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="achievements" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Your Achievements</h3>
                <Badge variant="outline">{achievements.length} Earned</Badge>
              </div>
              
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center text-xl">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{achievement.title}</div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{achievement.category}</span>
                          <span>•</span>
                          <span>{achievement.earnedAt}</span>
                        </div>
                      </div>
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="certificates" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Your Certificates</h3>
                <Badge variant="outline">{certificates.length} Earned</Badge>
              </div>
              
              <div className="space-y-3">
                {certificates.map((certificate) => (
                  <Card key={certificate.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center text-xl">
                        {certificate.categoryIcon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{certificate.categoryName}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${gradeColors[certificate.grade as keyof typeof gradeColors]}`}
                          >
                            Grade: {certificate.grade}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {certificate.completedAt}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadCertificate(certificate)}
                          className="gap-1"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => shareCertificate(certificate)}
                          className="gap-1"
                        >
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Recent Activity</h3>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <Card key={activity.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{activity.title}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{activity.categoryIcon} {activity.categoryName}</span>
                          <span>•</span>
                          <span>{activity.timestamp}</span>
                          {activity.points && (
                            <>
                              <span>•</span>
                              <span className="text-primary">+{activity.points} pts</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => navigate('/categories')}
              >
                <BookOpen className="w-4 h-4" />
                Browse Categories
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => navigate('/')}
              >
                <TrendingUp className="w-4 h-4" />
                Continue Learning
              </Button>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}