import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { toast } from "sonner@2.0.3";
import { 
  Bot, 
  Plus, 
  Edit, 
  Save, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Copy,
  Trash2,
  Upload,
  Play,
  MessageSquare,
  Users,
  Clock,
  Star,
  Globe,
  GraduationCap,
  Tag,
  TestTube,
  Activity,
  CheckCircle,
  XCircle,
  Archive,
  BarChart3,
  FileText,
  Calendar
} from "lucide-react";
import { UserRole, hasPermission, canAccessModule } from "../utils/permissions";
import { PermissionGate } from "./permission-gate";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface AICharactersManagerProps {
  userRole: UserRole;
}

interface AICharacter {
  id: number;
  name: string;
  avatar: string;
  rolePersonality: string;
  language: string;
  level: string;
  prompt: string;
  tone: "formal" | "casual" | "friendly" | "strict";
  responseLength: "short" | "medium" | "long";
  useTimer: boolean;
  marketplaceCategory: string;
  tags: string[];
  status: "active" | "draft" | "archived";
  lastUpdated: string;
  createdBy: string;
  usageStats: {
    sessionsStarted: number;
    avgRating: number;
    lastUsed: string;
    totalInteractions: number;
  };
}

type CreateCharacterForm = Omit<AICharacter, 'id' | 'lastUpdated' | 'createdBy' | 'usageStats'>;

const SUPPORTED_LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", 
  "Portuguese", "Japanese", "Korean", "Chinese", "Arabic"
];

const CEFR_LEVELS = [
  { value: "A1", label: "A1 - Beginner" },
  { value: "A2", label: "A2 - Elementary" },
  { value: "B1", label: "B1 - Intermediate" },
  { value: "B2", label: "B2 - Upper Intermediate" },
  { value: "C1", label: "C1 - Advanced" },
  { value: "C2", label: "C2 - Proficiency" }
];

const MARKETPLACE_CATEGORIES = [
  "IELTS", "TOEFL", "General English", "Business English", 
  "Academic English", "Conversation Practice", "Grammar", "Vocabulary"
];

const TONE_OPTIONS = [
  { value: "formal", label: "Formal", description: "Professional and structured" },
  { value: "casual", label: "Casual", description: "Relaxed and conversational" },
  { value: "friendly", label: "Friendly", description: "Warm and encouraging" },
  { value: "strict", label: "Strict", description: "Direct and challenging" }
];

const RESPONSE_LENGTH_OPTIONS = [
  { value: "short", label: "Short", description: "1-2 sentences" },
  { value: "medium", label: "Medium", description: "3-5 sentences" },
  { value: "long", label: "Long", description: "6+ sentences" }
];

