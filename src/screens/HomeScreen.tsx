import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { BlurView } from "expo-blur";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";

import { useBackground } from "../context/BackgroundContext";
import { useTheme } from "../context/ThemeContext";

import { fetchWeatherByCity, fetchWeatherByCoords, fetchForecast } from "../services/weatherService";
import { getSavedLocations, deleteLocation } from "../services/locationService";

import { getThemeFromWeather, getBackgroundImage, isNightTime } from "../utils/weatherHelpers";

import { commonStyles } from "../styles/common";

import { nightColors, fixedColors } from "../styles/color";

import WeatherCard from "../components/WeatherCard";
import HomeHeader from "../components/HomeHeader";
import LocationRow from "../components/LocationRow";
import EmptyLocations from "../components/EmptyLocations";

import { WeatherData, ForecastDay, SavedLocation, RootStackParamList, WeatherTheme } from "../types";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

  const { setTheme } = useTheme();
  const { backgroundImage, isNight, setBackground } = useBackground();

  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [weatherMap, setWeatherMap] = useState<Record<string, WeatherData>>({});
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);

  const [currentLocationData, setCurrentLocationData] = useState<SavedLocation | null>(null);

  const [currentLocationCity, setCurrentLocationCity] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("Hong Kong");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const activeColors = isNight ? nightColors : fixedColors;

  const loadLocations = async () => {
    try {
      const saved = await getSavedLocations();
      setLocations(saved);
      return saved;
    } catch {
      return [];
    }
  };

  const loadAllWeather = async (locations: SavedLocation[]) => {
    const weatherMap: Record<string, WeatherData> = {};

    await Promise.all(
        locations.map(async (location) => {
          try {
            weatherMap[location.city_name] = await fetchWeatherByCity(location.city_name);
          } catch {}
        })
    );

    return weatherMap;
  };

  const applyWeather = async (weather: WeatherData) => {
    const night = isNightTime(weather.sunrise, weather.sunset);

    setCurrentWeather(weather);
    setBackground(getBackgroundImage(weather.condition), night);
    setTheme(getThemeFromWeather(weather.condition) as WeatherTheme);

    // fetch forecast for the new city
    const days = await fetchForecast(weather.cityName);
    setForecast(days);
  };

  // load GPS coordinates then weather
  useEffect(() => {

    const init = async () => {
      setLoading(true);

      try {
        // ask user to access their location
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          // get the location with GPS coordinates
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;

          // fetch the weather of the current location
          const weather = await fetchWeatherByCoords(latitude, longitude);
          await applyWeather(weather);
          setSelectedCity(weather.cityName);
          setCurrentLocationCity(weather.cityName);

          setCurrentLocationData({
            id: "current",
            user_id: "",
            city_name: weather.cityName,
            country_code: weather.country,
            lat: latitude,
            lon: longitude,
            created_at: "",
          });

          setWeatherMap((prev) => ({ ...prev, [weather.cityName]: weather }));
        } else {
          // permission denied — fall back to default city
          const savedLocs = await loadLocations();
          const fallbackCity = savedLocs[0]?.city_name ?? "Hong Kong";
          const weather = await fetchWeatherByCity(fallbackCity);
          await applyWeather(weather);
          setSelectedCity(weather.cityName);
        }

      } catch {
        // GPS failed — fall back to default city
        const savedLocs = await loadLocations();
        const fallbackCity = savedLocs[0]?.city_name ?? "Hong Kong";
        const weather = await fetchWeatherByCity(fallbackCity);
        await applyWeather(weather);
        setSelectedCity(weather.cityName);
      }

      // load all saved locations and their weather
      const locations = await loadLocations();
      if (locations.length > 0) {
        const weatherMap = await loadAllWeather(locations);
        setWeatherMap((prev) => ({ ...prev, ...weatherMap }));
      }

      setLoading(false);
    };

    init();
  }, []);

  // reload when screen goes back to focus
  useFocusEffect(
      useCallback(() => {
        const refresh = async () => {
          const locations = await loadLocations();
          if (locations.length > 0) {
            const wm = await loadAllWeather(locations);
            setWeatherMap((prev) => ({ ...prev, ...weatherMap }));
          }
        };

        refresh();
      }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const weather = await fetchWeatherByCity(selectedCity);
      await applyWeather(weather);
    } catch {}

    const locations = await loadLocations();
    const weatherMap = await loadAllWeather(locations);

    setWeatherMap((prev) => ({ ...prev, ...weatherMap }));
    setRefreshing(false);
  };

  const selectCity = async (cityName: string) => {
    setSelectedCity(cityName);

    try {
      const weather = weatherMap[cityName] || (await fetchWeatherByCity(cityName));
      await applyWeather(weather)
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const handleDelete = async (loc: SavedLocation) => {
    try {
      await deleteLocation(loc.id);
      setLocations((prev) => prev.filter((l) => l.id !== loc.id));

      if (loc.city_name === selectedCity) {
        // find first remaining location after deletion
        const remaining = displayLocations.filter((l) => l.id !== loc.id);
        if (remaining.length > 0) {
          await selectCity(remaining[0].city_name);
        }
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const displayLocations: SavedLocation[] = currentLocationData
      ? [
        currentLocationData,
        ...locations.filter((l) => l.city_name !== currentLocationData.city_name),
      ]
      : locations;

  if (loading) {
    return (
        <View style={[styles.centered, { backgroundColor: "#E8F0FF" }]}>
          <ActivityIndicator size="large" color={activeColors.primary} />
          <Text style={[styles.loadingText, { color: activeColors.subText }]}>
            Fetching weather…
          </Text>
        </View>
    );
  }

  return (
      <ImageBackground
          source={{ uri: backgroundImage }}
          style={ styles.background }
          resizeMode="cover"
      >
        <BlurView intensity={ isNight ? 60 : 10 } tint={ isNight ? "dark" : "light" } style={StyleSheet.absoluteFill}/>

        <ScrollView
            style={ styles.scroll }
            contentContainerStyle={commonStyles.screenContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={activeColors.primary}
              />
            }
        >

          <HomeHeader themeColors={activeColors} onSettings={() => navigation.navigate("Settings")}/>

          {/* Main weather card */}
          {currentWeather && (
              <WeatherCard
                  cityName={currentWeather.cityName}
                  country={currentWeather.country}
                  temperature={currentWeather.temperature}
                  tempMin={currentWeather.tempMin}
                  tempMax={currentWeather.tempMax}
                  condition={currentWeather.condition}
                  description={currentWeather.description}
                  humidity={currentWeather.humidity}
                  windSpeed={currentWeather.windSpeed}
                  feelsLike={currentWeather.feelsLike}
                  timezone={currentWeather.timezone}
                  forecast={forecast}
                  colors={activeColors}
              />
          )}

          {/* Locations section header */}
          <View style={commonStyles.sectionHeader}>
            <Text style={[commonStyles.sectionTitle, { color: activeColors.text }]}>
              Saved locations
            </Text>

            <TouchableOpacity
                onPress={() => navigation.navigate("AddLocation")}
                style={[commonStyles.pillButton, { backgroundColor: "rgba(0,0,0,0.25)" }]}
            >
              <Text style={[commonStyles.pillButtonText, { color: "#FFFFFF" }]}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {/* Location list */}
          {displayLocations.length === 0 ? (
              <EmptyLocations themeColors={activeColors} />
          ) : (
              displayLocations.map((loc) => (
                  <LocationRow
                      key={loc.id}
                      location={loc}
                      weather={weatherMap[loc.city_name]}
                      themeColors={activeColors}
                      isSelected={loc.city_name === selectedCity}
                      isCurrentLocation={loc.city_name === currentLocationCity}
                      onPress={() => selectCity(loc.city_name)}
                      onDelete={() => handleDelete(loc)}
                  />
              ))
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
  },
});

export default HomeScreen;