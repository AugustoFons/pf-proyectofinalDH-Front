
export const Sidebar = () => {
  return (
    <aside className="col-span-3 bg-fb-surface border border-fb-stroke rounded-lg p-4 h-[80vh] sticky top-24">
      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar en marketplease..."
          className="w-full px-3 py-2 border border-fb-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-fb-primary"
        />
      </div>

      {/* Categorías */}
      <h2 className="font-sans text-sm font-semibold text-fb-text mb-2">
        Categorías
      </h2>
      <ul className="space-y-2 text-fb-text-secondary">
        <li className="hover:text-fb-primary cursor-pointer">Vehículos</li>
        <li className="hover:text-fb-primary cursor-pointer">Propiedades</li>
        <li className="hover:text-fb-primary cursor-pointer">Electrónica</li>
        <li className="hover:text-fb-primary cursor-pointer">Hogar</li>
        <li className="hover:text-fb-primary cursor-pointer">Ropa y accesorios</li>
      </ul>
    </aside>
  )
}
