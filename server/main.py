from flask import Flask, request, jsonify
from flask_cors import CORS
from formybot.formybot import FormyBot
import pandas as pd

# Charger les formations depuis le CSV
df = pd.read_csv("formations_dataset_10000_clean.csv")
formations = df.to_dict(orient="records")

# Init Flask + Bot
app = Flask(__name__)
CORS(app)
bot = FormyBot(formations)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    if not message:
        return jsonify({'error': 'Message vide'}), 400

    response = bot.handle_input(message)

    # Si le bot a répondu avec un string simple
    if isinstance(response, str):
        return jsonify({'response': {"type": "text", "text": response}})
    return jsonify({'response': response})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

