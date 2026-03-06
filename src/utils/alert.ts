import { Alert } from "react-native";

export function showAlert(title: string, message: string) {
    if (typeof window !== "undefined" && window.alert) {
        window.alert(`${title}\n\n${message}`);
    } else {
        Alert.alert(title, message);
    }
}