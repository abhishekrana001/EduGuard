const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
require("dotenv").config();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const API_URL = "https://models.inference.ai.azure.com/chat/completions";


// =====================
// 🧠 TEXT CHECK (GPT)
// =====================
router.post("/text", async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({
            aiProbability: 0,
            message: "No text provided"
        });
    }

    try {
        const response = await axios.post(
            API_URL,
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an AI detector. STRICTLY reply in this format only: Probability: XX% | Reason: short explanation. No extra text."
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                max_tokens: 200
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
                    "Content-Type": "application/json"
                },
                timeout: 15000
            }
        );

        const reply = response.data?.choices?.[0]?.message?.content || "";

        console.log("TEXT AI RESPONSE:", reply);

        // 🔥 % extract (safe)
        const match = reply.match(/(\d{1,3})\s*%/);
        const probability = match ? Math.min(100, parseInt(match[1])) : 50;

        res.json({
            aiProbability: probability,
            message: reply || "No response from AI"
        });

    } catch (error) {
        console.log("TEXT ERROR:", error.response?.data || error.message);

        res.status(500).json({
            aiProbability: 0,
            message: "AI detection failed"
        });
    }
});


// =====================
// 🖼️ IMAGE CHECK (GPT)
// =====================
router.post("/image", upload.single("image"), async (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            result: "No image received",
            aiProbability: 0
        });
    }

    try {
        const base64Image = req.file.buffer.toString("base64");

        const response = await axios.post(
            API_URL,
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an AI image detector. STRICTLY reply in format: Probability: XX% | Reason: short explanation."
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Check if this image is AI generated"
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 200
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
                    "Content-Type": "application/json"
                },
                timeout: 20000
            }
        );

        const reply = response.data?.choices?.[0]?.message?.content || "";

        console.log("IMAGE AI RESPONSE:", reply);

        const match = reply.match(/(\d{1,3})\s*%/);
        const probability = match ? Math.min(100, parseInt(match[1])) : 50;

        res.json({
            aiProbability: probability,
            result: reply || "No response from AI"
        });

    } catch (error) {
        console.log("IMAGE ERROR:", error.response?.data || error.message);

        res.status(500).json({
            result: "Image analysis failed",
            aiProbability: 0
        });
    }
});

module.exports = router;