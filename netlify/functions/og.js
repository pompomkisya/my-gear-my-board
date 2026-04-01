const SUPABASE_URL = 'https://yzqfockzgyfjmngygbhp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6cWZvY2t6Z3lmam1uZ3lnYmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTYxODksImV4cCI6MjA4OTY3MjE4OX0.Cn4UMJ8y6CHuIMDeFEShej4t1p4syweLgo5ZXZNs-_g';

exports.handler = async (event) => {
  const id = event.queryStringParameters && event.queryStringParameters.id;

  // デフォルトOGP（投稿IDなし）
  const defaultOgp = {
    title: 'My Gear My Board',
    description: 'エフェクターボード＆機材を投稿・共有するSNS。登録不要・匿名OK。',
    image: 'https://mygearmyboard.com/IMG_0206.PNG',
    url: 'https://mygearmyboard.com',
  };

  let ogp = defaultOgp;

  if (id) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}&select=title,description,image_urls,username,post_type`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      const data = await res.json();
      if (data && data[0]) {
        const post = data[0];
        const typeLabel = post.post_type === 'gear' ? '機材投稿' : 'エフェクターボード';
        ogp = {
          title: `${post.title} — My Gear My Board`,
          description: post.description
            ? post.description.slice(0, 100)
            : `${post.username || '匿名ユーザー'}さんの${typeLabel}`,
          image: post.image_urls && post.image_urls[0]
            ? post.image_urls[0]
            : defaultOgp.image,
          url: `https://mygearmyboard.com/post?id=${id}`,
        };
      }
    } catch (e) {
      // エラー時はデフォルトOGP
    }
  }

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escHtml(ogp.title)}</title>
<meta name="description" content="${escHtml(ogp.description)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${escHtml(ogp.title)}">
<meta property="og:description" content="${escHtml(ogp.description)}">
<meta property="og:image" content="${escHtml(ogp.image)}">
<meta property="og:url" content="${escHtml(ogp.url)}">
<meta property="og:site_name" content="My Gear My Board">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escHtml(ogp.title)}">
<meta name="twitter:description" content="${escHtml(ogp.description)}">
<meta name="twitter:image" content="${escHtml(ogp.image)}">
<meta name="twitter:site" content="@MGMBpedalboard">
<script>location.replace("${escHtml(ogp.url)}");</script>
</head>
<body></body>
</html>`;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: html,
  };
};

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
