import re

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