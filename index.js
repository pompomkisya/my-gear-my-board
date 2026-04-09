const SUPABASE_URL='https://yzqfockzgyfjmngygbhp.supabase.co';
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6cWZvY2t6Z3lmam1uZ3lnYmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTYxODksImV4cCI6MjA4OTY3MjE4OX0.Cn4UMJ8y6CHuIMDeFEShej4t1p4syweLgo5ZXZNs-_g';
const sb=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

/* ─── LANG ─── */
function detectLang(){const s=localStorage.getItem('mgmb_lang');if(s)return s;const b=navigator.language||'ja';return b.toLowerCase().startsWith('ja')?'ja':'en';}
let lang=detectLang();

const I18N={
  ja:{
    postBtn:'＋ 投稿する',ddBoard:'ボードを投稿',ddGear:'機材を投稿',
    searchPh:'フリーワード',filterClearBtn:'✕ 解除',
    sortNew:'新着',sortLikes:'人気',
    tabAll:'すべて',tabBoard:'エフェクターボード',tabGear:'機材',
    headAll:'PEDALBOARDS',headBoard:'BOARDS',headGear:'GEAR',
    bannerText:'<strong>🎸 あなたのボードや機材を投稿しよう！</strong><br>登録不要・匿名OK。写真1枚から投稿できます。',
    bannerBoard:'エフェクターボードを投稿',bannerGear:'機材を投稿',
    genreRock:'ROCK',genreBlues:'BLUES',genreJazz:'JAZZ',genreMetal:'METAL',genreFunk:'FUNK',
    genreTaGroku:'宅録',genreShoshinsha:'初心者相談',
    genreAmbient:'AMBIENT',genreShoegaze:'SHOEGAZE',genrePostRock:'POST ROCK',
    genreIndie:'INDIE',genreAlternative:'ALTERNATIVE',genrePunk:'PUNK',
    filteringBy:'絞り込み中:',noPosts:'まだ投稿がありません',noMatch:'条件に一致する投稿が見つかりません',
    loadMore:'もっと見る',
    stepTitleBoard:'エフェクターボードを投稿',stepTitleGear:'機材を投稿',
    stepSubOf:'Step',stepSubSlash:'/',
    lblPhoto:'写真（最大3枚・任意）',
    uploadAreaTxt:'クリックして写真を選択',uploadAreaSub:'最大3枚 · 1枚目がサムネイル',
    uploadHint:'番号をつけると伝わりやすくなります',
    lblUsername:'ユーザー名（任意）',usernamePh:'名前をつけると自分の投稿を探せます',
    lblTitle:'タイトル',titleBoardPh:'例：ライブ用最強ボード',titleGearPh:'例：ファズコレクション',
    lblYoutube:'YouTube URL（任意）',
    gearStepLbl:'使用機材（1つ以上推奨）',gearHint1:'※入力すると閲覧数が上がります',
    gearPh:'機材名を入力（例: DS-1, Big Muff）',gearHint2:'候補からタップで簡単に追加できます',
    gearHint3:'まずは1つだけでOKです',laterInputBtn:'あとで入力する',
    lblGenre:'ジャンル（複数選択OK）',lblDesc:'コメント・説明（任意）',
    descPh:'機材の選び方、こだわりなど...',
    passBoxTitle:'🔑 編集用4桁パスワードを設定',
    passWarn:'投稿後に<strong>編集・削除</strong>するときに必要です。<strong>忘れると変更できません。</strong>',
    anonNote:'※ 登録不要・名前は任意です',
    submitBtn:'🚀 投稿する',nextBtn:'次へ →',backBtn:'← 戻る',
    confirmTitle:'確認',confirmUser:'投稿者',confirmTitleLbl:'タイトル',confirmGear:'使用機材',confirmGenre:'ジャンル',confirmDesc:'説明',
    gearRemindTitle:'機材を追加しませんか？',gearRemindMsg:'機材を追加すると、より多くの人に見てもらえます',
    gearRemindAdd:'機材を追加する',gearRemindSkip:'そのまま投稿',
    editTitle:'記事を編集・削除',editSub:'投稿時に設定した4桁パスワードを入力してください',
    editVerifyBtn:'確認する',editTitle2:'記事を編集',editSub2:'✅ パスワード認証が完了しました',
    editLblTitle:'タイトル',editLblGear:'使用機材（ドラッグで並び替え可）',editLblDesc:'コメント・説明',editLblYt:'YouTube URL',
    editGearAddPh:'機材名を追加...',editGearAddBtn:'追加',editSaveBtn:'変更を保存する',editDelBtn:'🗑 この投稿を削除する',
    pinErr:'パスワードが違います',pinErrEmpty:'4桁のパスワードを入力してください',
    toastSaved:'✅ 変更を保存しました',toastDeleted:'🗑 投稿を削除しました',toastErr:'❌ 保存に失敗しました',
    uploading:'アップロード中...',uploadDone:'アップロード完了',
    doneTitleBoard:'投稿完了！',doneSubBoard:'あなたのボードが公開されました！',
    doneTitleGear:'投稿完了！',doneSubGear:'機材が公開されました！',doneCloseBtn:'閉じる',
    rankWidget:'🔥 今月の人気ボード',gearWidget:'🎛 よく使われている機材',newsWidget:'📰 機材NEWS',
    rankEmpty:'まだランキングがありません',gearEmpty:'機材情報がまだありません',
    myPageBtn:'マイページ',
    logoSub:'ペダルボードSNS',
    mobTitleGenre:'ジャンル',mobTitleBrand:'ブランド',mobTitleFxType:'エフェクタータイプ',
    brandMoreBtn:'▼ もっと見る（A–Z）',brandLessBtn:'▲ 閉じる',
    tickerLoading:'読み込み中...',
    filterClearLbl:'絞り込み解除',
    editorTitle:'画像編集',editorSubtitle:'ステッカー・トリミング・回転（任意）',
    editorHint:'「番号を追加」で機材に番号をつけられます',
    editorDoneBtn:'完了',editorRotateBtn:'回転',editorMirrorBtn:'反転',editorNumberBtn:'番号を追加',editorResetBtn:'リセット',editorCropBtn:'トリミング',
    editCardBtn:'編集',
    normalizeGenreTagroku:'宅録',normalizeGenreShoshinsha:'初心者相談',
  },
  en:{
    postBtn:'＋ Post',ddBoard:'Post a Board',ddGear:'Post Gear',
    searchPh:'Search...',filterClearBtn:'✕ Clear',
    sortNew:'New',sortLikes:'Popular',
    tabAll:'All',tabBoard:'Boards',tabGear:'Gear',
    headAll:'PEDALBOARDS',headBoard:'BOARDS',headGear:'GEAR',
    bannerText:'<strong>🎸 Share your board or gear!</strong><br>No registration required. Anonymous posting OK.',
    bannerBoard:'Post a Pedalboard',bannerGear:'Post Gear',
    genreRock:'ROCK',genreBlues:'BLUES',genreJazz:'JAZZ',genreMetal:'METAL',genreFunk:'FUNK',
    genreTaGroku:'Home Studio',genreShoshinsha:'Beginner\'s Talk',
    genreAmbient:'AMBIENT',genreShoegaze:'SHOEGAZE',genrePostRock:'POST ROCK',
    genreIndie:'INDIE',genreAlternative:'ALTERNATIVE',genrePunk:'PUNK',
    filteringBy:'Filtering by:',noPosts:'No posts yet',noMatch:'No posts match your filter',
    loadMore:'Load more',
    stepTitleBoard:'Post a Pedalboard',stepTitleGear:'Post Gear',
    stepSubOf:'Step',stepSubSlash:'/',
    lblPhoto:'Photos (up to 3, optional)',
    uploadAreaTxt:'Click to select photos',uploadAreaSub:'Up to 3 · First photo = thumbnail',
    uploadHint:'Adding numbers helps viewers understand the gear',
    lblUsername:'Username (optional)',usernamePh:'Add a name so you can find your posts later',
    lblTitle:'Title',titleBoardPh:'e.g. My Live Board',titleGearPh:'e.g. Fuzz Collection',
    lblYoutube:'YouTube URL (optional)',
    gearStepLbl:'Gear used (at least 1 recommended)',gearHint1:'Adding gear increases your post visibility',
    gearPh:'Enter gear name (e.g. DS-1, Big Muff)',gearHint2:'Tap a suggestion to add quickly',
    gearHint3:'Start with just one!',laterInputBtn:'Skip for now',
    lblGenre:'Genre (multiple OK)',lblDesc:'Comment / Description (optional)',
    descPh:'How you chose your gear, etc...',
    passBoxTitle:'🔑 Set a 4-digit password for editing',
    passWarn:'You\'ll need this to <strong>edit or delete</strong> your post later. <strong>You cannot change it if forgotten.</strong>',
    anonNote:'※ No registration needed. Name is optional.',
    submitBtn:'🚀 Post',nextBtn:'Next →',backBtn:'← Back',
    confirmTitle:'Confirm',confirmUser:'User',confirmTitleLbl:'Title',confirmGear:'Gear',confirmGenre:'Genre',confirmDesc:'Description',
    gearRemindTitle:'Add some gear?',gearRemindMsg:'Adding gear increases visibility for your post',
    gearRemindAdd:'Add gear',gearRemindSkip:'Post as-is',
    editTitle:'Edit / Delete Post',editSub:'Enter the 4-digit password you set when posting',
    editVerifyBtn:'Verify',editTitle2:'Edit Post',editSub2:'✅ Password verified',
    editLblTitle:'Title',editLblGear:'Gear (drag to reorder)',editLblDesc:'Description',editLblYt:'YouTube URL',
    editGearAddPh:'Add gear name...',editGearAddBtn:'Add',editSaveBtn:'Save changes',editDelBtn:'🗑 Delete this post',
    pinErr:'Wrong password',pinErrEmpty:'Please enter a 4-digit password',
    toastSaved:'✅ Changes saved',toastDeleted:'🗑 Post deleted',toastErr:'❌ Failed to save',
    uploading:'Uploading...',uploadDone:'Upload complete',
    doneTitleBoard:'Posted!',doneSubBoard:'Your pedalboard has been published!',
    doneTitleGear:'Posted!',doneSubGear:'Your gear has been published!',doneCloseBtn:'Close',
    rankWidget:'🔥 Top boards this month',gearWidget:'🎛 Popular gear',newsWidget:'📰 Gear News',
    rankEmpty:'No rankings yet',gearEmpty:'No gear data yet',
    myPageBtn:'MY PAGE',
    logoSub:'Pedalboard SNS',
    mobTitleGenre:'Genre',mobTitleBrand:'Brand',mobTitleFxType:'FX Type',
    brandMoreBtn:'▼ More (A–Z)',brandLessBtn:'▲ Close',
    tickerLoading:'Loading...',
    filterClearLbl:'Clear filter',
    editorTitle:'Edit Photo',editorSubtitle:'Stickers / Crop / Rotate (optional)',
    editorHint:'Use "Add Number" to label your gear',
    editorDoneBtn:'Done',editorRotateBtn:'Rotate',editorMirrorBtn:'Mirror',editorNumberBtn:'Add Number',editorResetBtn:'Reset',editorCropBtn:'Crop',
    editCardBtn:'Edit',
    normalizeGenreTagroku:'Home Studio',normalizeGenreShoshinsha:"Beginner's Talk",
  }
};
function tr(k){return(I18N[lang]||I18N.ja)[k]||I18N.ja[k]||k;}
function setTxt(id,t){const e=document.getElementById(id);if(e)e.textContent=t;}
function setHtml(id,h){const e=document.getElementById(id);if(e)e.innerHTML=h;}
function setPlaceholder(id,t){const e=document.getElementById(id);if(e)e.placeholder=t;}

