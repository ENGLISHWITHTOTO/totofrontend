import { useState } from "react"
import { useAppStore } from "../../hooks/useAppStore"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { FolderPlus, FileText } from "lucide-react"
import { toast } from "sonner@2.0.3"

interface AddContentModalProps {
  isOpen: boolean
  onClose: () => void
  courseId: string
  parentId: string | null
  parentTitle?: string
}

export function AddContentModal({ isOpen, onClose, courseId, parentId, parentTitle }: AddContentModalProps) {
  const { addSubcategory, courses, setCourses } = useAppStore()
  
  const [contentType, setContentType] = useState<"subcategory" | "lesson">("subcategory")
  const [title, setTitle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error("Please enter a title")
      return
    }

    if (contentType === "subcategory") {
      const newSubcategory = {
        title: title.trim(),
        type: "subcategory" as const,
        children: [],
        parentId
      }
      
      // Add to course structure
      setCourses(prev => prev.map(course => {
        if (course.id === courseId) {
          const addToStructure = (items: any[], targetParentId: string | null): any[] => {
            if (targetParentId === null) {
              // Add to root level
              return [...items, { 
                ...newSubcategory, 
                id: `sub-${Date.now()}` 
              }]
            }
            
            return items.map(item => {
              if (item.id === targetParentId) {
                return {
                  ...item,
                  children: [...(item.children || []), { 
                    ...newSubcategory, 
                    id: `sub-${Date.now()}` 
                  }]
                }
              }
              if (item.children) {
                return {
                  ...item,
                  children: addToStructure(item.children, targetParentId)
                }
              }
              return item
            })
          }
          
          return {
            ...course,
            structure: addToStructure(course.structure, parentId),
            updatedAt: new Date().toISOString()
          }
        }
        return course
      }))
    } else {
      // Add lesson
      const newLesson = {
        id: `lesson-${Date.now()}`,
        title: title.trim(),
        status: "draft" as const,
        blocks: [],
        visibility: "draft" as const,
        version: 1,
        lastModified: new Date().toISOString()
      }
      
      const lessonItem = {
        id: `item-${Date.now()}`,
        title: title.trim(),
        type: "lesson" as const,
        lesson: newLesson,
        parentId
      }
      
      setCourses(prev => prev.map(course => {
        if (course.id === courseId) {
          const addToStructure = (items: any[], targetParentId: string | null): any[] => {
            if (targetParentId === null) {
              return [...items, lessonItem]
            }
            
            return items.map(item => {
              if (item.id === targetParentId) {
                return {
                  ...item,
                  children: [...(item.children || []), lessonItem]
                }
              }
              if (item.children) {
                return {
                  ...item,
                  children: addToStructure(item.children, targetParentId)
                }
              }
              return item
            })
          }
          
          return {
            ...course,
            structure: addToStructure(course.structure, parentId),
            updatedAt: new Date().toISOString()
          }
        }
        return course
      }))
    }

    toast.success(`${contentType === 'subcategory' ? 'Subcategory' : 'Lesson'} added successfully!`)
    setTitle("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
          <DialogDescription>
            {parentTitle ? `Add content to "${parentTitle}"` : "Add content to course root"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>Content Type</Label>
            <RadioGroup value={contentType} onValueChange={(value) => setContentType(value as "subcategory" | "lesson")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="subcategory" id="subcategory" />
                <Label htmlFor="subcategory" className="flex items-center gap-2 cursor-pointer">
                  <FolderPlus className="w-4 h-4" />
                  Subcategory (can contain lessons and other subcategories)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lesson" id="lesson" />
                <Label htmlFor="lesson" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="w-4 h-4" />
                  Lesson (contains learning content and exercises)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              {contentType === "subcategory" ? "Subcategory" : "Lesson"} Title
            </Label>
            <Input
              id="title"
              placeholder={contentType === "subcategory" ? "e.g., Reading Skills" : "e.g., Academic Reading Techniques"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add {contentType === "subcategory" ? "Subcategory" : "Lesson"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}