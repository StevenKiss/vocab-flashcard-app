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
    """Figure out which file type it is and extract the text."""
    if file_path.endswith(".pdf"):
        # Extra handling for pdf so that cleaning process happens
        raw_text = extract_pdf_text(file_path)
        return clean_pdf_text(raw_text) if raw_text else None
        return extract_pdf_text(file_path)
    elif file_path.endswith(".docx"):
        return extract_docx_text(file_path)
    else:
        print("Unsupported file type. Please type in either .pdf or .docx")

def extract_vocab(text):
    """
    Extract the Mandarin words, pinyin, and definitions using regular expression.
    Structure is: Word, pinyin: definition, example usage
    """

    # Remove headers
    cleaned_text = re.sub(r'Text\s+\d|Supplementary|Basic\s+Hanzi', '', text, flags=re.IGNORECASE)

    # Remove empty lines
    cleaned_text = re.sub(r'^\s*\n', '', cleaned_text, flags=re.MULTILINE)

    print(f"This is the cleaned text:\n {cleaned_text}")
    # Use regex to match Chinese characters
    pattern = r'([\u4e00-\u9fff，]+)，([a-zA-Zāáǎàēéěèōóǒòūúǔùīíǐìüǘǚǜ]+):\s*(.*?)(?=\n[\u4e00-\u9fff]+，|$)'
    matches = re.findall(pattern, text)

    # Create dictionaries to organize results
    vocab_list = []
    for match in matches:
        word = match[0].strip(", ")
        pinyin = match[1]
        definition = match[2]
        vocab_list.append({"Word": word, "Pinyin": pinyin, "Definition": definition})
    print(vocab_list)
    return vocab_list

def save_vocab_to_file(file_path, vocab_list):
    """
    Saves the extracted vocab to a file in structured manner
    """

    # Split into base_name and extension
    base_name, ext = os.path.splitext(os.path.basename(file_path))
    new_file_name = f"{base_name}_extracted_vocab.txt"

    # Save into file
    with open(new_file_name, "w", encoding="utf-8") as f:
        for entry in vocab_list:
            print(entry)
            f.write(f"Word: {entry['Word']}\n")
            f.write(f"Pinyin: {entry['Pinyin']}\n")
            f.write(f"Definition: {entry['Definition']}\n")
            f.write("\n")
    print(f"\nVocabulary saved to: {new_file_name}")


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

            print("\nExtracted Vocab:\n")
            vocab_list = extract_vocab(text)
            for vocab in vocab_list:
                print(f"{vocab['Word']} ({vocab['Pinyin']}): {vocab['Definition']}")


            # Save vocab to file
            save_vocab_to_file(file_path, vocab_list)

        else:
            print("Text extraction was unsuccessful.")
    else:
        print(f"Error: File '{file_path}' does not exist in the os.")
