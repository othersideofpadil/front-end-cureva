import { Calendar, CalendarOff, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "../../../../components/common";

const JadwalCalendar = ({
  monthYear,
  days,
  selectedDate,
  selectedDateFormatted,
  isSelectedHoliday,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  onToggleHoliday,
}) => (
  <Card className="self-start">
    <div className="flex items-center justify-between mb-5">
      <button
        onClick={onPrevMonth}
        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <ChevronLeft className="w-4 h-4 text-slate-500" />
      </button>
      <span className="text-sm font-semibold text-slate-700 capitalize">
        {monthYear}
      </span>
      <button
        onClick={onNextMonth}
        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <ChevronRight className="w-4 h-4 text-slate-500" />
      </button>
    </div>

    <div className="grid grid-cols-7 mb-1">
      {"Min Sen Sel Rab Kam Jum Sab".split(" ").map((d) => (
        <div
          key={d}
          className="text-center text-[11px] font-medium text-slate-400 py-1.5"
        >
          {d}
        </div>
      ))}
    </div>

    <div className="grid grid-cols-7 gap-0.5">
      {days.map((item, idx) => (
        <button
          key={idx}
          disabled={!item.day}
          onClick={() => item.date && onSelectDate(item.date)}
          className={[
            "aspect-square flex items-center justify-center rounded-xl text-xs font-medium transition-all select-none",
            !item.day ? "invisible" : "",
            item.isSelected
              ? "bg-sky-500 text-white shadow-sm shadow-sky-200"
              : item.isToday
                ? "ring-2 ring-sky-400 ring-offset-1 text-sky-600 font-semibold"
                : item.isPast
                  ? "text-slate-300 cursor-default"
                  : "text-slate-700 hover:bg-slate-100",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {item.day}
        </button>
      ))}
    </div>

    <div className="mt-5 pt-4 border-t border-slate-100">
      {selectedDate ? (
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                Tanggal Dipilih
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5 capitalize leading-snug">
                {selectedDateFormatted}
              </p>
            </div>
            <Calendar className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          </div>

          <button
            onClick={onToggleHoliday}
            className={[
              "w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all",
              isSelectedHoliday
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100",
            ].join(" ")}
          >
            <CalendarOff className="w-3.5 h-3.5" />
            {isSelectedHoliday ? "Batalkan Hari Libur" : "Tandai Hari Libur"}
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center py-1">
          Pilih tanggal di kalender
        </p>
      )}
    </div>
  </Card>
);

export default JadwalCalendar;
