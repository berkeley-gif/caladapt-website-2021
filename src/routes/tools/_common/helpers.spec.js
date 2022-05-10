jest.mock("../../../helpers/geocode");

import { setInitialLocation } from "./helpers";
import { DEFAULT_LOCATION } from "./constants";

describe("tools/_common/helpers", () => {
  test("setInitialLocation returns default location", () => {
    const expected = {
      location: DEFAULT_LOCATION,
      boundaryType: "locagrid",
    };
    return expect(setInitialLocation()).resolves.toEqual(expected);
  });

  test("setInitialLocation using lng lat", () => {
    const [lng, lat] = [-122.09, 37.78];
    const expected = {
      location: {
        bbox: [0, 0, 0, 0],
        center: [0, 0],
        geometry: {},
        properties: {},
        id: 1234,
        title: "LOCA Grid Cell",
      },
      boundaryType: "locagrid",
    };
    return expect(setInitialLocation(lng, lat, "locagrid")).resolves.toEqual(
      expected
    );
  });

  test("setInitialLocation using featureId and boundary", () => {
    const featureId = 1;
    const expected = {
      location: {
        bbox: [0, 0, 0, 0],
        center: [0, 0],
        geometry: {},
        properties: {},
        id: featureId,
        title: "New place name",
      },
      boundaryType: "counties",
    };
    return expect(
      setInitialLocation(null, null, "counties", 1)
    ).resolves.toEqual(expected);
  });
});
