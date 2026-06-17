'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Check, Edit2 } from 'lucide-react';
import PhotoAnalyzer from '@/components/PhotoAnalyzer';
import { AnalysisResult, MealType } from '@/types';
import { getUserId } from '@/lib/userId';

const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: '朝食' },
  { value: 'lunch', label: '昼食' },
  { value: 'dinner', label: '夕食' },
  { value: 'snack', label: '間食' },
];

const NUM_FIELDS = [
  { key: 'calories' as const, label: 'カロリー', unit: 'kcal' },
  { key: 'protein_g' as const, label: 'タンパク質', unit: 'g' },
  { key: 'carbs_g' as const, label: '炭水化物', unit: 'g' },
  { key: 'sugar_g' as const, label: '糖質', unit: 'g' },
  { key: 'fat_g' as const, label: '脂質', unit: 'g' },
  { key: 'fiber_g' as const, label: '食物繊維', unit: 'g' },
] as const;

const DISPLAY_FIELDS = [
  { key: 'calories' as const, label: 'カロリー', unit: 'kcal', color: 'text-orange-500' },
  { key: 'protein_g' as const, label: 'タンパク質', unit: 'g', color: 'text-blue-500' },
  { key: 'carbs_g' as const, label: '炭水化物', unit: 'g', color: 'text-yellow-500' },
  { key: 'sugar_g' as const, label: '糖質', unit: 'g', color: 'text-pink-500' },
  { key: 'fat_g' as const, label: '脂質', unit: 'g', color: 'text-purple-500' },
  { key: 'fiber_g' as const, label: '食物繊維', unit: 'g', color: 'text-green-500' },
] as const;

const EMPTY: AnalysisResult = { food_description: '', calories: 0, protein_g: 0, carbs_g: 0, sugar_g: 0, fat_g: 0, fiber_g: 0 };

export default function LogPage() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [edit, setEdit] = useState<AnalysisResult>({ ...EMPTY });
  const [isEditing, setIsEditing] = useState(false);
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [saving, setSaving] = useState(false);

  const handleAnalyze = (result: AnalysisResult, dataUrl: string) => {
    setAnalysis(result);
    setEdit(result);
    setPhoto(dataUrl);
    setIsEditing(false);
  };

  const values = isEditing ? edit : (analysis ?? EMPTY);

  const handleSave = async () => {
    if (!analysis) return;
    setSaving(true);
    try {
      await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': getUserId() },
        body: JSON.stringify({
          date,
          meal_type: mealType,
          photo_url: photo,
          food_description: values.food_description,
          calories: values.calories,
          protein_g: values.protein_g,
          carbs_g: values.carbs_g,
          sugar_g: values.sugar_g,
          fat_g: values.fat_g,
          fiber_g: values.fiber_g,
        }),
      });
      router.push('/');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-gray-800 pt-2">食事を記録</h1>

      {/* Date & meal type */}
      <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        <div>
          <label className="text-xs text-gray-500 block mb-1">日付</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">食事の種類</label>
          <div className="grid grid-cols-4 gap-2">
            {MEAL_TYPES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setMealType(value)}
                className={`py-2 text-sm rounded-xl border transition-all ${
                  mealType === value ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Photo + AI */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <PhotoAnalyzer onAnalyze={handleAnalyze} />
      </div>

      {/* Results */}
      {analysis && (
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">解析結果</h2>
            <button
              onClick={() => setIsEditing((v) => !v)}
              className="flex items-center gap-1 text-xs text-blue-500"
            >
              <Edit2 size={12} />{isEditing ? '完了' : '修正'}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-500">食事の説明</label>
                <input
                  value={edit.food_description}
                  onChange={(e) => setEdit((p) => ({ ...p, food_description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1"
                />
              </div>
              {NUM_FIELDS.map(({ key, label, unit }) => (
                <div key={key} className="flex items-center gap-2">
                  <label className="text-xs text-gray-500 w-20 shrink-0">{label}</label>
                  <input
                    type="number"
                    value={edit[key]}
                    onChange={(e) => setEdit((p) => ({ ...p, [key]: Number(e.target.value) }))}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-1.5 text-sm"
                  />
                  <span className="text-xs text-gray-400 w-8">{unit}</span>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-700 mb-3">{analysis.food_description}</p>
              <div className="grid grid-cols-2 gap-2">
                {DISPLAY_FIELDS.map(({ key, label, unit, color }) => (
                  <div key={key} className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className={`text-lg font-bold ${color}`}>
                      {Number.isInteger(Number(values[key])) ? values[key] : Number(values[key]).toFixed(1)}
                      <span className="text-xs font-normal text-gray-400 ml-0.5">{unit}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-green-600 text-white rounded-2xl font-medium flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? '保存中...' : <><Check size={18} />記録を保存する</>}
          </button>
        </div>
      )}
    </div>
  );
}
