import get_events from './_events.js';

let json;

export function get(req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  if (!json || process.env.NODE_ENV !== 'production') {
    const events = get_events()
      .filter(post => !post.metadata.draft)
      .map(post => {
        return {
          slug: post.slug,
          metadata: post.metadata,
        };
      });
    json = JSON.stringify(events);
  }

  res.end(json);
}