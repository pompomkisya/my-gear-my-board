const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://yzqfockzgyfjmngygbhp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6cWZvY2t6Z3lmam1uZ3lnYmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTYxODksImV4cCI6MjA4OTY3MjE4OX0.Cn4UMJ8y6CHuIMDeFEShej4t1p4syweLgo5ZXZNs-_g';
const BASE_URL = 'https://mygearmyboard.com';

// タイプ一覧（type.htmlで使われているもの）
const TYPES = [
  'overdrive','distortion','fuzz','boost','reverb','delay','chorus','flanger',
  'phaser','tremolo','vibrato','pitch_octave','wah_filter','comp','eq',
  'noise_gate','looper','volume','tuner','multi','preamp','modulation',
  'sequence_rhythm','glitch','acoustic','vocal','power_supply','switcher_selector',
  'buffer','synth','junction_box','bass','other'
];

function escXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${escXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function toDate(isoStr) {
  if (!isoStr) return null;
  return isoStr.slice(0, 10); // YYYY-MM-DD
}

exports.handler = async function(event, context) {
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const today = new Date().toISOString().slice(0, 10);

  try {
    // ── ペダル全件取得（slug・brand・updated_at）
    let pedals = [];
    let offset = 0;
    while (true) {
      const { data: batch, error } = await sb
        .from('pedals')
        .select('slug, brand, updated_at')
        .range(offset, offset + 999);
      if (error || !batch || batch.length === 0) break;
      pedals = [...pedals, ...batch];
      if (batch.length < 1000) break;
      offset += 1000;
    }

    // ── ブランド一覧（重複排除）
    const brands = [...new Set(pedals.map(p => p.brand).filter(Boolean))].sort();

    // ── 投稿全件取得（id・created_at）
    const { data: posts } = await sb
      .from('posts')
      .select('id, created_at')
      .order('created_at', { ascending: false });

    // ── XML生成
    const urls = [];

    // 静的ページ
    urls.push(urlEntry(`${BASE_URL}/`, today, 'daily', '1.0'));
    urls.push(urlEntry(`${BASE_URL}/pedals`, today, 'daily', '0.8'));

    // ペダル個別ページ
    for (const p of pedals) {
      if (!p.slug) continue;
      const lastmod = toDate(p.updated_at) || today;
      urls.push(urlEntry(
        `${BASE_URL}/pedal?slug=${encodeURIComponent(p.slug)}`,
        lastmod,
        'weekly',
        '0.7'
      ));
    }

    // ブランドページ
    for (const brand of brands) {
      urls.push(urlEntry(
        `${BASE_URL}/brand?name=${encodeURIComponent(brand)}`,
        today,
        'weekly',
        '0.6'
      ));
    }

    // タイプページ
    for (const type of TYPES) {
      urls.push(urlEntry(
        `${BASE_URL}/type?name=${encodeURIComponent(type)}`,
        today,
        'weekly',
        '0.6'
      ));
    }

    // 投稿個別ページ
    for (const post of (posts || [])) {
      if (!post.id) continue;
      const lastmod = toDate(post.created_at) || today;
      urls.push(urlEntry(
        `${BASE_URL}/post?id=${encodeURIComponent(post.id)}`,
        lastmod,
        'monthly',
        '0.5'
      ));
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // 1時間キャッシュ
      },
      body: xml,
    };

  } catch (err) {
    console.error('sitemap error:', err);
    return {
      statusCode: 500,
      body: 'Sitemap generation failed',
    };
  }
};
