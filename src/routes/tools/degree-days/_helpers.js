import { MONTHS_LIST } from "~/routes/tools/_common/constants";

export const getSelectedMonthStrings = (monthIdsArr) => {
  const idSet = new Set(monthIdsArr);
  if (idSet.size) {
    return MONTHS_LIST.filter(({ id }) => idSet.has(id)).map(
      ({ text }) => text
    );
  }
};
