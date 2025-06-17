import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Heart, HeartOff } from "lucide-react"
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "@/lib/favorites"

export default function FormationCard({ titre, plateforme_source, niveau, prix, url }) {
  const [isFav, setIsFav] = useState(false)

  const formation = { titre, plateforme_source, niveau, prix, url }

  useEffect(() => {
    const checkFav = async () => {
      const stored = await getFavorites()
      setIsFav(stored.some((f) => f.titre === titre))
    }
    checkFav()
  }, [titre])

  const toggleFavorite = async () => {
    if (isFav) {
      await removeFavorite(titre)
    } else {
      await addFavorite(formation)
    }
    setIsFav(!isFav)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative bg-card border rounded-xl p-4 shadow-sm flex flex-col gap-2 hover:shadow-md hover:scale-[1.01] transition-all"
    >
      {/* Bouton Favori */}
      <button
        onClick={toggleFavorite}
        className="absolute top-2 right-2 text-primary hover:text-red-500 transition"
        title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        {isFav ? <HeartOff size={18} /> : <Heart size={18} />}
      </button>

      {/* Titre */}
      <h3 className="text-sm font-semibold leading-tight line-clamp-2 break-words pr-6">
        {titre}
      </h3>

      {/* Détails */}
      <div className="text-xs text-muted-foreground break-words">
        🎓 {plateforme_source} — {niveau} • 💶 {prix || "Gratuit"}
      </div>

      {/* Lien */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-600 hover:underline mt-auto"
      >
        🔗 Voir la formation
      </a>
    </motion.div>
  )
}
