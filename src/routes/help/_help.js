import fs from "fs";
import path from "path";
import frontMatter from "front-matter";
import marked from "marked";
import { timeParse } from "d3-time-format";
import categories from "./_categories";
import { getting_started_topics } from "./_getting-started-topics";

const dateParse = timeParse("%Y-%m-%d");

function sortByOrder(a, b) {
  return a.metadata.order - b.metadata.order;
}

function sortByDate(a, b) {
  // Dates will be cast to numbers automagically:
  return b.metadata.date - a.metadata.date;
}

function processmd(file, dir) {
  let slug = path.basename(file).split(".md")[0];
  const markdown = fs.readFileSync(`${dir}/${file}`, "utf-8");
  const { attributes, body } = frontMatter(markdown);

  if (attributes.tags) {
    attributes.tags = attributes.tags.split(",").map((d) => d.trim());
  }

  if (attributes.date) {
    attributes.date = dateParse(attributes.date);
  }

  return {
    slug,
    metadata: { ...attributes },
    html: marked(body).replace(/^\t{3}/gm, ""),
  };
}

export default function get_data(slug) {
  const category = categories.find((d) => d.slug === slug);
  if (!category) return { toc: categories, data: null };
  const dir = `content/${category.dir}`;
  const items = fs
    .readdirSync(dir)
    .filter((file) => path.extname(file) === ".md")
    .map((file) => processmd(file, dir));

  // Sort get-started articles by order
  if (category.slug === "get-started") {
    const sortedItems = items.sort(sortByOrder);
    return { toc: categories, data: sortedItems };
  }

  // Sort vidoes by dates
  if (category.slug === "tutorials") {
    const sortedItems = items.sort(sortByDate);
    return { toc: categories, data: sortedItems };
  }

  return { toc: categories, data: items };
}

export function fetchGetStartedData(slug) {
  return {
    activeTopic: getting_started_topics.find((d) => d.slug === slug),
    allTopics: getting_started_topics,
  };
}
