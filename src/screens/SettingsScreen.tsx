import React from 'react';
import { ActivityIndicator, StyleSheet, Switch, Text, View } from "react-native";
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

    const { unit, setUnit, loading } = useSettings();

    const isFahrenheit = unit == "fahrenheit";

    const handleToggle = async () => {
        await setUnit(isFahrenheit ? "celsius" : "fahrenheit");
    };

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
                        Units
                    </Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingTitle, { color: fixedColors.text }]}>
                                Temperature unit
                            </Text>
                            <Text style={[styles.settingSubtitle, { color: fixedColors.subText }]}>
                                {isFahrenheit ? "Fahrenheit (°F)" : "Celsius (°C)"}
                            </Text>
                        </View>

                        {loading ? (
                            <ActivityIndicator color={fixedColors.primary} />
                        ) : (
                            <Switch
                                value={isFahrenheit}
                                onValueChange={handleToggle}
                                trackColor={{ false: fixedColors.accent, true: fixedColors.primary }}
                                thumbColor="#FFFFFF"
                            />
                        )}
                    </View>

                    {/* Unit preview */}
                    <View style={[styles.preview, { backgroundColor: fixedColors.background }]}>
                        <Text style={[styles.previewLabel, { color: fixedColors.subText }]}>
                            Preview
                        </Text>
                        <Text style={[styles.previewTemp, { color: fixedColors.primary }]}>
                            {isFahrenheit ? "72°F" : "22°C"}
                        </Text>
                    </View>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    backButton: {
        marginBottom: spacing.xl,
    },

    backText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.medium,
    },

    titleArea: {
        marginBottom: spacing.xl,
    },

    titleEmoji: {
        fontSize: 36,
        marginBottom: spacing.md,
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

    settingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.md,
    },

    settingInfo: {
        flex: 1,
    },

    settingTitle: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.semibold,
        marginBottom: 2,
    },

    settingSubtitle: {
        fontSize: fontSize.sm,
    },

    preview: {
        borderRadius: radius.md,
        padding: spacing.md,
        alignItems: "center",
    },

    previewLabel: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.semibold,
        letterSpacing: 0.5,
        textTransform: "uppercase",
        marginBottom: spacing.xs,
    },

    previewTemp: {
        fontSize: 48,
        fontWeight: fontWeight.bold,
        letterSpacing: -2,
    },
});

export default SettingsScreen;