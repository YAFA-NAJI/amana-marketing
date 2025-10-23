"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  title: string;
  data: { week: string; value: number }[];
  color: string;
}

const LineChart = ({ title, data, color }: LineChartProps) => {
  const chartData = {
    labels: data.map((d) => d.week),
    datasets: [
      {
        label: title,
        data: data.map((d) => d.value),
        fill: true,
        backgroundColor: `${color}33`, // شفافية للخلفية
        borderColor: color,
        tension: 0.3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: color,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#fff",
        titleFont: { weight: "bold" },
        padding: 10,
      },
      title: { display: false },
    },
    interaction: { mode: "nearest" as const, intersect: false },
    scales: {
      x: { ticks: { color: "#D1D5DB" }, grid: { color: "#374151" } },
      y: { ticks: { color: "#D1D5DB" }, grid: { color: "#374151" } },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
