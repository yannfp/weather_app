import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { addLocation } from "../services/locationService";
import { fetchWeatherByCity } from "../services/weatherService";

import { RootStackParamList } from "../types";

import { commonStyles } from "../styles/common";
import { fixedColors } from "../styles/color";

import CityInput from "../components/CityInput";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AddLocation">;
};

const AddLocationScreen: React.FC<Props> = ({ navigation }) => {

  const [cityName, setCityName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {

    const trimmed = cityName.trim();
    if (!trimmed) {
      setErrorMessage("Please enter a valid city name.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

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
        setErrorMessage(`${cityName} is already in your location list.`);
      } else {
        setErrorMessage(error.message);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
      <KeyboardAvoidingView
          style={[commonStyles.screenContainer, { backgroundColor: fixedColors.background }]}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={commonStyles.screenContent}>

          {/* Title area */}
          <View style={styles.titleArea}>
            <Text style={[styles.title, { color: fixedColors.text }]}>Add location</Text>
            <Text style={[styles.subtitle, { color: fixedColors.subText }]}>
              Enter a city name to add it to your list
            </Text>
          </View>

          {/* Input card */}
          <CityInput
              themeColors={fixedColors}
              value={cityName}
              onChangeText={(text) => {
                setCityName(text);
                setErrorMessage("");
              }}
              onSubmit={handleAdd}
              loading={loading}
              errorMessage={errorMessage}
          />

          {/* Tip */}
          <Text style={[styles.tip, { color: fixedColors.subText }]}>
            💡 We verify the city exists before saving it
          </Text>

        </View>
      </KeyboardAvoidingView>
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