function applyLangUI(){
  const label=document.getElementById('lang-label');if(label)label.textContent=lang==='ja'?'EN':'JA';
  const hSearchInput=document.getElementById('h-search');if(hSearchInput)hSearchInput.placeholder=tr('searchPh');
  const mobSearch=document.getElementById('mob-search');if(mobSearch)mobSearch.placeholder=tr('searchPh')+'...';
  const ddItems=document.querySelectorAll('.post-dropdown-item');
  if(ddItems[0])ddItems[0].innerHTML='🎛 &nbsp;'+tr('ddBoard');
  if(ddItems[1])ddItems[1].innerHTML='🎸 &nbsp;'+tr('ddGear');
  const mpBtnText=document.getElementById('h-mypage-text');
  if(mpBtnText)mpBtnText.textContent=tr('myPageBtn');
  const pbBoard=document.querySelector('.pb-btn.board');if(pbBoard)pbBoard.textContent=tr('bannerBoard');
  const pbGear=document.querySelector('.pb-btn.gear-b');if(pbGear)pbGear.textContent=tr('bannerGear');
  document.querySelectorAll('.sort-b').forEach((b,i)=>{b.textContent=i===0?tr('sortNew'):tr('sortLikes');});
  const feedTabs=document.querySelectorAll('.feed-tab');
  feedTabs.forEach(t=>{const tab=t.getAttribute('onclick')||'';if(tab.includes("'all'"))t.textContent=tr('tabAll');else if(tab.includes("'board'"))t.textContent=tr('tabBoard');else if(tab.includes("'gear'"))t.textContent=tr('tabGear');});
  applyLangGenreTags();
  setTxt('mob-title-genre',tr('mobTitleGenre'));
  setTxt('mob-title-brand',tr('mobTitleBrand'));
  setTxt('mob-title-fxtype',tr('mobTitleFxType'));
  const btLabels=document.querySelectorAll('#brand-toggle-label,#mob-brand-toggle-label');
  btLabels.forEach(el=>{if(el.id==='brand-toggle-label'||el.id==='mob-brand-toggle-label'){const open=el.closest('.brands-extra');el.textContent=open?tr('brandLessBtn'):tr('brandMoreBtn');}});
  const logoSubs=document.querySelectorAll('.logo-sub');logoSubs.forEach(el=>{el.textContent=tr('logoSub');});
}

function applyLangGenreTags(){
  const map={'tag-tagroku-pc':tr('genreTaGroku'),'tag-tagroku-mob':tr('genreTaGroku'),'tag-shoshinsha-pc':tr('genreShoshinsha'),'tag-shoshinsha-mob':tr('genreShoshinsha'),'gs-tagroku':tr('genreTaGroku'),'gs-shoshinsha':tr('genreShoshinsha')};
  Object.entries(map).forEach(([id,txt])=>{const el=document.getElementById(id);if(el)el.textContent=txt;});
}

function toggleLang(){lang=lang==='ja'?'en':'ja';localStorage.setItem('mgmb_lang',lang);applyLangUI();renderCards();}

/* ─── SESSION ID ─── */
function getSessionId(){let s=localStorage.getItem('mgmb_sid');if(!s){s='sid_'+Math.random().toString(36).slice(2);localStorage.setItem('mgmb_sid',s);}return s;}
const SID=getSessionId();

/* ─── STATE ─── */
let allPosts=[],filteredPosts=[],displayedCount=0;
const PAGE_SIZE=12;
let currentGenre='ALL',currentBrand=null,currentFx=null;
let currentSort='new',currentTab='all';
let isMobile=false;
let currentSearchQuery='';
let _searchTimer=null,_mobSearchTimer=null;
let editingPostId=null,editingPinHash=null;
let currentPostType='board';
let pendingPhotos=[];
let pendingPhotoDataURLs=[];
let currentStep=1;
let totalSteps=5;
let pendingGear=[];
let acItems=[];
let acFocusIndex=-1;
let likedSet=new Set();
let tickerTimer=null;
/* editor */
let editorCanvas=null,editorCtx=null;
let editorImgOriginals=[];
let editorStates=[];
let editorCurrentIdx=0;
let editorDragStart=null,editorIsDragging=false;
let editorTransforms=[];
let isCropping=false,cropStart=null,cropRect=null;
let isAddingNumber=false;
let editorGlobalNumbers=[];

/* ─── INIT ─── */
window.addEventListener('DOMContentLoaded',async()=>{
  checkMobile();
  applyLangUI();
  initPassDigits();
  initPinInputs();
  initDragSort();
  setupSearch();
  await loadPosts();
  loadTicker();
  loadRankingWidget();
  loadGearWidget();
  loadNewsWidget();
  initSwipe();
});
window.addEventListener('resize',()=>{const m=window.innerWidth<=680;if(m!==isMobile){isMobile=m;checkMobile();}});

function checkMobile(){
  isMobile=window.innerWidth<=680;
  const swipe=document.getElementById('swipe-ui');
  const wrap=document.querySelector('.wrap');
  if(swipe)swipe.style.display=isMobile?'block':'none';
  if(wrap)wrap.style.display=isMobile?'none':'grid';
}

