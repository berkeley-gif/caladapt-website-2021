import categories from "../_categories";
import { getting_started_topics } from "./_getting-started-topics";

export function get(req, res) {
  const json = {
    toc: categories,
    topics: getting_started_topics
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(json));
}
