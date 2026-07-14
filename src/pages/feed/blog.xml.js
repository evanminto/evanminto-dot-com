import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import rss from '@astrojs/rss';
import site from '../../data/site.json' assert { type: 'json' };

const parser = new MarkdownIt();

/**
 * @param {import('astro').APIContext} context
 */
export async function GET(context) {
  const entries = [...await getCollection('blog')].sort((e1, e2) => e1.data.date > e2.data.date ? -1 : 1);

  return rss({
    title: site.name,
    trailingSlash: false,
    description: site.description,
    site: context.site || '',
    items: entries.map(entry => ({
      title: entry.data.title,
      pubDate: entry.data.date,
      description: entry.data.description,
      link: `/blog/${entry.slug}`,
      guid: `${site.url}{entry}/blog/${entry.slug}`,
      content: sanitizeHtml(parser.render(entry.body)),
    })),
    customData: `<language>en-us</language>`,
  });
}
