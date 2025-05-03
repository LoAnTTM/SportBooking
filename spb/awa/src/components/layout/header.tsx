"use client";

import { Bell, LogOut, MoreVertical, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/api';
import { clearAuthState } from '@/utils/auth-utils';

interface HeaderProps {
  title: string;
  showSearch?: boolean;
}

const Header = ({ title, showSearch = false }: HeaderProps) => {
  const router = useRouter();
  const [userName, setUserName] = useState("Admin");
  const [userInitials, setUserInitials] = useState("AD");

  useEffect(() => {
    // Get user data from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        if (userData.full_name) {
          setUserName(userData.full_name);
          // Get initials from full name
          const nameParts = userData.full_name.split(' ');
          if (nameParts.length >= 2) {
            setUserInitials(`${nameParts[0][0]}${nameParts[1][0]}`);
          } else {
            setUserInitials(userData.full_name.substring(0, 2).toUpperCase());
          }
        } else if (userData.email) {
          // Use email username as fallback
          const emailName = userData.email.split('@')[0];
          setUserName(emailName);
          setUserInitials(emailName.substring(0, 2).toUpperCase());
        }
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      const response = await authService.logout();

      console.log('Logout response:', response);

      clearAuthState();

      // Redirect to login page
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);

      // Even if the API call fails, clear local auth state and redirect
      clearAuthState();
      router.push('/auth/login');
    }
  };

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
            <AvatarImage src="/avatar.png" alt={userName} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{userName}</p>
          </div>
        </div>
        <button
          className="rounded-full p-1 hover:bg-gray-100 flex items-center"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;
