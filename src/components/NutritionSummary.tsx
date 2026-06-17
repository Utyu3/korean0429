import { NutritionTotals } from '@/types';

const TARGET_CALORIES = 2000;

const nutrients = [
  { key: 'protein_g' as const, label: 'タンパク質', color: 'bg-blue-400', max: 60 },
  { key: 'carbs_g' as const, label: '炭水化物', color: 'bg-yellow-400', max: 300 },
  { key: 'sugar_g' as const, label: '糖質', color: 'bg-pink-400', max: 100 },
  { key: 'fat_g' as const, label: '脂質', color: 'bg-purple-400', max: 65 },
  { key: 'fiber_g' as const, label: '食物繊維', color: 'bg-green-400', max: 25 },
];

export default function NutritionSummary({ calories, protein_g, carbs_g, sugar_g, fat_g, fiber_g }: NutritionTotals) {
  const values = { protein_g, carbs_g, sugar_g, fat_g, fiber_g };
  const calPct = Math.min((calories / TARGET_CALORIES) * 100, 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
      {/* Calories */}
      <div>
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sm text-gray-500">カロリー</span>
          <div>
            <span className="text-2xl font-bold text-orange-500">{calories}</span>
            <span className="text-xs text-gray-400"> / {TARGET_CALORIES} kcal</span>
          </div>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width: `${calPct}%` }} />
        </div>
      </div>

      {/* Macros */}
      {nutrients.map(({ key, label, color, max }) => (
        <div key={key}>
          <div className="flex justify-between text-xs mb-0.5">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium">{Number(values[key]).toFixed(1)}g</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${color} rounded-full transition-all`}
              style={{ width: `${Math.min((Number(values[key]) / max) * 100, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
