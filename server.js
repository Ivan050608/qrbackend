const express = require("express");
const mongoose = require("mongoose");
const QRCode = require("qrcode");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());


app.use(cors({
    origin: ["http://localhost:3000", "https://qrbackend-hvv7.onrender.com"], // Update with your frontend URL
    methods: "GET, POST",
    allowedHeaders: "Content-Type",
}));


mongoose.connect(process.env.MONGO_URI || "mongodb+srv://ivanacuna055:admin123@cluster0.bcl9r.mongodb.net/qrcodes", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// ✅ QR Code Schema
const QRSchema = new mongoose.Schema({
    text: String,
    qrCodeUrl: String
});
const QRModel = mongoose.model("QRCode", QRSchema);

// ✅ Generate & Save QR Code
app.post("/generateQR", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: "Text is required" });

        // Generate QR Code as Data URL
        const qrCodeUrl = await QRCode.toDataURL(text);

        // Save to DB
        const qr = new QRModel({ text, qrCodeUrl });
        await qr.save();

        res.json({ qrCodeUrl });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


app.get("/qrcodes", async (req, res) => {
    try {
        const qrcodes = await QRModel.find();
        res.json(qrcodes);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
