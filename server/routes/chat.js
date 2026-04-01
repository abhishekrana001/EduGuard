const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.post("/", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({
            reply: "❌ Message required"
        });
    }

    try {
        const response = await axios.post(
            "https://models.inference.ai.azure.com/chat/completions",
            {
                model: "gpt-4o", // 🔥 revert to working model
                messages: [
                    {
                        role: "system",
                        content: "You are EduGuard AI assistant. Help students clearly."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 500
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json" // 🔥 IMPORTANT
                },
                timeout: 10000
            }
        );

        res.json({
            reply: response.data.choices[0].message.content
        });

    } catch (error) {
        console.log("❌ API ERROR:");
        console.log(error.response?.data || error.message);

        res.status(500).json({
            reply: "⚠️ AI service temporarily unavailable"
        });
    }
});

module.exports = router;