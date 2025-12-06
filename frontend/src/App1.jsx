// import { useForm } from "react-hook-form";
// import { useState } from "react";
// import CSVColumns from "./CSVColumns";

// import ExpensesChart from "./ExpensesChart";
// //import LineChart from "./LineChart";
// //import BarChart from "./BarChart";
// import "./App1.css";

// function App1() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm();


//   const [serverError, setServerError] = useState("");
//   const [csvColumns, setCsvColumns] = useState([]);

//   const [csvData, setCsvData] = useState([]); // Store full CSV rows
//   const [selectedColumn, setSelectedColumn] = useState(null);
//   const [selectedChartType, setSelectedChartType] = useState(null);
//   const [chartError, setChartError] = useState(""); // ✅ for chart-specific errors

//   const onSubmit = async (data) => {

//     setServerError("");
//     setCsvColumns([]);

//     setSelectedColumn(null);
//     setCsvData([]);
//     setChartError(""); // clear previous errors
//     setSelectedChartType(data.chartType); // store selected chart type

//     const formData = new FormData();
//     formData.append("companyName", data.companyName);
//     formData.append("chartType", data.chartType);
//     formData.append("csvFile", data.csvFile[0]); // File input returns an array

//     try {
//       const response = await fetch("/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(errorText || "Server error");
//       }

//       const result = await response.json();
//       //console.log("Server response:", result);
//       if (result.data.length > 0) {
//         setCsvColumns(Object.keys(result.data[0]));

//         setCsvData(result.data); // Store full CSV data
//       }
//       reset();

//     } catch (error) {
//       console.error("Upload failed:", error);
//       setServerError(error.message || "Upload failed");
//     }
//   };

//   // When user clicks a column, set it as selected
//   const handleColumnClick = (column) => {
//     setSelectedColumn(column);
//     setChartError(""); // clear any previous error


//     if (csvData.length === 0) {
//       setChartError("No CSV data loaded.");
//       return;
//     }

//     // Validate if selected column has numeric data
//     const hasNumericData = csvData.some(row => {
//       const val = row[column];
//       return val !== null && val !== undefined && !isNaN(Number(val));
//     });


//     if (!hasNumericData) {
//       setChartError(`Column "${column}" does not contain valid numeric values.`);
//     }
//   };


//   // Prepare chart data based on selected column and csvData
//   // Transform csvData rows to { name: row[firstCol], value: row[selectedColumn] }
//   // If no name column, fallback to row index as name
//   const getChartData = () => {
//     if (!selectedColumn || csvData.length === 0) return [];

//     const nameKey = csvColumns.includes("name") ? "name" : csvColumns[0];

//     return csvData.map((row, idx) => ({
//       name: row[nameKey] || `Row ${idx + 1}`,
//       value: Number(row[selectedColumn]) || 0,
//     }));
//   };

//   // Render selected chart with prepared data
//   const renderChart = () => {

//     if (chartError) {
//       return <p className="error" style={{ color: "red" }}>{chartError}</p>;
//     }

//     const dataForChart = getChartData();

//     if (dataForChart.length === 0) return <p>No data for selected column.</p>;

//     switch (selectedChartType) {
//       case "pie":
//         return <ExpensesChart data={dataForChart} />;
//       case "bar":
//         return <BarChart data={dataForChart} />;
//       // return <p>BarChart component is not imported yet.</p>;
//       case "line":
//         // return <LineChart data={dataForChart} />;
//         return <p>LineChart component is not imported yet.</p>;
//       default:
//         return null;
//     }
//   };



//   return (
//     <div className="login-container">
//       <form onSubmit={handleSubmit(onSubmit)} className="login-box">
//         {/* Company Name */}
//         <label>Company Name</label>
//         <input
//           className={errors.companyName ? "input-error" : ""}
//           {...register("companyName", { required: "Company name is required" })}
//           placeholder="Enter your company name"
//         />
//         {errors.companyName && <p className="error">{errors.companyName.message}</p>}

//         {/* Chart Type */}
//         <label>Choose Chart Type</label>
//         <div className="radio-group">
//           <label>
//             <input type="radio" value="bar" {...register("chartType", { required: "Select a chart type" })} /> Bar Chart
//           </label>
//           <label>
//             <input type="radio" value="pie" {...register("chartType", { required: "Select a chart type" })} /> Pie Chart
//           </label>
//           <label>
//             <input type="radio" value="line" {...register("chartType", { required: "Select a chart type" })} /> Line Chart
//           </label>
//         </div>
//         {errors.chartType && <p className="error">{errors.chartType.message}</p>}

