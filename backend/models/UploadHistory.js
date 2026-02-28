// models/UploadHistory.js
const mongoose = require("mongoose");

const uploadHistorySchema = new mongoose.Schema(
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
        columns: {
            type: [String],
            default: [],
        },
        rowCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("UploadHistory", uploadHistorySchema);
