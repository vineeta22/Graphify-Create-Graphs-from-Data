// import React from "react";
// import {
//     BarChart as RechartsBarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     Cell,
//     ResponsiveContainer,
// } from "recharts";

// // 🎨 Generate random colors for bars
// const COLORS = Array.from({ length: 50 }, () =>
//     "#" + Math.floor(Math.random() * 16777215).toString(16)
// );

// // 🧾 Custom tooltip for better display
// const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//         const { name, value } = payload[0];
//         return (
//             <div
//                 style={{
//                     backgroundColor: "white",
//                     border: "1px solid #ccc",
//                     padding: "6px",
//                     borderRadius: "4px",
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

// // 🥇 Main BarChart component
// const BarChart = ({ data }) => {
//     if (!data || data.length === 0) return <p>No data to display</p>;

//     return (
//         <ResponsiveContainer width="100%" height={400}>
//             <RechartsBarChart
//                 data={data}
//                 margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
//             >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend />
//                 <Bar dataKey="value" barSize={40}>
//                     {data.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                 </Bar>
//             </RechartsBarChart>
//         </ResponsiveContainer>
//     );
// };

// export default BarChart;



// import React from "react";
// import {
//     BarChart as RechartsBarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     Cell,
//     ResponsiveContainer,
// } from "recharts";

// const COLORS = Array.from({ length: 50 }, () =>
//     "#" + Math.floor(Math.random() * 16777215).toString(16)
// );

// const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//         const { name, value } = payload[0];
//         return (
//             <div style={{ background: "#fff", border: "1px solid #ccc", padding: "5px", borderRadius: "4px" }}>
//                 <p style={{ margin: 0 }}><strong>{name}</strong>: {value}</p>
//             </div>
//         );
//     }
//     return null;
// };

// const BarChart = ({ data }) => {
//     if (!data || data.length === 0) return <p>No data to display</p>;

//     return (
//         <ResponsiveContainer width="100%" height="100%">
//             <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend />
//                 <Bar dataKey="value" barSize={40}>
//                     {data.map((entry, idx) => (
//                         <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
//                     ))}
//                 </Bar>
//             </RechartsBarChart>
//         </ResponsiveContainer>
//     );
// };

// export default BarChart;
