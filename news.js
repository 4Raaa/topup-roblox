export default async function handler(req, res) {
  try {
    const response = await fetch("https://rss.kompas.com/api/feed/social");
    const text = await response.text();

    // Convert XML → JSON manual simple
    const items = [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)];

    const data = items.map(item => {
      const content = item[1];

      const getTag = (tag) => {
        const match = content.match(new RegExp(`<${tag}>(.*?)<\/${tag}>`));
        return match ? match[1] : "";
      };

      return {
        title: getTag("title"),
        link: getTag("link"),
        pubDate: getTag("pubDate"),
        description: getTag("description"),
      };
    });

    res.status(200).json({
      status: true,
      total: data.length,
      data
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
}
