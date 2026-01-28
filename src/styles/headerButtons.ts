/* Estilos especiales para botones del header */
const btnBase =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none " +
    "rounded-full px-4 py-2 text-sm lg:text-base font-medium " +
    "transition-all duration-200 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fb-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-fb-surface " +
    "active:translate-y-0";

export const btnPrimary =
    btnBase +
    " bg-fb-primary text-fb-white " +
    "shadow-sm hover:shadow-md hover:-translate-y-[1px] " +
    "hover:bg-fb-primary-hover";

export const btnGhost =
    btnBase +
    " bg-transparent text-fb-primary cursor-pointer " +
    "border border-fb-stroke " +
    "hover:bg-fb-primary/10 hover:border-fb-primary/30";

export const btnDangerGhost =
    btnBase +
    " bg-transparent text-fb-black cursor-pointer " +
    "border border-fb-stroke " +
    "hover:bg-fb-neutral/60 hover:border-fb-neutral";

export const btnSuccess =
    btnBase +
    " bg-[#42B72A] text-fb-white cursor-pointer " +
    "shadow-sm hover:shadow-md hover:-translate-y-[1px] hover:bg-green-600";

export const mobileItem =
    "w-full rounded-xl px-4 py-3 font-medium cursor-pointer " +
    "transition-all duration-200 " +
    "flex items-center justify-between gap-2 " +
    "border border-fb-stroke/70 " +
    "hover:border-fb-primary/25 hover:bg-fb-primary/10";