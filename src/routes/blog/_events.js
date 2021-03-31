import fs from 'fs';
import path from 'path';
import frontMatter from 'front-matter';
import marked from 'marked';
import { timeParse, timeFormat } from 'd3-time-format';

export default function get_events() {
  return fs
    .readdirSync('content/events')
    .filter(file => path.extname(file) === '.md')
    .map(file => {
      const match = /^(\d+-\d+-\d+)-(.+)\.md$/.exec(file);
      if (!match) throw new Error(`Invalid filename '${file}'`);

      const [, pubdate, slug] = match;

      const markdown = fs.readFileSync(`content/events/${file}`, 'utf-8');

      const { attributes, body } = frontMatter(markdown);
      // Date published
      attributes.pubdate = timeParse('%Y-%m-%d')(pubdate);
      // Date of event
      attributes.eventdate = new Date(attributes.date);
      attributes.eventdatestring = timeFormat('%B %d, %Y')(attributes.eventdate);
      attributes.month = timeFormat('%b')(attributes.eventdate);
      attributes.dayName = timeFormat('%A')(attributes.eventdate);
      attributes.dayNumber = attributes.eventdate.getDate();
      attributes.year = attributes.eventdate.getFullYear();
      const html = marked(body).replace(/^\t{3}/gm, '');

      return {
        html,
        metadata: attributes,
        slug,
      };
    })
    .sort((a, b) => a.metadata.eventdate < b.metadata.eventdate ? 1 : -1);
}