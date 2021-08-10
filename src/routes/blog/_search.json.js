import get_posts from "./_posts.js";

const posts = get_posts().map((post) => {
  return {
    slug: post.slug,
    metadata: post.metadata,
  };
});

function getSearchResults(posts, terms) {
  if (posts && terms) {
    return posts.filter((p) => postMatchesTerms(p, terms));
  }
  return [];
}

function postMatchesTerms(post, terms) {
  const text = `${post.metadata.title} ${post.html}`.toLowerCase();
  for (const term of terms) {
    if (text.indexOf(term) === -1) {
      return false;
    }
  }
  return true;
}

export function get(req, res, next) {
  const { q } = req.query;
  console.log("blog search json", q);

  const searchTerms = q.split("+");
  const results = getSearchResults(posts, searchTerms);

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(results));
}
