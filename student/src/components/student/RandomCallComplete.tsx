import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Textarea } from '../ui/textarea'
import { 
  Star, 
  Heart, 
  UserPlus, 
  MessageSquare, 
  RotateCcw,
  Home,
  Clock,
  Trophy,
  CheckCircle,
  Users,
  ThumbsUp,
  Gift
} from 'lucide-react'
import { toast } from 'sonner'

export default function RandomCallComplete() {
  const navigate = useNavigate()
  const location = useLocation()
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get call data from location state
  const callData = location.state || {
    partner: {
      name: 'Maria González',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      country: 'Spain',
      level: 'Intermediate'
    },
    duration: '12:34',
    language: 'Spanish'
  }

  const handleRating = (value: number) => {
    setRating(value)
  }

  const handleSubmitFeedback = async () => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success('Thank you for your feedback!')
    setIsSubmitting(false)
    navigate('/speaking')
  }

  const handleAddFriend = () => {
    toast.success(`Friend request sent to ${callData.partner.name}!`)
  }

  const handleSendMessage = () => {
    toast.success(`Message sent to ${callData.partner.name}!`)
  }

  const formatDuration = (duration: string) => {
    const [minutes, seconds] = duration.split(':')
    return `${minutes}m ${seconds}s`
  }

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="p-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Call Complete!</h1>
        <p className="text-gray-400">Great conversation practice session</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 space-y-6">
        {/* Call Summary */}
        <Card className="bg-gray-900/60 border-gray-700/50">
          <div className="p-5">
            <h3 className="text-white font-semibold mb-4">Call Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="text-lg font-bold text-white">{formatDuration(callData.duration)}</div>
                <div className="text-xs text-gray-400">Duration</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-lg font-bold text-white">{callData.language}</div>
                <div className="text-xs text-gray-400">Language</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div className="text-lg font-bold text-white">+15</div>
                <div className="text-xs text-gray-400">XP Earned</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Partner Info */}
        <Card className="bg-gray-900/60 border-gray-700/50">
          <div className="p-5">
            <h3 className="text-white font-semibold mb-4">Your Practice Partner</h3>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16 border-2 border-gray-600">
                <AvatarImage src={callData.partner.avatar} />
                <AvatarFallback className="bg-purple-600 text-white text-xl">
                  {callData.partner.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-lg">{callData.partner.name}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400 text-sm">{callData.partner.country}</span>
                  <span className="text-gray-500">•</span>
                  <Badge variant="secondary" className="text-xs bg-gray-700/50 text-gray-300 border-0">
                    {callData.partner.level}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Partner Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleAddFriend}
                className="bg-gray-800/70 hover:bg-gray-700/80 text-white border border-gray-600/50"
                variant="outline"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Friend
              </Button>
              <Button
                onClick={handleSendMessage}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>
          </div>
        </Card>

        {/* Rating */}
        <Card className="bg-gray-900/60 border-gray-700/50">
          <div className="p-5">
            <h3 className="text-white font-semibold mb-4">Rate Your Experience</h3>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`w-12 h-12 rounded-full transition-colors ${
                    star <= rating
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Star className={`h-6 w-6 mx-auto ${star <= rating ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
            
            {/* Feedback */}
            <div className="space-y-3">
              <label className="text-white font-medium text-sm">
                Share your feedback (optional)
              </label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="How was your conversation? Any suggestions for improvement?"
                className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 min-h-[80px]"
                maxLength={500}
              />
              <div className="text-right text-xs text-gray-400">
                {feedback.length}/500
              </div>
            </div>
          </div>
        </Card>

        {/* Achievement */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30">
          <div className="p-5 text-center">
            <Gift className="h-8 w-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Daily Goal Progress</h3>
            <p className="text-purple-300 text-sm mb-3">
              You've completed 2/3 conversations today! 
            </p>
            <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '66%' }}></div>
            </div>
            <p className="text-xs text-gray-400">1 more conversation to unlock a bonus reward!</p>
          </div>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 space-y-3">
        {/* Submit Feedback Button */}
        {rating > 0 && (
          <Button
            onClick={handleSubmitFeedback}
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 font-semibold rounded-xl"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
              <>
                <ThumbsUp className="h-5 w-5 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => navigate('/speaking/random-call')}
            className="bg-gray-800/70 hover:bg-gray-700/80 text-white border border-gray-600/50 h-12 rounded-xl"
            variant="outline"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Call Again
          </Button>
          <Button
            onClick={() => navigate('/speaking')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 rounded-xl"
          >
            <Home className="h-5 w-5 mr-2" />
            Home
          </Button>
        </div>

        {/* Skip Feedback */}
        {rating === 0 && (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/speaking')}
              className="text-gray-400 hover:text-white text-sm"
            >
              Skip for now
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}