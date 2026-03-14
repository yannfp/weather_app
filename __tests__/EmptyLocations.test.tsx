import React from "react";
import { render } from "@testing-library/react-native";

import EmptyLocations from "../src/components/EmptyLocations";
import { fixedColors } from "../src/styles/color";

describe("EmptyLocations", () => {

  it("renders without crashing", () => {
    expect(() =>
      render(<EmptyLocations themeColors={fixedColors} />)
    ).not.toThrow();
  });

  it("renders the title", () => {
    const { getByText } = render(<EmptyLocations themeColors={fixedColors} />);
    expect(getByText("No locations yet")).toBeTruthy();
  });

  it("renders the hint text", () => {
    const { getByText } = render(<EmptyLocations themeColors={fixedColors} />);
    expect(getByText('Tap "+ Add" to save cities for quick access')).toBeTruthy();
  });

  it("renders the pin emoji", () => {
    const { getByText } = render(<EmptyLocations themeColors={fixedColors} />);
    expect(getByText("📍")).toBeTruthy();
  });
});
