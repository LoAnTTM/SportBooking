import React from "react";
import { Button } from "./button";
import { Card } from "./card";
import { Check } from "lucide-react";

interface PromotionCardProps {
  title: string;
  discount: string;
  endDate: string;
  details: {
    label: string;
    value: string;
  }[];
  stats: {
    sellers: number;
    products: number;
  };
  timeRemaining?: {
    hours: string;
    minutes: string;
    seconds: string;
  };
}

const PromotionCard = ({
  title,
  discount,
  endDate,
  details,
  stats,
  timeRemaining,
}: PromotionCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gray-100 p-4">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-sm">{discount}</p>
        {timeRemaining ? (
          <div className="mt-2 flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-800 text-white">
              <span className="text-xs">{timeRemaining.hours}</span>
            </div>
            <span className="text-xs">:</span>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-800 text-white">
              <span className="text-xs">{timeRemaining.minutes}</span>
            </div>
            <span className="text-xs">:</span>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-800 text-white">
              <span className="text-xs">{timeRemaining.seconds}</span>
            </div>
          </div>
        ) : null}
      </div>
      <div className="p-4">
        <div className="space-y-2">
          {details.map((detail, index) => (
            <div key={index} className="flex items-center text-sm">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span className="text-gray-500">{detail.label}:</span>
              <span className="ml-1 font-medium">{detail.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            <span className="text-gray-500">Sellers:</span>
            <span className="ml-1 font-medium">{stats.sellers}</span>
          </div>
          <div>
            <span className="text-gray-500">Products:</span>
            <span className="ml-1 font-medium">{stats.products}</span>
          </div>
        </div>
        <Button className="mt-4 w-full bg-gray-800 hover:bg-gray-700">
          Join the Promotion
        </Button>
      </div>
    </Card>
  );
};

export default PromotionCard;
