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


import React, { useState } from "react";
import Papa from "papaparse";
import PieChartComponent from "./Components/PieChartComponent";
import BarChartComponent from "./Components/BarChartComponent";
import LineChartComponent from "./Components/LineChartComponent";
import "./App1.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [previewRows, setPreviewRows] = useState([]);

  // Configuration
  const [categoryCol, setCategoryCol] = useState("");
  const [valueCol, setValueCol] = useState("");
  const [chartType, setChartType] = useState("pie"); // 'pie' | 'bar' | 'line'
  const [aggMode, setAggMode] = useState("count"); // 'count' | 'sum'

  const [chartData, setChartData] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Handle File Selection
  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setStatusMsg("Parsing preview...");

    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      preview: 50, // Preview first 50 rows
      complete: (res) => {
        const rows = res.data || [];
        setPreviewRows(rows);
        setColumns(Object.keys(rows[0] || {}));
        setStatusMsg("");
      },
      error: (err) => {
        console.error("PapaParse error:", err);
        setStatusMsg("Failed to parse CSV preview.");
      },
    });
  };

  // Generate Chart Logic
  const generateChart = async () => {
    if (!file) return alert("Please upload a CSV file.");
    if (!categoryCol) return alert("Please select a category column.");
    if (aggMode === "sum" && !valueCol) return alert("Please select a value column.");

    setIsUploading(true);
    setStatusMsg("Processing data...");

    const fd = new FormData();
    fd.append("csvFile", file);

    try {
      // 1. Upload to backend
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: fd
      });

      if (!res.ok) throw new Error("Server error");

      const json = await res.json();
      const allRows = json.data;

      if (!allRows || !allRows.length) {
        throw new Error("No data returned from server.");
      }

      // 2. Process Data locally with Auto-Fallback
      const processData = (rows, mode) => {
        const grouped = {};
        let validSumCount = 0;

        rows.forEach(row => {
          let cat = row[categoryCol];
          if (cat === undefined || cat === null || String(cat).trim() === "") {
            cat = "Unknown";
          } else {
            cat = String(cat).trim();
          }

          if (mode === "count") {
            grouped[cat] = (grouped[cat] || 0) + 1;
            validSumCount++;
          } else {
            // Sum mode
            let rawVal = row[valueCol];
            if (rawVal === undefined || rawVal === null) rawVal = "";

            // Remove commas and currency symbols, keep digits/dots/minus
            const cleanVal = String(rawVal).replace(/[^0-9.-]/g, "");
            const val = parseFloat(cleanVal);

            if (!isNaN(val)) {
              grouped[cat] = (grouped[cat] || 0) + val;
              validSumCount++;
            }
          }
        });

        // Convert to array
        let dataArr = Object.keys(grouped).map(k => ({
          name: k,
          value: grouped[k]
        }));

        return { dataArr, validSumCount };
      };

      // Execution
      let { dataArr, validSumCount } = processData(allRows, aggMode);
      let finalMsg = "Chart generated successfully!";

      // FALLBACK: If Sum fails (no valid numbers), try Count automatically
      if (aggMode === "sum" && validSumCount === 0) {
        console.warn("Sum mode failed (no numbers). Switching to count.");
        const fallback = processData(allRows, "count");
        dataArr = fallback.dataArr;
        if (dataArr.length > 0) {
          finalMsg = "Selected column has non-numeric data. Showing 'Count' instead.";
        }
      }

      // Sort by value desc
      dataArr.sort((a, b) => b.value - a.value);

      // Take top 15 + Others
      if (dataArr.length > 15) {
        const top = dataArr.slice(0, 15);
        const others = dataArr.slice(15).reduce((acc, curr) => acc + curr.value, 0);
        top.push({ name: "Others", value: others });
        dataArr = top;
      }

      setChartData(dataArr);

      if (dataArr.length === 0) {
        setStatusMsg("Error: No data found.");
      } else {
        setStatusMsg(finalMsg);
      }

    } catch (err) {
      console.error(err);
      setStatusMsg("Error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Data Visualizer</h1>
        <p className="subtitle">Transform your CSV data into beautiful charts in seconds.</p>
      </header>

      <main className="main-content">
        <div className="control-panel card">
          <div className="section-title">
            <h2>Configuration</h2>
          </div>

          {/* File Upload */}
          <div className="form-group">
            <label className="label">Upload CSV</label>
            <div className="file-input-wrapper">
              <input type="file" accept=".csv" onChange={handleFile} id="csv-upload" className="file-input" />
              <label htmlFor="csv-upload" className="file-label">
                {file ? file.name : "Choose file..."}
              </label>
            </div>
          </div>

          {columns.length > 0 && (
            <>
              {/* Chart Type */}
              <div className="form-group">
                <label className="label">Chart Type</label>
                <div className="toggle-group">
                  <button
                    className={`toggle-btn ${chartType === 'pie' ? 'active' : ''}`}
                    onClick={() => setChartType('pie')}
                  >
                    Pie
                  </button>
                  <button
                    className={`toggle-btn ${chartType === 'bar' ? 'active' : ''}`}
                    onClick={() => setChartType('bar')}
                  >
                    Bar
                  </button>
                  <button
                    className={`toggle-btn ${chartType === 'line' ? 'active' : ''}`}
                    onClick={() => setChartType('line')}
                  >
                    Line
                  </button>
                </div>
              </div>

              {/* Aggregation Mode */}
              <div className="form-group">
                <label className="label">Aggregation</label>
                <select
                  className="select-input"
                  value={aggMode}
                  onChange={(e) => setAggMode(e.target.value)}
                >
                  <option value="count">Count Occurrences</option>
                  <option value="sum">Sum Values</option>
                </select>
              </div>

              {/* Columns Selection */}
              <div className="form-row">
                <div className="form-group">
                  <label className="label">Category Column</label>
                  <select
                    className="select-input"
                    value={categoryCol}
                    onChange={(e) => setCategoryCol(e.target.value)}
                  >
                    <option value="">Select Column</option>
                    {columns.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {aggMode === 'sum' && (
                  <div className="form-group">
                    <label className="label">Value Column</label>
                    <select
                      className="select-input"
                      value={valueCol}
                      onChange={(e) => setValueCol(e.target.value)}
                    >
                      <option value="">Select Column</option>
                      {columns.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <button
                className="btn-primary"
                onClick={generateChart}
                disabled={isUploading}
              >
                {isUploading ? "Processing..." : "Generate Visualization"}
              </button>
            </>
          )}

          {statusMsg && <div className="status-message">{statusMsg}</div>}
        </div>

        {/* Chart Display Area */}
        <div className="chart-preview card">
          {chartData.length > 0 ? (
            <div className="chart-container">
              <h3>Preview</h3>
              {chartType === 'pie' && <PieChartComponent data={chartData} />}
              {chartType === 'bar' && <BarChartComponent data={chartData} />}
              {chartType === 'line' && (
                <div style={{ width: '100%', height: 400 }}>
                  <LineChartComponent data={chartData} />
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <div className="placeholder-icon">📊</div>
              <p>Upload a file and configure settings to view your chart.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
