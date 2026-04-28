const adminTableBody = document.querySelector("#admin-table tbody");
const loadAllBtn = document.getElementById("load-all");

// Chatbot Elements
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotBody = document.getElementById("chatbot-body");
const chatInput = document.getElementById("chat-input");
const sendChatBtn = document.getElementById("send-chat");
const chatMessages = document.getElementById("chat-messages");

document.addEventListener("DOMContentLoaded", loadAllData);

// Chatbot Toggle
chatbotToggle.addEventListener("click", () => {
    chatbotBody.classList.toggle("hidden");
    const icon = chatbotToggle.querySelector(".toggle-icon");
    icon.innerText = chatbotBody.classList.contains("hidden") ? "▲" : "▼";
});

// Send Chat
const sendMessage = async () => {
    const text = chatInput.value.trim();
    if (!text) return;
    appendMessage("user", text);
    chatInput.value = "";
    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });
        const data = await response.json();
        appendMessage("ai", data.response);
    } catch (err) {
        appendMessage("ai", "Admin service error.");
    }
};

const appendMessage = (sender, text) => {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${sender}`;
    msgDiv.innerText = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

sendChatBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

loadAllBtn.addEventListener("click", loadAllData);

async function loadAllData() {
    try {
        const res = await fetch("/admin/applications");
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        adminTableBody.innerHTML = "";
        data.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${new Date(row.createdAt).toLocaleDateString()}</td>
                <td>${row.userEmail || 'Unknown'}</td>
                <td>${row.age}</td>
                <td>$${row.income.toLocaleString()}</td>
                <td>${row.creditScore}</td>
                <td>$${row.loanAmount.toLocaleString()}</td>
                <td style="font-weight:bold;">${row.predictionResult}</td>
            `;
            adminTableBody.appendChild(tr);
        });
    } catch (err) {
        alert("Session expired or unauthorized. Please login again.");
        window.location.href = "/login.html";
    }
}
