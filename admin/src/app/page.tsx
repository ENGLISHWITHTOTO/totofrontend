"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, FolderOpen, Settings } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Learning Admin</h1>
          <p className="text-muted-foreground">
            Manage your platform content, users, and system settings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Overview KPIs and quick actions.
              </p>
              <Button asChild size="sm">
                <Link href="/admin/dashboard">Open</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4" /> Users
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Verifications and account management.
              </p>
              <Button asChild size="sm">
                <Link href="/admin/users">Open</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" /> Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Taxonomy, marketplace and static pages.
              </p>
              <div className="flex gap-2">
                <Button asChild variant="secondary" size="sm">
                  <Link href="/admin/content">Content</Link>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link href="/admin/marketplace">Marketplace</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-4 h-4" /> Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                System preferences and roles.
              </p>
              <div className="flex gap-2">
                <Button asChild variant="secondary" size="sm">
                  <Link href="/admin/roles">Roles</Link>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link href="/admin/settings">Settings</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
