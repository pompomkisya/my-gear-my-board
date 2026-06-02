// gacha-share.js
// GET /gacha-share?pedal_id=xxx&rk=SSR&slug=xxx → 動的OGP HTML → /pedal?slug=xxx にリダイレクト
// GET /gacha-share?pedal_id=xxx&img=1 → 1200x630 OGP画像を返す

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');
const sharp = require('sharp');

const SUPABASE_URL = 'https://yzqfockzgyfjmngygbhp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6cWZvY2t6Z3lmam1uZ3lnYmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTYxODksImV4cCI6MjA4OTY3MjE4OX0.Cn4UMJ8y6CHuIMDeFEShej4t1p4syweLgo5ZXZNs-_g';
const SITE_URL = 'https://mygearmyboard.com';
const DEFAULT_OGP = `${SITE_URL}/ogp.png`;

const RK_LABEL = { SSR:'LEGENDARY', SR:'EXPERT', Sp:'SPECIALIST', Std:'STANDARD' };

function fetchImage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchImage(res.headers.location).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// ペダル画像を1200x630白背景中央配置のJPEGにして返す
async function makeOgpImage(imageUrl) {
  const OGP_W = 1200;
  const OGP_H = 630;
  const PADDING = 80; // 上下左右の余白

  const buf = await fetchImage(imageUrl);

  // ペダル画像をパディング内に収まるようリサイズ（中央配置）
  const maxW = OGP_W - PADDING * 2;
  const maxH = OGP_H - PADDING * 2;

  const resized = await sharp(buf)
    .resize(maxW, maxH, { fit: 'inside', withoutEnlargement: false })
    .toBuffer();

  // メタデータ取得（リサイズ後のサイズ）
  const meta = await sharp(resized).metadata();
  const left = Math.round((OGP_W - meta.width) / 2);
  const top = Math.round((OGP_H - meta.height) / 2);

  // 白背景に合成
  const result = await sharp({
    create: {
      width: OGP_W,
      height: OGP_H,
      channels: 3,
      background: { r: 255, g: 255, b: 255 }
    }
  })
  .composite([{ input: resized, left, top }])
  .jpeg({ quality: 90 })
  .toBuffer();

  return result;
}

exports.handler = async (event) => {
  const p = event.queryStringParameters || {};
  const pedalId = p.pedal_id;
  const rk = p.rk || 'Std';
  const slug = p.slug || '';

  if (!pedalId) {
    return { statusCode: 302, headers: { Location: SITE_URL }, body: '' };
  }

  // ★ 画像プロキシモード（?img=1）→ 1200x630白背景中央配置で返す
  if (p.img === '1') {
    try {
      const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data } = await sb.from('pedals').select('image_url').eq('id', parseInt(pedalId)).maybeSingle();
      if (data && data.image_url) {
        const ogpBuf = await makeOgpImage(data.image_url);
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=86400'
          },
          body: ogpBuf.toString('base64'),
          isBase64Encoded: true,
        };
      }
    } catch (e) {
      console.error('img proxy error:', e);
    }
    return { statusCode: 302, headers: { Location: DEFAULT_OGP }, body: '' };
  }

  // ★ OGPページモード
  const redirectTo = slug
    ? `${SITE_URL}/pedal?slug=${encodeURIComponent(slug)}`
    : SITE_URL;

  let pedal = null;
  try {
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data } = await sb.from('pedals').select('id,brand,model,full_name,image_url,slug').eq('id', parseInt(pedalId)).maybeSingle();
    pedal = data;
  } catch (e) {
    console.error('gacha-share error:', e);
  }

  const rkLabel = RK_LABEL[rk] || 'STANDARD';
  const pedalName = pedal ? pedal.full_name : 'Unknown Pedal';
  const brand = pedal ? (pedal.brand || '') : '';
  const model = pedal ? (pedal.model || '') : '';

  // OGP画像：プロキシ経由（ペダル画像あり）orデフォルト
  const ogImage = (pedal && pedal.image_url)
    ? `${SITE_URL}/gacha-share?pedal_id=${pedalId}&rk=${rk}&img=1`
    : DEFAULT_OGP;

  const title = `【${rk} / ${rkLabel}】${pedalName} | MGMB GEAR GACHA`;
  const description = `${brand} ${model} が出た！ ガチャでペダルと出会おう。 #MGMB #エフェクター`;
  const canonicalUrl = `${SITE_URL}/gacha-share?pedal_id=${pedalId}&rk=${rk}&slug=${encodeURIComponent(slug)}`;

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${esc(canonicalUrl)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:site_name" content="My Gear My Board">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@MGMBpedalboard">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(ogImage)}">
<meta http-equiv="refresh" content="0;url=${esc(redirectTo)}">
<style>body{margin:0;background:#0d0d0e;color:#eae8e2;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;gap:12px;text-align:center}a{color:#e8552d}</style>
</head>
<body>
<p>ページへ移動中...</p>
<p><a href="${esc(redirectTo)}">移動しない場合はこちら</a></p>
<script>window.location.replace('${redirectTo.replace(/'/g,"\\'")}');</script>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60'
    },
    body: html
  };
};

function esc(s) {
  return String(s || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