//         {/* CSV File Upload */}
//         <label>Upload CSV File</label>
//         <input
//           type="file"
//           accept=".csv"
//           {...register("csvFile", { required: "CSV file is required" })}
//         />
//         {errors.csvFile && <p className="error">{errors.csvFile.message}</p>}

//         {/* Submit Button */}
//         <button type="submit" disabled={isSubmitting}>
//           {isSubmitting ? "Submitting..." : "Submit"}
//         </button>
//       </form>

//       {/* ✅ Display CSV Columns here with click handler */}
//       <CSVColumns columns={csvColumns} selectedColumn={selectedColumn} onColumnClick={handleColumnClick} />

//       {/* Show the chart when a column is selected */}
//       <div style={{ marginTop: "30px" }}>{selectedColumn && renderChart()}</div>

//       {/* Show server error */}
//       {serverError && <p className="error">{serverError}</p>}

//     </div >
//   );
// }

// export default App1;

// import { useForm } from "react-hook-form";
// import { useState } from "react";
// import ExpensesChart from "./ExpensesChart";
// import "./App1.css";

// function App1() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm();

//   const [serverError, setServerError] = useState("");
//   const [csvColumns, setCsvColumns] = useState([]);
//   const [csvData, setCsvData] = useState([]);
//   const [selectedChartType, setSelectedChartType] = useState(null);
//   const [chartError, setChartError] = useState("");

//   // Dropdown selections
//   const [categoryColumn, setCategoryColumn] = useState("");
//   const [valueColumn, setValueColumn] = useState("");
//   const [chartData, setChartData] = useState([]);

//   // Handle upload
//   const onSubmit = async (data) => {
//     setServerError("");
//     setCsvColumns([]);
//     setCsvData([]);
//     setChartError("");
//     setSelectedChartType(data.chartType);

//     const formData = new FormData();
//     formData.append("companyName", data.companyName);
//     formData.append("chartType", data.chartType);
//     formData.append("csvFile", data.csvFile[0]);

//     try {
//       const response = await fetch("/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(errorText || "Server error");
//       }

//       const result = await response.json();
//       if (result.data.length > 0) {
//         setCsvColumns(Object.keys(result.data[0]));
//         setCsvData(result.data);
//       }
//       reset();
//     } catch (error) {
//       console.error("Upload failed:", error);
//       setServerError(error.message || "Upload failed");
//     }
//   };

//   // Generate chart data
//   const generatePieData = () => {
//     if (!categoryColumn || !valueColumn) {
//       setChartError("Please select both category and value columns.");
//       return;
//     }
//     if (csvData.length === 0) {
//       setChartError("No CSV data available.");
//       return;
//     }

//     // Count category occurrences
//     const grouped = {};
//     csvData.forEach((row) => {
//       const cat = row[categoryColumn];
//       if (cat) grouped[cat] = (grouped[cat] || 0) + 1;
//     });

//     const chartArray = Object.keys(grouped).map((key) => ({
//       name: key,
//       value: grouped[key],
//     }));

//     setChartData(chartArray);
//     setChartError("");
//   };

//   return (
//     <div className="app-container" style={{ padding: "20px", fontFamily: "sans-serif" }}>
//       <h2 className="text-2xl font-semibold mb-4" style={{ textAlign: "center" }}>
//         Excel Pie Chart Generator
//       </h2>

//       {/* Upload Form */}
//       <form onSubmit={handleSubmit(onSubmit)} className="upload-form">
//         <label>Company Name</label>
//         <input
//           className={errors.companyName ? "input-error" : ""}
//           {...register("companyName", { required: "Company name is required" })}
//           placeholder="Enter your company name"
//         />
//         {errors.companyName && <p className="error">{errors.companyName.message}</p>}

//         <label>Choose Chart Type</label>
//         <div className="radio-group">
//           <label>
//             <input type="radio" value="pie" {...register("chartType", { required: "Select a chart type" })} /> Pie Chart
//           </label>
//           <label>
//             <input type="radio" value="bar" {...register("chartType", { required: "Select a chart type" })} /> Bar Chart
//           </label>
//           <label>
//             <input type="radio" value="line" {...register("chartType", { required: "Select a chart type" })} /> Line Chart
//           </label>
//         </div>
//         {errors.chartType && <p className="error">{errors.chartType.message}</p>}

