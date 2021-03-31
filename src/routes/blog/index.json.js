import get_posts from './_posts.js';

let json;

export function get(req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  if (!json || process.env.NODE_ENV !== 'production') {
    const posts = get_posts()
      .filter(post => !post.metadata.draft)
      .map(post => {
        return {
          slug: post.slug,
          metadata: post.metadata,
        };
      });
    json = JSON.stringify(posts);
  }

  res.end(json);
}