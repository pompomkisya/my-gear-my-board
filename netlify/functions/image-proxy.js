// image-proxy.js
// 外部URLの画像をサーバー側でフェッチしてBase64で返す（CORSを回避）

const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4MB制限（Netlifyレスポンス6MB上限の安全圏）
const FETCH_TIMEOUT_MS = 8000;          // 8秒タイムアウト（Netlify 10秒制限の安全圏）

exports.handler = async function(event) {
  const url = event.queryStringParameters && event.queryStringParameters.url;
  if (!url) {
    return { statusCode: 400, body: JSON.stringify({ error: 'url parameter required' }) };
  }

  let hostname = '';
  try {
    hostname = new URL(url).hostname;
  } catch(e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'invalid url' }) };
  }

  // タイムアウト付きfetch
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MGMB/1.0)',
        'Accept': 'image/*,*/*',
      },
      redirect: 'follow',
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'fetch failed', status: response.status })
      };
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    if (!contentType.startsWith('image/')) {
      return { statusCode: 400, body: JSON.stringify({ error: 'not an image: ' + contentType }) };
    }

    // Content-Lengthで事前チェック
    const contentLength = parseInt(response.headers.get('content-length') || '0');
    if (contentLength > MAX_SIZE_BYTES) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'image too large: ' + contentLength + ' bytes' })
      };
    }

    // ストリームで読み込みながらサイズチェック
    const chunks = [];
    let totalSize = 0;
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalSize += value.length;
      if (totalSize > MAX_SIZE_BYTES) {
        reader.cancel();
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'image too large during read: ' + totalSize + ' bytes' })
        };
      }
      chunks.push(value);
    }

    const buffer = Buffer.concat(chunks.map(c => Buffer.from(c)));
    const base64 = buffer.toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        base64,
        contentType,
        size: buffer.length,
      }),
    };
  } catch(e) {
    clearTimeout(timeoutId);
    const isTimeout = e.name === 'AbortError';
    return {
      statusCode: isTimeout ? 408 : 500,
      body: JSON.stringify({ error: isTimeout ? 'timeout after ' + FETCH_TIMEOUT_MS + 'ms' : e.message }),
    };
  }
};
