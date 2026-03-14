import {
  getThemeFromWeather,
  getBackgroundImage,
  isNightTime,
  getLocalTime,
  getCountryName,
  convertTemperature,
} from "../src/utils/weatherHelpers";

// ─────────────────────────────────────────────
// getThemeFromWeather
// ─────────────────────────────────────────────
describe("getThemeFromWeather", () => {

  it("returns 'stormy' for thunderstorm conditions", () => {
    expect(getThemeFromWeather("Thunderstorm")).toBe("stormy");
    expect(getThemeFromWeather("storm")).toBe("stormy");
  });

  it("returns 'rainy' for rain and drizzle conditions", () => {
    expect(getThemeFromWeather("Rain")).toBe("rainy");
    expect(getThemeFromWeather("Drizzle")).toBe("rainy");
    expect(getThemeFromWeather("light rain")).toBe("rainy");
  });

  it("returns 'snowy' for snow conditions", () => {
    expect(getThemeFromWeather("Snow")).toBe("snowy");
    expect(getThemeFromWeather("Sleet")).toBe("snowy");
    expect(getThemeFromWeather("Blizzard")).toBe("snowy");
  });

  it("returns 'foggy' for fog and mist conditions", () => {
    expect(getThemeFromWeather("Fog")).toBe("foggy");
    expect(getThemeFromWeather("Mist")).toBe("foggy");
    expect(getThemeFromWeather("Haze")).toBe("foggy");
  });

  it("returns 'cloudy' for cloud conditions", () => {
    expect(getThemeFromWeather("Clouds")).toBe("cloudy");
    expect(getThemeFromWeather("Broken Clouds")).toBe("cloudy");
    expect(getThemeFromWeather("scattered clouds")).toBe("cloudy");
  });

  it("returns 'sunny' for clear and sunny conditions", () => {
    expect(getThemeFromWeather("Clear")).toBe("sunny");
    expect(getThemeFromWeather("Sunny")).toBe("sunny");
    expect(getThemeFromWeather("clear sky")).toBe("sunny");
  });

  it("returns 'default' for unknown conditions", () => {
    expect(getThemeFromWeather("")).toBe("default");
    expect(getThemeFromWeather("unknown")).toBe("default");
    expect(getThemeFromWeather("windy")).toBe("default");
  });

  it("is case insensitive", () => {
    expect(getThemeFromWeather("RAIN")).toBe("rainy");
    expect(getThemeFromWeather("SNOW")).toBe("snowy");
    expect(getThemeFromWeather("CLEAR")).toBe("sunny");
  });
});

// ─────────────────────────────────────────────
// getBackgroundImage
// ─────────────────────────────────────────────
describe("getBackgroundImage", () => {

  it("returns a valid URL string for any condition", () => {
    const url = getBackgroundImage("Clear");
    expect(typeof url).toBe("string");
    expect(url.startsWith("https://")).toBe(true);
  });

  it("returns different images for different conditions", () => {
    const sunnyUrl = getBackgroundImage("Clear");
    const rainyUrl = getBackgroundImage("Rain");
    const snowyUrl = getBackgroundImage("Snow");
    expect(sunnyUrl).not.toBe(rainyUrl);
    expect(rainyUrl).not.toBe(snowyUrl);
  });

  it("returns the default image for unknown conditions", () => {
    const defaultUrl = getBackgroundImage("default");
    const unknownUrl = getBackgroundImage("unknown condition xyz");
    expect(defaultUrl).toBe(unknownUrl);
  });
});

// ─────────────────────────────────────────────
// isNightTime
// ─────────────────────────────────────────────
describe("isNightTime", () => {

  it("returns false during the day", () => {
    const now = Math.floor(Date.now() / 1000);
    // sunrise was 2 hours ago, sunset is in 6 hours
    const sunrise = now - 2 * 3600;
    const sunset = now + 6 * 3600;
    expect(isNightTime(sunrise, sunset)).toBe(false);
  });

  it("returns true before sunrise", () => {
    const now = Math.floor(Date.now() / 1000);
    // sunrise is in 2 hours, sunset is in 10 hours
    const sunrise = now + 2 * 3600;
    const sunset = now + 10 * 3600;
    expect(isNightTime(sunrise, sunset)).toBe(true);
  });

  it("returns true after sunset", () => {
    const now = Math.floor(Date.now() / 1000);
    // sunrise was 10 hours ago, sunset was 2 hours ago
    const sunrise = now - 10 * 3600;
    const sunset = now - 2 * 3600;
    expect(isNightTime(sunrise, sunset)).toBe(true);
  });
});

