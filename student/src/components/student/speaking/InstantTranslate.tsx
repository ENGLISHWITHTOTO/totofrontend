import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  ArrowLeftRight,
  Copy,
  Volume2,
  Mic,
  Camera,
  Star,
  History,
  MoreHorizontal,
  X,
  ChevronDown,
  MicOff,
  Search,
  Filter,
  Trash2,
  Clock,
  RefreshCw
} from 'lucide-react'
import { Button } from '../../ui/button'
import { Card } from '../../ui/card'
import { Textarea } from '../../ui/textarea'
import { Badge } from '../../ui/badge'
import { Input } from '../../ui/input'
import { ScrollArea } from '../../ui/scroll-area'
import { Separator } from '../../ui/separator'
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger
} from '../../ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { toast } from 'sonner'

interface Language {
  code: string
  name: string
  flag: string
}

const languages: Language[] = [
  { code: 'detect', name: 'Detect language', flag: '🌐' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
]

interface Translation {
  id: string
  originalText: string
  translatedText: string
  fromLang: string
  toLang: string
  timestamp: Date
  isFavorite: boolean
}

const mockTranslations: Translation[] = [
  {
    id: '1',
    originalText: 'Hello, how are you?',
    translatedText: 'Hola, ¿cómo estás?',
    fromLang: 'en',
    toLang: 'es',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isFavorite: false
  },
  {
    id: '2',
    originalText: 'Thank you very much',
    translatedText: 'Muchas gracias',
    fromLang: 'en',
    toLang: 'es',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    isFavorite: true
  },
  {
    id: '3',
    originalText: 'Good morning! How did you sleep?',
    translatedText: '¡Buenos días! ¿Cómo dormiste?',
    fromLang: 'en',
    toLang: 'es',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isFavorite: false
  },
  {
    id: '4',
    originalText: 'Where is the nearest restaurant?',
    translatedText: '¿Dónde está el restaurante más cercano?',
    fromLang: 'en',
    toLang: 'es',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isFavorite: true
  },
  {
    id: '5',
    originalText: 'I would like to book a table for two',
    translatedText: 'Me gustaría reservar una mesa para dos',
    fromLang: 'en',
    toLang: 'es',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    isFavorite: false
  }
]

export default function InstantTranslate() {
  const navigate = useNavigate()
  const [fromLang, setFromLang] = useState<Language>(languages[0]) // Detect language
  const [toLang, setToLang] = useState<Language>(languages[2]) // Spanish
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [translations, setTranslations] = useState<Translation[]>(mockTranslations)
  const [showHistory, setShowHistory] = useState(false)
  const [historySearch, setHistorySearch] = useState('')
  const [historyFilter, setHistoryFilter] = useState<'all' | 'favorites' | 'recent'>('all')
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-translate when input changes
  useEffect(() => {
    if (inputText.trim()) {
      const timeoutId = setTimeout(() => {
        handleTranslate()
      }, 500)
      return () => clearTimeout(timeoutId)
    } else {
      setTranslatedText('')
    }
  }, [inputText, fromLang, toLang])

  // Filter translations based on search and filter
  const filteredTranslations = translations.filter(translation => {
    const matchesSearch = historySearch === '' || 
      translation.originalText.toLowerCase().includes(historySearch.toLowerCase()) ||
      translation.translatedText.toLowerCase().includes(historySearch.toLowerCase())
    
    const matchesFilter = historyFilter === 'all' || 
      (historyFilter === 'favorites' && translation.isFavorite) ||
      (historyFilter === 'recent' && (Date.now() - translation.timestamp.getTime()) < 24 * 60 * 60 * 1000)
    
    return matchesSearch && matchesFilter
  })

  const handleTranslate = async () => {
    if (!inputText.trim()) return
    
    setIsTranslating(true)
    
    // Simulate translation API call
    setTimeout(() => {
      const mockTranslation = simulateTranslation(inputText, fromLang.code, toLang.code)
      setTranslatedText(mockTranslation)
      setIsTranslating(false)
    }, 300)
  }

  const simulateTranslation = (text: string, from: string, to: string): string => {
    const translations: Record<string, Record<string, string>> = {
      'hello': { es: 'hola', fr: 'bonjour', de: 'hallo', it: 'ciao' },
      'thank you': { es: 'gracias', fr: 'merci', de: 'danke', it: 'grazie' },
      'how are you': { es: '¿cómo estás?', fr: 'comment allez-vous?', de: 'wie geht es dir?', it: 'come stai?' },
      'good morning': { es: 'buenos días', fr: 'bonjour', de: 'guten morgen', it: 'buongiorno' },
      'goodbye': { es: 'adiós', fr: 'au revoir', de: 'auf wiedersehen', it: 'arrivederci' }
    }

    const key = text.toLowerCase()
    return translations[key]?.[to] || `[${text} translated to ${to}]`
  }

  const swapLanguages = () => {
    if (fromLang.code === 'detect') return
    
    const temp = fromLang
    setFromLang(toLang)
    setToLang(temp)
    
    // Swap the texts too
    setInputText(translatedText)
    setTranslatedText(inputText)
  }

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const playAudio = (text: string, langCode: string) => {
    // Text-to-speech implementation would go here
    toast.info(`Playing: ${text}`)
  }

  const saveTranslation = () => {
    if (!inputText.trim() || !translatedText.trim()) return
    
    const newTranslation: Translation = {
      id: Date.now().toString(),
      originalText: inputText,
      translatedText: translatedText,
      fromLang: fromLang.code,
      toLang: toLang.code,
      timestamp: new Date(),
      isFavorite: false
    }
    
    setTranslations(prev => [newTranslation, ...prev])
    toast.success('Translation saved')
  }

  const toggleFavorite = (id: string) => {
    setTranslations(prev => 
      prev.map(t => 
        t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
      )
    )
    const translation = translations.find(t => t.id === id)
    if (translation) {
      toast.success(translation.isFavorite ? 'Removed from favorites' : 'Added to favorites')
    }
  }

  const deleteTranslation = (id: string) => {
    setTranslations(prev => prev.filter(t => t.id !== id))
    toast.success('Translation deleted')
  }

  const clearAllHistory = () => {
    setTranslations([])
    toast.success('History cleared')
  }

  const useTranslation = (translation: Translation) => {
    setInputText(translation.originalText)
    setTranslatedText(translation.translatedText)
    setFromLang(getLanguageByCode(translation.fromLang))
    setToLang(getLanguageByCode(translation.toLang))
    setShowHistory(false)
    toast.success('Translation loaded')
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    
    return date.toLocaleDateString()
  }

  const startVoiceInput = () => {
    setIsListening(true)
    // Voice recognition would start here
    // For demo, simulate voice input
    setTimeout(() => {
      setInputText('Hello, how are you today?')
      setIsListening(false)
      toast.success('Voice input complete')
    }, 2000)
  }

  const stopVoiceInput = () => {
    setIsListening(false)
  }

  const getLanguageByCode = (code: string) => {
    return languages.find(lang => lang.code === code) || languages[1]
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/speaking')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-medium">Translate</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Sheet open={showHistory} onOpenChange={setShowHistory}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <History className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <SheetTitle className="text-xl">History</SheetTitle>
                    <SheetDescription>
                      View and manage your translation history
                    </SheetDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearAllHistory}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear all
                  </Button>
                </div>
                
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search translations..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1 p-1 bg-muted rounded-lg">
                  {[
                    { value: 'all', label: 'All', icon: History },
                    { value: 'favorites', label: 'Favorites', icon: Star },
                    { value: 'recent', label: 'Recent', icon: Clock }
                  ].map(({ value, label, icon: Icon }) => (
                    <Button
                      key={value}
                      variant={historyFilter === value ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setHistoryFilter(value as any)}
                      className="flex-1 gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Button>
                  ))}
                </div>
              </SheetHeader>

              {/* Translation List */}
              <ScrollArea className="flex-1 mt-6 -mx-6 px-6">
                <div className="space-y-3 pb-6">
                  {filteredTranslations.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <History className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium mb-2">No translations found</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {historySearch ? 'Try adjusting your search' : 'Your translation history will appear here'}
                      </p>
                      {historySearch && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setHistorySearch('')}
                        >
                          Clear search
                        </Button>
                      )}
                    </div>
                  ) : (
                    filteredTranslations.map((translation) => (
                      <Card key={translation.id} className="group hover:shadow-md transition-all duration-200">
                        <div className="p-4 space-y-3">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{getLanguageByCode(translation.fromLang).flag}</span>
                                <ArrowLeftRight className="h-3 w-3 text-muted-foreground" />
                                <span className="text-base">{getLanguageByCode(translation.toLang).flag}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {formatRelativeTime(translation.timestamp)}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(translation.id)}
                                className="p-2"
                              >
                                <Star 
                                  className={`h-4 w-4 ${
                                    translation.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                                  }`} 
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteTranslation(translation.id)}
                                className="p-2 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Content */}
                          <div 
                            className="space-y-2 cursor-pointer"
                            onClick={() => useTranslation(translation)}
                          >
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-relaxed">
                                {translation.originalText}
                              </p>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {translation.translatedText}
                              </p>
                            </div>
                          </div>

                          <Separator />

                          {/* Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyText(translation.translatedText)}
                                className="gap-2 text-xs"
                              >
                                <Copy className="h-3 w-3" />
                                Copy
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => playAudio(translation.translatedText, translation.toLang)}
                                className="gap-2 text-xs"
                              >
                                <Volume2 className="h-3 w-3" />
                                Listen
                              </Button>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => useTranslation(translation)}
                              className="gap-2 text-xs text-primary hover:text-primary"
                            >
                              <RefreshCw className="h-3 w-3" />
                              Use
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          
          <Button variant="ghost" size="sm" className="p-2">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Language Selector */}
      <div className="p-4 bg-card border-b">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Select 
              value={fromLang.code} 
              onValueChange={(value) => setFromLang(getLanguageByCode(value))}
            >
              <SelectTrigger className="border-0 bg-transparent p-0 h-auto font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{fromLang.flag}</span>
                  <span>{fromLang.name}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={swapLanguages}
            disabled={fromLang.code === 'detect'}
            className="p-2"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            <Select 
              value={toLang.code} 
              onValueChange={(value) => setToLang(getLanguageByCode(value))}
            >
              <SelectTrigger className="border-0 bg-transparent p-0 h-auto font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{toLang.flag}</span>
                  <span>{toLang.name}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {languages.filter(lang => lang.code !== 'detect').map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Translation Interface */}
      <div className="flex-1 flex flex-col">
        {/* Input Section */}
        <div className="border-b bg-card">
          <div className="p-4">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Enter text in ${fromLang.name}`}
                className="min-h-[120px] resize-none border-0 bg-transparent p-0 text-lg focus-visible:ring-0"
              />
              {inputText && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInputText('')}
                  className="absolute top-2 right-2 p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Input Actions */}
          <div className="flex items-center justify-between p-4 pt-0">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                className={`p-2 ${isListening ? 'bg-red-500 text-white' : ''}`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Button variant="ghost" size="sm" className="p-2">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            {inputText && translatedText && (
              <Button variant="ghost" size="sm" onClick={saveTranslation}>
                <Star className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Output Section */}
        <div className="flex-1 bg-muted/30">
          <div className="p-4">
            <div className="min-h-[120px]">
              {isTranslating ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                  <span>Translating...</span>
                </div>
              ) : translatedText ? (
                <p className="text-lg">{translatedText}</p>
              ) : (
                <p className="text-muted-foreground text-lg">Translation will appear here</p>
              )}
            </div>
          </div>
          
          {/* Output Actions */}
          {translatedText && (
            <div className="flex items-center justify-between p-4 pt-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyText(translatedText)}
                  className="p-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => playAudio(translatedText, toLang.code)}
                  className="p-2"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {fromLang.code === 'detect' ? 'Auto-detected' : fromLang.name} → {toLang.name}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="sm" className="gap-2">
            <Camera className="h-4 w-4" />
            Camera
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Mic className="h-4 w-4" />
            Conversation
          </Button>
        </div>
      </div>
    </div>
  )
}