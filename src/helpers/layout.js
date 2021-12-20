/**
 * hasWideLayout
 * @param {String} slug the slug portion of a URL
 * @returns {Boolean} whether or not to use a full 16 column bx-grid layout
 */
export function hasWideLayout(slug) {
  const TOP_LEVEL_WIDE_LAYOUTS = ["tools", "blog"];
  const SUB_LEVEL_WIDE_LAYOUTS = ["help", "tools"];
  const SUB_LEVEL_NARROW_LAYOUTS = ["blog"];
  const homepage = /^\/$/;
  const mainPage = /^\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/i;
  const subPage = /^\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*/i;

  let isWideLayout = false;

  if (homepage.exec(slug)) {
    isWideLayout = true;
  } else if (
    mainPage.exec(slug) &&
    TOP_LEVEL_WIDE_LAYOUTS.includes(slug.replace(/\//g, ""))
  ) {
    isWideLayout = true;
  } else if (subPage.exec(slug)) {
    if (SUB_LEVEL_WIDE_LAYOUTS.includes(slug.split("/")[1])) {
      isWideLayout = true;
    }
    if (SUB_LEVEL_NARROW_LAYOUTS.includes(slug.split("/")[1])) {
      isWideLayout = false;
    }
  } else {
    isWideLayout = false;
  }

  return isWideLayout;
}
