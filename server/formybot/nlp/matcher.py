import json
import functools
import unicodedata
from .preprocess import preprocess_formation
from sentence_transformers import SentenceTransformer, util

# Chargement du modèle de similarité sémantique
model = SentenceTransformer("all-MiniLM-L6-v2")
QUALITY_KEYS = ["note_utilisateurs", "nombre_avis", "taux_de_succès", "taux_de_succes"]

@functools.lru_cache
def get_label_mapping():
    with open("data/label_mapping.json", "r", encoding="utf-8") as f:
        return json.load(f)["groups"]

def normalize_str(s):
    return unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode("utf-8").lower().strip()

def has_match(formation, col, aliases):
    val = normalize_str(str(formation.get(col, "")))
    return any(normalize_str(alias) in val for alias in aliases)

def score_quality(f):
    note = float(f.get("note_utilisateurs") or 0)
    avis = int(f.get("nombre_avis") or 0)
    taux = float(f.get("taux_de_succès") or f.get("taux_de_succes") or 0)
    return (note / 5) * 40 + min(avis, 500) / 500 * 30 + (taux / 100) * 30

def find_closest_matches(user_input, formations, top_k=5):
    texts = [f"{f.get('titre', '')} {f.get('description', '')}" for f in formations]
    embeddings = model.encode(texts + [user_input], convert_to_tensor=True)
    similarities = util.cos_sim(embeddings[-1], embeddings[:-1])[0]
    ranked_indices = similarities.argsort(descending=True)

    results = []
    print("\n[DEBUG] Résultats semantiques avec SentenceTransformer :")
    for i in range(min(top_k, len(ranked_indices))):
        idx = int(ranked_indices[i])
        f = formations[idx]
        score = float(similarities[idx])
        print(f"{i+1}. {f.get('titre', '')[:60]}... — Score sémantique : {round(score, 3)}")
        if score > 0.3:
            results.append(f)
    return results

def match_formations(profile, formations, top_k=5):
    labels_by_group = profile.get("labels_by_group", {})
    all_labels = profile.get("labels", [])
    objectifs = [l for l in all_labels if l.startswith("objectif:")]
    mots_cles = [l for l in all_labels if not l.startswith("objectif:")]

    # Prétraitement des formations
    for f in formations:
        preprocess_formation(f)

    # === Étape 1 : filtrage par domaines et sous-domaines ===
    domaines = labels_by_group.get("domaines", [])
    sous_domaines = labels_by_group.get("sous_domaines", [])
    if domaines or sous_domaines:
        formations = [
            f for f in formations
            if any(normalize_str(d) in normalize_str(f.get("thématique", "")) for d in domaines)
            or any(normalize_str(sd) in normalize_str(f.get("sous-thématique", "")) for sd in sous_domaines)
        ]

    # === Étape 2 : filtrage par autres critères ===
    filtered = formations
    for group_name, labels in labels_by_group.items():
        if group_name in ["domaines", "sous_domaines", "langues"]:
            continue  # on ignore les langues
        mapping = get_label_mapping().get(group_name, {})
        for col, aliases in mapping.get("values", {}).items():
            filtered = [f for f in filtered if has_match(f, col, labels)]

    print(f"[DEBUG] Formations restantes après filtrage : {len(filtered)}")
    if not filtered:
        return find_closest_matches(profile.get("raw_input", ""), formations, top_k)

    # === Étape 3 : scoring sémantique + qualité ===
    user_input = profile.get("raw_input", "").strip()
    texts = [f"{f.get('titre', '')} {f.get('description', '')}" for f in filtered]
    embeddings = model.encode(texts + [user_input], convert_to_tensor=True)
    similarities = util.cos_sim(embeddings[-1], embeddings[:-1])[0]
    scored = list(zip(filtered, similarities))

    def final_score(item):
        f, sim = item
        return float(sim) * 50 + score_quality(f)

    scored.sort(key=final_score, reverse=True)

    # === Étape 4 : suppression des doublons (par titre) ===
    seen_titles = set()
    unique_results = []
    for f, _ in scored:
        titre_norm = normalize_str(f.get("titre", ""))
        if titre_norm not in seen_titles:
            unique_results.append(f)
            seen_titles.add(titre_norm)
        if len(unique_results) >= top_k:
            break

    # Si on n’a pas assez de résultats uniques, on complète avec doublons
    if len(unique_results) < top_k:
        already_ids = {id(f) for f in unique_results}
        for f, _ in scored:
            if id(f) not in already_ids:
                unique_results.append(f)
            if len(unique_results) >= top_k:
                break

    return unique_results