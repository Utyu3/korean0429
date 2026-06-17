'use client';
import { useState, useEffect, useCallback } from 'react';
import { format, startOfWeek, addDays, subWeeks, addWeeks } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WeekCalendar from '@/components/WeekCalendar';
import MealCard from '@/components/MealCard';
import { Meal, DayStats } from '@/types';
import { getUserId } from '@/lib/userId';

export default function CalendarPage() {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(format(new Date(), 'yyyy-MM-dd'));
  const [weekStats, setWeekStats] = useState<DayStats[]>([]);
  const [dayMeals, setDayMeals] = useState<Meal[]>([]);
  const [loadingWeek, setLoadingWeek] = useState(true);

  const fetchWeekStats = useCallback(async () => {
    setLoadingWeek(true);
    const weekEnd = addDays(weekStart, 6);
    const res = await fetch(
      `/api/meals?start_date=${format(weekStart, 'yyyy-MM-dd')}&end_date=${format(weekEnd, 'yyyy-MM-dd')}`,
      { headers: { 'x-user-id': getUserId() } }
    );
    if (res.ok) {
      const meals: Meal[] = await res.json();
      const map = new Map<string, DayStats>();
      meals.forEach((m) => {
        const s = map.get(m.date) ?? { date: m.date, calories: 0, sugar_g: 0, meal_count: 0 };
        map.set(m.date, {
          date: m.date,
          calories: s.calories + (m.calories || 0),
          sugar_g: s.sugar_g + Number(m.sugar_g || 0),
          meal_count: s.meal_count + 1,
        });
      });
      setWeekStats(Array.from(map.values()));
    }
    setLoadingWeek(false);
  }, [weekStart]);

  const fetchDayMeals = useCallback(async (date: string) => {
    const res = await fetch(`/api/meals?date=${date}`, { headers: { 'x-user-id': getUserId() } });
    if (res.ok) setDayMeals(await res.json());
  }, []);

  useEffect(() => { fetchWeekStats(); }, [fetchWeekStats]);
  useEffect(() => { if (selectedDate) fetchDayMeals(selectedDate); }, [selectedDate, fetchDayMeals]);

  const weekEnd = addDays(weekStart, 6);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between pt-2">
        <button onClick={() => setWeekStart((w) => subWeeks(w, 1))} className="p-1">
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-base font-bold text-gray-800">
          {format(weekStart, 'M月d日', { locale: ja })}〜{format(weekEnd, 'M月d日', { locale: ja })}
        </h1>
        <button onClick={() => setWeekStart((w) => addWeeks(w, 1))} className="p-1">
          <ChevronRight size={24} className="text-gray-600" />
        </button>
      </div>

      {loadingWeek ? (
        <p className="text-center py-4 text-gray-400 text-sm">読み込み中...</p>
      ) : (
        <WeekCalendar
          weekStart={weekStart}
          stats={weekStats}
          selectedDate={selectedDate}
          onDayClick={setSelectedDate}
        />
      )}

      {selectedDate && (
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">
            {format(new Date(selectedDate + 'T00:00:00'), 'M月d日（E）の食事', { locale: ja })}
          </h2>
          {dayMeals.length === 0 ? (
            <p className="text-center py-6 text-gray-400 text-sm">この日の記録はありません</p>
          ) : (
            <div className="space-y-3">
              {dayMeals.map((m) => <MealCard key={m.id} meal={m} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
