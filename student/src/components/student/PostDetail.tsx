import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, MessageCircle, Share, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { toast } from 'sonner'

interface Comment {
  id: string
  user: {
    name: string
    username: string
    avatar: string
  }
  content: string
  time: string
  likes: number
  dislikes: number
  isLiked: boolean
  isDisliked: boolean
  replies?: Reply[]
}

interface Reply {
  id: string
  user: {
    name: string
    username: string
    avatar: string
  }
  content: string
  time: string
  likes: number
  isLiked: boolean
}

const mockPost = {
  id: '1',
  user: {
    name: 'Ethan Carter',
    username: '@EthanCarter',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  content: "I've been using this app for a month now, and I'm amazed at how much my Spanish has improved! The interactive lessons and community features make learning fun and engaging. Highly recommend to anyone looking to learn a new language.",
  likes: 15,
  comments: 23,
  shares: 8,
  isLiked: false
}

const mockComments: Comment[] = [
  {
    id: '1',
    user: {
      name: 'Sophia Clark',
      username: '@SophiaClark',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    content: "That's great to hear! I'm just starting out, any tips for a beginner?",
    time: '2h',
    likes: 5,
    dislikes: 1,
    isLiked: false,
    isDisliked: false,
    replies: [
      {
        id: '1-1',
        user: {
          name: 'Ethan Carter',
          username: '@EthanCarter',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        content: "Focus on the basics first, and don't be afraid to make mistakes. Consistency is key!",
        time: '1h',
        likes: 3,
        isLiked: false
      }
    ]
  }
]

export default function PostDetail() {
  const navigate = useNavigate()
  const { postId } = useParams()
  const [post, setPost] = useState(mockPost)
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const handleLike = () => {
    setPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
    }))
  }

  const handleCommentLike = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isDisliked: comment.isDisliked ? false : comment.isDisliked,
          dislikes: comment.isDisliked ? comment.dislikes - 1 : comment.dislikes
        }
      }
      return comment
    }))
  }

  const handleCommentDislike = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isDisliked: !comment.isDisliked,
          dislikes: comment.isDisliked ? comment.dislikes - 1 : comment.dislikes + 1,
          isLiked: comment.isLiked ? false : comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes
        }
      }
      return comment
    }))
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        username: '@You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
      },
      content: newComment,
      time: 'now',
      likes: 0,
      dislikes: 0,
      isLiked: false,
      isDisliked: false
    }

    setComments([...comments, comment])
    setNewComment('')
    setPost(prev => ({ ...prev, comments: prev.comments + 1 }))
    toast.success('Comment added!')
  }

  const handleAddReply = (commentId: string) => {
    if (!replyText.trim()) return

    const reply: Reply = {
      id: `${commentId}-${Date.now()}`,
      user: {
        name: 'You',
        username: '@You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
      },
      content: replyText,
      time: 'now',
      likes: 0,
      isLiked: false
    }

    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        }
      }
      return comment
    }))

    setReplyText('')
    setReplyingTo(null)
    toast.success('Reply added!')
  }

  const handleShare = () => {
    toast.success('Post shared!')
  }

  return (
    <div className="h-full flex bg-background">
      {/* Desktop: Centered Content */}
      <div className="flex-1 flex flex-col lg:max-w-2xl lg:mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-border lg:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/moments')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Post</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Post */}
          <div className="p-4 border-b border-border lg:px-6">
            {/* User info */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12 lg:h-14 lg:w-14">
                <AvatarImage src={post.user.avatar} />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {post.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">{post.user.name}</h3>
                <p className="text-sm text-muted-foreground">{post.user.username}</p>
              </div>
            </div>

            {/* Content */}
            <p className="text-foreground leading-relaxed mb-4 lg:text-lg">{post.content}</p>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Heart 
                    className={`h-5 w-5 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm">{post.comments}</span>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Share className="h-5 w-5" />
                <span className="text-sm">{post.shares}</span>
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="divide-y divide-border">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 lg:px-6">
                {/* Comment */}
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.user.avatar} />
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      {comment.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">{comment.user.name}</span>
                      <span className="text-sm text-muted-foreground">{comment.time}</span>
                    </div>
                    <p className="text-foreground mb-2">{comment.content}</p>
                  
                    {/* Comment Actions */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleCommentLike(comment.id)}
                        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ThumbsUp 
                          className={`h-4 w-4 ${comment.isLiked ? 'fill-blue-500 text-blue-500' : ''}`} 
                        />
                        <span className="text-sm">{comment.likes}</span>
                      </button>
                      <button
                        onClick={() => handleCommentDislike(comment.id)}
                        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ThumbsDown 
                          className={`h-4 w-4 ${comment.isDisliked ? 'fill-red-500 text-red-500' : ''}`} 
                        />
                        <span className="text-sm">{comment.dislikes}</span>
                      </button>
                      <button
                        onClick={() => setReplyingTo(comment.id)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Reply
                      </button>
                    </div>

                    {/* Reply Input */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 flex gap-2">
                        <Input
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddReply(comment.id)}
                        />
                        <Button 
                          onClick={() => handleAddReply(comment.id)}
                          size="sm"
                          disabled={!replyText.trim()}
                        >
                          Reply
                        </Button>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 pl-4 border-l-2 border-border space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={reply.user.avatar} />
                              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                                {reply.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-foreground text-sm">{reply.user.name}</span>
                                <span className="text-xs text-muted-foreground">{reply.time}</span>
                              </div>
                              <p className="text-foreground text-sm mb-1">{reply.content}</p>
                              <div className="flex items-center gap-2">
                                <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                                  <ThumbsUp className="h-3 w-3" />
                                  <span className="text-xs">{reply.likes}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Comment */}
        <div className="p-4 border-t border-border bg-card lg:px-6">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face" />
              <AvatarFallback className="bg-muted text-muted-foreground">
                Y
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your reply"
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <Button 
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                size="sm"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Right Sidebar - Related Content */}
      <div className="hidden lg:block w-80 border-l border-border bg-card/30 p-6 overflow-y-auto">
        <h3 className="font-semibold text-foreground mb-4">Related Posts</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                    U
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground">User {i}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                This is a related post about language learning that you might find interesting...
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span>12 likes</span>
                <span>3 comments</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}