// ─────────────────────────────────────────────
// getLocalTime
// ─────────────────────────────────────────────
describe("getLocalTime", () => {

  it("returns time in 24h format correctly", () => {
    // fix Date.now to a known UTC time: 14:30 UTC
    const fixedUtc = new Date("2024-01-01T14:30:00Z").getTime();
    jest.spyOn(Date, "now").mockReturnValue(fixedUtc);

    // timezone = 0 (UTC)
    expect(getLocalTime(0, "24h")).toBe("14:30");

    // timezone = +3600 (UTC+1)
    expect(getLocalTime(3600, "24h")).toBe("15:30");

    // timezone = -18000 (UTC-5)
    expect(getLocalTime(-18000, "24h")).toBe("09:30");

    jest.restoreAllMocks();
  });

  it("returns time in 12h format correctly", () => {
    const fixedUtc = new Date("2024-01-01T14:30:00Z").getTime();
    jest.spyOn(Date, "now").mockReturnValue(fixedUtc);

    // 14:30 UTC → 2:30 PM
    expect(getLocalTime(0, "12h")).toBe("2:30 PM");

    // 14:30 UTC + 1h = 15:30 → 3:30 PM
    expect(getLocalTime(3600, "12h")).toBe("3:30 PM");

    jest.restoreAllMocks();
  });

  it("handles midnight correctly in 12h format", () => {
    const fixedUtc = new Date("2024-01-01T00:00:00Z").getTime();
    jest.spyOn(Date, "now").mockReturnValue(fixedUtc);

    expect(getLocalTime(0, "12h")).toBe("12:00 AM");

    jest.restoreAllMocks();
  });

  it("handles noon correctly in 12h format", () => {
    const fixedUtc = new Date("2024-01-01T12:00:00Z").getTime();
    jest.spyOn(Date, "now").mockReturnValue(fixedUtc);

    expect(getLocalTime(0, "12h")).toBe("12:00 PM");

    jest.restoreAllMocks();
  });

  it("pads minutes with leading zero", () => {
    const fixedUtc = new Date("2024-01-01T09:05:00Z").getTime();
    jest.spyOn(Date, "now").mockReturnValue(fixedUtc);

    expect(getLocalTime(0, "24h")).toBe("09:05");
    expect(getLocalTime(0, "12h")).toBe("9:05 AM");

    jest.restoreAllMocks();
  });
});

// ─────────────────────────────────────────────
// getCountryName
// ─────────────────────────────────────────────
describe("getCountryName", () => {

  it("returns full country name for known codes", () => {
    expect(getCountryName("FR")).toBe("France");
    expect(getCountryName("US")).toBe("United States");
    expect(getCountryName("GB")).toBe("United Kingdom");
    expect(getCountryName("JP")).toBe("Japan");
  });

  it("is case insensitive", () => {
    expect(getCountryName("fr")).toBe("France");
    expect(getCountryName("us")).toBe("United States");
  });

  it("returns the code as fallback for unknown codes", () => {
    expect(getCountryName("XX")).toBe("XX");
  });
});

// ─────────────────────────────────────────────
// convertTemperature
// ─────────────────────────────────────────────
describe("convertTemperature", () => {

  it("returns celsius rounded when unit is celsius", () => {
    expect(convertTemperature(20, "celsius")).toBe(20);
    expect(convertTemperature(20.6, "celsius")).toBe(21);
    expect(convertTemperature(-5.4, "celsius")).toBe(-5);
  });

  it("converts celsius to fahrenheit correctly", () => {
    expect(convertTemperature(0, "fahrenheit")).toBe(32);
    expect(convertTemperature(100, "fahrenheit")).toBe(212);
    expect(convertTemperature(-40, "fahrenheit")).toBe(-40);
    expect(convertTemperature(20, "fahrenheit")).toBe(68);
  });

  it("rounds fahrenheit to nearest integer", () => {
    // 21°C = 69.8°F → rounds to 70
    expect(convertTemperature(21, "fahrenheit")).toBe(70);
  });

  it("handles negative temperatures", () => {
    expect(convertTemperature(-10, "celsius")).toBe(-10);
    expect(convertTemperature(-10, "fahrenheit")).toBe(14);
  });
});
