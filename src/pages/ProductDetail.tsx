import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import { TbArrowLeft } from "react-icons/tb";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    productService
      .getById(id as string)
      .then((res: any) => {
        setProduct(res);
        setActiveIndex(0);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="mt-10 text-center text-fb-text-secondary">Cargando...</p>;
  }

  if (!product) {
    return <p className="mt-10 text-center text-fb-text-secondary">Producto no encontrado</p>;
  }

  const images: string[] = product.images?.length ? product.images : ["/placeholder.png"];

  return (
    <main className="pt-1 bg-fb-background min-h-screen pb-16">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-12 gap-8">

          {/* GALERÍA */}
          <section className="col-span-12 lg:col-span-7">
            {/* Imagen principal */}
            <div className="rounded-xl overflow-hidden bg-black/5">
              <img
                src={images[activeIndex]}
                alt={product.name}
                className="w-full h-[420px] md:h-[480px] object-cover"
              />
            </div>

            {/* Tira de miniaturas */}
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border-[2.5px] ${index === activeIndex
                      ? "border-fb-primary"
                      : "border-fb-stroke hover:border-fb-primary/70"
                      }`}
                  >
                    <img
                      src={img}
                      alt={`Imagen ${index + 1}`}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* SIDEBAR DERECHA */}
          <aside className="col-span-12 lg:col-span-5">
            <div className="bg-fb-surface border border-fb-stroke rounded-xl p-6 shadow-sm">

              {/* Flecha volver */}
              <button
                onClick={() => navigate(-1)}
                className="text-fb-primary font-sans font-medium hover:underline float-right cursor-pointer flex items-center gap-[0.7px]"
              >
              <TbArrowLeft size={18} strokeWidth={2.5} />
                Volver
              </button>


              {/* Título y precio */}
              <h1 className="text-xl font-semibold text-fb-text mb-1">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-fb-text mb-4">
                ${product.price?.toFixed(2)}
              </p>

              {/* Botón reservar/comprar */}
              <button className="w-full py-3 rounded-lg bg-fb-primary text-white font-semibold hover:bg-fb-primary-dark transition cursor-pointer">
                Comprar
              </button>

              {/* Ubicación u otros datos */}
              <div className="mt-4 text-sm text-fb-text-secondary">
                Publicado en:{" "}
                <span className="font-semibold">
                  {product.location ?? "Ubicación"}
                </span>
              </div>

              {/* Descripción dentro del sidebar */}
              <div className="mt-6 pt-4 border-t border-fb-stroke">
                <h2 className="text-sm font-semibold text-fb-text mb-1">
                  Descripción
                </h2>
                <p className="text-sm text-fb-text-secondary leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
