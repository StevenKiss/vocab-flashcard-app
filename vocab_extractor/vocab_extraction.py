import re

def extract_vocab(text):
    """
    Extract the Mandarin Characters, pinyin, and definitions using regular expression.
    Structure is: Character, pinyin: definition, example usage
    """

    # Remove headers
    cleaned_text = re.sub(r'Text\s+\d|Supplementary|Basic\s+Hanzi', '', text, flags=re.IGNORECASE)

    # Remove empty lines
    cleaned_text = re.sub(r'^\s*\n', '', cleaned_text, flags=re.MULTILINE)

    print(f"This is the cleaned text:\n {cleaned_text}")
    # Use regex to match Chinese characters
    pattern = r'([\u4e00-\u9fff，]+)\s*，\s*([a-zA-Zāáǎàēéěèōóǒòūúǔùīíǐìüǘǚǜ\s]+):\s*(.+?)(?=\n|$)'
    #pattern = r'([\u4e00-\u9fff，]+)\s*，\s*([a-zA-Zāáǎàēéěèōóǒòūúǔùīíǐìüǘǚǜ\s]+):\s*(.+?)(?=\n[\u4e00-\u9fff，]+，|$)'
    #pattern = r'([\u4e00-\u9fff，]+)，([a-zA-Zāáǎàēéěèōóǒòūúǔùīíǐìüǘǚǜ\s]+):\s*(.*?)(?=\n[\u4e00-\u9fff，]+，|$)'
    #pattern = r'([\u4e00-\u9fff，]+)，([a-zA-Zāáǎàēéěèōóǒòūúǔùīíǐìüǘǚǜ\s]+):\s*(.+?)(?=\n[\u4e00-\u9fff，]+，|$)'
    #pattern = r'([\u4e00-\u9fff，]+)，([a-zA-Zāáǎàēéěèōóǒòūúǔùīíǐìüǘǚǜ\s]+):\s*(.*)'
    #pattern = r'([\u4e00-\u9fff，]+)，([a-zA-Zāáǎàēéěèōóǒòūúǔùīíǐìüǘǚǜ\s]+):\s*(.*?)(?=\n[\u4e00-\u9fff，]+|$)'
    #pattern = r'([\u4e00-\u9fff，]+)，([a-zA-Zāáǎàēéěèōóǒòūúǔùīíǐìüǘǚǜ]+):\s*(.*?)(?=\n[\u4e00-\u9fff，]+|$)'
    #pattern = r'([\u4e00-\u9fff，]+)，([a-zA-Zāáǎàēéěèōóǒòūúǔùīíǐìüǘǚǜ]+):\s*(.*?)(?=\n[\u4e00-\u9fff]+，|$)'
    matches = re.findall(pattern, cleaned_text)

    # Create dictionaries to organize results
    vocab_list = []
    for match in matches:
        character = match[0].strip(", ")
        pinyin = match[1].strip()
        definition = match[2].strip()
        vocab_list.append({"Character": character, "Pinyin": pinyin, "Definition": definition})
    print(vocab_list)
    return vocab_list