import fs from "fs";
import path from "path";
import frontMatter from "front-matter";
import marked from "marked";
import { utcParse, utcFormat } from "d3-time-format";

export function get_events() {
  return fs
    .readdirSync("content/events")
    .filter((file) => path.extname(file) === ".md")
    .map((file) => {
      const match = /^(\d+-\d+-\d+)-(.+)\.md$/.exec(file);
      if (!match) throw new Error(`Invalid filename '${file}'`);

      const [, pubdate, slug] = match;

      const markdown = fs.readFileSync(`content/events/${file}`, "utf-8");

      const { attributes, body } = frontMatter(markdown);
      // Date published
      attributes.pubdate = utcParse("%Y-%m-%d")(pubdate);
      // Date of event
      attributes.eventdate = attributes.date;
      attributes.eventdatestring = utcFormat("%B %d, %Y")(attributes.eventdate);
      attributes.tags = attributes.tags.split(",").map((d) => d.trim());
      const html = marked(body).replace(/^\t{3}/gm, "");

      return {
        html,
        metadata: attributes,
        slug,
      };
    })
    .sort((a, b) => (a.metadata.eventdate < b.metadata.eventdate ? 1 : -1));
}
