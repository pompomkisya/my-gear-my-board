const SUPABASE_URL='https://yzqfockzgyfjmngygbhp.supabase.co';
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6cWZvY2t6Z3lmam1uZ3lnYmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTYxODksImV4cCI6MjA4OTY3MjE4OX0.Cn4UMJ8y6CHuIMDeFEShej4t1p4syweLgo5ZXZNs-_g';
const sb=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const MASTER_KEY='MSTR';
function getSessionId(){let s=localStorage.getItem('mgmb_sid');if(!s){s='sid_'+Math.random().toString(36).slice(2)+Date.now();localStorage.setItem('mgmb_sid',s);}return s;}
const SESSION_ID=getSessionId();
let lang='ja';
let allDBPosts=[],currentGenreFilter='ALL',currentBrandFilter=null,currentFxFilter=null,currentTab='all',currentSort='new',currentDBPost=null;

function togglePostDropdown(e){e.stopPropagation();document.getElementById('post-dropdown').classList.toggle('open');}
function closeDropdownAndPost(type){document.getElementById('post-dropdown').classList.remove('open');openPost(type);}
document.addEventListener('click',()=>document.getElementById('post-dropdown').classList.remove('open'));
function toggleLang(){lang=lang==='ja'?'en':'ja';if(allDBPosts.length)applyFilter();}

function buildTicker(posts){
  const inner=document.getElementById('ticker-inner');if(!inner)return;
  const items=[];
  const top=[...posts].sort((a,b)=>(b.likes||0)-(a.likes||0)).slice(0,3);
  top.forEach(p=>items.push({text:'人気急上昇 ▸ '+p.title,id:p.id}));
  const recent=[...posts].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,3);
  recent.forEach(p=>items.push({text:'新着 ▸ @'+(p.username||'anon')+' 「'+p.title+'」',id:p.id}));
  if(!items.length){inner.innerHTML='<span class="ti">My Gear My Board</span><span class="ti">My Gear My Board</span>';return;}
  const doubled=[...items,...items];
  inner.innerHTML=doubled.map(x=>'<span class="ti" onclick="location.href=\'/post?id='+x.id+'\'">'+x.text+'</span>').join('');
}

async function loadPostsFromDB(){
  const{data:posts,error}=await sb.from('posts').select('*').order('created_at',{ascending:false});
  if(error){console.error(error);return;}
  const{data:cc}=await sb.from('comments').select('post_id');
  const cm={};if(cc)cc.forEach(c=>{cm[c.post_id]=(cm[c.post_id]||0)+1;});
  // pedalsのtypes情報を取得してキャッシュ
  const{data:pedals}=await sb.from('pedals').select('full_name,types');
  const pedalTypesMap={};
  if(pedals)pedals.forEach(p=>{pedalTypesMap[p.full_name]=(p.types||[]);});
  // 各投稿のgear_listにtypesを付加
  allDBPosts=(posts||[]).map(p=>({
    ...p,
    comment_count:cm[p.id]||0,
    gear_list:(Array.isArray(p.gear_list)?p.gear_list:[]).map(g=>({
      ...g,
      types:pedalTypesMap[g.name]||[]
    }))
  }));
  applyFilter();
  buildTicker(allDBPosts);
  renderRankingWidget(allDBPosts);renderGearWidget(allDBPosts);
  renderRankingWidgetMob(allDBPosts);renderGearWidgetMob(allDBPosts);
}

function parseGenre(genre){
  if(!genre)return[];
  if(Array.isArray(genre))return genre;
  if(typeof genre==='string'){try{const p=JSON.parse(genre);return Array.isArray(p)?p:[genre];}catch(e){return[genre];}}
  return[];
}

// ジャンルフィルター（大文字小文字・配列対応）
function genreMatches(post,filter){
  if(filter==='ALL')return true;
  const genres=parseGenre(post.genre);
  return genres.some(g=>g===filter||g.toUpperCase()===filter.toUpperCase());
}

function applyFilter(){
  let posts=[...allDBPosts];
  if(currentTab==='board')posts=posts.filter(p=>!p.post_type||p.post_type==='board');
  else if(currentTab==='gear')posts=posts.filter(p=>p.post_type==='gear');
  if(currentGenreFilter!=='ALL')posts=posts.filter(p=>genreMatches(p,currentGenreFilter));
  if(currentBrandFilter){
    posts=posts.filter(p=>{
      const g=Array.isArray(p.gear_list)?p.gear_list:[];
      return g.some(x=>(x.brand||x.name||x||'').toLowerCase().includes(currentBrandFilter.toLowerCase()));
    });
  }
  // エフェクタータイプフィルター（pedalsテーブルのtypesと照合）
  if(currentFxFilter){
    posts=posts.filter(p=>{
      const g=Array.isArray(p.gear_list)?p.gear_list:[];
      return g.some(x=>{
        const types=Array.isArray(x.types)?x.types:(x.types?[x.types]:[]);
        return types.some(t=>(t||'').toLowerCase()===currentFxFilter.toLowerCase());
      });
    });
  }
  // フリーワード検索
  if(currentSearchQuery){
    posts=posts.filter(p=>searchMatches(p,currentSearchQuery));
    const badgeText='「'+currentSearchQuery+'」の検索結果：'+posts.length+'件';
    const badge=document.getElementById('search-badge');
    if(badge){badge.textContent=badgeText;badge.classList.add('show');}
    const mobBadge=document.getElementById('mob-search-badge');
    if(mobBadge){mobBadge.textContent=badgeText;mobBadge.classList.add('show');}
  }else{
    const badge=document.getElementById('search-badge');
    if(badge)badge.classList.remove('show');
    const mobBadge=document.getElementById('mob-search-badge');
    if(mobBadge)mobBadge.classList.remove('show');
  }
  if(currentSort==='likes')posts.sort((a,b)=>(b.likes||0)-(a.likes||0));
  renderDBPosts(posts);
}

function timeAgo(ts){
  const d=Math.floor((Date.now()-new Date(ts))/1000);
  if(d<60)return'たった今';if(d<3600)return Math.floor(d/60)+'分前';if(d<86400)return Math.floor(d/3600)+'時間前';return Math.floor(d/86400)+'日前';
}

function getEmptyHTML(){
  const isFiltered=currentGenreFilter!=='ALL'||currentBrandFilter!==null||currentFxFilter!==null;
  if(!isFiltered)return '<div style="grid-column:1/-1;text-align:center;padding:40px;font-family:\'JetBrains Mono\',monospace;font-size:11px;color:var(--td)">投稿がありません</div>';
  const label=currentFxFilter||currentBrandFilter||currentGenreFilter;
  const promo=currentFxFilter?'このエフェクタータイプを使った投稿がまだありません':currentBrandFilter?'このブランドの機材を投稿してみましょう！':'このジャンルで最初に投稿してみましょう！';
  return '<div class="empty-filter"><div class="empty-filter-msg">「'+label+'」の投稿はまだありません</div><div class="empty-filter-promo">'+promo+'</div><div class="empty-filter-btn" onclick="clearFilter()">← フィルターを解除</div></div>';
}

