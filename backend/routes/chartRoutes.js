// routes/chartRoutes.js
const express = require("express");
const ChartHistory = require("../models/ChartHistory");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// POST /api/charts/save — Save a generated chart (protected)
router.post("/save", authMiddleware, async (req, res) => {
    try {
        const { fileName, chartType, categoryColumn, valueColumn, aggMode, chartData } = req.body;

        if (!fileName || !chartType || !categoryColumn || !chartData) {
            return res.status(400).json({ error: "Missing required chart data." });
        }

        const chart = await ChartHistory.create({
            userId: req.userId,
            fileName,
            chartType,
            categoryColumn,
            valueColumn: valueColumn || "",
            aggMode: aggMode || "count",
            chartData,
        });

        res.status(201).json({
            message: "Chart saved successfully!",
            chart,
        });
    } catch (err) {
        console.error("Save chart error:", err);
        res.status(500).json({ error: "Failed to save chart." });
    }
});

// GET /api/charts/history — Get all charts for current user (protected)
router.get("/history", authMiddleware, async (req, res) => {
    try {
        const charts = await ChartHistory.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({ charts });
    } catch (err) {
        console.error("Get history error:", err);
        res.status(500).json({ error: "Failed to fetch chart history." });
    }
});

// DELETE /api/charts/:id — Delete a saved chart (protected)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const chart = await ChartHistory.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!chart) {
            return res.status(404).json({ error: "Chart not found." });
        }

        res.json({ message: "Chart deleted successfully." });
    } catch (err) {
        console.error("Delete chart error:", err);
        res.status(500).json({ error: "Failed to delete chart." });
    }
});

module.exports = router;
