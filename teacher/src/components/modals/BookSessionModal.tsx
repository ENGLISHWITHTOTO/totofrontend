import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Label } from "../ui/label"
import { Calendar, Clock, User } from "lucide-react"
import { toast } from "sonner@2.0.3"

interface BookSessionModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate?: string
  selectedTime?: string
}

export function BookSessionModal({ isOpen, onClose, selectedDate, selectedTime }: BookSessionModalProps) {
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    sessionType: "",
    duration: "",
    notes: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.studentName || !formData.email || !formData.sessionType || !formData.duration) {
      toast.error("Please fill in all required fields")
      return
    }

    toast.success(`Session booked with ${formData.studentName} for ${selectedDate} at ${selectedTime}`)
    
    // Reset form
    setFormData({
      studentName: "",
      email: "",
      sessionType: "",
      duration: "",
      notes: ""
    })
    
    onClose()
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const sessionTypes = [
    "Conversation Practice",
    "IELTS Preparation",
    "Business English",
    "Grammar Focus",
    "Pronunciation Training",
    "Writing Review"
  ]

  const durations = [
    { value: "30", label: "30 minutes - $25" },
    { value: "45", label: "45 minutes - $35" },
    { value: "60", label: "60 minutes - $45" },
    { value: "90", label: "90 minutes - $60" }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Book Live Session
          </DialogTitle>
          <DialogDescription>
            Schedule a new live session with a student
          </DialogDescription>
        </DialogHeader>
        
        {selectedDate && selectedTime && (
          <div className="p-3 bg-primary/5 rounded-lg text-sm">
            <div className="flex items-center gap-2 text-primary">
              <Clock className="w-4 h-4" />
              <span>{selectedDate} at {selectedTime}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentName">Student Name *</Label>
            <Input
              id="studentName"
              placeholder="Enter student's name"
              value={formData.studentName}
              onChange={(e) => handleChange("studentName", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Student Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="student@example.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionType">Session Type *</Label>
            <Select value={formData.sessionType} onValueChange={(value) => handleChange("sessionType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent>
                {sessionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration & Price *</Label>
            <Select value={formData.duration} onValueChange={(value) => handleChange("duration", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durations.map((duration) => (
                  <SelectItem key={duration.value} value={duration.value}>
                    {duration.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Session Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any specific topics or requirements for this session"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Book Session
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}