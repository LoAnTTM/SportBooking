'use client';

import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import CircularProgress from "@/components/ui/circular-progress";
import LineChart from "@/components/ui/line-chart";
import BarChart from "@/components/ui/bar-chart";
import PromotionCard from "@/components/ui/promotion-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { fetchWithFallback } from "@/utils/api-utils";
import {
  analyzeStats as mockAnalyzeStats,
  salesChartData as mockSalesChartData,
  orderVolumeData as mockOrderVolumeData,
  promotions as mockPromotions,
  announcements as mockAnnouncements,
} from "@/data/mock-data";

// Define types for our data
interface AnalyzeStats {
  pendingOrders: {
    count: number;
    label: string;
    today: string;
  };
  bestSellingProduct: {
    percentage: number;
    label: string;
  };
  rating: {
    value: number;
    label: string;
  };
  newProductCreation: {
    count: number;
    label: string;
  };
  salesSummary: {
    value: string;
    change: {
      value: string;
      positive: boolean;
      label: string;
    };
  };
  orderVolume: {
    value: string;
    change: {
      value: string;
      positive: boolean;
      label: string;
    };
  };
}

interface ChartData {
  day: string;
  thisWeek: number;
  lastWeek: number;
}

interface Promotion {
  id: number;
  title: string;
  discount: string;
  endDate: string;
  details: Array<{ label: string; value: string }>;
  stats: {
    sellers: number;
    products: number;
  };
  timeRemaining: {
    hours: string;
    minutes: string;
    seconds: string;
  };
}

interface Announcement {
  id: number;
  title: string;
  date: string;
}

export default function AnalyzePage() {
  const [analyzeStats, setAnalyzeStats] = useState<AnalyzeStats>(mockAnalyzeStats);
  const [salesChartData, setSalesChartData] = useState<ChartData[]>(mockSalesChartData);
  const [orderVolumeData, setOrderVolumeData] = useState<ChartData[]>(mockOrderVolumeData);
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyzeData = async () => {
      try {
        // Use Promise.all to fetch all data in parallel
        const [
          statsData,
          salesChartResult,
          orderVolumeResult,
          promotionsResult,
          announcementsResult
        ] = await Promise.all([
          fetchWithFallback<AnalyzeStats>('/api/analyze/stats', mockAnalyzeStats),
          fetchWithFallback<ChartData[]>('/api/analyze/sales-chart', mockSalesChartData),
          fetchWithFallback<ChartData[]>('/api/analyze/order-volume', mockOrderVolumeData),
          fetchWithFallback<Promotion[]>('/api/analyze/promotions', mockPromotions),
          fetchWithFallback<Announcement[]>('/api/analyze/announcements', mockAnnouncements)
        ]);

        // Update state with fetched data
        setAnalyzeStats(statsData);
        setSalesChartData(salesChartResult);
        setOrderVolumeData(orderVolumeResult);
        setPromotions(promotionsResult);
        setAnnouncements(announcementsResult);
      } catch (error) {
        console.error('Error fetching analyze data:', error);
        // Use mock data as fallback for all data
        setAnalyzeStats(mockAnalyzeStats);
        setSalesChartData(mockSalesChartData);
        setOrderVolumeData(mockOrderVolumeData);
        setPromotions(mockPromotions);
        setAnnouncements(mockAnnouncements);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyzeData();
  }, []);

  return (
    <MainLayout title="Analyze">
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600 mx-auto"></div>
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">
                  {analyzeStats.pendingOrders.label}
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {analyzeStats.pendingOrders.count}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {analyzeStats.pendingOrders.today}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-center p-4">
                <CircularProgress
                  percentage={analyzeStats.bestSellingProduct.percentage}
                  color="#6366f1"
                  size={80}
                  strokeWidth={8}
                />
                <div className="ml-4">
                  <div className="text-sm text-gray-500">
                    {analyzeStats.bestSellingProduct.label}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">
                  {analyzeStats.rating.label}
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {analyzeStats.rating.value}
                </div>
                <div className="mt-2 h-12 w-full rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-yellow-400"
                    style={{ width: `${analyzeStats.rating.value * 20}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">
                  {analyzeStats.newProductCreation.label}
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {analyzeStats.newProductCreation.count}
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-indigo-500">70%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-medium">Sales Summary</h3>
                <div className="flex items-center space-x-1 text-sm">
                  <span className="font-medium">{analyzeStats.salesSummary.value}</span>
                  <span
                    className={
                      analyzeStats.salesSummary.change.positive
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {analyzeStats.salesSummary.change.positive ? "↑" : "↓"}{" "}
                    {analyzeStats.salesSummary.change.value}
                  </span>
                  <span className="text-gray-500">
                    {analyzeStats.salesSummary.change.label}
                  </span>
                </div>
              </div>
              <LineChart
                data={salesChartData}
                lines={[
                  { dataKey: "thisWeek", stroke: "#6366f1", name: "This Week" },
                  { dataKey: "lastWeek", stroke: "#fbbf24", name: "Last Week" },
                ]}
                xAxisDataKey="day"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-medium">Order Volume</h3>
                <div className="flex items-center space-x-1 text-sm">
                  <span className="font-medium">{analyzeStats.orderVolume.value}</span>
                  <span
                    className={
                      analyzeStats.orderVolume.change.positive
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {analyzeStats.orderVolume.change.positive ? "↑" : "↓"}{" "}
                    {analyzeStats.orderVolume.change.value}
                  </span>
                  <span className="text-gray-500">
                    {analyzeStats.orderVolume.change.label}
                  </span>
                </div>
              </div>
              <BarChart
                data={orderVolumeData}
                bars={[
                  { dataKey: "thisWeek", fill: "#6366f1", name: "This Week" },
                  { dataKey: "lastWeek", fill: "#fbbf24", name: "Last Week" },
                ]}
                xAxisDataKey="day"
              />
            </div>
          </div>

          {/* Promotions and Announcements */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">Announcements</h3>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="mb-4 relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search"
                      className="w-full bg-gray-100 pl-8 text-sm"
                    />
                  </div>
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div>
                          <h4 className="font-medium">{announcement.title}</h4>
                          <p className="text-sm text-gray-500">{announcement.date}</p>
                        </div>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-500">
                          <span className="text-xs font-medium">1</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">Coming Soon</h3>
              </div>
              <div className="space-y-4">
                {promotions.map((promotion) => (
                  <PromotionCard
                    key={promotion.id}
                    title={promotion.title}
                    discount={promotion.discount}
                    endDate={promotion.endDate}
                    details={promotion.details}
                    stats={promotion.stats}
                    timeRemaining={promotion.timeRemaining}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
}
