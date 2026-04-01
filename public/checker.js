// 🌐 BASE URL (AUTO FIX)
const BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://eduguarda.onrender.com";


// 🎨 RESULT UI FUNCTION (REUSABLE 🔥)
function renderResult(resultBox, probability, message) {

    // 🔥 color logic
    let color = probability > 70 ? "#ef4444" : "#22c55e";

    resultBox.innerHTML = `
        <div class="result-card">
            <h3>${probability}% AI</h3>

            <div class="progress-container">
                <div class="progress-bar" 
                     style="width:0%; background:${color}">
                </div>
            </div>

            <p>${message}</p>
        </div>
    `;

    // 🔥 smooth animation
    const bar = resultBox.querySelector(".progress-bar");
    setTimeout(() => {
        bar.style.width = probability + "%";
    }, 100);
}


// 📝 TEXT CHECK
async function checkText() {
    const text = document.getElementById("textInput").value.trim();
    const resultBox = document.getElementById("resultBox");

    if (!text) {
        alert("Enter text first!");
        return;
    }

    resultBox.innerHTML = `<p class="loading">⏳ Checking text...</p>`;

    try {
        const res = await fetch(`${BASE_URL}/api/check/text`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        });

        const data = await res.json();

        renderResult(
            resultBox,
            data.aiProbability || 0,
            data.message || "No response"
        );

    } catch (err) {
        console.error(err);
        resultBox.innerHTML = "⚠️ Error checking text";
    }
}


// 🖼️ IMAGE CHECK
async function checkImage() {
    const file = document.getElementById("imageInput").files[0];
    const resultBox = document.getElementById("resultBox");

    if (!file) {
        alert("Upload image first!");
        return;
    }

    resultBox.innerHTML = `<p class="loading">⏳ Checking image...</p>`;

    try {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(`${BASE_URL}/api/check/image`, {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        renderResult(
            resultBox,
            data.aiProbability || 0,
            data.result || "No result"
        );

    } catch (err) {
        console.error(err);
        resultBox.innerHTML = "⚠️ Error checking image";
    }
}