const express = require('express');
const router = express.Router();
const axios = require('axios');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

router.post('/generate', async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: "Topic required" });
    }

    try {
        const response = await axios.get(
            `https://api.github.com/search/repositories?q=${topic}`,
            {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`
                }
            }
        );

        let repos = response.data.items.slice(0, 8);

        // 🔥 Safety: agar repos kam aaye to fallback
        if (repos.length < 4) {
            return res.json({
                questions: [{
                    question: `Basic question on "${topic}"`,
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    answer: "Option A"
                }]
            });
        }

        // 🔀 Shuffle helper
        const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

        const questions = [];

        // Q1 - Highest stars
        const topStar = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count)[0];
        questions.push({
            question: `Which repository related to "${topic}" has the highest stars?`,
            options: shuffle(repos.map(r => r.name)),
            answer: topStar.name
        });

        // Q2 - Most forks
        const topFork = [...repos].sort((a, b) => b.forks_count - a.forks_count)[0];
        questions.push({
            question: `Which repository has the most forks?`,
            options: shuffle(repos.map(r => r.name)),
            answer: topFork.name
        });

        // Q3 - Language based
        const langRepo = repos.find(r => r.language);
        questions.push({
            question: `Which repository is primarily written in ${langRepo?.language || "JavaScript"}?`,
            options: shuffle(repos.map(r => r.name)),
            answer: langRepo?.name || repos[0].name
        });

        // Q4 - Owner based
        const ownerRepo = repos[Math.floor(Math.random() * repos.length)];
        questions.push({
            question: `Which repository is owned by ${ownerRepo.owner.login}?`,
            options: shuffle(repos.map(r => r.name)),
            answer: ownerRepo.name
        });

        // Q5 - Description based
        const descRepo = repos.find(r => r.description) || repos[0];
        questions.push({
            question: `Which repository matches this description: "${descRepo.description || "No description"}"?`,
            options: shuffle(repos.map(r => r.name)),
            answer: descRepo.name
        });

        // 🔥 FINAL SAFETY: ensure always 5 questions
        while (questions.length < 5) {
            const repo = repos[Math.floor(Math.random() * repos.length)];

            questions.push({
                question: `Which repository is created by ${repo.owner.login}?`,
                options: shuffle(repos.map(r => r.name)),
                answer: repo.name
            });
        }

        res.json({ questions });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "GitHub API error" });
    }
});

module.exports = router;