// index.js
require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const csv = require("csv-parser");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

// Import routes
const authRoutes = require("./routes/authRoutes");
const chartRoutes = require("./routes/chartRoutes");

// Import models
const UploadHistory = require("./models/UploadHistory");
const authMiddleware = require("./middleware/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } })); // 50MB limit

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// =====================
//  AUTH & CHART ROUTES
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/charts", chartRoutes);

// =====================
//  CSV UPLOAD ROUTE (now saves upload history)
// =====================
app.post("/upload", (req, res) => {
  try {
    if (!req.files || !req.files.csvFile) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const csvFile = req.files.csvFile;

    if (!csvFile.name.endsWith(".csv")) {
      return res.status(400).json({ error: "Only CSV files allowed" });
    }

    // Check for JWT token (optional — save history if logged in)
    let userId = null;
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
        userId = decoded.userId;
      }
    } catch (e) {
      // Not logged in or invalid token — upload still works, just no history
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
        .on("end", async () => {
          fs.unlink(filePath, () => { }); // delete temp file

          // Save upload history if user is logged in
          if (userId && results.length > 0) {
            try {
              await UploadHistory.create({
                userId,
                fileName: csvFile.name,
                columns: Object.keys(results[0] || {}),
                rowCount: results.length,
              });
            } catch (historyErr) {
              console.error("Failed to save upload history:", historyErr);
            }
          }

          res.json({
            message: "CSV read successfully",
            data: results,
          });
        })
        .on("error", () => {
          fs.unlink(filePath, () => { });
          res.status(500).json({ error: "Error reading CSV" });
        });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// =====================
//  UPLOAD HISTORY ROUTES
// =====================

// GET /api/uploads/history — get user's upload history
app.get("/api/uploads/history", authMiddleware, async (req, res) => {
  try {
    const uploads = await UploadHistory.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json({ uploads });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch upload history." });
  }
});

// DELETE /api/uploads/:id — delete an upload record
app.delete("/api/uploads/:id", authMiddleware, async (req, res) => {
  try {
    await UploadHistory.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    res.json({ message: "Upload record deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete upload record." });
  }
});

// =====================
//  START SERVER
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
