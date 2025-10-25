"use client";

import { useAuth } from "@/contexts/auth-context";
import { users } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Logo } from "@/components/shared/logo";
import { User, Shield } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

  const agents = users.filter((u) => u.role === "agent");
  const admins = users.filter((u) => u.role === "admin");

  const handleLogin = (userId: string | null) => {
    if (userId) {
      login(userId);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[hsl(351,100%,86.5%)] p-4">
       <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-4 text-primary">
                <Logo className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground font-headline">Welcome to OrderFlow</h1>
            <p className="text-muted-foreground">Please select your role to sign in.</p>
        </div>
      <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">Agent Login</CardTitle>
            <CardDescription>Sign in to manage your orders and products.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="agent-user">Select Agent</Label>
              <Select onValueChange={setSelectedAgentId}>
                <SelectTrigger id="agent-user">
                  <SelectValue placeholder="Select an agent..." />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={() => handleLogin(selectedAgentId)} disabled={!selectedAgentId}>
              Sign In as Agent
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
             <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Shield className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">Admin Login</CardTitle>
            <CardDescription>Access the dashboard to manage all operations.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-user">Select Admin</Label>
              <Select onValueChange={setSelectedAdminId}>
                <SelectTrigger id="admin-user">
                  <SelectValue placeholder="Select an admin..." />
                </SelectTrigger>
                <SelectContent>
                  {admins.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={() => handleLogin(selectedAdminId)} disabled={!selectedAdminId}>
              Sign In as Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
