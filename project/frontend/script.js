const form = document.getElementById("predict-form");
const resultDiv = document.getElementById("result");
const loadHistoryBtn = document.getElementById("load-history");
const historyBody = document.querySelector("#history-table tbody");
const apiBase = "http://localhost:8080/api";

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const age = Number(document.getElementById("age").value);
    const income = Number(document.getElementById("income").value);
    const credit_score = Number(document.getElementById("credit_score").value);
    const loan_amount = Number(document.getElementById("loan_amount").value);
    
    // Validation
    if (age < 18 || age > 100) {
        alert("Age must be between 18 and 100");
        return;
    }
    if (income < 10000) {
        alert("Income must be at least $10,000");
        return;
    }
    if (credit_score < 100 || credit_score > 900) {
        alert("Credit Score must be between 100 and 900");
        return;
    }
    if (loan_amount < 1000) {
        alert("Loan amount must be at least $1,000");
        return;
    }
    
    const data = {
        age: age,
        income: income,
        credit_score: credit_score,
        loan_amount: loan_amount,
    };
    
    try {
        const response = await fetch(`${apiBase}/predict`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });
        const json = await response.json();
        
        const predictionText = json.prediction === 1 ? "✅ APPROVED" : "❌ REJECTED";
        
        resultDiv.classList.remove("hidden");
        resultDiv.innerHTML = `
            <div style="text-align: center;">
                <h3 style="font-size: 1.8em; margin-bottom: 15px;">${predictionText}</h3>
                <strong style="font-size: 1.2em;">Confidence Score: ${(json.probability * 100).toFixed(2)}%</strong>
            </div>
        `;
        loadHistory();
    } catch (err) {
        resultDiv.classList.remove("hidden");
        resultDiv.style.background = "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
        resultDiv.innerHTML = `<strong>Error:</strong> ${err.message}`;
    }
});

loadHistoryBtn.addEventListener("click", loadHistory);

async function loadHistory() {
    try {
        const res = await fetch(`${apiBase}/history`);
        const data = await res.json();
        historyBody.innerHTML = "";
        
        data.forEach(row => {
            const tr = document.createElement("tr");
            const predictionBadge = row.prediction === 1 ? "✅ Approved" : "❌ Rejected";
            const timestamp = new Date(row.timestamp).toLocaleString();
            
            tr.innerHTML = `
                <td>${row.id}</td>
                <td>${row.age}</td>
                <td>$${row.income.toLocaleString()}</td>
                <td>${row.creditScore}</td>
                <td>$${row.loanAmount.toLocaleString()}</td>
                <td>${predictionBadge}</td>
                <td>${(row.probability * 100).toFixed(2)}%</td>
                <td>${timestamp}</td>
            `;
            historyBody.appendChild(tr);
        });
    } catch (err) {
        console.error("Error loading history:", err);
    }
}
