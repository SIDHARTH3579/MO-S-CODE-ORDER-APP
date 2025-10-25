"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        router.push(user.role === 'admin' ? '/admin' : '/');
      }
    }
  }, [user, loading, router]);
  
  // As this page is now inside (app) group, it will be the default page for authenticated users.
  // We check the role and redirect if necessary.
  // The actual product catalog is now at /products
  useEffect(() => {
    if (user) {
      router.push('/products');
    }
  }, [user, router]);


  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  );
}
