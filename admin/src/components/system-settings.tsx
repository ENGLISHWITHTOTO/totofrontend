import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { 
  Settings, 
  Shield, 
  Bell, 
  Database, 
  Globe, 
  Mail,
  Save,
  RefreshCw,
  Download,
  Upload,
  Key,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface SystemSettingsProps {
  userRole: string;
}

export function SystemSettings({ userRole }: SystemSettingsProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const adminUsers = [
    {
      id: 1,
      name: "John Admin",
      email: "john@platform.com",
      role: "Super Admin",
      lastLogin: "2024-03-18",
      status: "active"
    },
    {
      id: 2,
      name: "Sarah Moderator",
      email: "sarah.mod@platform.com",
      role: "Content Moderator",
      lastLogin: "2024-03-17",
      status: "active"
    },
    {
      id: 3,
      name: "Mike Support",
      email: "mike.support@platform.com",
      role: "Support Manager",
      lastLogin: "2024-03-16",
      status: "active"
    }
  ];

  const systemHealth = [
    {
      component: "Database",
      status: "healthy",
      uptime: "99.9%",
      lastCheck: "2 min ago",
      details: "All database connections stable"
    },
    {
      component: "API Gateway",
      status: "healthy",
      uptime: "99.8%",
      lastCheck: "1 min ago",
      details: "Response times normal"
    },
    {
      component: "AI Services",
      status: "warning",
      uptime: "98.5%",
      lastCheck: "30 sec ago",
      details: "Slightly elevated response times"
    },
    {
      component: "Email Service",
      status: "healthy",
      uptime: "99.7%",
      lastCheck: "1 min ago",
      details: "Email queue processing normally"
    },
    {
      component: "File Storage",
      status: "healthy",
      uptime: "100%",
      lastCheck: "45 sec ago",
      details: "Storage usage at 67%"
    }
  ];

  const auditLogs = [
    {
      id: 1,
      user: "john@platform.com",
      action: "Updated subscription plan pricing",
      timestamp: "2024-03-18 14:23:45",
      details: "Modified Premium plan price from $19.99 to $24.99",
      ipAddress: "192.168.1.100"
    },
    {
      id: 2,
      user: "sarah.mod@platform.com",
      action: "Approved marketplace course",
      timestamp: "2024-03-18 13:15:22",
      details: "Approved 'Advanced Spanish Grammar' course",
      ipAddress: "192.168.1.101"
    },
    {
      id: 3,
      user: "john@platform.com",
      action: "Created new admin user",
      timestamp: "2024-03-18 11:45:18",
      details: "Added new Content Moderator role",
      ipAddress: "192.168.1.100"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-100 text-green-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy": return <CheckCircle className="w-4 h-4" />;
      case "warning": return <AlertTriangle className="w-4 h-4" />;
      case "error": return <AlertTriangle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground">
          Configure platform settings, security, and system administration
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="admin-users">Admin Users</TabsTrigger>
          <TabsTrigger value="system-health">System Health</TabsTrigger>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Platform Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input id="platform-name" defaultValue="LearningPlatform" />
                </div>
                
                <div>
                  <Label htmlFor="platform-url">Platform URL</Label>
                  <Input id="platform-url" defaultValue="https://learning.platform.com" />
                </div>
                
                <div>
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input id="support-email" defaultValue="support@platform.com" />
                </div>
                
                <div>
                  <Label htmlFor="default-timezone">Default Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                      <SelectItem value="gmt">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable to show maintenance page to users
                    </p>
                  </div>
                  <Switch 
                    checked={maintenanceMode} 
                    onCheckedChange={setMaintenanceMode}
                  />
                </div>
                
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Feature Toggles */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Toggles</CardTitle>
                <CardDescription>Enable or disable platform features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>User Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new user sign-ups</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketplace</Label>
                    <p className="text-sm text-muted-foreground">Enable teacher marketplace</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Voice Rooms</Label>
                    <p className="text-sm text-muted-foreground">Enable voice chat rooms</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI Features</Label>
                    <p className="text-sm text-muted-foreground">Enable AI-powered features</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Credit System</Label>
                    <p className="text-sm text-muted-foreground">Enable credit purchases</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Update Features
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Localization Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Localization Settings</CardTitle>
              <CardDescription>Configure supported languages and regions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="default-language">Default Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="default-currency">Default Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="cad">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="mdy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Authentication Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Authentication Settings</CardTitle>
                <CardDescription>Configure login and security policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div>
                  <Label htmlFor="password-min-length">Minimum Password Length</Label>
                  <Input id="password-min-length" type="number" defaultValue="8" />
                </div>
                
                <div>
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue="60" />
                </div>
                
                <div>
                  <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                  <Input id="max-login-attempts" type="number" defaultValue="5" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Whitelist for Admin</Label>
                    <p className="text-sm text-muted-foreground">Restrict admin access by IP</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Data Protection */}
            <Card>
              <CardHeader>
                <CardTitle>Data Protection</CardTitle>
                <CardDescription>Privacy and data handling settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>GDPR Compliance Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable GDPR features</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div>
                  <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                  <Input id="data-retention" type="number" defaultValue="365" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-Delete Inactive Accounts</Label>
                    <p className="text-sm text-muted-foreground">Delete accounts after 2 years</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Anonymize User Data</Label>
                    <p className="text-sm text-muted-foreground">Anonymize data on deletion</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Export User Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Backup Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Backup & Recovery</CardTitle>
              <CardDescription>Configure automated backups and data recovery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="backup-retention">Backup Retention (days)</Label>
                  <Input id="backup-retention" type="number" defaultValue="30" />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Create Backup Now
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Restore from Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>Configure email service settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Service Enabled</Label>
                    <p className="text-sm text-muted-foreground">Enable email notifications</p>
                  </div>
                  <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
                </div>
                
                <div>
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input id="smtp-host" defaultValue="smtp.platform.com" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input id="smtp-port" defaultValue="587" />
                  </div>
                  <div>
                    <Label htmlFor="smtp-security">Security</Label>
                    <Select defaultValue="tls">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="smtp-username">SMTP Username</Label>
                  <Input id="smtp-username" defaultValue="noreply@platform.com" />
                </div>
                
                <div>
                  <Label htmlFor="smtp-password">SMTP Password</Label>
                  <div className="relative">
                    <Input 
                      id="smtp-password" 
                      type={showApiKey ? "text" : "password"}
                      defaultValue="••••••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button>
                  <Mail className="w-4 h-4 mr-2" />
                  Test Email Configuration
                </Button>
              </CardContent>
            </Card>

            {/* Payment Integration */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Integration</CardTitle>
                <CardDescription>Configure payment processing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="stripe-public-key">Stripe Publishable Key</Label>
                  <Input id="stripe-public-key" defaultValue="pk_test_••••••••••••" />
                </div>
                
                <div>
                  <Label htmlFor="stripe-secret-key">Stripe Secret Key</Label>
                  <div className="relative">
                    <Input 
                      id="stripe-secret-key" 
                      type={showApiKey ? "text" : "password"}
                      defaultValue="sk_test_••••••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="webhook-endpoint">Webhook Endpoint</Label>
                  <Input id="webhook-endpoint" defaultValue="https://platform.com/webhooks/stripe" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Test Mode</Label>
                    <p className="text-sm text-muted-foreground">Use Stripe test environment</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>External API Configuration</CardTitle>
              <CardDescription>Configure third-party service integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">OpenAI Configuration</h4>
                  <div>
                    <Label htmlFor="openai-api-key">API Key</Label>
                    <div className="relative">
                      <Input 
                        id="openai-api-key" 
                        type={showApiKey ? "text" : "password"}
                        defaultValue="sk-••••••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="openai-model">Default Model</Label>
                    <Select defaultValue="gpt-4">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Analytics Configuration</h4>
                  <div>
                    <Label htmlFor="analytics-id">Google Analytics ID</Label>
                    <Input id="analytics-id" defaultValue="GA-••••••••••" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Tracking</Label>
                      <p className="text-sm text-muted-foreground">Track user analytics</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin-users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>Manage administrative user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                  <Button>Add Admin User</Button>
                  <Button variant="outline">Manage Roles</Button>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-600">Remove</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-health" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Components</CardTitle>
                <CardDescription>Real-time status of platform components</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemHealth.map((component, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        component.status === 'healthy' ? 'bg-green-500' :
                        component.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <h4 className="font-medium">{component.component}</h4>
                        <p className="text-sm text-muted-foreground">{component.details}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(component.status)}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(component.status)}
                          <span>{component.status}</span>
                        </span>
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {component.uptime} uptime
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Resources */}
            <Card>
              <CardHeader>
                <CardTitle>System Resources</CardTitle>
                <CardDescription>Current resource usage and limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span className="font-medium">84%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Disk Usage</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Network I/O</span>
                    <span className="font-medium">32%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Status
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit-logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>Track administrative actions and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="user">User Management</SelectItem>
                      <SelectItem value="content">Content Changes</SelectItem>
                      <SelectItem value="system">System Settings</SelectItem>
                      <SelectItem value="security">Security Events</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Logs
                  </Button>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm truncate">{log.details}</p>
                      </TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.ipAddress}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}