function clearFilter(){
  currentGenreFilter='ALL';currentBrandFilter=null;currentFxFilter=null;
  document.querySelectorAll('.sl .tag, #swipe-ui .tag').forEach(t=>{
    t.classList.toggle('on',t.getAttribute('data-genre')==='ALL');
  });
  clearSearch();
}

function renderDBPosts(posts){
  const grid=document.getElementById('card-grid');
  const gridMob=document.getElementById('card-grid-mob');
  const html=posts.length?posts.map((p,i)=>{
    const init=(p.username||'匿')[0].toUpperCase();
    const gear=Array.isArray(p.gear_list)?p.gear_list:[];
    const tags=gear.slice(0,3).map(g=>'<span class="ptag">'+(g.name||g)+'</span>').join('');
    const isGear=p.post_type==='gear';
    const genres=parseGenre(p.genre);
    const glabel=genres.slice(0,2).join(' · ');
    const destUrl='/post?id='+p.id;
    const ytBadge=p.youtube_url?'<div class="yt-bdg">▶ YouTube</div>':'';
    return '<div class="card" onclick="location.href=\''+destUrl+'\'" style="animation-delay:'+(i*.05)+'s">'
      +'<div class="iw">'+(p.image_urls&&p.image_urls[0]?'<img src="'+p.image_urls[0]+'" loading="lazy">':'<div style="font-size:40px;opacity:.2">'+(isGear?'🎸':'🎛')+'</div>')
      +'<div class="iw-ov"></div>'+(isGear?'<div class="bdg gear-bdg">機材</div>':(glabel?'<div class="bdg">'+glabel+'</div>':''))+ytBadge+'</div>'
      +'<div class="body"><div class="cu"><div class="av">'+init+'</div>'
      +'<div class="av-name">'+(p.username||'匿名ユーザー')+'</div>'
      +'<div class="av-time">'+timeAgo(p.created_at)+'</div></div>'
      +'<div class="ct">'+p.title+'</div><div class="ptags">'+tags+'</div>'
      +'<div class="cf"><div class="st" onclick="toggleDBLike(event,\''+p.id+'\',this)">❤️ <span>'+(p.likes||0)+'</span></div>'
      +'<div class="st">💬 <span>'+(p.comment_count||0)+'</span></div></div></div></div>';
  }).join(''):getEmptyHTML();
  if(grid)grid.innerHTML=html;
  if(gridMob)gridMob.innerHTML=html;
}

async function toggleDBLike(e,postId,el){
  e.stopPropagation();
  const cnt=el.querySelector('span');
  const{data:ex}=await sb.from('likes').select('id').eq('post_id',postId).eq('session_id',SESSION_ID);
  if(ex&&ex.length){
    await sb.from('likes').delete().eq('post_id',postId).eq('session_id',SESSION_ID);
    const n=Math.max(0,(parseInt(cnt.textContent)||1)-1);
    await sb.from('posts').update({likes:n}).eq('id',postId);cnt.textContent=n;el.classList.remove('liked');
  }else{
    await sb.from('likes').insert({post_id:postId,session_id:SESSION_ID});
    const n=(parseInt(cnt.textContent)||0)+1;
    await sb.from('posts').update({likes:n}).eq('id',postId);cnt.textContent=n;el.classList.add('liked');showToast('❤️ いいねしました');
  }
}

function filterGenre(el,genre){
  document.querySelectorAll('.sl .tag').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');currentGenreFilter=genre||'ALL';currentBrandFilter=null;currentFxFilter=null;applyFilter();
}
function filterBrand(el,brand){
  document.querySelectorAll('.sl .tag').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');currentBrandFilter=brand;currentGenreFilter='ALL';currentFxFilter=null;applyFilter();
}
function filterFx(el,fx){
  document.querySelectorAll('.sl .tag').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');currentFxFilter=fx;currentBrandFilter=null;currentGenreFilter='ALL';applyFilter();
}
function setTab(el,tab){
  document.querySelectorAll('.feed-tab').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');currentTab=tab;
  const fh=document.getElementById('feed-heading');if(fh)fh.textContent=tab==='gear'?'GEAR':'PEDALBOARDS';
  const fhm=document.getElementById('feed-heading-mob');if(fhm)fhm.textContent=tab==='gear'?'GEAR':'PEDALBOARDS';
  applyFilter();
}
function setSort(el,sort){document.querySelectorAll('.sort-b').forEach(b=>b.classList.remove('on'));el.classList.add('on');currentSort=sort;applyFilter();}

function renderRankingWidget(posts){
  const el=document.getElementById('ranking-widget');if(!el)return;
  const bp=posts.filter(p=>!p.post_type||p.post_type==='board');
  const monthAgo=Date.now()-30*24*60*60*1000;
  const monthly=bp.filter(p=>new Date(p.created_at).getTime()>monthAgo);
  const target=monthly.length>=3?monthly:bp;
  const sorted=[...target].sort((a,b)=>(b.likes||0)-(a.likes||0)).slice(0,5);
  if(!sorted.length){el.innerHTML='<div style="font-size:10px;color:var(--td);font-family:JetBrains Mono,monospace">まだ投稿がありません</div>';return;}
  el.innerHTML=sorted.map((p,i)=>{
    const crown=i===0?'<span style="margin-right:4px">👑</span>':'';
    return '<div class="ri" onclick="location.href=\'/post?id='+p.id+'\'">'
      +'<div class="rn '+(i<2?'hi':'')+'">'+crown+(i+1)+'</div>'
      +'<div class="ri-i"><div class="ri-t">'+p.title+'</div><div class="ri-u">'+(p.username||'匿名')+'</div></div>'
      +'<div class="ri-s">❤️'+(p.likes||0)+'</div></div>';
  }).join('');
}

function soundhouseUrl(name){return'https://www.soundhouse.co.jp/search/index?search_all='+encodeURIComponent(name);}

