"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart3,
  Search,
  UserCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Overview",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Order",
      href: "/order",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      name: "Clubs",
      href: "/clubs",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Users",
      href: "/users",
      icon: <UserCircle className="h-5 w-5" />,
    },
    {
      name: "Analyze",
      href: "/analyze",
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex items-center justify-center p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-900">
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5Z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search"
            className="w-full bg-gray-100 pl-8 text-sm"
          />
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium",
              pathname === item.href ||
              (pathname.startsWith(item.href + "/") && item.href !== "/")
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
