// define all the types of data we will use in our application

// WEATHER TYPES

// raw data we get from the OpenWeatherMap API
// data is in a JSON file
export type WeatherAPIResponse = {

    // city name
    name: string;

    sys: {
        // country code (US, FR, ...)
        country: string;
    };

    main: {
        temp: number;
        feels_like: number;
        humidity: number;
        pressure: number;
        temp_min: number;
        temp_max: number;
    };

    weather: Array<{
        // weather condition code
        id: number;

        // main description of the weather (i.e. clear sky)
        main: string;

        // full description of the weather
        description: string;

        // string for the icon of the weather condition
        icon: string;
    }>;

    wind: {
        speed: number;

        // orientation of the wind
        degree: number;
    };

    // visibility level
    visibility: number;

    // coordinates of the city
    coordinates: {
        latitude: number;
        longitude: number;
    };
};

// cleaned-up data we got from the API response
export type WeatherData = {
    cityName: string;
    country: string;

    temperature: number;
    feels_like: number;

    humidity: number;

    pressure: number;

    // e.g. Rain
    condition: string;

    // e.g. light rain
    description: string;

    windSpeed: number;

    visibility: number;

    icon: string;

    latitude: number;
    longitude: number;
};

// LOCATION TYPES

// saved location issued from the Supabase database
export type SavedLocation = {
    id: string;

    user_id: string;

    city_name: string;
    country_code: string;

    lat: number | null;
    lon: number | null;

    created_at: string;
};

// data needed to save a new location into the database
export type NewLocation = {
    city_name: string;
    country_code: string;

    lat?: number;
    lon?: number;
};

// THEME TYPES
export type WeatherTheme = "sunny" | "cloudy" | "rainy" | "snowy" | "stormy" | "default";

export type ThemeColors = {
    primary: string;
    secondary: string;

    background: string;
    cardBackground: string;

    text: string;
    subText: string;
    accent: string;
};

// AUTH TYPES
export type AuthUser = {
    id: string;
    email: string;
};

// defines the menu of available screens of the app
// precises what information they expect to receive
export type RootStackParamsList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    AddLocation: undefined;
};