jest.mock("../../../helpers/geocode");

import { setInitialLocation } from "./helpers";
import { DEFAULT_LOCATION } from "./constants";

describe("tools/_common/helpers", () => {
  test("setInitialLocation default location", () => {
    return expect(setInitialLocation()).resolves.toEqual(DEFAULT_LOCATION);
  });

  test("setInitialLocation using lng lat", () => {
    const [lng, lat] = [-122.09, 37.78];
    const expected = {
      bbox: [0, 0, 0, 0],
      center: [0, 0],
      geometry: {},
      properties: {},
      id: 1234,
      title: "New place name",
    };
    return expect(setInitialLocation(lng, lat, "locagrid")).resolves.toEqual(
      expected
    );
  });

  test("setInitialLocation using featureId and boundary", () => {
    const featureId = 1;
    const expected = {
      bbox: [0, 0, 0, 0],
      center: [0, 0],
      geometry: {},
      properties: {},
      id: featureId,
      title: "New place name",
    };
    return expect(
      setInitialLocation(null, null, "counties", 1)
    ).resolves.toEqual(expected);
  });
});
