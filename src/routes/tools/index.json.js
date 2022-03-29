import { tools, categories } from "../../../content/tools/data";

let json;

export function get(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  if (!json || process.env.NODE_ENV !== "production") {
    json = JSON.stringify({
      tools,
      categories,
    });
  }

  res.end(json);
}
