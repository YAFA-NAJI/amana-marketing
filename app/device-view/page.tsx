"use client";
import { Navbar } from "../../src/components/ui/navbar";
import { Footer } from "../../src/components/ui/footer";
import { CardMetric } from "../../src/components/ui/card-metric";
import mockup from "@/mockup.json";
import { Campaign } from "@/src/types/marketing";
import dynamic from "next/dynamic";

export default function DeviceView() {
  const campaigns: Campaign[] = mockup.campaigns;

  // Aggregate by device
  const deviceData = campaigns.reduce(
    (acc, campaign) => {
      campaign.device_performance.forEach((d) => {
        if (!acc[d.device]) {
          acc[d.device] = { impressions: 0, clicks: 0, spend: 0, revenue: 0 };
        }
        acc[d.device].impressions += d.impressions;
        acc[d.device].clicks += d.clicks;
        acc[d.device].spend += d.spend;
        acc[d.device].revenue += d.revenue;
      });
      return acc;
    },
    {} as Record<string, { impressions: number; clicks: number; spend: number; revenue: number }>
  );

  const devices = Object.keys(deviceData);

  // Find max ROAS across all devices for scaling
  const maxROAS = Math.max(
    ...devices.map((d) => deviceData[d].revenue / deviceData[d].spend)
  );

  // Import dynamic Radial chart
  const RadialChart = dynamic(() => import("@/src/components/ui/radial-chart"), {
    ssr: false,
  });

  return (
    <div className="flex h-screen bg-gray-900">
      <Navbar />

      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-700 text-white py-16 shadow-lg">
          <div className="px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Device Performance Overview
            </h1>
            <p className="mt-3 text-gray-200 text-lg md:text-xl">
              Interactive comparison of Desktop vs Mobile campaigns
            </p>
          </div>
        </section>

        {/* Content Area */}
        <div className="flex-1 p-6 lg:p-10 overflow-y-auto space-y-12">
          {/* Interactive Radial Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {devices.map((device) => {
              const data = deviceData[device];
              // Scale ROAS relative to maxROAS
              const revenuePercent = Math.min(
                ((data.revenue / data.spend) / maxROAS) * 100,
                100
              );

              return (
                <div
                  key={device}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300 relative"
                >
                  <h3 className="text-xl font-semibold mb-4">{device}</h3>
                  <RadialChart
                    value={revenuePercent}
                    label="ROAS"
                    color="#FACC15"
                    size={150}
                  />
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Impressions</span>
                      <span className="font-bold">{data.impressions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Clicks</span>
                      <span className="font-bold">{data.clicks.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Spend</span>
                      <span className="font-bold">${data.spend.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Revenue</span>
                      <span className="font-bold">${data.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
