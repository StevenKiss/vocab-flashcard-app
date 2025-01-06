from flask import Flask, request, jsonify
from flask_cors import CORS # For front-end back-end communication between different origins
import os
from werkzeug.utils import secure_filename
from docx import Document
import sys

# Add parent direc to python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from vocab_extractor.text_extraction import extract_text
from vocab_extractor.vocab_extraction import extract_vocab
from vocab_extractor.character_extraction import extract_individual_characters

app = Flask(__name__)
CORS(app) # THis allows for cross-origin requests to API

# Upload folder configuration
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
ALLOWED_EXTENSIONS = {'docx'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/upload", methods=["POST"])
def upload_file():
    """
    Handle file uploads, extract text, and return vocabulary and character data.
    """
    print("Request headers:", request.headers)
    print("Request files:", request.files)

    # Check if file part exists in the request
    if "file" not in request.files:
        print("Request files:", request.files)
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]

    # Check if a file was selected
    if file.filename == "":
        print("Empty filename provided")
        return jsonify({"error":"No selected file"}), 400
    
    # Save the file
    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    print(f"Saving file to: {file_path}")
    file.save(file_path)

    # Extraction logic
    try:
        print(f"Extracting text from: {file_path}")

        # Extract from DOCX file
        text = extract_text(file_path)
        print("Doc extraction successful")

        # Extract the vocab
        vocab_list = extract_vocab(text)
        print("Vocabulary extraction successful")
        print(f"Vocab List: {vocab_list}\n\n")

        # Extract individual characters
        characters = extract_individual_characters(vocab_list, set_name=os.path.splitext(file.filename)[0] )
        print("\n\nCharacter extraction successful")
        print(f"Character Extraction: {characters}")

        # Return both vocab and character data
        return jsonify({"vocab": vocab_list, "characters": characters})
    
    except Exception as e:
        print("Error during extraction:", str(e))
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port = 5000, debug=True)
