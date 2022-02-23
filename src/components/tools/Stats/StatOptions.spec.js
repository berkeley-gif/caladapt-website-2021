/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";
import StatOptions from "./StatOptions.svelte";

describe("Stats/StatOptions", () => {
  // where to render the component
  let target;

  // component props
  let groupList;
  let periodList;
  let group;
  let period;
  let dateRange;
  let open;

  beforeEach(() => {
    target = document.body.appendChild(document.createElement("slot"));
    groupList = [
      {
        id: "modeled-projections",
        label: "Future Projections",
        historical: false,
      },
    ];
    periodList = [
      {
        id: "mid-century",
        historical: false,
        label: "Mid-Century (2035-2064)",
        start: 2035,
        end: 2064,
      },
      {
        id: "end-century",
        historical: false,
        label: "End-Century (2070-2099)",
        start: 2070,
        end: 2099,
      },
    ];
    group = {
      id: "modeled-projections",
      label: "Future Projections",
      historical: false,
    };
    period = {
      id: "end-century",
      historical: false,
      label: "End-Century (2070-2099)",
      start: 2070,
      end: 2099,
    };
    dateRange = [2006, 2100];
    open = false;
  });

  test("should render", async () => {
    const result = render(StatOptions, {
      target,
      props: {
        groupList,
        periodList,
        group,
        period,
        dateRange,
        open,
      },
    });
    expect(() => result).not.toThrow();
  });

  test("groupList prop", async () => {
    const { getByRole, component } = render(StatOptions, {
      target,
      props: {
        groupList,
        periodList,
        group,
        period,
        dateRange,
        open,
      },
    });
    await component.$set({
      groupList: [...groupList, { id: "new-period", label: "Foo" }],
    });
    expect(() => getByRole("radio", { name: "Foo" })).not.toThrow();
  });

  test("periodList prop", async () => {
    const { getByRole, component } = render(StatOptions, {
      target,
      props: {
        groupList,
        periodList,
        group,
        period,
        dateRange,
        open,
      },
    });
    await component.$set({
      groupList: [...periodList, { id: "new-period", label: "Foo" }],
    });
    expect(() => getByRole("radio", { name: "Foo" })).not.toThrow();
  });

  test("group prop", () => {
    const { getByRole } = render(StatOptions, {
      target,
      props: {
        groupList,
        periodList,
        group,
        period,
        dateRange,
        open,
      },
    });
    expect(() =>
      getByRole("radio", { checked: true, name: "Future Projections" })
    ).not.toThrow();
  });

  test("period prop", () => {
    const { getByRole } = render(StatOptions, {
      target,
      props: {
        groupList,
        periodList,
        group,
        period,
        dateRange,
        open,
      },
    });
    expect(() =>
      getByRole("radio", { checked: true, name: "End-Century (2070-2099)" })
    ).not.toThrow();
  });

  test("dateRange prop", () => {
    const { getByDisplayValue } = render(StatOptions, {
      target,
      props: {
        groupList,
        periodList,
        group,
        period: { id: "custom", start: 2050, end: 2080 },
        dateRange,
        open,
      },
    });
    expect(
      () => getByDisplayValue("2050") && getByDisplayValue("2080")
    ).not.toThrow();
  });

  test("open prop", () => {
    const { getByRole } = render(StatOptions, {
      target,
      props: {
        groupList,
        periodList,
        group,
        period,
        dateRange,
        open: false,
      },
    });
    const modal = getByRole("dialog");
    const parent = modal.parentElement;
    const isVisible = parent.classList.contains("is-visible");
    expect(isVisible).toEqual(false);
  });
});