//         <label>Upload CSV File</label>
//         <input type="file" accept=".csv" {...register("csvFile", { required: "CSV file is required" })} />
//         {errors.csvFile && <p className="error">{errors.csvFile.message}</p>}

//         <button type="submit" disabled={isSubmitting}>
//           {isSubmitting ? "Uploading..." : "Upload CSV"}
//         </button>
//       </form>

//       {/* After upload: Show dropdowns */}
//       {csvColumns.length > 0 && (
//         <div className="chart-selection" style={{ textAlign: "center", marginTop: "30px" }}>
//           <label style={{ marginRight: "10px" }}>Category Column:</label>
//           <select value={categoryColumn} onChange={(e) => setCategoryColumn(e.target.value)}>
//             <option value="">Select</option>
//             {csvColumns.map((col) => (
//               <option key={col} value={col}>{col}</option>
//             ))}
//           </select>

//           <label style={{ margin: "0 10px" }}>Value Column:</label>
//           <select value={valueColumn} onChange={(e) => setValueColumn(e.target.value)}>
//             <option value="">Select</option>
//             {csvColumns.map((col) => (
//               <option key={col} value={col}>{col}</option>
//             ))}
//           </select>

//           <button
//             style={{
//               background: "#007bff",
//               color: "white",
//               border: "none",
//               padding: "8px 15px",
//               borderRadius: "5px",
//               marginLeft: "10px",
//             }}
//             onClick={generatePieData}
//           >
//             Generate Chart
//           </button>
//         </div>
//       )}

//       {/* Chart Display */}
//       <div style={{ marginTop: "30px", display: "flex", justifyContent: "center" }}>
//         {chartError && <p style={{ color: "red" }}>{chartError}</p>}
//         {chartData.length > 0 && selectedChartType === "pie" && <ExpensesChart data={chartData} />}
//       </div>

//       {serverError && <p className="error">{serverError}</p>}
//     </div>
//   );
// }

// export default App1;


// // App.jsx

// import React, { useState } from "react";
// import Papa from "papaparse";
// import PieChartComponent from "./Components/PieChartComponent";

// export default function App1() {
//   const [file, setFile] = useState(null);
//   const [previewRows, setPreviewRows] = useState([]);
//   const [columns, setColumns] = useState([]);

//   const [categoryCol, setCategoryCol] = useState("");
//   const [valueCol, setValueCol] = useState("");
//   const [aggMode, setAggMode] = useState("count");

//   const [chartData, setChartData] = useState([]);

//   // Load + preview CSV
//   const handleFile = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;

//     setFile(f);

//     Papa.parse(f, {
//       header: true,
//       skipEmptyLines: true,
//       worker: true,
//       complete: (res) => {
//         setPreviewRows(res.data.slice(0, 10)); // show preview
//         setColumns(Object.keys(res.data[0] || {}));
//         alert("CSV preview loaded!");
//       }
//     });
//   };

//   // Send CSV to backend
//   const uploadToServer = async () => {
//     if (!file) return alert("Please upload a CSV file first");
//     if (!categoryCol) return alert("Select category column");
//     if (aggMode === "sum" && !valueCol) return alert("Select value column");

//     const fd = new FormData();
//     fd.append("csvFile", file);

//     const res = await fetch("http://localhost:5000/upload", {
//       method: "POST",
//       body: fd
//     });

//     const json = await res.json();

//     if (!json.data) return alert("Error reading CSV");

//     // Aggregate
//     const grouped = {};

//     json.data.forEach((row) => {
//       const key = row[categoryCol] || "Unknown";

//       if (aggMode === "count") {
//         grouped[key] = (grouped[key] || 0) + 1;
//       } else {
//         const num = Number(row[valueCol]) || 0;
//         grouped[key] = (grouped[key] || 0) + num;
//       }
//     });

//     const chartArr = Object.keys(grouped).map((k) => ({
//       name: k,
//       value: grouped[k],
//     }));

//     setChartData(chartArr);
//     alert("Chart Generated Successfully!");
//   };

//   return (
//     <div style={{ maxWidth: 900, margin: "20px auto" }}>
//       <h2>CSV → Chart Generator</h2>

//       <input type="file" accept=".csv" onChange={handleFile} />

