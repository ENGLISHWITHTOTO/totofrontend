import { useState, ReactNode } from 'react'
import { AppContext, AppState, Student, LibraryItem, Course, Subcategory, Lesson } from '../hooks/useAppStore'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [activeSection, setActiveSection] = useState("dashboard")
  
  // Lesson Builder states
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [builderMode, setBuilderMode] = useState<'structure' | 'lesson'>('structure')
  
  // Modal states
  const [isCreateCourseModalOpen, setCreateCourseModalOpen] = useState(false)
  const [isCreateLessonModalOpen, setCreateLessonModalOpen] = useState(false)
  const [isUploadFileModalOpen, setUploadFileModalOpen] = useState(false)
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isCreateMomentModalOpen, setCreateMomentModalOpen] = useState(false)
  const [isPayoutModalOpen, setPayoutModalOpen] = useState(false)
  const [isCourseSettingsModalOpen, setCourseSettingsModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  
  // Data states
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "course-1",
      title: "IELTS Preparation Masterclass",
      cover: "",
      shortDescription: "Complete IELTS preparation course covering all four skills",
      longDescription: "This comprehensive IELTS preparation course will help you achieve your target band score through structured lessons covering Reading, Writing, Listening, and Speaking skills.",
      targetLevel: "Intermediate to Advanced",
      language: "English",
      estimatedDuration: "40 hours",
      tags: ["IELTS", "Test Preparation", "Academic English"],
      marketplaceCategory: "Test Preparation",
      status: "live",
      price: 199,
      currency: "USD",
      sales: 45,
      rating: 4.8,
      structure: [
        {
          id: "sub-1",
          title: "Reading Skills",
          type: "subcategory",
          children: [
            {
              id: "lesson-1",
              title: "Academic Reading Techniques",
              type: "lesson",
              lesson: {
                id: "lesson-1",
                title: "Academic Reading Techniques",
                status: "live",
                blocks: [
                  {
                    id: "block-1",
                    type: "text",
                    content: {
                      title: "Introduction to Academic Reading",
                      content: "In this lesson, we'll explore key strategies for effective academic reading, including skimming, scanning, and identifying main ideas."
                    },
                    config: {
                      timer: 300,
                      aiEnabled: false
                    }
                  },
                  {
                    id: "block-2",
                    type: "mcq_single",
                    content: {
                      title: "Reading Comprehension Quiz",
                      question: "What is the main purpose of skimming?",
                      options: [
                        "To read every word carefully",
                        "To get a general overview of the text",
                        "To find specific details",
                        "To memorize the content"
                      ],
                      correctAnswer: 1
                    },
                    config: {
                      timer: 60,
                      attempts: 2,
                      scoring: { points: 10 }
                    }
                  }
                ],
                visibility: "live",
                version: 1,
                lastModified: "2024-12-20"
              }
            },
            {
              id: "lesson-2",
              title: "Fill in the Blanks Practice",
              type: "lesson",
              lesson: {
                id: "lesson-2",
                title: "Fill in the Blanks Practice",
                status: "draft",
                blocks: [],
                visibility: "draft",
                version: 1,
                lastModified: "2024-12-20"
              }
            }
          ]
        },
        {
          id: "sub-2",
          title: "Writing Skills",
          type: "subcategory",
          children: [
            {
              id: "lesson-3",
              title: "Essay Writing Fundamentals",
              type: "lesson",
              lesson: {
                id: "lesson-3",
                title: "Essay Writing Fundamentals",
                status: "draft",
                blocks: [],
                visibility: "draft",
                version: 1,
                lastModified: "2024-12-20"
              }
            }
          ]
        },
        {
          id: "sub-3",
          title: "Speaking Skills",
          type: "subcategory",
          children: [
            {
              id: "lesson-4",
              title: "Cue Card Practice",
              type: "lesson",
              lesson: {
                id: "lesson-4",
                title: "Cue Card Practice",
                status: "draft",
                blocks: [
                  {
                    id: "block-3",
                    type: "cue_card_speaking",
                    content: {
                      title: "Describe a memorable journey",
                      cueCard: {
                        topic: "Describe a memorable journey you have taken",
                        points: [
                          "Where did you go?",
                          "When did you take this journey?",
                          "Who did you go with?",
                          "Why was it memorable?"
                        ]
                      }
                    },
                    config: {
                      timer: 180,
                      speakingConfig: {
                        preparationTime: 60,
                        recordingTime: 120
                      },
                      aiEnabled: true,
                      scoring: { points: 25 }
                    }
                  }
                ],
                visibility: "draft",
                version: 1,
                lastModified: "2024-12-20"
              }
            }
          ]
        }
      ],
      settings: {
        aiCreditsDefault: 10,
        freePreview: true,
        learningOutcomes: ["Achieve target IELTS band score", "Master test strategies"],
        prerequisites: ["Upper-intermediate English level"],
        audience: "Students preparing for IELTS exam",
        seoSlug: "ielts-preparation-masterclass",
        metaTitle: "IELTS Preparation Masterclass",
        metaDescription: "Complete IELTS prep course"
      },
      createdAt: "2024-12-01",
      updatedAt: "2024-12-20"
    }
  ])
  
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([
    {
      id: 1,
      name: "IELTS Speaking Questions Bank.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadDate: "Dec 20, 2024",
      category: "IELTS",
      usedIn: ["IELTS Speaking Practice - Part 1", "Advanced Speaking Skills"]
    },
    {
      id: 2,
      name: "Business English Presentation.pptx",
      type: "presentation",
      size: "8.7 MB",
      uploadDate: "Dec 18, 2024",
      category: "Business English",
      usedIn: ["Business Presentation Skills"]
    },
    {
      id: 3,
      name: "Pronunciation Exercise Audio.mp3",
      type: "audio",
      size: "5.2 MB",
      uploadDate: "Dec 15, 2024",
      category: "Pronunciation",
      usedIn: ["Pronunciation Masterclass"]
    },
    {
      id: 4,
      name: "Grammar Rules Infographic.png",
      type: "image",
      size: "1.8 MB",
      uploadDate: "Dec 12, 2024",
      category: "Grammar",
      usedIn: ["Grammar Fundamentals", "Advanced Grammar"]
    },
    {
      id: 5,
      name: "Conversation Practice Video.mp4",
      type: "video",
      size: "45.3 MB",
      uploadDate: "Dec 10, 2024",
      category: "Conversation",
      usedIn: ["Daily Conversation Practice"]
    },
    {
      id: 6,
      name: "Vocabulary Building Worksheet.pdf",
      type: "pdf",
      size: "1.2 MB",
      uploadDate: "Dec 8, 2024",
      category: "Vocabulary",
      usedIn: []
    }
  ])

  const setMessageModalOpen = (open: boolean, student?: Student) => {
    setIsMessageModalOpen(open)
    setSelectedStudent(student || null)
  }

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse = {
      ...courseData,
      id: `course-${Date.now()}`,
      sales: 0,
      rating: 0,
      status: 'draft' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setCourses(prev => [...prev, newCourse])
  }

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(prev => 
      prev.map(course => 
        course.id === id ? { ...course, ...updates, updatedAt: new Date().toISOString() } : course
      )
    )
  }

  const addSubcategory = (courseId: string, parentId: string | null, subcategory: Omit<Subcategory, 'id'>) => {
    const newSubcategory = {
      ...subcategory,
      id: `sub-${Date.now()}`,
      parentId
    }
    
    setCourses(prev => 
      prev.map(course => {
        if (course.id === courseId) {
          // Add to structure - simplified implementation
          return {
            ...course,
            structure: [...course.structure, newSubcategory],
            updatedAt: new Date().toISOString()
          }
        }
        return course
      })
    )
  }

  const updateLesson = (courseId: string, lessonId: string, updates: Partial<Lesson>) => {
    setCourses(prev => 
      prev.map(course => {
        if (course.id === courseId) {
          // Update lesson in structure - simplified implementation
          return {
            ...course,
            updatedAt: new Date().toISOString()
          }
        }
        return course
      })
    )
  }

  const addLibraryItem = (itemData: Omit<LibraryItem, 'id'>) => {
    const newItem = {
      ...itemData,
      id: Math.max(...libraryItems.map(i => i.id)) + 1,
      uploadDate: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      usedIn: []
    }
    setLibraryItems(prev => [...prev, newItem])
  }

  const value: AppState = {
    // Navigation
    activeSection,
    setActiveSection,
    
    // Lesson Builder State
    selectedCourse,
    selectedLesson,
    builderMode,
    setSelectedCourse,
    setSelectedLesson,
    setBuilderMode,
    
    // Modals
    isCreateCourseModalOpen,
    isCreateLessonModalOpen,
    isUploadFileModalOpen,
    isEditProfileModalOpen,
    isMessageModalOpen,
    isCreateMomentModalOpen,
    isPayoutModalOpen,
    isCourseSettingsModalOpen,
    selectedStudent,
    
    setCreateCourseModalOpen,
    setCreateLessonModalOpen,
    setUploadFileModalOpen,
    setEditProfileModalOpen,
    setMessageModalOpen,
    setCreateMomentModalOpen,
    setPayoutModalOpen,
    setCourseSettingsModalOpen,
    
    // Data
    courses,
    libraryItems,
    setCourses,
    addCourse,
    updateCourse,
    addSubcategory,
    updateLesson,
    addLibraryItem
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}