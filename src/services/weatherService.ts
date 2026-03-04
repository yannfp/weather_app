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
        feels_like: Math.round(raw.main.feels_like),

        humidity: raw.main.humidity,
        pressure: raw.main.pressure,

        // [0] cause even if the weather can be represented as an array only one data interests us
        condition: raw.weather[0].main,
        description: raw.weather[0].description,

        windSpeed: raw.wind.speed,

        visibility: raw.visibility,

        icon: raw.weather[0].icon,

        latitude: raw.coordinates.latitude,
        longitude: raw.coordinates.longitude,
    };
}

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
        
    }
}