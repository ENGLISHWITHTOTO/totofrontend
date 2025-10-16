import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { ScrollArea } from "../ui/scroll-area"
import { Alert, AlertDescription } from "../ui/alert"
import { 
  BookOpen, 
  User, 
  Sparkles, 
  Search, 
  TrendingUp,
  CalendarIcon,
  DollarSign,
  AlertCircle,
  ChevronRight,
  Check
} from "lucide-react"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Separator } from "../ui/separator"
import { cn } from "../ui/utils"

interface CreatePromotionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (promotionData: any) => void
  pricing: {
    carousel: number
    searchBoost: number
    both: number
  }
  bookedSlots: {
    carousel: string[]
    searchBoost: string[]
  }
}

export function CreatePromotionModal({ 
  open, 
  onOpenChange,
  onConfirm,
  pricing,
  bookedSlots
}: CreatePromotionModalProps) {
  const [currentTab, setCurrentTab] = useState("target")
  const [promoteTarget, setPromoteTarget] = useState<"profile" | "course">("course")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [promotionType, setPromotionType] = useState<"carousel" | "searchBoost" | "both">("both")
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [errors, setErrors] = useState<string[]>([])

  // Mock courses
  const courses = [
    { id: "1", name: "Business English Course" },
    { id: "2", name: "IELTS Preparation Course" },
    { id: "3", name: "Conversation Mastery" },
    { id: "4", name: "Grammar Fundamentals" }
  ]

  const calculateDays = () => {
    if (!startDate || !endDate) return 0
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const calculateCost = () => {
    const days = calculateDays()
    if (days === 0) return 0
    
    const dailyRate = promotionType === "carousel" 
      ? pricing.carousel 
      : promotionType === "searchBoost" 
        ? pricing.searchBoost 
        : pricing.both
    
    return days * dailyRate
  }

  const getDateString = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  const isDateBooked = (date: Date): boolean => {
    const dateStr = getDateString(date)
    
    if (promotionType === "carousel") {
      return bookedSlots.carousel.includes(dateStr)
    } else if (promotionType === "searchBoost") {
      return bookedSlots.searchBoost.includes(dateStr)
    } else {
      return bookedSlots.carousel.includes(dateStr) || bookedSlots.searchBoost.includes(dateStr)
    }
  }

  const validateAndProceed = (nextTab: string) => {
    const newErrors: string[] = []
    
    // Validate current tab
    if (currentTab === "target" && promoteTarget === "course" && !selectedCourse) {
      newErrors.push("Please select a course to promote")
    }
    
    if (currentTab === "dates") {
      if (!startDate || !endDate) {
        newErrors.push("Please select both start and end dates")
      } else if (startDate > endDate) {
        newErrors.push("End date must be after start date")
      } else {
        // Check for overlapping dates
        const currentDate = new Date(startDate)
        while (currentDate <= endDate) {
          if (isDateBooked(currentDate)) {
            newErrors.push("Selected dates overlap with existing promotions")
            break
          }
          currentDate.setDate(currentDate.getDate() + 1)
        }
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors([])
    setCurrentTab(nextTab)
  }

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      setErrors(["Please complete all required fields"])
      return
    }

    if (promoteTarget === "course" && !selectedCourse) {
      setErrors(["Please select a course to promote"])
      return
    }

    const promotionData = {
      target: promoteTarget === "profile" ? "Teacher Profile" : courses.find(c => c.id === selectedCourse)?.name,
      targetType: promoteTarget,
      type: promotionType === "carousel" ? "Carousel" : promotionType === "searchBoost" ? "Search Boost" : "Both",
      startDate,
      endDate,
      days: calculateDays(),
      cost: calculateCost()
    }

    onConfirm(promotionData)
  }

  const resetForm = () => {
    setCurrentTab("target")
    setPromoteTarget("course")
    setSelectedCourse("")
    setPromotionType("both")
    setStartDate(undefined)
    setEndDate(undefined)
    setErrors([])
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatDateShort = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
  }

  const canProceedToType = promoteTarget === "profile" || (promoteTarget === "course" && selectedCourse)
  const canProceedToDates = canProceedToType && promotionType
  const canSubmit = canProceedToDates && startDate && endDate

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open)
      if (!open) resetForm()
    }}>
      <DialogContent className="max-w-2xl p-0 gap-0 max-h-[90vh]">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Create New Promotion</DialogTitle>
          <DialogDescription>
            Promote your profile or courses to reach more students
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1 flex flex-col">
          <div className="px-6 border-b border-border">
            <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="target" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                    currentTab === "target" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    1
                  </div>
                  <span className="hidden sm:inline">Target</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="type"
                disabled={!canProceedToType}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                    currentTab === "type" ? "bg-primary text-primary-foreground" : 
                    canProceedToType ? "bg-muted text-muted-foreground" : "bg-muted/50 text-muted-foreground/50"
                  )}>
                    2
                  </div>
                  <span className="hidden sm:inline">Type</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="dates"
                disabled={!canProceedToDates}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                    currentTab === "dates" ? "bg-primary text-primary-foreground" : 
                    canProceedToDates ? "bg-muted text-muted-foreground" : "bg-muted/50 text-muted-foreground/50"
                  )}>
                    3
                  </div>
                  <span className="hidden sm:inline">Dates</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 max-h-[calc(90vh-280px)]">
            <div className="p-6 space-y-6">
              {/* Errors */}
              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errors.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </AlertDescription>
                </Alert>
              )}

              {/* Tab 1: Target Selection */}
              <TabsContent value="target" className="mt-0 space-y-4">
                <div className="space-y-3">
                  <Label>What would you like to promote?</Label>
                  <RadioGroup value={promoteTarget} onValueChange={(value: any) => setPromoteTarget(value)}>
                    <div className="grid gap-3">
                      <label
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          promoteTarget === "profile" 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <RadioGroupItem value="profile" id="profile" />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Teacher Profile</p>
                            <p className="text-xs text-muted-foreground">Boost your visibility</p>
                          </div>
                        </div>
                        {promoteTarget === "profile" && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </label>

                      <label
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          promoteTarget === "course" 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <RadioGroupItem value="course" id="course" />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-violet-500" />
                          </div>
                          <div>
                            <p className="font-medium">Course</p>
                            <p className="text-xs text-muted-foreground">Promote a specific course</p>
                          </div>
                        </div>
                        {promoteTarget === "course" && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                {promoteTarget === "course" && (
                  <div className="space-y-3">
                    <Label>Select Course</Label>
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Choose a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </TabsContent>

              {/* Tab 2: Promotion Type */}
              <TabsContent value="type" className="mt-0 space-y-4">
                <div className="space-y-3">
                  <Label>Choose Promotion Type</Label>
                  <RadioGroup value={promotionType} onValueChange={(value: any) => setPromotionType(value)}>
                    <div className="space-y-3">
                      <label
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          promotionType === "carousel" 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <RadioGroupItem value="carousel" id="carousel" className="mt-1" />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-primary" />
                              <p className="font-medium">Carousel Promotion</p>
                            </div>
                            <Badge variant="outline" className="text-primary border-primary/30">
                              ${pricing.carousel}/day
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Featured in homepage carousel - maximum visibility
                          </p>
                        </div>
                        {promotionType === "carousel" && (
                          <Check className="w-5 h-5 text-primary mt-1" />
                        )}
                      </label>

                      <label
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          promotionType === "searchBoost" 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <RadioGroupItem value="searchBoost" id="searchBoost" className="mt-1" />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Search className="w-4 h-4 text-violet-500" />
                              <p className="font-medium">Search Boost</p>
                            </div>
                            <Badge variant="outline" className="text-violet-500 border-violet-500/30">
                              ${pricing.searchBoost}/day
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Appear at the top of search results
                          </p>
                        </div>
                        {promotionType === "searchBoost" && (
                          <Check className="w-5 h-5 text-primary mt-1" />
                        )}
                      </label>

                      <label
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          promotionType === "both" 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <RadioGroupItem value="both" id="both" className="mt-1" />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-emerald-500" />
                              <p className="font-medium">Both (Bundle)</p>
                              <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 text-xs">
                                Save ${pricing.carousel + pricing.searchBoost - pricing.both}
                              </Badge>
                            </div>
                            <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
                              ${pricing.both}/day
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Carousel + Search Boost for maximum reach
                          </p>
                        </div>
                        {promotionType === "both" && (
                          <Check className="w-5 h-5 text-primary mt-1" />
                        )}
                      </label>
                    </div>
                  </RadioGroup>
                </div>
              </TabsContent>

              {/* Tab 3: Dates & Summary */}
              <TabsContent value="dates" className="mt-0 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-11",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? formatDate(startDate) : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          disabled={(date) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            if (date < today) return true
                            return isDateBooked(date)
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-11",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? formatDate(endDate) : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            if (date < today) return true
                            if (startDate && date < startDate) return true
                            return isDateBooked(date)
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Cost Summary */}
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-violet-600/5">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-3">Cost Summary</p>
                      
                      <div className="space-y-2.5 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Promotion Type</span>
                          <span className="font-medium">
                            {promotionType === "carousel" ? "Carousel" : promotionType === "searchBoost" ? "Search Boost" : "Both (Bundle)"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Duration</span>
                          <span className="font-medium">{calculateDays()} days</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Rate per day</span>
                          <span className="font-medium">
                            ${promotionType === "carousel" 
                              ? pricing.carousel 
                              : promotionType === "searchBoost" 
                                ? pricing.searchBoost 
                                : pricing.both
                            }
                          </span>
                        </div>

                        <Separator className="my-2" />

                        <div className="flex items-center justify-between">
                          <span className="font-medium">Total Cost</span>
                          <span className="text-xl font-semibold text-primary">
                            ${calculateCost()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {startDate && endDate && (
                      <div className="p-3 bg-card/50 rounded-lg border border-border/50">
                        <div className="flex items-start gap-2 text-xs">
                          <CalendarIcon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium mb-1">Selected Period</p>
                            <p className="text-muted-foreground">
                              {formatDateShort(startDate)} - {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-200">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <AlertDescription className="text-xs">
                        Promotion requires admin approval. You'll be notified within 24-48 hours.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-border flex gap-3">
            {currentTab !== "target" && (
              <Button
                variant="outline"
                onClick={() => {
                  const tabs = ["target", "type", "dates"]
                  const currentIndex = tabs.indexOf(currentTab)
                  if (currentIndex > 0) {
                    setCurrentTab(tabs[currentIndex - 1])
                    setErrors([])
                  }
                }}
              >
                Back
              </Button>
            )}
            
            <div className="flex-1" />
            
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            {currentTab === "dates" ? (
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Book Promotion
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (currentTab === "target") {
                    validateAndProceed("type")
                  } else if (currentTab === "type") {
                    validateAndProceed("dates")
                  }
                }}
                disabled={currentTab === "target" ? !canProceedToType : !canProceedToDates}
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