/* ─── SWIPE ─── */
let swipePanel=1,swipeTouchStartX=0,swipeTouchCurrentX=0,swipeTouchActive=false;
function initSwipe(){
  const c=document.getElementById('swipe-container');
  if(!c)return;
  c.addEventListener('touchstart',e=>{swipeTouchStartX=e.touches[0].clientX;swipeTouchCurrentX=swipeTouchStartX;swipeTouchActive=true;},{passive:true});
  c.addEventListener('touchmove',e=>{if(!swipeTouchActive)return;swipeTouchCurrentX=e.touches[0].clientX;},{passive:true});
  c.addEventListener('touchend',()=>{
    if(!swipeTouchActive)return;swipeTouchActive=false;
    const diff=swipeTouchStartX-swipeTouchCurrentX;
    if(Math.abs(diff)>50){if(diff>0&&swipePanel<2)goPanel(swipePanel+1);else if(diff<0&&swipePanel>0)goPanel(swipePanel-1);}
  });
}
function goPanel(n){
  swipePanel=n;
  const c=document.getElementById('swipe-container');
  if(c)c.style.transform=`translateX(${-n*33.333}%)`;
  const dots=document.querySelectorAll('.swipe-dot');
  dots.forEach((d,i)=>d.classList.toggle('on',i===n));
}

