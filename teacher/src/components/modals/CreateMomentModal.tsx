import { useState } from "react"
import { useAppStore } from "../../hooks/useAppStore"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Camera, Video, Mic } from "lucide-react"
import { toast } from "sonner"

export function CreateMomentModal() {
  const { isCreateMomentModalOpen, setCreateMomentModalOpen } = useAppStore()
  const [content, setContent] = useState("")
  const [attachmentType, setAttachmentType] = useState<string | null>(null)

  const handlePost = () => {
    if (!content.trim()) {
      toast.error("Please write something for your moment")
      return
    }

    toast.success("Moment posted successfully!")
    setContent("")
    setAttachmentType(null)
    setCreateMomentModalOpen(false)
  }

  const attachmentTypes = [
    { type: "photo", label: "Photo", icon: Camera },
    { type: "video", label: "Video", icon: Video },
    { type: "audio", label: "Audio", icon: Mic }
  ]

  return (
    <Dialog open={isCreateMomentModalOpen} onOpenChange={setCreateMomentModalOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create a Moment</DialogTitle>
          <DialogDescription>
            Share an update, tip, or achievement with your students
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="What would you like to share with your students?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {attachmentType && (
            <div className="p-4 border border-dashed rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                {attachmentType === "photo" && "Photo attachment would appear here"}
                {attachmentType === "video" && "Video attachment would appear here"}  
                {attachmentType === "audio" && "Audio attachment would appear here"}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setAttachmentType(null)}
                className="mt-2"
              >
                Remove
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            {attachmentTypes.map((type) => {
              const Icon = type.icon
              return (
                <Button
                  key={type.type}
                  variant={attachmentType === type.type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAttachmentType(type.type)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {type.label}
                </Button>
              )
            })}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setCreateMomentModalOpen(false)
                setContent("")
                setAttachmentType(null)
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handlePost} className="flex-1">
              Post Moment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}