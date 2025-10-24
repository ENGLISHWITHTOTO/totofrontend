import { useState } from "react"
import { useAppStore } from "../../hooks/useAppStore"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"
import { X } from "lucide-react"
import { toast } from "sonner"

export function CreateCourseModal() {
  const { isCreateCourseModalOpen, setCreateCourseModalOpen, addCourse, setActiveSection } = useAppStore()
  
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    targetLevel: "",
    language: "English",
    estimatedDuration: "",
    marketplaceCategory: "",
    price: "",
    currency: "USD"
  })

  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")

  const marketplaceCategories = [
    "Test Preparation",
    "Business English", 
    "Academic English",
    "Conversation",
    "Grammar",
    "Pronunciation",
    "Writing Skills",
    "Reading Skills",
    "Listening Skills",
    "Vocabulary",
    "Kids English",
    "Special Purposes"
  ]

  const targetLevels = [
    "Beginner (A1)",
    "Elementary (A2)", 
    "Intermediate (B1)",
    "Upper-Intermediate (B2)",
    "Advanced (C1)",
    "Proficiency (C2)",
    "Mixed Levels"
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.shortDescription || !formData.marketplaceCategory || !formData.price) {
      toast.error("Please fill in all required fields")
      return
    }

    addCourse({
      title: formData.title,
      cover: "",
      shortDescription: formData.shortDescription,
      longDescription: formData.longDescription,
      targetLevel: formData.targetLevel,
      language: formData.language,
      estimatedDuration: formData.estimatedDuration,
      tags: tags,
      marketplaceCategory: formData.marketplaceCategory,
      status: "draft",
      price: parseFloat(formData.price),
      currency: formData.currency,
      structure: [],
      settings: {
        aiCreditsDefault: 10,
        freePreview: false,
        learningOutcomes: [],
        prerequisites: [],
        audience: "",
        seoSlug: formData.title.toLowerCase().replace(/\s+/g, '-'),
        metaTitle: formData.title,
        metaDescription: formData.shortDescription
      }
    })

    toast.success("Course created successfully!")
    
    // Reset form
    setFormData({
      title: "",
      shortDescription: "",
      longDescription: "",
      targetLevel: "",
      language: "English",
      estimatedDuration: "",
      marketplaceCategory: "",
      price: "",
      currency: "USD"
    })
    setTags([])
    
    // Close modal and navigate to course builder
    setCreateCourseModalOpen(false)
    setActiveSection("lesson-builder")
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags(prev => [...prev, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  return (
    <Dialog open={isCreateCourseModalOpen} onOpenChange={setCreateCourseModalOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
          <DialogDescription>
            Create a new course to sell on the marketplace
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-medium">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                placeholder="e.g., IELTS Preparation Masterclass"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Textarea
                id="shortDescription"
                placeholder="Brief description that appears in course listings"
                value={formData.shortDescription}
                onChange={(e) => handleChange("shortDescription", e.target.value)}
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription">Detailed Description</Label>
              <Textarea
                id="longDescription"
                placeholder="Comprehensive course description for the course page"
                value={formData.longDescription}
                onChange={(e) => handleChange("longDescription", e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Course Details */}
          <div className="space-y-4">
            <h3 className="font-medium">Course Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetLevel">Target Level</Label>
                <Select value={formData.targetLevel} onValueChange={(value) => handleChange("targetLevel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={formData.language} onValueChange={(value) => handleChange("language", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Chinese">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">Estimated Duration</Label>
              <Input
                id="estimatedDuration"
                placeholder="e.g., 40 hours, 6 weeks"
                value={formData.estimatedDuration}
                onChange={(e) => handleChange("estimatedDuration", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag}>Add</Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Marketplace Settings */}
          <div className="space-y-4">
            <h3 className="font-medium">Marketplace Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="marketplaceCategory">Marketplace Category *</Label>
              <Select value={formData.marketplaceCategory} onValueChange={(value) => handleChange("marketplaceCategory", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {marketplaceCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="99.00"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => handleChange("currency", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateCourseModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Course
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}