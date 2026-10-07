"""
Reproducible Machine Learning Training & Evaluation Pipeline for Agricultural Yield Prediction
Trains multiple regression models (Linear Regression, Ridge, Random Forest, Gradient Boosting, XGBoost),
computes comprehensive evaluation metrics (MAE, RMSE, R², MAPE), selects the champion model,
and exports serialized model artifacts for low-latency inference.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def compute_metrics(y_true, y_pred):
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)
    mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100
    return {
        "MAE": round(float(mae), 2),
        "RMSE": round(float(rmse), 2),
        "R2": round(float(r2), 4),
        "MAPE_pct": round(float(mape), 2),
    }

def train_pipeline():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, "data", "agricultural_ml_dataset.csv")
    artifacts_dir = os.path.join(base_dir, "artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)

    print("🌾 Loading dataset from:", data_path)
    df = pd.read_csv(data_path)

    # 1. Feature Engineering
    print("⚙️ Engineering agricultural features...")
    df["rainfall_ratio"] = df["rainfall_mm"] / ((df["optimal_rainfall_min_mm"] + df["optimal_rainfall_max_mm"]) / 2.0)
    df["temp_optimal_mid"] = (df["optimal_temp_min_c"] + df["optimal_temp_max_c"]) / 2.0
    df["temp_deviation"] = (df["temp_avg_c"] - df["temp_optimal_mid"]).abs()
    df["nutrient_index"] = (df["n_score"] + df["p_score"] + df["k_score"]) / 9.0

    # Features and Target
    categorical_cols = ["crop", "season", "irrigation_type", "soil_type"]
    numerical_cols = [
        "area_ha",
        "soil_ph",
        "organic_carbon_pct",
        "rainfall_mm",
        "temp_avg_c",
        "growth_duration_days",
        "rainfall_ratio",
        "temp_deviation",
        "nutrient_index",
    ]

    X = df[categorical_cols + numerical_cols]
    y = df["yield_kg_per_ha"]

    # 2. Train / Validation / Test Split (70% Train, 15% Val, 15% Test)
    print("✂️ Splitting dataset into Train (70%), Validation (15%), Test (15%)...")
    X_train_val, X_test, y_train_val, y_test = train_test_split(
        X, y, test_size=0.15, random_state=42
    )
    X_train, X_val, y_train, y_val = train_test_split(
        X_train_val, y_train_val, test_size=0.17647, random_state=42 # 0.85 * 0.17647 ~ 0.15
    )

    print(f"   Train samples: {len(X_train)}, Val samples: {len(X_val)}, Test samples: {len(X_test)}")

    # 3. Preprocessor Pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_cols),
            ("num", StandardScaler(), numerical_cols),
        ]
    )

    # 4. Model Training Candidates
    candidates = {
        "Linear Regression": LinearRegression(),
        "Ridge Regression": Ridge(alpha=1.0),
        "Random Forest Regressor": RandomForestRegressor(
            n_estimators=120, max_depth=15, min_samples_split=4, random_state=42, n_jobs=-1
        ),
        "Gradient Boosting Regressor": GradientBoostingRegressor(
            n_estimators=120, learning_rate=0.08, max_depth=6, random_state=42
        ),
        "XGBoost Regressor": XGBRegressor(
            n_estimators=120, learning_rate=0.08, max_depth=6, random_state=42, n_jobs=-1
        ),
    }

    results = {}
    fitted_pipelines = {}

    print("\n🚀 Training candidate models and evaluating metrics:")
    print("=" * 70)

    best_model_name = None
    best_test_r2 = -float("inf")

    for name, model in candidates.items():
        pipeline = Pipeline(steps=[("preprocessor", preprocessor), ("model", model)])
        pipeline.fit(X_train, y_train)
        fitted_pipelines[name] = pipeline

        # Predictions
        y_val_pred = pipeline.predict(X_val)
        y_test_pred = pipeline.predict(X_test)

        val_metrics = compute_metrics(y_val, y_val_pred)
        test_metrics = compute_metrics(y_test, y_test_pred)

        results[name] = {
            "validation": val_metrics,
            "test": test_metrics,
        }

        print(f"📌 {name}:")
        print(f"   Val  -> R²: {val_metrics['R2']:.4f} | RMSE: {val_metrics['RMSE']} kg/ha | MAE: {val_metrics['MAE']} kg/ha")
        print(f"   Test -> R²: {test_metrics['R2']:.4f} | RMSE: {test_metrics['RMSE']} kg/ha | MAE: {test_metrics['MAE']} kg/ha | MAPE: {test_metrics['MAPE_pct']}%")

        if test_metrics["R2"] > best_test_r2:
            best_test_r2 = test_metrics["R2"]
            best_model_name = name

    print("=" * 70)
    print(f"🏆 Champion Model Selected: {best_model_name} (Test R² = {best_test_r2:.4f})")

    champion_pipeline = fitted_pipelines[best_model_name]

    # Save artifacts
    champion_path = os.path.join(artifacts_dir, "champion_model.joblib")
    joblib.dump(champion_pipeline, champion_path)
    print(f"💾 Champion model saved to: {champion_path}")

    metrics_path = os.path.join(artifacts_dir, "model_metrics.json")
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(
            {
                "champion_model": best_model_name,
                "dataset_size": len(df),
                "evaluation_date": pd.Timestamp.now().isoformat(),
                "all_models": results,
            },
            f,
            indent=2,
        )
    print(f"📊 Detailed model metrics saved to: {metrics_path}")

    # Feature Importance extraction
    model_step = champion_pipeline.named_steps["model"]
    if hasattr(model_step, "feature_importances_"):
        ohe = champion_pipeline.named_steps["preprocessor"].named_transformers_["cat"]
        cat_features = ohe.get_feature_names_out(categorical_cols).tolist()
        all_features = cat_features + numerical_cols
        importances = model_step.feature_importances_
        feature_imp = sorted(
            [{"feature": f, "importance": round(float(imp), 4)} for f, imp in zip(all_features, importances)],
            key=lambda x: x["importance"],
            reverse=True,
        )
        fi_path = os.path.join(artifacts_dir, "feature_importance.json")
        with open(fi_path, "w", encoding="utf-8") as f:
            json.dump(feature_imp[:15], f, indent=2)
        print(f"🔍 Top feature importances saved to: {fi_path}")

    return best_model_name, results

if __name__ == "__main__":
    train_pipeline()
