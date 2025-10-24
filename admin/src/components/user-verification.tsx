import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Users,
  GraduationCap,
  Building,
  Home
} from "lucide-react";
import { UserRole } from "../utils/permissions";
import { TeacherApplications } from "./teacher-applications";
import { InstitutionApplications } from "./institution-applications";
import { HomestayApplications } from "./homestay-applications";

interface UserVerificationProps {
  userRole: UserRole;
}

export function UserVerification({ userRole }: UserVerificationProps) {
  // Mock stats data - would come from API
  const stats = {
    teachers: {
      total: 156,
      pending: 23,
      approved: 127,
      rejected: 6
    },
    institutions: {
      total: 45,
      pending: 8,
      approved: 34,
      rejected: 3
    },
    homestays: {
      total: 89,
      pending: 12,
      approved: 72,
      rejected: 5
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1>Users & Verification</h1>
          <p className="text-muted-foreground">
            Review and verify teacher, institution, and homestay applications
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              Teacher Applications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold">{stats.teachers.total}</span>
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full"></Badge>
                <span className="text-muted-foreground">Pending: {stats.teachers.pending}</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge className="w-2 h-2 p-0 rounded-full bg-green-500"></Badge>
                <span className="text-muted-foreground">Approved: {stats.teachers.approved}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building className="w-5 h-5 text-purple-600" />
              Institution Applications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold">{stats.institutions.total}</span>
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full"></Badge>
                <span className="text-muted-foreground">Pending: {stats.institutions.pending}</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge className="w-2 h-2 p-0 rounded-full bg-green-500"></Badge>
                <span className="text-muted-foreground">Approved: {stats.institutions.approved}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Home className="w-5 h-5 text-orange-600" />
              Homestay Applications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold">{stats.homestays.total}</span>
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full"></Badge>
                <span className="text-muted-foreground">Pending: {stats.homestays.pending}</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge className="w-2 h-2 p-0 rounded-full bg-green-500"></Badge>
                <span className="text-muted-foreground">Approved: {stats.homestays.approved}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="teachers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="teachers">
            <GraduationCap className="w-4 h-4 mr-2" />
            Teachers
            {stats.teachers.pending > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 min-w-5 text-xs">
                {stats.teachers.pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="institutions">
            <Building className="w-4 h-4 mr-2" />
            Institutions
            {stats.institutions.pending > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 min-w-5 text-xs">
                {stats.institutions.pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="homestays">
            <Home className="w-4 h-4 mr-2" />
            Homestays
            {stats.homestays.pending > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 min-w-5 text-xs">
                {stats.homestays.pending}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teachers">
          <TeacherApplications userRole={userRole} />
        </TabsContent>

        <TabsContent value="institutions">
          <InstitutionApplications userRole={userRole} />
        </TabsContent>

        <TabsContent value="homestays">
          <HomestayApplications userRole={userRole} />
        </TabsContent>
      </Tabs>
    </div>
  );
}