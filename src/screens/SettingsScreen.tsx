import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useSettings } from "../context/SettingsContext";

import { commonStyles } from "../styles/common";
import { fixedColors } from "../styles/color";
import { spacing, fontSize, fontWeight, radius } from "../styles/spacing";

import { RootStackParamList } from "../types";

type SettingsScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, "Settings">;
};

const SettingsScreen: React.FC<SettingsScreenProps> = () => {

    const { unit, setUnit, timeFormat, setTimeFormat } = useSettings();

    return (
        <View style={[commonStyles.screenContainer, { backgroundColor: fixedColors.background }]}>
            <View style={commonStyles.screenContent}>

                {/* Title */}
                <View style={styles.titleArea}>
                    <Text style={[styles.title, { color: fixedColors.text }]}>Settings</Text>
                </View>

                {/* Temperature unit card */}
                <View style={[commonStyles.card, { backgroundColor: fixedColors.cardBackground }]}>

                    <Text style={[styles.sectionLabel, { color: fixedColors.subText }]}>
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
                <View style={[commonStyles.card, { backgroundColor: fixedColors.cardBackground }]}>
                    <Text style={[styles.sectionLabel, { color: fixedColors.subText }]}>
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

            </View>
        </View>
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
});

export default SettingsScreen;