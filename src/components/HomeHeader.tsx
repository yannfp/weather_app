import React from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemeColors } from "../types";

import { fontWeight, fontSize } from "../styles/spacing";

// define what information must be passed to this component
type HomeHeaderProps = {
    themeColors: ThemeColors;
    onSettings: () => void;
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

const HomeHeader: React.FC<HomeHeaderProps> = ({ themeColors, onSettings }) => {

    return (
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

            <Pressable onPress={onSettings} style={styles.iconButton}>
                <Ionicons name="settings-outline" size={24} color={themeColors.text} />
            </Pressable>

        </View>
    );
}

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

    iconButton: {
        width: 42,
        height: 42,
        justifyContent: "center",
        alignItems: "center",
    },

    icon: {
        fontSize: 24,
    },
});

export default HomeHeader;