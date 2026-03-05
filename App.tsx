import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import AppNavigator from "./src/navigation/AppNavigator";

// app is wrapped in providers so all child components can access:
// - AuthProvider: who is logged in
// - ThemeProvider: current weather theme colors

export default function App() {
  return (
      <AuthProvider>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </AuthProvider>
  );
}