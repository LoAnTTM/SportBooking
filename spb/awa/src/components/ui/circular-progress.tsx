import React from "react";

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  title?: string;
  subtitle?: string;
}

const CircularProgress = ({
  percentage,
  size = 120,
  strokeWidth = 10,
  color = "#6366f1",
  title,
  subtitle,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dash = (percentage * circumference) / 100;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
          fontSize="1.5rem"
          fontWeight="bold"
          fill="currentColor"
        >
          {`${percentage}%`}
        </text>
      </svg>
      {title && <p className="mt-2 text-sm font-medium">{title}</p>}
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
};

export default CircularProgress;
