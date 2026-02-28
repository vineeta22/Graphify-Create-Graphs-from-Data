// src/components/DatasetHistory.jsx
import React from "react";

export default function DatasetHistory({ versions, onCompare }) {
  return (
    <div>
      <h3>Dataset Versions</h3>
      <ul>
        {versions.map(v => (
          <li key={v.version}>
            Version {v.version} – {v.date}
          </li>
        ))}
      </ul>

      {versions.length >= 2 && (
        <button onClick={() => onCompare(versions[0], versions[1])}>
          Compare Latest Versions
        </button>
      )}
    </div>
  );
}
