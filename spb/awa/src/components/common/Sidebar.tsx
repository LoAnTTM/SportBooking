import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to login page
    router.push('/auth/login');
  };

  return (
    <div className="sidebar">
      <h2>Admin Dashboard</h2>
      <ul>
        <li>
          <Link href="/">Dashboard</Link>
        </li>
        <li>
          <Link href="/clubs">Clubs</Link>
        </li>
        <li>
          <Link href="/units">Units</Link>
        </li>
        <li>
          <Link href="/settings">Settings</Link>
        </li>
        <li className="logout">
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;