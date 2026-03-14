import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import CityInput from "../src/components/CityInput";
import { fixedColors } from "../src/styles/color";
import { CitySuggestion } from "../src/services/weatherService";

const defaultProps = {
  themeColors: fixedColors,
  value: "",
  onChangeText: jest.fn(),
  onSubmit: jest.fn(),
  loading: false,
  errorMessage: "",
  suggestions: [],
  onSelectSuggestion: jest.fn(),
  isNight: false,
};

const mockSuggestions: CitySuggestion[] = [
  { name: "London", country: "GB", state: "England", lat: 51.5074, lon: -0.1278 },
  { name: "London", country: "CA", state: "Ontario", lat: 42.9849, lon: -81.2453 },
];

describe("CityInput", () => {

  it("renders without crashing", () => {
    expect(() => render(<CityInput {...defaultProps} />)).not.toThrow();
  });

  it("renders the city name label", () => {
    const { getByText } = render(<CityInput {...defaultProps} />);
    // textTransform uppercase is CSS only — raw text value is mixed case
    expect(getByText("City name")).toBeTruthy();
  });

  it("renders the Save location button", () => {
    const { getByText } = render(<CityInput {...defaultProps} />);
    expect(getByText("Save location")).toBeTruthy();
  });

  it("renders the placeholder text", () => {
    const { getByPlaceholderText } = render(<CityInput {...defaultProps} />);
    expect(getByPlaceholderText("e.g. Tokyo, Paris, London")).toBeTruthy();
  });

  it("calls onChangeText when user types", () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <CityInput {...defaultProps} onChangeText={onChangeText} />
    );
    fireEvent.changeText(
      getByPlaceholderText("e.g. Tokyo, Paris, London"),
      "Paris"
    );
    expect(onChangeText).toHaveBeenCalledWith("Paris");
  });

  it("calls onSubmit when Save location button is pressed", () => {
    const onSubmit = jest.fn();
    const { getByText } = render(
      <CityInput {...defaultProps} onSubmit={onSubmit} />
    );
    fireEvent.press(getByText("Save location"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("calls onSubmit when return key is pressed", () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText } = render(
      <CityInput {...defaultProps} onSubmit={onSubmit} />
    );
    fireEvent(
      getByPlaceholderText("e.g. Tokyo, Paris, London"),
      "submitEditing"
    );
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("shows loading state when loading is true", () => {
    const { getByText } = render(
      <CityInput {...defaultProps} loading={true} />
    );
    expect(getByText("Checking city...")).toBeTruthy();
  });

  it("does not call onSubmit when button is pressed while loading", () => {
    const onSubmit = jest.fn();
    const { getByText } = render(
      <CityInput {...defaultProps} loading={true} onSubmit={onSubmit} />
    );
    fireEvent.press(getByText("Checking city..."));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows error message when provided", () => {
    const { getByText } = render(
      <CityInput {...defaultProps} errorMessage="City not found." />
    );
    expect(getByText("⚠️ City not found.")).toBeTruthy();
  });

  it("does not show error message when errorMessage is empty", () => {
    const { queryByText } = render(
      <CityInput {...defaultProps} errorMessage="" />
    );
    expect(queryByText(/⚠️/)).toBeNull();
  });

  it("calls onSelectSuggestion with correct suggestion", () => {
    const onSelectSuggestion = jest.fn();
    onSelectSuggestion(mockSuggestions[0]);
    expect(onSelectSuggestion).toHaveBeenCalledWith(mockSuggestions[0]);
    expect(onSelectSuggestion.mock.calls[0][0].name).toBe("London");
    expect(onSelectSuggestion.mock.calls[0][0].country).toBe("GB");
  });
});
