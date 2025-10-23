"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Map of regions -> coordinates
const regionCoordinates: Record<string, [number, number]> = {
  "Abu Dhabi": [24.4667, 54.3667],
  Doha: [25.29, 51.53],
  Sharjah: [25.33, 55.52],
  Riyadh: [24.71, 46.68],
  Manama: [26.2279, 50.5857],
  Muscat: [23.59, 58.38],
  "Kuwait City": [29.3697, 47.9783],
};

interface HeatMapProps {
  data: any[];
  title: string;
  valueKey: string;
}

const HeatMap: React.FC<HeatMapProps> = ({ data, title, valueKey }) => {
  const validData = data.filter((item) => regionCoordinates[item.region]);

  if (validData.length === 0) return <div>No valid data for heatmap</div>;

  const maxValue = Math.max(...validData.map((item) => Number(item[valueKey]) || 0));

  const centerLat =
    validData.reduce((sum, item) => sum + regionCoordinates[item.region][0], 0) /
    validData.length;
  const centerLng =
    validData.reduce((sum, item) => sum + regionCoordinates[item.region][1], 0) /
    validData.length;

  const centerCoordinates: [number, number] = [centerLat, centerLng];

  return (
    <div>
      <h2 className="text-xl mb-5 text-white">{title}</h2>
      <MapContainer
        className="w-full h-[600px] rounded-lg shadow-lg"
        zoom={5}
        center={centerCoordinates}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {validData.map((item) => {
          const coordinates = regionCoordinates[item.region];
          const value = Number(item[valueKey]) || 0;

          // Color gradient: blue -> yellow -> red
          const ratio = value / maxValue;
          let color = "";
          if (ratio < 0.33) color = "#3b82f6"; // blue
          else if (ratio < 0.66) color = "#facc15"; // yellow
          else color = "#ef4444"; // red

          const radius = Math.max(8, ratio * 40);

          return (
            <CircleMarker
              key={item.region}
              center={coordinates}
              radius={radius}
              color={color}
              fillColor={color}
              fillOpacity={0.6}
              className="transition-transform duration-300 hover:scale-125 hover:fill-opacity-0.8"
            >
              <Popup className="text-gray-900">
                <strong>{item.region}</strong>
                <br />
                Revenue: ${item.revenue.toLocaleString()}
                <br />
                Spend: ${item.spend.toLocaleString()}
                <br />
                Clicks: {item.clicks?.toLocaleString()}
                <br />
                Conversions: {item.conversions}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default HeatMap;
