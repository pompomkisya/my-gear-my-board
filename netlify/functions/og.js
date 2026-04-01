const SUPABASE_URL = 'https://yzqfockzgyfjmngygbhp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6cWZvY2t6Z3lmam1uZ3lnYmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTYxODksImV4cCI6MjA4OTY3MjE4OX0.Cn4UMJ8y6CHuIMDeFEShej4t1p4syweLgo5ZXZNs-_g';

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const id = params.id;

  // 画像プロキシモード
  if (params.img) {
    try {
      const imgRes = await fetch(params.img);
      const buffer = await imgRes.arrayBuffer();
      const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
      return {
        statusCode: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*',
        },
        body: Buffer.from(buffer).toString('base64'),
        isBase64Encoded: true,
      };
    } catch (e) {
      return { statusCode: 404, body: 'Not found' };
    }
  }

  const defaultOgp = {
    title: 'My Gear My Board',
    description: 'Share your pedalboard & gear. No sign-up needed.',
    image: 'https://mygearmyboard.com/IMG_0206.PNG',
    url: 'https://mygearmyboard.com',
  };

  let ogp = defaultOgp;

  if (id) {
    try {
      const res = await fetch(
        SUPABASE_URL + '/rest/v1/posts?id=eq.' + id + '&select=title,description,image_urls,username,post_type',
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: 'Bearer ' + SUPABASE_KEY,
          },
        }
      );
      const data = await res.json();
      if (data && data[0]) {
        const post = data[0];
        const imgUrls = post.image_urls;
        const firstImg = Array.isArray(imgUrls) && imgUrls.length > 0 ? imgUrls[0] : null;
        // 画像URLをプロキシ経由に変換
        const proxyImg = firstImg
          ? 'https://mygearmyboard.com/.netlify/functions/og?img=' + encodeURIComponent(firstImg)
          : defaultOgp.image;
        ogp = {
          title: (post.title || 'My Gear My Board') + ' - My Gear My Board',
          description: post.description
            ? post.description.slice(0, 100)
            : (post.username || 'Anonymous') + ' on My Gear My Board',
          image: proxyImg,
          url: 'https://mygearmyboard.com/post?id=' + id,
        };
      }
    } catch (e) {
      ogp.description = 'error: ' + e.message;
    }
  }

  const html = '<!DOCTYPE html>\n'
    + '<html lang="ja">\n'
    + '<head>\n'
    + '<meta charset="UTF-8">\n'
    + '<title>' + escHtml(ogp.title) + '</title>\n'
    + '<meta name="description" content="' + escHtml(ogp.description) + '">\n'
    + '<meta property="og:type" content="website">\n'
    + '<meta property="og:title" content="' + escHtml(ogp.title) + '">\n'
    + '<meta property="og:description" content="' + escHtml(ogp.description) + '">\n'
    + '<meta property="og:image" content="' + escHtml(ogp.image) + '">\n'
    + '<meta property="og:url" content="' + escHtml(ogp.url) + '">\n'
    + '<meta property="og:site_name" content="My Gear My Board">\n'
    + '<meta name="twitter:card" content="summary_large_image">\n'
    + '<meta name="twitter:title" content="' + escHtml(ogp.title) + '">\n'
    + '<meta name="twitter:description" content="' + escHtml(ogp.description) + '">\n'
    + '<meta name="twitter:image" content="' + escHtml(ogp.image) + '">\n'
    + '<meta name="twitter:site" content="@MGMBpedalboard">\n'
    + '<script>location.replace("' + escHtml(ogp.url) + '");</script>\n'
    + '</head>\n'
    + '<body></body>\n'
    + '</html>';

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
