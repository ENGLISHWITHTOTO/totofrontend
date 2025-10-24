import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  FolderOpen, 
  BookOpen, 
  Languages,
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Star
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface ContentManagementProps {
  userRole: string;
}

export function ContentManagement({ userRole }: ContentManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);

  const categories = [
    {
      id: 1,
      name: "Grammar Fundamentals",
      description: "Basic grammar rules and structures",
      lessonsCount: 45,
      subcategories: ["Tenses", "Sentence Structure", "Parts of Speech"],
      language: "English",
      status: "active"
    },
    {
      id: 2,
      name: "Conversation Practice",
      description: "Interactive speaking exercises",
      lessonsCount: 32,
      subcategories: ["Daily Conversations", "Business English", "Travel Phrases"],
      language: "English",
      status: "active"
    },
    {
      id: 3,
      name: "IELTS Preparation",
      description: "Comprehensive IELTS exam preparation",
      lessonsCount: 28,
      subcategories: ["Reading", "Writing", "Listening", "Speaking"],
      language: "English",
      status: "active"
    },
    {
      id: 4,
      name: "Spanish Basics",
      description: "Fundamental Spanish language lessons",
      lessonsCount: 15,
      subcategories: ["Alphabet", "Numbers", "Basic Phrases"],
      language: "Spanish",
      status: "draft"
    }
  ];

  const lessons = [
    {
      id: 1,
      title: "Present Perfect Tense",
      category: "Grammar Fundamentals",
      subcategory: "Tenses",
      difficulty: "Intermediate",
      duration: "25 min",
      type: "Official",
      status: "Published",
      views: 1247,
      rating: 4.8,
      language: "English",
      lastUpdated: "2024-03-15"
    },
    {
      id: 2,
      title: "Business Meeting Conversations",
      category: "Conversation Practice",
      subcategory: "Business English",
      difficulty: "Advanced",
      duration: "35 min",
      type: "Marketplace",
      status: "Published",
      views: 892,
      rating: 4.6,
      language: "English",
      lastUpdated: "2024-03-12"
    },
    {
      id: 3,
      title: "IELTS Writing Task 1 Strategies",
      category: "IELTS Preparation",
      subcategory: "Writing",
      difficulty: "Advanced",
      duration: "40 min",
      type: "Official",
      status: "Published",
      views: 2156,
      rating: 4.9,
      language: "English",
      lastUpdated: "2024-03-10"
    },
    {
      id: 4,
      title: "Spanish Greetings and Introductions",
      category: "Spanish Basics",
      subcategory: "Basic Phrases",
      difficulty: "Beginner",
      duration: "15 min",
      type: "Official",
      status: "Draft",
      views: 0,
      rating: 0,
      language: "Spanish",
      lastUpdated: "2024-03-18"
    }
  ];

  const languages = [
    { code: "en", name: "English", lessons: 105, status: "Active" },
    { code: "es", name: "Spanish", lessons: 15, status: "Beta" },
    { code: "fr", name: "French", lessons: 8, status: "Planning" },
    { code: "de", name: "German", lessons: 0, status: "Planning" }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published": return "bg-green-100 text-green-800";
      case "Draft": return "bg-gray-100 text-gray-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "active": return "bg-green-100 text-green-800";
      case "draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Official": return "bg-blue-100 text-blue-800";
      case "Marketplace": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || lesson.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Content & Categories</h1>
          <p className="text-muted-foreground">
            Manage lesson categories, content, and learning languages
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new lesson category to organize content
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input id="category-name" placeholder="e.g., Advanced Grammar" />
                </div>
                <div>
                  <Label htmlFor="category-desc">Description</Label>
                  <Textarea id="category-desc" placeholder="Describe this category..." />
                </div>
                <div>
                  <Label htmlFor="category-lang">Language</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateCategoryOpen(false)}>
                    Cancel
                  </Button>
                  <Button>Create Category</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateLessonOpen} onOpenChange={setIsCreateLessonOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Lesson
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Lesson</DialogTitle>
                <DialogDescription>
                  Add a new official lesson to the platform
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="lesson-title">Lesson Title</Label>
                  <Input id="lesson-title" placeholder="e.g., Past Perfect Continuous" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lesson-category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="lesson-difficulty">Difficulty</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateLessonOpen(false)}>
                    Cancel
                  </Button>
                  <Button>Create Lesson</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="lessons">All Lessons</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Categories ({categories.length})</CardTitle>
              <CardDescription>
                Organize lessons into categories and subcategories for better navigation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Lessons</TableHead>
                    <TableHead>Subcategories</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <Languages className="w-3 h-3 mr-1" />
                          {category.language}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{category.lessonsCount}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories.slice(0, 2).map((sub, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {sub}
                            </Badge>
                          ))}
                          {category.subcategories.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{category.subcategories.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(category.status)}>
                          {category.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Category
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FolderOpen className="w-4 h-4 mr-2" />
                              Manage Subcategories
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Category
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search lessons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lessons Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Lessons ({filteredLessons.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lesson</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{lesson.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {lesson.duration} • {lesson.language}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{lesson.category}</p>
                          <p className="text-xs text-muted-foreground">{lesson.subcategory}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(lesson.difficulty)}>
                          {lesson.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(lesson.type)}>
                          {lesson.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(lesson.status)}>
                          {lesson.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{lesson.views.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-sm">{lesson.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview Lesson
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Lesson
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BookOpen className="w-4 h-4 mr-2" />
                              Manage Content
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {lesson.status === "Draft" ? (
                              <DropdownMenuItem>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Publish Lesson
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <XCircle className="w-4 h-4 mr-2" />
                                Unpublish Lesson
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="languages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supported Languages</CardTitle>
              <CardDescription>
                Manage supported learning languages and UI localization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {languages.map((lang) => (
                  <Card key={lang.code}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Languages className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">{lang.name}</span>
                        </div>
                        <Badge 
                          className={
                            lang.status === 'Active' ? 'bg-green-100 text-green-800' :
                            lang.status === 'Beta' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {lang.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {lang.lessons} lessons available
                      </p>
                      <div className="mt-3 flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          Manage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Language
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}