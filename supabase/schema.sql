-- Diet Tracker Schema
-- Run this in your Supabase SQL Editor

create table if not exists public.meals (
  id          uuid        default gen_random_uuid() primary key,
  user_id     text        not null,
  date        date        not null,
  meal_type   text        not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  photo_url   text,                        -- base64 data URL or Supabase Storage URL
  food_description text,
  calories    integer     default 0,
  protein_g   decimal(8,2) default 0,
  carbs_g     decimal(8,2) default 0,
  sugar_g     decimal(8,2) default 0,
  fat_g       decimal(8,2) default 0,
  fiber_g     decimal(8,2) default 0,
  notes       text,
  created_at  timestamptz default now()
);

create index if not exists meals_user_date_idx on public.meals (user_id, date);