//       {columns.length > 0 && (
//         <div style={{ marginTop: 12 }}>
//           <label>Category Column: </label>
//           <select value={categoryCol} onChange={(e) => setCategoryCol(e.target.value)}>
//             <option value="">--select--</option>
//             {columns.map((c) => (
//               <option key={c}>{c}</option>
//             ))}
//           </select>

//           <label style={{ marginLeft: 10 }}>Aggregation: </label>
//           <select value={aggMode} onChange={(e) => setAggMode(e.target.value)}>
//             <option value="count">Count</option>
//             <option value="sum">Sum</option>
//           </select>

//           {aggMode === "sum" && (
//             <>
//               <label style={{ marginLeft: 10 }}>Value Column: </label>
//               <select value={valueCol} onChange={(e) => setValueCol(e.target.value)}>
//                 <option value="">--select--</option>
//                 {columns.map((c) => (
//                   <option key={c}>{c}</option>
//                 ))}
//               </select>
//             </>
//           )}

//           <button onClick={uploadToServer} style={{ marginLeft: 10, padding: "5px 12px" }}>
//             Generate Chart
//           </button>
//         </div>
//       )}

//       {/* Preview Table */}
//       {previewRows.length > 0 && (
//         <div style={{ marginTop: 20 }}>
//           <strong>CSV Preview (first 10 rows)</strong>
//           <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
//             <thead>
//               <tr>
//                 {columns.map((h) => (
//                   <th key={h} style={{ borderBottom: "1px solid #ccc", padding: 6 }}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {previewRows.map((r, i) => (
//                 <tr key={i}>
//                   {columns.map((h) => (
//                     <td key={h} style={{ padding: 6, borderBottom: "1px solid #eee" }}>
//                       {r[h]}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Chart Output */}
//       {chartData.length > 0 && (
//         <div style={{ marginTop: 30 }}>
//           <PieChartComponent data={chartData} />
//         </div>
//       )}
//     </div>
//   );
// }

// src/App.jsx
// import React, { useState } from "react";
// import Papa from "papaparse";
// import PieChartComponent from "./Components/PieChartComponent";

// export default function App1() {
//   const [file, setFile] = useState(null);
//   const [previewRows, setPreviewRows] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [categoryCol, setCategoryCol] = useState("");
//   const [valueCol, setValueCol] = useState("");
//   const [aggMode, setAggMode] = useState("count");
//   const [chartData, setChartData] = useState([]);
//   const [statusMsg, setStatusMsg] = useState("");

//   const handleFile = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     setFile(f);
//     Papa.parse(f, {
//       header: true,
//       skipEmptyLines: true,
//       worker: true,
//       preview: 200,
//       complete: (res) => {
//         setPreviewRows(res.data.slice(0, 10));
//         setColumns(Object.keys(res.data[0] || {}));
//         setStatusMsg(`Preview loaded (${res.data.length} rows).`);
//       },
//     });
//   };

//   const uploadToServer = async () => {
//     if (!file) return alert("Please upload a CSV file first");
//     if (!categoryCol) return alert("Select category column");
//     const fd = new FormData();
//     fd.append("csvFile", file);

//     try {
//       setStatusMsg("Uploading...");
//       const res = await fetch("http://localhost:5000/upload", { method: "POST", body: fd });
//       const json = await res.json();
//       if (!json || !json.data) {
//         setStatusMsg("No data returned from server");
//         return;
//       }

//       // aggregate
//       const grouped = {};
//       json.data.forEach((row) => {
//         const key = (row[categoryCol] || "Unknown").toString();
//         if (aggMode === "count") grouped[key] = (grouped[key] || 0) + 1;
//         else grouped[key] = (grouped[key] || 0) + Number(row[valueCol] || 0);
//       });
//       const arr = Object.keys(grouped).map(k => ({ name: k, value: grouped[k] }));
//       setChartData(arr);
//       setStatusMsg("Chart ready");
//     } catch (err) {
//       console.error(err);
//       setStatusMsg("Upload failed: " + err.message);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 1100, margin: "12px auto", color: "#111", fontFamily: "Arial, sans-serif" }}>
//       <h2>CSV → Chart Generator</h2>
//       <input type="file" accept=".csv" onChange={handleFile} />
//       {columns.length > 0 && (
//         <div style={{ marginTop: 12 }}>
//           <label>Category Column:</label>
//           <select value={categoryCol} onChange={(e) => setCategoryCol(e.target.value)}>
//             <option value="">--select--</option>
//             {columns.map(c => <option key={c} value={c}>{c}</option>)}
//           </select>

