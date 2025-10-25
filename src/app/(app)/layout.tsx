"use client";

import { useAuth } from "@/contexts/auth-context";
import { MainNav } from "./components/main-nav";
import { UserNav } from "./components/user-nav";
import { AppHeader } from "./components/header";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/shared/logo";
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // or a redirect, but auth context already handles it
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/products" className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary"/>
            <span className="font-headline text-lg font-semibold group-data-[collapsible=icon]:hidden">
              OrderFlow
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <MainNav userRole={user.role} />
        </SidebarContent>
        <SidebarFooter>
          <UserNav user={user} />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
