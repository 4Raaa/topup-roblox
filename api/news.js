export default async function handler(req, res) {
  try {
    const q = req.query.q || "indonesia";

    const url = `https://search.kompas.com/search?q=${encodeURIComponent(q)}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await response.text();

    // Ambil data dari HTML
    const results = [...html.matchAll(/<a href="(https:\/\/[^"]+)"[^>]*>(.*?)<\/a>/g)];

    const data = results
      .map(x => {
        let title = x[2].replace(/<[^>]+>/g, "").trim();

        return {
          title,
          link: x[1]
        };
      })
      .filter(x => x.title.length > 20) // biar bukan random link
      .slice(0, 10);

    res.status(200).json({
      status: true,
      query: q,
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
