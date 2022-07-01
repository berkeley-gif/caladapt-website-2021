/**
 * hasWideLayout
 * @param {String} path the path portion of a URL that corresponds to the current page
 * @returns {Boolean} whether or not to use a full 16 column bx-grid layout
 */
export function hasWideLayout(path) {
  const TOP_LEVEL_WIDE_LAYOUTS = ["tools", "blog"];
  const SUB_LEVEL_WIDE_LAYOUTS = ["help", "tools"];
  const SUB_LEVEL_NARROW_LAYOUTS = ["blog", "events"];
  const homepage = /^\/$/;
  const newHomePage = /^\/homepage-redesign-preview\/$/;
  const mainPage = /^\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/i;
  const subPage = /^\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*/i;

  let isWideLayout = false;

  if (homepage.test(path) || newHomePage.test(path)) {
    isWideLayout = true;
  } else if (
    mainPage.test(path) &&
    TOP_LEVEL_WIDE_LAYOUTS.includes(path.replace(/\//g, ""))
  ) {
    isWideLayout = true;
  } else if (subPage.test(path)) {
    if (SUB_LEVEL_WIDE_LAYOUTS.includes(path.split("/")[1])) {
      isWideLayout = true;
    }
    if (SUB_LEVEL_NARROW_LAYOUTS.includes(path.split("/")[1])) {
      isWideLayout = false;
    }
  } else {
    isWideLayout = false;
  }

  return isWideLayout;
}
