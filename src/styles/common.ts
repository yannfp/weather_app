import { StyleSheet } from "react-native";
import { spacing, radius, fontSize, fontWeight } from "./spacing";

// ─────────────────────────────────────────────
// Shared styles used in MORE THAN ONE component
// Component-specific styles stay in their own file
// ─────────────────────────────────────────────

export const commonStyles = StyleSheet.create({

  // ── CARDS ──────────────────────────────────
  // Used in: WeatherCard, CityInput, EmptyLocations, LoginScreen
  card: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 4,
    marginBottom: spacing.md,
  },

  // ── BUTTONS ────────────────────────────────
  // Used in: CityInput, LoginScreen, HomeScreen (add btn)
  button: {
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    alignItems: "center" as const,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.1,
  },
  buttonLoading: {
    opacity: 0.75,
  },
  buttonRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: spacing.sm,
  },

  // ── INPUTS ─────────────────────────────────
  // Used in: CityInput, LoginScreen
  input: {
    borderWidth: 1.5,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: fontSize.base,
    marginBottom: spacing.md,
    backgroundColor: "#F7F8FA",
  },
  inputLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
    marginBottom: spacing.sm,
  },

  // ── SCREEN LAYOUT ──────────────────────────
  // Used in: HomeScreen, AddLocationScreen, LoginScreen
  screenContainer: {
    flex: 1,
  },
  screenContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },

  // ── SECTION HEADER ─────────────────────────
  // Used in: HomeScreen (saved locations header)
  sectionHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.3,
  },

  // ── PILL BUTTON ────────────────────────────
  // Used in: HomeScreen add button, HomeHeader sign out button
  pillButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  pillButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },

  // ── EMPTY STATE ────────────────────────────
  // Used in: EmptyLocations
  emptyState: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center" as const,
    marginBottom: spacing.md,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    textAlign: "center" as const,
    lineHeight: 20,
  },

  // ── LOADING TEXT ───────────────────────────
  // Used in: HomeScreen, AddLocationScreen
  loadingText: {
    marginTop: 14,
    fontSize: fontSize.md,
  },
});
