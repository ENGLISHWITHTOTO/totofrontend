import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { toast } from "sonner@2.0.3";
import { 
  Bot, 
  Plus, 
  Edit, 
  Save, 
  Settings, 
  Zap,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  Eye,
  Play,
  Trash2,
  Copy,
  TestTube,
  Shield,
  Activity
} from "lucide-react";
import { UserRole, hasPermission, canAccessModule } from "../utils/permissions";
import { PermissionGate } from "./permission-gate";

interface AIConfigurationProps {
  userRole: UserRole;
}

interface AIPrompt {
  id: number;
  name: string;
  category: string;
  description: string;
  prompt: string;
  usage: number;
  lastUpdated: string;
  status: "active" | "testing" | "draft" | "deprecated";
  version: string;
}

interface SystemLimit {
  setting: string;
  value: number;
  description: string;
  editable?: boolean;
}

export function AIConfiguration({ userRole }: AIConfigurationProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<AIPrompt | null>(null);
  const [isCreatePromptOpen, setIsCreatePromptOpen] = useState(false);
  const [isEditPromptOpen, setIsEditPromptOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isTestPromptOpen, setIsTestPromptOpen] = useState(false);
  const [isEditLimitOpen, setIsEditLimitOpen] = useState(false);
  const [selectedLimit, setSelectedLimit] = useState<SystemLimit | null>(null);
  const [testInput, setTestInput] = useState("");
  const [testOutput, setTestOutput] = useState("");
  const [isTestingPrompt, setIsTestingPrompt] = useState(false);
  const [prompts, setPrompts] = useState<AIPrompt[]>([]);
  const [limits, setLimits] = useState<SystemLimit[]>([]);
  
  // New prompt form state
  const [newPrompt, setNewPrompt] = useState({
    name: "",
    category: "",
    description: "",
    prompt: ""
  });

  // Initialize with data
  React.useEffect(() => {
    setPrompts([
      {
        id: 1,
        name: "Grammar Correction",
        category: "Grammar",
        description: "Corrects grammar mistakes and provides explanations",
        prompt: "You are an expert English grammar tutor. Analyze the following text and provide corrections with clear explanations for each mistake. Focus on grammar, punctuation, and sentence structure.",
        usage: 3247,
        lastUpdated: "2024-03-10",
        status: "active",
        version: "v2.1"
      },
      {
        id: 2,
        name: "IELTS Writing Evaluation",
        category: "Assessment",
        description: "Evaluates IELTS writing tasks and provides scoring",
        prompt: "You are an experienced IELTS examiner. Evaluate this writing sample using the official IELTS criteria: Task Achievement/Response, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy. Provide a band score for each criterion and overall band score with detailed feedback.",
        usage: 892,
        lastUpdated: "2024-03-12",
        status: "active",
        version: "v1.8"
      },
      {
        id: 3,
        name: "Conversation Partner",
        category: "Speaking",
        description: "Simulates natural conversations for practice",
        prompt: "You are a friendly and patient English conversation partner. Engage in natural conversation on the given topic. Ask follow-up questions, provide gentle corrections when needed, and encourage the learner to express themselves. Keep responses conversational and supportive.",
        usage: 1456,
        lastUpdated: "2024-03-08",
        status: "active",
        version: "v3.0"
      },
      {
        id: 4,
        name: "Pronunciation Feedback",
        category: "Speaking",
        description: "Analyzes pronunciation and provides improvement tips",
        prompt: "You are a pronunciation specialist. Analyze the phonetic transcription and audio patterns provided. Give specific feedback on pronunciation accuracy, identify problem areas, and suggest exercises for improvement. Focus on clarity and naturalness.",
        usage: 567,
        lastUpdated: "2024-02-28",
        status: "testing",
        version: "v0.9"
      },
      {
        id: 5,
        name: "Essay Structure Analyzer",
        category: "Writing",
        description: "Analyzes essay structure and organization",
        prompt: "You are an academic writing expert. Analyze the structure and organization of this essay. Evaluate the introduction, body paragraphs, and conclusion. Provide feedback on logical flow, paragraph transitions, and overall coherence. Suggest improvements for better organization.",
        usage: 234,
        lastUpdated: "2024-03-15",
        status: "draft",
        version: "v1.0"
      }
    ]);

    setLimits([
      {
        setting: "Max Characters per Request",
        value: 5000,
        description: "Maximum characters allowed in a single AI request",
        editable: true
      },
      {
        setting: "Daily AI Calls (Free Users)",
        value: 10,
        description: "Number of AI features free users can use per day",
        editable: true
      },
      {
        setting: "Daily AI Calls (Premium Users)",
        value: 100,
        description: "Number of AI features premium users can use per day",
        editable: true
      },
      {
        setting: "Response Timeout",
        value: 30,
        description: "Maximum seconds to wait for AI response",
        editable: true
      },
      {
        setting: "Concurrent Requests",
        value: 50,
        description: "Maximum simultaneous AI requests",
        editable: true
      }
    ]);
  }, []);

  const apiMetrics = [
    {
      metric: "Total API Calls Today",
      value: "12,847",
      change: "+8.2%",
      status: "good"
    },
    {
      metric: "Average Response Time",
      value: "2.3s",
      change: "-12%",
      status: "good"
    },
    {
      metric: "Success Rate",
      value: "99.2%",
      change: "+0.1%",
      status: "excellent"
    },
    {
      metric: "Error Rate",
      value: "0.8%",
      change: "-0.1%",
      status: "good"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "testing": return "bg-yellow-100 text-yellow-800";
      case "draft": return "bg-gray-100 text-gray-800";
      case "deprecated": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Grammar": return "bg-blue-100 text-blue-800";
      case "Assessment": return "bg-purple-100 text-purple-800";
      case "Speaking": return "bg-green-100 text-green-800";
      case "Writing": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Handler functions
  const handleCreatePrompt = () => {
    if (!newPrompt.name || !newPrompt.category || !newPrompt.description || !newPrompt.prompt) {
      toast.error("Please fill in all required fields");
      return;
    }

    const prompt: AIPrompt = {
      id: Date.now(),
      name: newPrompt.name,
      category: newPrompt.category,
      description: newPrompt.description,
      prompt: newPrompt.prompt,
      usage: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: "draft",
      version: "v1.0"
    };

    setPrompts([...prompts, prompt]);
    setNewPrompt({ name: "", category: "", description: "", prompt: "" });
    setIsCreatePromptOpen(false);
    toast.success("AI prompt created successfully");
  };

  const handleEditPrompt = (prompt: AIPrompt) => {
    setSelectedPrompt(prompt);
    setNewPrompt({
      name: prompt.name,
      category: prompt.category,
      description: prompt.description,
      prompt: prompt.prompt
    });
    setIsEditPromptOpen(true);
  };

  const handleUpdatePrompt = () => {
    if (!selectedPrompt) return;

    const updatedPrompts = prompts.map(p => 
      p.id === selectedPrompt.id 
        ? {
            ...p,
            name: newPrompt.name,
            category: newPrompt.category,
            description: newPrompt.description,
            prompt: newPrompt.prompt,
            lastUpdated: new Date().toISOString().split('T')[0],
            version: incrementVersion(p.version)
          }
        : p
    );

    setPrompts(updatedPrompts);
    setNewPrompt({ name: "", category: "", description: "", prompt: "" });
    setSelectedPrompt(null);
    setIsEditPromptOpen(false);
    toast.success("AI prompt updated successfully");
  };

  const handleDeployPrompt = (promptId: number) => {
    const updatedPrompts = prompts.map(p => 
      p.id === promptId 
        ? { ...p, status: "active" as const, lastUpdated: new Date().toISOString().split('T')[0] }
        : p
    );
    setPrompts(updatedPrompts);
    toast.success("Prompt deployed to production");
  };

  const handleDeletePrompt = (promptId: number) => {
    setPrompts(prompts.filter(p => p.id !== promptId));
    toast.success("Prompt deleted successfully");
  };

  const handleTestPrompt = async (prompt: AIPrompt) => {
    if (!testInput.trim()) {
      toast.error("Please enter test input");
      return;
    }

    setIsTestingPrompt(true);
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestOutput(`Test response for prompt "${prompt.name}" with input: "${testInput}"\n\nThis is a simulated response that would come from the AI model using the configured prompt. In a real implementation, this would be the actual AI response.`);
      toast.success("Prompt test completed");
    } catch (error) {
      toast.error("Test failed");
    } finally {
      setIsTestingPrompt(false);
    }
  };

  const handleEditLimit = (limit: SystemLimit) => {
    setSelectedLimit(limit);
    setIsEditLimitOpen(true);
  };

  const handleUpdateLimit = (newValue: number) => {
    if (!selectedLimit) return;

    const updatedLimits = limits.map(l => 
      l.setting === selectedLimit.setting 
        ? { ...l, value: newValue }
        : l
    );

    setLimits(updatedLimits);
    setSelectedLimit(null);
    setIsEditLimitOpen(false);
    toast.success("System limit updated successfully");
  };

  const incrementVersion = (version: string): string => {
    const match = version.match(/v(\d+)\.(\d+)/);
    if (match) {
      const major = parseInt(match[1]);
      const minor = parseInt(match[2]);
      return `v${major}.${minor + 1}`;
    }
    return "v1.1";
  };

  const duplicatePrompt = (prompt: AIPrompt) => {
    const duplicatedPrompt: AIPrompt = {
      ...prompt,
      id: Date.now(),
      name: `${prompt.name} (Copy)`,
      status: "draft",
      usage: 0,
      version: "v1.0",
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setPrompts([...prompts, duplicatedPrompt]);
    toast.success("Prompt duplicated successfully");
  };

  // Permission checks
  const canCreate = hasPermission(userRole, "ai_config", "C");
  const canUpdate = hasPermission(userRole, "ai_config", "U");
  const canDelete = hasPermission(userRole, "ai_config", "D");
  const canConfigure = hasPermission(userRole, "ai_config", "G");
  const canRead = hasPermission(userRole, "ai_config", "R");

  if (!canRead) {
    return (
      <div className="p-6">
        <PermissionGate userRole={userRole} module="ai_config" permission="R">
          <div />
        </PermissionGate>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">AI Configuration</h1>
          <p className="text-muted-foreground">
            Manage AI prompts, system limits, and API performance
          </p>
          <div className="flex items-center space-x-4 mt-2">
            <Badge variant="secondary">
              {prompts.length} Active Prompts
            </Badge>
            <Badge variant="outline">
              Role: {userRole.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        <PermissionGate userRole={userRole} module="ai_config" permission="C">
          <Dialog open={isCreatePromptOpen} onOpenChange={setIsCreatePromptOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Prompt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create AI Prompt</DialogTitle>
                <DialogDescription>
                  Define a new AI prompt for specific learning features
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prompt-name">Prompt Name</Label>
                    <Input 
                      id="prompt-name" 
                      placeholder="e.g., Vocabulary Builder"
                      value={newPrompt.name}
                      onChange={(e) => setNewPrompt({...newPrompt, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="prompt-category">Category</Label>
                    <Select value={newPrompt.category} onValueChange={(value) => setNewPrompt({...newPrompt, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Grammar">Grammar</SelectItem>
                        <SelectItem value="Speaking">Speaking</SelectItem>
                        <SelectItem value="Writing">Writing</SelectItem>
                        <SelectItem value="Assessment">Assessment</SelectItem>
                        <SelectItem value="Vocabulary">Vocabulary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="prompt-desc">Description</Label>
                  <Input 
                    id="prompt-desc" 
                    placeholder="Brief description of what this prompt does"
                    value={newPrompt.description}
                    onChange={(e) => setNewPrompt({...newPrompt, description: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="prompt-text">Prompt Text</Label>
                  <Textarea 
                    id="prompt-text" 
                    placeholder="Enter the AI prompt here..." 
                    className="min-h-32"
                    value={newPrompt.prompt}
                    onChange={(e) => setNewPrompt({...newPrompt, prompt: e.target.value})}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreatePromptOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePrompt}>Create Prompt</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </PermissionGate>
      </div>

      {/* API Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {apiMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.metric}</p>
                  <p className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change} from yesterday
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role-based help text */}
      {userRole === "CONTENT_MANAGER" && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Content Manager Access</h4>
              <p className="text-sm text-blue-700">
                You can configure AI prompts and advanced settings. Create and edit prompts to customize the learning experience for your users.
              </p>
            </div>
          </div>
        </div>
      )}

      {(userRole === "ANALYST" || userRole === "READ_ONLY") && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <BarChart3 className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900">Read-Only Access</h4>
              <p className="text-sm text-amber-700">
                You have view-only access to AI configuration. Contact an administrator to request changes to prompts or system limits.
              </p>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="prompts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="prompts">AI Prompts</TabsTrigger>
          <TabsTrigger value="limits">System Limits</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="settings">Advanced Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="prompts" className="space-y-4">
          {prompts.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No AI Prompts Found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first AI prompt template
              </p>
              <PermissionGate userRole={userRole} module="ai_config" permission="C">
                <Button onClick={() => setIsCreatePromptOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Prompt
                </Button>
              </PermissionGate>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {prompts.map((prompt) => (
              <Card key={prompt.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{prompt.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {prompt.description}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getStatusColor(prompt.status)}>
                        {prompt.status}
                      </Badge>
                      <Badge className={getCategoryColor(prompt.category)} variant="outline">
                        {prompt.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {prompt.prompt}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Version:</span>
                      <p className="font-medium">{prompt.version}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Usage:</span>
                      <p className="font-medium">{prompt.usage.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Updated:</span>
                      <p className="font-medium">{prompt.lastUpdated}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setSelectedPrompt(prompt);
                        setIsPreviewOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    
                    <PermissionGate userRole={userRole} module="ai_config" permission="U">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditPrompt(prompt)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </PermissionGate>

                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedPrompt(prompt);
                        setIsTestPromptOpen(true);
                      }}
                    >
                      <TestTube className="w-4 h-4 mr-1" />
                      Test
                    </Button>

                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => duplicatePrompt(prompt)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Duplicate
                    </Button>

                    {prompt.status !== "active" && (
                      <PermissionGate userRole={userRole} module="ai_config" permission="G">
                        <Button 
                          size="sm"
                          onClick={() => handleDeployPrompt(prompt.id)}
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Deploy
                        </Button>
                      </PermissionGate>
                    )}

                    <PermissionGate userRole={userRole} module="ai_config" permission="D">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete AI Prompt</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{prompt.name}"? This action cannot be undone and will affect any active integrations using this prompt.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeletePrompt(prompt.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete Prompt
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </PermissionGate>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="limits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Limits & Quotas</CardTitle>
              <CardDescription>
                Configure rate limits and resource constraints for AI features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {limits.map((limit, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{limit.setting}</h4>
                    <p className="text-sm text-muted-foreground">{limit.description}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold">{limit.value.toLocaleString()}</p>
                    </div>
                    <PermissionGate userRole={userRole} module="ai_config" permission="G">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditLimit(limit)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </PermissionGate>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Tier Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Free Users</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Daily AI calls</span>
                          <span className="font-medium">10</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max characters</span>
                          <span className="font-medium">1,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Features</span>
                          <span className="font-medium">Basic</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Premium Users</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Daily AI calls</span>
                          <span className="font-medium">100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max characters</span>
                          <span className="font-medium">5,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Features</span>
                          <span className="font-medium">All</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Enterprise Users</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Daily AI calls</span>
                          <span className="font-medium">Unlimited</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max characters</span>
                          <span className="font-medium">10,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Features</span>
                          <span className="font-medium">Custom</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Time Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>&lt; 1s</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>1-3s</span>
                    <span className="font-medium">38%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '38%' }}></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>3-5s</span>
                    <span className="font-medium">12%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>&gt; 5s</span>
                    <span className="font-medium">5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm">Timeout Errors</span>
                    </div>
                    <span className="text-sm font-medium">23 (0.2%)</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-sm">API Failures</span>
                    </div>
                    <span className="text-sm font-medium">12 (0.1%)</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">Rate Limit Exceeded</span>
                    </div>
                    <span className="text-sm font-medium">67 (0.5%)</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Successful Requests</span>
                    </div>
                    <span className="text-sm font-medium">12,745 (99.2%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Feature Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">3,247</div>
                  <div className="text-sm text-muted-foreground">Grammar Checks</div>
                  <div className="text-xs text-green-600">+12% today</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">892</div>
                  <div className="text-sm text-muted-foreground">Essay Evaluations</div>
                  <div className="text-xs text-green-600">+8% today</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">1,456</div>
                  <div className="text-sm text-muted-foreground">Conversations</div>
                  <div className="text-xs text-green-600">+15% today</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced AI Settings</CardTitle>
              <CardDescription>
                Configure advanced parameters for AI behavior and performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable AI Caching</Label>
                      <p className="text-sm text-muted-foreground">Cache responses to improve speed</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Smart Rate Limiting</Label>
                      <p className="text-sm text-muted-foreground">Dynamically adjust limits based on usage</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Error Recovery</Label>
                      <p className="text-sm text-muted-foreground">Automatically retry failed requests</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Response Quality Threshold</Label>
                    <p className="text-sm text-muted-foreground mb-2">Minimum confidence score for responses</p>
                    <Slider defaultValue={[85]} max={100} step={5} className="w-full" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Max Concurrent Users</Label>
                    <p className="text-sm text-muted-foreground mb-2">Maximum simultaneous AI users</p>
                    <Slider defaultValue={[500]} max={1000} step={50} className="w-full" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0</span>
                      <span>1000</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <PermissionGate userRole={userRole} module="ai_config" permission="G">
                  <Button onClick={() => toast.success("Configuration saved successfully")}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Configuration
                  </Button>
                </PermissionGate>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Prompt Dialog */}
      <Dialog open={isEditPromptOpen} onOpenChange={setIsEditPromptOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit AI Prompt</DialogTitle>
            <DialogDescription>
              Update the AI prompt configuration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-prompt-name">Prompt Name</Label>
                <Input 
                  id="edit-prompt-name" 
                  value={newPrompt.name}
                  onChange={(e) => setNewPrompt({...newPrompt, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-prompt-category">Category</Label>
                <Select value={newPrompt.category} onValueChange={(value) => setNewPrompt({...newPrompt, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grammar">Grammar</SelectItem>
                    <SelectItem value="Speaking">Speaking</SelectItem>
                    <SelectItem value="Writing">Writing</SelectItem>
                    <SelectItem value="Assessment">Assessment</SelectItem>
                    <SelectItem value="Vocabulary">Vocabulary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-prompt-desc">Description</Label>
              <Input 
                id="edit-prompt-desc" 
                value={newPrompt.description}
                onChange={(e) => setNewPrompt({...newPrompt, description: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-prompt-text">Prompt Text</Label>
              <Textarea 
                id="edit-prompt-text" 
                className="min-h-32"
                value={newPrompt.prompt}
                onChange={(e) => setNewPrompt({...newPrompt, prompt: e.target.value})}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditPromptOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePrompt}>Update Prompt</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Prompt Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Preview: {selectedPrompt?.name}</DialogTitle>
            <DialogDescription>
              Full prompt details and configuration
            </DialogDescription>
          </DialogHeader>
          {selectedPrompt && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Badge className={getCategoryColor(selectedPrompt.category)} variant="outline">
                    {selectedPrompt.category}
                  </Badge>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedPrompt.status)}>
                    {selectedPrompt.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedPrompt.description}</p>
              </div>

              <div>
                <Label>Full Prompt Text</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                  <pre className="whitespace-pre-wrap text-sm">{selectedPrompt.prompt}</pre>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Usage Count</p>
                  <p className="text-lg font-semibold">{selectedPrompt.usage.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Version</p>
                  <p className="text-lg font-semibold">{selectedPrompt.version}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-lg font-semibold">{selectedPrompt.lastUpdated}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Test Prompt Dialog */}
      <Dialog open={isTestPromptOpen} onOpenChange={setIsTestPromptOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Test Prompt: {selectedPrompt?.name}</DialogTitle>
            <DialogDescription>
              Test the AI prompt with sample input to verify its behavior
            </DialogDescription>
          </DialogHeader>
          {selectedPrompt && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Test Input</Label>
                    <Textarea 
                      placeholder="Enter test input here..."
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      className="min-h-32"
                    />
                  </div>
                  
                  <Button 
                    onClick={() => handleTestPrompt(selectedPrompt)}
                    disabled={isTestingPrompt || !testInput.trim()}
                    className="w-full"
                  >
                    {isTestingPrompt ? (
                      <>
                        <Activity className="w-4 h-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Run Test
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Test Output</Label>
                    <div className="min-h-32 p-4 bg-gray-50 rounded-lg border">
                      {testOutput ? (
                        <pre className="whitespace-pre-wrap text-sm">{testOutput}</pre>
                      ) : (
                        <p className="text-muted-foreground text-sm">Run a test to see the output here...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm"><strong>Prompt being tested:</strong></p>
                <p className="text-sm text-muted-foreground mt-1">{selectedPrompt.prompt}</p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setIsTestPromptOpen(false);
                  setTestInput("");
                  setTestOutput("");
                }}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit System Limit Dialog */}
      <Dialog open={isEditLimitOpen} onOpenChange={setIsEditLimitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit System Limit</DialogTitle>
            <DialogDescription>
              Modify the system limit configuration
            </DialogDescription>
          </DialogHeader>
          {selectedLimit && (
            <div className="space-y-4">
              <div>
                <Label>Setting</Label>
                <p className="text-sm font-medium">{selectedLimit.setting}</p>
                <p className="text-xs text-muted-foreground">{selectedLimit.description}</p>
              </div>
              
              <div>
                <Label>Current Value: {selectedLimit.value.toLocaleString()}</Label>
                <Input 
                  type="number"
                  defaultValue={selectedLimit.value}
                  className="mt-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      handleUpdateLimit(parseInt(target.value));
                    }
                  }}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditLimitOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={(e) => {
                  const input = e.currentTarget.parentElement?.previousElementSibling?.querySelector('input') as HTMLInputElement;
                  if (input) {
                    handleUpdateLimit(parseInt(input.value));
                  }
                }}>
                  Update Limit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}