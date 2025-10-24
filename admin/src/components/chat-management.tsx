import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  UserCheck,
  UserX,
  Info,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Image,
  Download,
  Copy,
  Flag,
  Shield,
  Ban,
  User,
  GraduationCap,
  Building,
  Home as HomeIcon,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign
} from "lucide-react";
import { UserRole, hasPermission } from "../utils/permissions";

interface Message {
  id: string;
  senderId: string;
  senderType: "admin" | "user";
  content: string;
  timestamp: Date;
  type: "text" | "image" | "file";
  fileUrl?: string;
  fileName?: string;
  edited?: boolean;
  status: "sent" | "delivered" | "read";
}

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userRole: "Student" | "Teacher" | "Institution" | "Homestay";
  userAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: "Open" | "Pending" | "Resolved";
  isOnline: boolean;
  assignedTo?: string;
  tags: string[];
  priority: "Low" | "Medium" | "High" | "Urgent";
}

interface UserDetails {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "Student" | "Teacher" | "Institution" | "Homestay";
  verificationStatus: "Verified" | "Pending" | "Rejected" | "Incomplete";
  joinDate: Date;
  lastActive: Date;
  location?: string;
  linkedCourses: number;
  linkedPrograms: number;
  totalSpent: number;
  flags: Array<{
    type: "warning" | "violation" | "review";
    message: string;
    date: Date;
  }>;
  profileImage: string;
}

interface CannedReply {
  id: string;
  title: string;
  content: string;
  category: "greeting" | "support" | "verification" | "payment" | "general";
  tags: string[];
}

interface ChatManagementProps {
  userRole: UserRole;
}

