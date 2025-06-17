import { useEffect, useState } from "react"
import { getFavorites } from "@/lib/favorites"
import FormationList from "@/components/ui/FormationList"

export default function Favorites() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const fetchFavorites = async () => {
      const data = await getFavorites()
      setFavorites(data)
    }
    fetchFavorites()
  }, [])

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-lg font-semibold mb-4 text-foreground">
        ❤️ Mes formations favorites
      </h1>

      {favorites.length > 0 ? (
        <FormationList title="Formations sauvegardées" items={favorites} />
      ) : (
        <div className="text-sm text-muted-foreground">
          Tu n’as encore rien ajouté à tes favoris...
        </div>
      )}
    </div>
  )
}
