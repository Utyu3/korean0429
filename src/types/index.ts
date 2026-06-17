export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  id: string;
  user_id: string;
  date: string;
  meal_type: MealType;
  photo_url: string | null;
  food_description: string | null;
  calories: number;
  protein_g: number;
  carbs_g: number;
  sugar_g: number;
  fat_g: number;
  fiber_g: number;
  notes: string | null;
  created_at: string;
}

export interface NutritionTotals {
  calories: number;
  protein_g: number;
  carbs_g: number;
  sugar_g: number;
  fat_g: number;
  fiber_g: number;
}

export interface DayStats {
  date: string;
  calories: number;
  sugar_g: number;
  meal_count: number;
}

export interface AnalysisResult {
  food_description: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  sugar_g: number;
  fat_g: number;
  fiber_g: number;
}
