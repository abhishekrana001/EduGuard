// 🌐 BASE URL (AUTO SWITCH)
const BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://eduguarda.onrender.com";

let questionsData = [];

async function startQuiz() {
    const topic = document.getElementById("topic").value;
    const container = document.getElementById("quizContainer");

    if (!topic) {
        alert("Enter a topic first!");
        return;
    }

    container.innerHTML = "<p>⏳ Loading questions...</p>";

    try {
        const res = await fetch(`${BASE_URL}/api/quiz/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic })
        });

        const data = await res.json();

        if (!data.questions) {
            alert("No questions generated!");
            return;
        }

        questionsData = data.questions;
        displayQuestions();

    } catch (err) {
        alert("Error loading quiz!");
        console.error(err);
    }
}

function displayQuestions() {
    const container = document.getElementById("quizContainer");
    container.innerHTML = "";

    questionsData.forEach((q, index) => {
        container.innerHTML += `
            <div class="question">
                <p><b>${index + 1}. ${q.question}</b></p>
                ${q.options.map(opt => `
                    <label>
                        <input type="radio" name="q${index}" value="${opt}">
                        ${opt}
                    </label><br>
                `).join("")}
            </div>
        `;
    });

    document.getElementById("submitBtn").style.display = "block";
}

function submitQuiz() {
    let score = 0;

    questionsData.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected && selected.value === q.answer) {
            score++;
        }
    });

    document.getElementById("result").innerHTML =
        `🎯 Score: ${score} / ${questionsData.length}`;
}