import FormationCard from "./FormationCard"

export default function FormationList({ title, items }) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Titre */}
      <h2 className="text-sm font-medium text-muted-foreground mb-4">
        {title}
      </h2>

      {/* Grille responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((formation, idx) => (
          <FormationCard key={idx} {...formation} />
        ))}
      </div>
    </div>
  )
}
