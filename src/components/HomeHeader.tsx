import React, { useState, useRef } from "react";
import { Modal, StyleSheet, View, TouchableOpacity, Text, TouchableWithoutFeedback } from "react-native";

import { ThemeColors } from "../types";

import { commonStyles } from "../styles/common";
import { spacing, radius, fontWeight, fontSize } from "../styles/spacing";

// define what information must be passed to this component
type HomeHeaderProps = {
    themeColors: ThemeColors;
    onSignOut: () => void;
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

const HomeHeader: React.FC<HomeHeaderProps> = ({ themeColors, onSignOut, onSettings }) => {

    const [isMenuVisible, setMenuVisible] = React.useState(false);

    const [buttonLayout, setButtonLayout] = React.useState({ x: 0, y: 0, width: 0, height: 0 });
    const buttonRef = useRef<View>(null);

    const openMenu = () => {
        // mesure the button position to show the menu just below it
        buttonRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
            setButtonLayout({ x, y, width , height })
            setMenuVisible(true);
        });
    };

    const closeMenu = () => {
        setMenuVisible(false);
    };

    const handleSettings = () => {
        closeMenu();
        onSettings();
    };

    const handleSignOut = () => {
        closeMenu();
        onSignOut();
    };

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

            <TouchableOpacity
                ref={buttonRef}
                onPress={openMenu}
                style={[styles.profileButton, { backgroundColor: themeColors.cardBackground }]}
                activeOpacity={0.8}
            >
                <Text style={styles.profileEmoji}>👤</Text>
            </TouchableOpacity>

            {/* Popup menu — rendered as a Modal so it floats above everything */}
            <Modal
                visible={isMenuVisible}
                transparent
                animationType="fade"
                onRequestClose={closeMenu}
            >
                {/* Tapping outside the menu closes it */}
                <TouchableWithoutFeedback onPress={closeMenu}>
                    <View style={styles.overlay}>

                        {/* The actual menu — positioned below the profile button */}
                        <TouchableWithoutFeedback>
                            <View
                                style={[
                                    styles.menu,
                                    {
                                        backgroundColor: themeColors.cardBackground,
                                        // anchor to the right edge of the screen, below the button
                                        top: buttonLayout.y + buttonLayout.height + spacing.sm,
                                        right: 20,
                                    },
                                ]}
                            >

                                {/* Settings option */}
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={handleSettings}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.menuItemEmoji}>⚙️</Text>
                                    <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                                        Settings
                                    </Text>
                                </TouchableOpacity>

                                {/* Divider */}
                                <View style={[styles.divider, { backgroundColor: themeColors.accent }]} />

                                {/* Sign out option */}
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={handleSignOut}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.menuItemEmoji}>🚪</Text>
                                    <Text style={[styles.menuItemText, { color: "#FF3B30" }]}>
                                        Sign out
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

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

    profileButton: {
        width: 42,
        height: 42,
        borderRadius: radius.full,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },

    profileEmoji: {
        fontSize: 18,
    },

    overlay: {
        flex: 1,
    },

    menu: {
        position: "absolute",
        width: 180,
        borderRadius: radius.lg,
        paddingVertical: spacing.sm,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 8,
    },

    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.md,
        paddingVertical: 12,
        gap: spacing.sm,
    },

    menuItemEmoji: {
        fontSize: 16,
    },

    menuItemText: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.medium,
    },

    divider: {
        height: 1,
        marginHorizontal: spacing.md,
    },
});

export default HomeHeader;