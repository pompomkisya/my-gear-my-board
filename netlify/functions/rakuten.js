exports.handler = async function(event) {
  const applicationId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;

  if (!applicationId || !accessKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'RAKUTEN_APP_ID or RAKUTEN_ACCESS_KEY not configured' })
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
    const url = 'https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601' +
      '?applicationId=' + applicationId +
      '&accessKey=' + accessKey +
      '&keyword=' + encodeURIComponent(query) +
      '&hits=3' +
      '&imageFlag=1' +
      '&format=json' +
      '&formatVersion=2';

    const res = await fetch(url, {
      headers: {
        'Origin': 'https://mygearmyboard.com',
        'Referer': 'https://mygearmyboard.com/',
        'User-Agent': 'Mozilla/5.0',
        'Accept-Charset': 'utf-8'
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: 'Rakuten API error: ' + res.status, detail: errorText })
      };
    }

    const buffer = await res.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    const data = JSON.parse(decoder.decode(buffer));
    const items = data.Items || [];

    if (!items.length) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ items: [] })
      };
    }

    const result = items.map(item => ({
      itemName: item.itemName || '',
      itemUrl: item.itemUrl || '',
      imageUrl: (() => {
        // mediumImageUrlsは文字列の配列
        const urls = item.mediumImageUrls;
        if (!urls || !urls.length) return null;
        const raw = urls[0];
        if (!raw || typeof raw !== 'string') return null;
        // _ex=128x128 → _ex=400x400 に変換して高画質化
        return raw.replace(/_ex=\d+x\d+/, '_ex=400x400');
      })()
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ items: result })
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message || 'Unknown error' })
    };
  }
};
