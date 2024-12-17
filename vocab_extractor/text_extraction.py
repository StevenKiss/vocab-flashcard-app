import PyPDF2
from docx import Document
import re

def extract_pdf_text(pdf_path):
    """
    Extract text from a PDF File.
    WORK IN PROGRESS
    """
    try:
        with open(pdf_path, 'rb') as pdf_file:
            reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
    except FileNotFoundError:
        print(f"Error: File '{pdf_path}' not found.")
        return None

def extract_docx_text(docx_path):
    """
    Extract the text from a Docx file.
    """
    try:
        doc = Document(docx_path)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except FileNotFoundError:
        print(f"Error: File '{docx_path}' not found.")
        return None
    
def clean_pdf_text(text):
    """
    Clean's the PDF text to make it ready for processing:
    - Merges broken lines
    - Removes spaces between chinese characters and pinyin
    - Normalize whitespace
    """

    # Merging broken lines (Happens when a line breka is within a sentence)
    text = re.sub(r'(?<=[\u4e00-\u9fff])\s*\n\s*(?=[\u4e00-\u9fff])', '', text)  # Chinese
    text = re.sub(r'(?<=[a-zA-Z])\s*\n\s*(?=[a-zA-Z])', ' ', text)  # English
    text = re.sub(r'(?<=[\u4e00-\u9fff])\s*\n\s*(?=[a-zA-Z])', ' ', text)  # Chinese to English
    text = re.sub(r'(?<=[a-zA-Z])\s*\n\s*(?=[\u4e00-\u9fff])', ' ', text)  # English to Chinese

    # Remove extra spaces around punctuation
    text = re.sub(r'\s*，\s*', '，', text)  # Normalize commas
    text = re.sub(r'\s*:\s*', ': ', text)  # Normalize colons
    text = re.sub(r'\s+', ' ', text)  # Replace multiple spaces with one

     # Step 3: Add clear delimiters before new entries
    text = re.sub(r'(?<=\n)([\u4e00-\u9fff]+，[a-zA-Zāáǎàēéěèōóǒòūúǔùīíǐìüǘǚǜ]+:)', r'\n\n\1', text)


    # Remove unnecessary whitespace
    return text.strip()

def extract_text(file_path):
    """
    Figure out which file type it is and extract the text.
    """
    if file_path.endswith(".pdf"):
        # Extra handling for pdf so that cleaning process happens
        raw_text = extract_pdf_text(file_path)
        return clean_pdf_text(raw_text) if raw_text else None
        return extract_pdf_text(file_path)
    elif file_path.endswith(".docx"):
        return extract_docx_text(file_path)
    else:
        print("Unsupported file type. Please type in either .pdf or .docx")
