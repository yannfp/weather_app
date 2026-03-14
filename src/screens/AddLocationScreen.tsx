import React, { useRef, useState, useEffect } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, ImageBackground } from "react-native";
import { BlurView } from "expo-blur";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";

import { useBackground } from "../context/BackgroundContext";

import { addLocation } from "../services/locationService";
import { fetchWeatherByCity, fetchWeatherByCoords, searchCities, CitySuggestion } from "../services/weatherService";

import { RootStackParamList } from "../types";

import { commonStyles } from "../styles/common";
import {fixedColors, nightColors} from "../styles/color";

import CityInput from "../components/CityInput";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AddLocation">;
};


const AddLocationScreen: React.FC<Props> = ({ navigation }) => {

  const headerHeight = useHeaderHeight();

  const { backgroundImage, isNight } = useBackground();
  const activeColors = isNight ? nightColors : fixedColors;

  const [cityName, setCityName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (cityName.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      const results = await searchCities(cityName);
      setSuggestions(results);
    }, 350);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [cityName]);

  const handleSelectSuggestion = async (suggestion: CitySuggestion) => {
    setCityName(suggestion.name);
    setSuggestions([]);

    setLoading(true);
    setErrorMessage("");

    try {
      // use coords instead of name — avoids matching wrong city
      const weather = await fetchWeatherByCoords(suggestion.lat, suggestion.lon);

      await addLocation({
        city_name: weather.cityName,
        country_code: weather.country,
        lat: suggestion.lat,
        lon: suggestion.lon,
      });

      navigation.goBack();

    } catch (error: any) {
      if (error.message === "This location is already saved.") {
        setErrorMessage(`${suggestion.name} is already in your location list.`);
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (overrideName?: string) => {
    const trimmed = (overrideName ?? cityName).trim();
    if (!trimmed) {
      setErrorMessage("Please enter a valid city name.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuggestions([]);

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
        setErrorMessage(`${trimmed} is already in your location list.`);
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <ImageBackground source={{ uri: backgroundImage }} style={{ flex: 1 }} resizeMode="cover">
        <BlurView intensity={isNight ? 60 : 10} tint={isNight ? "dark" : "light"} style={StyleSheet.absoluteFill} />

        <KeyboardAvoidingView
            style={[commonStyles.screenContainer, { backgroundColor: "transparent" }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

          <View style={[commonStyles.screenContent, { paddingTop: headerHeight }]}>

            {/* Title area */}
            <View style={styles.titleArea}>
              <Text style={[styles.title, { color: activeColors.text }]}>Add location</Text>
              <Text style={[styles.subtitle, { color: activeColors.subText }]}>
                Enter a city name to add it to your list
              </Text>
            </View>

            {/* Input card */}
            <CityInput
                themeColors={activeColors}
                value={cityName}
                onChangeText={(text) => {
                  setCityName(text);
                  setErrorMessage("");
                }}
                onSubmit={handleAdd}
                isNight={isNight}
                loading={loading}
                errorMessage={errorMessage}
                suggestions={suggestions}
                onSelectSuggestion={handleSelectSuggestion}
            />

          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({

  backButton: {
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

  tip: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default AddLocationScreen;
