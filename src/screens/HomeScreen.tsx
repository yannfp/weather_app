import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { fetchWeatherByCity } from "../services/weatherService";
import { getSavedLocations, deleteLocation } from "../services/locationService";
import { getThemeFromWeather, getWeatherEmoji } from "../utils/weatherHelpers";
import { WeatherData, SavedLocation, RootStackParamsList } from "../types";

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamsList, "Home">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const { user, signOut } = useAuth();
    const { colors, setTheme } = useTheme();

    const [locations, setLocations] = useState<SavedLocation[]>([]);
    const [weatherMap, setWeatherMap] = useState<Record<string, WeatherData>>({});
    const [selectedCity, setSelectedCity] = useState<string>("London");
    const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Load locations from database
    const loadLocations = async () => {
        try {
            const saved = await getSavedLocations();
            setLocations(saved);
            return saved;
        } catch (error: any) {
            Alert.alert("Error", error.message);
            return [];
        }
    };

    // Fetch weather for all saved locations
    const loadAllWeather = async (locs: SavedLocation[]) => {
        const weatherData: Record<string, WeatherData> = {};
        await Promise.all(
            locs.map(async (loc) => {
                try {
                    const weather = await fetchWeatherByCity(loc.city_name);
                    weatherData[loc.city_name] = weather;
                } catch {
                    // Silently fail for individual cities
                }
            })
        );
        return weatherData;
    };

    // Initial load
    useEffect(() => {
        const init = async () => {
            setLoading(true);
            const locs = await loadLocations();

            // If no saved locations, start with London as default
            const citiesToLoad = locs.length > 0 ? locs : [];
            try {
                const defaultWeather = await fetchWeatherByCity(selectedCity);
                setCurrentWeather(defaultWeather);
                const theme = getThemeFromWeather(defaultWeather.condition);
                setTheme(theme);
            } catch (error: any) {
                Alert.alert("Error", error.message);
            }

            if (citiesToLoad.length > 0) {
                const weather = await loadAllWeather(citiesToLoad);
                setWeatherMap(weather);
            }
            setLoading(false);
        };
        init();
    }, []);

    // Reload when screen comes back into focus (e.g., after adding a location)
    useFocusEffect(
        useCallback(() => {
            const refresh = async () => {
                const locs = await loadLocations();
                if (locs.length > 0) {
                    const weather = await loadAllWeather(locs);
                    setWeatherMap(weather);
                }
            };
            refresh();
        }, [])
    );

    // Pull-to-refresh
    const onRefresh = async () => {
        setRefreshing(true);
        const weather = await fetchWeatherByCity(selectedCity);
        setCurrentWeather(weather);
        setTheme(getThemeFromWeather(weather.condition));
        const locs = await loadLocations();
        const wm = await loadAllWeather(locs);
        setWeatherMap(wm);
        setRefreshing(false);
    };

    // Select a location to view its weather
    const selectCity = async (cityName: string) => {
        setSelectedCity(cityName);
        try {
            const weather = weatherMap[cityName] || (await fetchWeatherByCity(cityName));
            setCurrentWeather(weather);
            setTheme(getThemeFromWeather(weather.condition));
        } catch (error: any) {
            Alert.alert("Error", error.message);
        }
    };

    // Delete a saved location
    const handleDelete = (location: SavedLocation) => {
        Alert.alert(
            "Remove Location",
            `Remove ${location.city_name} from your saved locations?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteLocation(location.id);
                            setLocations((prev) => prev.filter((l) => l.id !== location.id));
                        } catch (error: any) {
                            Alert.alert("Error", error.message);
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ color: colors.text, marginTop: 12 }}>Loading weather...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    {getWeatherEmoji(currentWeather?.condition || "")} Weather
                </Text>
                <TouchableOpacity onPress={signOut}>
                    <Text style={[styles.logoutText, { color: colors.primary }]}>Sign Out</Text>
                </TouchableOpacity>
            </View>

            {/* Current Weather Card */}
            {currentWeather && (
                <View style={[styles.mainCard, { backgroundColor: colors.cardBackground }]}>
                    <Text style={[styles.cityName, { color: colors.text }]}>
                        {currentWeather.cityName}, {currentWeather.country}
                    </Text>
                    <Text style={[styles.temperature, { color: colors.primary }]}>
                        {currentWeather.temperature}°C
                    </Text>
                    <Text style={[styles.condition, { color: colors.subText }]}>
                        {currentWeather.description}
                    </Text>

                    {/* Weather Details Grid */}
                    <View style={styles.detailsGrid}>
                        <WeatherDetail label="Feels like" value={`${currentWeather.feelsLike}°C`} colors={colors} />
                        <WeatherDetail label="Humidity" value={`${currentWeather.humidity}%`} colors={colors} />
                        <WeatherDetail label="Wind" value={`${currentWeather.windSpeed} m/s`} colors={colors} />
                        <WeatherDetail label="Visibility" value={`${currentWeather.visibility} km`} colors={colors} />
                    </View>
                </View>
            )}

            {/* Saved Locations Section */}
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    📍 Saved Locations
                </Text>
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: colors.primary }]}
                    onPress={() => navigation.navigate("AddLocation")}
                >
                    <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
            </View>

            {locations.length === 0 ? (
                <Text style={[styles.emptyText, { color: colors.subText }]}>
                    No saved locations yet. Tap "+ Add" to add cities!
                </Text>
            ) : (
                locations.map((location) => {
                    const w = weatherMap[location.city_name];
                    return (
                        <TouchableOpacity
                            key={location.id}
                            style={[styles.locationCard, { backgroundColor: colors.cardBackground }]}
                            onPress={() => selectCity(location.city_name)}
                            onLongPress={() => handleDelete(location)}
                        >
                            <View>
                                <Text style={[styles.locationName, { color: colors.text }]}>
                                    {location.city_name}, {location.country_code}
                                </Text>
                                <Text style={[styles.locationCondition, { color: colors.subText }]}>
                                    {w ? w.description : "Loading..."}
                                </Text>
                            </View>
                            <Text style={[styles.locationTemp, { color: colors.primary }]}>
                                {w ? `${w.temperature}°C` : "—"}
                            </Text>
                        </TouchableOpacity>
                    );
                })
            )}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

// Small helper component for weather detail items
const WeatherDetail = ({
                           label,
                           value,
                           colors,
                       }: {
    label: string;
    value: string;
    colors: any;
}) => (
    <View style={styles.detailItem}>
        <Text style={[styles.detailLabel, { color: colors.subText }]}>{label}</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },

    centered: { flex: 1, justifyContent: "center", alignItems: "center" },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        paddingTop: 8,
    },
    headerTitle: { fontSize: 24, fontWeight: "bold" },

    logoutText: { fontSize: 14, fontWeight: "600" },
    mainCard: {
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },

    cityName: { fontSize: 20, fontWeight: "600", marginBottom: 4 },

    temperature: { fontSize: 72, fontWeight: "bold", marginVertical: 8 },
    condition: { fontSize: 18, marginBottom: 16, textTransform: "capitalize" },

    detailsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        width: "100%",
        marginTop: 8,
    },
    detailItem: { alignItems: "center", width: "45%", marginVertical: 8 },
    detailLabel: { fontSize: 12, marginBottom: 2 },
    detailValue: { fontSize: 16, fontWeight: "600" },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: { fontSize: 18, fontWeight: "bold" },

    addButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: { color: "#fff", fontWeight: "600" },

    emptyText: { textAlign: "center", marginTop: 20, fontSize: 14 },

    locationCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    locationName: { fontSize: 16, fontWeight: "600" },

    locationCondition: { fontSize: 13, textTransform: "capitalize", marginTop: 2 },

    locationTemp: { fontSize: 22, fontWeight: "bold" },
});

export default HomeScreen;