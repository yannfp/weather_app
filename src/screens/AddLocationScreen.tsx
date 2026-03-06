import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { addLocation } from "../services/locationService";
import { fetchWeatherByCity } from "../services/weatherService";
import { useTheme } from "../context/ThemeContext";
import { showAlert } from "../utils/alerts";
import { RootStackParamList } from "../types";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AddLocation">;
};

const AddLocationScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleAdd = async () => {

    const trimmed = cityName.trim();
    if (!trimmed) {
      showAlert("Missing city", "Please enter a city name.");
      return;
    }
    setLoading(true);

    try {
      const weather = await fetchWeatherByCity(trimmed);

      await addLocation({
        city_name: weather.cityName,
        country_code: weather.country,
        lat: weather.latitude,
        lon: weather.longitude,
      });

      navigation.goBack();

    } catch (error: any) {

      if (error.message === "This location is already saved.") {
        showAlert(
            "Already saved 📍",
            `${cityName} is already in your locations list.`
        );
      } else {
        showAlert("Error", error.message);
      }

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

          {/* Back button */}
          <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              activeOpacity={0.7}
          >
            <Text style={[styles.backText, { color: colors.subText }]}>← Back</Text>
          </TouchableOpacity>

          {/* Title area */}
          <View style={styles.titleArea}>
            <Text style={styles.titleEmoji}>🔍</Text>
            <Text style={[styles.title, { color: colors.text }]}>Add location</Text>
            <Text style={[styles.subtitle, { color: colors.subText }]}>
              Enter a city name to add it to your list
            </Text>
          </View>

          {/* Input card */}
          <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.label, { color: colors.subText }]}>City name</Text>
            <TextInput
                style={[
                  styles.input,
                  { color: colors.text, borderColor: focused ? colors.primary : colors.accent },
                ]}

                placeholder="e.g. Tokyo, Paris, New York"
                placeholderTextColor={colors.subText}

                value={cityName}
                onChangeText={setCityName}

                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleAdd}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />

            <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: colors.primary },
                  loading && styles.buttonLoading,
                ]}
                onPress={handleAdd}
                disabled={loading}
                activeOpacity={0.85}
            >
              {loading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color="#FFFFFF" size="small" />
                    <Text style={styles.buttonText}>Checking city…</Text>
                  </View>
              ) : (
                  <Text style={styles.buttonText}>Save location</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Tip */}
          <Text style={[styles.tip, { color: colors.subText }]}>
            💡 We verify the city exists before saving it
          </Text>

        </View>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  backBtn: {
    marginBottom: 32,
  },
  backText: {
    fontSize: 15,
    fontWeight: "500",
  },

  titleArea: {
    marginBottom: 32,
  },
  titleEmoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },

  card: {
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 4,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#F7F8FA",
  },
  button: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonLoading: {
    opacity: 0.75,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  tip: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default AddLocationScreen;
