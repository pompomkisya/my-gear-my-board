exports.handler = async function(event) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const query = event.queryStringParameters?.q;

  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing query' })
    };
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + ' pedal demo')}&type=video&maxResults=1&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    const videoId = data.items?.[0]?.id?.videoId || null;

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ videoId })
    };
  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
