import torch
from transformers import BlipProcessor, BlipForConditionalGeneration
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from PIL import Image

class RecipeAI:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Loading AI Models on {self.device}...")

        # 1. Load Vision Model (BLIP Large - Better details)
        print("Loading Vision Model (BLIP Large)...")
        self.blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
        self.blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large").to(self.device)

        # 2. Load Recipe Model (Flan-T5 Large - Smarter Chef)
        print("Loading Chef Model (Flan-T5 Large)...")
        self.recipe_tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-large")
        self.recipe_model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-large").to(self.device)
        
        print("Models Loaded Successfully!")

    def generate_caption(self, image: Image.Image):
        """Step 1: Convert Image to Text Description"""
        inputs = self.blip_processor(image, return_tensors="pt").to(self.device)
        out = self.blip_model.generate(**inputs, max_new_tokens=100)
        caption = self.blip_processor.decode(out[0], skip_special_tokens=True)
        return caption

    def generate_recipe(self, food_name: str):
        """Step 2: Convert Food Name to Recipe using Flan-T5"""
        # Prompt engineering for the general-purpose instruct model
        prompt = f"Write a detailed cooking recipe for {food_name}. Include a Creative Title, a list of Ingredients, and step-by-step Instructions."
        
        inputs = self.recipe_tokenizer(prompt, return_tensors="pt", max_length=512, truncation=True).to(self.device)
        
        output_ids = self.recipe_model.generate(
            **inputs, 
            max_length=600,
            num_beams=4,
            temperature=0.7,
            no_repeat_ngram_size=2,
            early_stopping=True
        )
        
        recipe_text = self.recipe_tokenizer.decode(output_ids[0], skip_special_tokens=True)
        return self._parse_recipe(recipe_text)

    def _parse_recipe(self, raw_text):
        """
        The T5 model returns a single string. We need to parse it into 
        Title, Ingredients, and Instructions.
        Format often: "title: ... ingredients: ... directions: ..."
        """
        # Simple heuristic parsing (the model output format is relatively consistent)
        title = "Delicious Dish"
        ingredients = []
        instructions = []

        try:
            # Normalize keys
            text = raw_text.lower()
            print(f"DEBUG - Raw Model Output: {text}") # Logging for debugging
            
            # Find indices
            idx_title = text.find("title:")
            idx_ing = text.find("ingredients:")
            
            # Try finding directions or instructions
            idx_dir = text.find("directions:")
            if idx_dir == -1:
                idx_dir = text.find("instructions:")
            
            if idx_title != -1 and idx_ing != -1:
                title = raw_text[idx_title+6:idx_ing].strip().title()
            
            if idx_ing != -1 and idx_dir != -1:
                ing_section = raw_text[idx_ing+12:idx_dir].strip()
                
                # 1. Try splitting by explicit 'sep' token often used by T5
                import re
                ingredients = [i.strip() for i in re.split(r'\s*sep\s*', ing_section) if i.strip()]
                
                # 2. Fallback: Try splitting by semicolon or newline if 'sep' didn't work well
                if len(ingredients) < 2:
                    ingredients = [i.strip() for i in re.split(r'[;\n]', ing_section) if i.strip()]
                
                # 3. Last resort: Split by comma (careful, might split "salt, to taste")
                if len(ingredients) < 2:
                    ingredients = [i.strip() for i in ing_section.split(',') if i.strip()]

            if idx_dir != -1:
                dir_section = raw_text[idx_dir+11:].strip()
                instructions = [d.strip() for d in dir_section.split(". ") if d.strip()]

        except Exception as e:
            print(f"Parsing Error: {e}")
            title = raw_text[:50] # Fallback
            
        return {
            "title": title,
            "ingredients": ingredients,
            "instructions": instructions,
            "raw_text": raw_text # Return raw text for fallback
        }

# Singleton instance
recipe_engine = RecipeAI()
