// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// export default function LineChartComponent({ data }) {
//   if (!data || data.length === 0) return <p>No data</p>;

//   return (
//     <ResponsiveContainer width="100%" height="100%">
//       <LineChart data={data}>
//         <CartesianGrid strokeDasharray="3 3" />

//         {/* Ordered X-axis */}
//         <XAxis dataKey="x" />

//         {/* Numeric Y-axis */}
//         <YAxis />

//         <Tooltip />

//         {/* Trend line */}
//         <Line
//           type="monotone"
//           dataKey="value"
//           stroke="#1E90FF"
//           strokeWidth={3}
//           dot={{ r: 4 }}
//         />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// }


import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function LineChartComponent({ data }) {
  if (!data || data.length === 0) return <p>No data</p>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        {/* Ordered X-axis */}
        <XAxis dataKey="name" />

        {/* Numeric Y-axis */}
        <YAxis />

        <Tooltip />
        <Legend />

        {/* Trend line */}
        <Line
          type="monotone"
          dataKey="value"
          stroke="#1E90FF"
          strokeWidth={3}
          activeDot={{ r: 8 }}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
