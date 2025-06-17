import re
import json
import unicodedata
import os
import spacy
from fuzzywuzzy import fuzz

nlp_fr = spacy.load("fr_core_news_md", disable=["ner", "parser"])

SOFT_CORRECTIONS = {
    "fasil": "facile",
    "intermediaire": "intermédiaire",
    "avance": "avancé",
    "avancer": "avancé",
    "francais": "français",
    "videos": "vidéo",
    "video": "vidéo",
    "quizz": "quiz",
    "finance": "finance",
    "projets": "projet",
    "podcasts": "podcast",
    "fainance": "finance",
    "cybersecurite": "cybersécurité",
    "securite": "sécurité",
    "reseaux": "réseaux",
    "bigdata": "big data",
    "securite reseaux": "sécurité réseaux",
    "securite reseau": "sécurité réseaux",
    "intelligenceartificielle": "intelligence artificielle",
    "debutant": "débutant"
}

SUGGESTED_TERMS = {
    "formats": ["vidéo", "pdf", "podcast", "quiz", "projet"],
    "niveaux": ["débutant", "intermédiaire", "avancé"],
    "langues": [],
    "domaines": ["finance", "cybersécurité", "data", "marketing", "cloud", "python", "intelligence artificielle"]
}

def apply_soft_corrections(text):
    for wrong, correct in SOFT_CORRECTIONS.items():
        text = re.sub(rf"\b{wrong}\b", correct, text)
    return text

def fuzzy_correct(text):
    words = text.split()
    corrected = []
    for word in words:
        match = None
        for options in SUGGESTED_TERMS.values():
            for ref in options:
                if fuzz.ratio(word, ref) >= 85:
                    match = ref
                    break
            if match:
                break
        corrected.append(match or word)
    return " ".join(corrected)

def normalize(text):
    if not isinstance(text, str):
        return ""
    text = unicodedata.normalize("NFD", text).encode("ascii", "ignore").decode("utf-8").lower().strip()
    text = apply_soft_corrections(text)
    text = fuzzy_correct(text)
    return text

MAPPING_PATH = os.path.join("data", "label_mapping.json")
with open(MAPPING_PATH, "r", encoding="utf-8") as f:
    MAPPING = json.load(f)["groups"]

def extract_info(text):
    text_norm = normalize(text)
    doc = nlp_fr(text)

    objectifs = []
    groupes = {}

    if re.search(r"\b(travail|emploi|job)\b", text_norm):
        objectifs.append("objectif:travailler")
    if re.search(r"\b(reconversion|changer de metier|changer de voie)\b", text_norm):
        objectifs.append("objectif:reconversion")
    if re.search(r"\b(perfectionner|ameliorer|approfondir)\b", text_norm):
        objectifs.append("objectif:perfectionner")
    if re.search(r"\b(decouvrir|initiation|curieux|essayer)\b", text_norm):
        objectifs.append("objectif:decouverte")

    for group_name, config in MAPPING.items():
        for col, val_list in config.get("values", {}).items():
            for val in val_list:
                val_norm = normalize(val)
                if val_norm in text_norm or fuzz.partial_ratio(val_norm, text_norm) >= 85:
                    groupes.setdefault(group_name, []).append(val)

    # Ajout automatique du domaine parent à partir des sous-domaines détectés
    SUBDOMAIN_TO_DOMAIN = {
        "Analyse Financière": "Finance & Comptabilité",
        "Comptabilité Générale": "Finance & Comptabilité",
        "Contrôle de Gestion": "Finance & Comptabilité",
        "Gestion de Trésorerie": "Finance & Comptabilité",

        "SEO": "Marketing Digital",
        "Email Marketing": "Marketing Digital",
        "Content Marketing": "Marketing Digital",
        "Social Media Marketing": "Marketing Digital",

        "Pentesting": "Cybersécurité",
        "SIEM": "Cybersécurité",
        "Sécurité Réseaux": "Cybersécurité",
        "Cryptographie": "Cybersécurité",
        "Sécurité des Applications": "Cybersécurité",

        "Machine Learning": "Intelligence Artificielle",
        "Deep Learning": "Intelligence Artificielle",
        "Computer Vision": "Intelligence Artificielle",
        "MLOps": "Intelligence Artificielle",
        "NLP": "Intelligence Artificielle",

        "Pandas": "Data Science",
        "Big Data": "Data Science",
        "Spark": "Data Science",
        "Analyse de Données": "Data Science",

        "HTML/CSS": "Développement Web",
        "JavaScript": "Développement Web",
        "React": "Développement Web",
        "Node.js": "Développement Web",
        "Flask": "Développement Web",
        "Django": "Développement Web",
        "Vue.js": "Développement Web"
    }

    sous_domaines = groupes.get("sous_domaines", [])
    for sd in sous_domaines:
        parent = SUBDOMAIN_TO_DOMAIN.get(sd)
        if parent:
            groupes.setdefault("domaines", []).append(parent)

    keywords = [token.lemma_ for token in doc if token.pos_ in ["NOUN", "PROPN", "VERB"]]

    return {
        "labels": list(set(keywords + objectifs)),
        "labels_by_group": {k: list(set(v)) for k, v in groupes.items() if v}
    }