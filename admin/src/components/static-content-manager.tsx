import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import {
  Search,
  Edit,
  Save,
  Eye,
  Clock,
  Globe,
  ChevronDown,
  ChevronRight,
  Smartphone,
  Monitor,
  Building,
  Home as HomeIcon,
  GraduationCap,
  Users,
  Phone,
  Mail,
  MapPin,
  Star,
  Share,
  FileText,
  Shield,
  RefreshCw,
  History,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  Copy,
  Languages,
  Undo2,
  Settings
} from "lucide-react";
import { UserRole, hasPermission } from "../utils/permissions";
import { format } from "date-fns";

interface ContentPage {
  id: string;
  key: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  hasContactFields?: boolean;
  hasAppLinks?: boolean;
  hasSocialLinks?: boolean;
}

interface ContentVersion {
  id: string;
  pageId: string;
  appType: string;
  language: string;
  title: string;
  content: string;
  contactDetails?: {
    phone?: string;
    email?: string;
    mapLink?: string;
  };
  appLinks?: {
    iosLink?: string;
    androidLink?: string;
    webLink?: string;
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  version: number;
  lastModified: Date;
  modifiedBy: string;
  isPublished: boolean;
  isDraft: boolean;
}

interface StaticContentManagerProps {
  userRole: UserRole;
}

const contentPages: ContentPage[] = [
  {
    id: "about",
    key: "about_us",
    name: "About Us",
    icon: FileText,
    description: "Company information and mission statement"
  },
  {
    id: "contact",
    key: "call_us",
    name: "Call Us",
    icon: Phone,
    description: "Contact information and support details",
    hasContactFields: true
  },
  {
    id: "faq",
    key: "faqs",
    name: "FAQs (Afaq)",
    icon: AlertCircle,
    description: "Frequently asked questions and answers"
  },
  {
    id: "privacy",
    key: "privacy_policy",
    name: "Privacy & Policy",
    icon: Shield,
    description: "Privacy policy and data protection information"
  },
  {
    id: "terms",
    key: "terms_conditions",
    name: "Terms & Conditions",
    icon: FileText,
    description: "Terms of service and user agreements"
  },
  {
    id: "returns",
    key: "return_policy",
    name: "Return Policy",
    icon: RefreshCw,
    description: "Refund and return policy information"
  },
  {
    id: "rate",
    key: "rate_us",
    name: "Rate Us",
    icon: Star,
    description: "App store rating and review links",
    hasAppLinks: true
  },
  {
    id: "share",
    key: "share_app",
    name: "Share the App",
    icon: Share,
    description: "Social sharing links and app promotion",
    hasSocialLinks: true,
    hasAppLinks: true
  }
];

const appTypes = [
  { id: "student", name: "Student App", icon: Users, color: "bg-blue-100 text-blue-800" },
  { id: "teacher", name: "Teacher Panel", icon: GraduationCap, color: "bg-green-100 text-green-800" },
  { id: "institution", name: "Institution Panel", icon: Building, color: "bg-purple-100 text-purple-800" },
  { id: "homestay", name: "Homestay Panel", icon: HomeIcon, color: "bg-orange-100 text-orange-800" }
];

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" }
];

