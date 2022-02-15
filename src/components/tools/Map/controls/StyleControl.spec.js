/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/svelte";
import StyleControl from "./StyleControl.svelte";

describe("Map/controls/StyleControl", () => {
  let target;

  beforeEach(() => {
    target = document.body.appendChild(document.createElement("slot"));
  });

  test("should render", async () => {
    const result = render(StyleControl);
    expect(result).toBeTruthy();
  });

  test("titleText prop", async () => {
    const { getByText, component } = render(StyleControl, {
      target,
    });
    await component.$set({ titleText: "Select a Style" });
    expect(() => getByText("Select a Style")).not.toThrow();
  });

  test("styles prop", async () => {
    const styles = [
      { label: "Light", id: "light-v10" },
      { label: "Dark", id: "dark-v10" },
    ];
    const { queryAllByRole, component } = render(StyleControl, { target });
    await component.$set({ styles });
    const result = queryAllByRole("radio");
    expect(result).toHaveLength(2);
  });

  test("selected prop", async () => {
    const { getByLabelText, component } = render(StyleControl, { target });
    await component.$set({ selected: "dark-v10" });
    const result = getByLabelText("Dark").checked;
    expect(result).toBe(true);
  });

  test("change event", () => {
    const { getByLabelText, component } = render(StyleControl, {
      target,
    });
    const mock = jest.fn();
    const radioBtn = getByLabelText("Satellite");
    component.$on("change", (event) => mock(event.detail));
    fireEvent.click(radioBtn);
    expect(mock).toHaveBeenCalledWith("satellite-v9");
  });
});
