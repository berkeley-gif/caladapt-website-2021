import { getHtml } from "./_get-html";

export async function get(req, res) {
  const { slug } = req.params;
  const toc = [];

  try {
    const { html, topics, topic } = await getHtml(slug);

    if (topic) {
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ html, topics, topic, toc }));
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

  } catch(error) {
    throw new Error(error.message);
  }


}
