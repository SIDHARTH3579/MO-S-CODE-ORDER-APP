"use client";

import { useAuth } from "@/contexts/auth-context";
import { users } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

export default function LoginPage() {
  const { login } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleLogin = () => {
    if (selectedUserId) {
      login(selectedUserId);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[hsl(351,100%,86.5%)] p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Logo className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-headline">Welcome to OrderFlow</CardTitle>
          <CardDescription>Select a user to sign in</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="user">User Role</Label>
            <Select onValueChange={setSelectedUserId}>
              <SelectTrigger id="user">
                <SelectValue placeholder="Select a user..." />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin} disabled={!selectedUserId}>
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
