import os

def save_vocab_to_file(file_path, vocab_list):
    """
    Saves the extracted vocab to a file in structured manner
    """

    # Create an output directory if it doesn't exist
    output_dir = os.path.join(os.path.dirname(__file__), "output_files")
    os.makedirs(output_dir, exist_ok=True)

    # Generate the output file path
    base_name, ext = os.path.splitext(os.path.basename(file_path))
    new_file_name = f"{base_name}_extracted_vocab.txt"
    output_file_path = os.path.join(output_dir, new_file_name)

    # Save the vocab into the file
    with open(output_file_path, "w", encoding="utf-8") as f:
        for entry in vocab_list:
            print(entry)
            f.write(f"Word: {entry['Word']}\n")
            f.write(f"Pinyin: {entry['Pinyin']}\n")
            f.write(f"Definition: {entry['Definition']}\n")
            f.write("\n")
    print(f"\nVocabulary saved to: {new_file_name}")
