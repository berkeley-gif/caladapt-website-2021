import get_data from '../_help.js';

export function get(req, res) {
  const { category, slug } = req.params;
  const { toc, data } = get_data(category);
  let item;

  data.forEach((d) => {
    if (d.slug === slug) {
      item = d;
    }
  });

  if (item) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({ item, toc }));
  } else {
    res.writeHead(404, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
      message: `Not found`
    }));
  }
}
