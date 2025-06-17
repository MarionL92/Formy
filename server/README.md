# ⚙️ FormyBot - Backend (Server)

Voici le backend de **FormyBot**, un chatbot éducatif en Flask qui reçoit des requêtes depuis le frontend et retourne des réponses selon les profils utilisateurs et leurs besoins.

## 🐍 Prérequis

- Python 3.10+
- `pip`
- `virtualenv` (optionnel mais recommandé)

## 🔧 Installation

```bash
cd server
python -m venv .venv
source .venv/bin/activate   # Windows : .venv\Scripts\activate
pip install -r requirements.txt
```


## 🔥 Lancer le serveur

```bash
python main.py
```

> Il tourne par défaut sur `http://localhost:5000`

## 📦 Structure

```
server/
├── main.py               # Point d'entrée Flask
├── formybot/             # Le cœur du bot
│   ├── formybot.py       # Logique principale
│   └── nlp/              # NLP utils (matcher, extractor, etc.)
├── data/formations.json # Base des formations à matcher
```

## 🧠 Le bot

- `FormyBot` extrait les intentions, les formats et les niveaux depuis les messages utilisateurs
- Il recommande des formations depuis un JSON local
- Tout est stateless côté backend (pas de DB pour l’instant)

---

## ✅ À savoir

- Assure-toi que le frontend pointe vers `http://localhost:5000/chat`
- CORS est activé via `flask-cors`

---

## 🙌 Contact

Si tu bloques : Slack ou ping @Noam sur Discord ✌️