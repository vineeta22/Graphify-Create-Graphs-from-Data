// const express = require("express");
// const multer = require("multer");
// const csv = require("csv-parser");
// const fs = require("fs");
// const cors = require("cors");

// const app = express();
// const upload = multer({ dest: "uploads/" });

// app.use(cors());
// app.use(express.json());

// // Test route
// app.get("/test", (req, res) => {
// res.json({ message: "Backend is running" });
// });

// // Upload route
// app.post("/upload", (req, res, next) => {
// upload.single("csvFile")(req, res, (err) => {
//     if (err) return res.status(400).json({ error: "File upload error", details: err.message });
//     next();
// });
// }, (req, res) => {
// if (!req.file) {
//     return res.status(400).json({ error: "No CSV file uploaded" });
// }

// if (!req.file.originalname.match(/\.csv$/)) {
//     fs.unlinkSync(req.file.path);
//     return res.status(400).json({ error: "Only .csv files are allowed" });
// }

// const { companyName, chartType } = req.body;
// const results = [];

// fs.createReadStream(req.file.path)
//     .pipe(csv())
//     .on("data", (data) => results.push(data))
//     .on("end", () => {
//         fs.unlinkSync(req.file.path);
//         if (results.length === 0) {
//         return res.status(400).json({ error: "CSV file is empty" });
//     }
//     res.json({
//         message: "File uploaded and parsed successfully",
//         companyName,
//         chartType,
//         data: results
//     });
//     })
//     .on("error", (err) => {
//     console.error("CSV parsing error:", err);
//     res.status(500).json({ error: "Failed to parse CSV" });
//     });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// const express = require("express");
// const fileUpload = require("express-fileupload");
// const csv = require("csv-parser");
// const fs = require("fs");
// const cors = require("cors");
// const path = require("path");

// const app = express();
// app.use(cors());
// app.use(fileUpload());

// app.post("/upload", (req, res) => {
//     try {
//         if (!req.files || !req.files.csvFile) {
//             return res.status(400).json({ error: "No file uploaded" });
//         }

//         const csvFile = req.files.csvFile;

//         // Ensure uploads folder exists
//         const uploadDir = path.join(__dirname, "uploads");
//         if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

//         const filePath = path.join(uploadDir, csvFile.name);

//         csvFile.mv(filePath, (err) => {
//             if (err) return res.status(500).json({ error: "Failed to save file" });

//             const results = [];
//             fs.createReadStream(filePath)
//                 .pipe(csv())
//                 .on("data", (row) => results.push(row))
//                 .on("end", () => {
//                     fs.unlink(filePath, (err) => {
//                         if (err) console.error("Failed to delete temp file:", err);
//                     });
//                     res.json({ message: "CSV read successfully", data: results });
//                 })
//                 .on("error", (err) => {
//                     fs.unlink(filePath, () => { });
//                     res.status(500).json({ error: "Error reading CSV" });
//                 });
//         });
//     } catch (err) {
//         res.status(500).json({ error: "Server error" });
//     }
// });

// app.listen(5000, () => console.log("Server running on http://localhost:5000"));

// index.js
const express = require("express");
const fileUpload = require("express-fileupload");
const csv = require("csv-parser");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } })); // 50MB limit

app.post("/upload", (req, res) => {
  try {
    if (!req.files || !req.files.csvFile) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const csvFile = req.files.csvFile;

    if (!csvFile.name.endsWith(".csv")) {
      return res.status(400).json({ error: "Only CSV files allowed" });
    }

    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const filePath = path.join(uploadDir, csvFile.name);

    csvFile.mv(filePath, (err) => {
      if (err) return res.status(500).json({ error: "Failed to save file" });

      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => results.push(row))
        .on("end", () => {
          fs.unlink(filePath, () => {}); // delete temp file
          res.json({
            message: "CSV read successfully",
            data: results,
          });
        })
        .on("error", () => {
          fs.unlink(filePath, () => {});
          res.status(500).json({ error: "Error reading CSV" });
        });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
