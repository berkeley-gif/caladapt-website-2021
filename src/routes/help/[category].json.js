import get_data from './_help.js';

let json;

export function get(req, res) {

  const { category } = req.params;

  if (!json || process.env.NODE_ENV !== 'production') {
    const data = get_data();
    // Check if category exists
    const isCategory = data.find(d => d.slug === category);

    if (isCategory) {
      const toc = data.map(({ slug, title, text, items }) => {
        const headings = items.map(d => {
          return {
            title: d.metadata.title,
            slug: d.slug,
          }
        });
        return { slug, title, text, headings };
      });
      json = JSON.stringify({ toc, data });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(json);
    } else {
      json = JSON.stringify({ message: `Not found` });
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(json);
    }
  }
}