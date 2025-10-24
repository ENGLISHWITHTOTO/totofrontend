import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from './ui/drawer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useIsMobile } from './ui/use-mobile';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  Megaphone, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Search,
  LayoutGrid,
  AlertCircle,
  Plus,
  Info,
  Sparkles,
  BarChart3,
  Check,
  ChevronRight,
  ChevronLeft,
  Target,
  Zap,
  Users,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';
import { cn } from './ui/utils';
import { usePromotions } from './PromotionContext';

type PromotionType = 'carousel' | 'search_boost' | 'both';
type PromotionStatus = 'pending' | 'active' | 'completed' | 'rejected';

interface Promotion {
  id: string;
  programName: string;
  type: PromotionType;
  status: PromotionStatus;
  startDate: Date;
  endDate: Date;
  cost: number;
  adminFeedback?: string;
  adminNote?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
}

const mockPrograms = [
  { id: '1', name: 'General English Course', price: 1200, students: 45 },
  { id: '2', name: 'IELTS Preparation', price: 1500, students: 32 },
  { id: '3', name: 'Business English', price: 1800, students: 28 },
  { id: '4', name: 'Academic English', price: 1400, students: 38 },
  { id: '5', name: 'Conversation & Fluency', price: 1100, students: 52 },
];

const mockPromotions: Promotion[] = [
  {
    id: '1',
    programName: 'General English Course',
    type: 'both',
    status: 'active',
    startDate: new Date(2025, 9, 1),
    endDate: new Date(2025, 9, 15),
    cost: 450,
    adminFeedback: 'Approved and live',
    reviewedBy: 'Admin Team',
    reviewedAt: new Date(2025, 8, 28),
  },
  {
    id: '2',
    programName: 'IELTS Preparation',
    type: 'search_boost',
    status: 'pending',
    startDate: new Date(2025, 9, 10),
    endDate: new Date(2025, 9, 24),
    cost: 200,
    adminFeedback: 'Under review by our team. Expected approval within 24 hours.',
    adminNote: 'Checking program compliance with promotion guidelines.',
  },
  {
    id: '3',
    programName: 'Business English',
    type: 'carousel',
    status: 'completed',
    startDate: new Date(2025, 8, 15),
    endDate: new Date(2025, 8, 30),
    cost: 300,
    adminFeedback: 'Promotion completed successfully',
    reviewedBy: 'Admin Team',
  },
  {
    id: '4',
    programName: 'Academic English',
    type: 'both',
    status: 'rejected',
    startDate: new Date(2025, 9, 5),
    endDate: new Date(2025, 9, 20),
    cost: 450,
    adminFeedback: 'Program does not meet minimum enrollment requirements.',
    adminNote: 'Your program needs at least 10 active students before it can be promoted. Please increase enrollment and resubmit. Contact support@educonnect.com for assistance.',
    reviewedBy: 'Sarah Johnson',
    reviewedAt: new Date(2025, 9, 3),
  },
];

// Pricing structure
const PRICING = {
  carousel: 15, // per day
  search_boost: 10, // per day
  both: 20, // per day (bundled discount)
};