function renderGearWidget(posts){
  const el=document.getElementById('gear-widget');if(!el)return;
  const count={};
  posts.forEach(p=>{const g=Array.isArray(p.gear_list)?p.gear_list:[];g.forEach(x=>{const n=(x.name||x||'').trim();if(n)count[n]=(count[n]||0)+1;});});
  const sorted=Object.entries(count).sort((a,b)=>b[1]-a[1]).slice(0,5);
  if(!sorted.length){el.innerHTML='<div style="font-size:10px;color:var(--td);font-family:JetBrains Mono,monospace">データなし</div>';return;}
  el.innerHTML=sorted.map(([n,c])=>'<div class="gr" style="cursor:pointer" onclick="filterByGearName(\''+n.replace(/'/g,"\\'")+'\'">'
    +'<div class="gr-i"><div class="gr-n">'+n+'</div><div class="gr-b">'+c+'件の投稿</div></div>'
    +'<a href="'+soundhouseUrl(n)+'" target="_blank" rel="noopener" onclick="event.stopPropagation()" style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;flex-shrink:0;text-decoration:none;background:var(--sf2);border:1px solid var(--bd);border-radius:4px;font-size:13px">🔍</a>'
    +'</div>').join('');
}

function filterByGearName(name){
  currentBrandFilter=null;currentGenreFilter='ALL';
  const posts=allDBPosts.filter(p=>{
    const g=Array.isArray(p.gear_list)?p.gear_list:[];
    return g.some(x=>(x.name||x||'').toLowerCase()===name.toLowerCase());
  });
  renderDBPosts(posts.length?posts:[]);
  if(window.innerWidth<=680)setTimeout(()=>goPanel(1),180);
}

// ── フリーワード検索（PC用）
let currentSearchQuery='';

function handleSearch(val){
  currentSearchQuery=val.trim();
  const clearBtn=document.getElementById('h-search-clear');
  if(clearBtn)clearBtn.classList.toggle('show',currentSearchQuery.length>0);
  applyFilter();
}

function clearSearch(){
  currentSearchQuery='';
  const input=document.getElementById('h-search');
  if(input)input.value='';
  const clearBtn=document.getElementById('h-search-clear');
  if(clearBtn)clearBtn.classList.remove('show');
  const badge=document.getElementById('search-badge');
  if(badge)badge.classList.remove('show');
  applyFilter();
}

// スマホ用検索
function handleSearchMob(val){
  currentSearchQuery=val.trim();
  const clearBtn=document.getElementById('mob-search-clear');
  if(clearBtn)clearBtn.classList.toggle('show',currentSearchQuery.length>0);
  applyFilter();
}

function clearSearchMob(){
  currentSearchQuery='';
  const input=document.getElementById('mob-search');
  if(input)input.value='';
  const clearBtn=document.getElementById('mob-search-clear');
  if(clearBtn)clearBtn.classList.remove('show');
  const badge=document.getElementById('mob-search-badge');
  if(badge)badge.classList.remove('show');
  applyFilter();
}

function searchMatches(post,query){
  if(!query)return true;
  const q=query.toLowerCase();
  const title=(post.title||'').toLowerCase();
  const username=(post.username||'').toLowerCase();
  const desc=(post.description||'').toLowerCase();
  const gear=Array.isArray(post.gear_list)?post.gear_list:[];
  const gearStr=gear.map(g=>(g.name||g||'').toLowerCase()).join(' ');
  const genres=parseGenre(post.genre).join(' ').toLowerCase();
  return title.includes(q)||username.includes(q)||desc.includes(q)||gearStr.includes(q)||genres.includes(q);
}
let selectedGears=[],acResults=[],acFocusIdx=-1;
async function searchGear(val){
  const q=val.trim();closeAC();if(!q)return;
  const{data:prefixData}=await sb.from('pedals').select('brand,model,full_name')
    .or('brand.ilike.'+q+'%,model.ilike.'+q+'%,full_name.ilike.'+q+'%').limit(10);
  let results=prefixData||[];
  if(results.length<5){
    const{data:fuzzy}=await sb.from('pedals').select('brand,model,full_name').ilike('full_name','%'+q+'%').limit(10);
    if(fuzzy)fuzzy.forEach(x=>{if(!results.find(r=>r.full_name===x.full_name))results.push(x);});
  }
  results=results.slice(0,10);acResults=results;acFocusIdx=-1;
  const dd=document.getElementById('ac-dropdown');
  if(!results.length){dd.innerHTML='<div class="ac-empty">「'+q+'」— 候補なし　Enterで追加</div>';dd.classList.add('open');return;}
  dd.innerHTML=results.map((x,i)=>'<div class="ac-item" onmousedown="selectGear('+i+')" onmouseover="setACFocus('+i+')"><div class="ac-item-name">'+x.full_name+'</div><div class="ac-item-brand">'+x.brand+'</div></div>').join('');
  dd.classList.add('open');
}
function setACFocus(i){acFocusIdx=i;document.querySelectorAll('.ac-item').forEach((el,j)=>el.classList.toggle('focus',j===i));}
function selectGear(i){const x=acResults[i];if(!x)return;addGearTag({name:x.full_name,brand:x.brand});closeAC();}
function addGearTag(g){
  if(selectedGears.find(x=>x.name===g.name))return;
  if(selectedGears.length>=20){showToast('⚠️ 最大20件まで');return;}
  selectedGears.push(g);renderGearTags();document.getElementById('gear-search').value='';
}
function removeGearTag(i){selectedGears.splice(i,1);renderGearTags();}
function renderGearTags(){
  const wrap=document.getElementById('gear-tags');if(!wrap)return;
  const inp=document.getElementById('gear-search');
  wrap.querySelectorAll('.gear-tag').forEach(el=>el.remove());
  selectedGears.forEach((g,i)=>{
    const tag=document.createElement('div');tag.className='gear-tag';
    tag.innerHTML=g.name+'<button class="gear-tag-x" onmousedown="event.preventDefault();removeGearTag('+i+')">✕</button>';
    wrap.insertBefore(tag,inp);
  });
}
function gearKeyDown(e){
  const dd=document.getElementById('ac-dropdown');const open=dd.classList.contains('open');
  if(e.key==='ArrowDown'){e.preventDefault();if(open)setACFocus(Math.min(acFocusIdx+1,acResults.length-1));}
  else if(e.key==='ArrowUp'){e.preventDefault();setACFocus(Math.max(acFocusIdx-1,0));}
  else if(e.key==='Enter'){
    e.preventDefault();
    if(open&&acFocusIdx>=0&&acResults[acFocusIdx])selectGear(acFocusIdx);
    else{const v=e.target.value.trim();if(v)addGearTag({name:v,brand:''});}
  }else if(e.key==='Backspace'&&!e.target.value&&selectedGears.length)removeGearTag(selectedGears.length-1);
  else if(e.key==='Escape')closeAC();
}
function closeAC(){document.getElementById('ac-dropdown').classList.remove('open');}
function toggleGenre(el){el.classList.toggle('on');}

// ステップフォーム
let currentStep=1,currentPostType='board';
const TOTAL_STEPS=5;
function openPost(type){
  currentPostType=type||'board';currentStep=1;selectedGears=[];uploadedPhotos=[];editedPhotos=[];
  document.querySelectorAll('#post-genre-select .gs').forEach(g=>g.classList.remove('on'));
  ['post-username','post-desc','post-youtube','post-title'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  ['pd1','pd2','pd3','pd4'].forEach(id=>{document.getElementById(id).value='';});
  renderGearTags();renderPhotoPreviews();updateStepUI();
  document.getElementById('post-bd').classList.add('open');document.body.style.overflow='hidden';
}
function goStep(n){
  if(n===3&&currentStep===2){if(!document.getElementById('post-title').value.trim()){showToast('❌ タイトルを入力してください');return;}}
  if(n===5)renderConfirm();
  currentStep=n;updateStepUI();
  if(n===3)renderStep3PhotoPreview();
}
function renderStep3PhotoPreview(){
  const wrap=document.getElementById('step3-photo-preview');if(!wrap)return;
  if(!uploadedPhotos.length){wrap.style.display='none';return;}
  wrap.style.display='flex';
  wrap.innerHTML=uploadedPhotos.map((src,i)=>{
    const disp=editedPhotos[i]||src;
    return '<img src="'+disp+'" style="width:72px;height:72px;object-fit:cover;border-radius:4px;border:1px solid var(--bd);cursor:pointer" onclick="openImgEditor('+i+')" title="タップして編集">';
  }).join('');
}
function updateStepUI(){
  document.querySelectorAll('.step-panel').forEach((el,i)=>el.classList.toggle('on',i+1===currentStep));
  document.getElementById('step-title').textContent=currentPostType==='board'?'エフェクターボードを投稿':'機材を投稿';
  document.getElementById('step-sub').textContent='Step '+currentStep+' / '+TOTAL_STEPS;
  document.getElementById('step-dots').innerHTML=Array.from({length:TOTAL_STEPS},(_,i)=>'<div class="step-dot '+(i+1===currentStep?'on':i+1<currentStep?'done':'')+'"></div>').join('');
}
function renderConfirm(){
  const username=document.getElementById('post-username').value.trim()||'匿名ユーザー';
  const title=document.getElementById('post-title').value.trim();
  const desc=document.getElementById('post-desc').value.trim();
  const yt=document.getElementById('post-youtube').value.trim();
  const genres=[...document.querySelectorAll('#post-genre-select .gs.on')].map(el=>el.getAttribute('data-val')||el.textContent.trim());
  document.getElementById('confirm-content').innerHTML=[
    ['タイプ',currentPostType==='board'?'エフェクターボード':'MY GEAR'],
    ['ユーザー名',username],['タイトル',title||'(未入力)'],
    ['機材',selectedGears.map(g=>g.name).join(', ')||'(未入力)'],
    ['ジャンル',genres.join(', ')||'(未選択)'],
    ['説明',desc?desc.slice(0,60)+(desc.length>60?'...':''):'(なし)'],
    ['YouTube',yt||'(なし)'],
    ['写真',(editedPhotos.filter(x=>x).length||uploadedPhotos.length)+'枚'],
  ].map(([l,v])=>'<div class="confirm-row"><div class="confirm-lbl">'+l+'</div><div class="confirm-val">'+v+'</div></div>').join('');
}

// 写真
let uploadedPhotos=[],editedPhotos=[];
const MAX_PHOTOS=3,MAX_DIM=1280,JPEG_QUALITY=0.82;
function compressImage(dataUrl){
  return new Promise(resolve=>{
    const img=new Image();
    img.onload=()=>{
      let{width,height}=img;
      if(width>MAX_DIM||height>MAX_DIM){const ratio=Math.min(MAX_DIM/width,MAX_DIM/height);width=Math.round(width*ratio);height=Math.round(height*ratio);}
      const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
      canvas.getContext('2d').drawImage(img,0,0,width,height);
      resolve(canvas.toDataURL('image/jpeg',JPEG_QUALITY));
    };img.src=dataUrl;
  });
}
function handlePhotos(e){
  const files=Array.from(e.target.files);const rem=MAX_PHOTOS-uploadedPhotos.length;
  files.slice(0,rem).forEach(f=>{
    const r=new FileReader();
    r.onload=async ev=>{const compressed=await compressImage(ev.target.result);uploadedPhotos.push(compressed);editedPhotos.push(null);renderPhotoPreviews();};
    r.readAsDataURL(f);
  });
  if(files.length>rem)showToast('⚠️ 最大'+MAX_PHOTOS+'枚まで');e.target.value='';
}
function renderPhotoPreviews(){
  const wrap=document.getElementById('photo-previews');if(!wrap)return;
  const thumbs=uploadedPhotos.map((src,i)=>{
    const displaySrc=editedPhotos[i]||src;
    return '<div class="photo-thumb"><img src="'+displaySrc+'">'
      +'<button class="photo-remove" onclick="removePhoto('+i+')">✕</button>'
      +'<button class="photo-edit-btn" onclick="openImgEditor('+i+')">✏️ 編集</button>'
      +'</div>';
  }).join('');
  const add=uploadedPhotos.length<MAX_PHOTOS?'<div class="photo-add-btn" onclick="document.getElementById(\'photo-input\').click()"><span>＋</span><span class="photo-add-label">追加</span></div>':'';
  wrap.innerHTML=thumbs+add;
  const cnt=document.getElementById('photo-count');if(cnt)cnt.textContent=uploadedPhotos.length+' / '+MAX_PHOTOS+'枚';
  const ua=document.getElementById('upload-area-main');if(ua)ua.style.display=uploadedPhotos.length>0?'none':'block';
}
function removePhoto(i){uploadedPhotos.splice(i,1);editedPhotos.splice(i,1);renderPhotoPreviews();}
function getFinalPhoto(i){return editedPhotos[i]||uploadedPhotos[i]||null;}

function setUploadProgress(current,total,msg){
  const wrap=document.getElementById('upload-progress-wrap');
  const bar=document.getElementById('upload-progress-bar');
  const msgEl=document.getElementById('upload-progress-msg');
  if(!wrap)return;wrap.classList.add('show');
  bar.style.width=Math.round(current/total*100)+'%';
  if(msgEl)msgEl.textContent=msg||'アップロード中...';
}
function hideUploadProgress(){const wrap=document.getElementById('upload-progress-wrap');if(wrap)wrap.classList.remove('show');}

async function uploadPhoto(b64,idx,total){
  try{
    const byteStr=atob(b64.split(',')[1]);
    const mime=b64.split(',')[0].split(':')[1].split(';')[0];
    const ab=new ArrayBuffer(byteStr.length);const ia=new Uint8Array(ab);
    for(let i=0;i<byteStr.length;i++)ia[i]=byteStr.charCodeAt(i);
    const blob=new Blob([ab],{type:mime});
    const ext=mime.includes('png')?'png':'jpg';
    const fn='posts/'+Date.now()+'_'+idx+'.'+ext;
    setUploadProgress(idx,total,'📤 '+(idx+1)+' / '+total+'枚目をアップロード中...');
    const{error}=await sb.storage.from('post-images').upload(fn,blob,{contentType:mime});
    if(error)return null;
    const{data:u}=sb.storage.from('post-images').getPublicUrl(fn);
    setUploadProgress(idx+1,total,'📤 '+(idx+1)+' / '+total+'枚目 完了');
    return u.publicUrl;
  }catch(e){console.error(e);return null;}
}

async function submitPostToDB(){
  const btn=document.getElementById('submit-btn');
  if(btn){btn.disabled=true;btn.textContent='投稿中...';}
  const title=document.getElementById('post-title').value.trim();
  const desc=document.getElementById('post-desc').value.trim();
  const ytRaw=document.getElementById('post-youtube').value.trim();
  const ytMatch=ytRaw.match(/(https?:\/\/[^\s]+)/);
  const youtube_url=ytMatch?ytMatch[1]:null;
  const genres=[...document.querySelectorAll('#post-genre-select .gs.on')].map(el=>el.getAttribute('data-val')||el.textContent.trim());
  const pin=['pd1','pd2','pd3','pd4'].map(id=>document.getElementById(id).value).join('');
  if(!title){showToast('❌ タイトルを入力してください');if(btn){btn.disabled=false;btn.textContent='投稿する';}return;}
  if(pin.length<4){showToast('❌ 4桁パスワードを設定してください');if(btn){btn.disabled=false;btn.textContent='投稿する';}return;}
  let image_urls=[];
  if(uploadedPhotos.length>0){
    const finals=uploadedPhotos.map((_,i)=>getFinalPhoto(i));
    const total=finals.filter(x=>x).length;
    setUploadProgress(0,total,'📤 画像をアップロード中...');
    for(let i=0;i<finals.length;i++){if(finals[i]){const url=await uploadPhoto(finals[i],i,total);if(url)image_urls.push(url);}}
    hideUploadProgress();
  }
  const{error}=await sb.from('posts').insert({
    username:document.getElementById('post-username').value.trim()||'匿名ユーザー',
    title,description:desc,genre:genres,
    gear_list:selectedGears.map(g=>({name:g.name,brand:g.brand||''})),
    image_urls,pin_hash:pin,likes:0,post_type:currentPostType,youtube_url
  });
  if(btn){btn.disabled=false;btn.textContent='投稿する';}
  if(error){showToast('❌ 投稿に失敗しました');console.error(error);return;}
  closeModal('post-bd');
  selectedGears=[];uploadedPhotos=[];editedPhotos=[];
  ['post-username','post-title','post-desc','post-youtube'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  ['pd1','pd2','pd3','pd4'].forEach(id=>{document.getElementById(id).value='';});
  document.querySelectorAll('#post-genre-select .gs.on').forEach(el=>el.classList.remove('on'));
  document.getElementById('done-sub').textContent=currentPostType==='gear'?'あなたの機材が公開されました！':'あなたのボードが公開されました！';
  document.getElementById('done-bd').classList.add('open');
  await loadPostsFromDB();
}

// 編集モーダル
function openEditModal(){
  if(!currentDBPost)return;
  ['pin1','pin2','pin3','pin4'].forEach(id=>{document.getElementById(id).value='';});
  document.getElementById('pin-err').textContent='';
  document.getElementById('edit-step1').style.display='block';
  document.getElementById('edit-step2').style.display='none';
  document.getElementById('edit-bd').classList.add('open');
  document.body.style.overflow='hidden';
  setTimeout(()=>document.getElementById('pin1').focus(),300);
}
function verifyPin(){
  const entered=['pin1','pin2','pin3','pin4'].map(id=>document.getElementById(id).value).join('');
  if(entered.length<4){document.getElementById('pin-err').textContent='4桁すべて入力してください';return;}
  const isMaster=entered.toUpperCase()===MASTER_KEY;
  if(currentDBPost&&(isMaster||entered===currentDBPost.pin_hash)){
    document.getElementById('pin-err').textContent='';
    document.getElementById('edit-step1').style.display='none';
    document.getElementById('edit-title').value=currentDBPost.title||'';
    const gear=Array.isArray(currentDBPost.gear_list)?currentDBPost.gear_list:[];
    document.getElementById('edit-pedals').value=gear.map(g=>g.name||g).join(', ');
    document.getElementById('edit-desc').value=currentDBPost.description||'';
    const ytRaw=currentDBPost.youtube_url||'';
    const ytMatch=ytRaw.match(/(https?:\/\/[^\s]+)/);
    document.getElementById('edit-youtube').value=ytMatch?ytMatch[1]:'';
    document.getElementById('edit-step2').style.display='block';
    if(isMaster)showToast('🔑 管理者としてログインしました');
  }else{
    document.getElementById('pin-err').textContent='❌ パスワードが違います';
    ['pin1','pin2','pin3','pin4'].forEach(id=>{document.getElementById(id).value='';});
    document.getElementById('pin1').focus();
  }
}
async function saveEdit(){
  const title=document.getElementById('edit-title').value.trim();
  if(!title){showToast('タイトルを入力してください');return;}
  const gt=document.getElementById('edit-pedals').value.trim();
  const gear_list=gt?gt.split(',').map(s=>({name:s.trim()})).filter(g=>g.name):[];
  const description=document.getElementById('edit-desc').value.trim();
  const youtube_url=document.getElementById('edit-youtube').value.trim()||null;
  const{error}=await sb.from('posts').update({title,gear_list,description,youtube_url}).eq('id',currentDBPost.id);
  if(error){showToast('❌ 更新に失敗しました');return;}
  closeModal('edit-bd');showToast('✅ 投稿を更新しました');await loadPostsFromDB();
}
async function confirmDelete(){
  if(!confirm('本当にこの投稿を削除しますか？\nこの操作は取り消せません。'))return;
  const{error}=await sb.from('posts').delete().eq('id',currentDBPost.id);
  if(error){showToast('❌ 削除に失敗しました');return;}
  closeModal('edit-bd');showToast('🗑 投稿を削除しました');await loadPostsFromDB();
}

// ── 画像編集（ステッカー配置順修正・タップ削除修正・ピンチズーム）
let editorPhotoIndex=0,editorCanvas=null,editorCtx=null,editorImage=null;
let editorNumbers=[],editorMode='none';
let cropStart=null,cropBox={x:0,y:0,w:0,h:0},cropActive=false,cropDragging=false,cropHandleDrag=null;
let isDraggingNum=false,dragNumIdx=-1,dragOffX=0,dragOffY=0,dragMoved=false;
let pinchActive=false,pinchStartDist=0,pinchNumIdx=-1,pinchStartSize=20;
const DEFAULT_STICKER_SIZE=20;

// 右上→左の順でステッカーを配置
function getStickerPosition(num,canvasW,canvasH){
  const cols=6;
  const idx=num-1;
  const row=Math.floor(idx/cols);
  const colInRow=idx%cols;
  const col=(cols-1)-colInRow; // 右から左
  const cellW=canvasW/cols;
  const totalRows=Math.ceil(24/cols); // 最大24個想定
  const cellH=canvasH/Math.max(totalRows,4);
  const margin=DEFAULT_STICKER_SIZE+4;
  return{
    x:Math.min(canvasW-margin,Math.max(margin,cellW*(col+0.5))),
    y:Math.min(canvasH-margin,Math.max(margin,cellH*(row+0.5)))
  };
}

function openImgEditor(idx){
  editorPhotoIndex=idx;editorNumbers=[];editorMode='none';
  cropStart=null;cropBox={x:0,y:0,w:0,h:0};cropActive=false;cropDragging=false;cropHandleDrag=null;
  const bd=document.getElementById('img-editor-bd');
  bd.classList.add('open');document.body.style.overflow='hidden';
  const tabBar=document.getElementById('img-tab-bar');
  tabBar.innerHTML=uploadedPhotos.map((_,i)=>'<div class="img-tab'+(i===idx?' on':'')+'" onclick="switchEditorPhoto('+i+')">写真'+(i+1)+'</div>').join('');
  loadEditorImage(editedPhotos[idx]||uploadedPhotos[idx]);
  updateToolUI();
}
function switchEditorPhoto(idx){
  saveCurrentEditorState();editorPhotoIndex=idx;editorNumbers=[];editorMode='none';
  cropStart=null;cropBox={x:0,y:0,w:0,h:0};cropActive=false;
  document.querySelectorAll('.img-tab').forEach((t,i)=>t.classList.toggle('on',i===idx));
  loadEditorImage(editedPhotos[idx]||uploadedPhotos[idx]);updateToolUI();
}
function loadEditorImage(src){
  const canvas=document.getElementById('editor-canvas');
  const wrap=document.getElementById('canvas-wrap');
  editorCanvas=canvas;editorCtx=canvas.getContext('2d');
  const img=new Image();
  img.onload=()=>{
    editorImage=img;
    const maxW=wrap.clientWidth||360;const maxH=wrap.clientHeight||400;
    const scale=Math.min(maxW/img.width,maxH/img.height,1);
    canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);
    drawEditor();
  };img.src=src;
}
function drawEditor(){
  if(!editorCtx||!editorImage)return;
  const c=editorCanvas,ctx=editorCtx;
  ctx.clearRect(0,0,c.width,c.height);
  ctx.drawImage(editorImage,0,0,c.width,c.height);
  if(editorMode==='crop'&&cropActive){
    ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(0,0,c.width,c.height);
    ctx.clearRect(cropBox.x,cropBox.y,cropBox.w,cropBox.h);
    ctx.drawImage(editorImage,cropBox.x/c.width*editorImage.naturalWidth,cropBox.y/c.height*editorImage.naturalHeight,
      cropBox.w/c.width*editorImage.naturalWidth,cropBox.h/c.height*editorImage.naturalHeight,
      cropBox.x,cropBox.y,cropBox.w,cropBox.h);
    ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.setLineDash([]);ctx.strokeRect(cropBox.x,cropBox.y,cropBox.w,cropBox.h);
    [{x:cropBox.x,y:cropBox.y},{x:cropBox.x+cropBox.w,y:cropBox.y},{x:cropBox.x,y:cropBox.y+cropBox.h},{x:cropBox.x+cropBox.w,y:cropBox.y+cropBox.h}].forEach(h=>{
      ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(h.x,h.y,8,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#e8552d';ctx.lineWidth=2;ctx.stroke();
    });
    ctx.setLineDash([]);
  }
  editorNumbers.forEach(n=>{
    const r=n.size||DEFAULT_STICKER_SIZE;
    ctx.beginPath();ctx.arc(n.x,n.y,r,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,.95)';ctx.fill();
    ctx.strokeStyle='#e8552d';ctx.lineWidth=2.5;ctx.stroke();
    ctx.fillStyle='#111';
    const fs=Math.max(10,Math.round(r*0.65));
    ctx.font='bold '+fs+'px JetBrains Mono,monospace';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(n.num,n.x,n.y);
  });
}
function setTool(mode){
  editorMode=editorMode===mode?'none':mode;updateToolUI();
  const hints={crop:'ドラッグしてトリミング範囲を選択',move:'タップで削除・ドラッグで移動・ピンチでサイズ変更',none:'「番号追加」ボタンで番号を追加'};
  document.getElementById('editor-hint').textContent=hints[editorMode]||hints.none;
  drawEditor();
}
function addNumberSticker(){
  if(!editorCanvas)return;
  const num=editorNumbers.length+1;
  const pos=getStickerPosition(num,editorCanvas.width,editorCanvas.height);
  editorNumbers.push({x:pos.x,y:pos.y,num,size:DEFAULT_STICKER_SIZE});
  editorMode='move';updateToolUI();
  document.getElementById('editor-hint').textContent='タップで削除・ドラッグで移動・ピンチでサイズ変更';
  drawEditor();showToast('番号 '+num+' を追加しました');
}
function updateToolUI(){
  ['crop','move'].forEach(id=>{const btn=document.getElementById('tool-'+id);if(btn)btn.classList.toggle('active',editorMode===id);});
}
function resetEdits(){editorNumbers=[];cropBox={x:0,y:0,w:0,h:0};cropActive=false;cropStart=null;loadEditorImage(uploadedPhotos[editorPhotoIndex]);showToast('↩️ リセットしました');}

// 画像を90度右回転
function rotateImage(){
  if(!editorImage)return;
  const canvas=document.createElement('canvas');
  canvas.width=editorImage.naturalHeight;
  canvas.height=editorImage.naturalWidth;
  const ctx=canvas.getContext('2d');
  ctx.translate(canvas.width/2,canvas.height/2);
  ctx.rotate(Math.PI/2);
  ctx.drawImage(editorImage,-editorImage.naturalWidth/2,-editorImage.naturalHeight/2);
  const rotated=canvas.toDataURL('image/jpeg',0.92);
  // 回転後の画像をベースとして更新
  uploadedPhotos[editorPhotoIndex]=rotated;
  editedPhotos[editorPhotoIndex]=null;
  editorNumbers=[];cropBox={x:0,y:0,w:0,h:0};cropActive=false;
  loadEditorImage(rotated);
  showToast('🔄 90度回転しました');
}

function saveCurrentEditorState(){
  if(!editorCanvas||!editorImage)return;
  const c=editorCanvas;let sx=0,sy=0,sw=editorImage.naturalWidth,sh=editorImage.naturalHeight;
  if(cropActive&&cropBox.w>10&&cropBox.h>10){
    const scaleX=editorImage.naturalWidth/c.width;const scaleY=editorImage.naturalHeight/c.height;
    sx=cropBox.x*scaleX;sy=cropBox.y*scaleY;sw=cropBox.w*scaleX;sh=cropBox.h*scaleY;
  }
  const out=document.createElement('canvas');out.width=Math.round(sw);out.height=Math.round(sh);
  const ctx=out.getContext('2d');ctx.drawImage(editorImage,sx,sy,sw,sh,0,0,out.width,out.height);
  editorNumbers.forEach(n=>{
    const realX=n.x/c.width*editorImage.naturalWidth-sx;
    const realY=n.y/c.height*editorImage.naturalHeight-sy;
    if(realX<0||realY<0||realX>sw||realY>sh)return;
    const r=Math.round((n.size||DEFAULT_STICKER_SIZE)/c.width*editorImage.naturalWidth);
    const fs=Math.max(10,Math.round(r*0.65));
    ctx.beginPath();ctx.arc(realX,realY,r,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,.95)';ctx.fill();
    ctx.strokeStyle='#e8552d';ctx.lineWidth=Math.max(2,Math.round(r*0.1));ctx.stroke();
    ctx.fillStyle='#111';ctx.font='bold '+fs+'px JetBrains Mono,monospace';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n.num,realX,realY);
  });
  editedPhotos[editorPhotoIndex]=out.toDataURL('image/jpeg',0.92);
}
function finishEdit(){saveCurrentEditorState();document.getElementById('img-editor-bd').classList.remove('open');document.body.style.overflow='hidden';renderPhotoPreviews();showToast('✅ 編集を保存しました');}

function getCanvasPos(touch){
  const rect=editorCanvas.getBoundingClientRect();
  const scaleX=editorCanvas.width/rect.width;const scaleY=editorCanvas.height/rect.height;
  return{x:(touch.clientX-rect.left)*scaleX,y:(touch.clientY-rect.top)*scaleY};
}
function getTouchDist(t1,t2){return Math.hypot(t2.clientX-t1.clientX,t2.clientY-t1.clientY);}
function getCropHandle(pos){
  if(!cropActive)return null;
  const handles=[{id:'tl',x:cropBox.x,y:cropBox.y},{id:'tr',x:cropBox.x+cropBox.w,y:cropBox.y},{id:'bl',x:cropBox.x,y:cropBox.y+cropBox.h},{id:'br',x:cropBox.x+cropBox.w,y:cropBox.y+cropBox.h}];
  return handles.find(h=>Math.hypot(h.x-pos.x,h.y-pos.y)<20)||null;
}

function canvasPointerDown(e){
  e.preventDefault();
  if(e.touches&&e.touches.length===2){
    pinchActive=true;pinchStartDist=getTouchDist(e.touches[0],e.touches[1]);
    const midX=(e.touches[0].clientX+e.touches[1].clientX)/2;
    const midY=(e.touches[0].clientY+e.touches[1].clientY)/2;
    const mid=getCanvasPos({clientX:midX,clientY:midY});
    let minD=Infinity;
    editorNumbers.forEach((n,i)=>{const d=Math.hypot(n.x-mid.x,n.y-mid.y);if(d<minD){minD=d;pinchNumIdx=i;}});
    if(minD>100)pinchNumIdx=-1;
    pinchStartSize=pinchNumIdx>=0?(editorNumbers[pinchNumIdx].size||DEFAULT_STICKER_SIZE):DEFAULT_STICKER_SIZE;
    return;
  }
  pinchActive=false;
  const touch=e.touches?e.touches[0]:e;
  const pos=getCanvasPos(touch);
  dragMoved=false;
  if(editorMode==='move'){
    const hit=editorNumbers.findIndex(n=>Math.hypot(n.x-pos.x,n.y-pos.y)<(n.size||DEFAULT_STICKER_SIZE)+8);
    if(hit>=0){isDraggingNum=true;dragNumIdx=hit;dragOffX=pos.x-editorNumbers[hit].x;dragOffY=pos.y-editorNumbers[hit].y;}
    else isDraggingNum=false;
  }else if(editorMode==='crop'){
    const handle=getCropHandle(pos);
    if(handle){cropHandleDrag=handle;cropDragging=true;}
    else if(cropActive&&pos.x>=cropBox.x&&pos.x<=cropBox.x+cropBox.w&&pos.y>=cropBox.y&&pos.y<=cropBox.y+cropBox.h){
      cropHandleDrag={id:'move'};cropDragging=true;dragOffX=pos.x-cropBox.x;dragOffY=pos.y-cropBox.y;
    }else{cropStart=pos;cropDragging=true;cropHandleDrag=null;cropActive=false;}
  }
}
function canvasPointerMove(e){
  e.preventDefault();if(!editorCanvas)return;
  if(e.touches&&e.touches.length===2&&pinchActive){
    const dist=getTouchDist(e.touches[0],e.touches[1]);
    const ratio=dist/pinchStartDist;
    if(pinchNumIdx>=0){editorNumbers[pinchNumIdx].size=Math.max(10,Math.min(60,Math.round(pinchStartSize*ratio)));drawEditor();}
    return;
  }
  const touch=e.touches?e.touches[0]:e;
  const pos=getCanvasPos(touch);const c=editorCanvas;
  if(editorMode==='move'&&isDraggingNum&&dragNumIdx>=0){
    editorNumbers[dragNumIdx].x=Math.max(10,Math.min(c.width-10,pos.x-dragOffX));
    editorNumbers[dragNumIdx].y=Math.max(10,Math.min(c.height-10,pos.y-dragOffY));
    dragMoved=true;drawEditor();
  }else if(editorMode==='crop'&&cropDragging){
    if(cropHandleDrag){
      const id=cropHandleDrag.id;
      if(id==='move'){cropBox.x=Math.max(0,Math.min(c.width-cropBox.w,pos.x-dragOffX));cropBox.y=Math.max(0,Math.min(c.height-cropBox.h,pos.y-dragOffY));}
      else{let{x,y,w,h}=cropBox;
        if(id==='tl'){const nx=Math.min(pos.x,x+w-20);const ny=Math.min(pos.y,y+h-20);w=x+w-nx;h=y+h-ny;x=nx;y=ny;}
        else if(id==='tr'){w=Math.max(20,pos.x-x);const ny=Math.min(pos.y,y+h-20);h=y+h-ny;y=ny;}
        else if(id==='bl'){const nx=Math.min(pos.x,x+w-20);w=x+w-nx;x=nx;h=Math.max(20,pos.y-y);}
        else if(id==='br'){w=Math.max(20,pos.x-x);h=Math.max(20,pos.y-y);}
        cropBox={x:Math.max(0,x),y:Math.max(0,y),w:Math.min(c.width-x,w),h:Math.min(c.height-y,h)};
      }
    }else if(cropStart){
      const x=Math.min(cropStart.x,pos.x);const y=Math.min(cropStart.y,pos.y);
      cropBox={x:Math.max(0,x),y:Math.max(0,y),w:Math.min(c.width-x,Math.abs(pos.x-cropStart.x)),h:Math.min(c.height-y,Math.abs(pos.y-cropStart.y))};cropActive=true;
    }
    dragMoved=true;drawEditor();
  }
}
function canvasPointerUp(e){
  e.preventDefault();
  if(pinchActive&&e.touches&&e.touches.length<2){pinchActive=false;return;}
  const touch=e.changedTouches?e.changedTouches[0]:e;
  if(editorMode==='move'){
    if(isDraggingNum&&!dragMoved&&dragNumIdx>=0){
      editorNumbers.splice(dragNumIdx,1);
      editorNumbers.forEach((n,i)=>n.num=i+1);
      showToast('番号を削除しました');drawEditor();
    }
    isDraggingNum=false;dragNumIdx=-1;dragMoved=false;
  }else if(editorMode==='crop'){
    cropDragging=false;
    if(cropBox.w>10&&cropBox.h>10)cropActive=true;else cropActive=false;
    cropHandleDrag=null;cropStart=null;drawEditor();
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(()=>{
    const c=document.getElementById('editor-canvas');if(!c)return;
    c.addEventListener('mousedown',canvasPointerDown);
    c.addEventListener('mousemove',canvasPointerMove);
    c.addEventListener('mouseup',canvasPointerUp);
    c.addEventListener('touchstart',canvasPointerDown,{passive:false});
    c.addEventListener('touchmove',canvasPointerMove,{passive:false});
    c.addEventListener('touchend',canvasPointerUp,{passive:false});
  },500);
});

function toggleBrands(){const ex=document.getElementById('brands-extra');const lbl=document.getElementById('brand-toggle-label');const o=ex.classList.toggle('open');lbl.textContent=o?'▲ 閉じる':'▼ もっと見る（A–Z）';}
function toggleBrandsMob(){const ex=document.getElementById('mob-brands-extra');const lbl=document.getElementById('mob-brand-toggle-label');const o=ex.classList.toggle('open');lbl.textContent=o?'▲ 閉じる':'▼ もっと見る（A–Z）';}
function closeModal(id){document.getElementById(id).classList.remove('open');document.body.style.overflow='';}
function closeOnBd(e,id){if(e.target===document.getElementById(id))closeModal(id);}
function closeAll(){['post-bd','edit-bd'].forEach(closeModal);document.getElementById('done-bd').classList.remove('open');}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400);}

