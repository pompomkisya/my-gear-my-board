// image-proxy.js
// 外部URLの画像をサーバー側でフェッチしてBase64で返す（CORSを回避）
exports.handler = async function(event) {
  const url = event.queryStringParameters && event.queryStringParameters.url;
  if (!url) {
    return { statusCode: 400, body: JSON.stringify({ error: 'url parameter required' }) };
  }

  // 許可するドメインのみ（セキュリティ）
  const allowedDomains = [
    'r.r10s.jp',
    'thumbnail.image.rakuten.co.jp',
    'shop.r10s.jp',
    'm.media-amazon.com',
    'images-na.ssl-images-amazon.com',
    'rvb-img.reverb.com',
    'www.soundhouse.co.jp',
    'www.walrusaudio.com',
    'pearl-music.co.jp',
    'catalinbread.com',
    'www.boss.info',
    'www.mxraudio.com',
    'www.strymon.net',
    'www.ehx.com',
    'cdn.shopify.com',
    'encrypted-tbn2.gstatic.com',
    'encrypted-tbn0.gstatic.com',
  ];

  let hostname = '';
  try {
    hostname = new URL(url).hostname;
  } catch(e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'invalid url' }) };
  }

  const allowed = allowedDomains.some(d => hostname === d || hostname.endsWith('.' + d));
  if (!allowed) {
    // 許可リスト外でも処理は試みる（ペダル公式サイトは多様なため）
    // ただしログに残す
    console.log('unlisted domain:', hostname);
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MGMB/1.0)',
        'Accept': 'image/*,*/*',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'fetch failed', status: response.status })
      };
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    // 画像以外は拒否
    if (!contentType.startsWith('image/')) {
      return { statusCode: 400, body: JSON.stringify({ error: 'not an image: ' + contentType }) };
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        base64,
        contentType,
        size: buffer.byteLength,
      }),
    };
  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
