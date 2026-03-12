import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { ThemeColors, ForecastDay } from "../types";

import { convertTemperature, getLocalTime, getCountryName } from "../utils/weatherHelpers";

import { useSettings } from "../context/SettingsContext";

import { fontWeight, fontSize, spacing } from "../styles/spacing";

type WeatherCardProps = {
    cityName: string;
    country: string;

    temperature: number;
    tempMin: number;
    tempMax: number;

    condition: string;
    description: string;

    humidity: number;
    windSpeed: number;
    feelsLike: number;
    timezone: number;

    forecast: ForecastDay[];

    colors: ThemeColors;
};

const WeatherCard: React.FC<WeatherCardProps> = ({ cityName, country, temperature, tempMin, tempMax, description, humidity, windSpeed, feelsLike, timezone, forecast, colors }) => {

    const { unit, timeFormat } = useSettings();

    const displayTemp = convertTemperature(temperature, unit);
    const localTime = getLocalTime(timezone, timeFormat);
    const countryName = getCountryName(country);

    return (
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>

            {/* Location and Time */}
            <View style={styles.topRow}>
                <View>
                    <Text style={[styles.city, { color: colors.text }]}>{cityName}</Text>
                    <Text style={[styles.country, { color: colors.subText }]}>{countryName}</Text>
                </View>

                <View style={styles.topRight}>
                    <Text style={[styles.localTime, { color: colors.text}]}>{localTime}</Text>
                </View>
            </View>

            {/* Temperature */}
            <Text style={[styles.temperature, { color: colors.primary }]}>
                {displayTemp}°{unit == "fahrenheit" ? "F" : "C"}
            </Text>

            <Text style={[styles.todayRange, { color: colors.subText }]}>
                H: {convertTemperature(tempMax, unit)}°  L: {convertTemperature(tempMin, unit)}°
            </Text>

            {/* Condition */}
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

            {/* 3-day forecast */}
            {/* 3-day forecast */}
            {forecast.length > 0 && (
                <>
                    <View style={[styles.divider, { backgroundColor: colors.accent, marginTop: spacing.lg }]} />
                    <View style={styles.forecastRow}>
                        {forecast.map((day) => (
                            <View key={day.date} style={styles.forecastDay}>
                                <Text style={[styles.forecastDayName, { color: colors.subText }]}>
                                    {day.date}
                                </Text>

                                <Text style={[styles.forecastDescription, { color: colors.subText }]}>
                                    {day.description}
                                </Text>

                                <Text style={[styles.forecastAvg, { color: colors.text }]}>
                                    {convertTemperature(day.avgTemp, unit)}°
                                </Text>

                                <Text style={[styles.forecastRange, { color: colors.subText }]}>
                                    H: {convertTemperature(day.maxTemp, unit)}°  L: {convertTemperature(day.minTemp, unit)}°
                                </Text>
                            </View>
                        ))}
                    </View>
                </>
            )}

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

    topRight: {
        alignItems: "flex-end",
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

    localTime: {
        fontSize: 18,
        fontWeight: fontWeight.medium,
        marginTop: 4,
        letterSpacing: 0.2,
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

    forecastRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    forecastDay: {
        flex: 1,
        alignItems: "center",
        gap: 4,
    },

    forecastDayName: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },

    forecastDescription: {
        fontSize: 10,
        textAlign: "center",
        textTransform: "capitalize",
    },

    forecastAvg: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        letterSpacing: -0.5,
    },

    forecastRange: {
        fontSize: 10,
        fontWeight: fontWeight.medium,
    },

    todayRange: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.medium,
        letterSpacing: 0.2,
        marginBottom: 16,
        marginTop: -8,
    },

});

export default WeatherCard;
