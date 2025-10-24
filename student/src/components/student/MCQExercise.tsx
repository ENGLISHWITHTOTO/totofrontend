import { useState } from 'react'
import { CheckCircle, XCircle, Info, RotateCcw } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'

interface MCQOption {
  id: string
  text: string
  isCorrect: boolean
}

interface MCQQuestion {
  id: string
  question: string
  options: MCQOption[]
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface MCQExerciseProps {
  question: MCQQuestion
  onNext: () => void
  onRetry?: () => void
  showRetry?: boolean
}

export default function MCQExercise({ 
  question, 
  onNext, 
  onRetry, 
  showRetry = true 
}: MCQExerciseProps) {
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  
  const correctOption = question.options.find(opt => opt.isCorrect)
  const isCorrect = submitted && selectedOption === correctOption?.id
  const isIncorrect = submitted && selectedOption !== correctOption?.id

  const handleSubmit = () => {
    if (!selectedOption) return
    setSubmitted(true)
  }

  const handleRetry = () => {
    setSelectedOption('')
    setSubmitted(false)
    setShowExplanation(false)
    onRetry?.()
  }

  const handleNext = () => {
    onNext()
    // Reset for next question
    setSelectedOption('')
    setSubmitted(false)
    setShowExplanation(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Question Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className={getDifficultyColor(question.difficulty)}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </Badge>
          
          {submitted && (
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium text-red-600">Incorrect</span>
                </>
              )}
            </div>
          )}
        </div>

        <h2 className="text-lg font-medium leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <Card>
        <CardContent className="p-6">
          <RadioGroup 
            value={selectedOption} 
            onValueChange={setSelectedOption}
            disabled={submitted}
            className="space-y-4"
          >
            {question.options.map((option) => {
              const isSelected = selectedOption === option.id
              const isCorrectOption = option.isCorrect
              const shouldHighlight = submitted && (isSelected || isCorrectOption)
              
              let borderColor = ''
              let bgColor = ''
              
              if (submitted) {
                if (isCorrectOption) {
                  borderColor = 'border-green-500'
                  bgColor = 'bg-green-50 dark:bg-green-950/20'
                } else if (isSelected && !isCorrectOption) {
                  borderColor = 'border-red-500'
                  bgColor = 'bg-red-50 dark:bg-red-950/20'
                }
              }

              return (
                <div key={option.id}>
                  <Label
                    htmlFor={option.id}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/50 ${
                      shouldHighlight ? `${borderColor} ${bgColor}` : 'border-border'
                    } ${submitted ? 'cursor-default' : ''}`}
                  >
                    <RadioGroupItem 
                      value={option.id} 
                      id={option.id}
                      className={shouldHighlight && isCorrectOption ? 'border-green-500 text-green-500' : ''}
                    />
                    <span className={`flex-1 ${submitted && isCorrectOption ? 'font-medium text-green-700 dark:text-green-300' : ''}`}>
                      {option.text}
                    </span>
                    {submitted && isCorrectOption && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {submitted && isSelected && !isCorrectOption && (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Feedback Panel */}
      {submitted && (
        <Alert className={isCorrect ? 'border-green-200 bg-green-50 dark:bg-green-950/20' : 'border-red-200 bg-red-50 dark:bg-red-950/20'}>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-3">
              <p className="font-medium">
                {isCorrect 
                  ? "Great job! That's the correct answer." 
                  : `The correct answer is "${correctOption?.text}"`
                }
              </p>
              
              {showExplanation && (
                <div className="pt-2 border-t border-current/20">
                  <p className="text-sm">{question.explanation}</p>
                </div>
              )}
              
              {!showExplanation && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExplanation(true)}
                  className="p-0 h-auto font-normal text-current hover:bg-transparent hover:underline"
                >
                  Show explanation
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!submitted ? (
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedOption}
            className="flex-1"
          >
            Submit Answer
          </Button>
        ) : (
          <>
            <Button onClick={handleNext} className="flex-1">
              Next Question
            </Button>
            {showRetry && !isCorrect && (
              <Button variant="outline" onClick={handleRetry} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Retry
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Example usage component
export function MCQExerciseExample() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  
  const sampleQuestions: MCQQuestion[] = [
    {
      id: '1',
      question: 'Which of the following is the correct way to greet someone formally in a business setting?',
      options: [
        { id: 'a', text: 'Hey there!', isCorrect: false },
        { id: 'b', text: 'Good morning, Mr. Smith.', isCorrect: true },
        { id: 'c', text: "What's up?", isCorrect: false },
        { id: 'd', text: 'Yo!', isCorrect: false }
      ],
      explanation: 'In formal business settings, using titles (Mr., Ms., Dr.) and formal greetings like "Good morning" or "Good afternoon" shows respect and professionalism.',
      difficulty: 'easy'
    },
    {
      id: '2',
      question: 'What does the phrase "think outside the box" mean in business context?',
      options: [
        { id: 'a', text: 'To think about boxes', isCorrect: false },
        { id: 'b', text: 'To be creative and innovative', isCorrect: true },
        { id: 'c', text: 'To think slowly', isCorrect: false },
        { id: 'd', text: 'To avoid thinking', isCorrect: false }
      ],
      explanation: '"Think outside the box" is an idiomatic expression meaning to think creatively or unconventionally, to approach problems in new and innovative ways.',
      difficulty: 'medium'
    }
  ]

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Exercise complete
      console.log('Exercise completed!')
    }
  }

  const handleRetry = () => {
    console.log('Retrying question')
  }

  return (
    <MCQExercise
      question={sampleQuestions[currentQuestion]}
      onNext={handleNext}
      onRetry={handleRetry}
    />
  )
}