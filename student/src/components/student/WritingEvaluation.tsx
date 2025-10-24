import { useState } from 'react'
import { Send, RefreshCw, CreditCard, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Alert, AlertDescription } from '../ui/alert'
import { Separator } from '../ui/separator'
import { toast } from 'sonner'

interface RubricScore {
  category: string
  score: number
  maxScore: number
  feedback: string
  suggestions: string[]
}

interface EvaluationResult {
  overallScore: number
  wordCount: number
  rubric: RubricScore[]
  generalFeedback: string
}

const mockPrompt = "Write a formal email to your manager requesting time off for a family vacation. Include specific dates, reason for the request, and how you plan to handle your responsibilities while away. (Minimum 150 words)"

export default function WritingEvaluation() {
  const [text, setText] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [result, setResult] = useState<EvaluationResult | null>(null)
  const [creditsLow, setCreditsLow] = useState(false)
  
  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length
  const minWords = 150
  const canEvaluate = wordCount >= minWords && text.trim().length > 0

  const handleEvaluate = async () => {
    if (!canEvaluate) {
      toast.error(`Please write at least ${minWords} words`)
      return
    }

    setIsEvaluating(true)
    
    // Simulate AI evaluation
    setTimeout(() => {
      const mockResult: EvaluationResult = {
        overallScore: 82,
        wordCount,
        rubric: [
          {
            category: 'Grammar & Mechanics',
            score: 85,
            maxScore: 100,
            feedback: 'Good use of formal language and sentence structure. Minor punctuation issues.',
            suggestions: [
              'Consider using more complex sentence structures',
              'Check comma usage in compound sentences'
            ]
          },
          {
            category: 'Vocabulary & Style',
            score: 78,
            maxScore: 100,
            feedback: 'Appropriate formal tone. Could benefit from more varied vocabulary.',
            suggestions: [
              'Use synonyms to avoid repetition',
              'Incorporate more professional business terms'
            ]
          },
          {
            category: 'Coherence & Organization',
            score: 88,
            maxScore: 100,
            feedback: 'Clear structure with logical flow. Good use of transitions.',
            suggestions: [
              'Consider adding a brief summary in closing',
              'Strong opening and clear purpose'
            ]
          },
          {
            category: 'Task Completion',
            score: 80,
            maxScore: 100,
            feedback: 'Addressed most requirements. Could provide more specific details.',
            suggestions: [
              'Include exact dates for vacation',
              'Mention specific handover plans'
            ]
          }
        ],
        generalFeedback: 'Well-structured formal email with appropriate tone. The request is clear and professional. Consider adding more specific details about coverage arrangements and exact dates to strengthen the request.'
      }
      
      setResult(mockResult)
      setIsEvaluating(false)
      
      // Simulate credit consumption
      if (Math.random() > 0.7) {
        setCreditsLow(true)
      }
    }, 3000)
  }

  const handleTryAgain = () => {
    if (creditsLow && Math.random() > 0.5) {
      toast.error('Insufficient credits. Please top up to continue.')
      return
    }
    
    setText('')
    setResult(null)
    toast.success('Ready for your next attempt!')
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 dark:text-green-400'
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 85) return 'default'
    if (score >= 70) return 'secondary'
    return 'destructive'
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1>AI Writing Evaluation</h1>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Credits: 15</span>
          </div>
        </div>
        
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100">Writing Prompt</h3>
                <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                  {mockPrompt}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Writing Area */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Response</CardTitle>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${wordCount >= minWords ? 'text-green-600' : 'text-muted-foreground'}`}>
                {wordCount}/{minWords} words
              </span>
              {wordCount >= minWords && (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Start writing your response here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] resize-none"
            disabled={isEvaluating}
          />
          
          <div className="flex items-center justify-between">
            <Progress 
              value={(wordCount / minWords) * 100} 
              className="flex-1 max-w-xs"
            />
            
            <Button 
              onClick={handleEvaluate}
              disabled={!canEvaluate || isEvaluating}
              className="gap-2"
            >
              {isEvaluating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Evaluate Writing
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div>
                  <div className={`text-4xl font-bold ${getScoreColor(result.overallScore)}`}>
                    {result.overallScore}/100
                  </div>
                  <p className="text-muted-foreground">Overall Score</p>
                </div>
                
                <Badge variant={getScoreBadgeVariant(result.overallScore)} className="text-sm">
                  {result.overallScore >= 85 ? 'Excellent' : result.overallScore >= 70 ? 'Good' : 'Needs Improvement'}
                </Badge>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Word count: {result.wordCount} words
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rubric Details */}
          <div className="grid gap-4">
            {result.rubric.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{item.category}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getScoreColor(item.score)}`}>
                          {item.score}/{item.maxScore}
                        </span>
                        <Progress value={item.score} className="w-20" />
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {item.feedback}
                    </p>
                    
                    {item.suggestions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Suggestions for improvement:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {item.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* General Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>General Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {result.generalFeedback}
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleTryAgain} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Save & Continue
            </Button>
          </div>

          {/* Low Credits Warning */}
          {creditsLow && (
            <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Running low on credits</p>
                    <p className="text-sm mt-1">You have 3 evaluations remaining. Top up to continue unlimited practice.</p>
                  </div>
                  <Button size="sm" className="ml-4">
                    Top Up Credits
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  )
}