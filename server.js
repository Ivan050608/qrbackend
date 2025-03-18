const express = require("express");
const mongoose = require("mongoose");
const QRCode = require("qrcode");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://ivanacuna055:admin123@cluster0.bcl9r.mongodb.net/qrcodes?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// QR Code Schema
const QRSchema = new mongoose.Schema({
    text: String,
    qrCodeUrl: String
});
const QRModel = mongoose.model("QRCode", QRSchema);

// Generate & Save QR Code
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

// Get All QR Codes
app.get("/qrcodes", async (req, res) => {
    const qrcodes = await QRModel.find();
    res.json(qrcodes);
});

app.listen(4000, () => console.log("Server running on port 4000"));
