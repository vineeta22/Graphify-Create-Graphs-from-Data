// // src/CSVColumns.jsx
// import React from "react";
// import "./CSVColumns.css";

// const CSVColumns = ({ columns }) => {
//     if (!columns || columns.length === 0) return null;

//     return (
//         <div className="csv-columns">
//             <h2>CSV Columns:</h2>
//             <ul>
//                 {columns.map((col) => (
//                     <li key={col}>{col}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default CSVColumns;


// src/CSVColumns.jsx
// CSVColumns.jsx
import React from "react";
import "./CSVColumns.css";

const CSVColumns = ({ columns, selectedColumn, onColumnClick }) => {
    if (!columns || columns.length === 0) return null;

    const handleClick = (col) => {
        // console.log("Clicked:", col);
        if (onColumnClick) {
            onColumnClick(col);
        }
    };

    return (
        <div className="csv-columns">
            <h2>CSV Columns:</h2>
            <ul>
                {columns.map((col) => (
                    <li
                        key={col}
                        className={`csv-column-item ${selectedColumn === col ? "selected" : ""}`}
                        onClick={() => handleClick(col)}
                    >
                        {col}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CSVColumns;
