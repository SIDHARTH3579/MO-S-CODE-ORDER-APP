'use client'

import React, { useState, useTransition } from 'react'
import { users as initialUsers } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, MoreHorizontal, Upload, Loader2 } from "lucide-react";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from '@/components/ui/badge';
import type { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { UserForm } from './components/user-form';
import { Input } from '@/components/ui/input';
import { importUsersAction } from '@/app/actions';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImporting, startImportTransition] = useTransition();
  const { toast } = useToast();

  const handleDeleteUser = () => {
    if (userToDelete) {
        // In a real app, this would be an API call
        const updatedUsers = users.filter(u => u.id !== userToDelete.id);
        setUsers(updatedUsers);
        initialUsers.splice(initialUsers.findIndex(u => u.id === userToDelete.id), 1); // Mutate mock
        toast({
            title: "User Deleted",
            description: `User "${userToDelete.name}" has been removed.`,
        });
        setUserToDelete(null);
    }
  };
  
  const handleFormSubmit = (userData: Omit<User, 'id'> & { id?: string }) => {
    if (userData.id) {
        // Edit existing user
        const updatedUsers = users.map(u => u.id === userData.id ? { ...u, ...userData } : u);
        setUsers(updatedUsers);
        const index = initialUsers.findIndex(u => u.id === userData.id);
        if (index !== -1) {
            initialUsers[index] = { ...initialUsers[index], ...userData } as User;
        }
        toast({
            title: "User Updated",
            description: `User "${userData.name}" has been updated.`,
        });
    } else {
        // Add new user
        const newUser: User = {
            ...userData,
            id: `user_${String(Math.random()).slice(2, 8)}`,
        } as User;
         const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        initialUsers.push(newUser);
        toast({
            title: "User Added",
            description: `User "${newUser.name}" has been created.`,
        });
    }
    setIsFormOpen(false);
    setUserToEdit(undefined);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target?.result as string;
        startImportTransition(async () => {
            const result = await importUsersAction(content);
            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Import Failed",
                    description: result.error,
                });
            } else {
                // Here you would merge new users, for simplicity we replace them
                setUsers(result.users!);
                initialUsers.splice(0, initialUsers.length, ...result.users!);
                toast({
                    title: "Import Successful",
                    description: `${result.users?.length} users have been imported.`,
                });
            }
        });
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Manage Users</h1>
          <p className="text-muted-foreground">Control user roles and access permissions.</p>
        </div>
        <div className="flex gap-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" /> Import Users
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import Users</DialogTitle>
                        <DialogDescription>
                            Bulk-upload users from a CSV file. The file should have `name`, `email`, and `role` columns.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 text-sm space-y-4">
                       <Input type="file" accept=".csv" onChange={handleFileChange} disabled={isImporting} />
                       {isImporting && (
                           <div className="flex items-center text-muted-foreground">
                               <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                               Processing file, please wait...
                           </div>
                       )}
                    </div>
                </DialogContent>
            </Dialog>
            <Button onClick={() => {setUserToEdit(undefined); setIsFormOpen(true);}}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add User
            </Button>
        </div>
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
                                        <DropdownMenuItem onClick={() => { setUserToEdit(user); setIsFormOpen(true);}}>Edit</DropdownMenuItem>
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

       <Dialog open={isFormOpen} onOpenChange={(open) => { if (!open) setUserToEdit(undefined); setIsFormOpen(open);}}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>{userToEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
             <DialogDescription>
                {userToEdit ? 'Update the details for this user.' : 'Fill in the form to create a new user.'}
             </DialogDescription>
           </DialogHeader>
           <UserForm
             user={userToEdit}
             onSubmit={handleFormSubmit}
             onCancel={() => { setIsFormOpen(false); setUserToEdit(undefined); }}
            />
         </DialogContent>
       </Dialog>
    </div>
  );
}
