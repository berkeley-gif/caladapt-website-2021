import categories from "./_categories.js";

let json;

export function get(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  if (!json || process.env.NODE_ENV !== "production") {
    // const categories = get_data().map(({ slug, title, text }) => {
    //   return { slug, title, text };
    // });
    json = JSON.stringify(categories);
  }

  res.end(json);
}
