// This module is reserved for helpers that run in an index.json.js file
// Trying to import NodeJS standard library modules like "fs" will throw an error
// in other modules that also export code that's used clientside

import { readFileSync } from "fs";
import { resolve } from "path";
import marked from "marked";

/**
 * getToolContent
 * @param {string} slug - the tool's slug, e.g. "extreme-heat"
 * @param {string} basename - the filename to load, e.g. "about"
 * @param {string} ext - the file's extension, defaults to "md"
 * @returns {string} - markdown
 */
export function getToolContent(slug, basename, ext = "md") {
  const file = `${basename}.${ext}`;
  const dir = `content/tools/${slug}/`;
  const path = resolve(process.cwd(), dir, file);
  const data = readFileSync(path, "utf-8");
  if (ext === "md") {
    return marked(data);
  }
  return data;
}
