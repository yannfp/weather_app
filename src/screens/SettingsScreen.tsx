import React from 'react';
import { ActivityIndicator, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useTheme } from "../context/ThemeContext";
import { useSettings } from "../context/SettingsContext";

import { commonStyles } from "../styles/common";
import { spacing, fontSize, fontWeight, radius } from "../styles/spacing";

import { RootStackParamList } from "../types";

type SettingsScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, "Settings">;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {

    const { colors } = useTheme();
    const { unit, setUnit, loading } = useSettings();

    const isFahrenheit = unit == "fahrenheit";

    const handleToggle = async () => {
        await setUnit(isFahrenheit ? "celsius" : "fahrenheit");
    };

    return (
        <View style={[commonStyles.screenContainer, { backgroundColor: colors.background }]}>
            <View style={commonStyles.screenContent}>

                {/* Back Button */}
                <TouchableOpacity
                    onPress={() => navigation.goBack}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.backText, { color: colors.subText }]}>← Back</Text>
                </TouchableOpacity>

                {/* Title */}
                <View style={styles.titleArea}>
                    <Text style={styles.titleEmoji}>⚙️</Text>
                    <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
                </View>

                {/* Temperature unit card */}
                <View style={[commonStyles.card, { backgroundColor: colors.cardBackground }]}>
                    <Text style={[styles.sectionLabel, { color: colors.subText }]}>
                        Units
                    </Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingTitle, { color: colors.text }]}>
                                Temperature unit
                            </Text>
                            <Text style={[styles.settingSubtitle, { color: colors.subText }]}>
                                {isFahrenheit ? "Fahrenheit (°F)" : "Celsius (°C)"}
                            </Text>
                        </View>

                        {loading ? (
                            <ActivityIndicator color={colors.primary} />
                        ) : (
                            <Switch
                                value={isFahrenheit}
                                onValueChange={handleToggle}
                                trackColor={{ false: colors.accent, true: colors.primary }}
                                thumbColor="#FFFFFF"
                            />
                        )}
                    </View>

                    {/* Unit preview */}
                    <View style={[styles.preview, { backgroundColor: colors.background }]}>
                        <Text style={[styles.previewLabel, { color: colors.subText }]}>
                            Preview
                        </Text>
                        <Text style={[styles.previewTemp, { color: colors.primary }]}>
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