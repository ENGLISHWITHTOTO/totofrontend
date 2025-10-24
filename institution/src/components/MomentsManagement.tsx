import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Plus,
  Image as ImageIcon,
  Video,
  Globe,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Edit,
  Trash2,
  Send,
  X,
  Upload,
  AlertCircle,
  TrendingUp,
  Eye,
  Sparkles,
  Check
} from 'lucide-react';

const languages = ['All Languages', 'English', 'French', 'Japanese', 'Arabic', 'Spanish', 'German', 'Italian'];

interface Moment {
  id: number;
  content: string;
  language: string;
  mediaType?: 'image' | 'video' | null;
  mediaUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  timestamp: Date;
  isLiked: boolean;
}

export function MomentsManagement() {
  const [moments, setMoments] = useState<Moment[]>([
    {
      id: 1,
      content: "🎉 Exciting news! We're launching our new Advanced English Program next month. Join us for an immersive learning experience with native speakers and cutting-edge teaching methods. Early bird discount available! #LanguageLearning #English",
      language: 'English',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      likes: 124,
      comments: 18,
      shares: 12,
      views: 1543,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isLiked: false
    },
    {
      id: 2,
      content: "Looking back at our incredible Cultural Exchange Week! Students from 15 countries came together to share their traditions, cuisine, and stories. This is what language learning is all about - connecting cultures and building friendships. 🌍❤️",
      language: 'English',
      mediaType: 'video',
      mediaUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800',
      likes: 256,
      comments: 34,
      shares: 28,
      views: 3892,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isLiked: true
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingMoment, setEditingMoment] = useState<Moment | null>(null);
  const [filterLanguage, setFilterLanguage] = useState('All Languages');
  const [newMoment, setNewMoment] = useState({
    content: '',
    language: 'English',
    mediaType: null as 'image' | 'video' | null,
    mediaUrl: ''
  });

  const handleCreateMoment = () => {
    if (!newMoment.content.trim()) return;

    const moment: Moment = {
      id: Date.now(),
      content: newMoment.content,
      language: newMoment.language,
      mediaType: newMoment.mediaType,
      mediaUrl: newMoment.mediaUrl || undefined,
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      timestamp: new Date(),
      isLiked: false
    };

    setMoments([moment, ...moments]);
    setNewMoment({ content: '', language: 'English', mediaType: null, mediaUrl: '' });
    setIsCreating(false);
  };

  const handleEditMoment = () => {
    if (!editingMoment || !editingMoment.content.trim()) return;

    setMoments(moments.map(m => 
      m.id === editingMoment.id ? editingMoment : m
    ));
    setEditingMoment(null);
  };

  const handleDeleteMoment = (id: number) => {
    setMoments(moments.filter(m => m.id !== id));
  };

  const handleLike = (id: number) => {
    setMoments(moments.map(m => 
      m.id === id 
        ? { ...m, isLiked: !m.isLiked, likes: m.isLiked ? m.likes - 1 : m.likes + 1 }
        : m
    ));
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredMoments = filterLanguage === 'All Languages' 
    ? moments 
    : moments.filter(m => m.language === filterLanguage);

  const totalEngagement = moments.reduce((acc, m) => acc + m.likes + m.comments + m.shares, 0);
  const totalViews = moments.reduce((acc, m) => acc + m.views, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-medium">{moments.length}</p>
                <p className="text-xs text-muted-foreground">Total Moments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-blue-500/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-medium">{totalViews.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-green-500/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-medium">{totalEngagement.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Engagement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-medium">
                  {moments.reduce((acc, m) => acc + m.likes, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Likes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create New Moment */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100" />
              <AvatarFallback>EC</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium">EduConnect Language Institute</h3>
              <p className="text-xs text-muted-foreground">Share your latest updates</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Button 
            onClick={() => setIsCreating(true)}
            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Moment
          </Button>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Label className="flex-shrink-0">Filter by Language:</Label>
        <Select value={filterLanguage} onValueChange={setFilterLanguage}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {filterLanguage !== 'All Languages' && (
          <Badge variant="outline" className="bg-primary/10">
            {filteredMoments.length} moments
          </Badge>
        )}
      </div>

      {/* Moments Feed */}
      <div className="space-y-4">
        {filteredMoments.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">No moments yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {filterLanguage === 'All Languages' 
                  ? "Start sharing your institution's story and updates!"
                  : `No moments in ${filterLanguage}. Try a different language filter.`}
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Moment
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredMoments.map((moment) => (
            <Card key={moment.id} className="border-primary/10 hover:border-primary/30 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100" />
                      <AvatarFallback>EC</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">EduConnect Language Institute</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {formatTimestamp(moment.timestamp)}
                        </p>
                        <span className="text-xs text-muted-foreground">•</span>
                        <Badge variant="outline" className="text-xs h-5">
                          <Globe className="w-3 h-3 mr-1" />
                          {moment.language}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingMoment(moment)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Moment
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteMoment(moment.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Moment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Content */}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{moment.content}</p>

                {/* Media */}
                {moment.mediaType === 'image' && moment.mediaUrl && (
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img 
                      src={moment.mediaUrl} 
                      alt="Moment media" 
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  </div>
                )}

                {moment.mediaType === 'video' && moment.mediaUrl && (
                  <div className="rounded-lg overflow-hidden border border-border bg-muted">
                    <div className="aspect-video flex items-center justify-center relative">
                      <img 
                        src={moment.mediaUrl} 
                        alt="Video thumbnail" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="relative z-10 w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                        <Video className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-3">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{moment.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{moment.likes} likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{moment.comments} comments</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="w-4 h-4" />
                    <span>{moment.shares} shares</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t pt-3">
                  <Button
                    variant={moment.isLiked ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleLike(moment.id)}
                    className={`flex-1 ${moment.isLiked ? 'bg-primary/20 text-primary hover:bg-primary/30' : ''}`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${moment.isLiked ? 'fill-current' : ''}`} />
                    {moment.isLiked ? 'Liked' : 'Like'}
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Comment
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Moment Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Moment</DialogTitle>
            <DialogDescription>
              Share updates, news, or inspiring content with your audience
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Language Selection */}
            <div className="space-y-2">
              <Label>Language</Label>
              <Select 
                value={newMoment.language} 
                onValueChange={(value) => setNewMoment({ ...newMoment, language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.filter(l => l !== 'All Languages').map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label>What do you want to share?</Label>
              <Textarea
                value={newMoment.content}
                onChange={(e) => setNewMoment({ ...newMoment, content: e.target.value })}
                placeholder="Share your thoughts, updates, or announcements..."
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {newMoment.content.length} characters
              </p>
            </div>

            {/* Media Type Selection */}
            <div className="space-y-2">
              <Label>Add Media (Optional)</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={newMoment.mediaType === 'image' ? 'default' : 'outline'}
                  onClick={() => setNewMoment({ ...newMoment, mediaType: newMoment.mediaType === 'image' ? null : 'image' })}
                  className="h-auto py-4"
                >
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-sm">Add Image</span>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant={newMoment.mediaType === 'video' ? 'default' : 'outline'}
                  onClick={() => setNewMoment({ ...newMoment, mediaType: newMoment.mediaType === 'video' ? null : 'video' })}
                  className="h-auto py-4"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Video className="w-6 h-6" />
                    <span className="text-sm">Add Video</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Media URL Input */}
            {newMoment.mediaType && (
              <div className="space-y-2">
                <Label>
                  {newMoment.mediaType === 'image' ? 'Image URL' : 'Video URL'}
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newMoment.mediaUrl}
                    onChange={(e) => setNewMoment({ ...newMoment, mediaUrl: e.target.value })}
                    placeholder={`Enter ${newMoment.mediaType} URL or upload...`}
                  />
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            )}

            {/* Preview */}
            {newMoment.mediaType && newMoment.mediaUrl && (
              <div className="rounded-lg overflow-hidden border border-border">
                <img 
                  src={newMoment.mediaUrl} 
                  alt="Preview" 
                  className="w-full h-auto max-h-48 object-cover"
                />
              </div>
            )}

            {!newMoment.content.trim() && (
              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  Please write some content for your moment
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateMoment}
              disabled={!newMoment.content.trim()}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              <Send className="w-4 h-4 mr-2" />
              Post Moment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Moment Dialog */}
      <Dialog open={!!editingMoment} onOpenChange={() => setEditingMoment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Moment</DialogTitle>
            <DialogDescription>
              Update your moment content or settings
            </DialogDescription>
          </DialogHeader>

          {editingMoment && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select 
                  value={editingMoment.language} 
                  onValueChange={(value) => setEditingMoment({ ...editingMoment, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.filter(l => l !== 'All Languages').map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={editingMoment.content}
                  onChange={(e) => setEditingMoment({ ...editingMoment, content: e.target.value })}
                  rows={6}
                  className="resize-none"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMoment(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditMoment}
              disabled={!editingMoment?.content.trim()}
            >
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