['pd1','pd2','pd3','pd4'].forEach((id,i,arr)=>{
  const el=document.getElementById(id);
  el.addEventListener('input',()=>{if(el.value&&i<arr.length-1)document.getElementById(arr[i+1]).focus();});
  el.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!el.value&&i>0)document.getElementById(arr[i-1]).focus();});
});
['pin1','pin2','pin3','pin4'].forEach((id,i,arr)=>{
  const el=document.getElementById(id);
  el.addEventListener('input',()=>{if(el.value&&i<arr.length-1)document.getElementById(arr[i+1]).focus();if(el.value&&i===arr.length-1)verifyPin();});
  el.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!el.value&&i>0)document.getElementById(arr[i-1]).focus();});
});

// スワイプUI
let currentPanel=1;
let swipeStartX=0,swipeStartY=0,isHorizSwipe=false,swipeDecided=false;
const SWIPE_THRESHOLD=90,ANGLE_LOCK=0.4;
function goPanel(n){
  currentPanel=Math.max(0,Math.min(2,n));
  const c=document.getElementById('swipe-container');if(!c)return;
  c.style.transition='transform .3s cubic-bezier(.25,.46,.45,.94)';
  c.style.transform='translateX('+(-currentPanel*window.innerWidth)+'px)';
  document.querySelectorAll('.swipe-dot').forEach((d,i)=>d.classList.toggle('on',i===currentPanel));
}
function initSwipe(){
  const c=document.getElementById('swipe-container');if(!c)return;
  c.style.transform='translateX('+(-currentPanel*window.innerWidth)+'px)';
  c.addEventListener('touchstart',e=>{swipeStartX=e.touches[0].clientX;swipeStartY=e.touches[0].clientY;isHorizSwipe=false;swipeDecided=false;c.style.transition='none';},{passive:true});
  c.addEventListener('touchmove',e=>{
    const dx=e.touches[0].clientX-swipeStartX;const dy=e.touches[0].clientY-swipeStartY;
    if(!swipeDecided&&(Math.abs(dx)>8||Math.abs(dy)>8)){swipeDecided=true;isHorizSwipe=Math.abs(dx)>Math.abs(dy)*(1/ANGLE_LOCK);}
    if(!isHorizSwipe)return;
    e.preventDefault&&e.cancelable&&e.preventDefault();
    let offset=-currentPanel*window.innerWidth+dx;
    if((currentPanel===0&&dx>0)||(currentPanel===2&&dx<0))offset=-currentPanel*window.innerWidth+dx*0.25;
    c.style.transform='translateX('+offset+'px)';
  },{passive:false});
  c.addEventListener('touchend',e=>{
    if(!isHorizSwipe){goPanel(currentPanel);return;}
    const dx=e.changedTouches[0].clientX-swipeStartX;
    if(dx<-SWIPE_THRESHOLD)goPanel(currentPanel+1);else if(dx>SWIPE_THRESHOLD)goPanel(currentPanel-1);else goPanel(currentPanel);
  },{passive:true});
  window.addEventListener('resize',()=>{c.style.transition='none';c.style.transform='translateX('+(-currentPanel*window.innerWidth)+'px)';});
}
function checkMobile(){
  const isMob=window.innerWidth<=680;
  const swipeUI=document.getElementById('swipe-ui');
  const pcWrap=document.querySelector('.wrap');
  if(swipeUI)swipeUI.style.display=isMob?'block':'none';
  if(pcWrap)pcWrap.style.display=isMob?'none':'grid';
  // フッターはPC・スマホ両方表示
}
window.addEventListener('resize',checkMobile);

