import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../types";

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Too short", "Password must be at least 6 characters.");
      return;
    }
    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUp(email.trim(), password);
        Alert.alert("Account created", "You can now sign in.");
        setIsSignUp(false);
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>

        {/* Top brand area */}
        <View style={styles.brandArea}>
          <View style={styles.iconWrapper}>
            <Text style={styles.iconEmoji}>🌤</Text>
          </View>
          <Text style={styles.appName}>Skies</Text>
          <Text style={styles.tagline}>Weather, beautifully simple.</Text>
        </View>

        {/* Form card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {isSignUp ? "Create account" : "Welcome back"}
          </Text>

          {/* Email */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "email" && styles.inputFocused,
              ]}
              placeholder="you@example.com"
              placeholderTextColor="#B0B8C4"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Password */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "password" && styles.inputFocused,
              ]}
              placeholder="Min. 6 characters"
              placeholderTextColor="#B0B8C4"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Submit button */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonLoading]}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>
                {isSignUp ? "Create Account" : "Sign In"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Toggle auth mode */}
        <TouchableOpacity
          onPress={() => setIsSignUp(!isSignUp)}
          style={styles.toggleWrapper}
        >
          <Text style={styles.toggleText}>
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <Text style={styles.toggleAction}>
              {isSignUp ? "Sign in" : "Sign up"}
            </Text>
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 32,
  },

  // Brand
  brandArea: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  iconEmoji: {
    fontSize: 36,
  },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1A202C",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 15,
    color: "#718096",
    letterSpacing: 0.1,
  },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 5,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A202C",
    marginBottom: 24,
    letterSpacing: -0.3,
  },

  // Fields
  fieldWrapper: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A5568",
    marginBottom: 8,
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#F7F8FA",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1A202C",
    borderWidth: 1.5,
    borderColor: "#EDF2F7",
  },
  inputFocused: {
    borderColor: "#2D3748",
    backgroundColor: "#FFFFFF",
  },

  // Button
  button: {
    backgroundColor: "#1A202C",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonLoading: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },

  // Toggle
  toggleWrapper: {
    alignItems: "center",
    paddingVertical: 8,
  },
  toggleText: {
    fontSize: 14,
    color: "#718096",
  },
  toggleAction: {
    color: "#1A202C",
    fontWeight: "600",
  },
});

export default LoginScreen;
