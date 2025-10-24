import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { 
  Shield, 
  Clock, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  Smartphone,
  MapPin,
  Eye,
  EyeOff
} from "lucide-react";
import { UserRole, SESSION_SECURITY } from "../utils/permissions";

interface SessionSecurityProps {
  userRole: UserRole;
  onSessionExpired: () => void;
}

interface SessionInfo {
  id: string;
  startTime: Date;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
  location: string;
  trustedDevice: boolean;
  twoFactorVerified: boolean;
}

export function SessionSecurity({ userRole, onSessionExpired }: SessionSecurityProps) {
  const [currentSession, setCurrentSession] = useState<SessionInfo>({
    id: "sess_" + Math.random().toString(36).substr(2, 9),
    startTime: new Date(),
    lastActivity: new Date(),
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    location: "San Francisco, CA",
    trustedDevice: true,
    twoFactorVerified: true
  });

  const [showSecurityDialog, setShowSecurityDialog] = useState(false);
  const [autoLockWarning, setAutoLockWarning] = useState(false);
  const [timeUntilLock, setTimeUntilLock] = useState(0);
  const [sessionExpired, setSessionExpired] = useState(false);

  const securitySettings = SESSION_SECURITY[userRole];

  // Auto-lock timer
  useEffect(() => {
    const checkAutoLock = () => {
      const now = new Date();
      const lastActivity = currentSession.lastActivity;
      const timeSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60); // minutes
      
      const autoLockMinutes = securitySettings.autoLockMinutes;
      const warningMinutes = Math.max(1, autoLockMinutes - 5); // Show warning 5 minutes before
      
      if (timeSinceActivity >= autoLockMinutes) {
        setSessionExpired(true);
        onSessionExpired();
      } else if (timeSinceActivity >= warningMinutes) {
        setAutoLockWarning(true);
        setTimeUntilLock(autoLockMinutes - timeSinceActivity);
      } else {
        setAutoLockWarning(false);
      }
    };

    const interval = setInterval(checkAutoLock, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [currentSession.lastActivity, securitySettings.autoLockMinutes, onSessionExpired]);

  // Session duration check
  useEffect(() => {
    const checkSessionDuration = () => {
      const now = new Date();
      const sessionStart = currentSession.startTime;
      const sessionHours = (now.getTime() - sessionStart.getTime()) / (1000 * 60 * 60);
      
      if (sessionHours >= securitySettings.maxSessionHours) {
        setSessionExpired(true);
        onSessionExpired();
      }
    };

    const interval = setInterval(checkSessionDuration, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [currentSession.startTime, securitySettings.maxSessionHours, onSessionExpired]);

  const updateLastActivity = () => {
    setCurrentSession(prev => ({
      ...prev,
      lastActivity: new Date()
    }));
    setAutoLockWarning(false);
  };

  const extendSession = () => {
    updateLastActivity();
    setAutoLockWarning(false);
  };

  const getSessionDuration = () => {
    const now = new Date();
    const duration = (now.getTime() - currentSession.startTime.getTime()) / (1000 * 60 * 60);
    return Math.round(duration * 10) / 10; // Round to 1 decimal
  };

  const getTimeUntilExpiry = () => {
    const now = new Date();
    const sessionStart = currentSession.startTime;
    const sessionHours = (now.getTime() - sessionStart.getTime()) / (1000 * 60 * 60);
    return Math.max(0, securitySettings.maxSessionHours - sessionHours);
  };

  const getSecurityScore = () => {
    let score = 0;
    if (currentSession.twoFactorVerified) score += 30;
    if (currentSession.trustedDevice) score += 25;
    if (securitySettings.ipWhitelistRequired) score += 25;
    if (securitySettings.requiresTwoFA) score += 20;
    return score;
  };

  const securityScore = getSecurityScore();
  const securityLevel = securityScore >= 80 ? "High" : securityScore >= 60 ? "Medium" : "Low";
  const securityColor = securityScore >= 80 ? "text-green-600" : securityScore >= 60 ? "text-yellow-600" : "text-red-600";

  // Activity tracker - update on user interaction
  useEffect(() => {
    const handleActivity = () => updateLastActivity();
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, []);

  if (sessionExpired) {
    return (
      <Dialog open={true}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-red-600" />
              <span>Session Expired</span>
            </DialogTitle>
            <DialogDescription>
              Your session has expired due to inactivity or maximum session duration reached.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please log in again to continue using the admin panel.
              </AlertDescription>
            </Alert>
            <Button onClick={() => window.location.reload()} className="w-full">
              Sign In Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      {/* Auto-lock Warning */}
      {autoLockWarning && (
        <Dialog open={autoLockWarning} onOpenChange={setAutoLockWarning}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span>Session Auto-lock Warning</span>
              </DialogTitle>
              <DialogDescription>
                Your session will automatically lock in {Math.ceil(timeUntilLock)} minutes due to inactivity.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Progress value={(5 - timeUntilLock) * 20} className="w-full" />
              <div className="flex space-x-2">
                <Button onClick={extendSession} className="flex-1">
                  Extend Session
                </Button>
                <Button variant="outline" onClick={() => onSessionExpired()}>
                  Lock Now
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Security Status Component */}
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-80 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Shield className={`w-4 h-4 ${securityColor}`} />
                <span>Session Security</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSecurityDialog(true)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Security Level</span>
                <Badge className={securityColor.replace('text-', 'bg-').replace('-600', '-100 text-') + securityColor.replace('text-', '').replace('-600', '-800')}>
                  {securityLevel}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Session Duration</span>
                <span>{getSessionDuration()}h / {securitySettings.maxSessionHours}h</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Auto-lock</span>
                <span>{securitySettings.autoLockMinutes}min</span>
              </div>
              <Progress 
                value={(getSessionDuration() / securitySettings.maxSessionHours) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Security Dialog */}
      <Dialog open={showSecurityDialog} onOpenChange={setShowSecurityDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Session Security Details</DialogTitle>
            <DialogDescription>
              Security information for your current admin session
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Security Overview */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className={`w-4 h-4 ${securityColor}`} />
                    <span className="font-medium text-sm">Security Score</span>
                  </div>
                  <div className="text-2xl font-bold">{securityScore}/100</div>
                  <Progress value={securityScore} className="mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-sm">Time Remaining</span>
                  </div>
                  <div className="text-2xl font-bold">{getTimeUntilExpiry().toFixed(1)}h</div>
                  <p className="text-xs text-muted-foreground mt-1">Until session expires</p>
                </CardContent>
              </Card>
            </div>

            {/* Session Information */}
            <div>
              <h4 className="font-medium mb-3">Session Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Session ID:</span>
                  <p className="font-mono">{currentSession.id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Started:</span>
                  <p>{currentSession.startTime.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Activity:</span>
                  <p>{currentSession.lastActivity.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">IP Address:</span>
                  <p className="font-mono">{currentSession.ipAddress}</p>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div>
              <h4 className="font-medium mb-3">Security Features</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Two-Factor Authentication</span>
                  </div>
                  {currentSession.twoFactorVerified ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Trusted Device</span>
                  </div>
                  {currentSession.trustedDevice ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">IP Whitelist</span>
                  </div>
                  {securitySettings.ipWhitelistRequired ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <span className="text-xs text-muted-foreground">Not required</span>
                  )}
                </div>
              </div>
            </div>

            {/* Role-specific Security Settings */}
            <div>
              <h4 className="font-medium mb-3">Role Security Settings</h4>
              <div className="bg-muted p-3 rounded-lg text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Auto-lock timeout:</span>
                  <span>{securitySettings.autoLockMinutes} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Maximum session duration:</span>
                  <span>{securitySettings.maxSessionHours} hours</span>
                </div>
                <div className="flex justify-between">
                  <span>2FA requirement:</span>
                  <span>{securitySettings.requiresTwoFA ? "Required" : "Optional"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trusted device requirement:</span>
                  <span>{securitySettings.trustedDeviceRequired ? "Required" : "Optional"}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={extendSession} className="flex-1">
                Extend Session
              </Button>
              <Button variant="outline" onClick={() => setShowSecurityDialog(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}