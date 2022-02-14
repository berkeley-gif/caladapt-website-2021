jest.mock("mapbox-gl/dist/mapbox-gl", () => ({
  GeolocateControl: jest.fn(),
  Map: jest.fn(() => ({
    addControl: jest.fn(),
    on: jest.fn(),
    remove: jest.fn(),
    addSource: jest.fn(),
    removeSource: jest.fn(),
    addLayer: jest.fn(),
    removeLayer: jest.fn(),
  })),
  NavigationControl: jest.fn(),
}));
