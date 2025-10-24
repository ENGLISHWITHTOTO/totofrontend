import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Send, Plus, MessageSquare, Users, Bell, Pin } from 'lucide-react';

const mockConversations = [
  {
    id: 1,
    participant: {
      name: 'Maria Garcia',
      role: 'student',
      photo: null,
      status: 'online'
    },
    lastMessage: {
      text: 'Thank you for the information about the program schedule!',
      timestamp: '2025-09-23 14:30',
      sender: 'student'
    },
    unread: 0,
    pinned: false
  },
  {
    id: 2,
    participant: {
      name: 'John Smith',
      role: 'student',
      photo: null,
      status: 'offline'
    },
    lastMessage: {
      text: 'Could you please help me with the accommodation booking?',
      timestamp: '2025-09-23 10:15',
      sender: 'student'
    },
    unread: 2,
    pinned: true
  },
  {
    id: 3,
    participant: {
      name: 'Support Team',
      role: 'admin',
      photo: null,
      status: 'online'
    },
    lastMessage: {
      text: 'New student application requires your attention',
      timestamp: '2025-09-23 09:45',
      sender: 'admin'
    },
    unread: 1,
    pinned: false
  },
  {
    id: 4,
    participant: {
      name: 'Yuki Tanaka',
      role: 'student',
      photo: null,
      status: 'online'
    },
    lastMessage: {
      text: 'The program materials are very helpful. Thank you!',
      timestamp: '2025-09-22 16:20',
      sender: 'student'
    },
    unread: 0,
    pinned: false
  }
];

const mockMessages = [
  {
    id: 1,
    conversationId: 1,
    sender: 'student',
    text: 'Hello, I have a question about the program schedule.',
    timestamp: '2025-09-23 14:25',
    read: true
  },
  {
    id: 2,
    conversationId: 1,
    sender: 'institution',
    text: 'Hi Maria! I\'d be happy to help you with that. What specifically would you like to know about the schedule?',
    timestamp: '2025-09-23 14:28',
    read: true
  },
  {
    id: 3,
    conversationId: 1,
    sender: 'student',
    text: 'Thank you for the information about the program schedule!',
    timestamp: '2025-09-23 14:30',
    read: true
  }
];

const mockAnnouncements = [
  {
    id: 1,
    title: 'Holiday Notice - October Break',
    content: 'Please note that classes will be suspended from October 9-13 for the autumn break. Regular classes will resume on October 16.',
    date: '2025-09-20',
    priority: 'high',
    recipients: 'all'
  },
  {
    id: 2,
    title: 'New Library Hours',
    content: 'Starting October 1st, the library will be open from 8:00 AM to 8:00 PM, Monday through Friday.',
    date: '2025-09-18',
    priority: 'medium',
    recipients: 'students'
  },
  {
    id: 3,
    title: 'Orientation Session for New Students',
    content: 'Welcome orientation for new students will be held on September 30th at 10:00 AM in the main auditorium.',
    date: '2025-09-15',
    priority: 'low',
    recipients: 'new_students'
  }
];

export function MessagingCenter() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewAnnouncementOpen, setIsNewAnnouncementOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium',
    recipients: 'all'
  });

  const filteredConversations = mockConversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const conversationMessages = mockMessages.filter(msg => 
    msg.conversationId === selectedConversation?.id
  );

  const sendMessage = () => {
    if (messageText.trim()) {
      // Add message logic here
      setMessageText('');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const AnnouncementForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          value={newAnnouncement.title}
          onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
          placeholder="Announcement title"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Content</label>
        <Textarea
          value={newAnnouncement.content}
          onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
          placeholder="Type your announcement here..."
          rows={4}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Priority</label>
          <Select value={newAnnouncement.priority} onValueChange={(value) => setNewAnnouncement({...newAnnouncement, priority: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Recipients</label>
          <Select value={newAnnouncement.recipients} onValueChange={(value) => setNewAnnouncement({...newAnnouncement, recipients: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="students">Students Only</SelectItem>
              <SelectItem value="teachers">Teachers Only</SelectItem>
              <SelectItem value="new_students">New Students</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={() => setIsNewAnnouncementOpen(false)}>
          Publish Announcement
        </Button>
        <Button variant="outline" onClick={() => setIsNewAnnouncementOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Messaging Center</h2>
          <p className="text-sm text-muted-foreground">Communicate with students and manage announcements</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMessages.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockConversations.reduce((acc, conv) => acc + conv.unread, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockConversations.filter(conv => conv.participant.status === 'online').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Announcements</CardTitle>
            <Pin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnnouncements.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList>
          <TabsTrigger value="messages">Direct Messages</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="support">Support Channel</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Conversations List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm">Conversations</CardTitle>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[450px] overflow-y-auto">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={conversation.participant.photo || undefined} />
                            <AvatarFallback>
                              {conversation.participant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            conversation.participant.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-sm truncate">{conversation.participant.name}</p>
                            {conversation.pinned && <Pin className="w-3 h-3 text-blue-500" />}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.lastMessage.text}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(conversation.lastMessage.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        {conversation.unread > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat Window */}
            <Card className="lg:col-span-2">
              {selectedConversation ? (
                <>
                  <CardHeader className="border-b">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={selectedConversation.participant.photo || undefined} />
                        <AvatarFallback>
                          {selectedConversation.participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{selectedConversation.participant.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {selectedConversation.participant.status} • {selectedConversation.participant.role}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[350px] overflow-y-auto p-4 space-y-4">
                      {conversationMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'institution' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-3 py-2 rounded-lg ${
                              message.sender === 'institution'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender === 'institution' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t p-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Type your message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={sendMessage}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Select a conversation to start messaging</p>
                </CardContent>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3>Recent Announcements</h3>
            <Dialog open={isNewAnnouncementOpen} onOpenChange={setIsNewAnnouncementOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                  <DialogDescription>
                    Create a new announcement to share important information with students and staff.
                  </DialogDescription>
                </DialogHeader>
                <AnnouncementForm />
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {mockAnnouncements.map((announcement) => (
              <Card key={announcement.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{announcement.title}</h4>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {announcement.recipients.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                  <p className="text-xs text-muted-foreground">
                    Published: {new Date(announcement.date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Contact our support team for technical issues, account management, or platform questions.
                </p>
                <div className="flex gap-4">
                  <Button>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Start Support Chat
                  </Button>
                  <Button variant="outline">
                    View Help Center
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}