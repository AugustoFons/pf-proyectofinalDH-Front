import { useMemo, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { DateRangeRes, ProductAvailabilityRes } from "../../types/product";
import { MONTHS_ES, DAYS_ES, parseDate, toDateStr, addMonths, generateCalendarCells } from "../../utils/dateUtils";

type Props = {
  availability: ProductAvailabilityRes;
  selectedFrom: string;
  selectedTo: string;
  onSelectRange: (from: string, to: string) => void;
};

function isInBookedRanges(date: Date, booked: DateRangeRes[]): boolean {
  const target = toDateStr(date);
  return booked.some((r) => target >= r.from && target < r.to);
}

function hasOverlap(from: string, to: string, booked: DateRangeRes[]): boolean {
  return booked.some((r) => r.from < to && r.to > from);
}

function CalendarPanel({
  year,
  month,
  minDate,
  maxDate,
  booked,
  selectedFrom,
  selectedTo,
  hoverDate,
  onDayClick,
  onDayHover,
}: {
  year: number;
  month: number;
  minDate: string;
  maxDate: string;
  booked: DateRangeRes[];
  selectedFrom: string;
  selectedTo: string;
  hoverDate: string;
  onDayClick: (day: string) => void;
  onDayHover: (day: string) => void;
}) {
  const cells = generateCalendarCells(year, month);

  const today = toDateStr(new Date());
  const effectiveTo = selectedTo || hoverDate;

  return (
    <div className="rounded-xl border border-fb-stroke p-3">
      <div className="mb-2 text-center text-sm font-semibold text-fb-text">
        {MONTHS_ES[month]} {year}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DAYS_ES.map((d) => (
          <div key={d} className="text-center text-[11px] text-fb-text-secondary">{d}</div>
        ))}
        {cells.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} className="h-8" />;
          }

          const dateStr = toDateStr(date);
          const outOfWindow = dateStr < minDate || dateStr >= maxDate;
          const inPast = dateStr < today;
          const occupied = isInBookedRanges(date, booked);
          const disabled = outOfWindow || inPast || occupied;

          const isFrom = selectedFrom && dateStr === selectedFrom;
          const isTo = selectedTo && dateStr === selectedTo;
          const rangeStart = selectedFrom;
          const rangeEnd = effectiveTo;
          const inRange =
            !!rangeStart &&
            !!rangeEnd &&
            dateStr > rangeStart &&
            dateStr < rangeEnd;

          let classes = "h-8 rounded-full text-xs grid place-items-center transition";
          if (disabled) {
            classes += " text-fb-text-secondary/50 bg-fb-neutral";
          } else if (isFrom || isTo) {
            classes += " bg-fb-primary text-white";
          } else if (inRange) {
            classes += " bg-blue-100 text-blue-700 rounded-none";
          } else {
            classes += " bg-emerald-100 text-emerald-700 hover:brightness-95 cursor-pointer";
          }

          if (occupied) {
            classes += " bg-red-100 text-red-700";
          }

          return (
            <button
              key={dateStr}
              type="button"
              className={classes}
              onClick={() => !disabled && onDayClick(dateStr)}
              onMouseEnter={() => !disabled && onDayHover(dateStr)}
              onMouseLeave={() => onDayHover("")}
              disabled={disabled}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AvailabilityCalendar({
  availability,
  selectedFrom,
  selectedTo,
  onSelectRange,
}: Props) {
  const minDate = availability.from;
  const maxDate = availability.to;
  const booked = availability.booked ?? [];

  const min = parseDate(minDate) || new Date();
  const max = parseDate(maxDate) || new Date();

  const [offset, setOffset] = useState(0);
  const [hoverDate, setHoverDate] = useState("");
  const [pickerError, setPickerError] = useState<string | null>(null);
  const left = useMemo(() => addMonths(min.getFullYear(), min.getMonth(), offset), [min, offset]);
  const right = useMemo(() => addMonths(left.year, left.month, 1), [left]);

  const canGoPrev = offset > 0;
  const maxOffset = Math.max(0, (max.getFullYear() - min.getFullYear()) * 12 + (max.getMonth() - min.getMonth()) - 1);
  const canGoNext = offset < maxOffset;

  const handleDayClick = (day: string) => {
    setPickerError(null);

    if (!selectedFrom || selectedTo) {
      onSelectRange(day, "");
      return;
    }

    if (day <= selectedFrom) {
      onSelectRange(day, "");
      return;
    }

    if (hasOverlap(selectedFrom, day, booked)) {
      setPickerError("El rango seleccionado incluye fechas ocupadas.");
      return;
    }

    onSelectRange(selectedFrom, day);
  };

  return (
    <section className="mt-4 rounded-xl border border-fb-stroke bg-fb-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-fb-text">Disponibilidad</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => canGoPrev && setOffset((v) => Math.max(0, v - 1))}
            disabled={!canGoPrev}
            className="grid h-7 w-7 place-items-center rounded-full border border-fb-stroke text-fb-primary disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Mes anterior"
          >
            <LuChevronLeft />
          </button>
          <button
            type="button"
            onClick={() => canGoNext && setOffset((v) => Math.min(maxOffset, v + 1))}
            disabled={!canGoNext}
            className="grid h-7 w-7 place-items-center rounded-full border border-fb-stroke text-fb-primary disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Mes siguiente"
          >
            <LuChevronRight />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <CalendarPanel
          year={left.year}
          month={left.month}
          minDate={minDate}
          maxDate={maxDate}
          booked={booked}
          selectedFrom={selectedFrom}
          selectedTo={selectedTo}
          hoverDate={hoverDate}
          onDayClick={handleDayClick}
          onDayHover={setHoverDate}
        />
        <CalendarPanel
          year={right.year}
          month={right.month}
          minDate={minDate}
          maxDate={maxDate}
          booked={booked}
          selectedFrom={selectedFrom}
          selectedTo={selectedTo}
          hoverDate={hoverDate}
          onDayClick={handleDayClick}
          onDayHover={setHoverDate}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-fb-text-secondary">
          {selectedFrom && selectedTo
            ? `Seleccionaste del ${selectedFrom} al ${selectedTo}`
            : selectedFrom
              ? `Fecha de inicio: ${selectedFrom}. Elegi la fecha de fin.`
              : "Elegi una fecha de inicio y una fecha de fin."}
        </p>
        <button
          type="button"
          onClick={() => {
            setPickerError(null);
            onSelectRange("", "");
          }}
          className="rounded-md border border-fb-stroke px-2 py-1 text-xs text-fb-text-secondary hover:bg-fb-neutral"
        >
          Limpiar
        </button>
      </div>

      {pickerError && (
        <p className="mt-2 text-xs text-red-700">{pickerError}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        <span className="inline-flex items-center gap-1.5 text-fb-text-secondary">
          <span className="h-3 w-3 rounded-full bg-emerald-200" /> Disponible
        </span>
        <span className="inline-flex items-center gap-1.5 text-fb-text-secondary">
          <span className="h-3 w-3 rounded-full bg-red-200" /> Ocupada
        </span>
        <span className="inline-flex items-center gap-1.5 text-fb-text-secondary">
          <span className="h-3 w-3 rounded-full bg-fb-neutral" /> Fuera de rango
        </span>
      </div>
    </section>
  );
}
