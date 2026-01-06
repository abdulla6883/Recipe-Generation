print("Starting Recipe Generator Backend...")
print("Importing modules (this might take a moment)...")
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

print("Loading AI Model Engine (This will download 1-2GB of models on first run, please be patient)...")
from model_engine import recipe_engine
print("AI Models loaded successfully!")

app = FastAPI(title="AI Recipe Generator API")

# Setup CORS to allow React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Chef API is Running. Use POST /generate to cook!"}

@app.post("/generate")
async def generate_recipe_endpoint(file: UploadFile = File(...)):
    try:
        # 1. Read Image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # 2. Get Description (Vision)
        print("Analyzing image...")
        caption = recipe_engine.generate_caption(image)
        print(f"Detected: {caption}")
        
        # 3. Get Recipe (Language)
        print("Generating recipe...")
        recipe = recipe_engine.generate_recipe(caption)
        
        return {
            "detected_food": caption,
            "recipe": recipe
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
