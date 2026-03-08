import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { ThemeColors } from "../types";

import { getWeatherEmoji, convertTemperature } from "../utils/weatherHelpers";

import { useSettings } from "../context/SettingsContext";

type WeatherCardProps = {
  cityName: string;
  country: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  colors: ThemeColors;
};

const WeatherCard: React.FC<WeatherCardProps> = ({
                                                   cityName,
                                                   country,
                                                   temperature,
                                                   condition,
                                                   description,
                                                   humidity,
                                                   windSpeed,
                                                   feelsLike,
                                                   colors,
                                                 }) => {

    const { unit } = useSettings();
    const displayTemp = convertTemperature(temperature, unit);

    const emoji = getWeatherEmoji(condition);

    return (
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>

            {/* Top row — location + emoji */}
            <View style={styles.topRow}>
                <View>
                    <Text style={[styles.city, { color: colors.text }]}>{cityName}</Text>
                    <Text style={[styles.country, { color: colors.subText }]}>{country}</Text>
                </View>
                <Text style={styles.emoji}>{emoji}</Text>
            </View>

            {/* Big temperature */}
            <Text style={[styles.temperature, { color: colors.primary }]}>
                {displayTemp}°{unit == "fahrenheit" ? "F" : "C"}
            </Text>

            {/* Condition pill */}
            <View style={[styles.conditionPill, { backgroundColor: colors.accent }]}>
                <Text style={[styles.conditionText, { color: colors.primary }]}>
                    {description}
                </Text>
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.accent }]} />

            {/* Stats row */}
            <View style={styles.statsRow}>
                <StatItem label="Feels like" value={`${feelsLike}°`} colors={colors} />
                <StatItem label="Humidity" value={`${humidity}%`} colors={colors} />
                <StatItem label="Wind" value={`${windSpeed} m/s`} colors={colors} />
            </View>

        </View>
    );
};

// Small stat display
const StatItem = ({
                      label,
                      value,
                      colors,
                  }: {
    label: string;
    value: string;
    colors: ThemeColors;
}) => (
    <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: colors.subText }]}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    card: {
        borderRadius: 28,
        padding: 28,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 5,
        marginBottom: 24,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    city: {
        fontSize: 22,
        fontWeight: "700",
        letterSpacing: -0.4,
    },
    country: {
        fontSize: 14,
        marginTop: 2,
        fontWeight: "500",
    },
    emoji: {
        fontSize: 40,
    },
    temperature: {
        fontSize: 88,
        fontWeight: "700",
        letterSpacing: -4,
        lineHeight: 88,
        marginBottom: 16,
    },
    conditionPill: {
        alignSelf: "flex-start",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 24,
    },
    conditionText: {
        fontSize: 13,
        fontWeight: "600",
        textTransform: "capitalize",
        letterSpacing: 0.2,
    },
    divider: {
        height: 1,
        marginBottom: 20,
        borderRadius: 1,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    statItem: {
        alignItems: "center",
    },
    statValue: {
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: -0.3,
    },
    statLabel: {
        fontSize: 11,
        marginTop: 3,
        fontWeight: "500",
    },
});

export default WeatherCard;
