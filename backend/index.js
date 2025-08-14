const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

// Test route
app.get("/test", (req, res) => {
res.json({ message: "Backend is running" });
});

// Upload route
app.post("/upload", (req, res, next) => {
upload.single("csvFile")(req, res, (err) => {
    if (err) return res.status(400).json({ error: "File upload error", details: err.message });
    next();
});
}, (req, res) => {
if (!req.file) {
    return res.status(400).json({ error: "No CSV file uploaded" });
}

if (!req.file.originalname.match(/\.csv$/)) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: "Only .csv files are allowed" });
}

const { companyName, chartType } = req.body;
const results = [];

fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
        fs.unlinkSync(req.file.path);
        if (results.length === 0) {
        return res.status(400).json({ error: "CSV file is empty" });
    }
    res.json({
        message: "File uploaded and parsed successfully",
        companyName,
        chartType,
        data: results
    });
    })
    .on("error", (err) => {
    console.error("CSV parsing error:", err);
    res.status(500).json({ error: "Failed to parse CSV" });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
