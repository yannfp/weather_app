import React, { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {fetchWeatherByCity, fetchWeatherByCoords} from "../services/weatherService";
import {getSavedLocations, deleteLocation, addLocation} from "../services/locationService";
import { getThemeFromWeather, getWeatherEmoji } from "../utils/weatherHelpers";
import WeatherCard from "../components/WeatherCard";
import { WeatherData, SavedLocation, RootStackParamList } from "../types";

// user location
import * as Location from "expo-location";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const { colors, setTheme } = useTheme();

  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [weatherMap, setWeatherMap] = useState<Record<string, WeatherData>>({});
  const [selectedCity, setSelectedCity] = useState("London");
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

  const loadAllWeather = async (locs: SavedLocation[]) => {
    const wm: Record<string, WeatherData> = {};
    await Promise.all(
      locs.map(async (loc) => {
        try {
          wm[loc.city_name] = await fetchWeatherByCity(loc.city_name);
        } catch {}
      })
    );
    return wm;
  };

  useEffect(() => {

    const init = async () => {

      setLoading(true);

      try {

        // ask user to access their location
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status == "granted")
        {
          // get the location with GPS coordinates
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;

          // fetch the weather of the city
          const weather = await fetchWeatherByCoords(latitude, longitude);

          setCurrentWeather(weather);
          setSelectedCity(weather.cityName);
          setTheme(getThemeFromWeather(weather.condition));

          // add the default location of the user to the database
          try {
            await addLocation({
              city_name: weather.cityName,
              country_code: weather.condition,
              lat: latitude,
              lon: longitude,
            });
          } catch {

          }

        } else {
          // permission to get the location denied by user
          const weather = await fetchWeatherByCity("Hong Kong");

          setCurrentWeather(weather);
          setSelectedCity(weather.cityName);
          setTheme(getThemeFromWeather(weather.condition));
        }
      } catch (e: any) {

        // gps failed back to default location
        const weather = await fetchWeatherByCity("Hong Kong");

        setCurrentWeather(weather);
        setSelectedCity(weather.cityName);
        setTheme(getThemeFromWeather(weather.condition));
      }

      // load all saved locations
      const locations = await loadLocations();
      if (locations.length > 0) {
        const weatherMap = await loadAllWeather(locations);
        setWeatherMap(weatherMap);
      }

      setLoading(false);
    };

    init();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const refresh = async () => {
        const locs = await loadLocations();
        if (locs.length > 0) {
          const wm = await loadAllWeather(locs);
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

  const handleDelete = (loc: SavedLocation) => {
    Alert.alert("Remove location", `Remove ${loc.city_name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteLocation(loc.id);
            setLocations((prev) => prev.filter((l) => l.id !== loc.id));
          } catch (e: any) {
            Alert.alert("Error", e.message);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.subText }]}>
          Fetching weather…
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.subText }]}>
            Good {getTimeOfDay()}
          </Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Weather</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={[styles.signOutBtn, { borderColor: colors.accent }]}>
          <Text style={[styles.signOutText, { color: colors.subText }]}>Sign out</Text>
        </TouchableOpacity>
      </View>

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
          visibility={currentWeather.visibility}
          colors={colors}
        />
      )}

      {/* Locations section header */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Saved locations
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddLocation")}
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Location list */}
      {locations.length === 0 ? (
        <View style={[styles.emptyState, { backgroundColor: colors.cardBackground }]}>
          <Text style={styles.emptyEmoji}>📍</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No locations yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.subText }]}>
            Tap "+ Add" to save cities for quick access
          </Text>
        </View>
      ) : (
        locations.map((loc) => {
          const w = weatherMap[loc.city_name];
          const isSelected = loc.city_name === selectedCity;
          return (
            <TouchableOpacity
              key={loc.id}
              style={[
                styles.locationRow,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: isSelected ? colors.primary : "transparent",
                  borderWidth: isSelected ? 1.5 : 0,
                },
              ]}
              onPress={() => selectCity(loc.city_name)}
              onLongPress={() => handleDelete(loc)}
              activeOpacity={0.75}
            >
              {/* Left: city info */}
              <View style={styles.locationLeft}>
                <Text style={styles.locationEmoji}>
                  {getWeatherEmoji(w?.condition || "")}
                </Text>
                <View style={styles.locationInfo}>
                  <Text style={[styles.locationName, { color: colors.text }]}>
                    {loc.city_name}
                  </Text>
                  <Text style={[styles.locationCondition, { color: colors.subText }]}>
                    {w ? w.description : "Loading…"}
                  </Text>
                </View>
              </View>

              {/* Right: temperature */}
              <Text style={[styles.locationTemp, { color: colors.primary }]}>
                {w ? `${w.temperature}°` : "—"}
              </Text>
            </TouchableOpacity>
          );
        })
      )}

      <Text style={[styles.hint, { color: colors.subText }]}>
        Long press a location to remove it
      </Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

// Helper — returns "morning", "afternoon", or "evening"
function getTimeOfDay(): string {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 60 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 14, fontSize: 15 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 28,
  },
  greeting: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.3,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -1,
  },
  signOutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  signOutText: {
    fontSize: 13,
    fontWeight: "600",
  },

  // Section
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  addBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  // Empty state
  emptyState: {
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginBottom: 16,
  },
  emptyEmoji: { fontSize: 36, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  emptySubtitle: { fontSize: 13, textAlign: "center", lineHeight: 20 },

  // Location row
  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    padding: 18,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  locationLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  locationEmoji: { fontSize: 28 },
  locationInfo: {},
  locationName: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  locationCondition: {
    fontSize: 13,
    marginTop: 2,
    textTransform: "capitalize",
  },
  locationTemp: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -1,
  },

  hint: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 8,
  },
});

export default HomeScreen;
