import markovify

import os

# print("is this working?", flush=True)
BASE = os.path.dirname(__file__)
msg_path = os.path.join(BASE, "messages", "model.json")
try:
    with open(msg_path) as f:
        text = f.read()
except Exception as e:
    print('Error opening file:', e)
    text = None

if text:
    # only do this if text has stuff
    text_model = markovify.Text.from_json(text) # text is a cached model
    sentence = text_model.make_sentence()
    if sentence is None:
        # if unable to produce sentence
        sentence = "No sentence generated."
    print(sentence, flush=True)
else:
    print("No valid text to generate from.")
