// src/services/api.jsx
const API_BASE = "http://localhost:5000";

export async function uploadDataset(file) {
  const fd = new FormData();
  fd.append("csvFile", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: fd
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}