//           <label style={{ marginLeft: 12 }}>Aggregation:</label>
//           <select value={aggMode} onChange={(e) => setAggMode(e.target.value)}>
//             <option value="count">Count</option>
//             <option value="sum">Sum</option>
//           </select>

//           {aggMode === "sum" && (
//             <>
//               <label style={{ marginLeft: 12 }}>Value Column:</label>
//               <select value={valueCol} onChange={(e) => setValueCol(e.target.value)}>
//                 <option value="">--select--</option>
//                 {columns.map(c => <option key={c} value={c}>{c}</option>)}
//               </select>
//             </>
//           )}

//           <button onClick={uploadToServer} style={{ marginLeft: 12 }}>Generate Chart</button>
//         </div>
//       )}

//       <div style={{ marginTop: 12, color: "#666" }}>{statusMsg}</div>

//       {/* Chart wrapper: pixel height ensures ResponsiveContainer measures > 0 */}
//       <div style={{ marginTop: 20 }}>
//         {chartData.length === 0 ? (
//           <div style={{ color: "#999" }}>No chart yet. Upload CSV and generate.</div>
//         ) : (
//           <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
//             <PieChartComponent data={chartData} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// src/App.jsx
import React, { useState } from "react";
import Papa from "papaparse";
import PieChartComponent from "./components/PieChartComponent";

