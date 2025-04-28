"use client";

import React from "react";
import { Bell, MoreVertical, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  title: string;
  showSearch?: boolean;
}

const Header = ({ title, showSearch = false }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex items-center space-x-4">
        {showSearch && (
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search"
              className="w-[200px] bg-gray-100 pl-8 text-sm md:w-[300px]"
            />
          </div>
        )}
        <button className="rounded-full p-2 hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src="/avatar.png" alt="Judy Stevenson" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">Judy Stevenson</p>
          </div>
        </div>
        <button className="rounded-full p-1 hover:bg-gray-100">
          <MoreVertical className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;
