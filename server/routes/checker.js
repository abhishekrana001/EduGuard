const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");

// 📦 Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// =====================
// 🧠 TEXT CHECK (AI)
// =====================
router.post("/text", async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({
            message: "No text provided",
            aiProbability: 0
        });
    }

    try {
        const response = await axios.post(
            "https://models.inference.ai.azure.com/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are an AI detection tool. Analyze the text and respond ONLY in this format: Probability: XX% | Reason: short explanation."                    },
                    {
                        role: "user",
                        content: text
                    }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const reply = response.data.choices[0].message.content;

        // 🔥 Extract number using regex
        const match = reply.match(/(\d+)%/);
        const probability = match ? parseInt(match[1]) : 0;

        res.json({
            message: reply,
            aiProbability: "AI Analysis"
        });

    } catch (error) {
        console.log("❌ TEXT ERROR:", error.response?.data || error.message);

        res.status(500).json({
            message: "AI detection failed",
            aiProbability: 0
        });
    }
});


// =====================
// 🖼️ IMAGE CHECK (AI)
// =====================
router.post("/image", upload.single("image"), async (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            result: "No image received"
        });
    }

    try {
        const base64Image = req.file.buffer.toString("base64");

        const response = await axios.post(
            "https://models.inference.ai.azure.com/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "Analyze this image and respond ONLY in this format: Probability: XX% | Reason: short explanation whether it is AI-generated or real."
                    },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Analyze this image" },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const reply = response.data.choices[0].message.content;

        // 🔥 extract %
        const match = reply.match(/(\d+)%/);
        const probability = match ? parseInt(match[1]) : 0;

        res.json({
            result: result
        });

    } catch (error) {
        console.log("❌ IMAGE ERROR:", error.response?.data || error.message);

        res.status(500).json({
            result: "Image analysis failed"
        });
    }
});

module.exports = router;