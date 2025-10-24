import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Play, Pause, Volume2, ChevronLeft, ChevronRight, BookOpen, MessageSquare } from 'lucide-react'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'

const lessonContent = [
  {
    type: 'text',
    content: 'Welcome to Business English Essentials. In this lesson, we\'ll cover key phrases used in professional meetings.'
  },
  {
    type: 'audio',
    content: 'Listen to this conversation between colleagues discussing a project.',
    audioUrl: '#',
    transcript: 'A: Good morning, Sarah. How\'s the project progressing?\nB: Good morning, John. We\'re making excellent progress. The team has completed the initial research phase.'
  },
  {
    type: 'mcq',
    question: 'What does "making excellent progress" mean?',
    options: [
      'Working slowly',
      'Doing very well',
      'Having problems',
      'Starting over'
    ],
    correct: 1
  },
  {
    type: 'text',
    content: 'Great job! Now let\'s practice using these phrases in different contexts.'
  }
]

export default function LessonPlayer() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const currentContent = lessonContent[currentStep]
  const progress = ((currentStep + 1) / lessonContent.length) * 100

  const handleNext = () => {
    if (currentStep < lessonContent.length - 1) {
      setCurrentStep(currentStep + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      // Lesson complete
      navigate('/')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    }
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer !== null) {
      setShowFeedback(true)
    }
  }

  const renderContent = () => {
    switch (currentContent.type) {
      case 'text':
        return (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-primary mt-1" />
                <p className="leading-relaxed">{currentContent.content}</p>
              </div>
            </CardContent>
          </Card>
        )

      case 'audio':
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                    <Volume2 className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Audio Content</h3>
                    <p className="text-muted-foreground mb-4">{currentContent.content}</p>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="gap-2"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      onClick={() => setShowTranscript(!showTranscript)}
                    >
                      {showTranscript ? 'Hide' : 'Show'} Transcript
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {showTranscript && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                      <h4 className="font-medium mb-2">Transcript</h4>
                      <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
                        {currentContent.transcript}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case 'mcq':
        return (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="font-medium">{currentContent.question}</h3>
                
                <div className="space-y-2">
                  {currentContent.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? 'default' : 'outline'}
                      className="w-full justify-start text-left h-auto p-4"
                      onClick={() => !showFeedback && setSelectedAnswer(index)}
                      disabled={showFeedback}
                    >
                      <span className="mr-3 font-medium">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>

                {!showFeedback && selectedAnswer !== null && (
                  <Button onClick={handleAnswerSubmit} className="w-full">
                    Submit Answer
                  </Button>
                )}

                {showFeedback && (
                  <div className="p-4 rounded-lg bg-muted">
                    {selectedAnswer === currentContent.correct ? (
                      <div className="text-green-600 dark:text-green-400">
                        <h4 className="font-medium">Correct! ✓</h4>
                        <p className="text-sm mt-1">
                          "Making excellent progress" means doing very well or advancing successfully.
                        </p>
                      </div>
                    ) : (
                      <div className="text-red-600 dark:text-red-400">
                        <h4 className="font-medium">Incorrect ✗</h4>
                        <p className="text-sm mt-1">
                          The correct answer is B. "Making excellent progress" means doing very well.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-medium">Business English Essentials</h1>
            <p className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {lessonContent.length}
            </p>
          </div>
        </div>
        
        <Badge variant="secondary">Intermediate</Badge>
      </header>

      {/* Progress */}
      <div className="px-4 py-2 border-b">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Navigation */}
      <footer className="p-4 border-t bg-card">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            {lessonContent.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep
                    ? 'bg-primary'
                    : index < currentStep
                    ? 'bg-primary/60'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <Button onClick={handleNext} className="gap-2">
            {currentStep === lessonContent.length - 1 ? 'Complete' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  )
}