import os

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
