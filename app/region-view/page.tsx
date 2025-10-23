"use client";

import { Navbar } from "../../src/components/ui/navbar";
import { Footer } from "../../src/components/ui/footer";
import { Campaign, RegionalPerformance } from "@/src/types/marketing";
import mockup from "@/mockup.json";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Import HeatMap dynamically (disable SSR)
const HeatMap = dynamic(() => import("@/src/components/ui/heat-map"), {
  ssr: false,
});

export default function RegionView() {
  // --- Aggregate Regional Data ---
  function aggregateRegionalData(campaigns: Campaign[]) {
    const aggregation: Record<string, RegionalPerformance> = {};

    campaigns.forEach((campaign) => {
      campaign.regional_performance.forEach((rp) => {
        const key = `${rp.region}-${rp.country}`;
        if (!aggregation[key]) {
          aggregation[key] = { ...rp };
        } else {
          aggregation[key].impressions += rp.impressions;
          aggregation[key].clicks += rp.clicks;
          aggregation[key].conversions += rp.conversions;
          aggregation[key].spend += rp.spend;
          aggregation[key].revenue += rp.revenue;

          aggregation[key].ctr =
            aggregation[key].clicks / aggregation[key].impressions || 0;
          aggregation[key].conversion_rate =
            aggregation[key].conversions / aggregation[key].clicks || 0;
          aggregation[key].cpc = aggregation[key].spend / aggregation[key].clicks || 0;
          aggregation[key].cpa =
            aggregation[key].spend / aggregation[key].conversions || 0;
          aggregation[key].roas =
            aggregation[key].revenue / aggregation[key].spend || 0;
        }
      });
    });

    return Object.values(aggregation);
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Navbar />

      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-12">
          <div className="px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
              Regional Campaign Performance
            </h1>
            <p className="mt-3 text-gray-300 text-lg animate-fade-in">
              Explore revenue, spend, and engagement across cities and regions
            </p>
          </div>
        </section>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-8">
          {/* HeatMap Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl shadow-lg border border-gray-700 bg-gray-800 p-4"
          >
            <HeatMap
              title="Regional Revenue View"
              data={aggregateRegionalData(mockup.campaigns as Campaign[])}
              valueKey="revenue"
            />

            {/* Legend */}
            <div className="flex justify-center items-center mt-4 gap-2">
              <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
              <span className="text-white text-sm">Low</span>
              <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
              <span className="text-white text-sm">Medium</span>
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              <span className="text-white text-sm">High</span>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
