import React from "react";

interface ClubIconProps {
  type: "product" | "website" | "icon" | "ecommerce" | "wireframing";
  className?: string;
}

const ClubIcon = ({ type, className = "" }: ClubIconProps) => {
  const getIconColor = () => {
    switch (type) {
      case "product":
        return "bg-green-500";
      case "website":
        return "bg-orange-400";
      case "icon":
        return "bg-green-600";
      case "ecommerce":
        return "bg-indigo-500";
      case "wireframing":
        return "bg-pink-400";
      default:
        return "bg-gray-500";
    }
  };

  const getIconContent = () => {
    switch (type) {
      case "product":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        );
      case "website":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        );
      case "icon":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        );
      case "ecommerce":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        );
      case "wireframing":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="12" y1="8" x2="12" y2="16" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-md ${getIconColor()} ${className}`}
    >
      {getIconContent()}
    </div>
  );
};

export default ClubIcon;
