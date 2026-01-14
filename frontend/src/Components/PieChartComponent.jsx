// src/components/PieChartComponent.jsx
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const PALETTE = ["#FF7F50","#1E90FF","#FFD700","#32CD32","#FF69B4","#8A2BE2","#20B2AA","#DC143C","#FFA500","#00CED1"];

export default function PieChartComponent({ data = [] }) {
  if (!data || data.length === 0) return <div style={{ color: "#bbb" }}>No data</div>;

  const chartData = [...data].sort((a,b) => b.value - a.value);
  const total = chartData.reduce((s,d) => s + d.value, 0);
  const enriched = chartData.map(d => ({ ...d, percent: total === 0 ? 0 : d.value / total }));

  return (
   
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={enriched}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="70%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
          >
            {enriched.map((entry, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke="#ffffff" strokeWidth={1} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => v} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
