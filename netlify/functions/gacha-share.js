// gacha-share.js
// GET /gacha-share?pedal_id=xxx&rk=SSR&slug=xxx
// → ペダル画像をOGPに使った動的HTML返す → /pedal?slug=xxx にリダイレクト

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://yzqfockzgyfjmngygbhp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6cWZvY2t6Z3lmam1uZ3lnYmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTYxODksImV4cCI6MjA4OTY3MjE4OX0.Cn4UMJ8y6CHuIMDeFEShej4t1p4syweLgo5ZXZNs-_g';
const SITE_URL = 'https://mygearmyboard.com';
const DEFAULT_OGP = `${SITE_URL}/images/ogp.jpg`;

const RK_LABEL = { SSR:'LEGENDARY', SR:'EXPERT', Sp:'SPECIALIST', Std:'STANDARD' };

exports.handler = async (event) => {
  const p = event.queryStringParameters || {};
  const pedalId = p.pedal_id;
  const rk = p.rk || 'Std';
  const slug = p.slug || '';

  if (!pedalId) {
    return { statusCode: 302, headers: { Location: SITE_URL }, body: '' };
  }

  // リダイレクト先：ペダル詳細ページ
  const redirectTo = slug
    ? `${SITE_URL}/pedal?slug=${encodeURIComponent(slug)}`
    : `${SITE_URL}`;

  let pedal = null;
  try {
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data } = await sb
      .from('pedals')
      .select('id,brand,model,full_name,image_url,slug')
      .eq('id', parseInt(pedalId))
      .maybeSingle();
    pedal = data;
  } catch (e) {
    console.error('gacha-share error:', e);
  }

  const rkLabel = RK_LABEL[rk] || 'STANDARD';
  const pedalName = pedal ? pedal.full_name : 'Unknown Pedal';
  const brand = pedal ? (pedal.brand || '') : '';
  const model = pedal ? (pedal.model || '') : '';

  // OGP画像：ペダルのimage_url優先、なければデフォルト
  const ogImage = (pedal && pedal.image_url) ? pedal.image_url : DEFAULT_OGP;

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
<meta name="twitter:card" content="summary">
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
      'Cache-Control': 'public, max-age=300'
    },
    body: html
  };
};

function esc(s) {
  return String(s || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
