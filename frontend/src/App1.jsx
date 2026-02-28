import React, { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import html2canvas from "html2canvas";
import PieChartComponent from "./Components/PieChartComponent";
import BarChartComponent from "./Components/BarChartComponent";
import LineChartComponent from "./Components/LineChartComponent";
import "./App1.css";

import { useAuth } from "./context/AuthContext";

import {
  detectColumnType,
  detectTrend,
  recommendChart
} from "./utils/autoInsights";


export default function App1() {
  const { user, token, logout } = useAuth();

  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [previewRows, setPreviewRows] = useState([]);

  // Configuration
  const [categoryCol, setCategoryCol] = useState("");
  const [valueCol, setValueCol] = useState("");
  const [chartType, setChartType] = useState("pie");
  const [aggMode, setAggMode] = useState("count");

  const [chartData, setChartData] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Chart history
  const [chartHistory, setChartHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyTab, setHistoryTab] = useState("uploads"); // 'uploads' | 'charts'

  // Upload history
  const [uploadHistory, setUploadHistory] = useState([]);

  // Ref for chart download
  const chartRef = useRef(null);

  // Fetch histories on mount
  useEffect(() => {
    if (token) {
      fetchHistory();
      fetchUploadHistory();
    }
  }, [token]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/charts/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.charts) setChartHistory(data.charts);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const fetchUploadHistory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/uploads/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.uploads) setUploadHistory(data.uploads);
    } catch (err) {
      console.error("Failed to fetch upload history:", err);
    }
  };

  // Handle File Selection
  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setStatusMsg("Parsing preview...");

    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      preview: 50,
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
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });

      if (!res.ok) throw new Error("Server error");

      const json = await res.json();
      const allRows = json.data;

      if (!allRows || !allRows.length) {
        throw new Error("No data returned from server.");
      }

      // Process Data
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
            let rawVal = row[valueCol];
            if (rawVal === undefined || rawVal === null) rawVal = "";
            const cleanVal = String(rawVal).replace(/[^0-9.-]/g, "");
            const val = parseFloat(cleanVal);
            if (!isNaN(val)) {
              grouped[cat] = (grouped[cat] || 0) + val;
              validSumCount++;
            }
          }
        });

        let dataArr = Object.keys(grouped).map(k => ({
          name: k,
          value: grouped[k]
        }));

        return { dataArr, validSumCount };
      };

      let { dataArr, validSumCount } = processData(allRows, aggMode);
      let finalMsg = "Chart generated successfully!";

      if (aggMode === "sum" && validSumCount === 0) {
        console.warn("Sum mode failed. Switching to count.");
        const fallback = processData(allRows, "count");
        dataArr = fallback.dataArr;
        if (dataArr.length > 0) {
          finalMsg = "Selected column has non-numeric data. Showing 'Count' instead.";
        }
      }

      dataArr.sort((a, b) => b.value - a.value);

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
        fetchUploadHistory(); // Refresh upload history
      }

    } catch (err) {
      console.error(err);
      setStatusMsg("Error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // ===========================
  //  CHART DOWNLOAD (PNG)
  // ===========================
  const downloadChart = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `graphify-${chartType}-chart.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download chart.");
    }
  };

  // ===========================
  //  SAVE CHART TO DATABASE
  // ===========================
  const saveChart = async () => {
    if (!chartData.length) return alert("No chart to save.");

    try {
      const res = await fetch("http://localhost:5000/api/charts/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileName: file?.name || "unknown.csv",
          chartType,
          categoryColumn: categoryCol,
          valueColumn: valueCol,
          aggMode,
          chartData,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStatusMsg("✅ Chart saved to your history!");
      fetchHistory(); // Refresh history
    } catch (err) {
      console.error("Save failed:", err);
      setStatusMsg("Failed to save chart: " + err.message);
    }
  };

  // ===========================
  //  LOAD CHART FROM HISTORY
  // ===========================
  const loadChart = (chart) => {
    setChartType(chart.chartType);
    setChartData(chart.chartData);
    setCategoryCol(chart.categoryColumn);
    setValueCol(chart.valueColumn || "");
    setAggMode(chart.aggMode);
    setShowHistory(false);
    setStatusMsg(`Loaded: ${chart.fileName} (${chart.chartType} chart)`);
  };

  // ===========================
  //  DELETE CHART FROM HISTORY
  // ===========================
  const deleteChart = async (chartId) => {
    try {
      await fetch(`http://localhost:5000/api/charts/${chartId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHistory();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="app-header">
        <div className="header-top">
          <div>
            <h1>Graphify</h1>
            <p className="subtitle">Transform your CSV data into beautiful charts</p>
          </div>
          <div className="user-info">
            <span className="user-name">👤 {user?.name}</span>
            <button className="btn-history" onClick={() => setShowHistory(!showHistory)}>
              📜 History
            </button>
            <button className="btn-logout" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* History Panel with Tabs */}
      {showHistory && (
        <div className="history-panel card">
          {/* Tabs */}
          <div className="history-tabs">
            <button
              className={`history-tab ${historyTab === 'uploads' ? 'active' : ''}`}
              onClick={() => setHistoryTab('uploads')}
            >
              📁 File Uploads ({uploadHistory.length})
            </button>
            <button
              className={`history-tab ${historyTab === 'charts' ? 'active' : ''}`}
              onClick={() => setHistoryTab('charts')}
            >
              📊 Saved Charts ({chartHistory.length})
            </button>
          </div>

          {/* Upload History Tab */}
          {historyTab === 'uploads' && (
            <>
              {uploadHistory.length === 0 ? (
                <p className="history-empty">No files uploaded yet.</p>
              ) : (
                <div className="history-list">
                  {uploadHistory.map((upload) => (
                    <div key={upload._id} className="history-item">
                      <div className="history-item-info">
                        <span className="history-type">📄</span>
                        <div>
                          <strong>{upload.fileName}</strong>
                          <small>
                            {upload.rowCount} rows • {upload.columns.length} columns
                            {" • "}
                            {new Date(upload.createdAt).toLocaleDateString()}{" "}
                            {new Date(upload.createdAt).toLocaleTimeString()}
                          </small>
                          <small className="upload-cols">
                            Columns: {upload.columns.join(", ")}
                          </small>
                        </div>
                      </div>
                      <div className="history-item-actions">
                        <button className="btn-delete" onClick={async () => {
                          try {
                            await fetch(`http://localhost:5000/api/uploads/${upload._id}`, {
                              method: "DELETE",
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            fetchUploadHistory();
                          } catch (err) {
                            console.error("Delete failed:", err);
                          }
                        }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Chart History Tab */}
          {historyTab === 'charts' && (
            <>
              {chartHistory.length === 0 ? (
                <p className="history-empty">No saved charts yet. Generate and save your first chart!</p>
              ) : (
                <div className="history-list">
                  {chartHistory.map((chart) => (
                    <div key={chart._id} className="history-item">
                      <div className="history-item-info">
                        <span className="history-type">
                          {chart.chartType === "pie" ? "🥧" : chart.chartType === "bar" ? "📊" : "📈"}
                        </span>
                        <div>
                          <strong>{chart.fileName}</strong>
                          <small>
                            {chart.chartType.toUpperCase()} • {chart.categoryColumn} • {chart.aggMode}
                            {" • "}
                            {new Date(chart.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                      <div className="history-item-actions">
                        <button className="btn-load" onClick={() => loadChart(chart)}>Load</button>
                        <button className="btn-delete" onClick={() => deleteChart(chart._id)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

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
                    🥧 Pie
                  </button>
                  <button
                    className={`toggle-btn ${chartType === 'bar' ? 'active' : ''}`}
                    onClick={() => setChartType('bar')}
                  >
                    📊 Bar
                  </button>
                  <button
                    className={`toggle-btn ${chartType === 'line' ? 'active' : ''}`}
                    onClick={() => setChartType('line')}
                  >
                    📈 Line
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
              <div className="chart-header">
                <h3>Preview</h3>
                <div className="chart-actions">
                  <button className="btn-action btn-save" onClick={saveChart} title="Save to history">
                    💾 Save
                  </button>
                  <button className="btn-action btn-download" onClick={downloadChart} title="Download as PNG">
                    ⬇️ Download PNG
                  </button>
                </div>
              </div>
              <div ref={chartRef} className="chart-render-area">
                {chartType === 'pie' && <PieChartComponent data={chartData} />}
                {chartType === 'bar' && <BarChartComponent data={chartData} />}
                {chartType === 'line' && (
                  <div style={{ width: '100%', height: 400 }}>
                    <LineChartComponent data={chartData} />
                  </div>
                )}
              </div>
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
