import React from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";

import { ThemeColors } from "../types";

import { CitySuggestion } from "../services/weatherService";

import { getCountryName } from "../utils/weatherHelpers";

import { commonStyles } from "../styles/common";
import { spacing, fontSize, fontWeight, radius } from "../styles/spacing";

type CityInputProps = {
    themeColors: ThemeColors;

    value: string;

    onChangeText: (value: string) => void;
    onSubmit: () => void;

    loading: boolean;

    errorMessage: string;

    suggestions: CitySuggestion[];
    onSelectSuggestion: (suggestion: CitySuggestion) => void;
};

const CityInput: React.FC<CityInputProps> = ({themeColors, value, onChangeText, onSubmit, loading, errorMessage, suggestions, onSelectSuggestion}) => {

    const [focused, setFocused] = React.useState(false);
    const showSuggestions = suggestions.length > 0 && focused;

    return (
        <View style={[commonStyles.card, { backgroundColor: themeColors.cardBackground }]}>

            <Text style={[commonStyles.inputLabel, { color: themeColors.subText}]}>City name</Text>

            <TextInput
                style={[
                    commonStyles.input,
                    {
                        color: themeColors.text,
                        borderColor: errorMessage ? "#FF3B30" : focused ? themeColors.primary : themeColors.accent,
                        borderBottomLeftRadius: showSuggestions ? 0 : undefined,
                        borderBottomRightRadius: showSuggestions ? 0 : undefined,
                        marginBottom: showSuggestions ? 0 : undefined,
                    },
                ]}

                placeholder="e.g. Tokyo, Paris, London"
                placeholderTextColor={themeColors.subText}

                value={value}

                onChangeText={onChangeText}

                autoFocus

                returnKeyType="done"

                onSubmitEditing={onSubmit}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                    // small delay so onSelectSuggestion fires before blur hides the list
                    setTimeout(() => setFocused(false), 150);
                }}
            />

            {/* Suggestions dropdown */}
            {showSuggestions && (
                <ScrollView
                    style={[styles.suggestionsContainer, { borderColor: themeColors.primary, backgroundColor: themeColors.cardBackground }]}
                    keyboardShouldPersistTaps="handled"  // ← important: lets taps on suggestions work while keyboard is open
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                >
                    {suggestions.map((suggestion, index) => (
                        <TouchableOpacity
                            key={`${suggestion.lat}-${suggestion.lon}`}
                            style={[
                                styles.suggestionRow,
                                index < suggestions.length - 1 && {
                                    borderBottomWidth: 1,
                                    borderBottomColor: themeColors.accent,
                                },
                            ]}
                            onPress={() => onSelectSuggestion(suggestion)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.suggestionCity, { color: themeColors.text }]}>
                                {suggestion.name}
                            </Text>
                            <Text style={[styles.suggestionDetail, { color: themeColors.subText }]}>
                                {suggestion.state ? `${suggestion.state}, ` : ""}
                                {getCountryName(suggestion.country)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* inline error */}
            { errorMessage != "" && (
                <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            )}

            {/* button to add location */}
            <TouchableOpacity
                style={[commonStyles.button, { backgroundColor: themeColors.primary === "#FFFFFF" ? "#333333" : themeColors.primary }, loading && commonStyles.buttonLoading ]}
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

    suggestionsContainer: {
        maxHeight: 220,
        borderWidth: 1.5,
        borderTopWidth: 0,
        borderBottomLeftRadius: radius.md,
        borderBottomRightRadius: radius.md,
        marginBottom: spacing.md,
        overflow: "hidden",
    },

    suggestionRow: {
        paddingHorizontal: spacing.md,
        paddingVertical: 12,
    },

    suggestionCity: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.semibold,
    },

    suggestionDetail: {
        fontSize: fontSize.sm,
        marginTop: 2,
    },

    errorText: {
        fontSize: fontSize.sm,
        color: "#FF3B30",
        fontWeight: "500",
        marginBottom: spacing.md,
        marginTop: -spacing.sm,
    },

    submitButton: {
        marginTop: spacing.md,
    }
});

export default CityInput;