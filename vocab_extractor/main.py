import os
from text_extraction import extract_text
from vocab_extraction import extract_vocab
from file_operations import save_vocab_to_file

def main():
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

if __name__ == "__main__":
    main()