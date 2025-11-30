import { NavLink } from "react-router-dom";

type CardProps = {
  id: number;
  title: string;
  image?: string;
  description?: string;
  price?: number;
}

export function Card({ id, title, image, price }: CardProps) {
  return (
    <NavLink to={`/producto/${id}`}>
      <article className="bg-fb-surface border border-fb-stroke rounded-lg overflow-hidden shadow-sm">
        <img
          src={image || "/placeholder.png"}
          alt={title}
          className="w-full object-cover"
        />
        <div className="p-3">
          <h2 className="font-sans text-sm font-bold text-fb-text">{title}</h2>
          <p className="text-fb-text-secondary text-sm">${price?.toFixed(2)}</p>
        </div>
      </article>
    </NavLink>
  )
}
