import { format, addDays, isToday, isFuture, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { DayStats } from '@/types';

interface Props {
  weekStart: Date;
  stats: DayStats[];
  selectedDate: string | null;
  onDayClick: (date: string) => void;
}

export default function WeekCalendar({ weekStart, stats, selectedDate, onDayClick }: Props) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const statsMap = new Map(stats.map((s) => [s.date, s]));

  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const s = statsMap.get(dateStr);
        const selected = selectedDate === dateStr;
        const today = isToday(day);
        const future = isFuture(parseISO(dateStr + 'T23:59:59'));

        return (
          <button
            key={dateStr}
            onClick={() => !future && onDayClick(dateStr)}
            disabled={future}
            className={`rounded-xl p-1.5 text-center transition-all shadow-sm ${
              selected
                ? 'bg-green-600 text-white'
                : today
                ? 'bg-green-100 text-green-800'
                : future
                ? 'bg-white opacity-30 cursor-default'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <p className="text-xs font-medium">{format(day, 'E', { locale: ja })}</p>
            <p className={`text-sm font-bold ${today && !selected ? 'text-green-600' : ''}`}>
              {format(day, 'd')}
            </p>
            <div className="mt-1 min-h-[2rem]">
              {s && (
                <>
                  <p className={`text-xs font-semibold leading-tight ${selected ? 'text-white' : 'text-orange-500'}`}>
                    {s.calories}
                  </p>
                  <p className={`text-xs leading-tight ${selected ? 'text-green-100' : 'text-pink-400'}`}>
                    糖{s.sugar_g.toFixed(0)}g
                  </p>
                </>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