/* ─── POSTS LOAD ─── */
async function loadPosts(){
  const grid=document.getElementById('card-grid');
  const gridMob=document.getElementById('card-grid-mob');
  if(grid)grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:40px;font-family:Noto Sans JP,sans-serif;font-size:12px;color:var(--td)">読み込み中...</div>`;
  const{data,error}=await sb.from('posts').select('*').order('created_at',{ascending:false}).limit(500);
  if(error||!data){if(grid)grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:40px;font-family:Noto Sans JP,sans-serif;font-size:12px;color:var(--td)">読み込みに失敗しました</div>`;return;}
  allPosts=data;
  const{data:likes}=await sb.from('likes').select('post_id').eq('session_id',SID);
  likedSet=new Set((likes||[]).map(l=>l.post_id));
  applyFilters();
}

function applyFilters(){
  let posts=[...allPosts];
  if(currentTab==='board')posts=posts.filter(p=>p.post_type==='board');
  else if(currentTab==='gear')posts=posts.filter(p=>p.post_type==='gear');
  if(currentGenre&&currentGenre!=='ALL')posts=posts.filter(p=>p.genre&&p.genre.some(g=>normalizeGenre(g)===normalizeGenre(currentGenre)));
  if(currentBrand)posts=posts.filter(p=>p.pedals&&p.pedals.some(g=>brandMatch(g,currentBrand)));
  if(currentFx)posts=posts.filter(p=>p.fx_types&&p.fx_types.includes(currentFx));
  if(currentSearchQuery)posts=posts.filter(p=>searchMatch(p,currentSearchQuery));
  if(currentSort==='likes')posts.sort((a,b)=>getMonthlyLikes(b)-getMonthlyLikes(a));
  else posts.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  filteredPosts=posts;
  displayedCount=0;
  renderCards();
  updateFilterBar();
  updateHeading();
}

function normalizeGenre(g){
  if(!g)return'';
  const m={'宅録':lang==='en'?'Home Studio':'宅録','Home Studio':'宅録','初心者相談':lang==='en'?"Beginner's Talk":'初心者相談',"Beginner's Talk":'初心者相談'};
  return m[g]||g;
}
function brandMatch(gearName,brand){if(!gearName||!brand)return false;const n=gearName.toLowerCase();const b=brand.toLowerCase();if(b==='others'){return!knownBrands.some(kb=>n.includes(kb.toLowerCase()));}return n.includes(b.toLowerCase());}
const knownBrands=['BOSS','DigiTech','Electro-Harmonix','Free The Tone','Ibanez','Jim Dunlop','Maxon','MXR','Strymon','TC Electronic','Aguilar','Alexander Pedals','Ammoon','Analogman','Anasounds','Animals Pedal','Arc Effects','Arion','Atomic','Azor','Bananana Effects','Beetronics','Behringer','Benson','BJFE','Black Mass Electronics','Bogner','Caline','Carl Martin','Caroline Guitar Co.','Catalinbread','Champion Leccy','Chase Bliss Audio','Chase Tone','Cioks','Circuitous FX','Cooper FX','Cornerstone','Crazy Tube Circuits','Darkglass Electronics','Death By Audio','Diezel','Disaster Area','DOD','Donner','Dr Scientist','DSM & Humboldt','Dwarfcraft Devices','EarthQuaker Devices','Effects Bakery','Empress Effects','ENO','Eventide','Fairfield Circuitry','Fender','Finegear','Fjord Fuzz','FLAMMA','Foxpedal','Fractal Audio','Friedman','Fulltone','Gamechanger Audio','GFI System','GigRig','Headrush','Hologram Electronics','Hotone','Hudson Electronics','IK Multimedia','Industrialectric','J. Rockett','JAM Pedals','JHS Pedals','Joyo','KarDiaN','Keeley','Kemper','KLIQ','Klon','KMA Machines','Kmise','Korg','Leqtique','Limetone Audio','Line 6','Mad Professor','Malekko Heavy Industry','MASF Pedals','Mastro Valvola','Meris','Minimichine','Mission Engineering','Montreal Assembly','Mooer','Morningstar','Mosky','Neural DSP','Neunaber','NUX','Old Blood Noise Endeavors','One Control','Organic Sounds','Origin Effects','Pedaltrain','Peterson','Pigtronix','Pladask Elektrisk','Providence','ProCo','Rainger FX','Red Panda','Revv','RJM','Rockboard','Rocktron','RoShi Pedals','Rowin','Seymour Duncan',"Shin's Music",'Sketchy Sounds','Sonic Research','Source Audio','Spaceman','Stellar Pedals','Stone Deaf FX','Subdecay','Suhr','Tech 21','ThorpyFX','Truetone','Two Notes','Umbrella Company','Valeton','Vemuram','Victory','Vital Audio','Vivie','Voodoo Lab','Vox','Walrus Audio','Wampler','Way Huge','WMD','Xotic','Zoom','ZVEX'];

function getMonthlyLikes(p){const now=new Date();const monthStart=new Date(now.getFullYear(),now.getMonth(),1);return(p.monthly_likes&&new Date(p.updated_at)>=monthStart)?p.monthly_likes:(p.likes||0);}
function searchMatch(p,q){const lq=q.toLowerCase();return(p.title&&p.title.toLowerCase().includes(lq))||(p.username&&p.username.toLowerCase().includes(lq))||(p.pedals&&p.pedals.some(g=>g.toLowerCase().includes(lq)))||(p.description&&p.description.toLowerCase().includes(lq));}

function renderCards(){
  const grid=document.getElementById('card-grid');
  const gridMob=document.getElementById('card-grid-mob');
  if(displayedCount===0){if(grid)grid.innerHTML='';if(gridMob)gridMob.innerHTML='';}
  if(!filteredPosts.length){
    const msg=`<div class="empty-filter" style="grid-column:1/-1"><div class="empty-filter-msg">${tr('noMatch')}</div></div>`;
    if(grid)grid.innerHTML=msg;if(gridMob)gridMob.innerHTML=msg;return;
  }
  const slice=filteredPosts.slice(displayedCount,displayedCount+PAGE_SIZE);
  slice.forEach(p=>{
    const html=renderCard(p);
    if(grid)grid.insertAdjacentHTML('beforeend',html);
    if(gridMob)gridMob.insertAdjacentHTML('beforeend',html);
  });
  displayedCount+=slice.length;
  const existing=document.querySelectorAll('#load-more-btn');
  existing.forEach(e=>e.remove());
  if(displayedCount<filteredPosts.length){
    const btn=`<div id="load-more-btn" style="grid-column:1/-1;text-align:center;padding:16px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
      <button onclick="loadMoreCards()" style="padding:9px 24px;background:transparent;border:1px solid var(--bd);border-radius:4px;font-family:Noto Sans JP,sans-serif;font-size:12px;font-weight:600;color:var(--tm);cursor:pointer;touch-action:manipulation">${tr('loadMore')} (${filteredPosts.length-displayedCount})</button>
    </div>`;
    if(grid)grid.insertAdjacentHTML('beforeend',btn);
    if(gridMob){const btn2=btn.replace('load-more-btn','load-more-btn-mob');gridMob.insertAdjacentHTML('beforeend',btn2);}
  }
}
function loadMoreCards(){
  const btns=document.querySelectorAll('#load-more-btn,#load-more-btn-mob');btns.forEach(b=>b.remove());
  renderCards();
}

function renderCard(p){
  const img=p.image_urls&&p.image_urls[0]
    ?`<img src="${p.image_urls[0]}" alt="${escHtml(p.title)}" loading="lazy" onerror="this.parentElement.innerHTML='<div style=text-align:center;font-size:30px;color:var(--td)>'+(${JSON.stringify(p.post_type==='gear'?'🎸':'🎛')})+'</div>'">`
    :`<div style="text-align:center;font-size:30px;color:var(--td)">${p.post_type==='gear'?'🎸':'🎛'}</div>`;
  const bdg=p.post_type==='board'?`<div class="bdg">BOARD</div>`:`<div class="bdg gear-bdg">GEAR</div>`;
  const yt=p.youtube_url?`<div class="yt-bdg">▶ YouTube</div>`:'';
  const liked=likedSet.has(p.id);
  const genreDisplayTags=(p.genre||[]).map(g=>{let dn=g;if(lang==='en'){if(g==='宅録')dn=tr('normalizeGenreTagroku');else if(g==='初心者相談')dn=tr('normalizeGenreShoshinsha');}return`<span class="ptag">${escHtml(dn)}</span>`;}).slice(0,3).join('');
  const moreCount=(p.genre||[]).length>3?`<span class="ptag-more">+${(p.genre||[]).length-3}</span>`:'';
  const av=p.username?p.username[0].toUpperCase():'?';
  const editBtnTxt=tr('editCardBtn');
  return`<div class="card" onclick="goPost('${p.id}')">
    <div class="iw">${img}${bdg}${yt}<div class="iw-ov"></div></div>
    <div class="body">
      <div class="cu">
        <div class="av">${av}</div>
        <div class="av-name">${escHtml(p.username||'Anonymous')}</div>
        <div class="av-time">${timeAgo(p.created_at)}</div>
      </div>
      <div class="ct">${escHtml(p.title)}</div>
      <div class="ptags">${genreDisplayTags}${moreCount}</div>
      <div class="cf">
        <div class="st${liked?' liked':''}" onclick="event.stopPropagation();likePost('${p.id}',this)">❤️ <span id="lc-${p.id}">${p.likes||0}</span></div>
        <div class="st" onclick="event.stopPropagation();openEdit('${p.id}')">✏️ ${editBtnTxt}</div>
      </div>
    </div>
  </div>`;
}

function goPost(id){location.href='/post?id='+id;}

function updateHeading(){
  const h=currentTab==='board'?tr('headBoard'):currentTab==='gear'?tr('headGear'):tr('headAll');
  setTxt('feed-heading',h);setTxt('feed-heading-mob',h);
}
function updateFilterBar(){
  const bar=document.getElementById('mob-filter-clear-bar');
  if(!bar)return;
  const active=currentGenre!=='ALL'||currentBrand||currentFx||currentSearchQuery;
  bar.style.display=active?'flex':'none';
  let lbl='';
  if(currentGenre!=='ALL')lbl+=currentGenre+' ';
  if(currentBrand)lbl+=currentBrand+' ';
  if(currentFx)lbl+=currentFx+' ';
  if(currentSearchQuery)lbl+='「'+currentSearchQuery+'」';
  const lblEl=document.getElementById('mob-filter-clear-lbl');
  if(lblEl)lblEl.textContent=tr('filteringBy')+' '+lbl.trim();
}

/* ─── FILTERS ─── */
function setSort(el,val){document.querySelectorAll('.sort-b').forEach(b=>b.classList.remove('on'));el.classList.add('on');currentSort=val;applyFilters();}
function setTab(el,val){document.querySelectorAll('.feed-tab').forEach(b=>b.classList.remove('on'));document.querySelectorAll('.feed-tab').forEach(b=>{if(b.getAttribute('onclick')&&b.getAttribute('onclick').includes("'"+val+"'"))b.classList.add('on');});currentTab=val;applyFilters();}
function filterGenre(el,g){document.querySelectorAll('[data-genre]').forEach(t=>t.classList.remove('on'));el.classList.add('on');currentGenre=g;currentBrand=null;currentFx=null;document.querySelectorAll('.tag[onclick^="filterBrand"]').forEach(t=>t.classList.remove('on'));document.querySelectorAll('[data-fx]').forEach(t=>t.classList.remove('on'));applyFilters();}
function filterGenreMob(el,g){document.querySelectorAll('[data-genre]').forEach(t=>t.classList.remove('on'));el.classList.add('on');currentGenre=g;currentBrand=null;currentFx=null;document.querySelectorAll('.tag[onclick^="filterBrandMob"]').forEach(t=>t.classList.remove('on'));document.querySelectorAll('[data-fx]').forEach(t=>t.classList.remove('on'));applyFilters();goPanel(1);}
function filterBrand(el,b){if(currentBrand===b){el.classList.remove('on');currentBrand=null;}else{document.querySelectorAll('.tag[onclick^="filterBrand("]').forEach(t=>t.classList.remove('on'));el.classList.add('on');currentBrand=b;currentGenre='ALL';currentFx=null;document.querySelectorAll('[data-genre]').forEach(t=>t.classList.remove('on'));document.querySelector('[data-genre="ALL"]')&&document.querySelector('[data-genre="ALL"]').classList.add('on');}applyFilters();}
function filterBrandMob(el,b){if(currentBrand===b){el.classList.remove('on');currentBrand=null;}else{document.querySelectorAll('.tag[onclick^="filterBrandMob("]').forEach(t=>t.classList.remove('on'));el.classList.add('on');currentBrand=b;currentGenre='ALL';currentFx=null;document.querySelectorAll('[data-genre]').forEach(t=>t.classList.remove('on'));document.querySelector('[data-genre="ALL"]')&&document.querySelector('[data-genre="ALL"]').classList.add('on');}applyFilters();goPanel(1);}
function filterFx(el,fx){if(currentFx===fx){el.classList.remove('on');currentFx=null;}else{document.querySelectorAll('[data-fx]').forEach(t=>t.classList.remove('on'));el.classList.add('on');currentFx=fx;currentGenre='ALL';currentBrand=null;document.querySelectorAll('[data-genre]').forEach(t=>t.classList.remove('on'));document.querySelector('[data-genre="ALL"]')&&document.querySelector('[data-genre="ALL"]').classList.add('on');}applyFilters();}
function filterFxMob(el,fx){filterFx(el,fx);goPanel(1);}
function clearFilter(){currentGenre='ALL';currentBrand=null;currentFx=null;currentSearchQuery='';document.querySelectorAll('[data-genre]').forEach(t=>t.classList.remove('on'));const allTag=document.querySelector('[data-genre="ALL"]');if(allTag)allTag.classList.add('on');document.querySelectorAll('.tag[onclick^="filterBrand"]').forEach(t=>t.classList.remove('on'));document.querySelectorAll('[data-fx]').forEach(t=>t.classList.remove('on'));const hs=document.getElementById('h-search');if(hs)hs.value='';const ms=document.getElementById('mob-search');if(ms)ms.value='';const hsc=document.getElementById('h-search-clear');if(hsc)hsc.classList.remove('show');const msc=document.getElementById('mob-search-clear');if(msc)msc.classList.remove('show');applyFilters();}

/* ─── SEARCH ─── */
function setupSearch(){
  const hs=document.getElementById('h-search');
  if(hs){hs.addEventListener('keydown',e=>{if(e.key==='Enter'){clearTimeout(_searchTimer);if(currentSearchQuery)applyFilters();}});}
}
function handleSearch(v){
  clearTimeout(_searchTimer);
  const sc=document.getElementById('h-search-clear');if(sc)sc.classList.toggle('show',v.length>0);
  const badge=document.getElementById('search-badge');
  if(!v){currentSearchQuery='';if(badge){badge.textContent='';badge.classList.remove('show');}applyFilters();return;}
  _searchTimer=setTimeout(()=>{currentSearchQuery=v;applyFilters();const count=filteredPosts.length;if(badge){badge.textContent=count+'件';badge.classList.add('show');}},400);
}
function clearSearch(){const hs=document.getElementById('h-search');if(hs)hs.value='';const sc=document.getElementById('h-search-clear');if(sc)sc.classList.remove('show');const badge=document.getElementById('search-badge');if(badge){badge.textContent='';badge.classList.remove('show');}currentSearchQuery='';applyFilters();}
function handleSearchMob(v){
  clearTimeout(_mobSearchTimer);
  const sc=document.getElementById('mob-search-clear');if(sc)sc.classList.toggle('show',v.length>0);
  const badge=document.getElementById('mob-search-badge');
  if(!v){currentSearchQuery='';if(badge){badge.textContent='';badge.classList.remove('show');}applyFilters();return;}
  _mobSearchTimer=setTimeout(()=>{currentSearchQuery=v;applyFilters();const count=filteredPosts.length;if(badge){badge.textContent=count+'件ヒット';badge.classList.add('show');}},400);
}
function clearSearchMob(){const ms=document.getElementById('mob-search');if(ms)ms.value='';const sc=document.getElementById('mob-search-clear');if(sc)sc.classList.remove('show');const badge=document.getElementById('mob-search-badge');if(badge){badge.textContent='';badge.classList.remove('show');}currentSearchQuery='';applyFilters();}

/* ─── LIKE ─── */
async function likePost(id,el){
  if(likedSet.has(id)){
    likedSet.delete(id);el.classList.remove('liked');
    await sb.from('likes').delete().eq('post_id',id).eq('session_id',SID);
    const p=allPosts.find(p=>p.id===id);if(p){p.likes=Math.max(0,(p.likes||1)-1);await sb.from('posts').update({likes:p.likes}).eq('id',id);const lc=document.querySelectorAll('#lc-'+id);lc.forEach(e=>e.textContent=p.likes);}
  }else{
    likedSet.add(id);el.classList.add('liked');
    await sb.from('likes').upsert({post_id:id,session_id:SID},{onConflict:'post_id,session_id'});
    const p=allPosts.find(p=>p.id===id);if(p){p.likes=(p.likes||0)+1;await sb.from('posts').update({likes:p.likes}).eq('id',id);const lc=document.querySelectorAll('#lc-'+id);lc.forEach(e=>e.textContent=p.likes);}
  }
}

/* ─── POST FORM ─── */
function openPost(type){currentPostType=type;pendingPhotos=[];pendingPhotoDataURLs=[];pendingGear=[];currentStep=1;renderStepDots();updateStepHeader();clearFormFields();renderPhotoPreviews();openModal('post-bd');goStep(1);}
function closeModal(id){document.getElementById(id).classList.remove('open');}
function openModal(id){document.getElementById(id).classList.add('open');}
function closeOnBd(e,id){if(e.target.id===id)closeModal(id);}
function togglePostDropdown(e){e.stopPropagation();document.getElementById('post-dropdown').classList.toggle('open');}
function closeDropdownAndPost(type){document.getElementById('post-dropdown').classList.remove('open');openPost(type);}
function closeAll(){document.getElementById('post-dropdown').classList.remove('open');}
document.addEventListener('click',e=>{const dd=document.getElementById('post-dropdown');if(dd&&!dd.contains(e.target)&&!e.target.closest('.h-btn'))dd.classList.remove('open');});

function clearFormFields(){document.getElementById('post-username').value='';document.getElementById('post-title').value='';document.getElementById('post-youtube').value='';document.getElementById('post-desc').value='';document.querySelectorAll('.gs').forEach(g=>g.classList.remove('on'));const gcw=document.getElementById('gear-tags');if(gcw){const gs=gcw.querySelectorAll('.gear-tag');gs.forEach(g=>g.remove());}const gs=document.getElementById('gear-search');if(gs)gs.value='';}

function updateStepHeader(){
  const titles={board:[tr('stepTitleBoard'),'プロフィール','機材情報','ジャンル・説明','確認'],gear:[tr('stepTitleGear'),'プロフィール','機材情報','詳細','確認']};
  const t=titles[currentPostType]||titles['board'];
  setTxt('step-title',t[currentStep-1]||t[0]);
  setTxt('step-sub',`${tr('stepSubOf')} ${currentStep} ${tr('stepSubSlash')} ${totalSteps}`);
}
function renderStepDots(){
  const dots=document.getElementById('step-dots');if(!dots)return;
  let h='';for(let i=1;i<=totalSteps;i++){h+=`<div class="step-dot${i===currentStep?' on':i<currentStep?' done':''}"></div>`;}dots.innerHTML=h;
}
function goStep(n){
  document.querySelectorAll('.step-panel').forEach(p=>p.classList.remove('on'));const panel=document.getElementById('step-'+n);if(panel)panel.classList.add('on');currentStep=n;totalSteps=5;renderStepDots();updateStepHeader();
  if(n===3){renderStep3Preview();}
  if(n===5){buildConfirmBox();}
}

function renderStep3Preview(){
  const p=document.getElementById('step3-photo-preview');if(!p)return;
  p.innerHTML=pendingPhotoDataURLs.slice(0,3).map((u,i)=>`<img src="${u}" style="width:72px;height:72px;object-fit:cover;border-radius:3px;border:1px solid var(--bd)">`).join('');
}

function handlePhotos(e){
  const files=Array.from(e.target.files).slice(0,3-pendingPhotos.length);
  files.forEach(f=>{
    if(pendingPhotos.length>=3)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      pendingPhotoDataURLs.push(ev.target.result);
      pendingPhotos.push(f);
      renderPhotoPreviews();
      if(pendingPhotos.length===1){openImageEditor(0);}
    };
    reader.readAsDataURL(f);
  });
  e.target.value='';
}

