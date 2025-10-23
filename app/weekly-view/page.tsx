"use client";

import { Navbar } from "../../src/components/ui/navbar";
import { Footer } from "../../src/components/ui/footer";
import { CardMetric } from "../../src/components/ui/card-metric";
import mockup from "@/mockup.json";
import { MockupData, WeeklyPerformance } from "@/src/types/marketing";
import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function WeeklyView() {
  // --- Aggregate weekly data ---
  const aggregateWeeklyData = (data: MockupData, key: keyof WeeklyPerformance) => {
    const aggregatedData: { [week: string]: number } = {};

    data.campaigns.forEach((campaign) => {
      campaign.weekly_performance.forEach((week) => {
        if (!aggregatedData[week.week_start]) aggregatedData[week.week_start] = 0;
        aggregatedData[week.week_start] += week[key] as number;
      });
    });

    return Object.keys(aggregatedData).map((week) => ({
      week,
      value: aggregatedData[week],
    }));
  };

  const weeklyRevenueData = useMemo(
    () => aggregateWeeklyData(mockup as MockupData, "revenue"),
    []
  );
  const weeklySpendData = useMemo(
    () => aggregateWeeklyData(mockup as MockupData, "spend"),
    []
  );

  // --- Total Metrics ---
  const totalRevenue = weeklyRevenueData.reduce((acc, d) => acc + d.value, 0);
  const totalSpend = weeklySpendData.reduce((acc, d) => acc + d.value, 0);

  // --- Dynamic LineChart import ---
  const LineChart = dynamic(() => import("@/src/components/ui/line-chart"), { ssr: false });

  return (
    <div className="flex h-screen bg-gray-900">
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-12">
          <div className="px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold">Weekly View</h1>
            <p className="mt-2 text-gray-300 text-lg">
              Track Revenue and Spend Trends by Week
            </p>
          </div>
        </section>

        {/* Metrics Cards */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <CardMetric title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} />
            <CardMetric title="Total Spend" value={`$${totalSpend.toLocaleString()}`} />
            <CardMetric
              title="Average Weekly Revenue"
              value={`$${(totalRevenue / weeklyRevenueData.length).toFixed(2)}`}
            />
            <CardMetric
              title="Average Weekly Spend"
              value={`$${(totalSpend / weeklySpendData.length).toFixed(2)}`}
            />
          </div>

          {/* Line Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="rounded-xl shadow-lg bg-gray-800 p-6 border border-gray-700 hover:scale-105 transition-transform duration-300">
              <h2 className="text-lg font-semibold text-white mb-4">Revenue by Week</h2>
              <LineChart title="Revenue by Week" data={weeklyRevenueData} color="#3B82F6" />
            </div>
            <div className="rounded-xl shadow-lg bg-gray-800 p-6 border border-gray-700 hover:scale-105 transition-transform duration-300">
              <h2 className="text-lg font-semibold text-white mb-4">Spend by Week</h2>
              <LineChart title="Spend by Week" data={weeklySpendData} color="#10B981" />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
