import { Meal } from '@/types';

const mealLabels: Record<string, string> = {
  breakfast: '朝食',
  lunch: '昼食',
  dinner: '夕食',
  snack: '間食',
};

interface Props {
  meal: Meal;
  onDelete?: (id: string) => void;
}

export default function MealCard({ meal, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {meal.photo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={meal.photo_url} alt="食事" className="w-full h-44 object-cover" />
      )}
      <div className="p-3">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <span className="text-xs font-medium px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
              {mealLabels[meal.meal_type]}
            </span>
            <p className="mt-1 text-sm font-medium text-gray-800 line-clamp-2">
              {meal.food_description || '記録なし'}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-bold text-orange-500">{meal.calories}</p>
            <p className="text-xs text-gray-400">kcal</p>
          </div>
        </div>
        <div className="mt-2 flex gap-3 text-xs text-gray-400">
          <span>P {Number(meal.protein_g).toFixed(1)}g</span>
          <span>C {Number(meal.carbs_g).toFixed(1)}g</span>
          <span>糖 {Number(meal.sugar_g).toFixed(1)}g</span>
          <span>F {Number(meal.fat_g).toFixed(1)}g</span>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(meal.id)}
            className="mt-2 text-xs text-red-400 hover:text-red-600 transition-colors"
          >
            削除
          </button>
        )}
      </div>
    </div>
  );
}