function renderPhotoPreviews(){
  const pc=document.getElementById('photo-previews');const cnt=document.getElementById('photo-count');
  if(!pc)return;
  pc.innerHTML='';
  pendingPhotoDataURLs.forEach((url,i)=>{
    const div=document.createElement('div');div.className='photo-thumb';
    div.innerHTML=`<img src="${url}" alt=""><button class="photo-remove" onclick="removePhoto(${i})">✕</button><button class="photo-edit-btn" onclick="openImageEditor(${i})">✏️ 編集</button>`;
    pc.appendChild(div);
  });
  if(pendingPhotos.length<3){
    const add=document.createElement('button');add.className='photo-add-btn';add.type='button';
    add.innerHTML='＋<span class="photo-add-label">追加</span>';
    add.onclick=()=>document.getElementById('photo-input').click();
    pc.appendChild(add);
  }
  const ua=document.getElementById('upload-area-main');if(ua)ua.style.display=pendingPhotos.length>0?'none':'block';
  if(cnt)cnt.textContent=pendingPhotos.length>0?pendingPhotos.length+'/3枚':'';
}
function removePhoto(i){pendingPhotos.splice(i,1);pendingPhotoDataURLs.splice(i,1);editorStates.splice&&editorStates.splice(i,1);renderPhotoPreviews();}

/* ─── GEAR AUTOCOMPLETE ─── */
let pedalsDB=[];
async function loadPedalsDB(){if(pedalsDB.length>0)return;const{data}=await sb.from('pedals').select('id,name,brand,slug,types').order('name');pedalsDB=data||[];}

async function searchGear(v){
  const drop=document.getElementById('ac-dropdown');if(!drop)return;
  if(!v){drop.classList.remove('open');acItems=[];acFocusIndex=-1;return;}
  await loadPedalsDB();
  const q=v.toLowerCase();
  const results=pedalsDB.filter(p=>{const n=(p.name||'').toLowerCase();const b=(p.brand||'').toLowerCase();return n.includes(q)||b.includes(q)||((b+' '+n).includes(q));}).slice(0,8);
  acItems=results;acFocusIndex=-1;
  if(!results.length){
    drop.innerHTML=`<div class="ac-empty">見つかりません。そのまま追加できます →</div>`;
    drop.classList.add('open');return;
  }
  drop.innerHTML=results.map((p,i)=>`<div class="ac-item" data-idx="${i}" onclick="addGearFromAC(${i})"><span class="ac-item-name">${escHtml(p.name)}</span><span class="ac-item-brand">${escHtml(p.brand||'')}</span></div>`).join('');
  drop.classList.add('open');
}
function addGearFromAC(i){
  const p=acItems[i];if(!p)return;
  addGearTag(p.name);
  const gs=document.getElementById('gear-search');if(gs)gs.value='';
  closeAC();
}
function closeAC(){const d=document.getElementById('ac-dropdown');if(d)d.classList.remove('open');}
function addGearTag(name){
  if(!name.trim())return;
  if(pendingGear.includes(name))return;
  pendingGear.push(name);
  const wrap=document.getElementById('gear-tags');const gs=document.getElementById('gear-search');if(!wrap||!gs)return;
  const tag=document.createElement('span');tag.className='gear-tag';tag.dataset.name=name;
  tag.innerHTML=`${escHtml(name)}<button class="gear-tag-x" onclick="removeGearTag(this,'${escHtml(name)}')">×</button>`;
  wrap.insertBefore(tag,gs);
  const fb=document.getElementById('gear-feedback');if(fb){fb.textContent='✅ 追加しました: '+name;fb.style.display='block';setTimeout(()=>{fb.style.display='none';},1500);}
}
function removeGearTag(btn,name){btn.parentElement.remove();const i=pendingGear.indexOf(name);if(i>-1)pendingGear.splice(i,1);}
function gearKeyDown(e){
  const drop=document.getElementById('ac-dropdown');
  if(e.key==='ArrowDown'){e.preventDefault();acFocusIndex=Math.min(acFocusIndex+1,acItems.length-1);updateACFocus();}
  else if(e.key==='ArrowUp'){e.preventDefault();acFocusIndex=Math.max(acFocusIndex-1,0);updateACFocus();}
  else if(e.key==='Enter'){e.preventDefault();if(acFocusIndex>=0&&acItems[acFocusIndex])addGearFromAC(acFocusIndex);else if(document.getElementById('gear-search').value.trim()){addGearTag(document.getElementById('gear-search').value.trim());document.getElementById('gear-search').value='';closeAC();}}
}
function updateACFocus(){const items=document.querySelectorAll('.ac-item');items.forEach((el,i)=>el.classList.toggle('focus',i===acFocusIndex));}
function toggleGenre(el){el.classList.toggle('on');}