export function ChatManagement({ userRole }: ChatManagementProps) {
  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      userId: "user1",
      userName: "Sarah Johnson",
      userRole: "Teacher",
      userAvatar: "/api/placeholder/40/40",
      lastMessage: "Hi, I need help with course approval process",
      lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
      unreadCount: 3,
      status: "Open",
      isOnline: true,
      tags: ["course-approval"],
      priority: "Medium"
    },
    {
      id: "2",
      userId: "user2",
      userName: "Global Language Institute",
      userRole: "Institution",
      userAvatar: "/api/placeholder/40/40",
      lastMessage: "Payment verification documents attached",
      lastMessageTime: new Date(Date.now() - 45 * 60 * 1000),
      unreadCount: 1,
      status: "Pending",
      isOnline: false,
      assignedTo: "moderator1",
      tags: ["payment", "verification"],
      priority: "High"
    },
    {
      id: "3",
      userId: "user3",
      userName: "Maria Rodriguez",
      userRole: "Homestay",
      userAvatar: "/api/placeholder/40/40",
      lastMessage: "Thank you for the quick response!",
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
      status: "Resolved",
      isOnline: true,
      tags: ["resolved"],
      priority: "Low"
    },
    {
      id: "4",
      userId: "user4",
      userName: "Alex Chen",
      userRole: "Student",
      userAvatar: "/api/placeholder/40/40",
      lastMessage: "I'm having trouble accessing my purchased course",
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 2,
      status: "Open",
      isOnline: true,
      tags: ["course-access", "technical"],
      priority: "Medium"
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg1",
      senderId: "user1",
      senderType: "user",
      content: "Hi, I need help with course approval process",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: "text",
      status: "read"
    },
    {
      id: "msg2",
      senderId: "admin1",
      senderType: "admin",
      content: "Hello Sarah! I'd be happy to help you with the course approval process. Could you please tell me which specific step you're having trouble with?",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: "text",
      status: "read"
    },
    {
      id: "msg3",
      senderId: "user1",
      senderType: "user",
      content: "I've submitted my course materials but haven't heard back in 3 days. Is there anything missing?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: "text",
      status: "read"
    }
  ]);

  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedCannedReply, setSelectedCannedReply] = useState<CannedReply | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const cannedReplies: CannedReply[] = [
    {
      id: "cr1",
      title: "Welcome Message",
      content: "Hello! Thank you for contacting us. How can I assist you today?",
      category: "greeting",
      tags: ["welcome", "greeting"]
    },
    {
      id: "cr2",
      title: "Course Approval Status",
      content: "I've checked your course submission. It's currently under review by our content team. You should receive an update within 24-48 hours.",
      category: "support",
      tags: ["course", "approval", "status"]
    },
    {
      id: "cr3",
      title: "Verification Documents Required",
      content: "To complete your verification, please provide the following documents: [list documents]. You can upload them through your profile settings.",
      category: "verification",
      tags: ["verification", "documents"]
    },
    {
      id: "cr4",
      title: "Payment Processing",
      content: "Your payment is being processed. It typically takes 2-5 business days to complete. You'll receive a confirmation email once it's done.",
      category: "payment",
      tags: ["payment", "processing"]
    }
  ];

  const userDetails: UserDetails = {
    id: "user1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    role: "Teacher",
    verificationStatus: "Verified",
    joinDate: new Date("2023-08-15"),
    lastActive: new Date(Date.now() - 5 * 60 * 1000),
    location: "San Francisco, CA",
    linkedCourses: 3,
    linkedPrograms: 1,
    totalSpent: 1250.00,
    flags: [
      {
        type: "review",
        message: "Course content requires minor updates",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ],
    profileImage: "/api/placeholder/60/60"
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `msg${Date.now()}`,
      senderId: "admin1",
      senderType: "admin",
      content: messageInput,
      timestamp: new Date(),
      type: "text",
      status: "sent"
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput("");

    // Update conversation last message
    setSelectedConversation(prev => prev ? {
      ...prev,
      lastMessage: messageInput,
      lastMessageTime: new Date()
    } : null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const insertCannedReply = (reply: CannedReply) => {
    setMessageInput(prev => prev + (prev ? "\n\n" : "") + reply.content);
    setSelectedCannedReply(null);
  };

  const markAsResolved = () => {
    if (!selectedConversation) return;
    setSelectedConversation(prev => prev ? { ...prev, status: "Resolved" } : null);
  };

  const assignToModerator = () => {
    if (!selectedConversation) return;
    setSelectedConversation(prev => prev ? { ...prev, assignedTo: "moderator1", status: "Pending" } : null);
  };

  const blockUser = () => {
    if (!selectedConversation) return;
    // In real app, this would block the user
    console.log("Blocking user:", selectedConversation.userId);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "All" || conv.userRole === filterRole;
    const matchesStatus = filterStatus === "All" || 
                         (filterStatus === "Unread" && conv.unreadCount > 0) ||
                         conv.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Teacher": return <GraduationCap className="w-4 h-4" />;
      case "Institution": return <Building className="w-4 h-4" />;
      case "Homestay": return <HomeIcon className="w-4 h-4" />;
      case "Student": return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Resolved": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-blue-100 text-blue-800";
      case "Low": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const canModerate = hasPermission(userRole, "chat", "M");
  const canUpdate = hasPermission(userRole, "chat", "U");
  const canDelete = hasPermission(userRole, "chat", "D");

  return (
    <div className="flex h-full bg-background">
      {/* Conversation List - Left Panel */}
      <div className="w-96 border-r bg-card flex flex-col">
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chat</h2>
            <Badge variant="secondary">{filteredConversations.length} conversations</Badge>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-2">
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Roles</SelectItem>
                <SelectItem value="Teacher">Teachers</SelectItem>
                <SelectItem value="Institution">Institutions</SelectItem>
                <SelectItem value="Homestay">Homestays</SelectItem>
                <SelectItem value="Student">Students</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Unread">Unread</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conversation List */}
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                  selectedConversation?.id === conversation.id ? "bg-accent" : ""
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={conversation.userAvatar} />
                      <AvatarFallback>{conversation.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium truncate">{conversation.userName}</h4>
                        <Badge variant="outline" className="flex items-center space-x-1 text-xs">
                          {getRoleIcon(conversation.userRole)}
                          <span>{conversation.userRole}</span>
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {conversation.lastMessage}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex space-x-1">
                        <Badge className={`text-xs ${getStatusColor(conversation.status)}`}>
                          {conversation.status}
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(conversation.priority)}`}>
                          {conversation.priority}
                        </Badge>
                      </div>
                      
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Window - Right Panel */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedConversation.userAvatar} />
                      <AvatarFallback>{selectedConversation.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {selectedConversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{selectedConversation.userName}</h3>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        {getRoleIcon(selectedConversation.userRole)}
                        <span>{selectedConversation.userRole}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.isOnline ? "Online" : `Last seen ${formatTime(selectedConversation.lastMessageTime)}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Action Buttons */}
                  {canUpdate && (
                    <Button variant="outline" size="sm" onClick={markAsResolved}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Resolved
                    </Button>
                  )}

                  {canModerate && (
                    <Button variant="outline" size="sm" onClick={assignToModerator}>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Assign to Moderator
                    </Button>
                  )}

                  {canModerate && (
                    <Button variant="outline" size="sm" onClick={blockUser}>
                      <Ban className="w-4 h-4 mr-2" />
                      Block User
                    </Button>
                  )}

                  {/* User Details Toggle */}
                  <Sheet open={showUserDetails} onOpenChange={setShowUserDetails}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Info className="w-4 h-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-96">
                      <SheetHeader>
                        <SheetTitle>User Details</SheetTitle>
                        <SheetDescription>
                          Complete profile information and history
                        </SheetDescription>
                      </SheetHeader>
                      
                      <div className="mt-6 space-y-6">
                        {/* Profile Section */}
                        <div className="text-center">
                          <Avatar className="w-20 h-20 mx-auto mb-4">
                            <AvatarImage src={userDetails.profileImage} />
                            <AvatarFallback className="text-lg">{userDetails.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <h3 className="font-semibold">{userDetails.name}</h3>
                          <Badge className={`mt-2 ${userDetails.verificationStatus === "Verified" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                            {userDetails.verificationStatus}
                          </Badge>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-3">
                          <h4 className="font-medium">Contact Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <span>{userDetails.email}</span>
                            </div>
                            {userDetails.phone && (
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{userDetails.phone}</span>
                              </div>
                            )}
                            {userDetails.location && (
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{userDetails.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Account Stats */}
                        <div className="space-y-3">
                          <h4 className="font-medium">Account Statistics</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>Joined</span>
                              </div>
                              <p className="text-muted-foreground">{userDetails.joinDate.toLocaleDateString()}</p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>Last Active</span>
                              </div>
                              <p className="text-muted-foreground">{formatTime(userDetails.lastActive)}</p>
                            </div>
                            <div className="space-y-1">
                              <span>Linked Courses</span>
                              <p className="text-muted-foreground">{userDetails.linkedCourses}</p>
                            </div>
                            <div className="space-y-1">
                              <span>Programs</span>
                              <p className="text-muted-foreground">{userDetails.linkedPrograms}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <div className="flex items-center space-x-2">
                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                                <span>Total Spent</span>
                              </div>
                              <p className="text-muted-foreground">${userDetails.totalSpent.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Flags */}
                        {userDetails.flags.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-medium">Flags & Notices</h4>
                            <div className="space-y-2">
                              {userDetails.flags.map((flag, index) => (
                                <div key={index} className="p-2 rounded-lg bg-yellow-50 border border-yellow-200">
                                  <div className="flex items-start space-x-2">
                                    <Flag className="w-4 h-4 text-yellow-600 mt-0.5" />
                                    <div className="flex-1">
                                      <p className="text-sm">{flag.message}</p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {flag.date.toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderType === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderType === "admin" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs ${
                          message.senderType === "admin" 
                            ? "text-primary-foreground/70" 
                            : "text-muted-foreground"
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.senderType === "admin" && (
                          <div className="flex items-center space-x-1">
                            {message.status === "read" && (
                              <CheckCircle className="w-3 h-3 text-primary-foreground/70" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input Area */}
            <div className="p-4 border-t bg-card">
              <div className="flex items-end space-x-2">
                {/* Canned Replies */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-3">
                      <h4 className="font-medium">Canned Replies</h4>
                      <div className="space-y-2">
                        {cannedReplies.map((reply) => (
                          <div
                            key={reply.id}
                            className="p-2 rounded-lg border cursor-pointer hover:bg-accent"
                            onClick={() => insertCannedReply(reply)}
                          >
                            <h5 className="font-medium text-sm">{reply.title}</h5>
                            <p className="text-xs text-muted-foreground truncate">
                              {reply.content}
                            </p>
                            <div className="flex space-x-1 mt-1">
                              {reply.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Attachment Button */}
                <Button variant="outline" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>

                {/* Message Input */}
                <div className="flex-1 relative">
                  <Textarea
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="resize-none min-h-[40px] max-h-32"
                    rows={1}
                  />
                </div>

                {/* Emoji Button */}
                <Button variant="outline" size="sm">
                  <Smile className="w-4 h-4" />
                </Button>

                {/* Send Button */}
                <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="font-medium">Select a conversation</h3>
              <p className="text-sm text-muted-foreground">
                Choose a conversation from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}