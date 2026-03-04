import { WeatherTheme, ThemeColors } from "../types";

// set-ups the dynamic theme depending on the weather condition
export function getThemeFromWeather(condition: string): WeatherTheme {

    // allows an unsensitive case comparison
    const c = condition.toLowerCase();

    if (c.includes("clear") || c.includes("sunny")) return "sunny";
    if (c.includes("cloud") || c.includes("overcast")) return "cloudy";
    if (c.includes("rain") || c.includes("drizzle") || c.includes("mist")) return "rainy";
    if (c.includes("snow") || c.includes("sleet") || c.includes("ice")) return "snowy";
    if (c.includes("thunder") || c.includes("storm")) return "stormy";
    return "default";
}

// color palettes for each condition
export const THEME_COLORS: Record<WeatherTheme, ThemeColors> = {
    sunny: {
        primary: "#FF8C00",
        secondary: "#FFD700",
        background: "#FFF8E7",
        cardBackground: "#FFF3CD",
        text: "#2C1810",
        subText: "#7B5E3A",
        accent: "#FF6B35",
    },
    cloudy: {
        primary: "#6B7C93",
        secondary: "#95A5B8",
        background: "#F0F3F7",
        cardBackground: "#E8ECF0",
        text: "#2C3E50",
        subText: "#5D6D7E",
        accent: "#4A90A4",
    },
    rainy: {
        primary: "#2980B9",
        secondary: "#5DADE2",
        background: "#EBF5FB",
        cardBackground: "#D6EAF8",
        text: "#1B2631",
        subText: "#2E86C1",
        accent: "#1A78C2",
    },
    snowy: {
        primary: "#5DBBFF",
        secondary: "#AED6F1",
        background: "#F4F9FF",
        cardBackground: "#EBF5FF",
        text: "#1A3347",
        subText: "#4B8EC8",
        accent: "#85C1E9",
    },
    stormy: {
        primary: "#4A235A",
        secondary: "#7D3C98",
        background: "#F4ECF7",
        cardBackground: "#E8DAEF",
        text: "#1B1B2F",
        subText: "#6C3483",
        accent: "#8E44AD",
    },
    default: {
        primary: "#3498DB",
        secondary: "#85C1E9",
        background: "#EBF5FB",
        cardBackground: "#FFFFFF",
        text: "#2C3E50",
        subText: "#7F8C8D",
        accent: "#2980B9",
    },
};

// for each condition get an emoji
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