export function AICharactersManager({ userRole }: AICharactersManagerProps) {
  const [characters, setCharacters] = useState<AICharacter[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<AICharacter | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedCharacters, setSelectedCharacters] = useState<number[]>([]);
  const [testInput, setTestInput] = useState("");
  const [testOutput, setTestOutput] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  
  const [newCharacter, setNewCharacter] = useState<CreateCharacterForm>({
    name: "",
    avatar: "",
    rolePersonality: "",
    language: "",
    level: "",
    prompt: "",
    tone: "friendly",
    responseLength: "medium",
    useTimer: false,
    marketplaceCategory: "",
    tags: [],
    status: "draft"
  });

  // Initialize with sample data
  React.useEffect(() => {
    setCharacters([
      {
        id: 1,
        name: "Emma Thompson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616c96df509?w=150&h=150&fit=crop&crop=face",
        rolePersonality: "IELTS Examiner",
        language: "English",
        level: "B2",
        prompt: "You are Emma Thompson, an experienced IELTS examiner with 10 years of experience. You help students practice speaking and writing tasks with detailed feedback on their performance according to IELTS criteria.",
        tone: "formal",
        responseLength: "medium",
        useTimer: true,
        marketplaceCategory: "IELTS",
        tags: ["speaking", "writing", "formal"],
        status: "active",
        lastUpdated: "2024-03-15",
        createdBy: "admin",
        usageStats: {
          sessionsStarted: 1247,
          avgRating: 4.8,
          lastUsed: "2024-03-15",
          totalInteractions: 5431
        }
      },
      {
        id: 2,
        name: "Carlos Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        rolePersonality: "Conversation Partner",
        language: "Spanish",
        level: "A2",
        prompt: "You are Carlos, a friendly Spanish conversation partner from Madrid. You love discussing daily life, culture, and helping beginners practice basic Spanish conversations in a relaxed, encouraging way.",
        tone: "friendly",
        responseLength: "short",
        useTimer: false,
        marketplaceCategory: "Conversation Practice",
        tags: ["conversation", "beginner", "culture"],
        status: "active",
        lastUpdated: "2024-03-14",
        createdBy: "content_manager",
        usageStats: {
          sessionsStarted: 892,
          avgRating: 4.9,
          lastUsed: "2024-03-15",
          totalInteractions: 3247
        }
      },
      {
        id: 3,
        name: "Dr. Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        rolePersonality: "Business English Coach",
        language: "English",
        level: "C1",
        prompt: "You are Dr. Sarah Chen, a business English specialist with expertise in corporate communication, presentations, and professional writing. You help advanced students refine their business English skills.",
        tone: "formal",
        responseLength: "long",
        useTimer: false,
        marketplaceCategory: "Business English",
        tags: ["business", "professional", "advanced"],
        status: "draft",
        lastUpdated: "2024-03-13",
        createdBy: "admin",
        usageStats: {
          sessionsStarted: 234,
          avgRating: 4.7,
          lastUsed: "2024-03-10",
          totalInteractions: 987
        }
      }
    ]);
  }, []);

  // Permission checks
  const canCreate = hasPermission(userRole, "ai_config", "C");
  const canUpdate = hasPermission(userRole, "ai_config", "U");
  const canDelete = hasPermission(userRole, "ai_config", "D");
  const canConfigure = hasPermission(userRole, "ai_config", "G");
  const canRead = hasPermission(userRole, "ai_config", "R");

  // Filter characters based on search and filters
  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         character.rolePersonality.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         character.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = !filterLanguage || filterLanguage === "all" || character.language === filterLanguage;
    const matchesLevel = !filterLevel || filterLevel === "all" || character.level === filterLevel;
    const matchesStatus = !filterStatus || filterStatus === "all" || character.status === filterStatus;
    
    return matchesSearch && matchesLanguage && matchesLevel && matchesStatus;
  });

  // Handler functions
  const handleCreateCharacter = () => {
    if (!newCharacter.name || !newCharacter.language || !newCharacter.level || !newCharacter.prompt) {
      toast.error("Please fill in all required fields");
      return;
    }

    const character: AICharacter = {
      ...newCharacter,
      id: Date.now(),
      lastUpdated: new Date().toISOString().split('T')[0],
      createdBy: userRole.toLowerCase(),
      usageStats: {
        sessionsStarted: 0,
        avgRating: 0,
        lastUsed: "",
        totalInteractions: 0
      }
    };

    setCharacters([...characters, character]);
    setNewCharacter({
      name: "",
      avatar: "",
      rolePersonality: "",
      language: "",
      level: "",
      prompt: "",
      tone: "friendly",
      responseLength: "medium",
      useTimer: false,
      marketplaceCategory: "",
      tags: [],
      status: "draft"
    });
    setIsCreateOpen(false);
    toast.success("AI character created successfully");
  };

  const handleEditCharacter = (character: AICharacter) => {
    setSelectedCharacter(character);
    setNewCharacter({
      name: character.name,
      avatar: character.avatar,
      rolePersonality: character.rolePersonality,
      language: character.language,
      level: character.level,
      prompt: character.prompt,
      tone: character.tone,
      responseLength: character.responseLength,
      useTimer: character.useTimer,
      marketplaceCategory: character.marketplaceCategory,
      tags: character.tags,
      status: character.status
    });
    setIsEditOpen(true);
  };

  const handleUpdateCharacter = () => {
    if (!selectedCharacter) return;

    const updatedCharacters = characters.map(c => 
      c.id === selectedCharacter.id 
        ? {
            ...c,
            ...newCharacter,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : c
    );

    setCharacters(updatedCharacters);
    setSelectedCharacter(null);
    setIsEditOpen(false);
    toast.success("Character updated successfully");
  };

  const handleDeleteCharacter = (characterId: number) => {
    setCharacters(characters.filter(c => c.id !== characterId));
    toast.success("Character deleted successfully");
  };

  const handleDuplicateCharacter = (character: AICharacter) => {
    const duplicated: AICharacter = {
      ...character,
      id: Date.now(),
      name: `${character.name} (Copy)`,
      status: "draft",
      lastUpdated: new Date().toISOString().split('T')[0],
      usageStats: {
        sessionsStarted: 0,
        avgRating: 0,
        lastUsed: "",
        totalInteractions: 0
      }
    };
    setCharacters([...characters, duplicated]);
    toast.success("Character duplicated successfully");
  };

  const handleBulkAction = (action: string) => {
    if (selectedCharacters.length === 0) {
      toast.error("Please select characters first");
      return;
    }

    const updatedCharacters = characters.map(c => {
      if (selectedCharacters.includes(c.id)) {
        switch (action) {
          case "activate":
            return { ...c, status: "active" as const };
          case "deactivate":
            return { ...c, status: "draft" as const };
          case "archive":
            return { ...c, status: "archived" as const };
        }
      }
      return c;
    });

    if (action === "delete") {
      setCharacters(characters.filter(c => !selectedCharacters.includes(c.id)));
    } else {
      setCharacters(updatedCharacters);
    }

    setSelectedCharacters([]);
    toast.success(`Bulk ${action} completed successfully`);
  };

  const handleTestCharacter = async (character: AICharacter) => {
    if (!testInput.trim()) {
      toast.error("Please enter test input");
      return;
    }

    setIsTesting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestOutput(`[${character.name} - ${character.tone} tone, ${character.responseLength} response]\n\nHello! Thank you for your message: "${testInput}"\n\nThis is a simulated response from ${character.name}. In a real implementation, this would be processed by the AI model using the character's specific prompt and behavioral settings.\n\nCharacter traits:\n- Tone: ${character.tone}\n- Response length: ${character.responseLength}\n- Timer enabled: ${character.useTimer ? 'Yes' : 'No'}`);
      toast.success("Character test completed");
    } catch (error) {
      toast.error("Test failed");
    } finally {
      setIsTesting(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !newCharacter.tags.includes(tag)) {
      setNewCharacter({
        ...newCharacter,
        tags: [...newCharacter.tags, tag]
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewCharacter({
      ...newCharacter,
      tags: newCharacter.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelColor = (level: string) => {
    const levelNum = level.charAt(0);
    switch (levelNum) {
      case "A": return "bg-blue-100 text-blue-800";
      case "B": return "bg-purple-100 text-purple-800";
      case "C": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
          <h1 className="text-3xl font-bold">AI Characters Manager</h1>
          <p className="text-muted-foreground">
            Create and manage AI characters for student practice sessions
          </p>
          <div className="flex items-center space-x-4 mt-2">
            <Badge variant="secondary">
              {characters.length} Total Characters
            </Badge>
            <Badge variant="outline">
              {characters.filter(c => c.status === "active").length} Active
            </Badge>
            <Badge variant="outline">
              Role: {userRole.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        
        <PermissionGate userRole={userRole} module="ai_config" permission="C">
          <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Character
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[600px] sm:w-[700px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Create AI Character</SheetTitle>
                <SheetDescription>
                  Design a new AI character for student practice sessions
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 mt-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-medium">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Character Name *</Label>
                      <Input
                        id="name"
                        value={newCharacter.name}
                        onChange={(e) => setNewCharacter({...newCharacter, name: e.target.value})}
                        placeholder="e.g., Emma Thompson"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role/Personality *</Label>
                      <Input
                        id="role"
                        value={newCharacter.rolePersonality}
                        onChange={(e) => setNewCharacter({...newCharacter, rolePersonality: e.target.value})}
                        placeholder="e.g., IELTS Examiner"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="avatar"
                        value={newCharacter.avatar}
                        onChange={(e) => setNewCharacter({...newCharacter, avatar: e.target.value})}
                        placeholder="https://example.com/avatar.jpg"
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Language & Level */}
                <div className="space-y-4">
                  <h3 className="font-medium">Language & Level</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Language *</Label>
                      <Select value={newCharacter.language} onValueChange={(value) => setNewCharacter({...newCharacter, language: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUPPORTED_LANGUAGES.map(lang => (
                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>CEFR Level *</Label>
                      <Select value={newCharacter.level} onValueChange={(value) => setNewCharacter({...newCharacter, level: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {CEFR_LEVELS.map(level => (
                            <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Prompt Definition */}
                <div className="space-y-4">
                  <h3 className="font-medium">Prompt Definition</h3>
                  <div>
                    <Label htmlFor="prompt">Character Prompt *</Label>
                    <Textarea
                      id="prompt"
                      value={newCharacter.prompt}
                      onChange={(e) => setNewCharacter({...newCharacter, prompt: e.target.value})}
                      placeholder="Define how this AI character should behave, respond, and interact with students..."
                      className="min-h-32"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {newCharacter.prompt.length}/1000 characters
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Behavior Settings */}
                <div className="space-y-4">
                  <h3 className="font-medium">Behavior Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tone</Label>
                      <Select value={newCharacter.tone} onValueChange={(value: any) => setNewCharacter({...newCharacter, tone: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TONE_OPTIONS.map(tone => (
                            <SelectItem key={tone.value} value={tone.value}>
                              {tone.label} - {tone.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Response Length</Label>
                      <Select value={newCharacter.responseLength} onValueChange={(value: any) => setNewCharacter({...newCharacter, responseLength: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RESPONSE_LENGTH_OPTIONS.map(length => (
                            <SelectItem key={length.value} value={length.value}>
                              {length.label} - {length.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="timer"
                      checked={newCharacter.useTimer}
                      onCheckedChange={(checked) => setNewCharacter({...newCharacter, useTimer: checked})}
                    />
                    <Label htmlFor="timer">Enable timer for timed exercises</Label>
                  </div>
                </div>

                <Separator />

                {/* Content Alignment */}
                <div className="space-y-4">
                  <h3 className="font-medium">Content Alignment</h3>
                  <div>
                    <Label>Marketplace Category</Label>
                    <Select value={newCharacter.marketplaceCategory} onValueChange={(value) => setNewCharacter({...newCharacter, marketplaceCategory: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {MARKETPLACE_CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Tags */}
                <div className="space-y-4">
                  <h3 className="font-medium">Tags</h3>
                  <div>
                    <Label>Add Tags</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        placeholder="Enter tag and press Enter"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const target = e.target as HTMLInputElement;
                            addTag(target.value);
                            target.value = '';
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newCharacter.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCharacter}>
                    Create Character
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </PermissionGate>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-2xl font-bold">{characters.length}</p>
                <p className="text-sm text-muted-foreground">Total Characters</p>
                <p className="text-xs text-green-600">+2 this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-2xl font-bold">{characters.filter(c => c.status === "active").length}</p>
                <p className="text-sm text-muted-foreground">Active Characters</p>
                <p className="text-xs text-green-600">Available to students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div className="flex-1">
                <p className="text-2xl font-bold">{characters.reduce((sum, c) => sum + c.usageStats.sessionsStarted, 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-xs text-green-600">+15% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <p className="text-2xl font-bold">
                  {characters.length > 0 ? 
                    (characters.reduce((sum, c) => sum + c.usageStats.avgRating, 0) / characters.length).toFixed(1) : 
                    "0.0"
                  }
                </p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-xs text-green-600">+0.2 this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role-based help text */}
      {userRole === "CONTENT_MANAGER" && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Content Manager Access</h4>
              <p className="text-sm text-blue-700">
                You can create, edit, and configure AI characters for student practice sessions. Design engaging personalities that match different learning levels and goals.
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
                You can view AI character details and usage statistics. Contact a Content Manager or Administrator to request new characters or modifications.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search characters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {CEFR_LEVELS.map(level => (
                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {selectedCharacters.length > 0 && (
              <div className="flex gap-2">
                <PermissionGate userRole={userRole} module="ai_config" permission="U">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("activate")}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Activate ({selectedCharacters.length})
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("deactivate")}>
                    <XCircle className="w-4 h-4 mr-1" />
                    Deactivate
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("archive")}>
                    <Archive className="w-4 h-4 mr-1" />
                    Archive
                  </Button>
                </PermissionGate>
                <PermissionGate userRole={userRole} module="ai_config" permission="D">
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </PermissionGate>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Characters Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedCharacters.length === filteredCharacters.length && filteredCharacters.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCharacters(filteredCharacters.map(c => c.id));
                      } else {
                        setSelectedCharacters([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Character</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Prompt Summary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCharacters.map((character) => (
                <TableRow key={character.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCharacters.includes(character.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCharacters([...selectedCharacters, character.id]);
                        } else {
                          setSelectedCharacters(selectedCharacters.filter(id => id !== character.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={character.avatar} />
                        <AvatarFallback>{character.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{character.name}</div>
                        <div className="text-sm text-muted-foreground">{character.rolePersonality}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span>{character.language}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getLevelColor(character.level)} variant="outline">
                      {character.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm text-muted-foreground truncate">
                      {character.prompt.substring(0, 100)}...
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(character.status)}>
                      {character.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{character.usageStats.sessionsStarted}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Star className="w-3 h-3" />
                        <span>{character.usageStats.avgRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {character.lastUpdated}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => {
                          setSelectedCharacter(character);
                          setIsDetailOpen(true);
                        }}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedCharacter(character);
                          setIsTestOpen(true);
                        }}>
                          <TestTube className="w-4 h-4 mr-2" />
                          Test Character
                        </DropdownMenuItem>
                        <PermissionGate userRole={userRole} module="ai_config" permission="U">
                          <DropdownMenuItem onClick={() => handleEditCharacter(character)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        </PermissionGate>
                        <DropdownMenuItem onClick={() => handleDuplicateCharacter(character)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <PermissionGate userRole={userRole} module="ai_config" permission="D">
                          <DropdownMenuItem 
                            onClick={() => handleDeleteCharacter(character.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </PermissionGate>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredCharacters.length === 0 && (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Characters Found</h3>
              <p className="text-muted-foreground mb-4">
                {characters.length === 0 ? 
                  "Create your first AI character to get started" : 
                  "Try adjusting your search filters"
                }
              </p>
              {characters.length === 0 && (
                <PermissionGate userRole={userRole} module="ai_config" permission="C">
                  <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Character
                  </Button>
                </PermissionGate>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Character Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Character Details: {selectedCharacter?.name}</DialogTitle>
            <DialogDescription>
              Complete information and usage statistics
            </DialogDescription>
          </DialogHeader>
          {selectedCharacter && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src={selectedCharacter.avatar} />
                      <AvatarFallback className="text-lg">
                        {selectedCharacter.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium">{selectedCharacter.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedCharacter.rolePersonality}</p>
                    <div className="flex justify-center space-x-2 mt-2">
                      <Badge className={getStatusColor(selectedCharacter.status)}>
                        {selectedCharacter.status}
                      </Badge>
                      <Badge className={getLevelColor(selectedCharacter.level)} variant="outline">
                        {selectedCharacter.level}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Configuration</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Language:</span>
                        <span>{selectedCharacter.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tone:</span>
                        <span className="capitalize">{selectedCharacter.tone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Response Length:</span>
                        <span className="capitalize">{selectedCharacter.responseLength}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Timer:</span>
                        <span>{selectedCharacter.useTimer ? 'Enabled' : 'Disabled'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span>{selectedCharacter.marketplaceCategory}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Usage Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Sessions</span>
                        </div>
                        <span className="font-medium">{selectedCharacter.usageStats.sessionsStarted.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm">Avg Rating</span>
                        </div>
                        <span className="font-medium">{selectedCharacter.usageStats.avgRating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Interactions</span>
                        </div>
                        <span className="font-medium">{selectedCharacter.usageStats.totalInteractions.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">Last Used</span>
                        </div>
                        <span className="font-medium">{selectedCharacter.usageStats.lastUsed || 'Never'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="font-medium mb-2">Full Prompt</h4>
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">{selectedCharacter.prompt}</pre>
                </div>
              </div>

              {selectedCharacter.tags.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCharacter.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Close
                </Button>
                <PermissionGate userRole={userRole} module="ai_config" permission="U">
                  <Button onClick={() => {
                    setIsDetailOpen(false);
                    handleEditCharacter(selectedCharacter);
                  }}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Character
                  </Button>
                </PermissionGate>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Test Character Dialog */}
      <Dialog open={isTestOpen} onOpenChange={setIsTestOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Test Character: {selectedCharacter?.name}</DialogTitle>
            <DialogDescription>
              Preview how this character responds to student input
            </DialogDescription>
          </DialogHeader>
          {selectedCharacter && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Test Input</Label>
                    <Textarea 
                      placeholder="Enter a message as if you were a student..."
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      className="min-h-32"
                    />
                  </div>
                  
                  <Button 
                    onClick={() => handleTestCharacter(selectedCharacter)}
                    disabled={isTesting || !testInput.trim()}
                    className="w-full"
                  >
                    {isTesting ? (
                      <>
                        <Activity className="w-4 h-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Test Character
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Character Response</Label>
                    <div className="min-h-32 p-4 bg-muted rounded-lg border">
                      {testOutput ? (
                        <pre className="whitespace-pre-wrap text-sm">{testOutput}</pre>
                      ) : (
                        <p className="text-muted-foreground text-sm">Click "Test Character" to see the response...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Character Configuration</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tone:</span>
                    <p className="font-medium capitalize">{selectedCharacter.tone}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Response Length:</span>
                    <p className="font-medium capitalize">{selectedCharacter.responseLength}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Timer:</span>
                    <p className="font-medium">{selectedCharacter.useTimer ? 'Enabled' : 'Disabled'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Level:</span>
                    <p className="font-medium">{selectedCharacter.level}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setIsTestOpen(false);
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

      {/* Edit Character Sheet - Complete form similar to create */}
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent className="w-[600px] sm:w-[700px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit AI Character</SheetTitle>
            <SheetDescription>
              Update the character configuration and settings
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-6 mt-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-medium">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Character Name *</Label>
                  <Input
                    id="edit-name"
                    value={newCharacter.name}
                    onChange={(e) => setNewCharacter({...newCharacter, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-role">Role/Personality *</Label>
                  <Input
                    id="edit-role"
                    value={newCharacter.rolePersonality}
                    onChange={(e) => setNewCharacter({...newCharacter, rolePersonality: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-avatar">Avatar URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="edit-avatar"
                    value={newCharacter.avatar}
                    onChange={(e) => setNewCharacter({...newCharacter, avatar: e.target.value})}
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Language & Level */}
            <div className="space-y-4">
              <h3 className="font-medium">Language & Level</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Language *</Label>
                  <Select value={newCharacter.language} onValueChange={(value) => setNewCharacter({...newCharacter, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>CEFR Level *</Label>
                  <Select value={newCharacter.level} onValueChange={(value) => setNewCharacter({...newCharacter, level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CEFR_LEVELS.map(level => (
                        <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Prompt Definition */}
            <div className="space-y-4">
              <h3 className="font-medium">Prompt Definition</h3>
              <div>
                <Label htmlFor="edit-prompt">Character Prompt *</Label>
                <Textarea
                  id="edit-prompt"
                  value={newCharacter.prompt}
                  onChange={(e) => setNewCharacter({...newCharacter, prompt: e.target.value})}
                  className="min-h-32"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {newCharacter.prompt.length}/1000 characters
                </p>
              </div>
            </div>

            <Separator />

            {/* Behavior Settings */}
            <div className="space-y-4">
              <h3 className="font-medium">Behavior Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tone</Label>
                  <Select value={newCharacter.tone} onValueChange={(value: any) => setNewCharacter({...newCharacter, tone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONE_OPTIONS.map(tone => (
                        <SelectItem key={tone.value} value={tone.value}>
                          {tone.label} - {tone.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Response Length</Label>
                  <Select value={newCharacter.responseLength} onValueChange={(value: any) => setNewCharacter({...newCharacter, responseLength: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RESPONSE_LENGTH_OPTIONS.map(length => (
                        <SelectItem key={length.value} value={length.value}>
                          {length.label} - {length.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-timer"
                  checked={newCharacter.useTimer}
                  onCheckedChange={(checked) => setNewCharacter({...newCharacter, useTimer: checked})}
                />
                <Label htmlFor="edit-timer">Enable timer for timed exercises</Label>
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div className="space-y-4">
              <h3 className="font-medium">Status</h3>
              <Select value={newCharacter.status} onValueChange={(value: any) => setNewCharacter({...newCharacter, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Content Alignment */}
            <div className="space-y-4">
              <h3 className="font-medium">Content Alignment</h3>
              <div>
                <Label>Marketplace Category</Label>
                <Select value={newCharacter.marketplaceCategory} onValueChange={(value) => setNewCharacter({...newCharacter, marketplaceCategory: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MARKETPLACE_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="font-medium">Tags</h3>
              <div>
                <Label>Add Tags</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    placeholder="Enter tag and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        addTag(target.value);
                        target.value = '';
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newCharacter.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCharacter}>
                Update Character
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}