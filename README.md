# 🎓 FormyBot – Interface Administrateur (Frontend)

> Projet réalisé dans le cadre d’une mise en situation professionnelle – École d’ingénieurs **ECE Paris**
> Ce projet vise à développer une application web complète avec une interface administrateur (back-office) et une interaction utilisateur via un chatbot intelligent.

---

## 🎯 Objectif du projet

Créer une interface d'administration permettant de gérer dynamiquement des cartes, des paquets et un système de récompenses, avec une expérience utilisateur enrichie via un **chatbot intelligent**.
Le projet simule un environnement professionnel avec une architecture modulaire, des responsabilités réparties et des pratiques de développement rigoureuses.

---

## 🧱 Technologies utilisées

| Technologie / Outil   | Utilisation                                        |
| --------------------- | -------------------------------------------------- |
| **Python 3.x**        | Langage principal côté serveur                     |
| **Flask**             | Micro-framework backend Python                     |
| **HTML / CSS**        | Structure et style de l'application                |
| **Tailwind CSS**      | Framework CSS utilitaire pour un design responsive |
| **Jinja2**            | Moteur de templates pour le rendu dynamique        |
| **JavaScript**        | Dynamisme des composants frontend                  |
| **unittest / pytest** | Tests unitaires                                    |
| **MAMP / Apache**     | Serveur local pour l’exécution                     |

---

## 📁 Structure du projet

```
Formy/
├── app/
│   ├── __init__.py       → Initialise l'application Flask
│   ├── main.py           → Point d’entrée
│   └── routes.py         → Définition des routes
├── static/               → Fichiers CSS / JS / images
│   └── style.css
├── templates/            → Pages HTML avec Jinja2
│   └── index.html
├── tests/                → Tests unitaires
│   └── test_main.py
├── requirements.txt      → Liste des dépendances
└── README.md             → Description du projet
```

---

## 🔧 Fonctionnement technique

1. **Requête Client** : L’utilisateur accède à une URL (ex. `/`).
2. **Initialisation** : `main.py` appelle `__init__.py` pour configurer l’application.
3. **Gestion des routes** : `routes.py` définit les URL et leurs fonctions associées.
4. **Rendu des vues** : `templates/` contient les pages HTML interprétées par Jinja2.
5. **Fichiers statiques** : CSS et JS sont chargés depuis `static/`.
6. **Tests unitaires** : via `tests/` pour garantir la stabilité des routes/fonctions.

---

## 🔮 Instructions de test / démo

1. **Cloner le projet**

```bash
git clone <lien_du_repo>
cd Formy
```

2. **Créer un environnement virtuel**

```bash
python -m venv venv
source venv/bin/activate  # ou .\venv\Scripts\activate sous Windows
```

3. **Installer les dépendances**

```bash
pip install -r requirements.txt
```

4. **Lancer le serveur local**

```bash
python app/main.py
```

5. **Accéder à l’application**
   Rendez-vous sur : `http://localhost:5000`

6. **Exécuter les tests**

```bash
python -m unittest discover tests
```

---

## 🚀 Conclusion

FormyBot propose une architecture claire, moderne et modulaire, parfaite pour une démonstration ou un prototype fonctionnel. L’interface d’administration couplée à un chatbot intelligent illustre une application web complète avec une répartition efficace des tâches et une cohérence technique entre frontend et backend.
