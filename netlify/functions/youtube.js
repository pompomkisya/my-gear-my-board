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
    const extraKeywords = 'effector pedal';

    // ── Stage 1: ダブルクォート完全一致 + キーワード
    const searchQuery1 = `"${query}" ${extraKeywords}`;
    const url1 = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery1)}&type=video&maxResults=1&key=${apiKey}`;
    const res1 = await fetch(url1);
    const data1 = await res1.json();
    const videoId1 = data1.items?.[0]?.id?.videoId || null;

    if (videoId1) {
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ videoId: videoId1, stage: 1 })
      };
    }

    // ── Stage 2: クォートなし + キーワード（フォールバック）
    const searchQuery2 = `${query} ${extraKeywords}`;
    const url2 = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery2)}&type=video&maxResults=1&key=${apiKey}`;
    const res2 = await fetch(url2);
    const data2 = await res2.json();
    const videoId2 = data2.items?.[0]?.id?.videoId || null;

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ videoId: videoId2, stage: 2 })
    };

  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
