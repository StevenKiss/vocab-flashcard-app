import PyPDF2
from docx import Document
import os
import re #for extracting Mandarin text

def extract_pdf_text(pdf_path):
    """Extract the text from a PDF file."""
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

def extract_chinese_characters(text):
    """Extract only the Chinese Characters from the text."""
    # Use regex to match Chinese characters
    chinese_characters = re.findall(r'[\u4e00-\u9fff]', text)
    return chinese_characters

def save_mandarin_text(file_path, chinese_text):
    """Saves the extracted Chiense text to a new 
        file starting with the same name"""
    # Convert list into a set to keep only unique characters
    unique_chinese_text = set(chinese_text)

    # Split into base_name and extension
    base_name, ext = os.path.splitext(os.path.basename(file_path))
    new_file_name = f"{base_name}_mandarin_only.txt"

    # Write unique Chinese Characters to the new file
    with open(new_file_name, "w", encoding = "utf-8") as f:
        f.write("\n".join(unique_chinese_text))
    print(f"\nSaved Mandarin Text to '{new_file_name}'.")


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

            print("\nExtracted Mandarin Text:\n")
            chinese_text = extract_chinese_characters(text)
            print(chinese_text)

            # Write the chinese text to a file
            save_mandarin_text(file_path, chinese_text)

        else:
            print("Text extraction was unsuccessful.")
    else:
        print(f"Error: File '{file_path}' does not exist in the os.")
