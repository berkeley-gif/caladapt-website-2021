import fs from 'fs';
import path from 'path';
import frontMatter from 'front-matter';
import marked from 'marked';
import { timeParse, timeFormat } from 'd3-time-format';

const dateParse = timeParse('%Y-%m-%d');
const dateFormat = timeFormat('%B %d, %Y');

export default function get_posts() {
  return fs
    .readdirSync('content/blog')
    .filter(file => path.extname(file) === '.md')
    .map(file => {
      const match = /^(\d+-\d+-\d+)-(.+)\.md$/.exec(file);
      if (!match) throw new Error(`Invalid filename '${file}'`);

      const [, pubdate, slug] = match;

      const markdown = fs.readFileSync(`content/blog/${file}`, 'utf-8');

      const { attributes, body } = frontMatter(markdown);
      attributes.pubdate = dateParse(pubdate);
      attributes.datestring = dateFormat(attributes.pubdate);
      attributes.tags = attributes.tags.split(',').map(d => d.trim());
      const html = marked(body).replace(/^\t{3}/gm, '');

      return {
        html,
        metadata: attributes,
        slug,
      };
    })
    .sort((a, b) => a.metadata.pubdate < b.metadata.pubdate ? 1 : -1);
}