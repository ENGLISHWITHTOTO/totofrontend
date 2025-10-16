import { useState } from "react"
import { useAppStore } from "../../hooks/useAppStore"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Send } from "lucide-react"
import { toast } from "sonner@2.0.3"

export function MessageModal() {
  const { isMessageModalOpen, setMessageModalOpen, selectedStudent } = useAppStore()
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Please enter a message")
      return
    }

    toast.success(`Message sent to ${selectedStudent?.name}`)
    setMessage("")
    setMessageModalOpen(false)
  }

  if (!selectedStudent) return null

  return (
    <Dialog open={isMessageModalOpen} onOpenChange={(open) => setMessageModalOpen(open)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{selectedStudent.avatar}</AvatarFallback>
            </Avatar>
            Message {selectedStudent.name}
          </DialogTitle>
          <DialogDescription>
            Send a direct message to your student
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setMessageModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleSend} className="flex-1">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}