export function PromotionDashboard() {
  const isMobile = useIsMobile();
  const { checkSlotAvailability, addPromotion, getPromotionsByDateRange, allPromotions } = usePromotions();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState('target');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [promotionType, setPromotionType] = useState<PromotionType>('carousel');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [availabilityCheck, setAvailabilityCheck] = useState<{
    available: boolean;
    conflicts: any[];
    maxCapacity: number;
    currentBookings: number;
  } | null>(null);

  // Calculate total cost
  const calculateCost = () => {
    if (!dateRange.from || !dateRange.to) return 0;
    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const pricePerDay = PRICING[promotionType];
    return days * pricePerDay;
  };

  const totalCost = calculateCost();
  const days = dateRange.from && dateRange.to 
    ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1 
    : 0;

  // Check slot availability when dates or type change
  useEffect(() => {
    if (dateRange.from && dateRange.to && promotionType) {
      const availability = checkSlotAvailability(
        promotionType,
        dateRange.from,
        dateRange.to
      );
      setAvailabilityCheck(availability);
    } else {
      setAvailabilityCheck(null);
    }
  }, [dateRange.from, dateRange.to, promotionType, checkSlotAvailability]);

  // Validation for each step
  const isStep1Valid = selectedProgram !== '';
  const isStep2Valid = true; // Always valid as we have a default selection
  const isStep3Valid = 
    dateRange.from !== undefined && 
    dateRange.to !== undefined && 
    (availabilityCheck?.available ?? false);

  const handleCreatePromotion = () => {
    if (!selectedProgram || !dateRange.from || !dateRange.to) return;
    if (!availabilityCheck?.available) return;

    const program = mockPrograms.find(p => p.id === selectedProgram);
    if (!program) return;

    const newPromotion: Promotion = {
      id: `my-${Date.now()}`,
      programName: program.name,
      type: promotionType,
      status: 'pending',
      startDate: dateRange.from,
      endDate: dateRange.to,
      cost: totalCost,
      adminFeedback: 'Your promotion has been submitted and is awaiting admin approval.',
      adminNote: 'Our team will review your promotion request within 24-48 hours.',
    };

    // Add to global promotion calendar
    addPromotion({
      id: newPromotion.id,
      institutionId: 'current-inst',
      institutionName: 'Your Institution',
      programName: newPromotion.programName,
      type: newPromotion.type,
      startDate: newPromotion.startDate,
      endDate: newPromotion.endDate,
      status: newPromotion.status,
    });

    setPromotions([newPromotion, ...promotions]);
    setIsCreateDialogOpen(false);
    
    // Reset form
    setSelectedProgram('');
    setDateRange({ from: undefined, to: undefined });
    setPromotionType('carousel');
    setCurrentStep('target');
  };

  const handleNext = () => {
    if (currentStep === 'target' && isStep1Valid) {
      setCurrentStep('type');
    } else if (currentStep === 'type' && isStep2Valid) {
      setCurrentStep('summary');
    }
  };

  const handleBack = () => {
    if (currentStep === 'type') {
      setCurrentStep('target');
    } else if (currentStep === 'summary') {
      setCurrentStep('type');
    }
  };

  const getStatusBadge = (status: PromotionStatus) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: Clock, text: 'Pending', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
      active: { variant: 'default' as const, icon: CheckCircle, text: 'Active', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
      completed: { variant: 'outline' as const, icon: CheckCircle, text: 'Completed', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      rejected: { variant: 'destructive' as const, icon: XCircle, text: 'Rejected', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={`flex items-center gap-1 w-fit ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const getTypeBadge = (type: PromotionType) => {
    const typeConfig = {
      carousel: { icon: LayoutGrid, text: 'Homepage Carousel', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      search_boost: { icon: Search, text: 'Search Boost', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
      both: { icon: Sparkles, text: 'Premium Bundle', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    };

    const config = typeConfig[type];
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={`flex items-center gap-1 w-fit ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  // Statistics
  const stats = [
    {
      label: 'Active Promotions',
      value: promotions.filter(p => p.status === 'active').length,
      icon: TrendingUp,
      trend: '+2 this month',
      color: 'text-green-400',
    },
    {
      label: 'Pending Approval',
      value: promotions.filter(p => p.status === 'pending').length,
      icon: Clock,
      trend: 'Avg. 24h review',
      color: 'text-yellow-400',
    },
    {
      label: 'Total Spent',
      value: `$${promotions.reduce((sum, p) => sum + p.cost, 0).toLocaleString()}`,
      icon: DollarSign,
      trend: 'Last 30 days',
      color: 'text-blue-400',
    },
    {
      label: 'Avg. Impressions',
      value: '12.4K',
      icon: Eye,
      trend: 'Per promotion',
      color: 'text-purple-400',
    },
  ];

  // Multi-step wizard content
  const WizardContent = () => {
    const selectedProgramData = mockPrograms.find(p => p.id === selectedProgram);

    return (
      <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
        {/* Progress Tabs */}
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger 
            value="target" 
            className="relative"
            disabled={false}
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors",
                currentStep === 'target' 
                  ? "bg-primary text-primary-foreground" 
                  : isStep1Valid 
                    ? "bg-green-500/20 text-green-400" 
                    : "bg-muted text-muted-foreground"
              )}>
                {isStep1Valid && currentStep !== 'target' ? <Check className="w-3 h-3" /> : '1'}
              </div>
              <span className="hidden sm:inline">{isMobile ? '' : 'Target'}</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="type"
            className="relative"
            disabled={!isStep1Valid}
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors",
                currentStep === 'type' 
                  ? "bg-primary text-primary-foreground" 
                  : isStep2Valid && isStep1Valid
                    ? "bg-green-500/20 text-green-400" 
                    : "bg-muted text-muted-foreground"
              )}>
                {isStep2Valid && isStep1Valid && currentStep !== 'type' ? <Check className="w-3 h-3" /> : '2'}
              </div>
              <span className="hidden sm:inline">{isMobile ? '' : 'Type'}</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="summary"
            className="relative"
            disabled={!isStep1Valid || !isStep2Valid}
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors",
                currentStep === 'summary' 
                  ? "bg-primary text-primary-foreground" 
                  : isStep3Valid 
                    ? "bg-green-500/20 text-green-400" 
                    : "bg-muted text-muted-foreground"
              )}>
                {isStep3Valid && currentStep !== 'summary' ? <Check className="w-3 h-3" /> : '3'}
              </div>
              <span className="hidden sm:inline">{isMobile ? '' : 'Review'}</span>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Step 1: Target Selection */}
        <TabsContent value="target" className="space-y-4 mt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Select Program</h3>
                <p className="text-sm text-muted-foreground">Choose which program to promote</p>
              </div>
            </div>

            <div className="space-y-2">
              {mockPrograms.map((program) => (
                <button
                  key={program.id}
                  type="button"
                  onClick={() => setSelectedProgram(program.id)}
                  className={cn(
                    "w-full text-left border rounded-lg p-4 transition-all",
                    selectedProgram === program.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-muted-foreground/50 hover:bg-muted/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{program.name}</h4>
                        {selectedProgram === program.id && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          ${program.price}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {program.students} students
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {!selectedProgram && (
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  Select a program to continue to the next step
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>

        {/* Step 2: Promotion Type */}
        <TabsContent value="type" className="space-y-4 mt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Promotion Type</h3>
                <p className="text-sm text-muted-foreground">How would you like to promote?</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Carousel Option */}
              <button
                type="button"
                onClick={() => setPromotionType('carousel')}
                className={cn(
                  "w-full text-left border rounded-lg p-4 transition-all",
                  promotionType === 'carousel'
                    ? "border-primary bg-gradient-to-br from-blue-500/10 to-blue-600/5 shadow-sm"
                    : "border-border hover:border-muted-foreground/50 hover:bg-muted/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                    promotionType === 'carousel' 
                      ? "bg-blue-500/20" 
                      : "bg-blue-500/10"
                  )}>
                    <LayoutGrid className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">Homepage Carousel</h4>
                      {promotionType === 'carousel' && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Feature your program in the prominent homepage carousel
                    </p>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                      $15/day
                    </Badge>
                  </div>
                </div>
              </button>

              {/* Search Boost Option */}
              <button
                type="button"
                onClick={() => setPromotionType('search_boost')}
                className={cn(
                  "w-full text-left border rounded-lg p-4 transition-all",
                  promotionType === 'search_boost'
                    ? "border-primary bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 shadow-sm"
                    : "border-border hover:border-muted-foreground/50 hover:bg-muted/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                    promotionType === 'search_boost' 
                      ? "bg-emerald-500/20" 
                      : "bg-emerald-500/10"
                  )}>
                    <Search className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">Search Boost</h4>
                      {promotionType === 'search_boost' && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Appear at the top of search results with priority placement
                    </p>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      $10/day
                    </Badge>
                  </div>
                </div>
              </button>

              {/* Premium Bundle Option */}
              <button
                type="button"
                onClick={() => setPromotionType('both')}
                className={cn(
                  "w-full text-left border rounded-lg p-4 transition-all relative overflow-hidden",
                  promotionType === 'both'
                    ? "border-primary bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-violet-600/5 shadow-sm"
                    : "border-border hover:border-muted-foreground/50 hover:bg-muted/30"
                )}
              >
                {promotionType === 'both' && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-primary/20 to-transparent w-32 h-full" />
                )}
                <div className="flex items-start gap-3 relative">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                    promotionType === 'both' 
                      ? "bg-gradient-to-br from-violet-500/20 to-purple-500/20" 
                      : "bg-violet-500/10"
                  )}>
                    <Sparkles className="w-6 h-6 text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">Premium Bundle</h4>
                        <Badge variant="default" className="text-xs bg-gradient-to-r from-violet-500 to-purple-500">
                          BEST VALUE
                        </Badge>
                      </div>
                      {promotionType === 'both' && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Carousel + Search Boost combined for maximum visibility
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-violet-500/10 text-violet-400 border-violet-500/20">
                        $20/day
                      </Badge>
                      <span className="text-xs text-green-400">Save $5/day!</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </TabsContent>

        {/* Step 3: Dates & Summary */}
        <TabsContent value="summary" className="space-y-4 mt-0">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Schedule & Review</h3>
                <p className="text-sm text-muted-foreground">Pick dates and review your promotion</p>
              </div>
            </div>

            {/* Date Selection with Input Fields */}
            <div className="space-y-3">
              <Label>Promotion Schedule</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="start-date" className="text-sm text-muted-foreground">
                    Start Date
                  </Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      id="start-date"
                      type="date"
                      value={dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        const newDate = e.target.value ? new Date(e.target.value) : undefined;
                        setDateRange({ ...dateRange, from: newDate });
                      }}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="w-full h-11 pl-10 pr-3 rounded-lg border border-border bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end-date" className="text-sm text-muted-foreground">
                    End Date
                  </Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      id="end-date"
                      type="date"
                      value={dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        const newDate = e.target.value ? new Date(e.target.value) : undefined;
                        setDateRange({ ...dateRange, to: newDate });
                      }}
                      min={dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
                      disabled={!dateRange.from}
                      className="w-full h-11 pl-10 pr-3 rounded-lg border border-border bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
              {dateRange.from && dateRange.to && availabilityCheck && (
                <>
                  {availabilityCheck.available ? (
                    <Alert className="bg-green-500/10 border-green-500/20">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <AlertTitle className="text-green-400">Slots Available</AlertTitle>
                      <AlertDescription className="text-xs text-muted-foreground">
                        {availabilityCheck.currentBookings} of {availabilityCheck.maxCapacity} slots booked for this period. Your promotion can be scheduled.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="bg-destructive/10 border-destructive/20">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      <AlertTitle className="text-destructive">Slots Fully Booked</AlertTitle>
                      <AlertDescription className="text-xs space-y-2">
                        <p>All {availabilityCheck.maxCapacity} slots are booked for these dates. Conflicting promotions:</p>
                        <div className="space-y-1 mt-2">
                          {availabilityCheck.conflicts.slice(0, 3).map((conflict, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs bg-card/50 rounded p-2">
                              <Lock className="w-3 h-3 text-destructive flex-shrink-0" />
                              <span className="flex-1">{conflict.institutionName} - {conflict.programName}</span>
                            </div>
                          ))}
                          {availabilityCheck.conflicts.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{availabilityCheck.conflicts.length - 3} more conflicts
                            </p>
                          )}
                        </div>
                        <p className="mt-2">Please choose different dates or try a different promotion type.</p>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {availabilityCheck.available && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                      <Info className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>
                        Promotion will run from <span className="font-medium text-foreground">{format(dateRange.from, 'MMM dd, yyyy')}</span> to <span className="font-medium text-foreground">{format(dateRange.to, 'MMM dd, yyyy')}</span>
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Summary Card with Gradient */}
            {selectedProgramData && (
              <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-l from-primary/10 to-transparent rounded-full blur-3xl" />
                <CardHeader className="relative">
                  <CardTitle className="text-base">Promotion Summary</CardTitle>
                  <CardDescription>Review your promotion details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">Program</span>
                      <span className="font-medium text-right">{selectedProgramData.name}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Promotion Type</span>
                      <div>{getTypeBadge(promotionType)}</div>
                    </div>
                    <Separator />
                    {days > 0 && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Duration</span>
                          <span className="font-medium">{days} {days === 1 ? 'day' : 'days'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Daily Rate</span>
                          <span className="font-medium">${PRICING[promotionType]}/day</span>
                        </div>
                        <Separator className="bg-primary/20" />
                        <div className="flex justify-between items-center pt-2">
                          <span className="font-medium">Total Cost</span>
                          <div className="text-right">
                            <div className="font-bold text-xl text-primary">${totalCost}</div>
                            {promotionType === 'both' && (
                              <div className="text-xs text-green-400">Saving ${days * 5}</div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {promotionType === 'both' && days > 0 && (
                    <Alert className="bg-primary/5 border-primary/20">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <AlertDescription className="text-xs">
                        Premium Bundle saves you <span className="font-medium text-primary">${days * 5}</span> compared to buying separately!
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Info Alert */}
            <Alert>
              <Info className="w-4 h-4" />
              <AlertTitle className="text-sm">What happens next?</AlertTitle>
              <AlertDescription className="text-xs space-y-1 mt-2">
                <p>• Admin review within 24-48 hours</p>
                <p>• Email notification on approval/rejection</p>
                <p>• Approved promotions go live automatically</p>
              </AlertDescription>
            </Alert>

            {!isStep3Valid && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  Please select both start and end dates to continue
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  // Footer with navigation buttons
  const WizardFooter = () => {
    const canProceed = 
      (currentStep === 'target' && isStep1Valid) ||
      (currentStep === 'type' && isStep2Valid) ||
      (currentStep === 'summary' && isStep3Valid);

    return (
      <div className="flex gap-3 pt-4 border-t bg-card">
        {currentStep !== 'target' && (
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1 sm:flex-none"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        )}
        
        {currentStep === 'summary' ? (
          <Button
            onClick={handleCreatePromotion}
            disabled={!canProceed}
            className="flex-1"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Submit for Approval
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="flex-1"
          >
            Continue
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Megaphone className="w-6 h-6 text-primary" />
          <h2>Program Promotions</h2>
        </div>
        <p className="text-muted-foreground">
          Boost your program visibility with targeted promotions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                  <p className="mt-1 text-lg md:text-xl truncate">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{stat.trend}</p>
                </div>
                <div className={`p-2 rounded-lg bg-card-foreground/5 ${stat.color} flex-shrink-0 ml-2`}>
                  <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Feedback Panel */}
      {promotions.filter(p => p.adminFeedback && (p.status === 'pending' || p.status === 'rejected')).length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <AlertCircle className="w-5 h-5 text-primary" />
              Admin Feedback & Updates
            </CardTitle>
            <CardDescription>
              Important messages about your promotion requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {promotions
              .filter(p => p.adminFeedback && (p.status === 'pending' || p.status === 'rejected'))
              .map((promotion) => (
                <Card key={promotion.id} className={promotion.status === 'rejected' ? 'border-destructive/50 bg-destructive/5' : 'border-yellow-500/50 bg-yellow-500/5'}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">
                        {promotion.status === 'rejected' ? (
                          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                            <XCircle className="w-5 h-5 text-destructive" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-yellow-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-medium">{promotion.programName}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              {getTypeBadge(promotion.type)}
                              {getStatusBadge(promotion.status)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mt-3">
                          <div className="p-3 bg-card/50 rounded-lg">
                            <p className="text-sm font-medium mb-1">Admin Message:</p>
                            <p className="text-sm text-muted-foreground">{promotion.adminFeedback}</p>
                          </div>
                          
                          {promotion.adminNote && (
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <p className="text-sm">{promotion.adminNote}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                          <div className="text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              {format(promotion.startDate, 'MMM dd')} - {format(promotion.endDate, 'MMM dd')}
                            </div>
                            {promotion.reviewedBy && (
                              <div className="mt-1">Reviewed by {promotion.reviewedBy}</div>
                            )}
                          </div>
                          <div className="text-sm font-medium">${promotion.cost}</div>
                        </div>

                        {promotion.status === 'rejected' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-3"
                            onClick={() => setIsCreateDialogOpen(true)}
                          >
                            Resubmit Promotion
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="promotions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="promotions">My Promotions</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* My Promotions Tab */}
        <TabsContent value="promotions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active & Scheduled Promotions</CardTitle>
              <CardDescription>
                Manage all your program promotion campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Program</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {promotions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No promotions yet. Create your first promotion to get started!
                        </TableCell>
                      </TableRow>
                    ) : (
                      promotions.map((promotion) => (
                        <TableRow key={promotion.id}>
                          <TableCell>
                            <div className="font-medium">{promotion.programName}</div>
                          </TableCell>
                          <TableCell>{getTypeBadge(promotion.type)}</TableCell>
                          <TableCell>{getStatusBadge(promotion.status)}</TableCell>
                          <TableCell>{format(promotion.startDate, 'MMM dd, yyyy')}</TableCell>
                          <TableCell>{format(promotion.endDate, 'MMM dd, yyyy')}</TableCell>
                          <TableCell>
                            <span className="font-medium">${promotion.cost}</span>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab - Shared Calendar System */}
        <TabsContent value="calendar">
          <div className="space-y-4">
            {/* Capacity Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <LayoutGrid className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Carousel Slots</div>
                      <div className="font-medium">3 available</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Search className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Search Boost Slots</div>
                      <div className="font-medium">5 available</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Premium Slots</div>
                      <div className="font-medium">2 available</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Shared Promotion Calendar</span>
                  <Badge variant="outline" className="font-normal">
                    All Institutions
                  </Badge>
                </CardTitle>
                <CardDescription>
                  View all active and scheduled promotions across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <Info className="w-4 h-4" />
                  <AlertDescription className="text-xs">
                    This calendar is shared across all institutions. Booked slots are unavailable to prevent conflicts. Promotions automatically start and stop based on scheduled dates.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  {/* Group promotions by type */}
                  {['carousel', 'search_boost', 'both'].map((type) => {
                    const typePromotions = allPromotions.filter(
                      (p) => (p.type === type || p.type === 'both') && (p.status === 'active' || p.status === 'pending')
                    );
                    
                    if (typePromotions.length === 0) return null;
                    
                    return (
                      <div key={type}>
                        <div className="flex items-center gap-2 mb-3">
                          {getTypeBadge(type as PromotionType)}
                          <span className="text-sm text-muted-foreground">
                            {typePromotions.length} active
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          {typePromotions.map((promo) => (
                            <Card key={promo.id} className="border-l-4 border-l-primary/40">
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-medium truncate">{promo.programName}</h4>
                                      {promo.institutionId === 'current-inst' && (
                                        <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20">
                                          Your Promotion
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                      {promo.institutionName}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <CalendarIcon className="w-3 h-3" />
                                        {format(promo.startDate, 'MMM dd')} - {format(promo.endDate, 'MMM dd, yyyy')}
                                      </div>
                                      {promo.status === 'active' && (
                                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                                          Live Now
                                        </Badge>
                                      )}
                                      {promo.status === 'pending' && (
                                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs">
                                          Pending
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="flex-shrink-0">
                                          <Lock className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">This slot is booked</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Availability Info */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">How the Shared Calendar Works</p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Carousel slots: Maximum 3 programs featured simultaneously</li>
                      <li>• Search Boost slots: Maximum 5 programs boosted at once</li>
                      <li>• Premium Bundle: Maximum 2 programs with full promotion</li>
                      <li>• Promotions start and stop automatically on scheduled dates</li>
                      <li>• Overlapping promotions of the same type are prevented</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Promotion Performance
              </CardTitle>
              <CardDescription>
                Track the effectiveness of your promotional campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Total Impressions</div>
                    <div className="text-2xl font-bold">124,582</div>
                    <div className="text-xs text-green-400 mt-1">↑ 23% vs last month</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Click-through Rate</div>
                    <div className="text-2xl font-bold">4.8%</div>
                    <div className="text-xs text-green-400 mt-1">↑ 1.2% improvement</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Conversion Rate</div>
                    <div className="text-2xl font-bold">2.1%</div>
                    <div className="text-xs text-muted-foreground mt-1">Industry avg: 1.8%</div>
                  </CardContent>
                </Card>
              </div>

              <div className="p-6 bg-muted/30 rounded-lg text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Detailed analytics charts will appear here once you have active promotions
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Action Button with Responsive Dialog/Drawer */}
      {isMobile ? (
        <Drawer open={isCreateDialogOpen} onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) {
            setCurrentStep('target');
          }
        }}>
          <DrawerTrigger asChild>
            <Button 
              size="lg" 
              className="fixed bottom-24 right-4 h-14 px-5 rounded-full shadow-2xl z-30 hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[92vh]">
            <DrawerHeader className="text-left border-b">
              <DrawerTitle>Create New Promotion</DrawerTitle>
              <DrawerDescription>
                Step-by-step wizard to boost your program visibility
              </DrawerDescription>
            </DrawerHeader>
            <ScrollArea className="h-[calc(92vh-200px)] px-4 py-4">
              <WizardContent />
            </ScrollArea>
            <div className="p-4 border-t">
              <WizardFooter />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) {
            setCurrentStep('target');
          }
        }}>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="fixed bottom-6 right-6 h-14 px-6 rounded-full shadow-2xl z-30 hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <DialogTitle>Create New Promotion</DialogTitle>
              <DialogDescription>
                Step-by-step wizard to boost your program visibility
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-1 px-6 py-4">
              <WizardContent />
            </ScrollArea>
            <div className="px-6 pb-6">
              <WizardFooter />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
