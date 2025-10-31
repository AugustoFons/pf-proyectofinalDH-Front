import { Card } from "../components/layout/Card";
import { Sidebar } from "../components/layout/Sidebar";

export default function Home() {
  return (
    <main className="pt-20 bg-fb-background min-h-screen">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-6">
        <Sidebar />

        {/* Contenido principal */}
        <section className="col-span-9">
          <h1 className="font-sans text-xl font-semibold text-fb-text mb-4">
            Recomendaciones de hoy
          </h1>

          {/* Grilla de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tarjeta ejemplo */}
            <Card />
            <Card />
            <Card />
          </div>
        </section>
      </div>
    </main>
  )
}
