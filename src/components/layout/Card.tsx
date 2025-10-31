
export const Card = () => {
  return (
    <article className="bg-fb-surface border border-fb-stroke rounded-lg overflow-hidden shadow-sm">
      <img
        src="https://www.lg.com/cac/images/tv-barra-de-sonido/md07596527/gallery/medium01.jpg"
        alt="Producto"
        className="w-full object-cover"
      />
      <div className="p-3">
        <h2 className="font-sans text-sm font-bold text-fb-text">Producto demo</h2>
        <p className="text-fb-text-secondary text-sm">$1000</p>
      </div>
    </article>
  )
}
