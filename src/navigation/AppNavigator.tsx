import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import AddLocationScreen from "../screens/AddLocationScreen";
import { RootStackParamsList } from "../types";

// Create the stack navigator with our TypeScript types
const Stack = createNativeStackNavigator<RootStackParamsList>();

const AppNavigator: React.FC = () => {

    const { user, loading } = useAuth();
    const { colors } = useTheme();

    // show loading spinner while checking auth state
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    // style the navigation header to match our theme
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.text,
                    headerShadowVisible: false,
                }}
            >
                {user ? (
                    // user is logged in — show app screens
                    <>
                        <Stack.Screen
                            name="Home"
                            component={HomeScreen}
                            options={{ headerShown: false }} // we have our own header in HomeScreen
                        />
                        <Stack.Screen
                            name="AddLocation"
                            component={AddLocationScreen}
                            options={{ title: "Add Location" }}
                        />
                    </>
                ) : (
                    // user NOT logged in — show login screen
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;