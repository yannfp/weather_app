import React from "react";
import { Text, View } from "react-native";

import { ThemeColors } from "../types";

import { commonStyles } from "../styles/common";

type EmptyLocationsProps = {
    themeColors: ThemeColors;
};

// what to display if the user has no locations saved
const EmptyLocations: React.FC<EmptyLocationsProps> = ({themeColors}) => (

    <View style={[commonStyles.emptyState, { backgroundColor: themeColors.background }]}>
        <Text style={commonStyles.emptyEmoji}>📍</Text>
        <Text style={[commonStyles.emptyTitle, { color: themeColors.text }]}>No locations yet</Text>
        <Text style={[commonStyles.emptySubtitle, { color: themeColors.subText }]}>Tap "+ Add" to save cities for quick access</Text>
    </View>
);

export default EmptyLocations;