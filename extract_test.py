import PyPDF2
from docx import Document
import os

def extract_pdf_test(pdf_path):
    """Extract the text from a PDF file."""
    try:
        with open(pdf_path, 'rb') as pdf_file:
            reader = PyPDF2.PdfReader(pdf_file)
            test = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
    except FileNotFoundError:
        print(f"Error: File '{pdf_path}' not found.")
        return None
    
def extract_docx_text(docx_path):
    """Extract the text from a Docx file."""
    try:
        doc = Document(docx_path)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except FileNotFoundError:
        print(f"Error: File '{docx_path}' not found.")
        return None
def extract_text(file_path):
    """Figure out which file type it is and extract the text."""
    if file_path.endswith(".pdf"):
        return extract_pdf_text(file_path)
    elif file_path.endswith(".docx"):
        return extract_docx_text(file_path)
    else:
        print("Unsupported file type. Please type in either .pdf or .docx")

#Main function
if __name__ == "__main__":
    # Default folder that holds test files
    default_folder = "TestFiles"

    file_name = input("Enter the file path (PDF or DOCX): ").strip()

    # Combine file name and folder name
    file_path = os.path.join(default_folder, file_name)

    if os.path.isfile(file_path):
        text = extract_text(file_path)
        if text:
            print("\nExtracted Text:\n")
            print(text)
        else:
            print("Text extraction was unsuccessful.")
    else:
        print(f"Error: File '{file_path}' does not exist in the os.")
