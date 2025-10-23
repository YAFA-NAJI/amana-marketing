# Marketing Dashboard

A modern, interactive dashboard for marketing campaign analytics. This project provides insights across **Demographics, Weekly Performance, Regional Performance, and Device Performance** using highly interactive and visually appealing components.

---

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Pages](#pages)
   - [Demographic View](#demographic-view)
   - [Weekly View](#weekly-view)
   - [Region View](#region-view)
   - [Device View](#device-view)
4. [Components](#components)
5. [Installation](#installation)
6. [Deployment](#deployment)

---

## Overview
This dashboard uses **Next.js**, **Tailwind CSS**, and **React** components to provide real-time, interactive insights on marketing campaigns. It is designed to be **responsive, visually appealing, and easy to navigate**.

---

## Features
- **Interactive Charts:** Line Charts, Bar Charts, Radial Charts, and Bubble Maps.
- **Dynamic Data Aggregation:** Automatically summarizes metrics by demographics, regions, weeks, and devices.
- **Responsive Layouts:** Fully responsive for desktop and mobile devices.
- **Hover Animations and Gradients:** Engaging UI elements to enhance user experience.
- **Dynamic Importing:** Heavy components like charts are loaded dynamically for faster performance.

---

## Pages

### 1. Demographic View
Displays performance data segmented by **Gender** and **Age Group**.

**Features:**
- Metric cards for clicks, spend, and revenue by gender.
- Bar charts showing spend and revenue by age group.
- Interactive tables for male and female age group performance.
- Hover animations and smooth gradients for visual appeal.

**Key Components:**
- `CardMetric`: Displays KPIs in a visually appealing card.
- `BarChart`: Shows age group spend/revenue trends.
- `Table`: Lists demographic performance metrics.

---

### 2. Weekly View
Displays **weekly aggregated performance** of campaigns.

**Features:**
- Interactive Line Charts for revenue and spend trends.
- Smooth animations for lines to indicate growth.
- Fully responsive charts with color differentiation.

**Key Components:**
- `LineChart`: Displays weekly metrics dynamically.
- Aggregation logic calculates total revenue or spend per week.

---

### 3. Region View
Shows **campaign performance by geographic regions**.

**Features:**
- Interactive **Heat/Bubble Map** showing revenue by region.
- Circle size represents magnitude of performance (e.g., revenue or spend).
- Popups on each city display exact metrics.
- Dynamic centering and responsive map layout.

**Key Components:**
- `HeatMap`: Displays a Leaflet map with CircleMarkers sized by value.
- Aggregation function calculates metrics for each region across campaigns.

---

### 4. Device View
Compares performance between **Desktop** and **Mobile** campaigns.

**Features:**
- Interactive **Radial Charts** showing ROAS per device.
- Metric cards display impressions, clicks, spend, and revenue.
- Animated hover effects for cards and charts.
- Dynamic gradient backgrounds for engagement.

**Key Components:**
- `RadialChart`: Circular progress visualization for ROAS.
- Card layout combines numeric KPIs with interactive visualization.

**Data Aggregation Example:**
```ts
const deviceData = campaigns.reduce((acc, campaign) => {
  campaign.device_performance.forEach((d) => {
    if (!acc[d.device]) acc[d.device] = { impressions: 0, clicks: 0, spend: 0, revenue: 0 };
    acc[d.device].impressions += d.impressions;
    acc[d.device].clicks += d.clicks;
    acc[d.device].spend += d.spend;
    acc[d.device].revenue += d.revenue;
  });
  return acc;
}, {});
