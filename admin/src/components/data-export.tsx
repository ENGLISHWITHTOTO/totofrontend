import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Download, 
  Calendar as CalendarIcon, 
  FileText, 
  FileSpreadsheet,
  Database,
  Filter,
  Users,
  DollarSign,
  BarChart3,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { UserRole, hasPermission } from "../utils/permissions";

interface DataExportProps {
  userRole: UserRole;
}

interface ExportRequest {
  id: string;
  type: string;
  format: string;
  dateRange: { from: Date; to: Date };
  filters: Record<string, any>;
  status: "pending" | "processing" | "completed" | "failed";
  requestedAt: Date;
  completedAt?: Date;
  fileSize?: string;
  downloadUrl?: string;
  expiresAt?: Date;
}

export function DataExport({ userRole }: DataExportProps) {
  const [selectedExportType, setSelectedExportType] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("csv");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  // Mock export requests history
  const [exportHistory] = useState<ExportRequest[]>([
    {
      id: "exp_001",
      type: "user_data",
      format: "csv",
      dateRange: { from: new Date("2024-01-01"), to: new Date("2024-01-31") },
      filters: { status: "active", role: "all" },
      status: "completed",
      requestedAt: new Date("2024-01-15T10:30:00"),
      completedAt: new Date("2024-01-15T10:35:00"),
      fileSize: "2.4 MB",
      downloadUrl: "/exports/user_data_202401.csv",
      expiresAt: new Date("2024-01-22T10:35:00")
    },
    {
      id: "exp_002",
      type: "financial_reports",
      format: "xlsx",
      dateRange: { from: new Date("2024-01-01"), to: new Date("2024-01-31") },
      filters: { includeRefunds: true, includeFees: true },
      status: "completed",
      requestedAt: new Date("2024-01-14T15:20:00"),
      completedAt: new Date("2024-01-14T15:45:00"),
      fileSize: "8.7 MB",
      downloadUrl: "/exports/financial_202401.xlsx",
      expiresAt: new Date("2024-01-21T15:45:00")
    },
    {
      id: "exp_003",
      type: "audit_logs",
      format: "json",
      dateRange: { from: new Date("2024-01-10"), to: new Date("2024-01-15") },
      filters: { eventType: "all", riskLevel: "high" },
      status: "processing",
      requestedAt: new Date("2024-01-15T12:00:00")
    }
  ]);

  // Available export types based on permissions
  const getAvailableExportTypes = () => {
    const types = [];
    
    if (hasPermission(userRole, "users", "X")) {
      types.push({
        id: "user_data",
        name: "User Data",
        description: "Export user profiles, verification status, and activity data",
        icon: Users,
        sensitiveData: true
      });
    }
    
    if (hasPermission(userRole, "billing", "X")) {
      types.push({
        id: "financial_reports",
        name: "Financial Reports",
        description: "Export transaction data, revenue, refunds, and payouts",
        icon: DollarSign,
        sensitiveData: true
      });
    }
    
    if (hasPermission(userRole, "analytics", "X")) {
      types.push({
        id: "analytics_data",
        name: "Analytics Data",
        description: "Export platform usage, engagement, and performance metrics",
        icon: BarChart3,
        sensitiveData: false
      });
    }
    
    if (hasPermission(userRole, "audit", "X")) {
      types.push({
        id: "audit_logs",
        name: "Audit Logs",
        description: "Export system audit trails and security events",
        icon: Shield,
        sensitiveData: true
      });
    }
    
    if (hasPermission(userRole, "marketplace", "X")) {
      types.push({
        id: "marketplace_data",
        name: "Marketplace Data",
        description: "Export course data, reviews, and sales information",
        icon: FileText,
        sensitiveData: false
      });
    }

    return types;
  };

  const availableExportTypes = getAvailableExportTypes();

  const getFieldsForExportType = (type: string) => {
    const fieldMaps = {
      user_data: [
        "User ID", "Name", "Email", "Role", "Status", "Country", 
        "Join Date", "Last Active", "Verification Status", "Subscription"
      ],
      financial_reports: [
        "Transaction ID", "User ID", "Amount", "Currency", "Type", 
        "Status", "Date", "Payment Method", "Fees", "Net Amount"
      ],
      analytics_data: [
        "Date", "Active Users", "Page Views", "Session Duration", 
        "Bounce Rate", "Conversion Rate", "Revenue", "New Users"
      ],
      audit_logs: [
        "Event ID", "Timestamp", "User", "Event Type", "Module", 
        "Description", "IP Address", "Risk Level", "Details"
      ],
      marketplace_data: [
        "Course ID", "Title", "Instructor", "Category", "Price", 
        "Sales", "Rating", "Status", "Created Date", "Last Updated"
      ]
    };
    return fieldMaps[type] || [];
  };

  const handleExport = async () => {
    if (!selectedExportType || !dateRange.from || !dateRange.to) {
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsExporting(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    // In a real app, you would make an API call here
    setTimeout(() => {
      clearInterval(progressInterval);
      setExportProgress(100);
      setIsExporting(false);
    }, 5000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (availableExportTypes.length === 0) {
    return (
      <div className="p-6">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to export any data types.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Data Export</h1>
        <p className="text-muted-foreground">
          Export platform data for analysis and compliance purposes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configure Export</CardTitle>
              <CardDescription>
                Select data type, format, and date range for export
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Export Type Selection */}
              <div>
                <Label className="mb-3 block">Select Data Type</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableExportTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <div
                        key={type.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedExportType === type.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedExportType(type.id);
                          setSelectedFields([]);
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <IconComponent className="w-5 h-5 text-blue-600 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{type.name}</h4>
                              {type.sensitiveData && (
                                <Badge variant="outline" className="text-xs">
                                  Sensitive
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedExportType && (
                <>
                  {/* Format Selection */}
                  <div>
                    <Label htmlFor="format">Export Format</Label>
                    <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="pdf">PDF Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>From Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {dateRange.from ? formatDate(dateRange.from) : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateRange.from}
                            onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>To Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {dateRange.to ? formatDate(dateRange.to) : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateRange.to}
                            onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Field Selection */}
                  <div>
                    <Label className="mb-3 block">Select Fields to Export</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {getFieldsForExportType(selectedExportType).map((field) => (
                        <div key={field} className="flex items-center space-x-2">
                          <Checkbox
                            id={field}
                            checked={selectedFields.includes(field)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedFields([...selectedFields, field]);
                              } else {
                                setSelectedFields(selectedFields.filter(f => f !== field));
                              }
                            }}
                          />
                          <Label htmlFor={field} className="text-sm">{field}</Label>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFields(getFieldsForExportType(selectedExportType))}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => setSelectedFields([])}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>

                  {/* Advanced Filters */}
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Advanced Filters
                    </Button>
                  </div>

                  {/* Export Button */}
                  <div className="pt-4 border-t">
                    {isExporting ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Preparing export...</span>
                          <span className="text-sm">{Math.round(exportProgress)}%</span>
                        </div>
                        <Progress value={exportProgress} />
                      </div>
                    ) : (
                      <Button 
                        onClick={handleExport}
                        disabled={!selectedExportType || !dateRange.from || !dateRange.to || selectedFields.length === 0}
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Start Export
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Export History */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Exports</CardTitle>
              <CardDescription>
                Download or track your recent export requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exportHistory.map((request) => (
                  <div key={request.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm">
                          {request.type.replace('_', ' ')}
                        </span>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(request.requestedAt)}</span>
                      </div>
                      {request.fileSize && (
                        <div>Size: {request.fileSize}</div>
                      )}
                      {request.expiresAt && (
                        <div>Expires: {formatDate(request.expiresAt)}</div>
                      )}
                    </div>

                    {request.status === "completed" && request.downloadUrl && (
                      <Button size="sm" variant="outline" className="w-full mt-2">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    )}

                    {request.status === "processing" && (
                      <div className="mt-2">
                        <Progress value={65} className="h-2" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}