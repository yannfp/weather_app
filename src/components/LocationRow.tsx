import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { SavedLocation, WeatherData, ThemeColors } from "../types";
import { getWeatherEmoji } from "../utils/weatherHelpers";

import { spacing, radius, fontSize, fontWeight } from "../styles/spacing";

type LocationRowContentProps = {
    location: SavedLocation;
    weather: WeatherData;
    themeColors: ThemeColors;

    isSelected: boolean;
    isCurrentLocation: boolean;

    onPress: () => void;
};

const LocationRowContent: React.FC<LocationRowContentProps> = ({ location, weather, themeColors, isSelected, isCurrentLocation, onPress }) => (

    <TouchableOpacity style={[styles.locationRow,
        {
            backgroundColor: themeColors.cardBackground,
            borderColor: isSelected ? themeColors.primary : "transparent",
            borderWidth: isSelected ? 1.5 : 0,
        },
    ]}
    onPress={onPress}
    activeOpacity={0.75}
    >
        <View style={styles.locationLeft}>
            <Text style={styles.locationEmoji}>
                {getWeatherEmoji(weather?.condition || "")}
            </Text>

            <View>
                <View style={styles.locationNameRow}>
                    <Text style={[styles.locationName, {color: themeColors.text}]}>
                        {location.city_name}
                    </Text>

                    {/* current location of the user*/}
                    {isCurrentLocation && (
                        <Text style={styles.currentTag}>📍</Text>
                    )}
                </View>

                <Text style={[styles.locationCondition, { color: themeColors.subText }]}>
                    {weather ? weather.description : "Loading..."}
                </Text>
            </View>
        </View>

        <Text style={[styles.locationTemp, { color: themeColors.primary }]}>
            {weather ? `${weather.temperature}°` : "-"}
        </Text>
    </TouchableOpacity>

);

type LocationRowProps = {
    location: SavedLocation;
    weather: WeatherData;
    themeColors: ThemeColors;

    isSelected: boolean;
    isCurrentLocation: boolean;

    onPress: () => void;
    onDelete: () => void;
};

const LocationRow: React.FC<LocationRowProps> = ({ location, weather, themeColors, isSelected, isCurrentLocation, onPress, onDelete}) => {

    // if the weather is the location of the user we don't want him to be able to delete it from its saved location
    if (isCurrentLocation) {
        return (
            <View>
                <LocationRowContent location={location} weather={weather} themeColors={themeColors} isSelected={isSelected} isCurrentLocation={isCurrentLocation} onPress={onPress}/>
            </View>
        );
    }

    // else it's a normal row so we wrap it inside a Swipeable Object so user can delete it
    return (
        <Swipeable
            renderRightActions={() => (
                <TouchableOpacity style={styles.deleteAction} onPress={onDelete}>
                    <Text style={styles.deleteActionText}>🗑</Text>
                    <Text style={styles.deleteActionLabel}>Remove</Text>
                </TouchableOpacity>
            )}
            overshootRight={false}
        >
            <LocationRowContent location={location} weather={weather} themeColors={themeColors} isSelected={isSelected} isCurrentLocation={isCurrentLocation} onPress={onPress}/>
        </Swipeable>
    );
};

const styles = StyleSheet.create({

    locationRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: radius.lg,
        padding: 18,
        marginBottom: spacing.sm,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },

    locationLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
    },

    locationEmoji: {
        fontSize: 28,
    },

    locationNameRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    locationName: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.semibold,
        letterSpacing: -0.2,
    },

    currentTag: {
        fontSize: fontSize.xs,
    },

    locationCondition: {
        fontSize: fontSize.sm,
        marginTop: 2,
        textTransform: "capitalize",
    },

    locationTemp: {
        fontSize: 28,
        fontWeight: fontWeight.bold,
        letterSpacing: -1,
    },

    deleteAction: {
        backgroundColor: "#FF3B30",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        borderRadius: radius.lg,
        marginBottom: spacing.sm,
        marginLeft: spacing.md,
    },

    deleteActionText: {
        fontSize: fontSize.xl,
    },

    deleteActionLabel: {
        color: "#FFFFFF",
        fontSize: fontSize.xs,
        fontWeight: fontWeight.semibold,
        marginTop: 2,
    },
});

export default LocationRow;