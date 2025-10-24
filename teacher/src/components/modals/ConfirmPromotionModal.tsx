import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { 
  Check,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertCircle,
  Sparkles,
  X
} from "lucide-react"

interface ConfirmPromotionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  promotion: any
}

export function ConfirmPromotionModal({ 
  open, 
  onOpenChange,
  promotion
}: ConfirmPromotionModalProps) {
  
  const handleConfirm = () => {
    // Here you would handle the actual booking
    // For now, we'll just close the modal
    onOpenChange(false)
    
    // Show success toast
    // toast.success("Promotion request submitted for approval!")
  }

  if (!promotion) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle>Confirm Promotion</DialogTitle>
              <DialogDescription className="mt-1">
                Review your promotion details
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Promotion Details Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-violet-600/5">
            <CardContent className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{promotion.target}</h3>
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                    {promotion.type}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Details */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{promotion.targetType === "profile" ? "Teacher Profile" : "Course"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Promotion</span>
                  <span className="font-medium">{promotion.type}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{promotion.days} days</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date Range</span>
                  <span className="font-medium text-xs">
                    {promotion.startDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {promotion.endDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Cost Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rate per day</span>
                  <span>${(promotion.cost / promotion.days).toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total days</span>
                  <span>× {promotion.days}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total Cost</span>
                  <span className="text-2xl font-semibold text-primary">
                    ${promotion.cost}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Info */}
          <div className="space-y-2">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div className="text-amber-200">
                  <p className="font-medium mb-1">Admin Approval Required</p>
                  <p className="text-xs text-amber-300/80">
                    Your promotion will be reviewed within 24-48 hours. You'll receive a notification once approved.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div className="text-primary-foreground">
                  <p className="font-medium mb-1">Flexible Cancellation</p>
                  <p className="text-xs opacity-80">
                    Cancel anytime before approval for a full refund. After approval, cancellations are subject to our policy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-3">What happens next?</h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">1</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Request Submitted</p>
                    <p className="text-xs text-muted-foreground">Your promotion is queued for review</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Admin Review</p>
                    <p className="text-xs text-muted-foreground">Typically completed within 24-48 hours</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">3</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Promotion Goes Live</p>
                    <p className="text-xs text-muted-foreground">Starts on your selected date after approval</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirm & Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
