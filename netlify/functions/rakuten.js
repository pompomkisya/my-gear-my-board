exports.handler = async function(event) {
  const applicationId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;

  if (!applicationId || !accessKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'RAKUTEN_APP_ID or RAKUTEN_ACCESS_KEY not configured' }) };
  }

  const query = event.queryStringParameters?.q;
  if (!query) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing query parameter: q' }) };
  }

  // ★ カスタム検索キーワード（再取得時に使用）
  const customKeyword = event.queryStringParameters?.kw || null;

  try {
    // ★ 検索キーワード：カスタム指定があればそれを使用、なければ「ペダル名 エフェクター」
    const searchQuery = customKeyword ? customKeyword : query + ' エフェクター';

    const url = 'https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601' +
      '?applicationId=' + applicationId +
      '&accessKey=' + accessKey +
      '&keyword=' + encodeURIComponent(searchQuery) +
      '&hits=5' +
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
      return { statusCode: res.status, body: JSON.stringify({ error: 'Rakuten API error: ' + res.status, detail: errorText }) };
    }

    const buffer = await res.arrayBuffer();
    const data = JSON.parse(new TextDecoder('utf-8').decode(buffer));
    let items = data.Items || [];

    if (!items.length) {
      return { statusCode: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify({ items: [] }) };
    }

    // ★ 除外ワード：ペダルと無関係な商品をフィルタリング
    const NG_WORDS = ['セット', 'まとめ', '詰め合わせ', 'Tシャツ', 'ライト', 'LED', 'タイヤ', '衣類', 'ファッション', 'ケーブル', 'シールド', 'ピック', 'クロス', '弦'];
    // ★ 必須ワード：最低限これらのどれかを含む商品のみ採用
    const REQUIRE_WORDS = ['エフェクター', 'ペダル', 'effector', 'pedal', 'guitar', 'ギター', 'bass', 'ベース', 'BOSS', 'Strymon', 'MXR', 'EHX', 'Electro', 'overdrive', 'distortion', 'reverb', 'delay', 'fuzz', '歪み', '空間', 'waza', 'WAZA'];

    const filtered = items.filter(item => {
      const name = (item.itemName || '').toLowerCase();
      // 除外ワードが含まれる場合はスキップ
      const hasNg = NG_WORDS.some(w => name.includes(w.toLowerCase()));
      if (hasNg) return false;
      // 必須ワードのどれかを含む場合のみ採用
      const hasRequired = REQUIRE_WORDS.some(w => name.toLowerCase().includes(w.toLowerCase()));
      return hasRequired;
    });

    // フィルタ後に0件なら元のリストを使用（フィルタが厳しすぎる場合の保険）
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
