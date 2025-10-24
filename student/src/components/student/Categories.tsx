import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, BookOpen, Mic, PenTool, MessageSquare, FileText, Headphones } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { ScrollArea } from '../ui/scroll-area'

interface Category {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  lessons: number
  description: string
  color: string
  bgColor: string
}

const categories: Category[] = [
  { 
    id: 'ielts',
    name: 'IELTS', 
    icon: FileText,
    lessons: 120, 
    description: 'Complete IELTS preparation course',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 dark:bg-pink-900/20'
  },
  { 
    id: 'speaking',
    name: 'Speaking', 
    icon: Mic,
    lessons: 85, 
    description: 'Improve fluency & pronunciation',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20'
  },
  { 
    id: 'reading',
    name: 'Reading', 
    icon: BookOpen,
    lessons: 65, 
    description: 'Reading comprehension & speed',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/20'
  },
  { 
    id: 'writing',
    name: 'Writing', 
    icon: PenTool,
    lessons: 75, 
    description: 'Essays & formal writing',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20'
  },
  { 
    id: 'grammar',
    name: 'Grammar', 
    icon: MessageSquare,
    lessons: 95, 
    description: 'Rules & sentence structure',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20'
  },
  { 
    id: 'vocabulary',
    name: 'Vocabulary', 
    icon: Headphones,
    lessons: 110, 
    description: 'Word power & meaning',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 dark:bg-pink-900/20'
  }
]

export default function Categories() {
  const navigate = useNavigate()

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header - Enhanced contrast */}
      <header className="p-6 border-b border-[#2a2a2f] bg-[#0a0a0b]/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Categories</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:text-primary/80 hover:bg-[#141418] border border-transparent hover:border-border/50 transition-all"
            onClick={() => navigate('/categories/search')}
          >
            See All
          </Button>
        </div>
      </header>

      {/* Categories Grid - Enhanced contrast */}
      <ScrollArea className="flex-1 p-6">
        <div className="grid grid-cols-2 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            
            return (
              <Card 
                key={category.id} 
                className="cursor-pointer bg-[#0f0f11] border-[#2a2a2f] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-primary/40"
                onClick={() => navigate(`/categories/${category.id}`)}
              >
                <CardContent className="p-5">
                  <div className="space-y-4">
                    {/* Icon - Enhanced */}
                    <div className={`w-14 h-14 rounded-2xl ${category.bgColor} flex items-center justify-center shadow-inner`}>
                      <IconComponent className={`w-7 h-7 ${category.color}`} />
                    </div>
                    
                    {/* Content - Enhanced typography */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-foreground">{category.name}</h3>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        {category.description}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium bg-[#141418] px-2 py-1 rounded-md w-fit">
                        {category.lessons} lessons
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}