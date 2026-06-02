// gacha-share.js
// GET /gacha-share?pedal_id=xxx&rk=SSR
// → ガチャカード画像付き動的OGP HTMLを返す

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://yzqfockzgyfjmngygbhp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6cWZvY2t6Z3lmam1uZ3lnYmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTYxODksImV4cCI6MjA4OTY3MjE4OX0.Cn4UMJ8y6CHuIMDeFEShej4t1p4syweLgo5ZXZNs-_g';
const SITE_URL = 'https://mygearmyboard.com';

const RK_LABEL = {
  SSR: 'LEGENDARY', SR: 'EXPERT', Sp: 'SPECIALIST', Std: 'STANDARD'
};

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const pedalId = params.pedal_id;
  const rk = params.rk || 'Std';

  // pedal_idがない場合はトップにリダイレクト
  if (!pedalId) {
    return {
      statusCode: 302,
      headers: { Location: SITE_URL },
      body: ''
    };
  }

  let pedal = null;
  let cardImageUrl = null;

  try {
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

    // ペダル情報取得
    const { data } = await sb
      .from('pedals')
      .select('id,brand,model,full_name,image_url')
      .eq('id', parseInt(pedalId))
      .maybeSingle();
    pedal = data;

    // gacha-cardsのカード画像URL
    const filename = `gacha_${pedalId}_${rk}.jpg`;
    const { data: urlData } = sb.storage
      .from('gacha-cards')
      .getPublicUrl(filename);
    cardImageUrl = urlData?.publicUrl || null;
  } catch (e) {
    console.error('gacha-share error:', e);
  }

  const rkLabel = RK_LABEL[rk] || 'STANDARD';
  const pedalName = pedal ? pedal.full_name : 'Unknown Pedal';
  const brand = pedal ? pedal.brand : '';
  const model = pedal ? pedal.model : '';
  const ogImage = cardImageUrl || `${SITE_URL}/images/ogp.jpg`;
  const title = `【${rk} / ${rkLabel}】${pedalName} | MGMB GEAR GACHA`;
  const description = `${brand} ${model} が出た！ ガチャでペダルと出会おう。 #MGMB #エフェクター`;
  const canonicalUrl = `${SITE_URL}/gacha-share?pedal_id=${pedalId}&rk=${rk}`;

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escHtml(title)}</title>
<meta name="description" content="${escHtml(description)}">
<!-- OGP -->
<meta property="og:type" content="website">
<meta property="og:url" content="${escHtml(canonicalUrl)}">
<meta property="og:title" content="${escHtml(title)}">
<meta property="og:description" content="${escHtml(description)}">
<meta property="og:image" content="${escHtml(ogImage)}">
<meta property="og:image:width" content="300">
<meta property="og:image:height" content="300">
<meta property="og:site_name" content="My Gear My Board">
<!-- Twitter Card -->
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${escHtml(title)}">
<meta name="twitter:description" content="${escHtml(description)}">
<meta name="twitter:image" content="${escHtml(ogImage)}">
<meta http-equiv="refresh" content="0;url=${escHtml(SITE_URL)}">
<style>
  body{margin:0;background:#0d0d0e;color:#eae8e2;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;gap:12px;text-align:center}
  a{color:#e8552d}
</style>
</head>
<body>
<p>ガチャページへ移動中...</p>
<p><a href="${escHtml(SITE_URL)}">クリックしてもページが変わらない場合はこちら</a></p>
<script>window.location.replace('${SITE_URL}');</script>
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

function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
