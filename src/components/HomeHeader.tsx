import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

import { ThemeColors } from "../types";

import { commonStyles } from "../styles/common";
import { fontWeight, fontSize } from "../styles/spacing";

// define what information must be passed to this component
type HomeHeaderProps = {
    themeColors: ThemeColors;
    onSignOut: () => void;
};

// indicates the current state of the day (morning, afternoon, evening) depending on the hour
function getTimeOfDay(): string {

    const hours = new Date().getHours();

    if ( hours < 12 ) {
        return "morning";
    }
    else if ( hours < 18 ) {
        return "afternoon";
    }

    return "evening";
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ themeColors, onSignOut }) => (
    <View style={styles.header}>
       <View>
           {/* display the greeting with the corresponding word depending on the hour */}
           <Text style={[styles.greeting, {color: themeColors.subText}]}>
               Good {getTimeOfDay()}
           </Text>

            <Text style={[styles.headerTitle, {color: themeColors.text}]}>
                Weather
            </Text>
       </View>

        {/* define the sign-out button for the user */}
       <TouchableOpacity
           onPress={onSignOut}
           style={[commonStyles.pillButton, { borderColor: themeColors.accent, borderWidth: 1.5 }]}
       >
           <Text style={[commonStyles.pillButtonText, { color: themeColors.subText }]}>
               Sign out
           </Text>
       </TouchableOpacity>

    </View>
);

const styles = StyleSheet.create({

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 28,
    },

    greeting: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.medium,
        letterSpacing: 0.3,
        textTransform: "uppercase",
        marginBottom: 2,
    },

    headerTitle: {
        fontSize: fontSize.hero,
        fontWeight: fontWeight.bold,
        letterSpacing: -1,
    },
});

export default HomeHeader;