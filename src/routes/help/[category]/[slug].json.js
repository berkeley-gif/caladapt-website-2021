import get_data, { fetchGetStartedData } from "../_help.js";

export function get(req, res) {
  const { category, slug } = req.params;
  const { toc, data } = get_data(category);
  const getStartedData = fetchGetStartedData(slug);

  let item;
  data.forEach((d) => {
    if (d.slug === slug) {
      item = d;
    }
  });

  if (item) {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ item, toc, getStartedData }));
  } else {
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