function buildConfirmBox(){
  const box=document.getElementById('confirm-content');if(!box)return;
  const username=document.getElementById('post-username').value.trim()||'Anonymous';
  const title=document.getElementById('post-title').value.trim()||'（タイトルなし）';
  const gear=pendingGear.join('、')||'—';
  const genres=Array.from(document.querySelectorAll('.gs.on')).map(g=>g.dataset.val).join('、')||'—';
  const desc=document.getElementById('post-desc').value.trim()||'—';
  box.innerHTML=`<div class="confirm-row"><span class="confirm-lbl">${tr('confirmUser')}</span><span class="confirm-val">${escHtml(username)}</span></div><div class="confirm-row"><span class="confirm-lbl">${tr('confirmTitleLbl')}</span><span class="confirm-val">${escHtml(title)}</span></div><div class="confirm-row"><span class="confirm-lbl">${tr('confirmGear')}</span><span class="confirm-val">${escHtml(gear)}</span></div><div class="confirm-row"><span class="confirm-lbl">${tr('confirmGenre')}</span><span class="confirm-val">${escHtml(genres)}</span></div><div class="confirm-row"><span class="confirm-lbl">${tr('confirmDesc')}</span><span class="confirm-val">${escHtml(desc.slice(0,60))}</span></div>`;
}

function initPassDigits(){
  const ids=['pd1','pd2','pd3','pd4'];
  ids.forEach((id,i)=>{
    const el=document.getElementById(id);if(!el)return;
    el.addEventListener('input',()=>{el.value=el.value.replace(/\D/g,'');if(el.value.length===1&&i<ids.length-1)document.getElementById(ids[i+1]).focus();});
    el.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!el.value&&i>0)document.getElementById(ids[i-1]).focus();});
  });
}

async function submitPostToDB(){
  const pin=[document.getElementById('pd1'),document.getElementById('pd2'),document.getElementById('pd3'),document.getElementById('pd4')].map(el=>el?el.value:'').join('');
  if(pin.length<4){showToast('❌ 4桁のパスワードを入力してください');return;}
  if(pendingGear.length===0&&pendingPhotos.length===0){showGearRemind();return;}
  if(pendingGear.length===0){const rd=document.getElementById('gear-remind-bd');if(rd)rd.style.display='flex';return;}
  await doSubmitPost();
}
function showGearRemind(){const rd=document.getElementById('gear-remind-bd');if(rd)rd.style.display='flex';}
function closeGearRemind(){const rd=document.getElementById('gear-remind-bd');if(rd)rd.style.display='none';}

async function doSubmitPost(){
  closeGearRemind();
  const pin=[document.getElementById('pd1'),document.getElementById('pd2'),document.getElementById('pd3'),document.getElementById('pd4')].map(el=>el?el.value:'').join('');
  const pinHash=await hashPin(pin);
  const username=document.getElementById('post-username').value.trim();
  const title=document.getElementById('post-title').value.trim()||'無題';
  const ytRaw=document.getElementById('post-youtube').value.trim();
  const ytId=extractYouTubeId(ytRaw);
  const desc=document.getElementById('post-desc').value.trim();
  const genres=Array.from(document.querySelectorAll('.gs.on')).map(g=>g.dataset.val);
  const gear=[...pendingGear];
  const submitBtn=document.getElementById('submit-btn');if(submitBtn)submitBtn.disabled=true;
  const progWrap=document.getElementById('upload-progress-wrap');const progBar=document.getElementById('upload-progress-bar');const progMsg=document.getElementById('upload-progress-msg');
  if(progWrap)progWrap.classList.add('show');
  let imageUrls=[];
  for(let i=0;i<pendingPhotos.length;i++){
    if(progMsg)progMsg.textContent=`写真 ${i+1}/${pendingPhotos.length} をアップロード中...`;
    if(progBar)progBar.style.width=((i+1)/pendingPhotos.length*80)+'%';
    const dataUrl=pendingPhotoDataURLs[i];
    const compressed=await compressImage(dataUrl,1200,0.82);
    const fn=`${Date.now()}_${Math.random().toString(36).slice(2)}_${i}.jpg`;
    const byteStr=atob(compressed.split(',')[1]);const ab=new ArrayBuffer(byteStr.length);const ia=new Uint8Array(ab);for(let j=0;j<byteStr.length;j++)ia[j]=byteStr.charCodeAt(j);
    const blob=new Blob([ab],{type:'image/jpeg'});
    const{error}=await sb.storage.from('post-images').upload(fn,blob,{contentType:'image/jpeg',cacheControl:'3600',upsert:false});
    if(!error){const{data:u}=sb.storage.from('post-images').getPublicUrl(fn);imageUrls.push(u.publicUrl);}
  }
  if(progMsg)progMsg.textContent='投稿中...';if(progBar)progBar.style.width='95%';
  const fxTypes=await getFxTypesForGear(gear);
  const brandNames=extractBrandsFromGear(gear);
  const postData={title,username:username||null,description:desc||null,genre:genres,pedals:gear,image_urls:imageUrls,post_type:currentPostType,youtube_url:ytId?`https://www.youtube.com/watch?v=${ytId}`:null,likes:0,pin_hash:pinHash,session_id:SID,fx_types:fxTypes,brands:brandNames};
  const{data,error}=await sb.from('posts').insert(postData).select().single();
  if(progBar)progBar.style.width='100%';
  if(error){if(submitBtn)submitBtn.disabled=false;if(progWrap)progWrap.classList.remove('show');showToast('❌ 投稿に失敗しました');return;}
  if(progWrap)progWrap.classList.remove('show');
  closeModal('post-bd');
  allPosts.unshift(data);applyFilters();
  const doneTitle=document.getElementById('done-title');const doneSub=document.getElementById('done-sub');
  if(doneTitle)doneTitle.textContent=currentPostType==='gear'?tr('doneTitleGear'):tr('doneTitleBoard');
  if(doneSub)doneSub.textContent=currentPostType==='gear'?tr('doneSubGear'):tr('doneSubBoard');
  document.getElementById('done-bd').classList.add('open');
}

async function getFxTypesForGear(gearNames){
  if(!gearNames.length)return[];
  await loadPedalsDB();
  const types=new Set();
  gearNames.forEach(name=>{
    const match=pedalsDB.find(p=>p.name&&p.name.toLowerCase()===name.toLowerCase());
    if(match&&match.types){match.types.forEach(t=>types.add(t));}
  });
  return Array.from(types);
}
function extractBrandsFromGear(gearNames){
  const brands=new Set();
  gearNames.forEach(name=>{
    const match=knownBrands.find(b=>name.toLowerCase().includes(b.toLowerCase()));
    if(match)brands.add(match);
  });
  return Array.from(brands);
}

