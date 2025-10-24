import { useState } from "react"
import { useAppStore } from "../../hooks/useAppStore"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Label } from "../ui/label"
import { Upload, FileText, Image, Music, Video } from "lucide-react"
import { toast } from "sonner"

export function UploadFileModal() {
  const { isUploadFileModalOpen, setUploadFileModalOpen, addLibraryItem } = useAppStore()
  
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    category: "",
    size: ""
  })

  const [isDragOver, setIsDragOver] = useState(false)

  const fileTypes = [
    { value: "pdf", label: "PDF Document", icon: FileText },
    { value: "presentation", label: "Presentation", icon: FileText },
    { value: "image", label: "Image", icon: Image },
    { value: "audio", label: "Audio", icon: Music },
    { value: "video", label: "Video", icon: Video }
  ]

  const categories = [
    "IELTS", "Business English", "Grammar", "Pronunciation", 
    "Conversation", "Writing", "Reading", "Listening", "Vocabulary"
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.type || !formData.category) {
      toast.error("Please fill in all required fields")
      return
    }

    addLibraryItem({
      name: formData.name,
      type: formData.type,
      category: formData.category,
      size: formData.size || "2.1 MB"
    })

    toast.success("File uploaded successfully!")
    
    // Reset form
    setFormData({
      name: "",
      type: "",
      category: "",
      size: ""
    })
    
    setUploadFileModalOpen(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const file = files[0]
      setFormData(prev => ({
        ...prev,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      }))
    }
  }

  return (
    <Dialog open={isUploadFileModalOpen} onOpenChange={setUploadFileModalOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Add new teaching materials to your library
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop your file here, or click to browse
            </p>
            <Button type="button" variant="outline" size="sm">
              Choose File
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filename">File Name *</Label>
            <Input
              id="filename"
              placeholder="e.g., Grammar Rules Guide.pdf"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filetype">File Type *</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select file type" />
              </SelectTrigger>
              <SelectContent>
                {fileTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">File Size</Label>
            <Input
              id="size"
              placeholder="e.g., 2.4 MB"
              value={formData.size}
              onChange={(e) => handleChange("size", e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setUploadFileModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Upload File
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}