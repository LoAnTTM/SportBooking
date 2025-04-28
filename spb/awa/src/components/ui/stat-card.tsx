import React from "react";
import { Card } from "./card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    positive: boolean;
  };
  color?: "blue" | "red";
}

const StatCard = ({ title, value, change, color = "blue" }: StatCardProps) => {
  const bgColor = color === "blue" ? "bg-blue-500" : "bg-red-500";
  const textColor = color === "blue" ? "text-blue-500" : "text-red-500";

  return (
    <Card className={`${bgColor} text-white`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-4xl font-bold">{value}</h3>
          {change && (
            <div className="flex items-center rounded-full bg-white px-2 py-1">
              {change.positive ? (
                <ArrowUpRight className={`h-4 w-4 ${textColor}`} />
              ) : (
                <ArrowDownRight className={`h-4 w-4 ${textColor}`} />
              )}
              <span className={`ml-1 text-xs font-medium ${textColor}`}>
                {change.value}
              </span>
            </div>
          )}
        </div>
        <p className="mt-2 text-lg">{title}</p>
      </div>
    </Card>
  );
};

export default StatCard;
