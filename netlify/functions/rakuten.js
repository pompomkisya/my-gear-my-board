exports.handler = async function(event) {
  const appId = process.env.RAKUTEN_APP_ID;
  if (!appId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'RAKUTEN_APP_ID not configured' })
    };
  }

  const query = event.queryStringParameters?.q;
  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing query parameter: q' })
    };
  }

  try {
    const url = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706' +
      '?applicationId=' + appId +
      '&keyword=' + encodeURIComponent(query) +
      '&hits=3' +
      '&imageFlag=1' +
      '&formatVersion=2';

    const res = await fetch(url);
    const responseText = await res.text();

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({
          error: 'Rakuten API error: ' + res.status,
          detail: responseText,
          url_used: url.replace(appId, '***')
        })
      };
    }

    const data = JSON.parse(responseText);
    const items = data.Items || [];

    if (!items.length) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [] })
      };
    }

    const result = items.map(item => ({
      itemName: item.itemName || '',
      itemUrl: item.itemUrl || '',
      imageUrl: (() => {
        const raw = item.mediumImageUrls && item.mediumImageUrls[0];
        if (!raw) return null;
        const u = typeof raw === 'string' ? raw : (raw.imageUrl || null);
        return u ? u.replace(/_ex=\d+x\d+/, '_ex=400x400') : null;
      })()
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: result })
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message || 'Unknown error' })
    };
  }
};
