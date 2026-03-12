import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from "react-native";
import { BlurView } from "expo-blur";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";

import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";

import { commonStyles } from "../styles/common";
import {fixedColors, nightColors} from "../styles/color";
import { spacing, fontSize, fontWeight, radius } from "../styles/spacing";

import { RootStackParamList } from "../types";
import {useBackground} from "../context/BackgroundContext";

type SettingsScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, "Settings">;
};

const SettingsScreen: React.FC<SettingsScreenProps> = () => {

    const headerHeight = useHeaderHeight();

    const { backgroundImage, isNight } = useBackground();
    const activeColors = isNight ? nightColors : fixedColors;

    const { unit, setUnit, timeFormat, setTimeFormat } = useSettings();
    const { signOut } = useAuth();

    return (
        <ImageBackground source={{ uri: backgroundImage }} style={{ flex: 1 }} resizeMode="cover">
            <BlurView intensity={isNight ? 60 : 10} tint={isNight ? "dark" : "light"} style={StyleSheet.absoluteFill} />

            <View style={[commonStyles.screenContainer, { paddingTop: headerHeight, backgroundColor: "transparent" }]}>
                <View style={commonStyles.screenContent}>

                    {/* Title */}
                    <View style={styles.titleArea}>
                        <Text style={[styles.title, { color: activeColors.text }]}>Settings</Text>
                    </View>

                    {/* Temperature unit card */}
                    <View style={[commonStyles.card, { backgroundColor: activeColors.cardBackground }]}>

                        <Text style={[styles.sectionLabel, { color: activeColors.subText }]}>
                            Temperature unit
                        </Text>

                        {/* Side-by-side unit buttons */}
                        <View style={styles.unitRow}>

                            <TouchableOpacity
                                style={[
                                    styles.unitButton,
                                    unit === "celsius" && styles.unitButtonActive,
                                ]}
                                onPress={() => setUnit("celsius")}
                                activeOpacity={0.8}
                            >
                                <Text style={[
                                    styles.unitButtonText,
                                    unit === "celsius" && styles.unitButtonTextActive,
                                ]}>
                                    °C
                                </Text>
                                <Text style={[
                                    styles.unitButtonLabel,
                                    unit === "celsius" && styles.unitButtonTextActive,
                                ]}>
                                    Celsius
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.unitButton,
                                    unit === "fahrenheit" && styles.unitButtonActive,
                                ]}
                                onPress={() => setUnit("fahrenheit")}
                                activeOpacity={0.8}
                            >
                                <Text style={[
                                    styles.unitButtonText,
                                    unit === "fahrenheit" && styles.unitButtonTextActive,
                                ]}>
                                    °F
                                </Text>
                                <Text style={[
                                    styles.unitButtonLabel,
                                    unit === "fahrenheit" && styles.unitButtonTextActive,
                                ]}>
                                    Fahrenheit
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Time Format Card */}
                    <View style={[commonStyles.card, { backgroundColor: activeColors.cardBackground }]}>
                        <Text style={[styles.sectionLabel, { color: activeColors.subText }]}>
                            Time format
                        </Text>

                        <View style={styles.unitRow}>
                            <TouchableOpacity
                                style={[styles.unitButton, timeFormat === "12h" && styles.unitButtonActive]}
                                onPress={() => setTimeFormat("12h")}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.unitButtonText, timeFormat === "12h" && styles.unitButtonTextActive]}>
                                    12h
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.unitButton, timeFormat === "24h" && styles.unitButtonActive]}
                                onPress={() => setTimeFormat("24h")}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.unitButtonText, timeFormat === "24h" && styles.unitButtonTextActive]}>
                                    24h
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.signOutButton]}
                        onPress={signOut}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.signOutText}>Sign out</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({

    titleArea: {
        marginBottom: spacing.xl,
    },

    title: {
        fontSize: fontSize.title,
        fontWeight: fontWeight.bold,
        letterSpacing: -0.8,
    },

    sectionLabel: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.semibold,
        letterSpacing: 0.5,
        textTransform: "uppercase",
        marginBottom: spacing.md,
    },

    unitRow: {
        flexDirection: "row",
        gap: spacing.sm,
    },

    unitButton: {
        flex: 1,
        alignItems: "center",
        paddingVertical: spacing.md,
        borderRadius: radius.lg,
        borderWidth: 1.5,
        borderColor: fixedColors.accent,
        backgroundColor: fixedColors.background,
    },

    unitButtonActive: {
        backgroundColor: fixedColors.text,
        borderColor: fixedColors.text,
    },

    unitButtonText: {
        fontSize: 28,
        fontWeight: fontWeight.bold,
        color: fixedColors.subText,
        letterSpacing: -1,
    },

    unitButtonTextActive: {
        color: "#FFFFFF",
    },

    unitButtonLabel: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: fixedColors.subText,
        marginTop: 2,
    },

    signOutButton: {
        marginTop: "auto",
        paddingVertical: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: "#FF3B30",
        alignItems: "center",
    },

    signOutText: {
        color: "#FFFFFF",
        fontWeight: fontWeight.semibold,
        fontSize: fontSize.md,
    },
});

export default SettingsScreen;