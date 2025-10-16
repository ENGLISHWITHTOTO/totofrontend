import { useState } from "react"
import { useAppStore } from "../../hooks/useAppStore"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { CreditCard, DollarSign } from "lucide-react"
import { toast } from "sonner@2.0.3"

export function PayoutModal() {
  const { isPayoutModalOpen, setPayoutModalOpen } = useAppStore()
  
  const [formData, setFormData] = useState({
    amount: "",
    method: "",
    accountInfo: ""
  })

  const availableBalance = 2847.50

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const amount = parseFloat(formData.amount)
    
    if (!formData.amount || !formData.method) {
      toast.error("Please fill in all required fields")
      return
    }

    if (amount <= 0 || amount > availableBalance) {
      toast.error("Please enter a valid amount")
      return
    }

    toast.success(`Payout request of $${amount} submitted successfully!`)
    
    setFormData({
      amount: "",
      method: "",
      accountInfo: ""
    })
    
    setPayoutModalOpen(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const payoutMethods = [
    { value: "bank", label: "Bank Transfer" },
    { value: "paypal", label: "PayPal" },
    { value: "stripe", label: "Stripe" }
  ]

  return (
    <Dialog open={isPayoutModalOpen} onOpenChange={setPayoutModalOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Request Payout
          </DialogTitle>
          <DialogDescription>
            Withdraw your earnings to your preferred payment method
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4 bg-muted rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Available Balance</span>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-lg font-semibold text-green-600">
                ${availableBalance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Withdraw *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              max={availableBalance}
              min="1"
              step="0.01"
              required
            />
            <p className="text-xs text-muted-foreground">
              Minimum withdrawal: $10.00
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Payout Method *</Label>
            <Select value={formData.method} onValueChange={(value) => handleChange("method", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select payout method" />
              </SelectTrigger>
              <SelectContent>
                {payoutMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.method && (
            <div className="space-y-2">
              <Label htmlFor="account">
                {formData.method === "bank" && "Bank Account Details"}
                {formData.method === "paypal" && "PayPal Email"}
                {formData.method === "stripe" && "Stripe Account ID"}
              </Label>
              <Input
                id="account"
                placeholder={
                  formData.method === "bank" ? "Account number or IBAN" :
                  formData.method === "paypal" ? "your-email@example.com" :
                  "acct_xxxxxxxxxx"
                }
                value={formData.accountInfo}
                onChange={(e) => handleChange("accountInfo", e.target.value)}
              />
            </div>
          )}

          <div className="p-3 bg-blue-50 rounded-lg text-sm">
            <p className="text-blue-800">
              <strong>Processing Time:</strong> 3-5 business days
            </p>
            <p className="text-blue-700 mt-1">
              A small processing fee may apply depending on your payout method.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPayoutModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Request Payout
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}