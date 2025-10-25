"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Package,
  History,
  Users,
} from "lucide-react";

type MainNavProps = {
  userRole: "agent" | "admin";
};

export function MainNav({ userRole }: MainNavProps) {
  const pathname = usePathname();

  const agentRoutes = [
    { href: "/products", label: "Products", icon: Package },
    { href: "/orders", label: "My Orders", icon: History },
  ];

  const adminRoutes = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Manage Products", icon: Package },
    { href: "/admin/users", label: "Manage Users", icon: Users },
  ];

  const routes = userRole === "admin" ? adminRoutes : agentRoutes;

  if (userRole === "admin" && pathname.startsWith('/admin')) {
      // no adjustment needed
  } else if (userRole === "agent" && !pathname.startsWith('/admin')) {
      // no adjustment needed
  }

  // Adjust `isActive` logic for hierarchical routes like /admin/*
  const checkActive = (href: string) => {
    if (href === '/admin') return pathname === href;
    if (href === '/products') return pathname === '/products' || pathname === '/';
    return pathname.startsWith(href);
  };


  return (
    <SidebarMenu>
      {routes.map((route) => (
        <SidebarMenuItem key={route.href}>
          <Link href={route.href}>
            <SidebarMenuButton
              isActive={checkActive(route.href)}
              tooltip={route.label}
            >
              <route.icon />
              <span>{route.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
