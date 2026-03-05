import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { addLocation } from "../services/locationService";
import { fetchWeatherByCity } from "../services/weatherService";
import { useTheme } from "../context/ThemeContext";
import { RootStackParamsList } from "../types";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamsList, "AddLocation">;
};

const AddLocationScreen: React.FC<Props> = ({ navigation }) => {
    const { colors } = useTheme();
    const [cityName, setCityName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddLocation = async () => {
        const trimmed = cityName.trim();
        if (!trimmed) {
            Alert.alert("Error", "Please enter a city name.");
            return;
        }

        setLoading(true);
        try {
            // First, verify the city exists by fetching its weather
            const weather = await fetchWeatherByCity(trimmed);

            // Then save it to the database with official name from API
            await addLocation({
                city_name: weather.cityName,
                country_code: weather.country,
                lat: weather.latitude,
                lon: weather.longitude,
            });

            Alert.alert(
                "Location Added! 🎉",
                `${weather.cityName}, ${weather.country} has been saved.`,
                [{ text: "OK", onPress: () => navigation.goBack() }]
            );
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.inner}>
                <Text style={[styles.title, { color: colors.text }]}>Add a Location</Text>
                <Text style={[styles.subtitle, { color: colors.subText }]}>
                    Enter a city name to save it to your list
                </Text>

                <TextInput
                    style={[styles.input, { borderColor: colors.primary, color: colors.text }]}
                    placeholder="e.g. Tokyo, Paris, New York"
                    placeholderTextColor={colors.subText}
                    value={cityName}
                    onChangeText={setCityName}
                    autoFocus={true}
                    returnKeyType="done"
                    onSubmitEditing={handleAddLocation}
                />

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }, loading && styles.disabled]}
                    onPress={handleAddLocation}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Save Location</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={[styles.cancelText, { color: colors.subText }]}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },

    inner: { flex: 1, justifyContent: "center", paddingHorizontal: 30 },

    title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
    subtitle: { fontSize: 15, marginBottom: 32 },

    input: {
        borderWidth: 2,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: "#fff",
    },

    button: {
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginBottom: 16,
    },
    disabled: { opacity: 0.6 },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    cancelText: { textAlign: "center", fontSize: 15, padding: 8 },
});

export default AddLocationScreen;