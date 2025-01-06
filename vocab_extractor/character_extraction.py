import uuid

def extract_individual_characters(vocab_list, set_name="NoSet"):
    """
    Extracts individual characters from compound words and create medtadata.

    param vocab_list: List of dictionaries with 'Character', 'Pinyin', and 'Definition'.
    param set_name: The name of the set this data belongs to.
    
    return: List of individiual characters with metadata
    """
    individual_characters = {}

    for entry in vocab_list: 
        word = entry["Character"]
        pinyin = entry["Pinyin"]
        definition = entry["Definition"]

        # If the word is a single character
        if len(word) == 1:
            char_id = str(uuid.uuid4())
            individual_characters[word] = {
                "id": char_id,
                "character": word,
                "pinyin": pinyin,
                "definition": definition,
                "phrases": [],
                "sets": [set_name]
            }
        else:
            # Handle case  where it is a compound word
            for char in word:
                char_id = str(uuid.uuid4())

                # Add or update the character's entry
                if char not in individual_characters:
                    individual_characters[char] = {
                        "id": char_id,
                        "character": char,
                        "pinyin": "", #Leave empty for time being as it is complicated to implement
                        "definition": "", #Leave empty for time being as it is complicated to implement
                        "phrases": [],
                        "sets": [set_name]
                    }

                # Add the compound word as a phrase
                individual_characters[char]["phrases"].append({
                    "phrase": word,
                    "phrase_pinyin": pinyin,
                    "phrase_definition": definition
                })

    # Convert the dictionary to list
    return list(individual_characters.values())