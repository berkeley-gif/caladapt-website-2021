import fs from 'fs';
import path from 'path';
import frontMatter from 'front-matter';
import marked from 'marked';
import { timeParse } from 'd3-time-format';

const dateParse = timeParse('%Y-%m-%d');

function sortByOrder(a, b) {
  return a.metadata.order - b.metadata.order;
}

function sortByDate(a, b) {
  // Dates will be cast to numbers automagically:
  return b.metadata.date - a.metadata.date;
}

function processmd(file, dir) {
  let slug = path.basename(file).split('.md')[0];
  if (dir === 'get-started') {
    // strip numbers from start of filename in get-started dir
    // the files are numbered just to help in seeing the order in folder view
    slug = slug.replace(/^\d+-/, '');
  }
  const markdown = fs.readFileSync(`${dir}/${file}`, 'utf-8');
  const { attributes, body } = frontMatter(markdown);

  if (attributes.tags) {
    attributes.tags = attributes.tags.split(',').map(d => d.trim());
  }

  if (attributes.date) {
    attributes.date = dateParse(attributes.date);
  }

  const html = marked(body).replace(/^\t{3}/gm, '');

  return {
    slug,
    metadata: {...attributes },
    html,
  };
}

const categories = [
  {
    slug: 'get-started',
    title: 'Get Started',
    text: 'Learn how to get started with Cal-Adapt',
    dir: 'get-started',
  },
  {
    slug: 'tutorials',
    title: 'Tutorials & Webinars',
    text: 'Tutorials and webinars on how to use Cal-Adapt',
    dir: 'tutorials',
  },
  {
    slug: 'faqs',
    title: 'FAQs',
    text: 'Frequently asked questions about tools and data on Cal-Adapt',
    dir: 'faqs',
  },
  {
    slug: 'glossary',
    title: 'Glossary',
    text: `A list of frequently used terms throughout Cal-Adapt.`,
    dir: 'glossary',
  },
];

export default function get_data() {
  const data = categories.map((d) => {
    const dir = `content/${d.dir}`;
    const items = fs
      .readdirSync(dir)
      .filter(file => path.extname(file) === '.md')
      .map(file => processmd(file, dir));

    // Sort get-started articles by order
    if (d.slug === 'get-started') {
      const sortedItems = items.sort(sortByOrder);
      return { ...d, items:sortedItems };
    }

    // Sort vidoes by dates
    if (d.slug === 'tutorials') {
      const sortedItems = items.sort(sortByDate);
      return { ...d, items:sortedItems };
    }

    return { ...d, items };
  });

  return data;
}
