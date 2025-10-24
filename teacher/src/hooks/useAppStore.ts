"use client"
import { createContext, useContext } from 'react'

interface Student {
  id: number
  name: string
  avatar: string
  email: string
  joinDate: string
  totalLessons: number
  completedLessons: number
  totalSessions: number
  averageScore: number
  streak: number
  lastActivity: string
  goal: string
  level: string
  notes: string
}

interface LibraryItem {
  id: number
  name: string
  type: string
  size: string
  uploadDate: string
  category: string
  usedIn: string[]
}

interface Block {
  id: string
  type: 'video' | 'text' | 'image' | 'audio' | 'attachment' | 
        'mcq_single' | 'mcq_multiple' | 'fill_blanks' | 'sentence_completion' | 
        'matching' | 'summary_completion' | 'table_completion' | 'flowchart_completion' |
        'diagram_labelling' | 'short_answer' | 'essay_writing' | 'letter_email_writing' |
        'paragraph_reordering' | 'sentence_reordering' | 'describe_picture' | 
        'write_sentence_given_words' | 'cue_card_speaking' | 'read_aloud' | 
        'listen_and_speak' | 'read_and_speak' | 'speak_about_topic' | 
        'audio_recording_response' | 'impromptu_speech' | 'pronunciation_correction' |
        'shadowing_practice' | 'listen_and_type' | 'listen_and_select' | 
        'read_and_select' | 'read_and_complete' | 'identify_grammar_error' |
        'choose_correct_tense' | 'find_synonym' | 'choose_best_title' |
        'categorization_drag_drop' | 'insert_sentence_paragraph' | 'word_family_practice' |
        'ai_feedback_writing' | 'image_based_prompt' | 'timed_task_exam'
  content: any
  config?: {
    timer?: number
    attempts?: number
    showSolution?: boolean
    aiEnabled?: boolean
    aiPrompt?: string
    scoring?: any
    examMode?: boolean
    speakingConfig?: {
      recordingTime?: number
      preparationTime?: number
    }
    listeningConfig?: {
      playLimit?: number
      autoPlay?: boolean
    }
  }
}

interface Lesson {
  id: string
  title: string
  status: 'draft' | 'private' | 'live'
  blocks: Block[]
  visibility: 'draft' | 'private' | 'live'
  version: number
  lastModified: string
}

interface Subcategory {
  id: string
  title: string
  type: 'subcategory' | 'lesson'
  children?: Subcategory[]
  lesson?: Lesson
  parentId?: string
}

interface Course {
  id: string
  title: string
  cover?: string
  shortDescription: string
  longDescription: string
  targetLevel: string
  language: string
  estimatedDuration: string
  tags: string[]
  marketplaceCategory: string
  status: 'draft' | 'in_review' | 'live' | 'disabled'
  price: number
  currency: string
  sales: number
  rating: number
  structure: Subcategory[]
  settings: {
    aiCreditsDefault: number
    freePreview: boolean
    introVideo?: string
    learningOutcomes: string[]
    prerequisites: string[]
    audience: string
    seoSlug: string
    metaTitle: string
    metaDescription: string
  }
  createdAt: string
  updatedAt: string
}

interface AppState {
  // Navigation
  activeSection: string
  setActiveSection: (section: string) => void
  
  // Lesson Builder State
  selectedCourse: Course | null
  selectedLesson: Lesson | null
  builderMode: 'structure' | 'lesson'
  setSelectedCourse: (course: Course | null) => void
  setSelectedLesson: (lesson: Lesson | null) => void
  setBuilderMode: (mode: 'structure' | 'lesson') => void
  
  // Modals
  isCreateCourseModalOpen: boolean
  isCreateLessonModalOpen: boolean
  isUploadFileModalOpen: boolean
  isEditProfileModalOpen: boolean
  isMessageModalOpen: boolean
  isCreateMomentModalOpen: boolean
  isPayoutModalOpen: boolean
  isCourseSettingsModalOpen: boolean
  selectedStudent: Student | null
  
  setCreateCourseModalOpen: (open: boolean) => void
  setCreateLessonModalOpen: (open: boolean) => void
  setUploadFileModalOpen: (open: boolean) => void
  setEditProfileModalOpen: (open: boolean) => void
  setMessageModalOpen: (open: boolean, student?: Student) => void
  setCreateMomentModalOpen: (open: boolean) => void
  setPayoutModalOpen: (open: boolean) => void
  setCourseSettingsModalOpen: (open: boolean) => void
  
  // Data
  courses: Course[]
  libraryItems: LibraryItem[]
  setCourses: (courses: Course[] | ((prev: Course[]) => Course[])) => void
  addCourse: (course: Omit<Course, 'id'>) => void
  updateCourse: (id: string, updates: Partial<Course>) => void
  addSubcategory: (courseId: string, parentId: string | null, subcategory: Omit<Subcategory, 'id'>) => void
  updateLesson: (courseId: string, lessonId: string, updates: Partial<Lesson>) => void
  addLibraryItem: (item: Omit<LibraryItem, 'id'>) => void
}

const AppContext = createContext<AppState | null>(null)

export const useAppStore = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppStore must be used within AppProvider')
  }
  return context
}

export { AppContext }
export type { AppState, Student, LibraryItem, Course, Subcategory, Lesson, Block }