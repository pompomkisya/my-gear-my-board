const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');

const SUPABASE_URL = 'https://yzqfockzgyfjmngygbhp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6cWZvY2t6Z3lmam1uZ3lnYmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTYxODksImV4cCI6MjA4OTY3MjE4OX0.Cn4UMJ8y6CHuIMDeFEShej4t1p4syweLgo5ZXZNs-_g';

function fetchImage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchImage(res.headers.location).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ buf: Buffer.concat(chunks), contentType: res.headers['content-type'] || 'image/jpeg' }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const id = params.id;
  const proxy = params.proxy;

  // 画像プロキシモード
  if (proxy === '1' && id) {
    try {
      const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data, error } = await sb.from('posts').select('image_urls').eq('id', id).single();
      if (error || !data || !data.image_urls || !data.image_urls[0]) {
        return { statusCode: 404, body: 'Not found' };
      }
      const { buf, contentType } = await fetchImage(data.image_urls[0]);
      return {
        statusCode: 200,
        headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=86400' },
        body: buf.toString('base64'),
        isBase64Encoded: true,
      };
    } catch (e) {
      return { statusCode: 500, body: 'Error: ' + e.message };
    }
  }

  // OGPページモード
  if (!id) {
    return { statusCode: 302, headers: { Location: 'https://mygearmyboard.com' } };
  }

  try {
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data, error } = await sb.from('posts').select('id,title,description,image_urls,username').eq('id', id).single();
    if (error || !data) {
      return { statusCode: 302, headers: { Location: 'https://mygearmyboard.com' } };
    }

    const title = data.title || 'My Gear My Board';
    const desc = data.description
      ? data.description.slice(0, 100) + (data.description.length > 100 ? '...' : '')
      : 'ペダルボード・機材を投稿・共有するSNS';
    const hasImage = data.image_urls && data.image_urls[0];
    const image = hasImage
      ? 'https://mygearmyboard.com/.netlify/functions/og?id=' + id + '&proxy=1'
      : 'https://mygearmyboard.com/IMG_2107.PNG';
    const postUrl = 'https://mygearmyboard.com/post?id=' + id;

    const html = '<!DOCTYPE html><html><head><meta charset="UTF-8">'
      + '<meta property="og:title" content="' + escHtml(title) + ' — My Gear My Board">'
      + '<meta property="og:description" content="' + escHtml(desc) + '">'
      + '<meta property="og:image" content="' + image + '">'
      + '<meta property="og:image:width" content="1200">'
      + '<meta property="og:image:height" content="630">'
      + '<meta property="og:url" content="' + postUrl + '">'
      + '<meta property="og:type" content="article">'
      + '<meta property="og:site_name" content="My Gear My Board">'
      + '<meta name="twitter:card" content="summary_large_image">'
      + '<meta name="twitter:title" content="' + escHtml(title) + ' — My Gear My Board">'
      + '<meta name="twitter:description" content="' + escHtml(desc) + '">'
      + '<meta name="twitter:image" content="' + image + '">'
      + '<meta name="twitter:site" content="@MGMBpedalboard">'
      + '<meta http-equiv="refresh" content="0;url=' + postUrl + '">'
      + '<title>' + escHtml(title) + ' — My Gear My Board</title>'
      + '</head><body><script>window.location.href="' + postUrl + '";</script></body></html>';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
      body: html,
    };
  } catch (e) {
    return { statusCode: 302, headers: { Location: 'https://mygearmyboard.com' } };
  }
};

function escHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
