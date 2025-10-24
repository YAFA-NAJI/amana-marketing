"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { LatLngExpression, LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

const regionCoordinates: Record<string, [number, number]> = {
  "Abu Dhabi": [24.4667, 54.3667],
  Doha: [25.29, 51.53],
  Sharjah: [25.33, 55.52],
  Riyadh: [24.71, 46.68],
  Manama: [26.2279, 50.5857],
  Muscat: [23.59, 58.38],
  "Kuwait City": [29.3697, 47.9783],
};

interface HeatMapDataItem {
  region: string;
  revenue: number;
  spend: number;
  clicks?: number;
  conversions?: number;
}

interface HeatMapProps {
  data: HeatMapDataItem[];
  title: string;
  valueKey: keyof HeatMapDataItem;
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

  const centerCoordinates: LatLngExpression = [centerLat, centerLng];

  return (
    <div>
      <h2 className="text-xl mb-5 text-white">{title}</h2>

      {/* ScrollWheelZoom و center و zoom تتم تمريرهم مباشرة */}
      <MapContainer
        center={centerCoordinates as LatLngExpression}
        zoom={5}
        style={{ width: "100%", height: "600px", borderRadius: "0.5rem" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {validData.map((item) => {
          const coordinates: LatLngExpression = regionCoordinates[item.region];
          const value = Number(item[valueKey]) || 0;
          const ratio = value / maxValue;

          let color = "";
          if (ratio < 0.33) color = "#3b82f6";
          else if (ratio < 0.66) color = "#facc15";
          else color = "#ef4444";

          const radius = Math.max(8, ratio * 40);

          return (
            <CircleMarker
              key={item.region}
              center={coordinates}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.6 }}
              radius={radius}
              eventHandlers={{
                mouseover: (e: LeafletMouseEvent) =>
                  e.target.setStyle({ fillOpacity: 0.8 }),
                mouseout: (e: LeafletMouseEvent) =>
                  e.target.setStyle({ fillOpacity: 0.6 }),
              }}
            >
              <Popup className="text-gray-900">
                <strong>{item.region}</strong>
                <br />
                Revenue: ${item.revenue.toLocaleString()}
                <br />
                Spend: ${item.spend.toLocaleString()}
                <br />
                Clicks: {item.clicks?.toLocaleString() || 0}
                <br />
                Conversions: {item.conversions || 0}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default HeatMap;
