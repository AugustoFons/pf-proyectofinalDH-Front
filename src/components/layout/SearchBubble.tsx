import { useEffect, useMemo, useRef, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { LuSearch, LuCalendar, LuChevronLeft, LuChevronRight } from "react-icons/lu";

type SearchMode = "PRODUCTOS" | "RESERVAS";

type SearchBubbleProps = {
  query: string;
  onQueryChange: (value: string) => void;
  mode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onSubmit: () => void;
  suggestions: string[];
  showSuggestions: boolean;
  isSuggesting: boolean;
  onSuggestionSelect: (value: string) => void;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DAYS_ES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

function toDateStr(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parseDate(str: string): Date | null {
  if (!str) return null;
  const d = new Date(str + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function formatDisplay(str: string): string {
  const d = parseDate(str);
  if (!d) return "";
  return `${d.getDate()} ${MONTHS_ES[d.getMonth()].slice(0, 3)}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  // Monday-based: 0=Mon … 6=Sun
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

// ── Calendar ───────────────────────────────────────────────────────────

type CalendarPanelProps = {
  year: number;
  month: number;
  selectedFrom: Date | null;
  selectedTo: Date | null;
  hovered: Date | null;
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date | null) => void;
  onPrev?: () => void;
  onNext?: () => void;
};

const CalendarPanel = ({
  year,
  month,
  selectedFrom,
  selectedTo,
  hovered,
  onDayClick,
  onDayHover,
  onPrev,
  onNext,
}: CalendarPanelProps) => {
  const days = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const rangeEnd = selectedFrom && !selectedTo ? hovered : selectedTo;

  const isSelected = (d: Date) => {
    if (selectedFrom && toDateStr(d) === toDateStr(selectedFrom)) return "from";
    if (selectedTo && toDateStr(d) === toDateStr(selectedTo)) return "to";
    return null;
  };

  const isInRange = (d: Date) => {
    if (!selectedFrom || !rangeEnd) return false;
    const from = selectedFrom < rangeEnd ? selectedFrom : rangeEnd;
    const to = selectedFrom < rangeEnd ? rangeEnd : selectedFrom;
    return d > from && d < to;
  };

  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: days }, (_, i) => new Date(year, month, i + 1)),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="fb-cal-panel">
      <div className="fb-cal-header">
        {onPrev ? (
          <button type="button" className="fb-cal-nav" onClick={onPrev} aria-label="Mes anterior">
            <LuChevronLeft />
          </button>
        ) : <span className="fb-cal-nav-placeholder" />}
        <span className="fb-cal-title">
          {MONTHS_ES[month]} {year}
        </span>
        {onNext ? (
          <button type="button" className="fb-cal-nav" onClick={onNext} aria-label="Mes siguiente">
            <LuChevronRight />
          </button>
        ) : <span className="fb-cal-nav-placeholder" />}
      </div>

      <div className="fb-cal-grid">
        {DAYS_ES.map((d) => (
          <div key={d} className="fb-cal-day-label">{d}</div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={`e-${i}`} />;
          const sel = isSelected(date);
          const inRange = isInRange(date);
          return (
            <button
              key={toDateStr(date)}
              type="button"
              className={[
                "fb-cal-day",
                sel === "from" ? "fb-cal-day--from" : "",
                sel === "to" ? "fb-cal-day--to" : "",
                inRange ? "fb-cal-day--range" : "",
              ].join(" ")}
              onClick={() => onDayClick(date)}
              onMouseEnter={() => onDayHover(date)}
              onMouseLeave={() => onDayHover(null)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Range ───────────────────────────────────────────────────────────

type DateRangePickerProps = {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
  onClose: () => void;
};

const DateRangePicker = ({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onClose,
}: DateRangePickerProps) => {
  const today = new Date();
  const [leftYear, setLeftYear] = useState(today.getFullYear());
  const [leftMonth, setLeftMonth] = useState(today.getMonth());
  const [hovered, setHovered] = useState<Date | null>(null);
  const [compactCalendar, setCompactCalendar] = useState(false);
  const [selecting, setSelecting] = useState<"from" | "to" | null>(
    dateFrom ? (dateTo ? null : "to") : "from"
  );

  const selectedFrom = parseDate(dateFrom);
  const selectedTo = parseDate(dateTo);

  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;
  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const sync = () => setCompactCalendar(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const handleDayClick = (date: Date) => {
    if (selecting === "from" || !selectedFrom) {
      onDateFromChange(toDateStr(date));
      onDateToChange("");
      setSelecting("to");
    } else {
      if (date < selectedFrom) {
        onDateFromChange(toDateStr(date));
        onDateToChange(toDateStr(selectedFrom));
      } else {
        onDateToChange(toDateStr(date));
      }
      setSelecting(null);
    }
  };

  const handleClear = () => {
    onDateFromChange("");
    onDateToChange("");
    setSelecting("from");
  };

  return (
    <div className="fb-drp">
      <div className="fb-drp-hint">
        {selecting === "from" && "Seleccioná la fecha de inicio"}
        {selecting === "to" && "Seleccioná la fecha de fin"}
        {!selecting && selectedFrom && selectedTo && (
          <span className="fb-drp-range-label">
            {formatDisplay(dateFrom)} → {formatDisplay(dateTo)}
          </span>
        )}
      </div>

      <div className="fb-drp-calendars">
        <CalendarPanel
          year={leftYear}
          month={leftMonth}
          selectedFrom={selectedFrom}
          selectedTo={selectedTo}
          hovered={hovered}
          onDayClick={handleDayClick}
          onDayHover={setHovered}
          onPrev={() => {
            if (leftMonth === 0) { setLeftYear(y => y - 1); setLeftMonth(11); }
            else setLeftMonth(m => m - 1);
          }}
          onNext={compactCalendar ? () => {
            if (leftMonth === 11) { setLeftYear(y => y + 1); setLeftMonth(0); }
            else setLeftMonth(m => m + 1);
          } : undefined}
        />

        {!compactCalendar && (
          <CalendarPanel
            year={rightYear}
            month={rightMonth}
            selectedFrom={selectedFrom}
            selectedTo={selectedTo}
            hovered={hovered}
            onDayClick={handleDayClick}
            onDayHover={setHovered}
            onNext={() => {
              if (leftMonth === 11) { setLeftYear(y => y + 1); setLeftMonth(0); }
              else setLeftMonth(m => m + 1);
            }}
          />
        )}
      </div>

      <div className="fb-drp-footer">
        <button type="button" className="fb-drp-clear" onClick={handleClear}>
          Limpiar
        </button>
        <button
          type="button"
          className="fb-drp-apply"
          onClick={onClose}
          disabled={!selectedFrom || !selectedTo}
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};

// ── SearchBubble ──────────────────────────────────────────────────────────────

export const SearchBubble = ({
  query,
  onQueryChange,
  mode,
  onModeChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onSubmit,
  suggestions,
  showSuggestions,
  isSuggesting,
  onSuggestionSelect,
}: SearchBubbleProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasSuggestions = useMemo(
    () => showSuggestions && (isSuggesting || suggestions.length > 0),
    [showSuggestions, isSuggesting, suggestions.length]
  );

  const hasDateRange = dateFrom && dateTo;

  const datesLabel = hasDateRange
    ? `${formatDisplay(dateFrom)} – ${formatDisplay(dateTo)}`
    : "Fechas";

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  useEffect(() => {
    if (mode !== "RESERVAS") setShowDatePicker(false);
  }, [mode]);

  useEffect(() => {
    const onDocumentClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setExpanded(false);
        setShowDatePicker(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setExpanded(false); setShowDatePicker(false); }
    };
    document.addEventListener("mousedown", onDocumentClick);
    window.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      window.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <>
      {/* ── Estilos del calendar ── */}
      <style>{`
        .fb-cal-panel { flex: 1; min-width: 220px; }
        .fb-cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .fb-cal-title { font-size: 13px; font-weight: 600; color: var(--fb-text, #1e293b); }
        .fb-cal-nav {
          width: 28px; height: 28px; border-radius: 50%; border: 1px solid #e2e8f0;
          background: transparent; cursor: pointer; display: grid; place-items: center;
          color: #3b82f6; transition: background 0.15s;
        }
        .fb-cal-nav:hover { background: #eff6ff; }
        .fb-cal-nav-placeholder { width: 28px; }
        .fb-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
        .fb-cal-day-label { text-align: center; font-size: 11px; font-weight: 500; color: #94a3b8; padding: 4px 0; }
        .fb-cal-day {
          aspect-ratio: 1; border: none; background: transparent; border-radius: 50%;
          font-size: 12px; cursor: pointer; transition: background 0.1s, color 0.1s;
          color: var(--fb-text, #1e293b); display: grid; place-items: center;
        }
        .fb-cal-day:hover { background: #eff6ff; color: #3b82f6; }
        .fb-cal-day--from, .fb-cal-day--to {
          background: #3b82f6 !important; color: white !important; border-radius: 50%;
        }
        .fb-cal-day--range { background: #dbeafe; border-radius: 0; color: #1d4ed8; }

        .fb-drp {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: white; border: 1px solid #bfdbfe; border-radius: 16px;
          padding: 16px; z-index: 50; box-shadow: 0 8px 32px rgba(59,130,246,0.12);
          min-width: 520px;
        }
        .fb-drp-hint {
          font-size: 12px; color: #64748b; margin-bottom: 12px;
          min-height: 18px; text-align: center;
        }
        .fb-drp-range-label { font-weight: 600; color: #3b82f6; }
        .fb-drp-calendars { display: flex; gap: 24px; }
        .fb-drp-footer {
          display: flex; justify-content: flex-end; gap: 8px;
          margin-top: 14px; padding-top: 12px; border-top: 1px solid #e2e8f0;
        }
        .fb-drp-clear {
          padding: 6px 14px; border-radius: 8px; border: 1px solid #e2e8f0;
          background: transparent; font-size: 13px; cursor: pointer; color: #64748b;
          transition: background 0.15s;
        }
        .fb-drp-clear:hover { background: #f8fafc; }
        .fb-drp-apply {
          padding: 6px 16px; border-radius: 8px; border: none;
          background: #3b82f6; color: white; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: background 0.15s;
        }
        .fb-drp-apply:hover:not(:disabled) { background: #2563eb; }
        .fb-drp-apply:disabled { opacity: 0.4; cursor: not-allowed; }

        @media (max-width: 1023px) {
          .fb-drp {
            left: 0;
            right: 0;
            transform: none;
            width: 100%;
            min-width: 0;
            max-width: none;
            max-height: calc(100vh - 6.5rem);
            overflow-y: auto;
            padding: 12px;
          }

          .fb-drp-calendars {
            flex-direction: column;
            gap: 12px;
          }

          .fb-cal-panel {
            min-width: 0;
          }

          .fb-drp-footer {
            position: sticky;
            bottom: 0;
            background: white;
            margin-top: 10px;
            padding-top: 10px;
          }
        }

        @media (max-width: 767px) {
          .fb-drp {
            padding: 10px;
          }

          .fb-drp-hint {
            margin-bottom: 8px;
          }

          .fb-drp-calendars {
            gap: 8px;
          }

          .fb-cal-header {
            margin-bottom: 6px;
          }

          .fb-cal-title {
            font-size: 12px;
          }

          .fb-cal-nav,
          .fb-cal-nav-placeholder {
            width: 24px;
            height: 24px;
          }

          .fb-cal-grid {
            gap: 1px;
          }

          .fb-cal-day-label {
            font-size: 10px;
            padding: 2px 0;
          }

          .fb-cal-day {
            font-size: 11px;
            min-height: 28px;
          }

          .fb-drp-footer {
            margin-top: 8px;
            padding-top: 8px;
          }

          .fb-drp-clear,
          .fb-drp-apply {
            font-size: 12px;
            padding: 6px 12px;
          }
        }
      `}</style>

      <div ref={containerRef} className="relative z-30">
        {/* ── Colapsado ── */}
        {!expanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="h-9 w-9 rounded-full bg-fb-surface text-fb-primary/80 shadow-sm inline-flex items-center justify-center gap-2 hover:bg-blue-50 transition cursor-pointer lg:h-11 lg:w-auto lg:px-5 lg:border lg:border-fb-primary/40"
            aria-label="Abrir buscador"
          >
            <LuSearch className="w-5 h-5" strokeWidth={2.8} />
            <span className="hidden lg:inline text-sm font-semibold">Buscador</span>
          </button>
        )}

        {/* ── Expandido ── */}
        {expanded && (
          <div className="fixed top-16 sm:top-20 left-3 right-3 z-[70] bg-fb-surface border border-fb-primary/40 rounded-2xl shadow-sm px-2 py-2 flex flex-wrap lg:flex-nowrap items-center gap-2 min-w-0 lg:relative lg:top-auto lg:left-auto lg:right-auto lg:z-auto lg:rounded-full lg:py-1.5 lg:min-w-[38rem]">

            {/* Cerrar */}
            <button
              type="button"
              onClick={() => { setExpanded(false); setShowDatePicker(false); }}
              className="h-9 w-9 rounded-full grid place-items-center text-fb-primary hover:bg-blue-50 transition flex-shrink-0"
              aria-label="Cerrar buscador"
            >
              <HiXMark className="w-5 h-5" />
            </button>

            {/* Separador */}
            <div className="hidden lg:block w-px h-5 bg-fb-stroke flex-shrink-0" />

            {/* Input + sugerencias */}
            <div className="relative order-1 flex-1 min-w-[10rem]">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                placeholder={mode === "RESERVAS" ? "Buscar reservas..." : "Buscar productos..."}
                className="w-full px-3 py-2 rounded-full border-none focus:outline-none bg-fb-surface text-fb-text text-sm"
              />

              {hasSuggestions && (
                <div className="absolute top-[110%] left-0 w-full rounded-xl border border-fb-primary/20 bg-fb-surface shadow-lg overflow-hidden z-40">
                  {isSuggesting && (
                    <p className="px-3 py-2 text-xs text-fb-text-secondary">
                      Buscando sugerencias...
                    </p>
                  )}
                  {!isSuggesting && suggestions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => onSuggestionSelect(item)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-fb-neutral transition flex items-center gap-2"
                    >
                      <LuSearch className="w-3.5 h-3.5 text-fb-text-secondary flex-shrink-0" />
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Toggle modo */}
            <div className="inline-flex rounded-full bg-blue-50 p-[3px] flex-shrink-0 order-3 lg:order-none">
              {(["PRODUCTOS", "RESERVAS"] as SearchMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onModeChange(m)}
                  className={[
                    "px-3 py-1.5 rounded-full text-xs font-semibold transition",
                    mode === m
                      ? "bg-white text-fb-primary shadow-sm"
                      : "text-fb-primary/60 hover:text-fb-primary",
                  ].join(" ")}
                >
                  {m === "PRODUCTOS" ? "Productos" : "Reservas"}
                </button>
              ))}
            </div>

            {/* Chip fechas  */}
            {mode === "RESERVAS" && (
              <button
                type="button"
                onClick={() => setShowDatePicker((v) => !v)}
                className={[
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition flex-shrink-0 order-4 lg:order-none",
                  hasDateRange
                    ? "border-fb-primary bg-blue-50 text-fb-primary"
                    : "border-fb-primary/30 text-fb-primary hover:bg-blue-50",
                ].join(" ")}
                aria-label="Seleccionar rango de fechas"
              >
                <LuCalendar className="w-3.5 h-3.5" />
                {datesLabel}
              </button>
            )}

            {/* Botón buscar */}
            <button
              type="button"
              onClick={onSubmit}
              className="w-9 h-9 rounded-full bg-fb-primary text-white grid place-items-center hover:opacity-90 active:scale-95 transition flex-shrink-0 order-2"
              aria-label="Realizar búsqueda"
            >
              <LuSearch className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* ── Date Range Picker doble ── */}
            {mode === "RESERVAS" && showDatePicker && (
              <DateRangePicker
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateFromChange={onDateFromChange}
                onDateToChange={onDateToChange}
                onClose={() => setShowDatePicker(false)}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};