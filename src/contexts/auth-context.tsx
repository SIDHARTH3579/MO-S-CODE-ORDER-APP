"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { User } from "@/types";
import { users as mockUsers } from "@/lib/data";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: "agent" | "admin") => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "orderflow_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedUserJson = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUserJson) {
        const storedUser: User = JSON.parse(storedUserJson);
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && !user && !pathname.startsWith('/login')) {
      router.push("/login");
    }
  }, [user, loading, pathname, router]);


  const login = (email: string, password: string, role: "agent" | "admin"): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        const userToLogin = mockUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role
        );

        // NOTE: We are not checking the password, as it's not stored in mock data.
        // In a real app, you would validate the password hash.
        if (userToLogin) {
          setUser(userToLogin);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToLogin));
          router.push(userToLogin.role === 'admin' ? '/admin' : '/products');
          resolve();
        } else {
          reject(new Error("Invalid credentials or role mismatch."));
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