export function StaticContentManager({ userRole }: StaticContentManagerProps) {
  const [selectedApp, setSelectedApp] = useState<string>("student");
  const [selectedPage, setSelectedPage] = useState<string>("about");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [editingContent, setEditingContent] = useState<ContentVersion | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedApps, setExpandedApps] = useState<Set<string>>(new Set(["student"]));

  // Sample content data
  const [contentVersions] = useState<ContentVersion[]>([
    {
      id: "about_student_en_v1",
      pageId: "about",
      appType: "student",
      language: "en",
      title: "About Learning Platform",
      content: "Welcome to Learning Platform, your gateway to mastering new languages through immersive experiences. Our platform connects students with qualified teachers, authentic homestays, and accredited institutions worldwide.\n\nOur mission is to make language learning accessible, effective, and enjoyable for everyone. Whether you're looking to learn Spanish in Barcelona, French in Paris, or Arabic in Cairo, we provide the tools and connections you need to succeed.\n\nWith over 100,000 satisfied learners and partnerships with 500+ institutions globally, we're committed to transforming how people learn languages.",
      version: 1,
      lastModified: new Date("2024-01-22"),
      modifiedBy: "admin@learningplatform.com",
      isPublished: true,
      isDraft: false
    },
    {
      id: "about_student_ar_v1",
      pageId: "about",
      appType: "student",
      language: "ar",
      title: "حول منصة التعلم",
      content: "مرحباً بكم في منصة التعلم، بوابتكم لإتقان اللغات الجديدة من خلال التجارب الغامرة. منصتنا تربط الطلاب بالمعلمين المؤهلين والعائلات المضيفة الأصيلة والمؤسسات المعتمدة حول العالم.\n\nمهمتنا هي جعل تعلم اللغات في متناول الجميع وفعالاً وممتعاً. سواء كنت تتطلع لتعلم الإسبانية في برشلونة أو الفرنسية في باريس أو العربية في القاهرة، نحن نوفر الأدوات والاتصالات التي تحتاجها للنجاح.\n\nمع أكثر من 100,000 متعلم راضٍ وشراكات مع أكثر من 500 مؤسسة عالمياً، نحن ملتزمون بتحويل طريقة تعلم الناس للغات.",
      version: 1,
      lastModified: new Date("2024-01-20"),
      modifiedBy: "content@learningplatform.com",
      isPublished: true,
      isDraft: false
    },
    {
      id: "contact_student_en_v1",
      pageId: "contact",
      appType: "student",
      language: "en",
      title: "Contact Our Support Team",
      content: "Need help? Our dedicated support team is here to assist you 24/7. Whether you have questions about bookings, technical issues, or need guidance on your learning journey, we're just a call or message away.\n\nOur multilingual support team speaks over 15 languages and understands the unique challenges of language learning. Don't hesitate to reach out - we're here to help you succeed!",
      contactDetails: {
        phone: "+1-800-LEARN-NOW",
        email: "support@learningplatform.com",
        mapLink: "https://maps.google.com/example"
      },
      version: 1,
      lastModified: new Date("2024-01-21"),
      modifiedBy: "support@learningplatform.com",
      isPublished: true,
      isDraft: false
    }
  ]);

  const getCurrentContent = (): ContentVersion | null => {
    return contentVersions.find(v => 
      v.pageId === selectedPage && 
      v.appType === selectedApp && 
      v.language === selectedLanguage
    ) || null;
  };

  const currentPage = contentPages.find(p => p.id === selectedPage);
  const currentApp = appTypes.find(a => a.id === selectedApp);
  const currentLanguage = languages.find(l => l.code === selectedLanguage);
  const currentContent = getCurrentContent();

  const handleEditContent = () => {
    if (currentContent) {
      setEditingContent({ ...currentContent });
    } else {
      // Create new content version
      const newContent: ContentVersion = {
        id: `${selectedPage}_${selectedApp}_${selectedLanguage}_v1`,
        pageId: selectedPage,
        appType: selectedApp,
        language: selectedLanguage,
        title: `New ${currentPage?.name} - ${currentApp?.name}`,
        content: "",
        version: 1,
        lastModified: new Date(),
        modifiedBy: "current-user@learningplatform.com",
        isPublished: false,
        isDraft: true
      };
      setEditingContent(newContent);
    }
  };

  const handleSaveContent = () => {
    if (editingContent) {
      // In a real app, this would save to the backend
      console.log("Saving content:", editingContent);
      setEditingContent(null);
    }
  };

  const toggleAppExpansion = (appId: string) => {
    const newExpanded = new Set(expandedApps);
    if (newExpanded.has(appId)) {
      newExpanded.delete(appId);
    } else {
      newExpanded.add(appId);
    }
    setExpandedApps(newExpanded);
  };

  const getContentStatus = (pageId: string, appType: string, language: string) => {
    const content = contentVersions.find(v => 
      v.pageId === pageId && v.appType === appType && v.language === language
    );
    
    if (!content) return "missing";
    if (content.isDraft) return "draft";
    if (content.isPublished) return "published";
    return "pending";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-blue-100 text-blue-800";
      case "missing": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const canEdit = hasPermission(userRole, "static_content", "U");
  const canCreate = hasPermission(userRole, "static_content", "C");
  const canDelete = hasPermission(userRole, "static_content", "D");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Content Manager</h1>
          <p className="text-muted-foreground">
            Manage static content pages across all platform applications
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" onClick={() => setShowVersionHistory(true)}>
            <History className="w-4 h-4 mr-2" />
            Version History
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Content Navigation</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {appTypes.map((app) => (
                  <div key={app.id} className="space-y-1">
                    <Collapsible
                      open={expandedApps.has(app.id)}
                      onOpenChange={() => toggleAppExpansion(app.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start p-2 h-auto"
                        >
                          {expandedApps.has(app.id) ? (
                            <ChevronDown className="w-4 h-4 mr-2" />
                          ) : (
                            <ChevronRight className="w-4 h-4 mr-2" />
                          )}
                          <app.icon className="w-4 h-4 mr-2" />
                          <span className="font-medium">{app.name}</span>
                        </Button>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="ml-6 space-y-2">
                        {contentPages.map((page) => (
                          <div key={page.id} className="space-y-1">
                            <Button
                              variant={selectedPage === page.id && selectedApp === app.id ? "secondary" : "ghost"}
                              className="w-full justify-start p-2 h-auto"
                              onClick={() => {
                                setSelectedPage(page.id);
                                setSelectedApp(app.id);
                              }}
                            >
                              <page.icon className="w-3 h-3 mr-2" />
                              <span className="text-sm">{page.name}</span>
                            </Button>
                            
                            {/* Language status indicators */}
                            <div className="ml-5 flex flex-wrap gap-1">
                              {languages.map((lang) => {
                                const status = getContentStatus(page.id, app.id, lang.code);
                                return (
                                  <Badge
                                    key={lang.code}
                                    className={`text-xs px-1 py-0 ${getStatusColor(status)}`}
                                    title={`${lang.name}: ${status}`}
                                  >
                                    {lang.flag}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Content Editor */}
        <div className="lg:col-span-3 space-y-6">
          {/* Content Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {currentPage && <currentPage.icon className="w-5 h-5" />}
                  <div>
                    <h2 className="text-lg font-semibold">
                      {currentPage?.name} - {currentApp?.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {currentPage?.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center space-x-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {canEdit && (
                    <Button onClick={handleEditContent}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Content Display/Editor */}
          {editingContent ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Content</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(editingContent.isDraft ? "draft" : "published")}>
                    {editingContent.isDraft ? "Draft" : "Published"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Version {editingContent.version}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Page Title</Label>
                  <Input
                    value={editingContent.title}
                    onChange={(e) => setEditingContent(prev => prev ? {
                      ...prev,
                      title: e.target.value
                    } : null)}
                    placeholder="Enter page title..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={editingContent.content}
                    onChange={(e) => setEditingContent(prev => prev ? {
                      ...prev,
                      content: e.target.value
                    } : null)}
                    placeholder="Enter page content..."
                    className="min-h-[300px]"
                  />
                </div>

                {/* Contact Fields */}
                {currentPage?.hasContactFields && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Phone Number</Label>
                          <Input
                            value={editingContent.contactDetails?.phone || ""}
                            onChange={(e) => setEditingContent(prev => prev ? {
                              ...prev,
                              contactDetails: { ...prev.contactDetails, phone: e.target.value }
                            } : null)}
                            placeholder="+1-800-EXAMPLE"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Email Address</Label>
                          <Input
                            value={editingContent.contactDetails?.email || ""}
                            onChange={(e) => setEditingContent(prev => prev ? {
                              ...prev,
                              contactDetails: { ...prev.contactDetails, email: e.target.value }
                            } : null)}
                            placeholder="support@example.com"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Map Link</Label>
                        <Input
                          value={editingContent.contactDetails?.mapLink || ""}
                          onChange={(e) => setEditingContent(prev => prev ? {
                            ...prev,
                            contactDetails: { ...prev.contactDetails, mapLink: e.target.value }
                          } : null)}
                          placeholder="https://maps.google.com/..."
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* App Links */}
                {currentPage?.hasAppLinks && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">App Store Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>iOS App Store</Label>
                        <Input
                          value={editingContent.appLinks?.iosLink || ""}
                          onChange={(e) => setEditingContent(prev => prev ? {
                            ...prev,
                            appLinks: { ...prev.appLinks, iosLink: e.target.value }
                          } : null)}
                          placeholder="https://apps.apple.com/..."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Android Play Store</Label>
                        <Input
                          value={editingContent.appLinks?.androidLink || ""}
                          onChange={(e) => setEditingContent(prev => prev ? {
                            ...prev,
                            appLinks: { ...prev.appLinks, androidLink: e.target.value }
                          } : null)}
                          placeholder="https://play.google.com/..."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Web Application</Label>
                        <Input
                          value={editingContent.appLinks?.webLink || ""}
                          onChange={(e) => setEditingContent(prev => prev ? {
                            ...prev,
                            appLinks: { ...prev.appLinks, webLink: e.target.value }
                          } : null)}
                          placeholder="https://webapp.example.com"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Social Links */}
                {currentPage?.hasSocialLinks && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Social Media Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Facebook</Label>
                          <Input
                            value={editingContent.socialLinks?.facebook || ""}
                            onChange={(e) => setEditingContent(prev => prev ? {
                              ...prev,
                              socialLinks: { ...prev.socialLinks, facebook: e.target.value }
                            } : null)}
                            placeholder="https://facebook.com/..."
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Twitter</Label>
                          <Input
                            value={editingContent.socialLinks?.twitter || ""}
                            onChange={(e) => setEditingContent(prev => prev ? {
                              ...prev,
                              socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                            } : null)}
                            placeholder="https://twitter.com/..."
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Instagram</Label>
                          <Input
                            value={editingContent.socialLinks?.instagram || ""}
                            onChange={(e) => setEditingContent(prev => prev ? {
                              ...prev,
                              socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                            } : null)}
                            placeholder="https://instagram.com/..."
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>LinkedIn</Label>
                          <Input
                            value={editingContent.socialLinks?.linkedin || ""}
                            onChange={(e) => setEditingContent(prev => prev ? {
                              ...prev,
                              socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                            } : null)}
                            placeholder="https://linkedin.com/..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingContent(null)}>
                    Cancel
                  </Button>
                  <Button variant="outline" onClick={() => {
                    if (editingContent) {
                      setEditingContent(prev => prev ? { ...prev, isDraft: true } : null);
                    }
                  }}>
                    Save as Draft
                  </Button>
                  <Button onClick={handleSaveContent}>
                    <Save className="w-4 h-4 mr-2" />
                    Publish
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Content Display */
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Current Content</CardTitle>
                  {currentContent && (
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(currentContent.isDraft ? "draft" : "published")}>
                        {currentContent.isDraft ? "Draft" : "Published"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Version {currentContent.version}
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {currentContent ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">{currentContent.title}</h3>
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap text-sm">
                          {currentContent.content}
                        </div>
                      </div>
                    </div>

                    {currentContent.contactDetails && (
                      <div>
                        <h4 className="font-medium mb-2">Contact Information</h4>
                        <div className="space-y-1 text-sm">
                          {currentContent.contactDetails.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="w-3 h-3" />
                              <span>{currentContent.contactDetails.phone}</span>
                            </div>
                          )}
                          {currentContent.contactDetails.email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="w-3 h-3" />
                              <span>{currentContent.contactDetails.email}</span>
                            </div>
                          )}
                          {currentContent.contactDetails.mapLink && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-3 h-3" />
                              <a href={currentContent.contactDetails.mapLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                View on Map <ExternalLink className="w-3 h-3 inline" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {currentContent.appLinks && (
                      <div>
                        <h4 className="font-medium mb-2">App Links</h4>
                        <div className="space-y-1 text-sm">
                          {currentContent.appLinks.iosLink && (
                            <div className="flex items-center space-x-2">
                              <Smartphone className="w-3 h-3" />
                              <a href={currentContent.appLinks.iosLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                iOS App Store <ExternalLink className="w-3 h-3 inline" />
                              </a>
                            </div>
                          )}
                          {currentContent.appLinks.androidLink && (
                            <div className="flex items-center space-x-2">
                              <Smartphone className="w-3 h-3" />
                              <a href={currentContent.appLinks.androidLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Android Play Store <ExternalLink className="w-3 h-3 inline" />
                              </a>
                            </div>
                          )}
                          {currentContent.appLinks.webLink && (
                            <div className="flex items-center space-x-2">
                              <Monitor className="w-3 h-3" />
                              <a href={currentContent.appLinks.webLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Web Application <ExternalLink className="w-3 h-3 inline" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <Separator />
                    
                    <div className="text-xs text-muted-foreground">
                      Last modified: {format(currentContent.lastModified, "MMM dd, yyyy 'at' HH:mm")} by {currentContent.modifiedBy}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No Content Available</h3>
                    <p className="text-muted-foreground mb-4">
                      This page hasn't been created yet for {currentApp?.name} in {currentLanguage?.name}.
                    </p>
                    {canCreate && (
                      <Button onClick={handleEditContent}>
                        <Edit className="w-4 h-4 mr-2" />
                        Create Content
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Content Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Content Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {languages.map((lang) => (
                  <Card key={lang.code} className="border-2">
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{lang.flag}</span>
                        <h4 className="font-medium">{lang.name}</h4>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {contentPages.map((page) => {
                        const status = getContentStatus(page.id, selectedApp, lang.code);
                        return (
                          <div key={page.id} className="flex items-center justify-between">
                            <span className="text-sm">{page.name}</span>
                            <Badge className={`text-xs ${getStatusColor(status)}`}>
                              {status}
                            </Badge>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Content Preview - {currentApp?.name}</DialogTitle>
            <DialogDescription>
              Preview how this content appears to users in the {currentApp?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            {/* Mobile Frame */}
            <div className="bg-gray-900 rounded-[2rem] p-2 mx-auto w-80">
              <div className="bg-white rounded-[1.5rem] h-[600px] overflow-hidden">
                {/* Mobile Status Bar */}
                <div className="bg-gray-50 px-4 py-2 text-xs flex justify-between">
                  <span>9:41 AM</span>
                  <span>100%</span>
                </div>
                
                {/* App Header */}
                <div className="p-4 border-b">
                  <h3 className="font-semibold">{currentPage?.name}</h3>
                </div>
                
                <ScrollArea className="h-[520px]">
                  <div className="p-4">
                    {currentContent ? (
                      <div className="space-y-4">
                        <h2 className="text-lg font-semibold">{currentContent.title}</h2>
                        <div className="text-sm whitespace-pre-wrap">
                          {currentContent.content}
                        </div>
                        
                        {currentContent.contactDetails && (
                          <div className="space-y-2 pt-4 border-t">
                            <h4 className="font-medium">Contact Us</h4>
                            {currentContent.contactDetails.phone && (
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span className="text-sm">{currentContent.contactDetails.phone}</span>
                              </div>
                            )}
                            {currentContent.contactDetails.email && (
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">{currentContent.contactDetails.email}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No content available</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Version History Dialog */}
      <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
            <DialogDescription>
              View and manage content versions for {currentPage?.name} - {currentApp?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {contentVersions
              .filter(v => v.pageId === selectedPage && v.appType === selectedApp && v.language === selectedLanguage)
              .sort((a, b) => b.version - a.version)
              .map((version) => (
                <Card key={version.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(version.isDraft ? "draft" : "published")}>
                          Version {version.version}
                        </Badge>
                        <div>
                          <h4 className="font-medium">{version.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(version.lastModified, "MMM dd, yyyy 'at' HH:mm")} by {version.modifiedBy}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        {canEdit && (
                          <Button variant="outline" size="sm">
                            <Undo2 className="w-3 h-3 mr-1" />
                            Restore
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}