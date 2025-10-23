"use client";
import { useEffect, useState } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface RadialChartProps {
  value: number; // 0-100
  label?: string;
  size?: number;
  color?: string;
}

const RadialChart = ({ value, label = "", size = 120, color = "#FACC15" }: RadialChartProps) => {
  const [progress, setProgress] = useState(0);

  // Animate the progress on mount
  useEffect(() => {
    let start = 0;
    const step = value / 60; // animate in ~1 second (60 frames)
    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        setProgress(value);
        clearInterval(interval);
      } else {
        setProgress(start);
      }
    }, 16); // roughly 60fps
    return () => clearInterval(interval);
  }, [value]);

  return (
    <div style={{ width: size, height: size, margin: "0 auto" }}>
      <CircularProgressbarWithChildren
        value={progress}
        strokeWidth={10}
        styles={buildStyles({
          pathColor: color,
          trailColor: "#2d2d2d",
          strokeLinecap: "round",
        })}
      >
        <div className="flex flex-col items-center justify-center">
          <span className="text-white font-bold text-lg">
            {Math.round(progress)}%
          </span>
          {label && <span className="text-gray-300 text-sm mt-1">{label}</span>}
        </div>
      </CircularProgressbarWithChildren>
    </div>
  );
};

export default RadialChart;
