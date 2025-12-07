import { useEffect, useState } from "react";
import { Card } from "../components/layout/Card";
import { CardSkeleton } from "../components/layout/CardSkeleton";
import { Sidebar } from "../components/layout/Sidebar";
import { productService } from '../services/productService';
import type { ProductRes } from "../types/product";

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

export default function Home() {
  const [pageData, setPageData] = useState<ApiPageResponse | null>(null);
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // estado para el termino de busqueda
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPageNumber(0); // Reset página al buscar
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Cargar productos cuando cambia el número de página
  useEffect(() => {
    setLoading(true);
    setError(null);

    productService.search({
      page: currentPageNumber,
      size: PAGE_SIZE,
      query: searchQuery || undefined
    })
      .then((response: any) => {
        setPageData(response);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [currentPageNumber, debouncedSearchQuery]);

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
    const pages: number[] = [];

    // Mostrar máximo 5 páginas
    let start = Math.max(0, current - 2);
    let end = Math.min(totalPages - 1, start + 4);

    // Ajustar si estamos cerca del final
    if (end - start < 4) {
      start = Math.max(0, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <main className="pt-5 bg-fb-background min-h-screen">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-6">

        <Sidebar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <section className="col-span-9">
          <h1 className="font-sans text-xl font-semibold text-fb-text mb-4">
            Recomendaciones de hoy
          </h1>

          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                />
              ))
            )}
          </div>
        </section>
      </div>

      {pageData && pageData.page.totalPages > 1 && (
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-10">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3 hidden lg:block"></div>

            {/* Controles de paginación */}
            <div className="col-span-12 lg:col-span-9 flex items-center justify-center gap-2">

              <button
                onClick={handlePreviousPage}
                disabled={currentPageNumber === 0}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <div className="flex gap-1">
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageClick(pageNum)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${pageNum === currentPageNumber
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {pageNum + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPageNumber >= pageData.page.totalPages - 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>

              <span className="ml-4 text-sm text-gray-700">
                Página {currentPageNumber + 1} de {pageData.page.totalPages}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}