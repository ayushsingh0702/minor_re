import os
import pandas as pd
import numpy as np
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

DATA_PATH = "/home/ayush-sher/Desktop/workspace/ml_projects/minor_project/archive/data.csv"

if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(f"Dataset not found at {DATA_PATH}")

data = pd.read_csv(DATA_PATH)

# map names from dataset to simple features
if "Credit_Score" not in data.columns or "Creditworthiness" not in data.columns:
    raise ValueError("Missing required columns in dataset")

# pick features
X = pd.DataFrame({
    "age": data["Age"],
    "income": data["Income"],
    "credit_score": data["Credit_Score"].astype(float),
    "loan_amount": data["Loan_Amount"]
})

# target is Creditworthiness 0/1
if data["Creditworthiness"].dtype == object:
    y = data["Creditworthiness"].astype(int)
else:
    y = data["Creditworthiness"].astype(int)

X = X.fillna(0).astype(float)
y = y.astype(int)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

imputer = SimpleImputer(strategy="mean")
scaler = StandardScaler()

candidates = {
    "logistic_regression": LogisticRegression(max_iter=500),
    "decision_tree": DecisionTreeClassifier(random_state=42),
    "random_forest": RandomForestClassifier(n_estimators=100, random_state=42)
}

best_score = 0.0
best_name = None
best_pipeline = None

for name, model in candidates.items():
    pipe = Pipeline([
        ("imputer", imputer),
        ("scaler", scaler),
        ("model", model)
    ])
    pipe.fit(X_train, y_train)
    preds = pipe.predict(X_test)
    score = accuracy_score(y_test, preds)
    print(f"{name} accuracy: {score:.4f}")
    if score > best_score:
        best_score = score
        best_name = name
        best_pipeline = pipe

if best_pipeline is None:
    raise RuntimeError("No model trained")

print(f"Best model: {best_name} with accuracy {best_score:.4f}")
joblib.dump(best_pipeline, "model.pkl")
print("Saved model.pkl")
