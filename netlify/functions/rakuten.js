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

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: 'Rakuten API error: ' + res.status })
      };
    }

    const data = await res.json();
    const items = data.Items || [];

    if (!items.length) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [] })
      };
    }

    // 必要な情報だけ返す
    const result = items.map(item => ({
      itemName: item.itemName || '',
      itemUrl: item.itemUrl || '',
      imageUrl: (() => {
        const raw = item.mediumImageUrls && item.mediumImageUrls[0];
        if (!raw) return null;
        const url = typeof raw === 'string' ? raw : (raw.imageUrl || null);
        // サイズを400x400に変換
        return url ? url.replace(/_ex=\d+x\d+/, '_ex=400x400') : null;
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
