// 🌐 BASE URL (AUTO FIX)
const BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://eduguarda.onrender.com";

// 🧠 FORMAT TEXT
function formatText(text) {
    return text
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/### (.*?)/g, "<h3>$1</h3>");
}

// 📩 SEND MESSAGE
async function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();

    if (!message) return;

    const chatBox = document.querySelector(".chat-box-inner");
    const chatContainer = document.querySelector(".chat-box");

    if (!chatBox || !chatContainer) return;

    // ❌ Remove welcome
    const welcome = document.querySelector(".welcome");
    if (welcome) welcome.remove();

    // 👤 USER MESSAGE
    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.innerText = message;
    chatBox.appendChild(userMsg);

    // 💾 Save history
    saveToHistory(message);

    input.value = "";
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // 🤖 BOT LOADING
    const botMsg = document.createElement("div");
    botMsg.className = "message bot";
    botMsg.innerText = "Typing...";
    chatBox.appendChild(botMsg);

    try {
        const res = await fetch(`${BASE_URL}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });

        let data;
        try {
            data = await res.json();
        } catch {
            throw new Error("Invalid JSON");
        }

        const formatted = formatText(data.reply || "⚠️ No response");

        // ⌨️ TYPE EFFECT
        botMsg.innerHTML = "";
        let i = 0;

        function typeEffect() {
            if (i < formatted.length) {
                botMsg.innerHTML = formatted.substring(0, i);
                i++;
                setTimeout(typeEffect, 10);
            } else {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }

        typeEffect();

    } catch (error) {
        console.error(error);
        botMsg.innerText = "⚠️ Server error. Try again.";
    }

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ⌨️ ENTER KEY SUPPORT
function handleKey(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// 🆕 NEW CHAT
function newChat() {
    const chatBox = document.querySelector(".chat-box-inner");
    if (!chatBox) return;

    chatBox.innerHTML = `
        <div class="welcome">
            Start chatting with EduGuard AI 🚀
        </div>
    `;
}

// 📂 SIDEBAR TOGGLE (MOBILE)
function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) sidebar.classList.toggle("active");
}

// 💾 SAVE HISTORY
function saveToHistory(message) {
    let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
    history.unshift(message);

    if (history.length > 20) history.pop();

    localStorage.setItem("chatHistory", JSON.stringify(history));
    renderHistory();
}

// 📜 RENDER HISTORY
function renderHistory() {
    const historyList = document.getElementById("chatHistory");
    if (!historyList) return;

    historyList.innerHTML = "";

    const history = JSON.parse(localStorage.getItem("chatHistory")) || [];

    history.forEach(msg => {
        const li = document.createElement("li");
        li.innerText = msg.substring(0, 25);

        li.onclick = () => {
            document.getElementById("userInput").value = msg;
        };

        historyList.appendChild(li);
    });
}

// 🚀 LOAD HISTORY
window.onload = function () {
    renderHistory();
};