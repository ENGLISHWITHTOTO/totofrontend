import { ReactNode } from "react"
import { cn } from "./ui/utils"

interface MobileOptimizedLayoutProps {
  children: ReactNode
  className?: string
  showPadding?: boolean
}

/**
 * A mobile-optimized layout wrapper that handles responsive spacing,
 * safe areas, and proper content layout for phone screens
 */
export function MobileOptimizedLayout({ 
  children, 
  className,
  showPadding = true 
}: MobileOptimizedLayoutProps) {
  return (
    <div className={cn(
      "w-full mx-auto",
      showPadding && "px-4 lg:px-6",
      className
    )}>
      {children}
    </div>
  )
}

interface MobileCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

/**
 * Mobile-optimized card component with proper touch targets
 * and visual feedback
 */
export function MobileCard({ children, className, onClick }: MobileCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card border border-border rounded-lg p-4",
        onClick && "active:scale-[0.98] transition-transform cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  )
}

interface MobileListItemProps {
  icon?: ReactNode
  title: string
  subtitle?: string
  action?: ReactNode
  onClick?: () => void
  className?: string
}

/**
 * Mobile-optimized list item with proper touch targets (min 44px height)
 * and visual feedback
 */
export function MobileListItem({ 
  icon, 
  title, 
  subtitle, 
  action, 
  onClick,
  className 
}: MobileListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-4 min-h-[60px] rounded-lg",
        "active:bg-accent transition-colors text-left",
        onClick && "cursor-pointer",
        className
      )}
    >
      {icon && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{title}</div>
        {subtitle && (
          <div className="text-sm text-muted-foreground truncate">{subtitle}</div>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </button>
  )
}

interface MobileHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  backButton?: ReactNode
  className?: string
}

/**
 * Mobile-optimized page header with proper spacing
 */
export function MobileHeader({ 
  title, 
  subtitle, 
  action, 
  backButton,
  className 
}: MobileHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      {backButton && (
        <div className="mb-4">
          {backButton}
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold truncate">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  )
}

interface MobileGridProps {
  children: ReactNode
  columns?: 1 | 2 | 3
  className?: string
}

/**
 * Responsive grid that adapts to mobile screens
 */
export function MobileGrid({ children, columns = 2, className }: MobileGridProps) {
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-2 lg:grid-cols-3"
  }[columns]

  return (
    <div className={cn("grid gap-4", gridClass, className)}>
      {children}
    </div>
  )
}

interface MobileStackProps {
  children: ReactNode
  spacing?: "sm" | "md" | "lg"
  className?: string
}

/**
 * Vertical stack with consistent spacing
 */
export function MobileStack({ children, spacing = "md", className }: MobileStackProps) {
  const spacingClass = {
    sm: "space-y-2",
    md: "space-y-4",
    lg: "space-y-6"
  }[spacing]

  return (
    <div className={cn(spacingClass, className)}>
      {children}
    </div>
  )
}