function filterGenreMob(el,genre){
  document.querySelectorAll('#swipe-ui .tag').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');currentGenreFilter=genre||'ALL';currentBrandFilter=null;currentFxFilter=null;applyFilter();setTimeout(()=>goPanel(1),180);
}
function filterBrandMob(el,brand){
  document.querySelectorAll('#swipe-ui .tag').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');currentBrandFilter=brand;currentGenreFilter='ALL';currentFxFilter=null;applyFilter();setTimeout(()=>goPanel(1),180);
}
function filterFxMob(el,fx){
  document.querySelectorAll('#swipe-ui .tag').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');currentFxFilter=fx;currentBrandFilter=null;currentGenreFilter='ALL';applyFilter();setTimeout(()=>goPanel(1),180);
}
function renderRankingWidgetMob(posts){
  const el=document.getElementById('ranking-widget-mob');if(!el)return;
  const bp=posts.filter(p=>!p.post_type||p.post_type==='board');
  const monthAgo=Date.now()-30*24*60*60*1000;const monthly=bp.filter(p=>new Date(p.created_at).getTime()>monthAgo);
  const target=monthly.length>=3?monthly:bp;
  const sorted=[...target].sort((a,b)=>(b.likes||0)-(a.likes||0)).slice(0,5);
  if(!sorted.length){el.innerHTML='<div style="font-size:10px;color:var(--td);font-family:JetBrains Mono,monospace">まだ投稿がありません</div>';return;}
  el.innerHTML=sorted.map((p,i)=>{const crown=i===0?'<span style="margin-right:4px">👑</span>':'';return '<div class="ri" onclick="location.href=\'/post?id='+p.id+'\'">'+'<div class="rn '+(i<2?'hi':'')+'">'+crown+(i+1)+'</div>'+'<div class="ri-i"><div class="ri-t">'+p.title+'</div><div class="ri-u">'+(p.username||'匿名')+'</div></div>'+'<div class="ri-s">❤️'+(p.likes||0)+'</div></div>';}).join('');
}
function renderGearWidgetMob(posts){
  const el=document.getElementById('gear-widget-mob');if(!el)return;
  const count={};posts.forEach(p=>{const g=Array.isArray(p.gear_list)?p.gear_list:[];g.forEach(x=>{const n=(x.name||x||'').trim();if(n)count[n]=(count[n]||0)+1;});});
  const sorted=Object.entries(count).sort((a,b)=>b[1]-a[1]).slice(0,5);
  if(!sorted.length){el.innerHTML='<div style="font-size:10px;color:var(--td);font-family:JetBrains Mono,monospace">データなし</div>';return;}
  el.innerHTML=sorted.map(([n,c])=>'<div class="gr" style="cursor:pointer" onclick="filterByGearName(\''+n.replace(/'/g,"\\'")+'\'">'+'<div class="gr-i"><div class="gr-n">'+n+'</div><div class="gr-b">'+c+'件の投稿</div></div>'+'<a href="'+soundhouseUrl(n)+'" target="_blank" rel="noopener" onclick="event.stopPropagation()" style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;flex-shrink:0;text-decoration:none;background:var(--sf2);border:1px solid var(--bd);border-radius:4px;font-size:13px">🔍</a></div>').join('');
}

document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll();});
document.addEventListener('DOMContentLoaded',()=>{checkMobile();initSwipe();loadPostsFromDB();updateStepUI();});