/* ─── EDIT ─── */
let editPostData=null;
function openEdit(id){
  editingPostId=id;editPostData=allPosts.find(p=>p.id===id);
  document.getElementById('edit-step1').style.display='block';document.getElementById('edit-step2').style.display='none';
  ['pin1','pin2','pin3','pin4'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  document.getElementById('pin-err').textContent='';
  openModal('edit-bd');
  setTimeout(()=>document.getElementById('pin1').focus(),300);
}
function initPinInputs(){
  const ids=['pin1','pin2','pin3','pin4'];
  ids.forEach((id,i)=>{
    const el=document.getElementById(id);if(!el)return;
    el.addEventListener('input',()=>{el.value=el.value.replace(/\D/g,'');if(el.value.length===1&&i<ids.length-1)document.getElementById(ids[i+1]).focus();});
    el.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!el.value&&i>0)document.getElementById(ids[i-1]).focus();if(e.key==='Enter')verifyPin();});
  });
}
async function verifyPin(){
  const pin=['pin1','pin2','pin3','pin4'].map(id=>{const el=document.getElementById(id);return el?el.value:'';}).join('');
  if(pin.length<4){document.getElementById('pin-err').textContent=tr('pinErrEmpty');return;}
  const post=allPosts.find(p=>p.id===editingPostId);if(!post)return;
  const entered=await hashPin(pin);
  if(entered!==post.pin_hash){document.getElementById('pin-err').textContent=tr('pinErr');return;}
  editingPinHash=entered;
  document.getElementById('edit-step1').style.display='none';document.getElementById('edit-step2').style.display='block';
  document.getElementById('edit-title').value=post.title||'';
  document.getElementById('edit-desc').value=post.description||'';
  document.getElementById('edit-youtube').value=post.youtube_url||'';
  renderEditGearList(post.pedals||[]);
}
function renderEditGearList(gear){
  const list=document.getElementById('edit-gear-sort-list');if(!list)return;
  list.innerHTML=gear.map((g,i)=>`<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:var(--sf2);border:1px solid var(--bd);border-radius:3px;" draggable="true" data-idx="${i}">
    <span style="cursor:grab;color:var(--td);font-size:14px">⠿</span>
    <span style="flex:1;font-size:13px">${escHtml(g)}</span>
    <button onclick="removeEditGearItem(${i})" style="background:none;border:none;color:var(--td);cursor:pointer;font-size:14px;padding:0">×</button>
  </div>`).join('');
}
function removeEditGearItem(i){const list=document.getElementById('edit-gear-sort-list');const items=Array.from(list.querySelectorAll('[data-idx]'));const gear=items.map(el=>el.querySelector('span:nth-child(2)').textContent);gear.splice(i,1);renderEditGearList(gear);}
function addEditGearItem(){const inp=document.getElementById('edit-pedals-add');if(!inp)return;const v=inp.value.trim();if(!v)return;const list=document.getElementById('edit-gear-sort-list');const items=Array.from(list.querySelectorAll('[data-idx]'));const gear=items.map(el=>el.querySelector('span:nth-child(2)').textContent);gear.push(v);renderEditGearList(gear);inp.value='';}
function initDragSort(){
  const list=document.getElementById('edit-gear-sort-list');if(!list)return;
  let dragIdx=null;
  list.addEventListener('dragstart',e=>{const item=e.target.closest('[data-idx]');if(!item)return;dragIdx=parseInt(item.dataset.idx);e.dataTransfer.effectAllowed='move';});
  list.addEventListener('dragover',e=>{e.preventDefault();});
  list.addEventListener('drop',e=>{e.preventDefault();const item=e.target.closest('[data-idx]');if(!item||dragIdx===null)return;const dropIdx=parseInt(item.dataset.idx);if(dragIdx===dropIdx)return;const items=Array.from(list.querySelectorAll('[data-idx]'));const gear=items.map(el=>el.querySelector('span:nth-child(2)').textContent);const moved=gear.splice(dragIdx,1)[0];gear.splice(dropIdx,0,moved);renderEditGearList(gear);dragIdx=null;});
}
async function saveEdit(){
  const post=allPosts.find(p=>p.id===editingPostId);if(!post)return;
  const title=document.getElementById('edit-title').value.trim();const desc=document.getElementById('edit-desc').value.trim();const ytRaw=document.getElementById('edit-youtube').value.trim();const ytId=extractYouTubeId(ytRaw);
  const list=document.getElementById('edit-gear-sort-list');const items=Array.from(list.querySelectorAll('[data-idx]'));const gear=items.map(el=>el.querySelector('span:nth-child(2)').textContent);
  const fxTypes=await getFxTypesForGear(gear);const brands=extractBrandsFromGear(gear);
  const{error}=await sb.from('posts').update({title,description:desc,pedals:gear,youtube_url:ytId?`https://www.youtube.com/watch?v=${ytId}`:null,fx_types:fxTypes,brands}).eq('id',editingPostId);
  if(error){showToast(tr('toastErr'));return;}
  Object.assign(post,{title,description:desc,pedals:gear,youtube_url:ytId?`https://www.youtube.com/watch?v=${ytId}`:null});
  closeModal('edit-bd');applyFilters();showToast(tr('toastSaved'));
}
async function confirmDelete(){
  if(!confirm('本当に削除しますか？'))return;
  const post=allPosts.find(p=>p.id===editingPostId);
  if(post&&post.image_urls){for(const url of post.image_urls){const fn=url.split('/').pop();await sb.storage.from('post-images').remove([fn]);}}
  await sb.from('posts').delete().eq('id',editingPostId);
  allPosts=allPosts.filter(p=>p.id!==editingPostId);
  closeModal('edit-bd');applyFilters();showToast(tr('toastDeleted'));
}

/* ─── BRANDS TOGGLE ─── */
function toggleBrands(){const e=document.getElementById('brands-extra');const l=document.getElementById('brand-toggle-label');if(!e||!l)return;const open=e.classList.toggle('open');l.textContent=open?tr('brandLessBtn'):tr('brandMoreBtn');}
function toggleBrandsMob(){const e=document.getElementById('mob-brands-extra');const l=document.getElementById('mob-brand-toggle-label');if(!e||!l)return;const open=e.classList.toggle('open');l.textContent=open?tr('brandLessBtn'):tr('brandMoreBtn');}

/* ─── TICKER ─── */
async function loadTicker(){
  const{data}=await sb.from('posts').select('id,title,username').order('created_at',{ascending:false}).limit(20);
  if(!data||!data.length)return;
  const inner=document.getElementById('ticker-inner');if(!inner)return;
  const items=data.map(p=>`<span class="ti" onclick="goPost('${p.id}')">${escHtml(p.title||'無題')} <span style="opacity:.55;font-size:10px;margin-left:4px">@${escHtml(p.username||'Anonymous')}</span></span>`).join('');
  inner.innerHTML=items+items;
}

/* ─── RANKING WIDGET ─── */
async function loadRankingWidget(){
  const{data}=await sb.from('posts').select('id,title,username,likes,image_urls').eq('post_type','board').order('likes',{ascending:false}).limit(5);
  const render=(el)=>{if(!el)return;if(!data||!data.length){el.innerHTML=`<div style="font-family:Noto Sans JP,sans-serif;font-size:11px;color:var(--td);text-align:center;padding:12px">${tr('rankEmpty')}</div>`;return;}el.innerHTML=data.map((p,i)=>`<div class="ri" onclick="goPost('${p.id}')"><div class="rn${i===0?' hi':''}">${i+1}</div><div class="ri-i"><div class="ri-t">${escHtml(p.title||'無題')}</div><div class="ri-u">@${escHtml(p.username||'Anonymous')}</div></div><div class="ri-s">❤️${p.likes||0}</div></div>`).join('');};
  render(document.getElementById('ranking-widget'));render(document.getElementById('ranking-widget-mob'));
}

/* ─── GEAR WIDGET ─── */
async function loadGearWidget(){
  const{data}=await sb.from('posts').select('pedals');
  const cnt={};(data||[]).forEach(p=>(p.pedals||[]).forEach(g=>{const n=g.trim();if(n)cnt[n]=(cnt[n]||0)+1;}));
  const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const render=(el)=>{if(!el)return;if(!top.length){el.innerHTML=`<div style="font-family:Noto Sans JP,sans-serif;font-size:11px;color:var(--td);text-align:center;padding:12px">${tr('gearEmpty')}</div>`;return;}el.innerHTML=top.map(([n,c])=>`<div class="gr"><div class="gr-i"><div class="gr-n">${escHtml(n)}</div><div class="gr-b">${c}件の投稿</div></div></div>`).join('');};
  render(document.getElementById('gear-widget'));render(document.getElementById('gear-widget-mob'));
}

/* ─── NEWS WIDGET ─── */
async function loadNewsWidget(){
  const NEWS=[
    {t:'Strymon Iridium IIが発売',d:'2025-01-15',url:'https://www.strymon.net'},
    {t:'BOSS GT-1000COREが更新',d:'2025-01-10',url:'https://www.boss.info'},
    {t:'EHX新製品ラッシュ',d:'2024-12-20',url:'https://www.ehx.com'},
    {t:'Chase Bliss MOOD mk3',d:'2024-12-15',url:'https://www.chasebliss.com'},
    {t:'Strymon DIG v2ファームウェア',d:'2024-12-01',url:'https://www.strymon.net'},
  ];
  const render=(el)=>{if(!el)return;el.innerHTML=NEWS.map(n=>`<a class="news-link" href="${n.url}" target="_blank" rel="noopener"><div class="nth">📰</div><div><div class="nr-t">${escHtml(n.t)}</div><div class="nr-d">${n.d}</div></div></a>`).join('');};
  render(document.getElementById('news-widget'));render(document.getElementById('news-widget-mob'));
}

