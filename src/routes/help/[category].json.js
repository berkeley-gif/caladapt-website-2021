import get_data from './_help.js';

let json;

export function get(req, res) {
  const { category } = req.params;
  const { toc, data } = get_data(category);

  if (data) {
    json = JSON.stringify({ toc, data });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(json);
  } else {
    res.writeHead(404, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
      message: `Not found`
    }));
  }
}