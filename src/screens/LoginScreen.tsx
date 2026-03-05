import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { RootStackParamsList } from "../types";

type LoginScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamsList, "Login">;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {

    // init the fields of the screen to empty at the start
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const { signIn, signUp } = useAuth();

    const handleSubmit = async () => {

        // basic validation about the email and password
        if (!email.trim() || !password.trim()) {
            Alert.alert("Error", "Please enter your email and password");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {

            // if the user is signing up call the function to do so
            if (isSignUp) {
                await signUp(email.trim(), password);
                Alert.alert("Success!", "Account created. You can now log in.");
                setSignUp(false);
            } else {
                await signIn(email.trim(), password);
            }
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // avoids the keyboard to hide inputs on IOS
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.inner}>

                {/* Header */}
                <Text style={styles.emoji}>🌤️</Text>
                <Text style={styles.title}>WeatherApp</Text>
                <Text style={styles.subtitle}>{isSignUp ? "Create an account" : "Welcome back"}</Text>

                {/* Email Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor="#999"

                    value={email}

                    onChangeText={setEmail}

                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                {/* Password Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"

                    value={password}

                    onChangeText={setPassword}

                    // hides password when typing
                    secureTextEntry={true}
                />

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>
                            {isSignUp ? "Create account" : "Sign In"}
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Toggle between Login and Register */}
                <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                    <Text style={styles.toggleText}>
                        {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign Up"}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#EBF5FB" },

    inner: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 30,
    },

    emoji: { fontSize: 64, textAlign: "center", marginBottom: 0 },

    title: {
        fontSize: 36,
        fontWeight: "bold",
        textAlign: "center",
        color: "#2C3E50",
        marginBottom: 4
    },

    subtitle: {
        fontSize: 16,
        textAlign: "center",
        color: "#7F8C8D",
        marginBottom: 40,
    },

    input: {
        backgroundColor: "#3498DB",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginBottom: 16,
    },

    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

    toggleText: {
        textAlign: "center",
        color: "#3498DB",
        fontSize: 14,
    },
});

export default LoginScreen;