import React from "react";
import { render } from "@testing-library/react-native";

import WeatherCard from "../src/components/WeatherCard";
import { fixedColors } from "../src/styles/color";
import { ForecastDay } from "../src/types";

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

const defaultProps = {
  cityName: "Tokyo",
  country: "JP",
  temperature: 22,
  tempMin: 15,
  tempMax: 28,
  condition: "Clear",
  description: "clear sky",
  humidity: 55,
  windSpeed: 4.2,
  feelsLike: 21,
  timezone: 32400,
  forecast: [],
  colors: fixedColors,
};

const mockForecast: ForecastDay[] = [
  { date: "Mon", avgTemp: 20, minTemp: 14, maxTemp: 26, condition: "Clouds", description: "scattered clouds" },
  { date: "Tue", avgTemp: 18, minTemp: 12, maxTemp: 24, condition: "Rain",   description: "light rain" },
  { date: "Wed", avgTemp: 23, minTemp: 16, maxTemp: 29, condition: "Clear",  description: "clear sky" },
];

describe("WeatherCard", () => {

  it("renders without crashing", () => {
    expect(() => render(<WeatherCard {...defaultProps} />)).not.toThrow();
  });

  it("renders the city name", () => {
    const { getByText } = render(<WeatherCard {...defaultProps} />);
    expect(getByText("Tokyo")).toBeTruthy();
  });

  it("renders the full country name", () => {
    const { getByText } = render(<WeatherCard {...defaultProps} />);
    expect(getByText("Japan")).toBeTruthy();
  });

  it("renders the temperature in celsius", () => {
    const { getByText } = render(<WeatherCard {...defaultProps} />);
    expect(getByText("22°C")).toBeTruthy();
  });

  it("renders the weather description", () => {
    const { getByText } = render(<WeatherCard {...defaultProps} />);
    expect(getByText("clear sky")).toBeTruthy();
  });

  it("renders humidity stat", () => {
    const { getByText } = render(<WeatherCard {...defaultProps} />);
    expect(getByText("55%")).toBeTruthy();
    expect(getByText("Humidity")).toBeTruthy();
  });

  it("renders wind speed stat", () => {
    const { getByText } = render(<WeatherCard {...defaultProps} />);
    expect(getByText("4.2 m/s")).toBeTruthy();
    expect(getByText("Wind")).toBeTruthy();
  });

  it("renders feels like stat", () => {
    const { getByText } = render(<WeatherCard {...defaultProps} />);
    expect(getByText("21°")).toBeTruthy();
    expect(getByText("Feels like")).toBeTruthy();
  });

  it("renders local time using timezone offset", () => {
    const { getByText } = render(<WeatherCard {...defaultProps} />);
    expect(getByText("21:00")).toBeTruthy();
  });

  it("does not render forecast section when forecast is empty", () => {
    const { queryByText } = render(<WeatherCard {...defaultProps} forecast={[]} />);
    expect(queryByText("Mon")).toBeNull();
  });

  it("renders forecast day names when forecast is provided", () => {
    const { getByText } = render(
      <WeatherCard {...defaultProps} forecast={mockForecast} />
    );
    // textTransform uppercase is CSS-only — raw text value is lowercase
    expect(getByText("Mon")).toBeTruthy();
    expect(getByText("Tue")).toBeTruthy();
    expect(getByText("Wed")).toBeTruthy();
  });

  it("renders forecast descriptions", () => {
    const { getByText } = render(
      <WeatherCard {...defaultProps} forecast={mockForecast} />
    );
    expect(getByText("scattered clouds")).toBeTruthy();
    expect(getByText("light rain")).toBeTruthy();
  });
});
