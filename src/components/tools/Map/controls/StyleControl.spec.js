/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";
import StyleControl from "./StyleControl.svelte";

describe("Map/controls/StyleControl", () => {
  const styles = [
    { label: "Light", id: "light-v10" },
    { label: "Dark", id: "dark-v10" },
    { label: "Satellite", id: "satellite-v9" },
    { label: "Satellite with Streets", id: "satellite-streets-v11" },
  ];

  test("should render", async () => {
    const target = document.body.appendChild(document.createElement("slot"));
    const { getByText, component } = render(StyleControl, {
      target,
      props: {
        titleText: "Select Map Style",
        styles,
        selected: "dark-v10",
      },
    });
    await component.$set({ titleText: "Select a Style" });
    expect(() => getByText("Select a Style")).not.toThrow();
  });
});
