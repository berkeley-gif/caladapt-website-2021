import { getting_started_topics } from "./_getting-started-topics";

export async function getHtml(slug) {
  const topic = getting_started_topics.find(d => d.slug === slug);
  const topics = [...getting_started_topics];  

  try {
    const data = await import(`content/get-started/${slug}.html`)
    return { html: data.default.render().html, topics, topic };
  } catch(error) {
    console.error(error);
  } 
}