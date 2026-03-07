import React from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { ThemeColors } from "../types";

import { commonStyles } from "../styles/common";
import { spacing, fontSize } from "../styles/spacing";

type CityInputProps = {
    themeColors: ThemeColors;

    value: string;

    onChangeText: (value: string) => void;
    onSubmit: () => void;

    loading: boolean;

    errorMessage: string;
};

const CityInput: React.FC<CityInputProps> = ({themeColors, value, onChangeText, onSubmit, loading, errorMessage}) => {

    const [focused, setFocused] = React.useState(false);

    return (

        <View style={[commonStyles.card, { backgroundColor: themeColors.cardBackground }]}>

            <Text style={[commonStyles.inputLabel, { color: themeColors.subText}]}>City name</Text>

            <TextInput
                style={[commonStyles.input, { color: themeColors.text, borderColor: errorMessage ? "#FF3B30" : focused ? themeColors.primary : themeColors.accent }]}
                placeholder={"e.g. Tokyo, Paris, London"}
                placeholderTextColor={themeColors.subText}

                value={value}
                onChangeText={onChangeText}

                autoFocus

                returnKeyType="done"

                onSubmitEditing={onSubmit}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />

            {/* inline error */}
            { errorMessage != "" && (
                <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            )}

            {/* button to add location */}
            <TouchableOpacity
                style={[commonStyles.button, { backgroundColor: themeColors.primary}, loading && commonStyles.buttonLoading]}
                onPress={onSubmit}
                disabled={loading}
                activeOpacity={0.85}
            >

                { loading ? (
                    <View style={commonStyles.buttonRow}>
                        <ActivityIndicator color="#FFFFFF" size="small"/>
                        <Text style={commonStyles.buttonText}>Checking city...</Text>
                    </View>
                ) : (
                    <Text style={commonStyles.buttonText}>Save location</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    errorText: {
        fontSize: fontSize.sm,
        color: "#FF3B30",
        fontWeight: "500",
        marginBottom: spacing.md,
        marginTop: -spacing.sm,
    },
});

export default CityInput;