import { useState, useEffect } from "react"
import { 
  Plus, 
  Settings, 
  ChevronRight, 
  ChevronDown, 
  MoreHorizontal, 
  Edit, 
  Copy, 
  Trash2,
  Play,
  Save,
  Eye,
  FileText,
  Image,
  Video,
  Mic,
  Download,
  Clock,
  Target,
  MessageSquare,
  RotateCcw,
  Zap,
  GripVertical,
  Archive,
  CheckCircle,
  AlertCircle,
  Bot,
  BookOpen,
  Search,
  X,
  Folder,
  FolderOpen
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Separator } from "./ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { ScrollArea } from "./ui/scroll-area"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { useAppStore } from "../hooks/useAppStore"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { AddContentModal } from "./modals/AddContentModal"
import { BlockConfigModal } from "./modals/BlockConfigModal"
import { Block } from "../hooks/useAppStore"
import { toast } from "sonner@2.0.3"

export function CourseBuilder() {
  const { 
    courses, 
    selectedCourse, 
    selectedLesson, 
    builderMode,
    setSelectedCourse,
    setSelectedLesson,
    setBuilderMode,
    setCreateCourseModalOpen,
    setCourseSettingsModalOpen,
    setCourses
  } = useAppStore()

  const [expandedNodes, setExpandedNodes] = useState<string[]>(['course-1'])
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)
  const [lessonTitle, setLessonTitle] = useState('')
  
  // Modal states
  const [addContentModal, setAddContentModal] = useState<{
    isOpen: boolean
    courseId: string
    parentId: string | null
    parentTitle?: string
  }>({ isOpen: false, courseId: '', parentId: null })
  
  const [blockConfigModal, setBlockConfigModal] = useState<{
    isOpen: boolean
    blockType: string
    existingBlock?: Block
  }>({ isOpen: false, blockType: '' })
  
  const [dragOverBlock, setDragOverBlock] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [navigationPath, setNavigationPath] = useState<Array<{ id: string, title: string, type: string }>>([])

  // Update lesson title when selected lesson changes
  useEffect(() => {
    setLessonTitle(selectedLesson?.title || '')
  }, [selectedLesson?.title])

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  // Build breadcrumb path for a lesson
  const buildLessonPath = (structure: any[], lessonId: string, currentPath: Array<{ id: string, title: string, type: string }> = []): Array<{ id: string, title: string, type: string }> | null => {
    for (const item of structure) {
      if (item.type === 'lesson' && item.lesson?.id === lessonId) {
        return [...currentPath, { id: item.id, title: item.title, type: 'lesson' }]
      }
      if (item.children) {
        const result = buildLessonPath(
          item.children, 
          lessonId, 
          [...currentPath, { id: item.id, title: item.title, type: 'subcategory' }]
        )
        if (result) return result
      }
    }
    return null
  }

  // Update navigation path when lesson changes
  useEffect(() => {
    if (selectedLesson && selectedCourse) {
      const path = buildLessonPath(selectedCourse.structure, selectedLesson.id)
      setNavigationPath(path || [])
    } else {
      setNavigationPath([])
    }
  }, [selectedLesson, selectedCourse])

  // Add block to lesson
  const addBlockToLesson = (block: Block) => {
    if (!selectedCourse || !selectedLesson) return
    
    const updatedCourses = courses.map(course => {
      if (course.id === selectedCourse.id) {
        const updateStructure = (items: any[]): any[] => {
          return items.map(item => {
            if (item.type === 'lesson' && item.lesson?.id === selectedLesson.id) {
              return {
                ...item,
                lesson: {
                  ...item.lesson,
                  blocks: [...(item.lesson.blocks || []), block],
                  lastModified: new Date().toISOString()
                }
              }
            }
            if (item.children) {
              return {
                ...item,
                children: updateStructure(item.children)
              }
            }
            return item
          })
        }
        
        return {
          ...course,
          structure: updateStructure(course.structure),
          updatedAt: new Date().toISOString()
        }
      }
      return course
    })
    
    setCourses(updatedCourses)
    
    // Update selected lesson
    const updatedLesson = {
      ...selectedLesson,
      blocks: [...(selectedLesson.blocks || []), block],
      lastModified: new Date().toISOString()
    }
    setSelectedLesson(updatedLesson)
  }

  // Update block in lesson
  const updateBlockInLesson = (updatedBlock: Block) => {
    if (!selectedCourse || !selectedLesson) return
    
    const updatedCourses = courses.map(course => {
      if (course.id === selectedCourse.id) {
        const updateStructure = (items: any[]): any[] => {
          return items.map(item => {
            if (item.type === 'lesson' && item.lesson?.id === selectedLesson.id) {
              return {
                ...item,
                lesson: {
                  ...item.lesson,
                  blocks: item.lesson.blocks.map((block: Block) => 
                    block.id === updatedBlock.id ? updatedBlock : block
                  ),
                  lastModified: new Date().toISOString()
                }
              }
            }
            if (item.children) {
              return {
                ...item,
                children: updateStructure(item.children)
              }
            }
            return item
          })
        }
        
        return {
          ...course,
          structure: updateStructure(course.structure),
          updatedAt: new Date().toISOString()
        }
      }
      return course
    })
    
    setCourses(updatedCourses)
    
    // Update selected lesson
    const updatedLesson = {
      ...selectedLesson,
      blocks: selectedLesson.blocks.map(block => 
        block.id === updatedBlock.id ? updatedBlock : block
      ),
      lastModified: new Date().toISOString()
    }
    setSelectedLesson(updatedLesson)
  }

  // Delete block from lesson
  const deleteBlockFromLesson = (blockId: string) => {
    if (!selectedCourse || !selectedLesson) return
    
    const updatedCourses = courses.map(course => {
      if (course.id === selectedCourse.id) {
        const updateStructure = (items: any[]): any[] => {
          return items.map(item => {
            if (item.type === 'lesson' && item.lesson?.id === selectedLesson.id) {
              return {
                ...item,
                lesson: {
                  ...item.lesson,
                  blocks: item.lesson.blocks.filter((block: Block) => block.id !== blockId),
                  lastModified: new Date().toISOString()
                }
              }
            }
            if (item.children) {
              return {
                ...item,
                children: updateStructure(item.children)
              }
            }
            return item
          })
        }
        
        return {
          ...course,
          structure: updateStructure(course.structure),
          updatedAt: new Date().toISOString()
        }
      }
      return course
    })
    
    setCourses(updatedCourses)
    
    // Update selected lesson
    const updatedLesson = {
      ...selectedLesson,
      blocks: selectedLesson.blocks.filter(block => block.id !== blockId),
      lastModified: new Date().toISOString()
    }
    setSelectedLesson(updatedLesson)
    
    toast.success("Block deleted successfully")
  }

  // Save lesson title
  const saveLessonTitle = () => {
    if (!selectedCourse || !selectedLesson || !lessonTitle.trim()) return
    
    const updatedCourses = courses.map(course => {
      if (course.id === selectedCourse.id) {
        const updateStructure = (items: any[]): any[] => {
          return items.map(item => {
            if (item.type === 'lesson' && item.lesson?.id === selectedLesson.id) {
              return {
                ...item,
                title: lessonTitle.trim(),
                lesson: {
                  ...item.lesson,
                  title: lessonTitle.trim(),
                  lastModified: new Date().toISOString()
                }
              }
            }
            if (item.children) {
              return {
                ...item,
                children: updateStructure(item.children)
              }
            }
            return item
          })
        }
        
        return {
          ...course,
          structure: updateStructure(course.structure),
          updatedAt: new Date().toISOString()
        }
      }
      return course
    })
    
    setCourses(updatedCourses)
    
    // Update selected lesson
    const updatedLesson = {
      ...selectedLesson,
      title: lessonTitle.trim(),
      lastModified: new Date().toISOString()
    }
    setSelectedLesson(updatedLesson)
    
    toast.success("Lesson title saved")
  }

  // Content Blocks
  const contentBlocks = [
    { type: 'video', icon: Video, label: 'Video', description: 'Video content with optional transcript' },
    { type: 'text', icon: FileText, label: 'Rich Text', description: 'Formatted text content' },
    { type: 'image', icon: Image, label: 'Image', description: 'Images and graphics' },
    { type: 'audio', icon: Mic, label: 'Audio', description: 'Audio recordings' },
    { type: 'attachment', icon: Download, label: 'Attachment', description: 'Downloadable files' }
  ]

  // Exercise Blocks organized by categories
  const readingWritingBlocks = [
    { type: 'mcq_single', icon: Target, label: 'Multiple Choice - Single', description: 'One correct answer from options' },
    { type: 'mcq_multiple', icon: Target, label: 'Multiple Choice - Multiple', description: 'Two or more correct answers' },
    { type: 'fill_blanks', icon: Edit, label: 'Fill in the Blanks', description: 'Complete missing words in text' },
    { type: 'sentence_completion', icon: Edit, label: 'Sentence Completion', description: 'Complete sentences with given words' },
    { type: 'matching', icon: Copy, label: 'Matching', description: 'Match headings, info, features, endings' },
    { type: 'summary_completion', icon: FileText, label: 'Summary Completion', description: 'Complete short summary with missing words' },
    { type: 'table_completion', icon: FileText, label: 'Table Completion', description: 'Fill missing information in tables' },
    { type: 'flowchart_completion', icon: RotateCcw, label: 'Flowchart Completion', description: 'Complete process flowcharts' },
    { type: 'diagram_labelling', icon: Image, label: 'Diagram Labelling', description: 'Label parts of images or diagrams' },
    { type: 'short_answer', icon: MessageSquare, label: 'Short Answer', description: 'Brief answers to questions' },
    { type: 'essay_writing', icon: FileText, label: 'Essay Writing', description: 'Structured essays with intro, body, conclusion' },
    { type: 'letter_email_writing', icon: FileText, label: 'Letter/Email Writing', description: 'Formal and informal correspondence' },
    { type: 'paragraph_reordering', icon: RotateCcw, label: 'Paragraph Reordering', description: 'Arrange paragraphs in logical sequence' },
    { type: 'sentence_reordering', icon: RotateCcw, label: 'Sentence Reordering', description: 'Rearrange words into correct sentences' },
    { type: 'describe_picture', icon: Image, label: 'Describe a Picture', description: 'Written or spoken picture descriptions' },
    { type: 'write_sentence_given_words', icon: Edit, label: 'Write Sentence Using Words', description: 'Form sentences with provided words' }
  ]

  const speakingBlocks = [
    { type: 'cue_card_speaking', icon: Mic, label: 'Cue Card Speaking', description: 'Timed speaking with topic points' },
    { type: 'read_aloud', icon: Mic, label: 'Read Aloud', description: 'Record pronunciation while reading' },
    { type: 'listen_and_speak', icon: Mic, label: 'Listen and Speak', description: 'Respond verbally to audio prompts' },
    { type: 'read_and_speak', icon: Mic, label: 'Read and Speak', description: 'Read passage then discuss or summarize' },
    { type: 'speak_about_topic', icon: Mic, label: 'Speak About Topic', description: 'Long-form speaking without preparation' },
    { type: 'audio_recording_response', icon: Mic, label: 'Audio Recording Response', description: 'Open-ended audio responses' },
    { type: 'impromptu_speech', icon: Mic, label: 'Impromptu Speech', description: 'Instant speech on random topics' },
    { type: 'pronunciation_correction', icon: Mic, label: 'Pronunciation Correction', description: 'AI feedback on pronunciation' },
    { type: 'shadowing_practice', icon: Mic, label: 'Shadowing Practice', description: 'Repeat immediately after listening' }
  ]

  const listeningBlocks = [
    { type: 'listen_and_type', icon: Mic, label: 'Listen and Type', description: 'Dictation exercises' },
    { type: 'listen_and_select', icon: Mic, label: 'Listen and Select', description: 'Choose correct words from audio' },
    { type: 'read_and_select', icon: Eye, label: 'Read and Select', description: 'Select correct or real words/sentences' },
    { type: 'read_and_complete', icon: Edit, label: 'Read and Complete', description: 'Complete text based on context' }
  ]

  const grammarVocabBlocks = [
    { type: 'identify_grammar_error', icon: AlertCircle, label: 'Identify Grammar Error', description: 'Find and optionally correct mistakes' },
    { type: 'choose_correct_tense', icon: Clock, label: 'Choose Correct Tense', description: 'Select appropriate verb tense' },
    { type: 'find_synonym', icon: Copy, label: 'Find the Synonym', description: 'Choose synonym from options' },
    { type: 'choose_best_title', icon: FileText, label: 'Choose Best Title', description: 'Select most suitable title for text' },
    { type: 'categorization_drag_drop', icon: Copy, label: 'Categorization', description: 'Drag items into correct groups' },
    { type: 'insert_sentence_paragraph', icon: Edit, label: 'Insert Sentence', description: 'Place sentence in correct paragraph position' },
    { type: 'word_family_practice', icon: MessageSquare, label: 'Word Family Practice', description: 'Choose correct word form (noun, verb, etc.)' }
  ]

  const advancedBlocks = [
    { type: 'ai_feedback_writing', icon: Bot, label: 'AI Feedback Writing', description: 'Free writing with instant AI feedback' },
    { type: 'image_based_prompt', icon: Image, label: 'Image-Based Prompt', description: 'Write or speak based on images' },
    { type: 'timed_task_exam', icon: Clock, label: 'Timed Task (Exam Mode)', description: 'Any exercise with countdown timer' }
  ]

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    )
  }



  const renderStructureItem = (item: any, courseId: string, level: number) => {
    const isExpanded = expandedNodes.includes(item.id)
    const isSelected = item.type === 'lesson' && selectedLesson?.id === item.id
    const hasChildren = item.children && item.children.length > 0
    
    // Count lessons and subcategories
    const countContent = (items: any[]): { lessons: number, subcategories: number } => {
      let lessons = 0
      let subcategories = 0
      items.forEach(item => {
        if (item.type === 'lesson') lessons++
        else if (item.type === 'subcategory') {
          subcategories++
          if (item.children) {
            const childCounts = countContent(item.children)
            lessons += childCounts.lessons
            subcategories += childCounts.subcategories
          }
        }
      })
      return { lessons, subcategories }
    }
    
    const childCounts = hasChildren ? countContent(item.children) : { lessons: 0, subcategories: 0 }
    
    return (
      <div key={item.id} className="space-y-2">
        <div 
          className={`group p-3 rounded-lg border cursor-pointer transition-all ${
            isSelected
              ? 'bg-gradient-to-r from-primary/10 to-violet-600/10 border-primary/50 shadow-sm' 
              : 'border-border hover:bg-muted/30 hover:border-border'
          }`}
          style={{ marginLeft: `${level * 24}px` }}
          onClick={() => {
            if (item.type === 'lesson') {
              setSelectedLesson(item.lesson)
              setBuilderMode('lesson')
            } else if (hasChildren) {
              toggleNode(item.id)
            }
          }}
        >
          <div className="flex items-center gap-3">
            {hasChildren && (
              <button
                className="flex-shrink-0 p-1 hover:bg-muted rounded-md transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleNode(item.id)
                }}
              >
                {isExpanded ? 
                  <ChevronDown className="w-4 h-4 text-muted-foreground" /> : 
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                }
              </button>
            )}
            
            <div className="flex-1 flex items-center gap-3 min-w-0">
              {item.type === 'lesson' ? (
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  isSelected 
                    ? 'bg-gradient-to-br from-primary to-violet-600'
                    : 'bg-muted'
                }`}>
                  <FileText className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-muted-foreground'}`} />
                </div>
              ) : (
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isExpanded ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  {isExpanded ? (
                    <FolderOpen className={`w-4 h-4 ${isExpanded ? 'text-primary' : 'text-muted-foreground'}`} />
                  ) : (
                    <Folder className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm block truncate ${isSelected ? 'font-semibold' : 'font-medium'}`}>
                    {item.title}
                  </span>
                  {item.type === 'subcategory' && hasChildren && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {childCounts.subcategories > 0 && (
                        <Badge variant="secondary" className="text-xs h-5 px-1.5">
                          {childCounts.subcategories} sub
                        </Badge>
                      )}
                      {childCounts.lessons > 0 && (
                        <Badge variant="secondary" className="text-xs h-5 px-1.5 bg-primary/10 text-primary border-primary/20">
                          {childCounts.lessons} lessons
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                {item.type === 'lesson' && item.lesson?.blocks && (
                  <span className="text-xs text-muted-foreground">
                    {item.lesson.blocks.length} {item.lesson.blocks.length === 1 ? 'block' : 'blocks'}
                  </span>
                )}
                {item.type === 'subcategory' && !hasChildren && (
                  <span className="text-xs text-muted-foreground">Empty category</span>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="flex-shrink-0 p-1.5 hover:bg-muted rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                {item.type === 'subcategory' && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setAddContentModal({
                        isOpen: true,
                        courseId: courseId,
                        parentId: item.id,
                        parentTitle: item.title
                      })
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {item.children && isExpanded && (
          <div className="space-y-2 mt-2">
            {item.children.map((child: any) => renderStructureItem(child, courseId, level + 1))}
            
            <div style={{ marginLeft: `${(level + 1) * 24}px` }}>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setAddContentModal({
                  isOpen: true,
                  courseId: courseId,
                  parentId: item.id,
                  parentTitle: item.title
                })}
                className="w-full sm:w-auto hover:bg-primary/5 hover:border-primary/50 transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to {item.title}
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderBlockCategory = (title: string, categoryKey: string, blocks: any[], color: string) => {
    const isExpanded = expandedCategories.includes(categoryKey) || searchQuery.length > 0
    const filteredBlocks = blocks.filter(block => 
      block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (searchQuery && filteredBlocks.length === 0) return null

    return (
      <div className="space-y-2">
        <button
          onClick={() => toggleCategory(categoryKey)}
          className="w-full flex items-center justify-between gap-2 px-1 py-1 rounded-lg hover:bg-muted/50 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${color}`}></div>
            <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground">
              {title}
            </span>
            <Badge variant="secondary" className="text-xs">
              {filteredBlocks.length}
            </Badge>
          </div>
          {!searchQuery && (
            isExpanded ? 
              <ChevronDown className="w-4 h-4 text-muted-foreground" /> : 
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        
        {isExpanded && (
          <div className="space-y-1.5">
            {filteredBlocks.map((block) => {
              const Icon = block.icon
              return (
                <div
                  key={block.type}
                  className="group p-3 border border-border rounded-lg cursor-move hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-violet-600/5 transition-all active:scale-95"
                  draggable
                  onDragStart={() => setDraggedBlock(block.type)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-violet-600/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-violet-600/20 transition-colors">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{block.label}</div>
                      <div className="text-xs text-muted-foreground truncate">{block.description}</div>
                    </div>
                    <GripVertical className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const renderBlocksPalette = () => {
    const allBlocks = [
      ...contentBlocks,
      ...readingWritingBlocks,
      ...speakingBlocks,
      ...listeningBlocks,
      ...grammarVocabBlocks,
      ...advancedBlocks
    ]
    
    const totalFilteredCount = searchQuery 
      ? allBlocks.filter(block => 
          block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          block.description.toLowerCase().includes(searchQuery.toLowerCase())
        ).length
      : allBlocks.length

    return (
      <div className="space-y-4">
        {/* Search Input */}
        <div className="sticky top-0 bg-card/95 backdrop-blur pb-3 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blocks..."
              className="pl-9 pr-9 h-10 bg-muted/50 border-border"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-xs text-muted-foreground mt-2 px-1">
              {totalFilteredCount} {totalFilteredCount === 1 ? 'block' : 'blocks'} found
            </p>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {renderBlockCategory("Content Blocks", "content", contentBlocks, "bg-gradient-to-r from-blue-500 to-cyan-500")}
          {renderBlockCategory("Reading & Writing", "reading", readingWritingBlocks, "bg-gradient-to-r from-emerald-500 to-green-500")}
          {renderBlockCategory("Speaking", "speaking", speakingBlocks, "bg-gradient-to-r from-rose-500 to-pink-500")}
          {renderBlockCategory("Listening", "listening", listeningBlocks, "bg-gradient-to-r from-purple-500 to-violet-500")}
          {renderBlockCategory("Grammar & Vocabulary", "grammar", grammarVocabBlocks, "bg-gradient-to-r from-amber-500 to-orange-500")}
          {renderBlockCategory("Advanced & AI", "advanced", advancedBlocks, "bg-gradient-to-r from-fuchsia-500 to-purple-500")}
        </div>

        {searchQuery && totalFilteredCount === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No blocks found</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    )
  }

  const renderLessonCanvas = () => (
    <div className="space-y-4 lg:space-y-6">
      {/* Lesson Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-border rounded-xl bg-gradient-to-r from-card to-card/50">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <Input 
            value={lessonTitle} 
            onChange={(e) => setLessonTitle(e.target.value)}
            onBlur={saveLessonTitle}
            onKeyPress={(e) => e.key === 'Enter' && saveLessonTitle()}
            className="font-semibold border-none p-0 h-auto bg-transparent"
            placeholder="Lesson Title"
          />
          <Badge 
            variant={selectedLesson?.status === 'live' ? 'default' : 'secondary'}
            className={selectedLesson?.status === 'live' 
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 border-none'
              : 'bg-muted'
            }
          >
            {selectedLesson?.status || 'draft'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast.info("Preview functionality coming soon")}
            className="hover:bg-primary/5 hover:border-primary/50"
          >
            <Eye className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button 
            size="sm"
            onClick={saveLessonTitle}
            className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90"
          >
            <Save className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Select 
            defaultValue={`v${selectedLesson?.version || 1}`}
            onValueChange={(value) => toast.info("Version management coming soon")}
          >
            <SelectTrigger className="w-16 sm:w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="v1">v1</SelectItem>
              <SelectItem value="v2">v2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lesson Blocks Canvas */}
      <div 
        className={`min-h-96 border-2 border-dashed rounded-xl p-4 lg:p-6 transition-all ${
          dragOverBlock 
            ? 'border-primary bg-gradient-to-br from-primary/10 to-violet-600/10' 
            : 'border-border/50 bg-gradient-to-br from-card/30 to-background'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOverBlock('canvas')
        }}
        onDragLeave={() => setDragOverBlock(null)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOverBlock(null)
          if (draggedBlock) {
            setBlockConfigModal({
              isOpen: true,
              blockType: draggedBlock
            })
            setDraggedBlock(null)
          }
        }}
      >
        {selectedLesson?.blocks?.length ? (
          <div className="space-y-4 text-left">
            {selectedLesson.blocks.map((block, index) => {
              const blockTypeInfo = {
                // Content blocks
                video: { icon: Video, label: "Video", color: "text-blue-600" },
                text: { icon: FileText, label: "Text", color: "text-green-600" },
                image: { icon: Image, label: "Image", color: "text-purple-600" },
                audio: { icon: Mic, label: "Audio", color: "text-orange-600" },
                attachment: { icon: Download, label: "Attachment", color: "text-gray-600" },
                
                // Reading & Writing
                mcq_single: { icon: Target, label: "Multiple Choice - Single", color: "text-green-600" },
                mcq_multiple: { icon: Target, label: "Multiple Choice - Multiple", color: "text-green-700" },
                fill_blanks: { icon: Edit, label: "Fill in the Blanks", color: "text-green-500" },
                sentence_completion: { icon: Edit, label: "Sentence Completion", color: "text-green-400" },
                matching: { icon: Copy, label: "Matching", color: "text-green-800" },
                summary_completion: { icon: FileText, label: "Summary Completion", color: "text-green-600" },
                table_completion: { icon: FileText, label: "Table Completion", color: "text-green-700" },
                flowchart_completion: { icon: RotateCcw, label: "Flowchart Completion", color: "text-green-500" },
                diagram_labelling: { icon: Image, label: "Diagram Labelling", color: "text-green-400" },
                short_answer: { icon: MessageSquare, label: "Short Answer", color: "text-green-800" },
                essay_writing: { icon: FileText, label: "Essay Writing", color: "text-green-600" },
                letter_email_writing: { icon: FileText, label: "Letter/Email Writing", color: "text-green-700" },
                paragraph_reordering: { icon: RotateCcw, label: "Paragraph Reordering", color: "text-green-500" },
                sentence_reordering: { icon: RotateCcw, label: "Sentence Reordering", color: "text-green-400" },
                describe_picture: { icon: Image, label: "Describe a Picture", color: "text-green-800" },
                write_sentence_given_words: { icon: Edit, label: "Write Sentence Using Words", color: "text-green-600" },
                
                // Speaking
                cue_card_speaking: { icon: Mic, label: "Cue Card Speaking", color: "text-red-600" },
                read_aloud: { icon: Mic, label: "Read Aloud", color: "text-red-700" },
                listen_and_speak: { icon: Mic, label: "Listen and Speak", color: "text-red-500" },
                read_and_speak: { icon: Mic, label: "Read and Speak", color: "text-red-400" },
                speak_about_topic: { icon: Mic, label: "Speak About Topic", color: "text-red-800" },
                audio_recording_response: { icon: Mic, label: "Audio Recording Response", color: "text-red-600" },
                impromptu_speech: { icon: Mic, label: "Impromptu Speech", color: "text-red-700" },
                pronunciation_correction: { icon: Mic, label: "Pronunciation Correction", color: "text-red-500" },
                shadowing_practice: { icon: Mic, label: "Shadowing Practice", color: "text-red-400" },
                
                // Listening
                listen_and_type: { icon: Mic, label: "Listen and Type", color: "text-purple-600" },
                listen_and_select: { icon: Mic, label: "Listen and Select", color: "text-purple-700" },
                read_and_select: { icon: Eye, label: "Read and Select", color: "text-purple-500" },
                read_and_complete: { icon: Edit, label: "Read and Complete", color: "text-purple-400" },
                
                // Grammar & Vocabulary
                identify_grammar_error: { icon: AlertCircle, label: "Identify Grammar Error", color: "text-orange-600" },
                choose_correct_tense: { icon: Clock, label: "Choose Correct Tense", color: "text-orange-700" },
                find_synonym: { icon: Copy, label: "Find the Synonym", color: "text-orange-500" },
                choose_best_title: { icon: FileText, label: "Choose Best Title", color: "text-orange-400" },
                categorization_drag_drop: { icon: Copy, label: "Categorization", color: "text-orange-800" },
                insert_sentence_paragraph: { icon: Edit, label: "Insert Sentence", color: "text-orange-600" },
                word_family_practice: { icon: MessageSquare, label: "Word Family Practice", color: "text-orange-700" },
                
                // Advanced & AI
                ai_feedback_writing: { icon: Bot, label: "AI Feedback Writing", color: "text-pink-600" },
                image_based_prompt: { icon: Image, label: "Image-Based Prompt", color: "text-pink-700" },
                timed_task_exam: { icon: Clock, label: "Timed Task (Exam Mode)", color: "text-pink-500" }
              }
              
              const blockInfo = blockTypeInfo[block.type as keyof typeof blockTypeInfo]
              const Icon = blockInfo?.icon || FileText
              
              return (
                <div 
                  key={block.id} 
                  className="group p-4 border border-border rounded-xl hover:border-primary/50 bg-gradient-to-r from-card to-card/50 hover:from-primary/5 hover:to-violet-600/5 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-violet-600/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-violet-600/20 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="font-semibold truncate">{block.content?.title || `${blockInfo?.label || block.type} Block`}</h4>
                          <Badge variant="outline" className="text-xs bg-gradient-to-r from-primary/5 to-violet-600/5 border-primary/20">
                            {blockInfo?.label || block.type}
                          </Badge>
                          {block.config?.timer && (
                            <Badge className="text-xs gap-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400">
                              <Clock className="w-3 h-3" />
                              {block.config.timer}s
                            </Badge>
                          )}
                          {block.config?.aiEnabled && (
                            <Badge className="text-xs gap-1 bg-gradient-to-r from-fuchsia-500/10 to-purple-500/10 border-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-400">
                              <Zap className="w-3 h-3" />
                              AI
                            </Badge>
                          )}
                        </div>
                        {block.content?.content && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {block.content.content}
                          </p>
                        )}
                        {block.config?.scoring?.points && (
                          <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            <span>{block.config.scoring.points} points</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setBlockConfigModal({
                          isOpen: true,
                          blockType: block.type,
                          existingBlock: block
                        })}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this block?")) {
                            deleteBlockFromLesson(block.id)
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="cursor-move p-1">
                        <GripVertical className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-muted-foreground text-center">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">Start Building Your Lesson</h3>
              <p>Drag blocks from the palette to create your lesson content</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // Calculate total stats for course
  const calculateCourseStats = (structure: any[]): { totalLessons: number, totalSubcategories: number, maxDepth: number } => {
    let totalLessons = 0
    let totalSubcategories = 0
    
    const getMaxDepth = (items: any[], currentDepth: number): number => {
      let maxDepth = currentDepth
      items.forEach(item => {
        if (item.type === 'lesson') {
          totalLessons++
        } else if (item.type === 'subcategory') {
          totalSubcategories++
          if (item.children && item.children.length > 0) {
            maxDepth = Math.max(maxDepth, getMaxDepth(item.children, currentDepth + 1))
          }
        }
      })
      return maxDepth
    }
    
    const maxDepth = structure.length > 0 ? getMaxDepth(structure, 1) : 0
    return { totalLessons, totalSubcategories, maxDepth }
  }

  const renderStructureMode = () => {
    const stats = selectedCourse?.structure ? calculateCourseStats(selectedCourse.structure) : { totalLessons: 0, totalSubcategories: 0, maxDepth: 0 }
    
    return (
      <div className="space-y-6">
        {/* Course Stats */}
        {selectedCourse?.structure && selectedCourse.structure.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-4">
                <div className="text-2xl font-semibold text-primary mb-1">{stats.totalLessons}</div>
                <div className="text-xs text-muted-foreground">Total Lessons</div>
              </CardContent>
            </Card>
            <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-transparent">
              <CardContent className="p-4">
                <div className="text-2xl font-semibold text-violet-500 mb-1">{stats.totalSubcategories}</div>
                <div className="text-xs text-muted-foreground">Categories</div>
              </CardContent>
            </Card>
            <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
              <CardContent className="p-4">
                <div className="text-2xl font-semibold text-emerald-500 mb-1">{stats.maxDepth}</div>
                <div className="text-xs text-muted-foreground">Nesting Levels</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Course Structure Tree */}
        <div className="border border-border rounded-xl bg-gradient-to-br from-card to-card/50 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-semibold mb-1">Course Structure</h3>
            <p className="text-sm text-muted-foreground">
              Unlimited nested categories → subcategories → lessons
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setAddContentModal({
              isOpen: true,
              courseId: selectedCourse?.id || '',
              parentId: null,
              parentTitle: selectedCourse?.title
            })}
            className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </Button>
        </div>

        {selectedCourse?.structure && selectedCourse.structure.length > 0 ? (
          <div className="space-y-2">
            {selectedCourse.structure.map((item: any) => renderStructureItem(item, selectedCourse.id, 0))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h4 className="font-semibold mb-2">No content yet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Start building your course by adding categories and lessons
            </p>
            <Button
              onClick={() => setAddContentModal({
                isOpen: true,
                courseId: selectedCourse?.id || '',
                parentId: null,
                parentTitle: selectedCourse?.title
              })}
              className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Content
            </Button>
          </div>
        )}
      </div>

      {/* Help Card */}
      <div className="bg-gradient-to-br from-primary/10 to-violet-600/10 border border-primary/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-xl">
            💡
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-2">Build Your Course Structure</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span><strong>Nested Categories:</strong> Create unlimited levels of subcategories within subcategories</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span><strong>Navigate:</strong> Click subcategories to expand/collapse, click lessons to edit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span><strong>Breadcrumbs:</strong> Use the breadcrumb trail to see your location and navigate back</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span><strong>Add Content:</strong> Click "Add to [name]" inside categories or use the dropdown menu</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
  }

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-0 bg-background -m-4 lg:-m-6">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <div className="p-4 lg:p-6 border-b border-border bg-card/50 backdrop-blur">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="font-semibold truncate">Course Builder</h1>
                  <p className="text-sm text-muted-foreground">Create and manage your course content</p>
                </div>
              </div>
              
              {/* Breadcrumbs */}
              {(selectedCourse || selectedLesson) && (
                <Breadcrumb className="ml-13">
                  <BreadcrumbList>
                    {selectedCourse && (
                      <>
                        <BreadcrumbItem>
                          <BreadcrumbLink 
                            className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                            onClick={() => {
                              setSelectedLesson(null)
                              setBuilderMode('structure')
                            }}
                          >
                            {selectedCourse.title}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        {navigationPath.map((pathItem, index) => (
                          <div key={pathItem.id} className="flex items-center">
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                              {index === navigationPath.length - 1 ? (
                                <BreadcrumbPage className="text-sm font-medium">
                                  {pathItem.title}
                                </BreadcrumbPage>
                              ) : (
                                <BreadcrumbLink 
                                  className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                                  onClick={() => {
                                    // For subcategories in the path, we could navigate to them
                                    // For now, just go back to structure view
                                    setSelectedLesson(null)
                                    setBuilderMode('structure')
                                  }}
                                >
                                  {pathItem.title}
                                </BreadcrumbLink>
                              )}
                            </BreadcrumbItem>
                          </div>
                        ))}
                      </>
                    )}
                  </BreadcrumbList>
                </Breadcrumb>
              )}
            </div>
            
            {/* Action Button */}
            <Button 
              onClick={() => setCreateCourseModalOpen(true)}
              className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 flex-shrink-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">New Course</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Canvas Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            {/* Course Selection & Structure */}
            {!selectedCourse ? (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-violet-600/10 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Select or Create a Course</h2>
                  <p className="text-muted-foreground">Choose an existing course or create a new one to start building</p>
                </div>
                
                {courses.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {courses.map(course => (
                      <div
                        key={course.id}
                        onClick={() => {
                          setSelectedCourse(course)
                          setBuilderMode('structure')
                        }}
                        className="group p-6 border border-border rounded-xl hover:border-primary/50 bg-gradient-to-br from-card to-card/50 hover:from-primary/5 hover:to-violet-600/5 cursor-pointer transition-all"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-violet-600/10 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold mb-1 truncate">{course.title}</h3>
                            <Badge 
                              variant={course.status === 'live' ? 'default' : 'secondary'}
                              className={course.status === 'live' 
                                ? 'bg-gradient-to-r from-emerald-500 to-green-500 border-none'
                                : 'bg-muted'
                              }
                            >
                              {course.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{course.shortDescription}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="font-semibold mb-2">No courses yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">Create your first course to get started</p>
                    <Button 
                      onClick={() => setCreateCourseModalOpen(true)}
                      className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Course
                    </Button>
                  </div>
                )}
              </div>
            ) : !selectedLesson ? (
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedCourse(null)
                      setBuilderMode('structure')
                    }}
                    className="gap-2"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Back to Courses
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCourseSettingsModalOpen(true)}
                    className="gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Course Settings
                  </Button>
                </div>
                
                {renderStructureMode()}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedLesson(null)
                      setBuilderMode('structure')
                    }}
                    className="gap-2"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Back to Structure
                  </Button>
                </div>
                
                <div className="max-w-5xl mx-auto">
                  {renderLessonCanvas()}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Blocks Palette */}
      {selectedLesson && (
        <div className="hidden lg:flex lg:flex-col lg:w-96 xl:w-[420px] border-l border-border bg-gradient-to-b from-card via-card/50 to-background">
          <div className="p-4 border-b border-border bg-card/80 backdrop-blur sticky top-0 z-20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-primary flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold">Blocks Palette</h2>
                <p className="text-xs text-muted-foreground">Drag blocks to lesson canvas</p>
              </div>
            </div>
          </div>
          <ScrollArea className="flex-1 p-4">
            {renderBlocksPalette()}
          </ScrollArea>
        </div>
      )}

      {/* Modals */}
      <AddContentModal
        isOpen={addContentModal.isOpen}
        onClose={() => setAddContentModal({ isOpen: false, courseId: '', parentId: null })}
        courseId={addContentModal.courseId}
        parentId={addContentModal.parentId}
        parentTitle={addContentModal.parentTitle}
      />

      <BlockConfigModal
        isOpen={blockConfigModal.isOpen}
        onClose={() => setBlockConfigModal({ isOpen: false, blockType: '' })}
        blockType={blockConfigModal.blockType}
        existingBlock={blockConfigModal.existingBlock}
        onSave={(block) => {
          if (blockConfigModal.existingBlock) {
            updateBlockInLesson(block)
          } else {
            addBlockToLesson(block)
          }
          setBlockConfigModal({ isOpen: false, blockType: '' })
        }}
      />
    </div>
  )
}