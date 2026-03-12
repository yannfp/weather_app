import axios from "axios";
import { WeatherAPIResponse, WeatherData } from "../types";

const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

const BASE_URL = "https://api.openweathermap.org/data/2.5";

// transforms the raw data received from the OpenWeatherMap API into our cleanup data type
function transformWeatherData(raw: WeatherAPIResponse): WeatherData {

    // create a new object of type WeatherData
    return {
        cityName: raw.name,
        country: raw.sys.country,

        temperature: Math.round(raw.main.temp),
        tempMin: Math.round(raw.main.temp_min),
        tempMax: Math.round(raw.main.temp_max),
        feelsLike: Math.round(raw.main.feels_like),

        humidity: raw.main.humidity,
        pressure: raw.main.pressure,

        // [0] cause even if the weather can be represented as an array only one data interests us
        condition: raw.weather[0].main,
        description: raw.weather[0].description,

        windSpeed: raw.wind.speed,

        icon: raw.weather[0].icon,

        latitude: raw.coord.lat,
        longitude: raw.coord.lon,

        timezone: raw.timezone,
        sunrise: raw.sys.sunrise,
        sunset: raw.sys.sunset,
    };
}

// get the weather of a city by its name
export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
    try {
       // make an HTTP GET request to fetch the data
       // await pauses the program until the API answers
        const response = await axios.get<WeatherAPIResponse>(`${BASE_URL}/weather/`,
            {
                // these are added to out URL as query parameters
                params: {
                    // query for the city name
                    q: city,
                    appid: API_KEY,
                    units: "metric",
                },
            });

        // transform the raw data into usable data
        return transformWeatherData(response.data);

    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error(`City "${city}" not found. Check the spelling.`);
        }
        if (error.response?.status === 401) {
            throw new Error("Invalid API key. Check your OpenWeatherMap key.");
        }
        throw new Error("Failed to fetch weather. Check your internet connection.");
    }
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    try {
        const response = await axios.get<WeatherAPIResponse>(`${BASE_URL}/weather/`,
            {
                params: {
                    lat,
                    lon,
                    appid: API_KEY,
                    units: "metric",
                },
            });

        return transformWeatherData(response.data);

    } catch (error: any) {
        throw new Error("Failed to fetch weather for your location.");
    }
}

export type CitySuggestion = {
    name: string;
    country: string;
    state?: string;

    lat:number;
    lon:number;
};

export async function searchCities(query: string): Promise<CitySuggestion[]> {

    if (query.trim().length < 1) {
        return [];
    }

    try {
        const response = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: {
                q: query,
                format: "json",
                limit: 5,
                featuretype: "city",
                "accept-language": "en",
                addressdetails: 1,  // ← add this
            },
            headers: {
                "User-Agent": "WeatherApp/1.0",
            },
        });

        return response.data.map((item: any) => ({
            name: item.name,
            country: item.address?.country_code?.toUpperCase() ?? "",
            state: item.address?.state,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
        }));
    } catch {
        return [];
    }
}

/* FORECAST */

export type ForecastDay = {
    // day of the week
    date: string;        // e.g. "Mon", "Tue"

    avgTemp: number;
    minTemp: number;
    maxTemp: number;

    condition: string;
    description: string;
};

export async function fetchForecast(city: string): Promise<ForecastDay[]> {

    const response = await axios.get(`${BASE_URL}/forecast`, {
        params: { q: city, appid: API_KEY, units: "metric" },
    });

    const days: Record<string, any[]> = {};
    for (const entry of response.data.list) {
        const dayKey = new Date(entry.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
        if (!days[dayKey]) days[dayKey] = [];
        days[dayKey].push(entry);
    }

    const todayKey = new Date().toLocaleDateString("en-US", { weekday: "short" });

    return Object.entries(days)
        .filter(([key]) => key !== todayKey)
        .slice(0, 3)
        .map(([dayKey, entries]) => {

            // find the entry closest to noon — most representative temp of the day
            const noonEntry = entries.reduce((closest, entry) => {
                const hour = new Date(entry.dt * 1000).getUTCHours();
                const closestHour = new Date(closest.dt * 1000).getUTCHours();
                return Math.abs(hour - 12) < Math.abs(closestHour - 12) ? entry : closest;
            });

            return {
                date: dayKey,
                avgTemp: Math.round(noonEntry.main.temp),
                minTemp: Math.round(Math.min(...entries.map((e) => e.main.temp_min))),
                maxTemp: Math.round(Math.max(...entries.map((e) => e.main.temp_max))),
                condition: noonEntry.weather[0].main,
                description: noonEntry.weather[0].description,
            };
        });
}