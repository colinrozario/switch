import os
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# Setup paths
BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, "..", "..", "ml_data", "synthetic_career_data.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)

def train_model():
    print(f"Loading data from {DATA_PATH}...")
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Training data not found at {DATA_PATH}. Please run the generator script first.")
        
    df = pd.read_csv(DATA_PATH)
    
    # 1. Preprocessing
    # We want to predict 'recommended_role' based on 'skills' and 'current_salary'
    X = df[['skills', 'current_salary']]
    y = df['recommended_role']
    
    # Split the dataset
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 2. Build the Model Pipeline
    # - TF-IDF for analyzing the comma-separated text of skills
    # - StandardScaler for normalizing the salary
    preprocessor = ColumnTransformer(
        transformers=[
            ('text', TfidfVectorizer(token_pattern=r'(?u)\b\w+\b', stop_words='english'), 'skills'),
            ('num', StandardScaler(), ['current_salary'])
        ]
    )
    
    # Using RandomForest as our custom prediction engine
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced'))
    ])
    
    # 3. Training
    print("Training the Custom Recommendation Pipeline...")
    pipeline.fit(X_train, y_train)
    
    # 4. Evaluation
    print("Evaluating the model...")
    y_pred = pipeline.predict(X_test)
    print("\n--- Classification Report ---")
    print(classification_report(y_test, y_pred))
    
    # 5. Exporting Model
    model_export_path = os.path.join(MODEL_DIR, "path_recommender.pkl")
    with open(model_export_path, 'wb') as f:
        pickle.dump(pipeline, f)
        
    print(f"\nModel successfully trained and saved to: {model_export_path}")
    print("This pipeline is now ready to be integrated into the backend API!")

if __name__ == "__main__":
    train_model()
