from flask import Flask, request, jsonify
from flask_cors import CORS # For front-end back-end communication between different origins
import os
import sys

# Add parent direc to python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from vocab_extractor.text_extraction import extract_text
from vocab_extractor.vocab_extraction import extract_vocab
app = Flask(__name__)
CORS(app) # THis allows for cross-origin requests to API

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_file():
    print("Request headers:", request.headers)
    print("Request files:", request.files)

    if "file" not in request.files:
        print("Request files:", request.files)
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        print("Empty filename provided")
        return jsonify({"error":"No selected file"}), 400
    
    # Save the file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    print(f"Saving file to: {file_path}")
    file.save(file_path)

    # Extraction logic
    try:
        print(f"Extracting text from: {file_path}")
        text = extract_text(file_path)
        print("Text extraction successful")
        vocab_list = extract_vocab(text)
        print("Vocabulary extraction successful")
        return jsonify({"vocab": vocab_list})
    except Exception as e:
        print("Error during extraction:", str(e))
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port = 5000, debug=True)
