import { Camera, Edit, Eye, Heart, MessageCircle, Play, Plus, Save, Upload, Video } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { useAppStore } from "../hooks/useAppStore"

export function Profile() {
  const { setCreateMomentModalOpen } = useAppStore()
  const moments = [
    {
      id: 1,
      type: "text",
      content: "Just finished an amazing IELTS preparation session! My student improved their speaking score from 6.0 to 7.5 in just 3 weeks. Consistency is key! 🎉",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8
    },
    {
      id: 2,
      type: "image",
      content: "New teaching materials for Business English arrived today! Can't wait to use these in my next lessons.",
      imageUrl: "https://images.unsplash.com/photo-1543109740-4bdb38fda756?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwbGVhcm5pbmclMjBib29rcyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NTg1MjQ4OTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      timestamp: "1 day ago",
      likes: 31,
      comments: 12
    },
    {
      id: 3,
      type: "video",
      content: "Quick tip for pronunciation: Practice tongue twisters daily! Here's one of my favorites...",
      timestamp: "3 days ago",
      likes: 45,
      comments: 18
    }
  ]

  const specialties = ["IELTS Preparation", "Business English", "Conversation Practice", "Grammar", "Pronunciation"]
  const languages = ["English (Native)", "Spanish (Fluent)", "French (Intermediate)"]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Profile & Moments</h1>
        <Button variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          Preview as Student
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Edit Profile</TabsTrigger>
          <TabsTrigger value="moments">Moments</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Photo & Video */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
                <CardDescription>Upload a professional photo that represents you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="https://images.unsplash.com/photo-1674916974247-64a74f1ee042?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwcHJvZmlsZSUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc1ODYwNjg1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" />
                    <AvatarFallback>ST</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Introduction Video</CardTitle>
                <CardDescription>Record a short video introducing yourself to students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Video className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No video uploaded</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Video
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your basic profile information visible to students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Full Name</label>
                  <Input defaultValue="Sarah Thompson" />
                </div>
                <div className="space-y-2">
                  <label>Teaching Experience</label>
                  <Input defaultValue="8 years" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label>Bio</label>
                <Textarea 
                  defaultValue="Experienced English teacher with 8+ years of helping students achieve their language goals. Specialized in IELTS preparation and business English. I believe in making learning enjoyable and practical."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label>Qualifications</label>
                <Textarea 
                  defaultValue="• MA in Applied Linguistics, Cambridge University
• CELTA Certification
• TESOL Advanced Diploma
• IELTS Examiner Certification"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Specialties & Languages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Specialties</CardTitle>
                <CardDescription>Areas of expertise you teach</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {specialty}
                      <button className="ml-1 text-xs hover:bg-red-100 rounded">×</button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Add new specialty" className="flex-1" />
                  <Button size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
                <CardDescription>Languages you speak and their proficiency levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {languages.map((language, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span>{language}</span>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Language
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="moments" className="space-y-6">
          {/* Create New Moment */}
          <Card>
            <CardHeader>
              <CardTitle>Create a Moment</CardTitle>
              <CardDescription>Share updates, tips, or achievements with your students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder="What would you like to share with your students?" rows={3} />
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Photo
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="w-4 h-4 mr-2" />
                  Video
                </Button>
                <Button className="ml-auto" onClick={() => setCreateMomentModalOpen(true)}>Post Moment</Button>
              </div>
            </CardContent>
          </Card>

          {/* Moments Feed */}
          <div className="space-y-4">
            {moments.map((moment) => (
              <Card key={moment.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="https://images.unsplash.com/photo-1674916974247-64a74f1ee042?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwcHJvZmlsZSUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc1ODYwNjg1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" />
                      <AvatarFallback>ST</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Sarah Thompson</span>
                        <span className="text-sm text-muted-foreground">{moment.timestamp}</span>
                      </div>
                      
                      <p className="mb-3">{moment.content}</p>
                      
                      {moment.type === "image" && moment.imageUrl && (
                        <div className="mb-3">
                          <ImageWithFallback 
                            src={moment.imageUrl}
                            alt="Moment image"
                            className="rounded-lg max-w-md w-full h-48 object-cover"
                          />
                        </div>
                      )}
                      
                      {moment.type === "video" && (
                        <div className="mb-3">
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center max-w-md">
                            <Button variant="ghost" size="lg">
                              <Play className="w-8 h-8" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-red-500">
                          <Heart className="w-4 h-4" />
                          {moment.likes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-blue-500">
                          <MessageCircle className="w-4 h-4" />
                          {moment.comments}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}