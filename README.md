# Skies — Weather App

A mobile weather app built with React Native and Expo. Shows current conditions based on your GPS location, lets you save cities, and adapts its look to day/night and weather conditions.

Built solo over two weeks as a personal project.

---

## Features

- **Current location weather** — fetches conditions via GPS on launch
- **Saved locations** — add cities, swipe left to remove them
- **City search** — live suggestions as you type, powered by the Nominatim geocoding API
- **3-day forecast** — shows the next three days with high/low temps and condition
- **Dynamic theme** — background image and colour scheme change based on weather (rain, snow, clear, storm…) and time of day
- **Settings** — toggle between Celsius/Fahrenheit and 12h/24h time format, persisted per user
- **Auth** — email/password login and signup via Supabase

---

## Stack

| Layer | Choice |
|---|---|
| Framework | React Native + Expo (SDK 54) |
| Language | TypeScript |
| Navigation | React Navigation (native stack + bottom tabs) |
| Auth & database | Supabase |
| Weather data | OpenWeatherMap API |
| Geocoding | Nominatim (OpenStreetMap) |
| HTTP | Axios |
| UI blur | Expo BlurView |

---

## Project structure

```
src/
├── components/       CityInput, WeatherCard, LocationRow, HomeHeader, EmptyLocations
├── context/          AuthContext, ThemeContext, BackgroundContext, SettingsContext
├── lib/              Supabase client
├── navigation/       AppNavigator
├── screens/          HomeScreen, AddLocationScreen, SettingsScreen, LoginScreen
├── services/         weatherService, locationService, settingsService
├── styles/           color, spacing, common
├── types/            shared TypeScript types
└── utils/            weatherHelpers (theme, time, temperature conversion)
```

---

## Setup

**Prerequisites:** Node.js, Expo CLI, a Supabase project, an OpenWeatherMap API key.

```bash
git clone YOUR_REPO_URL
cd weather_app
npm install
cp .env.example .env
```

Fill in `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_WEATHER_API_KEY=your-openweathermap-key
```

Then run:

```bash
npx expo start
```

---

## Supabase setup

Two tables are required:

**`saved_locations`**
```sql
create table saved_locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  city_name text not null,
  country_code text not null,
  lat float,
  lon float,
  created_at timestamptz default now(),
  unique (user_id, city_name)
);
```

**`user_settings`**
```sql
create table user_settings (
  user_id uuid primary key references auth.users,
  temperature_unit text default 'celsius',
  time_format text default '12h',
  updated_at timestamptz default now()
);
```

Enable Row Level Security on both tables and add policies so users can only read and write their own rows.

---

## Running tests

```bash
npm test
```

Tests cover the five main components (`WeatherCard`, `CityInput`, `LocationRow`, `HomeHeader`, `EmptyLocations`) and the utility functions in `weatherHelpers` (theme detection, background images, night detection, time formatting, temperature conversion).

---

## Environment variables

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `EXPO_PUBLIC_WEATHER_API_KEY` | OpenWeatherMap API key (free tier works) |
