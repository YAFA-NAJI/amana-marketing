"use client";

import { Navbar } from "../../src/components/ui/navbar";
import { Footer } from "../../src/components/ui/footer";
import { BarChart, BarChartDataPoint } from "../../src/components/ui/bar-chart";
import { Table, TableColumn } from "../../src/components/ui/table";
import {
  MousePointerClick,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import mockup from "@/mockup.json";
import CountUp from "react-countup";
import { motion } from "framer-motion";

interface DemographicPerformance {
  age_group: string;
  gender: string;
  percentage_of_audience: number;
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    conversion_rate: number;
  };
}

interface Campaign {
  spend: number;
  revenue: number;
  demographic_breakdown: DemographicPerformance[];
  impressions: number;
}

export default function DemographicView() {
  const campaigns: Campaign[] = mockup.campaigns;

  const demographics = campaigns.flatMap((c) =>
    c.demographic_breakdown.map((d) => ({
      ...d,
      spend: (c.spend * d.percentage_of_audience) / 100,
      revenue: (c.revenue * d.percentage_of_audience) / 100,
    }))
  );

  const maleData = demographics.filter((d) => d.gender === "Male");
  const femaleData = demographics.filter((d) => d.gender === "Female");

  const sum = (arr: any[], key: string) =>
    arr.reduce((acc, i) => {
      const keys = key.split(".");
      let val: any = i;
      for (const k of keys) val = val[k];
      return acc + (val ?? 0);
    }, 0);

  const maleClicks = sum(maleData, "performance.clicks");
  const maleSpend = sum(maleData, "spend");
  const maleRevenue = sum(maleData, "revenue");

  const femaleClicks = sum(femaleData, "performance.clicks");
  const femaleSpend = sum(femaleData, "spend");
  const femaleRevenue = sum(femaleData, "revenue");

  const ageGroups = Array.from(new Set(demographics.map((d) => d.age_group)));

  const spendByAge: BarChartDataPoint[] = ageGroups.map((age) => ({
    label: age,
    value: sum(demographics.filter((d) => d.age_group === age), "spend"),
  }));

  const revenueByAge: BarChartDataPoint[] = ageGroups.map((age) => ({
    label: age,
    value: sum(demographics.filter((d) => d.age_group === age), "revenue"),
  }));

  const groupPerformance = (data: typeof demographics) =>
    ageGroups.map((age) => {
      const group = data.filter((d) => d.age_group === age);
      const impressions = sum(group, "performance.impressions");
      const clicks = sum(group, "performance.clicks");
      const conversions = sum(group, "performance.conversions");
      const ctr = impressions ? ((clicks / impressions) * 100).toFixed(1) + "%" : "0%";
      const convRate = clicks ? ((conversions / clicks) * 100).toFixed(1) + "%" : "0%";
      return { age, impressions, clicks, conversions, ctr, convRate };
    });

  const maleTableData = groupPerformance(maleData);
  const femaleTableData = groupPerformance(femaleData);

  const columns: TableColumn[] = [
    { key: "age", header: "Age Group" },
    { key: "impressions", header: "Impressions" },
    { key: "clicks", header: "Clicks" },
    { key: "conversions", header: "Conversions" },
    { key: "ctr", header: "CTR" },
    { key: "convRate", header: "Conversion Rate" },
  ];

  const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <div className="flex h-screen bg-gray-900">
      <Navbar />
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-12">
          <div className="px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold">Demographic View</h1>
            <p className="mt-2 text-gray-300 text-lg">
              Insights by Gender and Age Group (Mock Data)
            </p>
          </div>
        </section>

        <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-10">
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Male Clicks", value: maleClicks, icon: <MousePointerClick className="text-blue-400" />, gradient: "from-blue-800 to-blue-600" },
              { title: "Male Spend", value: maleSpend, icon: <DollarSign className="text-green-400" />, gradient: "from-green-800 to-green-600" },
              { title: "Male Revenue", value: maleRevenue, icon: <TrendingUp className="text-yellow-400" />, gradient: "from-yellow-800 to-yellow-600" },
              { title: "Female Clicks", value: femaleClicks, icon: <MousePointerClick className="text-pink-400" />, gradient: "from-pink-800 to-pink-600" },
              { title: "Female Spend", value: femaleSpend, icon: <DollarSign className="text-purple-400" />, gradient: "from-purple-800 to-purple-600" },
              { title: "Female Revenue", value: femaleRevenue, icon: <TrendingUp className="text-teal-400" />, gradient: "from-teal-800 to-teal-600" },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className={`bg-gradient-to-r ${card.gradient} shadow-lg rounded-xl p-6 flex items-center justify-between transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl`}
              >
                <div>
                  <p className="text-gray-200">{card.title}</p>
                  <p className="text-2xl font-bold text-white mt-2">
                    <CountUp end={card.value} duration={1.5} separator="," />
                  </p>
                </div>
                <div>{card.icon}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
          >
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <BarChart title="Spend by Age Group" data={spendByAge} gradient={["#4ade80","#16a34a"]} />
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <BarChart title="Revenue by Age Group" data={revenueByAge} gradient={["#facc15","#ca8a04"]} />
            </div>
          </motion.div>

          {/* Tables */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="grid grid-cols-1 gap-6 mt-8"
          >
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <Table title="Male Age Group Performance" columns={columns} data={maleTableData} />
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <Table title="Female Age Group Performance" columns={columns} data={femaleTableData} />
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
