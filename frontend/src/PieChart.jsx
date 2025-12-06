// // src/PieChart.jsx
// import React from "react";
// import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
//     const RADIAN = Math.PI / 180;
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);

//     return (
//         <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
//             {`${(percent * 100).toFixed(0)}%`}
//         </text>
//     );
// };

// const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//         return (
//             <div className="custom-tooltip" >
//                 <p className="label">
//                     {payload[0].name} : ${payload[0].value}</p>
//             </div>
//         );
//     }

//     return null;
// };

// const ExpensesChart = ({ data }) => {
//     if (!data || data.length === 0) return <p>No data to display</p>;

//     return (
//         <PieChart width={600} height={300}>
//             <Pie
//                 data={data}
//                 dataKey="value"
//                 nameKey="name"
//                 label={renderCustomizedLabel}
//                 labelLine={false}
//             >
//                 {data.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//             </Pie>
//             <Tooltip content={<CustomTooltip />} />
//             <Legend />
//         </PieChart>
//     );
// };

// export default PieChart;
// src/PieChar.jsx
// src/PieChart.jsx


// import React from "react";
// import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
//     const RADIAN = Math.PI / 180;
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);

//     return (
//         <text
//             x={x}
//             y={y}
//             fill="white"
//             textAnchor={x > cx ? "start" : "end"}
//             dominantBaseline="central"
//             fontSize={12}
//             fontWeight="bold"
//         >
//             {`${(percent * 100).toFixed(0)}%`}
//         </text>
//     );
// };

// const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//         const { name, value } = payload[0];
//         return (
//             <div
//                 className="custom-tooltip"
//                 style={{
//                     backgroundColor: "white",
//                     border: "1px solid #ccc",
//                     padding: "5px",
//                     borderRadius: "3px",
//                 }}
//             >
//                 <p style={{ margin: 0 }}>
//                     <strong>{name}</strong>: ${value}
//                 </p>
//             </div>
//         );
//     }
//     return null;
// };

// const ExpensesChart = ({ data }) => {
//     if (!data || data.length === 0) return <p>No data to display</p>;

//     return (
//         <RechartsPieChart width={600} height={400}>
//             <Pie
//                 data={data}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={120}
//                 label={renderCustomizedLabel}
//                 labelLine={false}
//             >
//                 {data.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//             </Pie>
//             <Tooltip content={<CustomTooltip />} />
//             <Legend verticalAlign="bottom" height={36} />
//         </RechartsPieChart>
//     );
// };

// export default ExpensesChart;


// import React from "react";
// import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// // 🎨 Generate 50 random colors automatically
// const COLORS = Array.from({ length: 50 }, () =>
//     "#" + Math.floor(Math.random() * 16777215).toString(16)
// );

// //📊 Custom percentage label inside pie slices
// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
//     const RADIAN = Math.PI / 180;
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);

//     return (
//         <text
//             x={x}
//             y={y}
//             fill="white"
//             textAnchor={x > cx ? "start" : "end"}
//             dominantBaseline="central"
//             fontSize={12}
//             fontWeight="bold"
//         >
//             {`${(percent * 100).toFixed(0)}%`}
//         </text>
//     );
// };

// // 🧾 Tooltip on hover
// const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//         const { name, value } = payload[0];
//         return (
//             <div
//                 className="custom-tooltip"
//                 style={{
//                     backgroundColor: "white",
//                     border: "1px solid #ccc",
//                     padding: "5px",
//                     borderRadius: "3px",
//                 }}
//             >
//                 <p style={{ margin: 0 }}>
//                     <strong>{name}</strong>: {value}
//                 </p>
//             </div>
//         );
//     }
//     return null;
// };

// // 🥧 Main Pie Chart component
// const ExpensesChart = ({ data }) => {
//     if (!data || data.length === 0) return <p>No data to display</p>;

//     return (
//         <RechartsPieChart width={600} height={400}>
//             <Pie
//                 data={data}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={120}
//                 label={renderCustomizedLabel}
//                 labelLine={false}
//             >
//                 {data.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//             </Pie>
//             <Tooltip content={<CustomTooltip />} />
//             <Legend verticalAlign="bottom" height={36} />
//         </RechartsPieChart>
//     );
// };

// export default ExpensesChart;

// import React from "react";
// import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// // 🎨 Random color palette
// const COLORS = Array.from({ length: 50 }, () =>
//     "#" + Math.floor(Math.random() * 16777215).toString(16)
// );

// // 📊 Custom percentage label inside pie slices
// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
//     const RADIAN = Math.PI / 180;
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);

//     return (
//         <text
//             x={x}
//             y={y}
//             fill="white"
//             textAnchor={x > cx ? "start" : "end"}
//             dominantBaseline="central"
//             fontSize={12}
//             fontWeight="bold"
//         >
//             {`${(percent * 100).toFixed(0)}%`}
//         </text>
//     );
// };

// // 🧾 Tooltip
// const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//         const { name, value } = payload[0];
//         return (
//             <div
//                 style={{
//                     backgroundColor: "white",
//                     border: "1px solid #ccc",
//                     padding: "5px",
//                     borderRadius: "3px",
//                 }}
//             >
//                 <p style={{ margin: 0 }}>
//                     <strong>{name}</strong>: {value}
//                 </p>
//             </div>
//         );
//     }
//     return null;
// };

// // 🥧 Main Pie Chart
// const ExpensesChart = ({ data }) => {
//     if (!data || data.length === 0) return <p>No data to display</p>;

//     return (
//         <RechartsPieChart width={600} height={400}>
//             <Pie
//                 data={data}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={120}
//                 label={renderCustomizedLabel}
//                 labelLine={false}
//             >
//                 {data.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//             </Pie>
//             <Tooltip content={<CustomTooltip />} />
//             <Legend verticalAlign="bottom" height={36} />
//         </RechartsPieChart>
//     );
// };

// export default ExpensesChart;

// src/components/PieChartComponent.jsx
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const PALETTE = ["#FF7F50","#1E90FF","#FFD700","#32CD32","#FF69B4","#8A2BE2","#20B2AA","#DC143C","#FFA500","#00CED1","#9370DB","#FF1493"];

export default function PieChartComponent({ data = [] }) {
  if (!data || data.length === 0) return <div>No data</div>;

  const total = data.reduce((s, d) => s + d.value, 0);
  const enriched = data.map(d => ({ ...d, percent: total === 0 ? 0 : d.value / total }));

  return (
    // outer div gives a measured height so ResponsiveContainer isn't measuring 0
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={enriched} dataKey="value" nameKey="name" cx="50%" cy="48%" outerRadius="60%" label={({ name, percent }) => `${name} ${Math.round(percent*100)}%`} labelLine={false}>
            {enriched.map((entry, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
          </Pie>
          <Tooltip formatter={(v) => v} />
          <Legend verticalAlign="bottom" height={48} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
