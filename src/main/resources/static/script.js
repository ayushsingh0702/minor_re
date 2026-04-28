const form = document.getElementById("predict-form");
const resultDiv = document.getElementById("result");
const loadHistoryBtn = document.getElementById("load-history");
const historyBody = document.querySelector("#history-table tbody");
const apiBase = ""; 

// Chatbot Elements
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotBody = document.getElementById("chatbot-body");
const chatInput = document.getElementById("chat-input");
const sendChatBtn = document.getElementById("send-chat");
const chatMessages = document.getElementById("chat-messages");

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
    loadHistory();
    // Fetch user name if needed (optional since we have session)
    document.getElementById("user-name-display").innerText = "Welcome back!";
});

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

    // Add user message
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
        appendMessage("ai", "Sorry, I'm having trouble connecting right now.");
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

// Prediction Form
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const age = Number(document.getElementById("age").value);
    const income = Number(document.getElementById("income").value);
    const credit_score = Number(document.getElementById("credit_score").value);
    const loan_amount = Number(document.getElementById("loan_amount").value);
    
    const data = { age, income, creditScore: credit_score, loanAmount: loan_amount };
    
    try {
        const response = await fetch("/api/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Prediction failed");

        const json = await response.json();
        let riskColor = json.riskLevel === 'LOW' ? '#059669' : (json.riskLevel === 'MEDIUM' ? '#d97706' : '#dc2626');
        
        resultDiv.classList.remove("hidden");
        resultDiv.innerHTML = `
            <div style="text-align: center; padding: 20px; border-radius: 8px; border: 1px solid ${riskColor}; background: ${riskColor}10;">
                <h3 style="color: ${riskColor}">Risk Level: ${json.riskLevel}</h3>
                <p>Confidence: ${(json.probabilityValue * 100).toFixed(2)}%</p>
                <div class="llm-explanation" style="margin-top: 15px; text-align: left;">
                    <strong>Analysis:</strong> ${json.explanation}
                    <div style="margin-top: 8px; font-size: 0.8em; opacity: 0.7;">${json.antigravityBranding}</div>
                </div>
            </div>
        `;
        loadHistory();
    } catch (err) {
        alert(err.message);
    }
});

loadHistoryBtn.addEventListener("click", loadHistory);

async function loadHistory() {
    try {
        const res = await fetch("/user/history");
        if (!res.ok) return;
        const data = await res.json();
        historyBody.innerHTML = "";
        data.forEach(row => {
            const tr = document.createElement("tr");
            let riskColor = row.predictionResult === 'LOW' ? 'green' : (row.predictionResult === 'MEDIUM' ? 'orange' : 'red');
            tr.innerHTML = `
                <td>${new Date(row.createdAt).toLocaleDateString()}</td>
                <td>${row.age}</td>
                <td>$${row.income.toLocaleString()}</td>
                <td>${row.creditScore}</td>
                <td>$${row.loanAmount.toLocaleString()}</td>
                <td style="color: ${riskColor}; font-weight: bold;">${row.predictionResult}</td>
                <td>${(row.riskScore * 100).toFixed(2)}%</td>
            `;
            historyBody.appendChild(tr);
        });
    } catch (err) {
        console.error("History error:", err);
    }
}
