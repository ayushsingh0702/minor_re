from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

model = joblib.load("model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if data is None:
        return jsonify({"error": "Invalid JSON"}), 400

    try:
        age = float(data.get("age", 0))
        income = float(data.get("income", 0))
        credit_score = float(data.get("credit_score", 0))
        loan_amount = float(data.get("loan_amount", 0))
    except Exception:
        return jsonify({"error": "Invalid input values"}), 400

    df = pd.DataFrame([{
        "age": age,
        "income": income,
        "credit_score": credit_score,
        "loan_amount": loan_amount
    }])

    pred = model.predict(df)[0]
    prob = float(model.predict_proba(df)[0][1])

    return jsonify({"prediction": int(pred), "probability": prob})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
