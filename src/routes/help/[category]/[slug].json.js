import get_data from '../_help.js';

const data = get_data();

export function get(req, res, next) {
  const { category, slug } = req.params;
  let item;

  const toc = data.map(({ slug, title, text, items }) => {
    const headings = items.map(d => {
      return {
        title: d.metadata.title,
        slug: d.slug,
      }
    });
    return { slug, title, text, headings };
  });

  data.forEach((d) => {
    if (d.slug === category) {
      const match = d.items.find((opt) => opt.slug === slug);
      if (match) {
        item = match;
      }
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
