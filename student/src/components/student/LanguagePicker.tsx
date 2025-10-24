import { useState } from 'react'
import { Check, ChevronDown, Globe, Sparkles, Languages } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu'
import { useLanguage, SUPPORTED_LANGUAGES, Language } from '../contexts/LanguageContext'
import { toast } from 'sonner@2.0.3'
import { motion } from 'motion/react'

export default function LanguagePicker() {
  const { currentLanguage, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageSelect = (language: Language) => {
    if (language.code === currentLanguage.code) {
      setIsOpen(false)
      return
    }
    
    setLanguage(language)
    setIsOpen(false)
    toast.success(`Switched to ${language.name}`, {
      description: 'All content is now customized for your selected language.',
      duration: 3000,
      action: {
        label: 'Explore',
        onClick: () => console.log('Exploring new language content')
      }
    })
  }

  const popularLanguages = SUPPORTED_LANGUAGES.slice(0, 6)
  const otherLanguages = SUPPORTED_LANGUAGES.slice(6)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 h-10 px-3 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:from-primary/20 hover:to-accent/20 transition-all duration-200"
          aria-label="Select learning language"
        >
          <div className="relative">
            <Globe className="h-4 w-4" />
            <motion.div 
              className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <span className="hidden md:inline font-medium">
            {currentLanguage.flag} {currentLanguage.name}
          </span>
          <span className="md:hidden text-lg">{currentLanguage.flag}</span>
          <ChevronDown className="h-3 w-3 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        <DropdownMenuLabel className="flex items-center gap-2 text-sm font-medium px-2 py-2">
          <Languages className="h-4 w-4 text-primary" />
          Choose Your Learning Language
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Popular Languages */}
        <div className="py-1">
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            Popular
          </div>
          {popularLanguages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageSelect(language)}
              className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg mx-1 my-0.5 hover:bg-primary/10 transition-colors"
            >
              <span className="text-xl">{language.flag}</span>
              <div className="flex-1">
                <span className="font-medium">{language.name}</span>
                {language.code === 'en' && (
                  <Badge variant="secondary" className="ml-2 text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Global
                  </Badge>
                )}
                {language.code === 'es' && (
                  <Badge variant="secondary" className="ml-2 text-xs bg-orange-500/20 text-orange-400 border-orange-500/30">
                    Popular
                  </Badge>
                )}
              </div>
              {currentLanguage.code === language.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Check className="h-4 w-4 text-primary" />
                </motion.div>
              )}
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />
        
        {/* Other Languages */}
        <div className="py-1">
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
            More Languages
          </div>
          {otherLanguages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageSelect(language)}
              className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg mx-1 my-0.5 hover:bg-primary/10 transition-colors"
            >
              <span className="text-xl">{language.flag}</span>
              <div className="flex-1">
                <span className="font-medium">{language.name}</span>
                {language.code === 'ar' && (
                  <Badge variant="secondary" className="ml-2 text-xs bg-purple-500/20 text-purple-400 border-purple-500/30">
                    RTL
                  </Badge>
                )}
              </div>
              {currentLanguage.code === language.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Check className="h-4 w-4 text-primary" />
                </motion.div>
              )}
            </DropdownMenuItem>
          ))}
        </div>
        
        <DropdownMenuSeparator />
        <div className="px-2 py-2">
          <p className="text-xs text-muted-foreground text-center">
            Content adapts to your selected language
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}