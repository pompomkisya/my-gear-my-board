const https = require('https');
const http = require('http');

function checkUrl(url, redirectsLeft) {
  redirectsLeft = redirectsLeft === undefined ? 8 : redirectsLeft;
  return new Promise((resolve) => {
    let target;
    try { target = new URL(url); } catch (e) { resolve({ ok: false, status: 0, error: 'invalid_url', finalUrl: url }); return; }
    const client = target.protocol === 'http:' ? http : https;
    const req = client.request(target, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MGMBLinkCheck/1.0)' }, timeout: 8000 }, (res) => {
      res.resume(); // データは読み捨てる（ステータスだけ見れば良い）
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirectsLeft > 0) {
        let nextUrl;
        try { nextUrl = new URL(res.headers.location, target).toString(); } catch (e) { resolve({ ok: false, status: res.statusCode, error: 'bad_redirect', finalUrl: url }); return; }
        checkUrl(nextUrl, redirectsLeft - 1).then(resolve);
        return;
      }
      resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode, finalUrl: target.toString() });
    });
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, status: 0, error: 'timeout', finalUrl: url }); });
    req.on('error', (e) => { resolve({ ok: false, status: 0, error: String(e.message || e), finalUrl: url }); });
    req.end();
  });
}

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const url = params.url;
  if (!url) {
    return { statusCode: 400, body: JSON.stringify({ error: 'url required' }) };
  }
  const result = await checkUrl(url);
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(result)
  };
};
