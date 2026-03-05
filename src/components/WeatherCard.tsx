import React from "react";
import { StyleSheet, Text, View } from "react-native";

type WeatherCardProps = {
    cityName: string;
    country: string;
    temperature: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
};

const WeatherCard: React.FC<WeatherCardProps> = ({
                                                     cityName, country, temperature, description, humidity, windSpeed
                                                 }) => (
    <View style={styles.card} testID="weather-card">
        <Text style={styles.city} testID="city-name">{cityName}, {country}</Text>
        <Text style={styles.temp} testID="temperature">{temperature}°C</Text>
        <Text style={styles.desc} testID="description">{description}</Text>
        <Text testID="humidity">{humidity}%</Text>
        <Text testID="wind">{windSpeed} m/s</Text>
    </View>
);

const styles = StyleSheet.create({
    card: { padding: 20, borderRadius: 12, backgroundColor: "#fff", margin: 10 },
    city: { fontSize: 20, fontWeight: "bold" },
    temp: { fontSize: 48, fontWeight: "bold", color: "#3498DB" },
    desc: { fontSize: 16, color: "#7F8C8D", textTransform: "capitalize" },
});

export default WeatherCard;