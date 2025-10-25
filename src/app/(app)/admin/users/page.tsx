'use client'

import React, { useState } from 'react'
import { users as initialUsers } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import type { User } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { toast } = useToast();

  const handleDeleteUser = () => {
    if (userToDelete) {
        setUsers(users.filter(u => u.id !== userToDelete.id));
        toast({
            title: "User Deleted",
            description: `User "${userToDelete.name}" has been removed.`,
        });
        setUserToDelete(null);
    }
  };
  
  // TODO: Add user creation/editing logic

  return (
    <div className="container mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Manage Users</h1>
          <p className="text-muted-foreground">Control user roles and access permissions.</p>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>
       <Card>
        <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>A list of all users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user.id}>
                             <TableCell className="font-medium">{user.name}</TableCell>
                             <TableCell>{user.email}</TableCell>
                             <TableCell>
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">{user.role}</Badge>
                             </TableCell>
                             <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => setUserToDelete(user)}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                             </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user "{userToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
