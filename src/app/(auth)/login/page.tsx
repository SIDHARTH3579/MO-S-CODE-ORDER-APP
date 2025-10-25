"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Logo } from "@/components/shared/logo";
import { User, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [agentEmail, setAgentEmail] = useState("");
  const [agentPassword, setAgentPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState<"agent" | "admin" | null>(null);

  const handleLogin = async (
    role: "agent" | "admin",
    email: string,
    password: string
  ) => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please enter both email and password.",
      });
      return;
    }

    setLoading(role);
    try {
      await login(email, password, role);
      // The auth context will handle redirection on successful login
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
      });
    } finally {
      setLoading(null);
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
              <Label htmlFor="agent-email">Email</Label>
              <Input
                id="agent-email"
                type="email"
                placeholder="agent@example.com"
                value={agentEmail}
                onChange={(e) => setAgentEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="agent-password">Password</Label>
              <Input 
                id="agent-password" 
                type="password"
                value={agentPassword}
                onChange={(e) => setAgentPassword(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={() => handleLogin("agent", agentEmail, agentPassword)}
              disabled={loading === "agent"}
            >
              {loading === 'agent' ? 'Signing In...' : 'Sign In as Agent'}
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
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@example.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input 
                id="admin-password" 
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={() => handleLogin("admin", adminEmail, adminPassword)}
              disabled={loading === "admin"}
            >
               {loading === 'admin' ? 'Signing In...' : 'Sign In as Admin'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
