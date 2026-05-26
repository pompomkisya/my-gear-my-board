exports.handler = async function(event) {
  const applicationId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;

  if (!applicationId || !accessKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'RAKUTEN_APP_ID or RAKUTEN_ACCESS_KEY not configured' }) };
  }

  const headers = {
    'Origin': 'https://mygearmyboard.com',
    'Referer': 'https://mygearmyboard.com/',
    'User-Agent': 'Mozilla/5.0',
    'Accept-Charset': 'utf-8'
  };

  const itemPageUrl = event.queryStringParameters?.item_url;

  // ★ 商品ページURL直接指定モード（qなしでも動作）
  if (itemPageUrl) {
    try {
      const match = itemPageUrl.match(/item\.rakuten\.co\.jp\/([^\/]+)\/([^\/\?]+)/);
      if (!match) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid Rakuten item URL' }) };
      }
      const shopCode = match[1];
      const itemCode = shopCode + ':' + match[2];

      const url = 'https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Get/20220601' +
        '?applicationId=' + applicationId +
        '&accessKey=' + accessKey +
        '&itemCode=' + encodeURIComponent(itemCode) +
        '&imageFlag=1' +
        '&format=json' +
        '&formatVersion=2';

      const res = await fetch(url, { headers });

      if (!res.ok) {
        const errorText = await res.text();
        return { statusCode: res.status, body: JSON.stringify({ error: 'Rakuten API error: ' + res.status, detail: errorText }) };
      }

      const buffer = await res.arrayBuffer();
      const data = JSON.parse(new TextDecoder('utf-8').decode(buffer));
      const items = data.Items || [];

      if (!items.length) {
        return { statusCode: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify({ items: [] }) };
      }

      const item = items[0];
      const imageUrl = (() => {
        const urls = item.mediumImageUrls;
        if (!urls || !urls.length) return null;
        const raw = urls[0];
        if (!raw || typeof raw !== 'string') return null;
        return raw.replace(/_ex=\d+x\d+/, '_ex=400x400');
      })();

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          items: [{
            itemName: item.itemName || '',
            itemUrl: item.itemUrl || '',
            imageUrl
          }]
        })
      };

    } catch (e) {
      return { statusCode: 500, body: JSON.stringify({ error: e.message || 'Unknown error' }) };
    }
  }

  // ★ キーワード検索モード
  const query = event.queryStringParameters?.q;
  if (!query) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing query parameter: q or item_url' }) };
  }

  const customKeyword = event.queryStringParameters?.kw || null;

  try {
    const searchQuery = customKeyword ? customKeyword : query + ' エフェクター';

    const url = 'https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601' +
      '?applicationId=' + applicationId +
      '&accessKey=' + accessKey +
      '&keyword=' + encodeURIComponent(searchQuery) +
      '&hits=5' +
      '&imageFlag=1' +
      '&format=json' +
      '&formatVersion=2';

    const res = await fetch(url, { headers });

    if (!res.ok) {
      const errorText = await res.text();
      return { statusCode: res.status, body: JSON.stringify({ error: 'Rakuten API error: ' + res.status, detail: errorText }) };
    }

    const buffer = await res.arrayBuffer();
    const data = JSON.parse(new TextDecoder('utf-8').decode(buffer));
    let items = data.Items || [];

    if (!items.length) {
      return { statusCode: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify({ items: [] }) };
    }

    const NG_WORDS = ['セット', 'まとめ', '詰め合わせ', 'Tシャツ', 'ライト', 'LED', 'タイヤ', '衣類', 'ファッション', 'ケーブル', 'シールド', 'ピック', 'クロス', '弦'];
    const REQUIRE_WORDS = ['エフェクター', 'ペダル', 'effector', 'pedal', 'guitar', 'ギター', 'bass', 'ベース', 'BOSS', 'Strymon', 'MXR', 'EHX', 'Electro', 'overdrive', 'distortion', 'reverb', 'delay', 'fuzz', '歪み', '空間', 'waza', 'WAZA'];

    const filtered = items.filter(item => {
      const name = (item.itemName || '').toLowerCase();
      const hasNg = NG_WORDS.some(w => name.includes(w.toLowerCase()));
      if (hasNg) return false;
      const hasRequired = REQUIRE_WORDS.some(w => name.toLowerCase().includes(w.toLowerCase()));
      return hasRequired;
    });

    const finalItems = filtered.length > 0 ? filtered : items;

    const result = finalItems.slice(0, 3).map(item => ({
      itemName: item.itemName || '',
      itemUrl: item.itemUrl || '',
      imageUrl: (() => {
        const urls = item.mediumImageUrls;
        if (!urls || !urls.length) return null;
        const raw = urls[0];
        if (!raw || typeof raw !== 'string') return null;
        return raw.replace(/_ex=\d+x\d+/, '_ex=400x400');
      })()
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ items: result })
    };

  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message || 'Unknown error' }) };
  }
};
