import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import HomeHeader from "../src/components/HomeHeader";
import { fixedColors } from "../src/styles/color";

jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null,
}));

describe("HomeHeader", () => {

  it("renders without crashing", () => {
    expect(() =>
      render(<HomeHeader themeColors={fixedColors} onSettings={jest.fn()} />)
    ).not.toThrow();
  });

  it("renders the Weather title", () => {
    const { getByText } = render(
      <HomeHeader themeColors={fixedColors} onSettings={jest.fn()} />
    );
    expect(getByText("Weather")).toBeTruthy();
  });

  it("renders a greeting based on time of day", () => {
    const { getByText } = render(
      <HomeHeader themeColors={fixedColors} onSettings={jest.fn()} />
    );
    // textTransform: uppercase is CSS-only — the raw text in the DOM is lowercase
    const greeting = getByText(/Good (morning|afternoon|evening)/i);
    expect(greeting).toBeTruthy();
  });

  it("shows 'Good morning' between midnight and noon", () => {
    jest.spyOn(Date.prototype, "getHours").mockReturnValue(9);
    const { getByText } = render(
      <HomeHeader themeColors={fixedColors} onSettings={jest.fn()} />
    );
    // textTransform in styles doesn't change the actual text value in tests
    expect(getByText(/good morning/i)).toBeTruthy();
    jest.restoreAllMocks();
  });

  it("shows 'Good afternoon' between noon and 6pm", () => {
    jest.spyOn(Date.prototype, "getHours").mockReturnValue(14);
    const { getByText } = render(
      <HomeHeader themeColors={fixedColors} onSettings={jest.fn()} />
    );
    expect(getByText(/good afternoon/i)).toBeTruthy();
    jest.restoreAllMocks();
  });

  it("shows 'Good evening' after 6pm", () => {
    jest.spyOn(Date.prototype, "getHours").mockReturnValue(20);
    const { getByText } = render(
      <HomeHeader themeColors={fixedColors} onSettings={jest.fn()} />
    );
    expect(getByText(/good evening/i)).toBeTruthy();
    jest.restoreAllMocks();
  });

  it("calls onSettings when settings button is pressed", () => {
    const onSettings = jest.fn();
    const { getByTestId } = render(
        <HomeHeader themeColors={fixedColors} onSettings={onSettings} />
    );
    fireEvent.press(getByTestId("settings-button"));
    expect(onSettings).toHaveBeenCalledTimes(1);
  });
});
