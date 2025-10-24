import { useState } from "react"
import { ChevronDown, ChevronRight, Clock, DollarSign, FileText, Image, Mic, Plus, Settings, Upload, Video } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Switch } from "./ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { useAppStore } from "../hooks/useAppStore"

export function LessonBuilder() {
  const { lessons, setCreateLessonModalOpen } = useAppStore()
  const [expandedSections, setExpandedSections] = useState<string[]>(["general"])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const lessonComponents = [
    { type: "video", label: "Video + Transcript", icon: Video },
    { type: "text", label: "Text Block", icon: FileText },
    { type: "audio", label: "Audio Clip", icon: Mic },
    { type: "image", label: "Image", icon: Image },
    { type: "multiple-choice", label: "Multiple Choice", icon: Settings },
    { type: "fill-blank", label: "Fill in the Blank", icon: Settings },
    { type: "essay", label: "Essay Task", icon: Settings },
    { type: "speaking", label: "Speaking Task", icon: Settings },
    { type: "matching", label: "Matching Exercise", icon: Settings },
    { type: "ordering", label: "Ordering Task", icon: Settings }
  ]



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Lesson Builder & Marketplace</h1>
        <Button onClick={() => setCreateLessonModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Lesson
        </Button>
      </div>

      <Tabs defaultValue="builder" className="space-y-6">
        <TabsList>
          <TabsTrigger value="builder">Lesson Builder</TabsTrigger>
          <TabsTrigger value="marketplace">My Lessons</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lesson Components Palette */}
            <Card>
              <CardHeader>
                <CardTitle>Lesson Components</CardTitle>
                <CardDescription>Drag and drop to build your lesson</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {lessonComponents.map((component, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    draggable
                  >
                    <component.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{component.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Lesson Builder Canvas */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Lesson Canvas</CardTitle>
                <CardDescription>Build your lesson structure here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* General Settings */}
                <Collapsible 
                  open={expandedSections.includes("general")}
                  onOpenChange={() => toggleSection("general")}
                >
                  <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 bg-muted rounded-lg text-left">
                    {expandedSections.includes("general") ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                    <span className="font-medium">General Settings</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <label>Lesson Title</label>
                      <Input placeholder="Enter lesson title" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label>Category</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ielts">IELTS Preparation</SelectItem>
                            <SelectItem value="business">Business English</SelectItem>
                            <SelectItem value="conversation">Conversation</SelectItem>
                            <SelectItem value="grammar">Grammar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label>Subcategory</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="speaking">Speaking</SelectItem>
                            <SelectItem value="writing">Writing</SelectItem>
                            <SelectItem value="reading">Reading</SelectItem>
                            <SelectItem value="listening">Listening</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label>Description</label>
                      <Textarea placeholder="Describe what students will learn" rows={3} />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Video Section */}
                <Collapsible 
                  open={expandedSections.includes("video")}
                  onOpenChange={() => toggleSection("video")}
                >
                  <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 bg-muted rounded-lg text-left">
                    {expandedSections.includes("video") ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                    <Video className="w-4 h-4" />
                    <span className="font-medium">Introduction Video</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Video className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload lesson video</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Video
                    </Button>
                    <div className="space-y-2">
                      <label>Transcript</label>
                      <Textarea placeholder="Video transcript (optional)" rows={4} />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Exercise Section */}
                <Collapsible 
                  open={expandedSections.includes("exercise")}
                  onOpenChange={() => toggleSection("exercise")}
                >
                  <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 bg-muted rounded-lg text-left">
                    {expandedSections.includes("exercise") ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                    <Settings className="w-4 h-4" />
                    <span className="font-medium">Practice Exercise</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <label>Exercise Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select exercise type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                          <SelectItem value="essay">Essay Task</SelectItem>
                          <SelectItem value="speaking">Speaking Task</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch />
                      <label>Add timer</label>
                      <div className="flex items-center gap-2 ml-auto">
                        <Clock className="w-4 h-4" />
                        <Input type="number" placeholder="5" className="w-20" />
                        <span className="text-sm text-muted-foreground">minutes</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label>AI Evaluation Prompt</label>
                      <Textarea 
                        placeholder="Describe how AI should evaluate student answers..."
                        rows={3}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Marketplace Settings */}
                <Collapsible 
                  open={expandedSections.includes("marketplace")}
                  onOpenChange={() => toggleSection("marketplace")}
                >
                  <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 bg-muted rounded-lg text-left">
                    {expandedSections.includes("marketplace") ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">Marketplace Settings</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label>Price ($)</label>
                        <Input type="number" placeholder="15" />
                      </div>
                      <div className="space-y-2">
                        <label>AI Credits Required</label>
                        <Input type="number" placeholder="5" />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">Save Draft</Button>
                  <Button className="flex-1">Submit for Approval</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <div className="grid gap-4">
            {lessons.map((lesson) => (
              <Card key={lesson.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{lesson.title}</h3>
                        <Badge 
                          variant={
                            lesson.status === "published" ? "default" :
                            lesson.status === "pending" ? "secondary" : "outline"
                          }
                        >
                          {lesson.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {lesson.category} → {lesson.subcategory}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>${lesson.price}</span>
                        <span>{lesson.sales} sales</span>
                        {lesson.rating > 0 && (
                          <span>★ {lesson.rating}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Analytics</Button>
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