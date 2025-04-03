import argparse
import os
import sys
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from dotenv import load_dotenv
import logging
import gc

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    stream=sys.stderr
)

# Load environment variables
load_dotenv()

# Global variables for model caching
_model = None
_tokenizer = None

def get_model_and_tokenizer():
    """Initialize and cache the model and tokenizer."""
    global _model, _tokenizer
    if _model is None or _tokenizer is None:
        try:
            # Get absolute path to the model directory
            current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            model_path = os.path.join(current_dir, "models", "phi-2")
            logging.info(f"Loading model from: {model_path}")
            
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model directory not found at {model_path}")
            
            # Force CUDA if available
            if not torch.cuda.is_available():
                logging.warning("CUDA is not available. Running on CPU will be slow!")
                device = "cpu"
            else:
                device = "cuda"
                # Set CUDA device
                torch.cuda.set_device(0)
                
            logging.info(f"Using device: {device}")
            
            if device == "cuda":
                # Log GPU info
                logging.info(f"GPU Device: {torch.cuda.get_device_name(0)}")
                logging.info(f"Available GPU memory: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.2f} GB")
                
                # Clear memory
                gc.collect()
                torch.cuda.empty_cache()
                
            # Load tokenizer first
            logging.info("Loading tokenizer...")
            _tokenizer = AutoTokenizer.from_pretrained(
                model_path,
                trust_remote_code=True,
                local_files_only=True
            )
            
            # Load model with optimizations
            logging.info("Loading model...")
            model_kwargs = {
                "trust_remote_code": True,
                "local_files_only": True,
                "low_cpu_mem_usage": True,
            }
            
            if device == "cuda":
                model_kwargs.update({
                    "torch_dtype": torch.float16,
                    "device_map": "auto",
                })
            
            _model = AutoModelForCausalLM.from_pretrained(
                model_path,
                **model_kwargs
            )
            
            # Move model to GPU if available
            if device == "cuda":
                logging.info("Moving model to GPU...")
                _model = _model.half()  # Convert to FP16
                _model = _model.to(device)
                torch.cuda.empty_cache()
            
            _model.eval()  # Set to evaluation mode
            logging.info(f"Model loaded successfully on {device}!")
            
            # Log memory usage
            if device == "cuda":
                logging.info(f"GPU memory allocated: {torch.cuda.memory_allocated(0) / 1024**3:.2f} GB")
                logging.info(f"GPU memory cached: {torch.cuda.memory_reserved(0) / 1024**3:.2f} GB")
            
        except Exception as e:
            logging.error(f"Error loading model: {str(e)}")
            logging.error("Stack trace:", exc_info=True)
            raise
            
    return _model, _tokenizer

def query_local_llm(prompt: str) -> str:
    """Query the local model for a response."""
    try:
        logging.info("Starting query process...")
        
        # Format prompt with medical context
        formatted_prompt = f"""You are a knowledgeable pharmacy AI assistant. Please provide accurate, helpful information about medicines and health topics. Remember to include appropriate medical disclaimers.

Question: {prompt}

Answer:"""
        
        logging.info("Getting model and tokenizer...")
        model, tokenizer = get_model_and_tokenizer()
        
        logging.info("Tokenizing input...")
        inputs = tokenizer(formatted_prompt, return_tensors="pt", truncation=True, max_length=256)
        
        # Move inputs to GPU if available
        device = next(model.parameters()).device
        inputs = {k: v.to(device) for k, v in inputs.items()}
        
        logging.info("Generating response...")
        with torch.no_grad(), torch.cuda.amp.autocast(enabled=device=="cuda"):
            outputs = model.generate(
                **inputs,
                max_new_tokens=128,
                num_return_sequences=1,
                do_sample=True,
                temperature=0.7,
                pad_token_id=tokenizer.eos_token_id,
                no_repeat_ngram_size=2,
                use_cache=True
            )
        
        logging.info("Decoding response...")
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Clean up response
        response = response.replace(formatted_prompt, "").strip()
        if "disclaimer" not in response.lower():
            response += "\n\nDisclaimer: This is AI-generated advice. Always consult healthcare professionals for medical decisions."
        
        logging.info("Response generated successfully!")
        return response
        
    except Exception as e:
        logging.error(f"Error generating response: {str(e)}")
        logging.error("Stack trace:", exc_info=True)
        return "I apologize, but I'm having trouble generating a response. Please try again later."

def main():
    parser = argparse.ArgumentParser(description='Query LLM API')
    parser.add_argument('--prompt', type=str, required=True, help='The prompt to send to the LLM')
    parser.add_argument('--provider', type=str, default='local', choices=['local'], help='The LLM provider to use')
    args = parser.parse_args()

    response = query_local_llm(args.prompt)
    print(response)

if __name__ == "__main__":
    main() 