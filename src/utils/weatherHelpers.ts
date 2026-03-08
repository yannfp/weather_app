import { WeatherTheme, ThemeColors } from "../types";

export function getThemeFromWeather(condition: string): WeatherTheme {
  const c = condition.toLowerCase();
  if (c.includes("clear") || c.includes("sun")) return "sunny";
  if (c.includes("cloud") || c.includes("overcast")) return "cloudy";
  if (c.includes("rain") || c.includes("drizzle") || c.includes("mist")) return "rainy";
  if (c.includes("snow") || c.includes("sleet") || c.includes("ice")) return "snowy";
  if (c.includes("thunder") || c.includes("storm")) return "stormy";
  return "default";
}

// ─────────────────────────────────────────────
// Premium minimal color palettes per weather
// ─────────────────────────────────────────────
export const THEME_COLORS: Record<WeatherTheme, ThemeColors> = {
  sunny: {
    primary: "#E87C2E",
    secondary: "#F4A55A",
    background: "#FDFAF5",
    cardBackground: "#FFFFFF",
    text: "#1A1208",
    subText: "#9C7B4E",
    accent: "#F4C27F",
  },
  cloudy: {
    primary: "#4A5568",
    secondary: "#718096",
    background: "#F7F8FA",
    cardBackground: "#FFFFFF",
    text: "#1A202C",
    subText: "#718096",
    accent: "#CBD5E0",
  },
  rainy: {
    primary: "#2B6CB0",
    secondary: "#4299E1",
    background: "#F0F5FF",
    cardBackground: "#FFFFFF",
    text: "#1A2942",
    subText: "#4A7BAF",
    accent: "#BEE3F8",
  },
  snowy: {
    primary: "#3182CE",
    secondary: "#63B3ED",
    background: "#F7FBFF",
    cardBackground: "#FFFFFF",
    text: "#1A2F47",
    subText: "#5B9FC7",
    accent: "#E8F4FD",
  },
  stormy: {
    primary: "#553C9A",
    secondary: "#805AD5",
    background: "#F5F0FF",
    cardBackground: "#FFFFFF",
    text: "#1A0F2E",
    subText: "#7B5EA7",
    accent: "#E9D8FD",
  },
  default: {
    primary: "#2D3748",
    secondary: "#4A5568",
    background: "#F7F8FA",
    cardBackground: "#FFFFFF",
    text: "#1A202C",
    subText: "#718096",
    accent: "#EDF2F7",
  },
};

export function getWeatherEmoji(condition: string): string {
  const c = condition.toLowerCase();
  if (c.includes("clear")) return "☀️";
  if (c.includes("cloud")) return "☁️";
  if (c.includes("rain")) return "🌧️";
  if (c.includes("drizzle")) return "🌦️";
  if (c.includes("thunder")) return "⛈️";
  if (c.includes("snow")) return "❄️";
  if (c.includes("mist") || c.includes("fog")) return "🌫️";
  return "🌤️";
}

// Returns a subtle gradient pair for background based on theme
export function getThemeGradient(theme: WeatherTheme): [string, string] {
  const gradients: Record<WeatherTheme, [string, string]> = {
    sunny:   ["#FFF8ED", "#FDE9C5"],
    cloudy:  ["#F7F8FA", "#E8ECF2"],
    rainy:   ["#EEF4FF", "#D6E8FA"],
    snowy:   ["#F0F8FF", "#DCF0FD"],
    stormy:  ["#F2EEFF", "#E0D0FF"],
    default: ["#F7F8FA", "#EDF2F7"],
  };
  return gradients[theme];
}

export const convertTemperature = (celsius: number, unit: "celsius" | "fahrenheit") => {

  if (unit === "fahrenheit") {
    return Math.round((celsius * 9) / 5 + 32);
  }

  return Math.round(celsius);
}
