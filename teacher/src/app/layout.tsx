"use client";

import "./globals.css";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  DollarSign,
  Home,
  Library,
  Star,
  Users,
  Video,
  Settings,
  MoreHorizontal,
  Megaphone,
  MessageCircle,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/components/AppProvider";

import { CreateCourseModal } from "@/components/modals/CreateCourseModal";
import { CourseSettingsModal } from "@/components/modals/CourseSettingsModal";
import { CreateLessonModal } from "@/components/modals/CreateLessonModal";
import { UploadFileModal } from "@/components/modals/UploadFileModal";
import { MessageModal } from "@/components/modals/MessageModal";
import { CreateMomentModal } from "@/components/modals/CreateMomentModal";
import { PayoutModal } from "@/components/modals/PayoutModal";

const menuItems = [
  { title: "Dashboard", icon: Home, path: "/teacher/dashboard" },
  { title: "Profile & Moments", icon: User, path: "/teacher/profile" },
  { title: "Course Builder", icon: BookOpen, path: "/teacher/course-builder" },
  { title: "Live Sessions", icon: Video, path: "/teacher/live-sessions" },
  { title: "Messages", icon: MessageCircle, path: "/teacher/chat" },
  { title: "Library", icon: Library, path: "/teacher/library" },
  { title: "Students", icon: Users, path: "/teacher/students" },
  { title: "Promotions", icon: Megaphone, path: "/teacher/promotions" },
  { title: "Earnings", icon: DollarSign, path: "/teacher/earnings" },
  { title: "Reviews & Reports", icon: Star, path: "/teacher/reviews" },
];

const bottomNavItems = [
  { title: "Home", icon: Home, path: "/teacher/dashboard" },
  { title: "Courses", icon: BookOpen, path: "/teacher/course-builder" },
  { title: "Library", icon: Library, path: "/teacher/library" },
  { title: "Students", icon: Users, path: "/teacher/students" },
  { title: "More", icon: MoreHorizontal, path: "/teacher/more" },
];

const moreMenuItems = [
  { title: "Profile & Moments", icon: User, path: "/teacher/profile" },
  { title: "Live Sessions", icon: Video, path: "/teacher/live-sessions" },
  { title: "Messages", icon: MessageCircle, path: "/teacher/chat" },
  { title: "Promotions", icon: Megaphone, path: "/teacher/promotions" },
  { title: "Earnings", icon: DollarSign, path: "/teacher/earnings" },
  { title: "Reviews & Reports", icon: Star, path: "/teacher/reviews" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  return (
    <html lang="en">
      <body className="dark">
        <AppProvider>
          <div className="min-h-screen flex w-full bg-background">
            {/* Sidebar (desktop) */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-sidebar border-r border-border sticky top-0 h-screen">
              <div className="flex items-center gap-2 p-4 border-b border-border">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold">TeachHub</span>
              </div>
              <nav className="flex-1 p-4 overflow-auto">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const active = pathname === item.path;
                    return (
                      <li key={item.path}>
                        <Link
                          href={item.path}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                            ${
                              active
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col">
              <div className="flex-1 overflow-auto p-4 lg:p-6 pb-20 lg:pb-6">
                {children}
              </div>

              {/* Mobile Bottom Navigation */}
              <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
                <div className="grid grid-cols-5 h-16">
                  {bottomNavItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() =>
                          item.path === "/teacher/more"
                            ? setIsMoreMenuOpen(true)
                            : (window.location.href = item.path)
                        }
                        className={`flex flex-col items-center justify-center gap-1 transition-colors
                          ${
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground active:text-foreground"
                          }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-xs">{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              </nav>
            </main>

            {/* Mobile More Menu */}
            <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
              <SheetContent side="bottom" className="h-auto max-h-[80vh]">
                <SheetHeader>
                  <SheetTitle>More Options</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-1">
                  {moreMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg hover:bg-accent/50 active:bg-accent"
                      onClick={() => setIsMoreMenuOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* Modals and Toaster */}
            <CreateCourseModal />
            <CourseSettingsModal />
            <CreateLessonModal />
            <UploadFileModal />
            <MessageModal />
            <CreateMomentModal />
            <PayoutModal />
            <Toaster />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
