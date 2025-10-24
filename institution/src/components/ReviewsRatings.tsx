import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Star, MessageSquare, ThumbsUp, Flag, TrendingUp } from 'lucide-react';

const mockReviews = [
  {
    id: 1,
    student: {
      name: 'Maria Garcia',
      nationality: 'Spain',
      photo: null
    },
    program: 'English Intensive Course',
    teacher: 'Sarah Johnson',
    rating: 5,
    date: '2025-09-15',
    comment: 'Excellent program! The teachers are very professional and the curriculum is well-structured. I improved my English significantly in just 3 months.',
    helpful: 12,
    replied: false
  },
  {
    id: 2,
    student: {
      name: 'John Smith',
      nationality: 'USA',
      photo: null
    },
    program: 'French Beginners',
    teacher: 'Pierre Dubois',
    rating: 4,
    date: '2025-09-10',
    comment: 'Great introduction to French language. Pierre is an amazing teacher who makes learning fun and engaging. The only downside was the limited practice time.',
    helpful: 8,
    replied: true
  },
  {
    id: 3,
    student: {
      name: 'Yuki Tanaka',
      nationality: 'Japan',
      photo: null
    },
    program: 'English Intensive Course',
    teacher: 'Sarah Johnson',
    rating: 5,
    date: '2025-09-08',
    comment: 'Outstanding experience! The small class sizes allowed for personalized attention. The cultural activities were also very helpful for language immersion.',
    helpful: 15,
    replied: false
  },
  {
    id: 4,
    student: {
      name: 'Ahmed Hassan',
      nationality: 'Egypt',
      photo: null
    },
    program: 'French Beginners',
    teacher: 'Pierre Dubois',
    rating: 3,
    date: '2025-09-05',
    comment: 'The program was okay, but I expected more conversation practice. The materials were good but the pace was sometimes too fast for beginners.',
    helpful: 3,
    replied: true
  },
  {
    id: 5,
    student: {
      name: 'Sophie Laurent',
      nationality: 'France',
      photo: null
    },
    program: 'Japanese Business Language',
    teacher: 'Takeshi Yamamoto',
    rating: 5,
    date: '2025-09-02',
    comment: 'Perfect for business professionals! Takeshi has excellent knowledge of business Japanese and real-world applications. Highly recommended!',
    helpful: 9,
    replied: false
  }
];

const mockTeacherRatings = [
  {
    teacher: 'Sarah Johnson',
    program: 'English Intensive',
    rating: 4.8,
    reviews: 45,
    students: 156
  },
  {
    teacher: 'Pierre Dubois',
    program: 'French Programs',
    rating: 4.6,
    reviews: 32,
    students: 98
  },
  {
    teacher: 'Takeshi Yamamoto',
    program: 'Japanese Business',
    rating: 4.9,
    reviews: 28,
    students: 87
  }
];

export function ReviewsRatings() {
  const [reviews, setReviews] = useState(mockReviews);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterProgram, setFilterProgram] = useState('all');

  const filteredReviews = reviews.filter(review => {
    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating;
    const matchesProgram = filterProgram === 'all' || review.program === filterProgram;
    return matchesRating && matchesProgram;
  });

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / totalReviews) * 100
  }));

  const handleReply = (reviewId: number) => {
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, replied: true } : review
    ));
    setReplyText('');
    setSelectedReview(null);
  };

  const ReplyDialog = ({ review }: any) => (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
          <span className="text-sm text-muted-foreground">by {review.student.name}</span>
        </div>
        <p className="text-sm">{review.comment}</p>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Your Reply</label>
        <Textarea
          placeholder="Thank you for your feedback..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          rows={4}
        />
      </div>
      
      <div className="flex gap-2">
        <Button onClick={() => handleReply(review.id)}>Send Reply</Button>
        <Button variant="outline" onClick={() => setSelectedReview(null)}>Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Reviews & Ratings</h2>
          <p className="text-sm text-muted-foreground">Monitor student feedback and manage responses</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Replied</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews.filter(r => r.replied).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((reviews.filter(r => r.replied).length / totalReviews) * 100)}% response rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews.filter(r => new Date(r.date).getMonth() === new Date().getMonth()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ratingDistribution.map((dist) => (
              <div key={dist.rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm">{dist.rating}</span>
                  <Star className="w-3 h-3 text-yellow-400" />
                </div>
                <Progress value={dist.percentage} className="flex-1 h-2" />
                <span className="text-sm text-muted-foreground w-8">{dist.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Teacher Ratings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Teacher Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTeacherRatings.map((teacher, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {teacher.teacher.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{teacher.teacher}</p>
                      <p className="text-sm text-muted-foreground">{teacher.program}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{teacher.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {teacher.reviews} reviews • {teacher.students} students
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Reviews */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Student Reviews</CardTitle>
            <div className="flex gap-2">
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ratings</SelectItem>
                  <SelectItem value="5">5 stars</SelectItem>
                  <SelectItem value="4">4 stars</SelectItem>
                  <SelectItem value="3">3 stars</SelectItem>
                  <SelectItem value="2">2 stars</SelectItem>
                  <SelectItem value="1">1 star</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterProgram} onValueChange={setFilterProgram}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All programs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All programs</SelectItem>
                  <SelectItem value="English Intensive Course">English Intensive</SelectItem>
                  <SelectItem value="French Beginners">French Beginners</SelectItem>
                  <SelectItem value="Japanese Business Language">Japanese Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={review.student.photo || undefined} />
                      <AvatarFallback>
                        {review.student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.student.name}</p>
                      <p className="text-sm text-muted-foreground">{review.student.nationality}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium">{review.program}</p>
                  <p className="text-xs text-muted-foreground">Teacher: {review.teacher}</p>
                </div>
                
                <p className="text-sm mb-3">{review.comment}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-muted-foreground">
                      {review.helpful} people found this helpful
                    </span>
                    {review.replied && (
                      <Badge variant="secondary" className="text-xs">Replied</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!review.replied && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedReview(review)}>
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Reply
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reply to Review</DialogTitle>
                            <DialogDescription>
                              Respond to the student's review to show you value their feedback.
                            </DialogDescription>
                          </DialogHeader>
                          {selectedReview && <ReplyDialog review={selectedReview} />}
                        </DialogContent>
                      </Dialog>
                    )}
                    <Button variant="ghost" size="sm">
                      <Flag className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}