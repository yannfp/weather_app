import { TemperatureUnit } from "../services/settingsService";

export const getThemeFromWeather = (condition: string): string => {
  const c = condition.toLowerCase();
  if (c.includes("thunder") || c.includes("storm")) return "stormy";
  if (c.includes("drizzle") || c.includes("rain")) return "rainy";
  if (c.includes("snow") || c.includes("sleet") || c.includes("blizzard")) return "snowy";
  if (c.includes("fog") || c.includes("mist") || c.includes("haze")) return "foggy";
  if (c.includes("cloud")) return "cloudy";
  if (c.includes("clear") || c.includes("sun")) return "sunny";
  return "default";
};

export const getBackgroundImage = (condition: string): string => {
  const theme = getThemeFromWeather(condition);

  const images: Record<string, string> = {
    sunny:   "https://images.unsplash.com/photo-1711779906467-7b1e2e553884?q=80&w=735",
    cloudy:  "https://images.unsplash.com/photo-1614959909713-128c622fad23?w=500",
    rainy:   "https://images.unsplash.com/photo-1709860750539-cc2495c89736?w=500",
    snowy:   "https://images.unsplash.com/photo-1608581796221-415be903abdb?w=500",
    foggy:   "https://images.unsplash.com/photo-1585651686997-5516bd534e9d?w=500",
    stormy:  "https://images.unsplash.com/photo-1429552077091-836152271555?w=500",
    default: "https://images.unsplash.com/photo-1558418294-9da149757efe?w=500",
  };

  return images[theme] ?? images.default;
}

export const isNightTime = (sunrise: number, sunset: number): boolean => {
  const nowUTC = Math.floor(Date.now() / 1000);
  return nowUTC < sunrise || nowUTC > sunset;
}

export const getLocalTime = (timezone: number, timeFormat: "12h" | "24h"): string => {

  const utcMs = Date.now();
  const localMs = utcMs + timezone * 1000;
  const localDate = new Date(localMs);

  const hours = localDate.getUTCHours();
  const minutes = localDate.getUTCMinutes().toString().padStart(2, "0");

  if (timeFormat == "24h") {
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }

  const ampm = hours >= 12 ? "PM" : "AM";

  const displayHours = hours % 12 || 12;

  return `${displayHours}:${minutes} ${ampm}`;
}

export const getCountryName = (code: string): string => {
  try {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

export const convertTemperature = (celsius: number, unit: TemperatureUnit) => {
  if (unit === "fahrenheit") {
    return Math.round((celsius * 9) / 5 + 32);
  }

  return Math.round(celsius);
}
