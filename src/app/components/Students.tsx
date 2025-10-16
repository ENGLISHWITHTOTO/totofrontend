import { useState } from "react"
import { Award, Calendar, MessageSquare, Search, Star, TrendingUp, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Progress } from "./ui/progress"
import { useAppStore } from "../hooks/useAppStore"

export function Students() {
  const { setMessageModalOpen, setActiveSection } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const students = [
    {
      id: 1,
      name: "Maria Garcia",
      avatar: "MG",
      email: "maria.garcia@email.com",
      joinDate: "Nov 15, 2024",
      totalLessons: 12,
      completedLessons: 8,
      totalSessions: 6,
      averageScore: 85,
      streak: 14,
      lastActivity: "2 hours ago",
      goal: "IELTS 7.0",
      level: "Intermediate",
      notes: "Very motivated student. Preparing for IELTS exam in March. Needs focus on speaking fluency."
    },
    {
      id: 2,
      name: "John Smith",
      avatar: "JS",
      email: "john.smith@email.com",
      joinDate: "Oct 22, 2024",
      totalLessons: 18,
      completedLessons: 15,
      totalSessions: 12,
      averageScore: 92,
      streak: 28,
      lastActivity: "1 day ago",
      goal: "Business English",
      level: "Advanced",
      notes: "Excellent progress in business communication. Ready for advanced topics."
    },
    {
      id: 3,
      name: "Lisa Wang",
      avatar: "LW",
      email: "lisa.wang@email.com",
      joinDate: "Dec 5, 2024",
      totalLessons: 5,
      completedLessons: 3,
      totalSessions: 2,
      averageScore: 78,
      streak: 7,
      lastActivity: "3 hours ago",
      goal: "General English",
      level: "Beginner",
      notes: "New student, very enthusiastic. Needs encouragement and basic grammar foundation."
    },
    {
      id: 4,
      name: "Ahmed Hassan",
      avatar: "AH",
      email: "ahmed.hassan@email.com",
      joinDate: "Sep 10, 2024",
      totalLessons: 25,
      completedLessons: 22,
      totalSessions: 15,
      averageScore: 88,
      streak: 35,
      lastActivity: "5 hours ago",
      goal: "Academic English",
      level: "Upper-Intermediate",
      notes: "Preparing for university applications. Strong in reading and writing, needs pronunciation work."
    },
    {
      id: 5,
      name: "Sophie Martin",
      avatar: "SM",
      email: "sophie.martin@email.com",
      joinDate: "Nov 28, 2024",
      totalLessons: 8,
      completedLessons: 6,
      totalSessions: 4,
      averageScore: 81,
      streak: 12,
      lastActivity: "1 hour ago",
      goal: "Travel English",
      level: "Intermediate",
      notes: "Planning to travel to English-speaking countries. Focuses on practical conversation skills."
    }
  ]

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.goal.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === "active" && student.streak > 0) ||
                         (selectedFilter === "beginner" && student.level === "Beginner") ||
                         (selectedFilter === "intermediate" && student.level.includes("Intermediate")) ||
                         (selectedFilter === "advanced" && student.level === "Advanced")
    
    return matchesSearch && matchesFilter
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-blue-100 text-blue-800"
      case "Upper-Intermediate":
        return "bg-purple-100 text-purple-800"
      case "Advanced":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Students</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">Active learners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(students.reduce((acc, s) => acc + (s.completedLessons / s.totalLessons * 100), 0) / students.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Lesson completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(students.reduce((acc, s) => acc + s.averageScore, 0) / students.length)}
            </div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Streaks</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter(s => s.streak > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">Students with active streaks</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            <SelectItem value="active">Active Streaks</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="grid" className="space-y-6">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{student.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{student.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getLevelColor(student.level)}>
                          {student.level}
                        </Badge>
                        {student.streak > 0 && (
                          <Badge variant="outline" className="text-orange-600">
                            🔥 {student.streak} days
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{student.completedLessons}/{student.totalLessons} lessons</span>
                      </div>
                      <Progress value={(student.completedLessons / student.totalLessons) * 100} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Avg. Score</p>
                        <p className="font-medium">{student.averageScore}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sessions</p>
                        <p className="font-medium">{student.totalSessions}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Goal: {student.goal}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last active: {student.lastActivity}
                      </p>
                    </div>

                    {student.notes && (
                      <div className="pt-3 border-t">
                        <p className="text-xs text-muted-foreground mb-1">Notes:</p>
                        <p className="text-sm line-clamp-2">{student.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setMessageModalOpen(true, student)}
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Message
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setActiveSection("live-sessions")}
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <Card key={student.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{student.avatar}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold">{student.name}</h3>
                        <Badge className={getLevelColor(student.level)}>
                          {student.level}
                        </Badge>
                        {student.streak > 0 && (
                          <Badge variant="outline" className="text-orange-600">
                            🔥 {student.streak} days
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{student.email}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Progress</p>
                          <p className="font-medium">{student.completedLessons}/{student.totalLessons}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Avg. Score</p>
                          <p className="font-medium">{student.averageScore}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Sessions</p>
                          <p className="font-medium">{student.totalSessions}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Goal</p>
                          <p className="font-medium">{student.goal}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule
                      </Button>
                    </div>
                  </div>

                  {student.notes && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-1">Notes:</p>
                      <p className="text-sm">{student.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No students found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Students who purchase your lessons or book sessions will appear here"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}