export default function App() {
  const [file, setFile] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const [categoryCol, setCategoryCol] = useState("");
  const [valueCol, setValueCol] = useState("");
  const [aggMode, setAggMode] = useState("count"); // 'count' | 'sum'

  const [chartData, setChartData] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");

  // Preview CSV with PapaParse
  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setStatusMsg("Parsing preview...");
    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      preview: 1000, // preview many rows so type detection works
      complete: (res) => {
        const rows = res.data || [];
        setPreviewRows(rows.slice(0, 500)); // keep preview limited
        setColumns(Object.keys(rows[0] || {}));
        setStatusMsg(`Preview loaded (${rows.length} rows parsed).`);
      },
      error: (err) => {
        console.error("PapaParse error:", err);
        setStatusMsg("Failed to parse CSV preview.");
      },
    });
  };

  // helper: check whether a column in preview has numeric values (>= fraction)
  const isColumnMostlyNumeric = (col, threshold = 0.7) => {
    if (!previewRows || previewRows.length === 0) return false;
    let numericCount = 0;
    let totalChecked = 0;
    for (let i = 0; i < previewRows.length; i++) {
      const val = previewRows[i][col];
      if (val === undefined || val === null || String(val).trim() === "") continue;
      totalChecked++;
      const n = Number(String(val).replace(/,/g, ""));
      if (!Number.isNaN(n)) numericCount++;
      // stop early if enough tested
      if (totalChecked >= 200) break;
    }
    if (totalChecked === 0) return false;
    return numericCount / totalChecked >= threshold;
  };

  // Called when user clicks Generate Chart
  const generateChart = async () => {
    if (!file) {
      alert("Please choose a CSV file first.");
      return;
    }
    if (!categoryCol) {
      alert("Please select a category column.");
      return;
    }

    // If user picked SUM, validate value column is numeric-ish
    if (aggMode === "sum") {
      if (!valueCol) {
        alert("Please select a value column for SUM aggregation.");
        return;
      }
      const numericOk = isColumnMostlyNumeric(valueCol);
      if (!numericOk) {
        const useCount = window.confirm(
          `Selected value column "${valueCol}" does not look numeric. ` +
          `Do you want to switch to COUNT aggregation instead? (OK = yes, Cancel = no)`
        );
        if (useCount) {
          setAggMode("count");
        } else {
          // continue but warn that non-numeric values will be coerced to 0
          setStatusMsg("Warning: non-numeric values in value column will be treated as 0.");
        }
      }
    }

    setStatusMsg("Uploading file and fetching rows from server...");
    const fd = new FormData();
    fd.append("csvFile", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: fd
      });

      const json = await res.json();
      console.log("Server returned:", json);

      if (!json || !Array.isArray(json.data)) {
        setStatusMsg("Server did not return CSV rows. Check server logs.");
        alert("Server error: no data returned.");
        return;
      }

      // Aggregate safely: parse floats for SUM, fallback to COUNT if needed
      const grouped = Object.create(null);
      json.data.forEach(row => {
        const catRaw = row[categoryCol];
        const categoryKey = (catRaw === undefined || catRaw === null || String(catRaw).trim() === "") ? "Unknown" : String(catRaw).trim();

        if (aggMode === "count") {
          grouped[categoryKey] = (grouped[categoryKey] || 0) + 1;
        } else {
          // SUM mode: parse number, remove commas
          const raw = row[valueCol];
          const cleaned = raw === undefined || raw === null ? "" : String(raw).replace(/,/g, "").trim();
          const n = Number(cleaned);
          grouped[categoryKey] = (grouped[categoryKey] || 0) + (Number.isNaN(n) ? 0 : n);
        }
      });

      // Make array
      let dataArr = Object.keys(grouped).map(k => ({ name: k, value: grouped[k] }));
      // sort desc
      dataArr.sort((a,b) => b.value - a.value);

      // If SUM mode and all values are 0, fallback to COUNT mode automatically (very likely non-numeric)
      const allZero = dataArr.every(d => d.value === 0);
      if (aggMode === "sum" && allZero) {
        // recompute using count
        const counts = {};
        json.data.forEach(row => {
          const cat = (row[categoryCol] === undefined || row[categoryCol] === null) ? "Unknown" : String(row[categoryCol]).trim();
          counts[cat] = (counts[cat] || 0) + 1;
        });
        dataArr = Object.keys(counts).map(k => ({ name: k, value: counts[k] })).sort((a,b)=>b.value-a.value);
        setStatusMsg("SUM produced all zeros; automatically switched to COUNT aggregation.");
      } else {
        setStatusMsg(`Chart ready (${dataArr.length} slices).`);
      }

      // Optionally group small slices into Others (top 12 + others)
      const TOP = 12;
      if (dataArr.length > TOP) {
        const top = dataArr.slice(0, TOP);
        const othersSum = dataArr.slice(TOP).reduce((s,d)=>s+d.value, 0);
        top.push({ name: "Others", value: othersSum });
        dataArr = top;
      }

      setChartData(dataArr);
    } catch (err) {
      console.error("Upload error", err);
      setStatusMsg("Upload failed: " + err.message);
      alert("Upload failed: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "12px auto", color: "#eee", fontFamily: "Arial, sans-serif" }}>
      <h2>CSV → Chart Generator</h2>

      <div style={{ marginBottom: 10 }}>
        <input type="file" accept=".csv" onChange={handleFile} />
      </div>

      {/* Column selectors */}
      {columns.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <label>Category Column: </label>
          <select value={categoryCol} onChange={e => setCategoryCol(e.target.value)}>
            <option value="">--select--</option>
            {columns.map(c => <option value={c} key={c}>{c}</option>)}
          </select>

          <label style={{ marginLeft: 12 }}>Aggregation: </label>
          <select value={aggMode} onChange={e => setAggMode(e.target.value)}>
            <option value="count">Count</option>
            <option value="sum">Sum</option>
          </select>

          {aggMode === "sum" && (
            <>
              <label style={{ marginLeft: 12 }}>Value Column: </label>
              <select value={valueCol} onChange={e => setValueCol(e.target.value)}>
                <option value="">--select--</option>
                {columns.map(c => <option value={c} key={c}>{c}</option>)}
              </select>
            </>
          )}

          <button onClick={generateChart} style={{ marginLeft: 12, padding: "6px 12px" }}>Generate Chart</button>
        </div>
      )}

      <div style={{ marginTop: 8, color: "#ccc" }}>{statusMsg}</div>

      {/* Preview */}
      {previewRows.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <strong>Preview (first rows)</strong>
          <div style={{ maxHeight: 220, overflow: "auto", marginTop: 8, border: "1px solid #444", padding: 8 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
              <thead>
                <tr>
                  {columns.map(h => <th key={h} style={{ textAlign: "left", padding: 6, borderBottom: "1px solid #555" }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {previewRows.slice(0, 10).map((r, i) => (
                  <tr key={i}>
                    {columns.map(h => <td key={h} style={{ padding: 6, borderBottom: "1px solid #333" }}>{r[h]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Chart area: fixed pixel height so ResponsiveContainer can render */}
      <div style={{ marginTop: 24 }}>
        {chartData.length === 0 ? (
          <div style={{ color: "#bbb" }}>No chart yet</div>
        ) : (
          <div style={{ width: "100%", height: 420, background: "#fff", borderRadius: 8, padding: 8 }}>
            <PieChartComponent data={chartData} />
          </div>
        )}
      </div>
    </div>
  );
}
