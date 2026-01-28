import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import { TbArrowLeft, TbChevronLeft, TbChevronRight } from "react-icons/tb";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAllThumbnails, setShowAllThumbnails] = useState(false);


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
  
  const handlePrevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const MAX_VISIBLE_THUMBNAILS = 5;
  const visibleImages = showAllThumbnails ? images : images.slice(0, MAX_VISIBLE_THUMBNAILS);
  const showMoreIndicator = !showAllThumbnails && images.length > MAX_VISIBLE_THUMBNAILS;

  return (
    <main className="pt-1 bg-fb-background min-h-screen pb-16">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-12 gap-8">

          {/* GALERÍA */}
          <section className="col-span-12 lg:col-span-7">
            {/* Imagen principal con flechas */}
            <div className="relative rounded-xl overflow-hidden bg-black/5 group">
              <img
                src={images[activeIndex]}
                alt={product.name}
                className="w-full h-[420px] md:h-[480px] object-cover"
              />

              {/* Indicador de posición */}
              {images.length > 1 && (
                <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                  {activeIndex + 1} / {images.length}
                </div>
              )}

              {/* Flechas de navegación */}
              {images.length > 1 && (
                <>
                  {/* Flecha izquierda */}
                  <button
                    onClick={handlePrevImage}
                    className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-fb-text p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    aria-label="Imagen anterior"
                  >
                    <TbChevronLeft size={24} strokeWidth={2.5} />
                  </button>

                  {/* Flecha derecha */}
                  <button
                    onClick={handleNextImage}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-fb-text p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    aria-label="Imagen siguiente"
                  >
                    <TbChevronRight size={24} strokeWidth={2.5} />
                  </button>
                </>
              )}
            </div>

            {/* miniaturas */}
            {images.length > 1 && (
              <div className="mt-3 relative py-1 w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pb-1 w-full">
                  {visibleImages.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`rounded-lg overflow-hidden cursor-pointer border-[2.5px] transition-all w-full h-24 md:h-28 ${
                        index === activeIndex
                          ? "border-fb-primary scale-105"
                          : "border-fb-stroke hover:border-fb-primary/70"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}

                  {/* Ver más */}
                  {showMoreIndicator && (
                    <button
                      type="button"
                      onClick={() => setShowAllThumbnails(true)}
                      className="rounded-lg overflow-hidden border-[2.5px] border-fb-stroke hover:border-fb-primary/70 cursor-pointer w-full h-24 md:h-28 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all"
                    >
                      <div className="text-white text-center">
                        <div className="text-lg font-bold">+{images.length - MAX_VISIBLE_THUMBNAILS}</div>
                      </div>
                    </button>
                  )}
                </div>
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
                {
                  product.productType === "RESERVA" ? "Reservar ahora" : "Comprar ahora"
                }
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