/* ─── IMAGE EDITOR ─── */
function openImageEditor(idx){
  editorCurrentIdx=idx;const bd=document.getElementById('img-editor-bd');if(!bd)return;
  editorCanvas=document.getElementById('editor-canvas');editorCtx=editorCanvas.getContext('2d');
  if(!editorImgOriginals[idx]){const img=new Image();img.onload=()=>{editorImgOriginals[idx]=img;if(!editorTransforms[idx])editorTransforms[idx]={rotate:0,flipX:false,numbers:[]};drawEditorImage(idx);};img.src=pendingPhotoDataURLs[idx];}
  else{if(!editorTransforms[idx])editorTransforms[idx]={rotate:0,flipX:false,numbers:[]};drawEditorImage(idx);}
  buildEditorTabs();buildEditorToolbar();
  document.getElementById('editor-hint').textContent=tr('editorHint');
  bd.classList.add('open');isAddingNumber=false;isCropping=false;
}
function buildEditorTabs(){
  const bar=document.getElementById('img-tab-bar');if(!bar)return;
  bar.innerHTML=pendingPhotoDataURLs.map((u,i)=>`<div class="img-tab${i===editorCurrentIdx?' on':''}" onclick="switchEditorTab(${i})">写真${i+1}</div>`).join('');
}
function switchEditorTab(i){editorCurrentIdx=i;if(!editorImgOriginals[i]){const img=new Image();img.onload=()=>{editorImgOriginals[i]=img;if(!editorTransforms[i])editorTransforms[i]={rotate:0,flipX:false,numbers:[]};drawEditorImage(i);};img.src=pendingPhotoDataURLs[i];}else{drawEditorImage(i);}buildEditorTabs();}
function buildEditorToolbar(){
  const tb=document.getElementById('img-editor-toolbar');if(!tb)return;
  tb.innerHTML=`
    <button class="editor-tool-btn" onclick="editorRotate()"><span class="editor-tool-icon">↻</span>${tr('editorRotateBtn')}</button>
    <button class="editor-tool-btn" onclick="editorFlip()"><span class="editor-tool-icon">⇆</span>${tr('editorMirrorBtn')}</button>
    <button class="editor-tool-btn" id="editor-num-btn" onclick="toggleAddNumber()"><span class="editor-tool-icon">🔢</span>${tr('editorNumberBtn')}</button>
    <button class="editor-tool-btn" onclick="editorReset()"><span class="editor-tool-icon">↺</span>${tr('editorResetBtn')}</button>
    <button class="editor-done-btn" onclick="doneEditor()"><span class="editor-done-icon">✅</span>${tr('editorDoneBtn')}</button>
  `;
}
function drawEditorImage(idx){
  const img=editorImgOriginals[idx];if(!img)return;
  const wrap=document.getElementById('canvas-wrap');if(!wrap)return;
  const maxW=wrap.clientWidth-16;const maxH=wrap.clientHeight-16;
  let w=img.naturalWidth,h=img.naturalHeight;
  const t=editorTransforms[idx]||{rotate:0,flipX:false,numbers:[]};
  const rotated=t.rotate%180!==0;
  const displayW=rotated?h:w;const displayH=rotated?w:h;
  const scale=Math.min(maxW/displayW,maxH/displayH,1);
  const cw=Math.round(displayW*scale);const ch=Math.round(displayH*scale);
  editorCanvas.width=cw;editorCanvas.height=ch;
  const ctx=editorCtx;ctx.save();ctx.translate(cw/2,ch/2);
  const rad=t.rotate*(Math.PI/180);ctx.rotate(rad);if(t.flipX)ctx.scale(-1,1);
  ctx.drawImage(img,rotated?-ch/2:-cw/2,rotated?-cw/2:-ch/2,rotated?ch:cw,rotated?cw:ch);
  ctx.restore();
  if(t.numbers&&t.numbers.length){
    t.numbers.forEach(n=>{
      const x=n.x*cw,y=n.y*ch;
      ctx.beginPath();ctx.arc(x,y,16,0,Math.PI*2);ctx.fillStyle='rgba(232,85,45,0.9)';ctx.fill();
      ctx.font='bold 16px "Noto Sans JP",sans-serif';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n.num,x,y);
    });
  }
}
function editorRotate(){const t=editorTransforms[editorCurrentIdx];if(!t)return;t.rotate=(t.rotate+90)%360;drawEditorImage(editorCurrentIdx);}
function editorFlip(){const t=editorTransforms[editorCurrentIdx];if(!t)return;t.flipX=!t.flipX;drawEditorImage(editorCurrentIdx);}
function editorReset(){const t=editorTransforms[editorCurrentIdx];if(!t)return;t.rotate=0;t.flipX=false;t.numbers=[];drawEditorImage(editorCurrentIdx);isAddingNumber=false;updateNumberBtnState();}
function toggleAddNumber(){isAddingNumber=!isAddingNumber;updateNumberBtnState();}
function updateNumberBtnState(){const btn=document.getElementById('editor-num-btn');if(btn)btn.classList.toggle('active',isAddingNumber);}
function doneEditor(){
  const dataUrl=editorCanvas.toDataURL('image/jpeg',0.92);
  pendingPhotoDataURLs[editorCurrentIdx]=dataUrl;
  document.getElementById('img-editor-bd').classList.remove('open');
  renderPhotoPreviews();
}
editorCanvas&&editorCanvas.addEventListener&&(()=>{
  const c=document.getElementById('editor-canvas');
  if(!c)return;
  c.addEventListener('click',e=>{
    if(!isAddingNumber)return;
    const rect=c.getBoundingClientRect();const x=(e.clientX-rect.left)/c.width;const y=(e.clientY-rect.top)/c.height;
    const t=editorTransforms[editorCurrentIdx];if(!t)return;
    if(!t.numbers)t.numbers=[];
    const num=t.numbers.length+1;t.numbers.push({x,y,num});
    drawEditorImage(editorCurrentIdx);
  });
  c.addEventListener('touchend',e=>{
    if(!isAddingNumber)return;e.preventDefault();
    const touch=e.changedTouches[0];const rect=c.getBoundingClientRect();const x=(touch.clientX-rect.left)/c.width;const y=(touch.clientY-rect.top)/c.height;
    const t=editorTransforms[editorCurrentIdx];if(!t)return;
    if(!t.numbers)t.numbers=[];const num=t.numbers.length+1;t.numbers.push({x,y,num});drawEditorImage(editorCurrentIdx);
  },{passive:false});
})();
document.addEventListener('DOMContentLoaded',()=>{
  const c=document.getElementById('editor-canvas');if(!c)return;
  c.addEventListener('click',e=>{
    if(!isAddingNumber)return;
    const rect=c.getBoundingClientRect();const x=(e.clientX-rect.left)/c.width;const y=(e.clientY-rect.top)/c.height;
    const t=editorTransforms[editorCurrentIdx];if(!t)return;
    if(!t.numbers)t.numbers=[];const num=t.numbers.length+1;t.numbers.push({x,y,num});drawEditorImage(editorCurrentIdx);
  });
  c.addEventListener('touchend',e=>{
    if(!isAddingNumber)return;e.preventDefault();
    const touch=e.changedTouches[0];const rect=c.getBoundingClientRect();const x=(touch.clientX-rect.left)/c.width;const y=(touch.clientY-rect.top)/c.height;
    const t=editorTransforms[editorCurrentIdx];if(!t)return;
    if(!t.numbers)t.numbers=[];const num=t.numbers.length+1;t.numbers.push({x,y,num});drawEditorImage(editorCurrentIdx);
  },{passive:false});
});

/* ─── LIGHTBOX ─── */
function openLightbox(url){document.getElementById('lightbox-img').src=url;document.getElementById('lightbox').classList.add('open');}
function closeLightbox(){document.getElementById('lightbox').classList.remove('open');}

/* ─── UTILS ─── */
async function compressImage(dataUrl,maxPx,quality){return new Promise(resolve=>{const img=new Image();img.onload=()=>{let{width,height}=img;if(width>maxPx||height>maxPx){const ratio=Math.min(maxPx/width,maxPx/height);width=Math.round(width*ratio);height=Math.round(height*ratio);}const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;canvas.getContext('2d').drawImage(img,0,0,width,height);resolve(canvas.toDataURL('image/jpeg',quality));};img.src=dataUrl;});}
async function hashPin(pin){const encoder=new TextEncoder();const data=encoder.encode('mgmb_salt_'+pin);const hashBuffer=await crypto.subtle.digest('SHA-256',data);const hashArray=Array.from(new Uint8Array(hashBuffer));return hashArray.map(b=>b.toString(16).padStart(2,'0')).join('');}
function extractYouTubeId(url){if(!url)return null;const m=url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);return m?m[1]:null;}
function escHtml(s){if(!s)return'';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function timeAgo(ts){const d=Math.floor((Date.now()-new Date(ts))/1000);if(lang==='en'){if(d<60)return'just now';if(d<3600)return Math.floor(d/60)+'m ago';if(d<86400)return Math.floor(d/3600)+'h ago';return Math.floor(d/86400)+'d ago';}if(d<60)return'たった今';if(d<3600)return Math.floor(d/60)+'分前';if(d<86400)return Math.floor(d/3600)+'時間前';return Math.floor(d/86400)+'日前';}
function showToast(msg){const el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),3000);}
