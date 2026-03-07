import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import { fetchWeatherByCity, fetchWeatherByCoords } from "../services/weatherService";
import { getSavedLocations, deleteLocation, addLocation } from "../services/locationService";

import { getThemeFromWeather } from "../utils/weatherHelpers";

import { commonStyles } from "../styles/common";
import { spacing, fontSize, fontWeight, radius } from "../styles/spacing";

import WeatherCard from "../components/WeatherCard";
import HomeHeader from "../components/HomeHeader";
import LocationRow from "../components/LocationRow";
import EmptyLocations from "../components/EmptyLocations";

import { WeatherData, SavedLocation, RootStackParamList } from "../types";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

  const { signOut } = useAuth();
  const { colors, setTheme } = useTheme();

  const [locations, setLocations] = useState<SavedLocation[]>([]);

  const [weatherMap, setWeatherMap] = useState<Record<string, WeatherData>>({});
  const [currentLocationCity, setCurrentLocationCity] = useState<string>("");

  const [selectedCity, setSelectedCity] = useState("Hong Kong");

  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

          setCurrentWeather(weather);
          setSelectedCity(weather.cityName);
          setCurrentLocationCity(weather.cityName);
          setTheme(getThemeFromWeather(weather.condition));

          // get all saved locations
          const savedLocs = await loadLocations();

          // only save if not already in the list
          const alreadySaved = savedLocs.some((l) => l.city_name === weather.cityName);
          if (!alreadySaved) {

            try {
              await addLocation({
                city_name: weather.cityName,
                country_code: weather.country,
                lat: latitude,
                lon: longitude,
              });

              await loadLocations();

            } catch {}
          }

        } else {
          // permission denied — fall back to default city
          const weather = await fetchWeatherByCity("Hong Kong");
          setCurrentWeather(weather);
          setSelectedCity(weather.cityName);
          setTheme(getThemeFromWeather(weather.condition));
        }

      } catch {
        // GPS failed — fall back to default city
        const weather = await fetchWeatherByCity("Hong Kong");
        setCurrentWeather(weather);
        setSelectedCity(weather.cityName);
        setTheme(getThemeFromWeather(weather.condition));
      }

      // load all saved locations and their weather
      const locations = await loadLocations();
      if (locations.length > 0) {
        const weatherMap = await loadAllWeather(locations);
        setWeatherMap(weatherMap);
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
            setWeatherMap(wm);
          }
        };

        refresh();
      }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const w = await fetchWeatherByCity(selectedCity);

      setCurrentWeather(w);
      setTheme(getThemeFromWeather(w.condition));

    } catch {}

    const locs = await loadLocations();
    const wm = await loadAllWeather(locs);

    setWeatherMap(wm);
    setRefreshing(false);
  };

  const selectCity = async (cityName: string) => {
    setSelectedCity(cityName);

    try {
      const w = weatherMap[cityName] || (await fetchWeatherByCity(cityName));

      setCurrentWeather(w);
      setTheme(getThemeFromWeather(w.condition));
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  // Direct delete — no confirmation needed since swipe is intentional
  const handleDelete = async (loc: SavedLocation) => {
    try {
      await deleteLocation(loc.id);

      setLocations((prev) => prev.filter((l) => l.id !== loc.id));

      // If user was currently on this location switch back to the user's current location
      if (loc.city_name == selectedCity) {
        await selectCity(currentLocationCity);
      }

    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  if (loading) {
    return (
        <View style={[commonStyles.centered, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[commonStyles.loadingText, { color: colors.subText }]}>
            Fetching weather…
          </Text>
        </View>
    );
  }

  return (
      <ScrollView
          style={[commonStyles.screenContainer, { backgroundColor: colors.background }]}
          contentContainerStyle={commonStyles.screenContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
            />
          }
      >

        <HomeHeader themeColors={colors} onSignOut={signOut} onSettings={() => navigation.navigate("Settings")}/>

        {/* Main weather card */}
        {currentWeather && (
            <WeatherCard
                cityName={currentWeather.cityName}
                country={currentWeather.country}
                temperature={currentWeather.temperature}
                condition={currentWeather.condition}
                description={currentWeather.description}
                humidity={currentWeather.humidity}
                windSpeed={currentWeather.windSpeed}
                feelsLike={currentWeather.feelsLike}
                colors={colors}
            />
        )}

        {/* Locations section header */}
        <View style={commonStyles.sectionHeader}>
          <Text style={[commonStyles.sectionTitle, { color: colors.text }]}>
            Saved locations
          </Text>

          <TouchableOpacity
              onPress={() => navigation.navigate("AddLocation")}
              style={[commonStyles.pillButton, { backgroundColor: colors.primary }]}
          >
            <Text style={commonStyles.pillButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Location list */}
        {locations.length === 0 ? (
          <EmptyLocations themeColors={colors}/>
        ) : (
            // sort the locations so the current location is always first
            [...locations]
                .sort((a, b) => {
                  if (a.city_name == currentLocationCity) return -1;
                  if (b.city_name == currentLocationCity) return 1;
                  return 0;
                })
                .map((loc) => {
                  return <LocationRow key={loc.id}
                               location={loc}
                               weather={weatherMap[loc.city_name]}
                               themeColors={colors}
                               isSelected={loc.city_name == selectedCity}
                               isCurrentLocation={loc.city_name == currentLocationCity}
                               onPress={() => selectCity(loc.city_name)}
                               onDelete={() => handleDelete(loc)}
                  />
                })
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
  );
};

export default HomeScreen;
