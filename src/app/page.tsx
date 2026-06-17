'use client';
import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import NutritionSummary from '@/components/NutritionSummary';
import MealCard from '@/components/MealCard';
import { Meal, NutritionTotals } from '@/types';
import { getUserId } from '@/lib/userId';

const ZERO: NutritionTotals = { calories: 0, protein_g: 0, carbs_g: 0, sugar_g: 0, fat_g: 0, fiber_g: 0 };

export default function TodayPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const today = format(new Date(), 'yyyy-MM-dd');

  const fetchMeals = useCallback(async () => {
    const res = await fetch(`/api/meals?date=${today}`, { headers: { 'x-user-id': getUserId() } });
    if (res.ok) setMeals(await res.json());
    setLoading(false);
  }, [today]);

  useEffect(() => { fetchMeals(); }, [fetchMeals]);

  const totals = meals.reduce<NutritionTotals>(
    (acc, m) => ({
      calories: acc.calories + (m.calories || 0),
      protein_g: acc.protein_g + Number(m.protein_g || 0),
      carbs_g: acc.carbs_g + Number(m.carbs_g || 0),
      sugar_g: acc.sugar_g + Number(m.sugar_g || 0),
      fat_g: acc.fat_g + Number(m.fat_g || 0),
      fiber_g: acc.fiber_g + Number(m.fiber_g || 0),
    }),
    { ...ZERO }
  );

  const handleDelete = async (id: string) => {
    await fetch(`/api/meals/${id}`, { method: 'DELETE', headers: { 'x-user-id': getUserId() } });
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-xl font-bold text-gray-800">今日の記録</h1>
          <p className="text-sm text-gray-500">{format(new Date(), 'M月d日（E）', { locale: ja })}</p>
        </div>
        <Link
          href="/log"
          className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-md"
        >
          <Plus size={20} className="text-white" />
        </Link>
      </div>

      <NutritionSummary {...totals} />

      <div>
        <h2 className="text-sm font-semibold text-gray-600 mb-2">今日の食事</h2>
        {loading ? (
          <p className="text-center py-8 text-gray-400 text-sm">読み込み中...</p>
        ) : meals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4 text-sm">まだ記録がありません</p>
            <Link
              href="/log"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full text-sm"
            >
              <Plus size={14} />食事を記録する
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {meals.map((m) => <MealCard key={m.id} meal={m} onDelete={handleDelete} />)}
          </div>
        )}
      </div>
    </div>
  );
}
