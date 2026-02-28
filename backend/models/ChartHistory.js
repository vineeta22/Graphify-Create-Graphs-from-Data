// models/ChartHistory.js
const mongoose = require("mongoose");

const chartHistorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        chartType: {
            type: String,
            enum: ["pie", "bar", "line"],
            required: true,
        },
        categoryColumn: {
            type: String,
            required: true,
        },
        valueColumn: {
            type: String,
            default: "",
        },
        aggMode: {
            type: String,
            enum: ["count", "sum"],
            default: "count",
        },
        chartData: [
            {
                name: String,
                value: Number,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("ChartHistory", chartHistorySchema);
