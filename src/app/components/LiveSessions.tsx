import { useState } from "react"
import { Calendar as CalendarIcon, Clock, MessageSquare, Video, X, Copy, Trash2, Globe, Check, ChevronLeft, ChevronRight, Filter, ChevronDown, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Calendar } from "./ui/calendar"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { AvailabilityPreviewModal } from "./modals/AvailabilityPreviewModal"

export function LiveSessions() {
  const [selectedTimeZone, setSelectedTimeZone] = useState('UTC-5 (EST)')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isDragging, setIsDragging] = useState(false)
  const [dragMode, setDragMode] = useState<'available' | 'unavailable'>('available')
  const [sessionFilter, setSessionFilter] = useState('all')
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Store availability per date (dateString -> array of 24 hours)
  const [dateAvailability, setDateAvailability] = useState<Record<string, boolean[]>>({
    '2025-10-02': [false, false, false, false, false, false, false, false, true, true, true, true, false, true, true, true, true, false, false, false, false, false, false, false],
    '2025-10-03': [false, false, false, false, false, false, false, false, true, true, true, true, false, true, true, true, true, false, false, false, false, false, false, false],
    '2025-10-07': [false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false],
    '2025-10-09': [false, false, false, false, false, false, false, false, true, true, true, true, false, true, true, true, true, false, false, false, false, false, false, false],
  })

  // Get date string in YYYY-MM-DD format
  const getDateString = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  // Get availability for a specific date
  const getAvailabilityForDate = (date: Date): boolean[] => {
    const dateStr = getDateString(date)
    return dateAvailability[dateStr] || Array(24).fill(false)
  }

  // Check if a date has any availability
  const hasAvailability = (date: Date): boolean => {
    const dateStr = getDateString(date)
    return dateAvailability[dateStr]?.some(slot => slot) || false
  }

  const toggleTimeSlot = (hour: number) => {
    if (!selectedDate) return
    const dateStr = getDateString(selectedDate)
    
    setDateAvailability(prev => {
      const currentSchedule = prev[dateStr] || Array(24).fill(false)
      const newSchedule = currentSchedule.map((slot, index) => 
        index === hour ? !slot : slot
      )
      return {
        ...prev,
        [dateStr]: newSchedule
      }
    })
  }

  const handleSlotMouseDown = (hour: number) => {
    if (!selectedDate) return
    setIsDragging(true)
    const schedule = getAvailabilityForDate(selectedDate)
    const currentValue = schedule[hour]
    setDragMode(currentValue ? 'unavailable' : 'available')
    toggleTimeSlot(hour)
  }

  const handleSlotMouseEnter = (hour: number) => {
    if (!selectedDate || !isDragging) return
    const schedule = getAvailabilityForDate(selectedDate)
    const currentValue = schedule[hour]
    const shouldChange = dragMode === 'available' ? !currentValue : currentValue
    if (shouldChange) {
      toggleTimeSlot(hour)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const clearDateSchedule = () => {
    if (!selectedDate) return
    const dateStr = getDateString(selectedDate)
    setDateAvailability(prev => {
      const updated = { ...prev }
      delete updated[dateStr]
      return updated
    })
  }

  const copyDateSchedule = () => {
    if (!selectedDate) return
    const schedule = getAvailabilityForDate(selectedDate)
    localStorage.setItem('copiedSchedule', JSON.stringify(schedule))
  }

  const pasteDateSchedule = () => {
    if (!selectedDate) return
    const copiedSchedule = localStorage.getItem('copiedSchedule')
    if (!copiedSchedule) return
    
    const dateStr = getDateString(selectedDate)
    setDateAvailability(prev => ({
      ...prev,
      [dateStr]: JSON.parse(copiedSchedule)
    }))
  }

  const applyTemplateToWeek = () => {
    if (!selectedDate) return
    
    const template = [false, false, false, false, false, false, false, false, true, true, true, true, false, true, true, true, true, false, false, false, false, false, false, false]
    
    const date = new Date(selectedDate)
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(date.setDate(diff))
    
    const updates: Record<string, boolean[]> = {}
    for (let i = 0; i < 5; i++) {
      const weekday = new Date(monday)
      weekday.setDate(monday.getDate() + i)
      updates[getDateString(weekday)] = template
    }
    
    setDateAvailability(prev => ({
      ...prev,
      ...updates
    }))
  }

  const clearMonthSchedule = () => {
    const month = currentMonth.getMonth()
    const year = currentMonth.getFullYear()
    
    setDateAvailability(prev => {
      const updated = { ...prev }
      Object.keys(updated).forEach(dateStr => {
        const date = new Date(dateStr)
        if (date.getMonth() === month && date.getFullYear() === year) {
          delete updated[dateStr]
        }
      })
      return updated
    })
  }

  const bookedSessions = [
    {
      id: 1,
      student: "Maria Garcia",
      avatar: "MG",
      date: "Today",
      time: "2:00 PM - 3:00 PM",
      fullDate: "Oct 2, 2025",
      topic: "Business English Conversation",
      status: "confirmed",
      meetingLink: "meet.zoom.us/j/123456789"
    },
    {
      id: 2,
      student: "John Smith",
      avatar: "JS",
      date: "Today",
      time: "4:30 PM - 5:30 PM",
      fullDate: "Oct 2, 2025",
      topic: "IELTS Speaking Preparation",
      status: "confirmed",
      meetingLink: "meet.zoom.us/j/987654321"
    },
    {
      id: 3,
      student: "Lisa Wang",
      avatar: "LW",
      date: "Tomorrow",
      time: "10:00 AM - 11:00 AM",
      fullDate: "Oct 3, 2025",
      topic: "Grammar Fundamentals",
      status: "pending",
      meetingLink: ""
    },
    {
      id: 4,
      student: "Ahmed Hassan",
      avatar: "AH",
      date: "Oct 5",
      time: "3:00 PM - 4:00 PM",
      fullDate: "Oct 5, 2025",
      topic: "Pronunciation Practice",
      status: "confirmed",
      meetingLink: "meet.zoom.us/j/456789123"
    }
  ]

  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)

  const formatTime = (hour24: number): string => {
    if (hour24 === 0) return '12 AM'
    if (hour24 === 12) return '12 PM'
    if (hour24 < 12) return `${hour24} AM`
    return `${hour24 - 12} PM`
  }

  const formatTimeRange = (hour24: number): string => {
    const start = formatTime(hour24)
    const end = formatTime((hour24 + 1) % 24)
    return `${start} - ${end}`
  }

  const formatDateForDisplay = (date: Date): string => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getMonthName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Filter sessions
  const filteredSessions = bookedSessions.filter(session => {
    if (sessionFilter === 'all') return true
    if (sessionFilter === 'today') return session.date === 'Today'
    if (sessionFilter === 'pending') return session.status === 'pending'
    if (sessionFilter === 'confirmed') return session.status === 'confirmed'
    return true
  })

  // Calculate stats
  const totalSessions = bookedSessions.length
  const pendingSessions = bookedSessions.filter(s => s.status === 'pending').length
  const todaySessions = bookedSessions.filter(s => s.date === 'Today').length
  const availableDates = Object.keys(dateAvailability).length

  return (
    <div className="space-y-4" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1>Live Sessions</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage availability and sessions</p>
        </div>
        
        {/* Quick Stats & Preview */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-3">
            <div className="px-3 py-2 bg-card border border-border rounded-lg">
              <div className="text-xs text-muted-foreground">Today</div>
              <div className="font-semibold">{todaySessions}</div>
            </div>
            <div className="px-3 py-2 bg-card border border-border rounded-lg">
              <div className="text-xs text-muted-foreground">Pending</div>
              <div className="font-semibold text-amber-500">{pendingSessions}</div>
            </div>
            <div className="px-3 py-2 bg-card border border-border rounded-lg">
              <div className="text-xs text-muted-foreground">Available</div>
              <div className="font-semibold text-emerald-500">{availableDates}</div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(true)}
            className="hover:bg-primary/10 hover:border-primary/50"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList className="grid w-full sm:w-auto sm:inline-grid grid-cols-2">
          <TabsTrigger value="sessions">Sessions ({totalSessions})</TabsTrigger>
          <TabsTrigger value="calendar">Set Availability</TabsTrigger>
        </TabsList>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-card border border-border rounded-lg">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-2">
              <Button
                variant={sessionFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSessionFilter('all')}
              >
                All
              </Button>
              <Button
                variant={sessionFilter === 'today' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSessionFilter('today')}
              >
                Today
              </Button>
              <Button
                variant={sessionFilter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSessionFilter('pending')}
              >
                Pending
              </Button>
              <Button
                variant={sessionFilter === 'confirmed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSessionFilter('confirmed')}
              >
                Confirmed
              </Button>
            </div>
          </div>

          {/* Compact Sessions List */}
          <div className="space-y-2">
            {filteredSessions.map((session) => (
              <Card key={session.id} className="overflow-hidden border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 p-4">
                    {/* Time Badge */}
                    <div className="shrink-0 w-16 text-center">
                      <div className="font-semibold text-sm">{session.time.split(' - ')[0]}</div>
                      <div className="text-xs text-muted-foreground">{session.date}</div>
                    </div>

                    {/* Divider */}
                    <div className="h-12 w-px bg-border"></div>

                    {/* Student Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-violet-600/20 text-primary">
                          {session.avatar}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm truncate">{session.student}</h3>
                          <Badge variant={getStatusColor(session.status)} className="shrink-0 text-xs py-0 h-5">
                            {session.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{session.topic}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 shrink-0">
                      {session.status === "pending" && (
                        <>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-emerald-500/10 hover:text-emerald-600">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive">
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      {session.status === "confirmed" && (
                        <>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-primary/10">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button size="sm" className="h-8 px-3 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90">
                            <Video className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline text-xs">Join</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Meeting Link - Collapsible */}
                  {session.meetingLink && (
                    <div className="px-4 pb-3">
                      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border/50">
                        <p className="text-xs font-mono truncate flex-1">{session.meetingLink}</p>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="shrink-0 h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary"
                          onClick={() => navigator.clipboard.writeText(session.meetingLink)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4">
          {/* Collapsible Settings */}
          <Collapsible open={showAdvancedSettings} onOpenChange={setShowAdvancedSettings}>
            <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <Select value={selectedTimeZone} onValueChange={setSelectedTimeZone}>
                  <SelectTrigger className="w-36 h-8 border-border/50 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC-8 (PST)">UTC-8 (PST)</SelectItem>
                    <SelectItem value="UTC-5 (EST)">UTC-5 (EST)</SelectItem>
                    <SelectItem value="UTC+0 (GMT)">UTC+0 (GMT)</SelectItem>
                    <SelectItem value="UTC+1 (CET)">UTC+1 (CET)</SelectItem>
                    <SelectItem value="UTC+8 (CST)">UTC+8 (CST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8">
                  <span className="text-xs mr-1">Settings</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedSettings ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="space-y-3">
              <div className="p-3 bg-card border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-accept" className="text-sm">
                    Auto-accept bookings
                  </Label>
                  <Switch id="auto-accept" />
                </div>
                
                <div className="pt-3 border-t border-border flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={applyTemplateToWeek}
                    disabled={!selectedDate}
                  >
                    <Copy className="w-3 h-3 mr-2" />
                    Apply to Week
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearMonthSchedule}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Clear Month
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Compact Calendar & Time Grid */}
          <div className="grid lg:grid-cols-[340px_1fr] gap-4">
            {/* Calendar Section - More Compact */}
            <Card>
              <CardHeader className="pb-2 space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{getMonthName(currentMonth)}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={goToPreviousMonth}
                      className="h-7 w-7 p-0"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={goToToday}
                      className="h-7 px-2 text-xs"
                    >
                      Today
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={goToNextMonth}
                      className="h-7 w-7 p-0"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="rounded-md border-0 p-0"
                  modifiers={{
                    available: (date) => hasAvailability(date)
                  }}
                  modifiersClassNames={{
                    available: "bg-emerald-500/20 text-emerald-600 font-semibold hover:bg-emerald-500/30"
                  }}
                />
                
                {/* Compact Legend */}
                <div className="pt-3 border-t border-border space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-muted-foreground">Selected</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40"></div>
                    <span className="text-muted-foreground">Has availability</span>
                  </div>
                </div>

                {/* Selected Date Info - Compact */}
                {selectedDate && (
                  <div className="p-2.5 bg-muted/50 rounded-lg">
                    <p className="text-xs font-medium mb-0.5">
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    {hasAvailability(selectedDate) && (
                      <p className="text-xs text-emerald-600">
                        {getAvailabilityForDate(selectedDate).filter(slot => slot).length} hours available
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Time Slots Section - Compact */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {selectedDate ? formatDateForDisplay(selectedDate) : 'Select a Date'}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {selectedDate ? 'Click & drag to set hours' : 'Choose a date to begin'}
                    </CardDescription>
                  </div>
                  {selectedDate && (
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyDateSchedule}
                        className="h-7 w-7 p-0"
                        title="Copy"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={pasteDateSchedule}
                        className="h-7 px-2 text-xs"
                        title="Paste"
                      >
                        Paste
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearDateSchedule}
                        className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                        title="Clear"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!selectedDate ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <CalendarIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Select a date from the calendar</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Compact Legend */}
                    <div className="flex items-center gap-4 px-3 py-2 bg-muted/30 rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/40 rounded flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                        </div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-muted border border-border/50 rounded"></div>
                        <span>Unavailable</span>
                      </div>
                    </div>

                    {/* Compact Time Grid - 4 columns on mobile, 6 on desktop */}
                    <div className="grid grid-cols-4 lg:grid-cols-6 gap-1.5 max-h-[400px] overflow-y-auto pr-1 smooth-scroll">
                      {hours.slice(6, 22).map((hour, hourIndex) => {
                        const hour24 = hourIndex + 6
                        const schedule = getAvailabilityForDate(selectedDate)
                        const isAvailable = schedule[hour24]
                        
                        return (
                          <button
                            key={hourIndex}
                            className={`h-12 rounded-lg transition-all select-none flex flex-col items-center justify-center ${
                              isAvailable 
                                ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/40 hover:from-emerald-500/30 hover:to-green-500/30' 
                                : 'bg-muted/50 hover:bg-muted border border-border/40 hover:border-border/50'
                            }`}
                            onMouseDown={() => handleSlotMouseDown(hour24)}
                            onMouseEnter={() => handleSlotMouseEnter(hour24)}
                            onTouchStart={() => handleSlotMouseDown(hour24)}
                            style={{ userSelect: 'none' }}
                            title={formatTimeRange(hour24)}
                          >
                            <span className="font-medium text-xs">{formatTime(hour24)}</span>
                            {isAvailable && <Check className="w-3 h-3 text-emerald-600 mt-0.5" />}
                          </button>
                        )
                      })}
                    </div>

                    {/* Save Button - Sticky at bottom */}
                    <div className="pt-3 border-t border-border">
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90"
                        size="sm"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Save Availability
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      <AvailabilityPreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        dateAvailability={dateAvailability}
        selectedTimeZone={selectedTimeZone}
      />
    </div>
  )
}