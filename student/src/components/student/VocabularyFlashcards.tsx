import { useState } from 'react'
import { Volume2, RotateCcw, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { toast } from 'sonner'

interface FlashCard {
  id: string
  word: string
  partOfSpeech: string
  phonetic?: string
  definition: string
  example: string
  synonyms: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}

const mockCards: FlashCard[] = [
  {
    id: '1',
    word: 'collaborate',
    partOfSpeech: 'verb',
    phonetic: '/kəˈlæbəreɪt/',
    definition: 'to work together with someone to produce or create something',
    example: 'The marketing team collaborated with the design department to create the new campaign.',
    synonyms: ['cooperate', 'work together', 'partner'],
    difficulty: 'medium'
  },
  {
    id: '2',
    word: 'innovation',
    partOfSpeech: 'noun',
    phonetic: '/ˌɪnəˈveɪʃən/',
    definition: 'a new method, idea, product, or system',
    example: 'The company is known for its innovation in sustainable technology.',
    synonyms: ['invention', 'novelty', 'breakthrough'],
    difficulty: 'medium'
  },
  {
    id: '3',
    word: 'efficient',
    partOfSpeech: 'adjective',
    phonetic: '/ɪˈfɪʃənt/',
    definition: 'working in a well-organized way; competent',
    example: 'The new software makes our workflow much more efficient.',
    synonyms: ['effective', 'productive', 'streamlined'],
    difficulty: 'easy'
  },
  {
    id: '4',
    word: 'stakeholder',
    partOfSpeech: 'noun',
    phonetic: '/ˈsteɪkˌhoʊldər/',
    definition: 'a person or group that has an investment, share, or interest in something',
    example: 'All stakeholders must be consulted before making this decision.',
    synonyms: ['investor', 'shareholder', 'interested party'],
    difficulty: 'hard'
  },
  {
    id: '5',
    word: 'deadline',
    partOfSpeech: 'noun',
    phonetic: '/ˈdedlaɪn/',
    definition: 'a time or date by which something must be finished',
    example: 'The deadline for the project proposal is next Friday.',
    synonyms: ['due date', 'time limit', 'cutoff'],
    difficulty: 'easy'
  }
]

export default function VocabularyFlashcards() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [completedCards, setCompletedCards] = useState<string[]>([])
  const [knownCards, setKnownCards] = useState<string[]>([])
  const [sessionComplete, setSessionComplete] = useState(false)
  
  const currentCard = mockCards[currentIndex]
  const totalCards = mockCards.length
  const remainingCards = totalCards - completedCards.length
  const progress = (completedCards.length / totalCards) * 100

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleKnown = () => {
    if (!completedCards.includes(currentCard.id)) {
      setCompletedCards(prev => [...prev, currentCard.id])
      setKnownCards(prev => [...prev, currentCard.id])
    }
    nextCard()
  }

  const handleForgot = () => {
    if (!completedCards.includes(currentCard.id)) {
      setCompletedCards(prev => [...prev, currentCard.id])
    }
    nextCard()
  }

  const nextCard = () => {
    setIsFlipped(false)
    
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setSessionComplete(true)
      toast.success('Flashcard session complete!')
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setCompletedCards([])
    setKnownCards([])
    setSessionComplete(false)
  }

  const playAudio = () => {
    // In a real app, this would use speech synthesis or audio files
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentCard.word)
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    } else {
      toast.info('Audio playback not supported in this browser')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  if (sessionComplete) {
    return (
      <div className="max-w-lg mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            <div className="text-6xl">🎉</div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">Session Complete!</h2>
              <p className="text-muted-foreground">
                Great job! You've reviewed all {totalCards} cards.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-green-600 dark:text-green-400 font-semibold">
                  {knownCards.length}
                </div>
                <div className="text-green-700 dark:text-green-300">Cards Known</div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-blue-600 dark:text-blue-400 font-semibold">
                  {totalCards - knownCards.length}
                </div>
                <div className="text-blue-700 dark:text-blue-300">Need Review</div>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={handleRestart} className="w-full gap-2">
                <RotateCcw className="h-4 w-4" />
                Review Again
              </Button>
              
              <div className="text-xs text-muted-foreground">
                Next review session tomorrow for better retention
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        
        <div className="text-center">
          <h1 className="text-lg font-semibold">Business Vocabulary</h1>
          <p className="text-sm text-muted-foreground">
            Due today: {remainingCards} cards
          </p>
        </div>
        
        <div className="w-16" /> {/* Spacer */}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{completedCards.length}/{totalCards}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard */}
      <div className="relative h-80">
        <Card className="h-full cursor-pointer" onClick={handleFlip}>
          <CardContent className="p-6 h-full flex flex-col">
            {!isFlipped ? (
              // Front of card
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <Badge className={getDifficultyColor(currentCard.difficulty)}>
                  {currentCard.difficulty}
                </Badge>
                
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold">{currentCard.word}</h2>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-sm italic">{currentCard.partOfSpeech}</span>
                    {currentCard.phonetic && (
                      <>
                        <span>•</span>
                        <span className="text-sm">{currentCard.phonetic}</span>
                      </>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation()
                      playAudio()
                    }}
                    className="gap-2"
                  >
                    <Volume2 className="h-4 w-4" />
                    Play
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground mt-auto">
                  Tap to reveal definition
                </p>
              </div>
            ) : (
              // Back of card
              <div className="h-full flex flex-col space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">{currentCard.word}</h3>
                  <Badge variant="outline" className="text-xs">
                    {currentCard.partOfSpeech}
                  </Badge>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Definition</h4>
                    <p className="text-sm leading-relaxed">{currentCard.definition}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-1">Example</h4>
                    <p className="text-sm italic text-muted-foreground leading-relaxed">
                      "{currentCard.example}"
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-1">Synonyms</h4>
                    <div className="flex flex-wrap gap-1">
                      {currentCard.synonyms.map((synonym, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {synonym}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Flip indicator */}
        <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 rounded px-2 py-1">
          {isFlipped ? 'Back' : 'Front'}
        </div>
      </div>

      {/* Action Buttons */}
      {isFlipped && (
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={handleForgot}
            className="gap-2 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/20"
          >
            <XCircle className="h-4 w-4 text-red-600" />
            I forgot
          </Button>
          
          <Button 
            onClick={handleKnown}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            I knew it
          </Button>
        </div>
      )}

      {!isFlipped && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Review the word, then flip to see the definition
          </p>
        </div>
      )}
    </div>
  )
}