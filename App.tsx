import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./src/context/AuthContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import AppNavigator from "./src/navigation/AppNavigator";
import {SettingsProvider} from "./src/context/SettingsContext";
import {BackgroundProvider} from "./src/context/BackgroundContext";

// app is wrapped in providers so all child components can access:
// - AuthProvider: who is logged in
// - ThemeProvider: current weather theme colors

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BackgroundProvider>
                <AuthProvider>
                    <ThemeProvider>
                        <SettingsProvider>
                            <AppNavigator/>
                        </SettingsProvider>
                    </ThemeProvider>
                </AuthProvider>
            </BackgroundProvider>
        </GestureHandlerRootView>
    );
}