import { readFileSync } from "fs";
import { resolve } from "path";
import frontMatter from "front-matter";

export function get(_req, res) {
  try {
    const file = "about.md";
    const dir = "content/tools/slr-coastal-inundation/";
    const path = resolve(process.cwd(), dir, file);
    const data = readFileSync(path, "utf-8");
    const { body } = frontMatter(data);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(body);
  } catch (error) {
    console.error(error);
    res.writeHead(404, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: `Not found`,
      })
    );
  }
}
