import { useState } from 'react'
import { Globe, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import { useLanguage } from '../contexts/LanguageContext'
import { motion, AnimatePresence } from 'motion/react'
import LanguagePicker from './LanguagePicker'

export default function FloatingLanguageSwitch() {
  const { currentLanguage } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-24 right-4 z-40 lg:hidden">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-16 right-0 mb-2"
          >
            <LanguagePicker />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg border-2 border-white/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative flex flex-col items-center gap-0.5">
            <div className="text-lg">{currentLanguage.flag}</div>
            <Globe className="h-3 w-3 opacity-80" />
          </div>
          <motion.div 
            className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </Button>
      </motion.div>
    </div>
  )
}