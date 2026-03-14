import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import LocationRow from "../src/components/LocationRow";
import { fixedColors } from "../src/styles/color";
import { SavedLocation, WeatherData } from "../src/types";

// Swipeable mock must also render renderRightActions so the Remove button appears
jest.mock("react-native-gesture-handler", () => {
  const { View, TouchableOpacity, Text } = require("react-native");
  return {
    Swipeable: ({ children, renderRightActions }: any) => (
      <View>
        {children}
        {renderRightActions && renderRightActions()}
      </View>
    ),
    GestureHandlerRootView: ({ children }: any) => <View>{children}</View>,
  };
});

jest.mock("../src/context/SettingsContext", () => ({
  useSettings: () => ({
    unit: "celsius",
    timeFormat: "24h",
  }),
}));

beforeEach(() => {
  jest.spyOn(Date, "now").mockReturnValue(new Date("2024-01-01T12:00:00Z").getTime());
});

afterEach(() => {
  jest.restoreAllMocks();
});

const mockLocation: SavedLocation = {
  id: "1",
  user_id: "user-1",
  city_name: "London",
  country_code: "GB",
  lat: 51.5074,
  lon: -0.1278,
  created_at: "2024-01-01T00:00:00Z",
};

const mockWeather: WeatherData = {
  cityName: "London",
  country: "GB",
  temperature: 12,
  tempMin: 8,
  tempMax: 16,
  feelsLike: 10,
  humidity: 72,
  pressure: 1010,
  condition: "Clouds",
  description: "overcast clouds",
  windSpeed: 5.1,
  icon: "04d",
  latitude: 51.5074,
  longitude: -0.1278,
  timezone: 0,
  sunrise: 1700000000,
  sunset: 1700040000,
};

const defaultProps = {
  location: mockLocation,
  weather: mockWeather,
  themeColors: fixedColors,
  isSelected: false,
  isCurrentLocation: false,
  onPress: jest.fn(),
  onDelete: jest.fn(),
};

describe("LocationRow", () => {

  it("renders without crashing", () => {
    expect(() => render(<LocationRow {...defaultProps} />)).not.toThrow();
  });

  it("renders the city name", () => {
    const { getByText } = render(<LocationRow {...defaultProps} />);
    expect(getByText("London")).toBeTruthy();
  });

  it("renders the weather description", () => {
    const { getByText } = render(<LocationRow {...defaultProps} />);
    expect(getByText("overcast clouds")).toBeTruthy();
  });

  it("renders the temperature", () => {
    const { getByText } = render(<LocationRow {...defaultProps} />);
    expect(getByText("12°C")).toBeTruthy();
  });

  it("renders the local time", () => {
    const { getByText } = render(<LocationRow {...defaultProps} />);
    expect(getByText("12:00")).toBeTruthy();
  });

  it("shows Loading... when weather is undefined", () => {
    const { getByText } = render(
      <LocationRow {...defaultProps} weather={undefined} />
    );
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("shows Current Location badge when isCurrentLocation is true", () => {
    const { getByText } = render(
      <LocationRow {...defaultProps} isCurrentLocation={true} />
    );
    expect(getByText("Current Location")).toBeTruthy();
  });

  it("does not show Current Location badge for regular locations", () => {
    const { queryByText } = render(
      <LocationRow {...defaultProps} isCurrentLocation={false} />
    );
    expect(queryByText("Current Location")).toBeNull();
  });

  it("calls onPress when the row is tapped", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <LocationRow {...defaultProps} onPress={onPress} />
    );
    fireEvent.press(getByText("London"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not show Remove button for current location", () => {
    const { queryByText } = render(
      <LocationRow {...defaultProps} isCurrentLocation={true} />
    );
    expect(queryByText("Remove")).toBeNull();
  });

  it("calls onDelete when Remove is pressed for non-current location", () => {
    const onDelete = jest.fn();
    const { getByText } = render(
      <LocationRow {...defaultProps} isCurrentLocation={false} onDelete={onDelete} />
    );
    fireEvent.press(getByText("Remove"));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
