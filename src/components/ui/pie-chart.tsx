"use client";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

// Register necessary elements
ChartJS.register(ArcElement, Tooltip, Legend, Title);
interface PieChartProps {
  labels: string[];
  values: number[];
  title: string;
}

const PieChart = ({ labels, values, title }: PieChartProps) => {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const },
      title: { display: true, text: title },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow max-w-md mx-auto">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;