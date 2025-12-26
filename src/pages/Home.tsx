import { useEffect, useState } from "react";
import { Card } from "../components/layout/Card";
import { CardSkeleton } from "../components/layout/CardSkeleton";
import { Sidebar } from "../components/layout/Sidebar";
import { productService } from '../services/productService';
import type { ProductRes } from "../types/product";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const PAGE_SIZE = 10;

type ApiPageResponse = {
  content: ProductRes[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

export default function Home({ adminMode = false }: { adminMode?: boolean }) {
  const [pageData, setPageData] = useState<ApiPageResponse | null>(null);
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // estado para el termino de busqueda
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null); // categoria seleccionada
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [reloadTick, setReloadTick] = useState(0); // refrescar al borrar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPageNumber(0); // Reset página al buscar
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPageNumber(0);
  }, [selectedCategoryId]);


  // Cargar productos cuando cambia el número de página
  useEffect(() => {
    setLoading(true);
    setError(null);

    productService.search({
      page: currentPageNumber,
      size: PAGE_SIZE,
      query: searchQuery || undefined,
      categoryId: selectedCategoryId || undefined
    })
      .then((response: any) => {
        setPageData(response);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [currentPageNumber, debouncedSearchQuery, selectedCategoryId, reloadTick]);

  const handlePreviousPage = () => {
    if (currentPageNumber > 0) {
      setCurrentPageNumber(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pageData && currentPageNumber < pageData.page.totalPages - 1) {
      setCurrentPageNumber(prev => prev + 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPageNumber(pageNumber);
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    if (!pageData) return [];

    const totalPages = pageData.page.totalPages;
    const current = currentPageNumber;

    // Siempre mostramos: 1, ..., (current-1,current,current+1), ..., last
    const pages: (number | "ellipsis")[] = [];

    const first = 0;
    const last = totalPages - 1;

    const add = (v: number | "ellipsis") => pages.push(v);

    add(first);

    const start = Math.max(first + 1, current - 1);
    const end = Math.min(last - 1, current + 1);

    if (start > first + 1) add("ellipsis");

    for (let i = start; i <= end; i++) add(i);

    if (end < last - 1) add("ellipsis");

    if (last !== first) add(last);

    return pages;
  };


  return (
    <main className="pt-1 bg-fb-background min-h-screen">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-6">

        <Sidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={setSelectedCategoryId}
        />


        <section className="col-span-9">
          <h1 className="font-sans text-xl font-semibold text-fb-text mb-4">
            Recomendaciones de hoy
          </h1>

          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {loading ? (
              Array.from({ length: PAGE_SIZE }).map((_, i) => <CardSkeleton key={i} />)
            ) : (
              pageData?.content.map((p) => (
                <Card
                  key={p.id}
                  id={p.id}
                  title={p.name}
                  image={p.images?.[0]}
                  description={p.description}
                  price={p.price}
                  adminMode={adminMode}
                  onDeleted={() => setReloadTick((t) => t + 1)}
                />
              ))
            )}
          </div>
        </section>
      </div>

      {pageData && pageData.page.totalPages > 0 && (
        <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-10">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3 hidden lg:block"></div>

            {/* Controles de paginación */}
            <div className="col-span-12 lg:col-span-9 flex items-center justify-end">
              <div
                className="
                  inline-flex items-center gap-1.5
                  rounded-full border border-fb-stroke
                  bg-fb-surface
                  px-2 py-1.5
                "
              >
                {/* Prev */}
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPageNumber === 0}
                  className="
                    h-9 w-9 grid place-items-center rounded-full
                    text-fb-text
                    hover:bg-blue-50 hover:text-fb-primary
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition
                  "
                >
                  <HiChevronLeft className="w-5 h-5" />
                </button>

                {/* Pages */}
                <div className="flex items-center gap-1 px-1">
                  {getPageNumbers().map((p: any, idx: number) =>
                    p === "ellipsis" ? (
                      <span
                        key={`e-${idx}`}
                        className="px-2 text-xs text-fb-text-secondary select-none"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => handlePageClick(p)}
                        className={`
                          h-8 min-w-8 px-2.5 rounded-full text-sm
                          transition
                          ${p === currentPageNumber
                            ? "bg-blue-50 text-fb-primary border border-blue-100"
                            : "text-fb-text-secondary hover:bg-fb-neutral"
                          }
                        `}
                        aria-current={p === currentPageNumber ? "page" : undefined}
                      >
                        {p + 1}
                      </button>
                    )
                  )}
                </div>

                {/* Next */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPageNumber >= pageData.page.totalPages - 1}
                  className="
                    h-9 w-9 grid place-items-center rounded-full
                    text-fb-text
                    hover:bg-blue-50 hover:text-fb-primary
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition
                  "
                >
                  <HiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}