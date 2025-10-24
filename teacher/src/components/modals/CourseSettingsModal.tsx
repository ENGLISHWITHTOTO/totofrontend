import { useState } from "react"
import { useAppStore } from "../../hooks/useAppStore"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { 
  Settings, 
  Globe, 
  CreditCard, 
  Eye, 
  Send,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { toast } from "sonner"

export function CourseSettingsModal() {
  const { 
    isCourseSettingsModalOpen, 
    setCourseSettingsModalOpen, 
    selectedCourse, 
    updateCourse 
  } = useAppStore()
  
  const [formData, setFormData] = useState(() => ({
    // Basic info
    title: selectedCourse?.title || "",
    shortDescription: selectedCourse?.shortDescription || "",
    longDescription: selectedCourse?.longDescription || "",
    marketplaceCategory: selectedCourse?.marketplaceCategory || "",
    price: selectedCourse?.price?.toString() || "",
    
    // Settings
    aiCreditsDefault: selectedCourse?.settings?.aiCreditsDefault || 10,
    freePreview: selectedCourse?.settings?.freePreview || false,
    introVideo: selectedCourse?.settings?.introVideo || "",
    
    // SEO
    seoSlug: selectedCourse?.settings?.seoSlug || "",
    metaTitle: selectedCourse?.settings?.metaTitle || "",
    metaDescription: selectedCourse?.settings?.metaDescription || "",
    
    // Content
    learningOutcomes: selectedCourse?.settings?.learningOutcomes?.join('\n') || "",
    prerequisites: selectedCourse?.settings?.prerequisites?.join('\n') || "",
    audience: selectedCourse?.settings?.audience || ""
  }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCourse) return

    updateCourse(selectedCourse.id, {
      title: formData.title,
      shortDescription: formData.shortDescription,
      longDescription: formData.longDescription,
      marketplaceCategory: formData.marketplaceCategory,
      price: parseFloat(formData.price),
      settings: {
        ...selectedCourse.settings,
        aiCreditsDefault: formData.aiCreditsDefault,
        freePreview: formData.freePreview,
        introVideo: formData.introVideo,
        seoSlug: formData.seoSlug,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        learningOutcomes: formData.learningOutcomes.split('\n').filter(Boolean),
        prerequisites: formData.prerequisites.split('\n').filter(Boolean),
        audience: formData.audience
      }
    })

    toast.success("Course settings updated successfully!")
    setCourseSettingsModalOpen(false)
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const submitForReview = () => {
    if (!selectedCourse) return
    
    updateCourse(selectedCourse.id, { status: 'in_review' })
    toast.success("Course submitted for review!")
    setCourseSettingsModalOpen(false)
  }

  const publishCourse = () => {
    if (!selectedCourse) return
    
    updateCourse(selectedCourse.id, { status: 'live' })
    toast.success("Course published successfully!")
    setCourseSettingsModalOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary'
      case 'in_review': return 'default'
      case 'live': return 'default'
      case 'disabled': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <CheckCircle className="w-4 h-4" />
      case 'in_review': return <AlertCircle className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  if (!selectedCourse) return null

  return (
    <Dialog open={isCourseSettingsModalOpen} onOpenChange={setCourseSettingsModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Course Settings
          </DialogTitle>
          <DialogDescription>
            Configure your course settings, marketplace listing, and publishing options
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-6">
          <Badge variant={getStatusColor(selectedCourse.status)} className="gap-1">
            {getStatusIcon(selectedCourse.status)}
            {selectedCourse.status.replace('_', ' ').toUpperCase()}
          </Badge>
          
          {selectedCourse.status === 'draft' && (
            <Button size="sm" onClick={submitForReview}>
              <Send className="w-4 h-4 mr-2" />
              Submit for Review
            </Button>
          )}
          
          {selectedCourse.status === 'in_review' && (
            <div className="text-sm text-muted-foreground">
              Under admin review
            </div>
          )}
        </div>
        
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="ai">AI & Credits</TabsTrigger>
            <TabsTrigger value="access">Access Control</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                  <CardDescription>Basic course details and descriptions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description</Label>
                    <Textarea
                      id="shortDescription"
                      value={formData.shortDescription}
                      onChange={(e) => handleChange("shortDescription", e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longDescription">Detailed Description</Label>
                    <Textarea
                      id="longDescription"
                      value={formData.longDescription}
                      onChange={(e) => handleChange("longDescription", e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="learningOutcomes">Learning Outcomes (one per line)</Label>
                      <Textarea
                        id="learningOutcomes"
                        placeholder="Achieve target band score&#10;Master test strategies&#10;Build confidence"
                        value={formData.learningOutcomes}
                        onChange={(e) => handleChange("learningOutcomes", e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prerequisites">Prerequisites (one per line)</Label>
                      <Textarea
                        id="prerequisites"
                        placeholder="Upper-intermediate English&#10;Basic computer skills"
                        value={formData.prerequisites}
                        onChange={(e) => handleChange("prerequisites", e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Input
                      id="audience"
                      placeholder="Students preparing for IELTS exam"
                      value={formData.audience}
                      onChange={(e) => handleChange("audience", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="marketplace" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Marketplace Listing
                  </CardTitle>
                  <CardDescription>How your course appears in the marketplace</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="marketplaceCategory">Marketplace Category</Label>
                    <Select value={formData.marketplaceCategory} onValueChange={(value) => handleChange("marketplaceCategory", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Test Preparation">Test Preparation</SelectItem>
                        <SelectItem value="Business English">Business English</SelectItem>
                        <SelectItem value="Academic English">Academic English</SelectItem>
                        <SelectItem value="Conversation">Conversation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      min="1"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="introVideo">Intro Video URL (optional)</Label>
                    <Input
                      id="introVideo"
                      placeholder="https://..."
                      value={formData.introVideo}
                      onChange={(e) => handleChange("introVideo", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Credits Configuration</CardTitle>
                  <CardDescription>Set default AI credits for exercises in this course</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="aiCreditsDefault">Default AI Credits per Exercise</Label>
                    <Input
                      id="aiCreditsDefault"
                      type="number"
                      value={formData.aiCreditsDefault}
                      onChange={(e) => handleChange("aiCreditsDefault", parseInt(e.target.value))}
                      min="1"
                      max="100"
                    />
                    <p className="text-sm text-muted-foreground">
                      Students will use this many credits per AI-enabled exercise (can be overridden per exercise)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="access" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Access Control
                  </CardTitle>
                  <CardDescription>Configure how students can access your course</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="freePreview">Free Preview</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow students to preview the first lesson before purchase
                      </p>
                    </div>
                    <Switch
                      id="freePreview"
                      checked={formData.freePreview}
                      onCheckedChange={(checked) => handleChange("freePreview", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>Optimize your course for search engines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="seoSlug">URL Slug</Label>
                    <Input
                      id="seoSlug"
                      value={formData.seoSlug}
                      onChange={(e) => handleChange("seoSlug", e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      URL: /courses/{formData.seoSlug}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => handleChange("metaTitle", e.target.value)}
                      maxLength={60}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => handleChange("metaDescription", e.target.value)}
                      maxLength={160}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <Separator />

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCourseSettingsModalOpen(false)}
              >
                Cancel
              </Button>
              
              <div className="flex gap-2">
                <Button type="submit" variant="outline">
                  Save Changes
                </Button>
                
                {selectedCourse.status === 'draft' && (
                  <Button onClick={submitForReview}>
                    <Send className="w-4 h-4 mr-2" />
                    Submit for Review
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}