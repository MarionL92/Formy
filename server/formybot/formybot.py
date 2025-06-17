from .nlp.extractor import extract_info
from .nlp.matcher import match_formations
from .nlp.preprocess import normalize
import re


def merge_profiles(base, new):
    base['labels'].extend(new.get('labels', []))
    for k, vals in new.get('labels_by_group', {}).items():
        base['labels_by_group'].setdefault(k, []).extend(vals)
    base['labels'] = list(dict.fromkeys(base['labels']))
    for k in base['labels_by_group']:
        base['labels_by_group'][k] = list(dict.fromkeys(base['labels_by_group'][k]))


class FormyBot:
    def __init__(self, formations):
        self.profile = {"labels": [], "labels_by_group": {}}
        self.stage = "start"
        self.formations = formations
        self.last_results = []

    def infos_manquantes(self):
        missing = []
        labels = self.profile.get("labels_by_group", {})
        if "domaines" not in labels and "sous_domaines" not in labels:
            missing.append("thématique")
        if "formats" not in labels or not labels["formats"]:
            missing.append("format")
        if "niveaux" not in labels or not labels["niveaux"]:
            missing.append("niveau")
        return missing

    def handle_input(self, user_input):
        user_input = normalize(user_input)
        self.profile["raw_input"] = user_input

        # Détail sur une formation
        if self.stage == "match" and re.search(r"(info|détail|plus).*(\d|premi|1er|1ère)", user_input):
            match = re.search(r"(\d+)", user_input)
            index = int(match.group(1)) - 1 if match else 0
            if 0 <= index < len(self.last_results):
                f = self.last_results[index]
                return {"type": "text", "text": self._formation_detail(f)}
            return {"type": "text", "text": "Je n’ai pas trouvé cette formation. Essaie avec un numéro entre 1 et 5."}

        # Détection directe par numéro
        if self.stage == "match" and re.fullmatch(r"\d+", user_input):
            index = int(user_input.strip()) - 1
            if 0 <= index < len(self.last_results):
                return {"type": "text", "text": self._formation_detail(self.last_results[index])}
            else:
                return {"type": "text", "text": "Ce numéro ne correspond à aucune formation affichée."}

        # Première requête
        if self.stage == "start":
            self.profile = {
                "labels": [],
                "labels_by_group": {},
                "raw_input": user_input
            }
            info = extract_info(user_input)
            merge_profiles(self.profile, info)

            self.stage = "collect_info"
            missing = self.infos_manquantes()
            if missing:
                return {
                    "type": "text",
                    "text": "Il me manque encore : " + ", ".join(missing) + "\nEx : \"pdf, débutant\" ou \"vidéo, intermédiaire\""
                }
            else:
                self.stage = "match"
                return self._format_results()

        # Infos complémentaires
        elif self.stage == "collect_info":
            info = extract_info(user_input)
            merge_profiles(self.profile, info)
            missing = self.infos_manquantes()
            if missing:
                return {
                    "type": "text",
                    "text": "Il me manque encore : " + ", ".join(missing) + "\nEx : \"podcast, facile\" ou \"quiz, avancé\""
                }
            else:
                self.stage = "match"
                return self._format_results()

        # Après match
        elif self.stage == "match":
            self.stage = "start"
            return {
                "type": "text",
                "text": "Si tu veux relancer une recherche, tape une nouvelle phrase."
            }

        self.stage = "start"
        return {"type": "text", "text": "Hmm… j'ai pas compris, tu peux reformuler ?"}

    def _format_results(self):
        results = match_formations(self.profile, self.formations)
        self.last_results = results

        if not results:
            self.stage = "collect_info"
            return {
                "type": "text",
                "text": "😕 Je n'ai rien trouvé avec ces critères.\nEssaie un autre mot-clé ou modifie le format ou le niveau."
            }

        # Retourne les résultats en JSON structuré pour le frontend
        return {
            "type": "formations",
            "title": "Voici quelques formations que je te recommande 👇",
            "items": [
                {
                    "titre": f.get("titre", "Sans titre"),
                    "plateforme_source": f.get("plateforme_source", "Inconnue"),
                    "niveau": f.get("niveau", "N/A"),
                    "prix": f.get("prix", "Gratuit"),
                    "url": f.get("url", None),
                }
                for f in results
            ]
        }

    def _formation_detail(self, f):
        return (
            f"\n📘 **{f.get('titre', 'Sans titre')}**\n"
            f"📚 Description : {f.get('description', 'N/A')}\n"
            f"🎓 Niveau : {f.get('niveau', 'N/A')} | 📦 Format : {f.get('format', 'N/A')}\n"
            f"💵 Prix : {f.get('prix', 'N/A')} € | Plateforme : {f.get('plateforme_source', 'N/A')}\n"
            f"🔗 Lien : {f.get('url', 'Non disponible')}"
        )
