import { 
  BookOpen, 
  Calendar, 
  DollarSign, 
  FileText, 
  Home, 
  Library, 
  Star, 
  Users, 
  Video,
  Settings,
  TrendingUp,
  Menu,
  MoreHorizontal,
  User,
  X,
  Megaphone,
  MessageCircle
} from "lucide-react"
import { Button } from "./components/ui/button"
import { Toaster } from "./components/ui/sonner"
import { useAppStore } from "./hooks/useAppStore"
import { AppProvider } from "./components/AppProvider"
import { Dashboard } from "./components/Dashboard"
import { Profile } from "./components/Profile"
import { CourseBuilder } from "./components/CourseBuilder"
import { LiveSessions } from "./components/LiveSessions"
import { LibraryPage } from "./components/LibraryPage"
import { Earnings } from "./components/Earnings"
import { Students } from "./components/Students"
import { Reviews } from "./components/Reviews"
import { Promotions } from "./components/Promotions"
import { Chat } from "./components/Chat"
import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./components/ui/sheet"

// Modals
import { CreateCourseModal } from "./components/modals/CreateCourseModal"
import { CourseSettingsModal } from "./components/modals/CourseSettingsModal"
import { CreateLessonModal } from "./components/modals/CreateLessonModal"
import { UploadFileModal } from "./components/modals/UploadFileModal"
import { MessageModal } from "./components/modals/MessageModal"
import { CreateMomentModal } from "./components/modals/CreateMomentModal"
import { PayoutModal } from "./components/modals/PayoutModal"

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    id: "dashboard"
  },
  {
    title: "Profile & Moments",
    icon: User,
    id: "profile"
  },
  {
    title: "Course Builder",
    icon: BookOpen,
    id: "lesson-builder"
  },
  {
    title: "Live Sessions",
    icon: Video,
    id: "live-sessions"
  },
  {
    title: "Messages",
    icon: MessageCircle,
    id: "chat"
  },
  {
    title: "Library",
    icon: Library,
    id: "library"
  },
  {
    title: "Students",
    icon: Users,
    id: "students"
  },
  {
    title: "Promotions",
    icon: Megaphone,
    id: "promotions"
  },
  {
    title: "Earnings",
    icon: DollarSign,
    id: "earnings"
  },
  {
    title: "Reviews & Reports",
    icon: Star,
    id: "reviews"
  }
]

// Primary bottom nav items for mobile
const bottomNavItems = [
  {
    title: "Home",
    icon: Home,
    id: "dashboard"
  },
  {
    title: "Courses",
    icon: BookOpen,
    id: "lesson-builder"
  },
  {
    title: "Library",
    icon: Library,
    id: "library"
  },
  {
    title: "Students",
    icon: Users,
    id: "students"
  },
  {
    title: "More",
    icon: MoreHorizontal,
    id: "more"
  }
]

// Secondary items shown in "More" menu
const moreMenuItems = [
  {
    title: "Profile & Moments",
    icon: User,
    id: "profile"
  },
  {
    title: "Live Sessions",
    icon: Video,
    id: "live-sessions"
  },
  {
    title: "Messages",
    icon: MessageCircle,
    id: "chat"
  },
  {
    title: "Promotions",
    icon: Megaphone,
    id: "promotions"
  },
  {
    title: "Earnings",
    icon: DollarSign,
    id: "earnings"
  },
  {
    title: "Reviews & Reports",
    icon: Star,
    id: "reviews"
  }
]

function AppContent() {
  const { activeSection, setActiveSection } = useAppStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />
      case "profile":
        return <Profile />
      case "lesson-builder":
        return <CourseBuilder />
      case "live-sessions":
        return <LiveSessions />
      case "chat":
        return <Chat />
      case "library":
        return <LibraryPage />
      case "students":
        return <Students />
      case "promotions":
        return <Promotions />
      case "earnings":
        return <Earnings />
      case "reviews":
        return <Reviews />
      default:
        return <Dashboard />
    }
  }

  const handleBottomNavClick = (id: string) => {
    if (id === "more") {
      setIsMoreMenuOpen(true)
    } else {
      setActiveSection(id)
    }
  }

  const handleMoreMenuItemClick = (id: string) => {
    setActiveSection(id)
    setIsMoreMenuOpen(false)
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-sidebar border-r border-border">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">TeachHub</span>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
                      ${activeSection === item.id 
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">TeachHub</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Content area with proper mobile padding */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 pb-20 lg:pb-6">
            {renderContent()}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="grid grid-cols-5 h-16">
            {bottomNavItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleBottomNavClick(item.id)}
                  className={`
                    flex flex-col items-center justify-center gap-1 transition-colors
                    ${isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground active:text-foreground'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                  <span className="text-xs">{item.title}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </main>

      {/* More Menu Sheet for Mobile */}
      <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
        <SheetContent side="bottom" className="h-auto max-h-[80vh]">
          <SheetHeader>
            <SheetTitle>More Options</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-1">
            {moreMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMoreMenuItemClick(item.id)}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-left transition-colors
                  ${activeSection === item.id 
                    ? 'bg-accent text-accent-foreground' 
                    : 'hover:bg-accent/50 active:bg-accent'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${activeSection === item.id ? 'bg-primary/10' : 'bg-muted'}
                `}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{item.title}</span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Modals */}
      <CreateCourseModal />
      <CourseSettingsModal />
      <CreateLessonModal />
      <UploadFileModal />
      <MessageModal />
      <CreateMomentModal />
      <PayoutModal />
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <div className="dark">
        <AppContent />
      </div>
    </AppProvider>
  )
}