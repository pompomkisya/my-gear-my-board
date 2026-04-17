const SUPABASE_URL='https://yzqfockzgyfjmngygbhp.supabase.co';
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6cWZvY2t6Z3lmam1uZ3lnYmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTYxODksImV4cCI6MjA4OTY3MjE4OX0.Cn4UMJ8y6CHuIMDeFEShej4t1p4syweLgo5ZXZNs-_g';
const sb=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const MASTER_KEY='MSTR';
function getSessionId(){let s=localStorage.getItem('mgmb_sid');if(!s){s='sid_'+Math.random().toString(36).slice(2)+Date.now();localStorage.setItem('mgmb_sid',s);}return s;}
const SESSION_ID=getSessionId();

function detectLang(){
  const saved=localStorage.getItem('mgmb_lang');
  if(saved)return saved;
  const bl=navigator.language||navigator.userLanguage||'ja';
  return bl.toLowerCase().startsWith('ja')?'ja':'en';
}
let lang=detectLang();
let allDBPosts=[],currentGenreFilter='ALL',currentTab='all',currentSort='new',currentDBPost=null;

// ── 翻訳辞書
const I18N={
  ja:{
    postBannerTitle:'あなたのボードや機材を投稿しよう！',postBannerSub:'登録不要・匿名OK。写真1枚から投稿できます。',
    postBannerTitle2:'🎸 あなたのボードや機材を投稿しよう！',
    btnPostBoard:'エフェクターボードを投稿',btnPostGear:'機材を投稿',
    feedAll:'すべて',feedBoard:'エフェクターボード',feedGear:'機材',feedBoardMob:'ボード',
    sortNew:'新着',sortLikes:'人気',
    widgetRanking:'🔥 今月の人気ボード',widgetGear:'🎛 よく使われている機材',widgetNews:'📰 機材NEWS',
    widgetRankingMob:'今月の人気ボード',widgetGearMob:'よく使われている機材',widgetNewsMob:'機材NEWS',adMob:'広告',
    posts:'件の投稿',noData:'データなし',noPost:'まだ投稿がありません',noPostGeneral:'投稿がありません',
    footerPrivacy:'プライバシーポリシー',footerContact:'お問い合わせ',footerCopy:'© 2026 My Gear My Board. All rights reserved.',
    postDropBoard:'🎛 &nbsp;ボードを投稿',postDropGear:'🎸 &nbsp;機材を投稿',headerPost:'＋ &nbsp;投稿する ▾',
    uploadAreaText:'クリックして写真を選択',uploadAreaSub:'最大3枚 · 1枚目がサムネイル',uploadAreaHint:'番号をつけると伝わりやすくなります',
    photoEditBtn:'🎯 機材に番号をつける',skipPhoto:'スキップ（写真なしで続ける）',
    lblUsername:'ユーザー名（任意）',phUsername:'名前をつけると自分の投稿を探せます',
    lblTitle:'タイトル',phTitle:'例：ライブ用最強ボード',phTitleGear:'例：My New Gear！',lblYoutube:'YouTube URL（任意）',
    lblGear:'使用機材（1つ以上推奨）',gearHint1:'※入力すると閲覧数が上がります',
    gearHint2:'候補からタップで簡単に追加できます',gearHint3:'まずは1つだけでOKです',
    gearPlaceholder:'機材名を入力（例: DS-1, Big Muff）',laterInput:'あとで入力する',
    lblGenre:'ジャンル（複数選択OK）',lblDesc:'コメント・説明（任意）',phDesc:'機材の選び方、こだわりなど...',
    passTitle:'🔑 編集用4桁パスワードを設定',
    passWarn:'投稿後に<strong>編集・削除</strong>するときに必要です。<strong>忘れると変更できません。</strong>',
    anonNote:'※ 登録不要・名前は任意です',
    btnNext:'次へ',btnBack:'← 戻る',btnSubmit:'🚀 投稿する',btnSkip:'スキップ',
    confirmType:'タイプ',confirmUser:'ユーザー名',confirmTitle:'タイトル',confirmGear:'機材',
    confirmGenre:'ジャンル',confirmDesc:'説明',confirmYt:'YouTube',confirmPhoto:'写真',
    typeBoard:'エフェクターボード',typeGear:'MY GEAR',
    doneTitle:'投稿完了！',doneSub:'あなたのボードが公開されました！',doneSubGear:'あなたの機材が公開されました！',doneClose:'閉じる',
    gearRemindTitle:'機材を追加しませんか？',gearRemindSub:'機材を追加すると、より多くの人に見てもらえます',
    gearRemindAdd:'機材を追加する',gearRemindSkip:'そのまま投稿',
    filterClear:'← フィルターを解除',emptyGenrePromo:'このジャンルで最初に投稿してみましょう！',
    logoSub:'ペダルボードSNS',
    newsOutlet:'サウンドハウス アウトレット',newsOutletSub:'お買い得品をチェック',
    newsSale:'サウンドハウス セール情報',newsSaleSub:'期間限定セール中',
    newsNew:'エフェクター新着',newsNewSub:'Soundhouse最新入荷',
    contactMsg:'お問い合わせ機能は準備中です',
    tickerHot:'人気急上昇 ▸ ',tickerNew:'新着 ▸ @',
    toolAddNum:'＋ 番号を追加',toolCrop:'トリミング',toolRotate:'回転',toolDone:'完了',toolBack:'← 戻る',
    toolMore:'…',menuReset:'すべてリセット',menuUndo:'番号をすべて削除',
    hintNormal:'「番号を追加」で機材に番号をつけられます',hintNumberMode:'ドラッグで移動・タップで削除',hintCrop:'ドラッグしてトリミング範囲を選択',
    tutorialText:'機材ごとに番号をつけると、配置がわかりやすくなります',tutorialBtn:'番号をつける',tutorialSkip:'スキップ',
    stepPhotoSub:'Step 1：写真 & 番号付け',stepInfoSub:'Step 2：タイトル・説明',
    stepGearSub:'Step 3：使用機材',stepGenreSub:'Step 4：ジャンル・詳細',stepConfirmSub:'Step 5：確認・投稿',
    panelGenre:'ジャンル',panelBrand:'ブランド',panelFxType:'エフェクタータイプ',
    slMenu:'メニュー',slHome:'ホーム',slEncyclopedia:'エフェクター図鑑',
    slBrand:'ブランドで絞る',slFxType:'エフェクタータイプ',slGenre:'ジャンル',
    slBoardGenre:'投稿ボードジャンル',slMypage:'マイページ / 登録・ログイン',
    brandSelectDefault:'ブランドを選択...',typeSelectDefault:'タイプを選択...',
    encyclopediaLinkText:'2,300件以上のペダルを見る',
    subStandard:'定番',subAmbient:'空間系',subAlterna:'オルタナ系',
    subDrive:'歪み系',subModulation:'モジュレーション',subOther:'その他',
    tagHomRec:'宅録',tagBeginner:'初心者相談',
    lblPhoto:'写真（最大3枚・任意）',
    langBtn:'EN',
  },
  en:{
    postBannerTitle:'Share your board or gear!',postBannerSub:'No sign-up needed. Post anonymously with just one photo.',
    postBannerTitle2:'🎸 Share your board or gear!',
    btnPostBoard:'Post Pedalboard',btnPostGear:'Post Gear',
    feedAll:'All',feedBoard:'Pedalboard',feedGear:'Gear',feedBoardMob:'Board',
    sortNew:'New',sortLikes:'Popular',
    widgetRanking:'🔥 Top Boards This Month',widgetGear:'🎛 Popular Gear',widgetNews:'📰 Gear News',
    widgetRankingMob:'Top Boards This Month',widgetGearMob:'Popular Gear',widgetNewsMob:'Gear News',adMob:'Ad',
    posts:' posts',noData:'No data',noPost:'No posts yet',noPostGeneral:'No posts',
    footerPrivacy:'Privacy Policy',footerContact:'Contact',footerCopy:'© 2026 My Gear My Board. All rights reserved.',
    postDropBoard:'🎛 &nbsp;Post Pedalboard',postDropGear:'🎸 &nbsp;Post Gear',headerPost:'＋ &nbsp;POST ▾',
    uploadAreaText:'Tap to select photos',uploadAreaSub:'Up to 3 photos · First photo is thumbnail',
    uploadAreaHint:'Adding numbers makes it easier to understand',
    photoEditBtn:'🎯 Number your gear',skipPhoto:'Skip (continue without photo)',
    lblUsername:'Username (optional)',phUsername:'Add a name to find your posts later (blank = anonymous)',
    lblTitle:'Title',phTitle:'e.g. My Live Pedalboard',phTitleGear:'e.g. My New Gear！',lblYoutube:'YouTube URL (optional)',
    lblGear:'Gear (1+ recommended)',gearHint1:'※ Adding gear increases views',
    gearHint2:'Tap a suggestion to add easily',gearHint3:'Just one is fine to start',
    gearPlaceholder:'Enter gear name (e.g. DS-1, Big Muff)',laterInput:'Add later',
    lblGenre:'Genre (multiple OK)',lblDesc:'Description (optional)',phDesc:'Your setup story, preferences...',
    passTitle:'🔑 Set a 4-digit edit password',
    passWarn:'You\'ll need this to <strong>edit or delete</strong> your post. <strong>Cannot be recovered if forgotten.</strong>',
    anonNote:'※ No sign-up required · Name is optional',
    btnNext:'Next',btnBack:'← Back',btnSubmit:'🚀 Post',btnSkip:'Skip',
    confirmType:'Type',confirmUser:'Username',confirmTitle:'Title',confirmGear:'Gear',
    confirmGenre:'Genre',confirmDesc:'Description',confirmYt:'YouTube',confirmPhoto:'Photos',
    typeBoard:'Pedalboard',typeGear:'MY GEAR',
    doneTitle:'Posted!',doneSub:'Your board is now public!',doneSubGear:'Your gear is now public!',doneClose:'Close',
    gearRemindTitle:'Add your gear?',gearRemindSub:'Adding gear helps more people find your post.',
    gearRemindAdd:'Add gear',gearRemindSkip:'Post anyway',
    filterClear:'← Clear Filter',emptyGenrePromo:'Be the first to post in this genre!',
    logoSub:'Pedalboard SNS',
    newsOutlet:'Soundhouse Outlet',newsOutletSub:'Check deals',
    newsSale:'Soundhouse Sale',newsSaleSub:'Limited time sale',
    newsNew:'New Effects',newsNewSub:'Latest arrivals at Soundhouse',
    contactMsg:'Contact feature coming soon',
    tickerHot:'Trending ▸ ',tickerNew:'New ▸ @',
    toolAddNum:'＋ Add Number',toolCrop:'Crop',toolRotate:'Rotate',toolDone:'Done',toolBack:'← Back',
    toolMore:'…',menuReset:'Reset All',menuUndo:'Remove All Numbers',
    hintNormal:'Tap "Add Number" to label your gear',hintNumberMode:'Drag to move · Tap to delete',hintCrop:'Drag to select crop area',
    tutorialText:'Adding numbers to each pedal makes your layout easy to understand',tutorialBtn:'Add Numbers',tutorialSkip:'Skip',
    stepPhotoSub:'Step 1: Photo & Numbers',stepInfoSub:'Step 2: Title & Info',
    stepGearSub:'Step 3: Gear List',stepGenreSub:'Step 4: Genre & Details',stepConfirmSub:'Step 5: Review & Post',
    panelGenre:'Genre',panelBrand:'Brand',panelFxType:'Effect Type',
    slMenu:'Menu',slHome:'Home',slEncyclopedia:'Pedal Encyclopedia',
    slBrand:'Filter by Brand',slFxType:'Effect Type',slGenre:'Genre',
    slBoardGenre:'Board Genre',slMypage:'My Page / Sign Up',
    brandSelectDefault:'Select a brand...',typeSelectDefault:'Select a type...',
    encyclopediaLinkText:'Browse 2,300+ pedals',
    subStandard:'Classics',subAmbient:'Ambient',subAlterna:'Alternative',
    subDrive:'Drive',subModulation:'Modulation',subOther:'Other',
    tagHomRec:'Home Rec',tagBeginner:'Beginner',
    lblPhoto:'Photos (max 3 · optional)',
    langBtn:'JA',
  }
};
function tr(key){return(I18N[lang]||I18N.ja)[key]||I18N.ja[key]||key;}

// ── ブランドドロップダウンをSupabaseから動的生成
async function loadBrandsDropdown(){
  const{data}=await sb.from('pedals').select('brand').order('brand',{ascending:true});
  if(!data)return;
  const brands=[...new Set(data.map(d=>d.brand))].filter(Boolean).sort();
  const selectors=['pc-brand-select','mob-brand-select'];
  selectors.forEach(id=>{
    const sel=document.getElementById(id);
    if(!sel)return;
    // デフォルトオプション以外を削除してから追加（重複防止）
    while(sel.options.length>1)sel.remove(1);
    brands.forEach(b=>{
      const opt=document.createElement('option');
      opt.value=b;opt.textContent=b;
      sel.appendChild(opt);
    });
  });
}

function applyLangUI(){
  const label=document.getElementById('lang-label');
  if(label)label.textContent=lang==='ja'?'EN':'JA';
  document.querySelectorAll('.logo-sub').forEach(el=>el.textContent=tr('logoSub'));
  const hbtn=document.querySelector('.h-btn');if(hbtn)hbtn.innerHTML=tr('headerPost');
  const ddItems=document.querySelectorAll('.post-dropdown-item');
  if(ddItems[0])ddItems[0].innerHTML=tr('postDropBoard');
  if(ddItems[1])ddItems[1].innerHTML=tr('postDropGear');
  document.querySelectorAll('.post-banner').forEach((banner,i)=>{
    const txt=banner.querySelector('.post-banner-text');
    if(txt)txt.innerHTML='<strong>'+(i===0?tr('postBannerTitle2'):tr('postBannerTitle'))+'</strong><br>'+tr('postBannerSub');
    banner.querySelectorAll('.pb-btn.board').forEach(el=>el.textContent=tr('btnPostBoard'));
    banner.querySelectorAll('.pb-btn.gear-b').forEach(el=>el.textContent=tr('btnPostGear'));
  });
  document.querySelectorAll('.feed-tab').forEach(el=>{
    const v=el.getAttribute('onclick')||'';
    if(v.includes("'all'"))el.textContent=tr('feedAll');
    else if(v.includes("'board'"))el.textContent=tr(el.closest('#mob-feed-panel')?'feedBoardMob':'feedBoard');
    else if(v.includes("'gear'"))el.textContent=tr('feedGear');
  });
  document.querySelectorAll('.sort-b').forEach(el=>{
    const v=el.getAttribute('onclick')||'';
    if(v.includes("'new'"))el.textContent=tr('sortNew');
    else if(v.includes("'likes'"))el.textContent=tr('sortLikes');
  });
  document.querySelectorAll('.wt').forEach(el=>{
    const txt=el.textContent;
    if(txt.match(/今月の人気|Top Boards/))el.textContent=tr('widgetRanking');
    else if(txt.match(/よく使われ|Popular Gear/))el.textContent=tr('widgetGear');
    else if(txt.match(/機材NEWS|Gear News/))el.textContent=tr('widgetNews');
  });
  document.querySelectorAll('.mob-panel-title').forEach(el=>{
    const txt=el.textContent.trim();
    let key=null;
    if(txt.match(/今月の人気|Top Boards/))key='widgetRankingMob';
    else if(txt.match(/よく使われ|Popular Gear/))key='widgetGearMob';
    else if(txt.match(/機材NEWS|Gear News/))key='widgetNewsMob';
    else if(txt.match(/^広告$|^Ad$/))key='adMob';
    if(key)el.innerHTML=tr(key)+'<span style="flex:1;height:1px;background:var(--bd);margin-left:8px;display:inline-block;vertical-align:middle"></span>';
  });
  document.querySelectorAll('.news-link').forEach(el=>{
    const t1=el.querySelector('.nr-t');const t2=el.querySelector('.nr-d');if(!t1||!t2)return;
    const txt=t1.textContent;
    if(txt.match(/アウトレット|Outlet/)){t1.textContent=tr('newsOutlet');t2.textContent=tr('newsOutletSub');}
    else if(txt.match(/セール|Sale/)){t1.textContent=tr('newsSale');t2.textContent=tr('newsSaleSub');}
    else if(txt.match(/新着|New Effects/)){t1.textContent=tr('newsNew');t2.textContent=tr('newsNewSub');}
  });
  document.querySelectorAll('.footer-link').forEach(el=>{
    if(el.textContent.match(/プライバシー|Privacy/))el.textContent=tr('footerPrivacy');
    else if(el.textContent.match(/お問い合わせ|Contact/)){el.textContent=tr('footerContact');el.setAttribute('onclick',"showToast('"+tr('contactMsg')+"')");}
  });
  const fcopy=document.querySelector('.footer-copy');if(fcopy)fcopy.textContent=tr('footerCopy');

  // PC サイドバー
  const slMypage=document.getElementById('sl-mypage-text');if(slMypage)slMypage.textContent=tr('slMypage');
  const mobMypage=document.getElementById('mob-mypage-text');if(mobMypage)mobMypage.textContent=tr('slMypage');
  const slMenu=document.getElementById('sl-lbl-menu');if(slMenu)slMenu.textContent=tr('slMenu');
  const slHome=document.getElementById('sl-home-text');if(slHome)slHome.textContent=tr('slHome');
  const slEnc=document.getElementById('sl-encyclopedia-text');if(slEnc)slEnc.textContent=tr('slEncyclopedia');
  const slEncLink=document.getElementById('sl-encyclopedia-link-text');if(slEncLink)slEncLink.textContent=tr('encyclopediaLinkText');
  const slGenre=document.getElementById('sl-lbl-genre');if(slGenre)slGenre.textContent=tr('slBoardGenre');
  const slBrand=document.getElementById('sl-lbl-brand');if(slBrand)slBrand.textContent=tr('slBrand');
  const mobBoardGenre=document.getElementById('mob-title-board-genre');if(mobBoardGenre)mobBoardGenre.textContent=tr('slBoardGenre');
  const slFx=document.getElementById('sl-lbl-fxtype');if(slFx)slFx.textContent=tr('slFxType');
  const slStd=document.getElementById('sl-sub-standard');if(slStd)slStd.textContent=tr('subStandard');
  const slAmb=document.getElementById('sl-sub-ambient');if(slAmb)slAmb.textContent=tr('subAmbient');
  const slAlt=document.getElementById('sl-sub-alterna');if(slAlt)slAlt.textContent=tr('subAlterna');

  // モバイル パネルタイトル
  const mpEnc=document.getElementById('mob-title-encyclopedia');if(mpEnc)mpEnc.textContent=tr('slEncyclopedia');
  const mpEncLink=document.getElementById('mob-encyclopedia-link-text');if(mpEncLink)mpEncLink.textContent=tr('encyclopediaLinkText');
  const mpGenre=document.getElementById('mob-title-genre');if(mpGenre)mpGenre.textContent=tr('panelGenre');
  const mpBrand=document.getElementById('mob-title-brand');if(mpBrand)mpBrand.textContent=tr('panelBrand');
  const mpFx=document.getElementById('mob-title-fxtype');if(mpFx)mpFx.textContent=tr('panelFxType');
  const mobStd=document.getElementById('mob-lbl-standard');if(mobStd)mobStd.textContent=tr('subStandard');
  const mobAmb=document.getElementById('mob-lbl-ambient');if(mobAmb)mobAmb.textContent=tr('subAmbient');
  const mobAlt=document.getElementById('mob-lbl-alterna');if(mobAlt)mobAlt.textContent=tr('subAlterna');

  // ドロップダウン デフォルト option
  const pcBrandDef=document.getElementById('pc-brand-select-default');if(pcBrandDef)pcBrandDef.textContent=tr('brandSelectDefault');
  const mobBrandDef=document.getElementById('mob-brand-select-default');if(mobBrandDef)mobBrandDef.textContent=tr('brandSelectDefault');
  const pcTypeDef=document.getElementById('pc-type-select-default');if(pcTypeDef)pcTypeDef.textContent=tr('typeSelectDefault');
  const mobTypeDef=document.getElementById('mob-type-select-default');if(mobTypeDef)mobTypeDef.textContent=tr('typeSelectDefault');

  // タイプドロップダウンのoption翻訳（日英切り替え）
  const typeOptionsJa={
    'overdrive':'OD（オーバードライブ）','distortion':'Dist（ディストーション）','fuzz':'Fuzz（ファズ）',
    'boost':'Boost（ブースター）','reverb':'Reverb（リバーブ）','delay':'Delay（ディレイ）',
    'chorus':'Chorus（コーラス）','flanger':'Flanger（フランジャー）','phaser':'Phaser（フェイザー）',
    'tremolo':'Tremolo（トレモロ）','vibrato':'Vibrato（ビブラート）','pitch':'Pitch（ピッチ）',
    'wah':'Wah（ワウ）','comp':'Comp（コンプレッサー）','eq':'EQ（イコライザー）',
    'noise_gate':'Noise Gate','looper':'Looper（ルーパー）','volume':'Volume（ボリューム）',
    'tuner':'Tuner（チューナー）','multi':'Multi FX（マルチ）','preamp':'Preamp（プリアンプ）',
    'switcher':'Switcher（スイッチャー）','buffer':'Buffer（バッファー）'
  };
  const typeOptionsEn={
    'overdrive':'Overdrive (OD)','distortion':'Distortion','fuzz':'Fuzz',
    'boost':'Boost','reverb':'Reverb','delay':'Delay',
    'chorus':'Chorus','flanger':'Flanger','phaser':'Phaser',
    'tremolo':'Tremolo','vibrato':'Vibrato','pitch':'Pitch Shifter',
    'wah':'Wah','comp':'Compressor','eq':'EQ',
    'noise_gate':'Noise Gate','looper':'Looper','volume':'Volume',
    'tuner':'Tuner','multi':'Multi FX','preamp':'Preamp',
    'switcher':'Switcher','buffer':'Buffer'
  };
  const typeMap=lang==='ja'?typeOptionsJa:typeOptionsEn;
  ['pc-type-select','mob-type-select'].forEach(id=>{
    const sel=document.getElementById(id);if(!sel)return;
    Array.from(sel.options).forEach(opt=>{
      if(opt.value&&typeMap[opt.value])opt.textContent=typeMap[opt.value];
    });
  });

  // 宅録・初心者相談タグ
  ['tag-tagroku-pc','tag-tagroku-mob','gs-tagroku'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.textContent=tr('tagHomRec');
  });
  ['tag-shoshinsha-pc','tag-shoshinsha-mob','gs-shoshinsha'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.textContent=tr('tagBeginner');
  });

  // 投稿フォーム内ジャンルサブラベル
  document.querySelectorAll('#post-genre-select [style*="font-size"]').forEach(el=>{
    const txt=el.textContent.trim();
    if(txt.match(/^定番$|^Classics$/))el.textContent=tr('subStandard');
    else if(txt.match(/^空間系$|^Ambient$/))el.textContent=tr('subAmbient');
    else if(txt.match(/^オルタナ系$|^Alternative$/))el.textContent=tr('subAlterna');
  });
  const lblGearStep=document.getElementById('gear-step-lbl');if(lblGearStep)lblGearStep.textContent=tr('lblGear');
  const lblPhoto=document.getElementById('lbl-photo');if(lblPhoto)lblPhoto.textContent=tr('lblPhoto');
  const lblUser=document.getElementById('lbl-username');if(lblUser)lblUser.textContent=tr('lblUsername');
  const lblTitle=document.getElementById('lbl-title');if(lblTitle)lblTitle.textContent=tr('lblTitle');
  const lblYt=document.getElementById('lbl-youtube');if(lblYt)lblYt.textContent=tr('lblYoutube');
  const lblGenreF=document.getElementById('lbl-genre');if(lblGenreF)lblGenreF.textContent=tr('lblGenre');
  const lblDesc=document.getElementById('lbl-desc');if(lblDesc)lblDesc.textContent=tr('lblDesc');
  const passTitle=document.getElementById('pass-box-title');if(passTitle)passTitle.textContent=tr('passTitle');
  const passWarn=document.getElementById('pass-warn');if(passWarn)passWarn.innerHTML=tr('passWarn');
  const anonNote=document.getElementById('anon-note');if(anonNote)anonNote.textContent=tr('anonNote');
  const pusr=document.getElementById('post-username');if(pusr)pusr.placeholder=tr('phUsername');
  const ptitle=document.getElementById('post-title');if(ptitle)ptitle.placeholder=tr(currentPostType==='gear'?'phTitleGear':'phTitle');
  const pdesc=document.getElementById('post-desc');if(pdesc)pdesc.placeholder=tr('phDesc');
  const hsearch=document.getElementById('h-search');if(hsearch)hsearch.placeholder=lang==='en'?'Search...':'フリーワード';
  const msearch=document.getElementById('mob-search');if(msearch)msearch.placeholder=lang==='en'?'Search...':'フリーワード検索...';
  const grTitle=document.querySelector('#gear-remind-bd div[style*="font-size:20px"]');if(grTitle)grTitle.textContent=tr('gearRemindTitle');
  const grSub=document.querySelector('#gear-remind-bd div[style*="font-size:12px"]');if(grSub)grSub.textContent=tr('gearRemindSub');
  const grBtns=document.querySelectorAll('#gear-remind-bd button');
  if(grBtns[0])grBtns[0].textContent=tr('gearRemindAdd');
  if(grBtns[1])grBtns[1].textContent=tr('gearRemindSkip');
  updateStepUI();
  if(allDBPosts.length){renderGearWidget(allDBPosts);renderGearWidgetMob(allDBPosts);renderRankingWidget(allDBPosts);renderRankingWidgetMob(allDBPosts);}
}

function togglePostDropdown(e){e.stopPropagation();document.getElementById('post-dropdown').classList.toggle('open');}
function closeDropdownAndPost(type){document.getElementById('post-dropdown').classList.remove('open');openPost(type);}
document.addEventListener('click',()=>document.getElementById('post-dropdown').classList.remove('open'));
function toggleLang(){
  lang=lang==='ja'?'en':'ja';
  localStorage.setItem('mgmb_lang',lang);
  const label=document.getElementById('lang-label');
  if(label)label.textContent=lang==='ja'?'EN':'JA';
  applyLangUI();
  if(allDBPosts.length)applyFilter();
}

function buildTicker(posts){
  const inner=document.getElementById('ticker-inner');if(!inner)return;
  const items=[];
  const top=[...posts].sort((a,b)=>(b.likes||0)-(a.likes||0)).slice(0,3);
  top.forEach(p=>items.push({text:tr('tickerHot')+p.title,id:p.id}));
  const recent=[...posts].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,3);
  recent.forEach(p=>items.push({text:tr('tickerNew')+(p.username||'anon')+' 「'+p.title+'」',id:p.id}));
  if(!items.length){inner.innerHTML='<span class="ti">My Gear My Board</span><span class="ti">My Gear My Board</span>';return;}
  const doubled=[...items,...items];
  inner.innerHTML=doubled.map(x=>'<span class="ti" onclick="location.href=\'/post?id='+x.id+'\'">'+x.text+'</span>').join('');
}

async function loadPostsFromDB(){
  const{data:posts,error}=await sb.from('posts').select('*').order('created_at',{ascending:false});
  if(error){console.error(error);return;}
  const{data:cc}=await sb.from('comments').select('post_id');
  const cm={};if(cc)cc.forEach(c=>{cm[c.post_id]=(cm[c.post_id]||0)+1;});
  const{data:pedals}=await sb.from('pedals').select('full_name,types');
  const pedalTypesMap={};
  if(pedals)pedals.forEach(p=>{pedalTypesMap[p.full_name]=(p.types||[]);});
  allDBPosts=(posts||[]).map(p=>({
    ...p,
    comment_count:cm[p.id]||0,
    gear_list:(Array.isArray(p.gear_list)?p.gear_list:[]).map(g=>({...g,types:pedalTypesMap[g.name]||[]}))
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
function genreMatches(post,filter){
  if(filter==='ALL')return true;
  const genres=parseGenre(post.genre);
  return genres.some(g=>g===filter||g.toUpperCase()===filter.toUpperCase());
}
function translateGenre(g){
  if(lang!=='en')return g;
  const map={'初心者相談':'Beginner','宅録':'Home Rec','ROCK':'ROCK','BLUES':'BLUES','JAZZ':'JAZZ','METAL':'METAL','FUNK':'FUNK','AMBIENT':'AMBIENT','SHOEGAZE':'SHOEGAZE','POST ROCK':'POST ROCK','INDIE':'INDIE','ALTERNATIVE':'ALTERNATIVE','PUNK':'PUNK'};
  return map[g]||g;
}

function applyFilter(){
  let posts=[...allDBPosts];
  if(currentTab==='board')posts=posts.filter(p=>!p.post_type||p.post_type==='board');
  else if(currentTab==='gear')posts=posts.filter(p=>p.post_type==='gear');
  if(currentGenreFilter!=='ALL')posts=posts.filter(p=>genreMatches(p,currentGenreFilter));
  if(currentSearchQuery){
    posts=posts.filter(p=>searchMatches(p,currentSearchQuery));
    const badgeText='「'+currentSearchQuery+'」'+(lang==='ja'?'の検索結果：':': ')+posts.length+(lang==='ja'?'件':'');
    const badge=document.getElementById('search-badge');if(badge){badge.textContent=badgeText;badge.classList.add('show');}
    const mobBadge=document.getElementById('mob-search-badge');if(mobBadge){mobBadge.textContent=badgeText;mobBadge.classList.add('show');}
  }else{
    const badge=document.getElementById('search-badge');if(badge)badge.classList.remove('show');
    const mobBadge=document.getElementById('mob-search-badge');if(mobBadge)mobBadge.classList.remove('show');
  }
  if(currentSort==='likes')posts.sort((a,b)=>(b.likes||0)-(a.likes||0));
  renderDBPosts(posts);
}

function timeAgo(ts){
  const d=Math.floor((Date.now()-new Date(ts))/1000);
  if(lang==='en'){if(d<60)return'just now';if(d<3600)return Math.floor(d/60)+'m ago';if(d<86400)return Math.floor(d/3600)+'h ago';return Math.floor(d/86400)+'d ago';}
  if(d<60)return'たった今';if(d<3600)return Math.floor(d/60)+'分前';if(d<86400)return Math.floor(d/3600)+'時間前';return Math.floor(d/86400)+'日前';
}

function getEmptyHTML(){
  const isFiltered=currentGenreFilter!=='ALL';
  if(!isFiltered)return '<div style="grid-column:1/-1;text-align:center;padding:40px;font-family:Noto Sans JP,sans-serif;font-size:11px;color:var(--td)">'+tr('noPostGeneral')+'</div>';
  const label=currentGenreFilter;
  const promo=tr('emptyGenrePromo');
  const noPostMsg=lang==='en'?'"'+label+'": no posts yet':'「'+label+'」の投稿はまだありません';
  return '<div class="empty-filter"><div class="empty-filter-msg">'+noPostMsg+'</div><div class="empty-filter-promo">'+promo+'</div><div class="empty-filter-btn" onclick="clearFilter()">'+tr('filterClear')+'</div></div>';
}

function clearFilter(){
  currentGenreFilter='ALL';
  document.querySelectorAll('.sl .tag, #swipe-ui .tag').forEach(t2=>{t2.classList.toggle('on',t2.getAttribute('data-genre')==='ALL');});
  clearSearch();updateMobFilterClear();
}

function renderDBPosts(posts){
  const grid=document.getElementById('card-grid');const gridMob=document.getElementById('card-grid-mob');
  const anonName=lang==='en'?'Anonymous':'匿名ユーザー';
  const html=posts.length?posts.map((p,i)=>{
    const init=(p.username||'匿')[0].toUpperCase();
    const gear=Array.isArray(p.gear_list)?p.gear_list:[];
    const SHOW=2;
    const tags=gear.slice(0,SHOW).map(g=>'<span class="ptag">'+(g.name||g)+'</span>').join('');
    const moreCount=gear.length-SHOW;
    const moreBadge=moreCount>0?'<span class="ptag-more">…'+(lang==='en'?moreCount+' more':'他'+moreCount+'件')+'</span>':'';
    const isGear=p.post_type==='gear';
    const genres=parseGenre(p.genre);const glabel=genres.slice(0,2).map(translateGenre).join(' · ');
    const destUrl='/post?id='+p.id;const ytBadge=p.youtube_url?'<div class="yt-bdg">▶ YouTube</div>':'';
    return '<div class="card" onclick="location.href=\''+destUrl+'\'" style="animation-delay:'+(i*.05)+'s">'
      +'<div class="iw">'+(p.image_urls&&p.image_urls[0]?'<img src="'+p.image_urls[0]+'" loading="lazy" onclick="event.stopPropagation();openLightbox(this.src)" style="cursor:zoom-in">':'<div style="font-size:40px;opacity:.2">'+(isGear?'🎸':'🎛')+'</div>')
      +'<div class="iw-ov"></div>'+(isGear?'<div class="bdg gear-bdg">'+(lang==='en'?'Gear':'機材')+'</div>':(glabel?'<div class="bdg">'+glabel+'</div>':''))+ytBadge+'</div>'
      +'<div class="body"><div class="cu"><div class="av">'+init+'</div>'
      +'<div class="av-name">'+(p.username||anonName)+'</div>'
      +'<div class="av-time">'+timeAgo(p.created_at)+'</div></div>'
      +'<div class="ct">'+p.title+'</div><div class="ptags">'+tags+moreBadge+'</div>'
      +'<div class="cf"><div class="st" onclick="toggleDBLike(event,\''+p.id+'\',this)">❤️ <span>'+(p.likes||0)+'</span></div>'
      +'<div class="st">💬 <span>'+(p.comment_count||0)+'</span></div></div></div></div>';
  }).join(''):getEmptyHTML();
  if(grid)grid.innerHTML=html;if(gridMob)gridMob.innerHTML=html;
}

async function toggleDBLike(e,postId,el){
  e.stopPropagation();const cnt=el.querySelector('span');
  const{data:ex}=await sb.from('likes').select('id').eq('post_id',postId).eq('session_id',SESSION_ID);
  if(ex&&ex.length){
    await sb.from('likes').delete().eq('post_id',postId).eq('session_id',SESSION_ID);
    const n=Math.max(0,(parseInt(cnt.textContent)||1)-1);
    await sb.from('posts').update({likes:n}).eq('id',postId);cnt.textContent=n;el.classList.remove('liked');
  }else{
    await sb.from('likes').insert({post_id:postId,session_id:SESSION_ID});
    const n=(parseInt(cnt.textContent)||0)+1;
    await sb.from('posts').update({likes:n}).eq('id',postId);cnt.textContent=n;el.classList.add('liked');
    showToast(lang==='en'?'❤️ Liked!':'❤️ いいねしました');
  }
}

function filterGenre(el,genre){document.querySelectorAll('.sl .tag').forEach(t2=>t2.classList.remove('on'));el.classList.add('on');currentGenreFilter=genre||'ALL';applyFilter();}
function setTab(el,tab){
  document.querySelectorAll('.feed-tab').forEach(t2=>t2.classList.remove('on'));el.classList.add('on');currentTab=tab;
  const fh=document.getElementById('feed-heading');if(fh)fh.textContent=tab==='gear'?'GEAR':'PEDALBOARDS';
  const fhm=document.getElementById('feed-heading-mob');if(fhm)fhm.textContent=tab==='gear'?'GEAR':'PEDALBOARDS';
  applyFilter();
}
function setSort(el,sort){document.querySelectorAll('.sort-b').forEach(b=>b.classList.remove('on'));el.classList.add('on');currentSort=sort;applyFilter();}

function renderRankingWidget(posts){
  const el=document.getElementById('ranking-widget');if(!el)return;
  const bp=posts.filter(p=>!p.post_type||p.post_type==='board');
  const monthAgo=Date.now()-30*24*60*60*1000;const monthly=bp.filter(p=>new Date(p.created_at).getTime()>monthAgo);
  const target=monthly.length>=3?monthly:bp;
  const sorted=[...target].sort((a,b)=>(b.likes||0)-(a.likes||0)).slice(0,5);
  if(!sorted.length){el.innerHTML='<div style="font-size:10px;color:var(--td);font-family:Noto Sans JP,sans-serif">'+tr('noPost')+'</div>';return;}
  const anon=lang==='en'?'Anonymous':'匿名';
  el.innerHTML=sorted.map((p,i)=>{const crown=i===0?'<span style="margin-right:4px">👑</span>':'';
    return '<div class="ri" onclick="location.href=\'/post?id='+p.id+'\'">'+'<div class="rn '+(i<2?'hi':'')+'">'+crown+(i+1)+'</div>'+'<div class="ri-i"><div class="ri-t">'+p.title+'</div><div class="ri-u">'+(p.username||anon)+'</div></div>'+'<div class="ri-s">❤️'+(p.likes||0)+'</div></div>';
  }).join('');
}

function soundhouseUrl(name){return'https://www.soundhouse.co.jp/search/index?search_all='+encodeURIComponent(name);}

function renderGearWidget(posts){
  const el=document.getElementById('gear-widget');if(!el)return;
  const count={};
  posts.forEach(p=>{const g=Array.isArray(p.gear_list)?p.gear_list:[];g.forEach(x=>{const n=(x.name||x||'').trim();if(n)count[n]=(count[n]||0)+1;});});
  const sorted=Object.entries(count).sort((a,b)=>b[1]-a[1]).slice(0,5);
  if(!sorted.length){el.innerHTML='<div style="font-size:10px;color:var(--td);font-family:Noto Sans JP,sans-serif">'+tr('noData')+'</div>';return;}
  el.innerHTML=sorted.map(([n,c])=>'<div class="gr">'
    +'<a href="'+soundhouseUrl(n)+'" target="_blank" rel="noopener" style="flex:1;min-width:0;text-decoration:none" onclick="event.stopPropagation();filterByGearName(\''+n.replace(/'/g,"\\'")+'\')">'
    +'<div class="gr-n" style="color:var(--tx)">'+n+'</div><div class="gr-b">'+c+tr('posts')+'</div></a>'
    +'<a href="'+soundhouseUrl(n)+'" target="_blank" rel="noopener" style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;flex-shrink:0;text-decoration:none;background:var(--sf2);border:1px solid var(--bd);border-radius:4px;font-size:13px">🔍</a>'
    +'</div>').join('');
}

function filterByGearName(name){
  currentGenreFilter='ALL';
  const posts=allDBPosts.filter(p=>{const g=Array.isArray(p.gear_list)?p.gear_list:[];return g.some(x=>(x.name||x||'').toLowerCase()===name.toLowerCase());});
  renderDBPosts(posts.length?posts:[]);
  if(window.innerWidth<=680)setTimeout(()=>goPanel(1),180);
}

let currentSearchQuery='';
function handleSearch(val){currentSearchQuery=val.trim();const clearBtn=document.getElementById('h-search-clear');if(clearBtn)clearBtn.classList.toggle('show',currentSearchQuery.length>0);applyFilter();}
function clearSearch(){currentSearchQuery='';const input=document.getElementById('h-search');if(input)input.value='';const clearBtn=document.getElementById('h-search-clear');if(clearBtn)clearBtn.classList.remove('show');const badge=document.getElementById('search-badge');if(badge)badge.classList.remove('show');applyFilter();}
let _mobSearchTimer=null;
function handleSearchMob(val){
  currentSearchQuery=val.trim();
  const clearBtn=document.getElementById('mob-search-clear');
  if(clearBtn)clearBtn.classList.toggle('show',currentSearchQuery.length>0);
  applyFilter();updateMobFilterClear();
  clearTimeout(_mobSearchTimer);
  if(currentSearchQuery)_mobSearchTimer=setTimeout(()=>goPanel(1),5000);
}
function clearSearchMob(){currentSearchQuery='';const input=document.getElementById('mob-search');if(input)input.value='';const clearBtn=document.getElementById('mob-search-clear');if(clearBtn)clearBtn.classList.remove('show');const badge=document.getElementById('mob-search-badge');if(badge)badge.classList.remove('show');applyFilter();updateMobFilterClear();}
function searchMatches(post,query){
  if(!query)return true;const q=query.toLowerCase();
  const title=(post.title||'').toLowerCase();const username=(post.username||'').toLowerCase();const desc=(post.description||'').toLowerCase();
  const gear=Array.isArray(post.gear_list)?post.gear_list:[];const gearStr=gear.map(g=>(g.name||g||'').toLowerCase()).join(' ');
  const genres=parseGenre(post.genre).join(' ').toLowerCase();
  return title.includes(q)||username.includes(q)||desc.includes(q)||gearStr.includes(q)||genres.includes(q);
}

// ── 機材サジェスト
let selectedGears=[],acResults=[],acFocusIdx=-1;
async function searchGear(val){
  const q=val.trim();closeAC();if(!q)return;
  const{data:prefixData}=await sb.from('pedals').select('brand,model,full_name,search_query').or('brand.ilike.'+q+'%,model.ilike.'+q+'%,full_name.ilike.'+q+'%').limit(10);
  let results=prefixData||[];
  if(results.length<5){const{data:fuzzy}=await sb.from('pedals').select('brand,model,full_name,search_query').ilike('full_name','%'+q+'%').limit(10);if(fuzzy)fuzzy.forEach(x=>{if(!results.find(r=>r.full_name===x.full_name))results.push(x);});}
  results=results.slice(0,10);acResults=results;acFocusIdx=-1;
  const dd=document.getElementById('ac-dropdown');
  if(!results.length){dd.innerHTML='<div class="ac-empty">「'+q+'」— '+(lang==='en'?'No suggestions. Press Enter to add':'候補なし　Enterで追加')+'</div>';dd.classList.add('open');return;}
  dd.innerHTML=results.map((x,i)=>'<div class="ac-item" onmousedown="selectGear('+i+')" onmouseover="setACFocus('+i+')"><div class="ac-item-name">'+x.full_name+'</div><div class="ac-item-brand">'+x.brand+'</div></div>').join('');
  dd.classList.add('open');
}
function setACFocus(i){acFocusIdx=i;document.querySelectorAll('.ac-item').forEach((el,j)=>el.classList.toggle('focus',j===i));}
function selectGear(i){
  const x=acResults[i];if(!x)return;
  addGearTag({name:x.full_name,brand:x.brand,search_query:x.search_query||null});closeAC();
}
function addGearTag(g){
  if(selectedGears.length>=20){showToast(lang==='en'?'⚠️ Max 20 items':'⚠️ 最大20件まで');return;}
  selectedGears.push(g);renderGearTags();document.getElementById('gear-search').value='';updateGearFeedback();
}
function removeGearTag(i){selectedGears.splice(i,1);renderGearTags();updateGearFeedback();}
function renderGearTags(){
  const wrap=document.getElementById('gear-tags');if(!wrap)return;const inp=document.getElementById('gear-search');
  wrap.querySelectorAll('.gear-tag').forEach(el=>el.remove());
  selectedGears.forEach((g,i)=>{const tag=document.createElement('div');tag.className='gear-tag';tag.innerHTML=g.name+'<button class="gear-tag-x" onmousedown="event.preventDefault();removeGearTag('+i+')">✕</button>';wrap.insertBefore(tag,inp);});
}
function updateGearFeedback(){
  const fb=document.getElementById('gear-feedback');const btn=document.getElementById('gear-next-btn');if(!fb||!btn)return;
  const n=selectedGears.length;
  if(n>0){fb.style.display='block';fb.textContent=lang==='en'?'✅ '+n+' item'+(n>1?'s':'')+' added':'✅ '+n+'件追加されました';btn.textContent=lang==='en'?'Next ('+n+' added)':'次へ（'+n+'件追加済み）';}
  else{fb.style.display='none';btn.textContent=tr('btnNext');}
}
function gearKeyDown(e){
  const dd=document.getElementById('ac-dropdown');const open=dd.classList.contains('open');
  if(e.key==='ArrowDown'){e.preventDefault();if(open)setACFocus(Math.min(acFocusIdx+1,acResults.length-1));}
  else if(e.key==='ArrowUp'){e.preventDefault();setACFocus(Math.max(acFocusIdx-1,0));}
  else if(e.key==='Enter'){e.preventDefault();if(open&&acFocusIdx>=0&&acResults[acFocusIdx]){selectGear(acFocusIdx);}else{const v=e.target.value.trim();if(v){addGearTag({name:v,brand:'',search_query:null});document.getElementById('gear-search').value='';closeAC();}}}
  else if(e.key==='Backspace'&&!e.target.value&&selectedGears.length)removeGearTag(selectedGears.length-1);
  else if(e.key==='Escape')closeAC();
}
function closeAC(){document.getElementById('ac-dropdown').classList.remove('open');}
function toggleGenre(el){el.classList.toggle('on');}

// ── ステップフォーム
let currentStep=1,currentPostType='board';
const TOTAL_STEPS=5;
const STEP_SUBS=['stepPhotoSub','stepInfoSub','stepGearSub','stepGenreSub','stepConfirmSub'];
function openPost(type){
  currentPostType=type||'board';currentStep=1;selectedGears=[];uploadedPhotos=[];editedPhotos=[];
  document.querySelectorAll('#post-genre-select .gs').forEach(g=>g.classList.remove('on'));
  ['post-username','post-desc','post-youtube','post-title'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  ['pd1','pd2','pd3','pd4'].forEach(id=>{document.getElementById(id).value='';});
  updateGearFeedback();renderGearTags();renderPhotoPreviews();updateStepUI();
  document.getElementById('post-bd').classList.add('open');document.body.style.overflow='hidden';
}
function goStep(n){
  if(n===3&&currentStep===2){if(!document.getElementById('post-title').value.trim()){showToast(lang==='en'?'❌ Please enter a title':'❌ タイトルを入力してください');return;}}
  if(n===5)renderConfirm();
  currentStep=n;updateStepUI();
  if(n===3){renderStep3PhotoPreview();updateGearFeedback();}
  if(n===1)renderPhotoPreviews();
}
function renderStep3PhotoPreview(){
  const wrap=document.getElementById('step3-photo-preview');if(!wrap)return;
  if(!uploadedPhotos.length){wrap.style.display='none';return;}
  wrap.style.display='flex';
  wrap.innerHTML=uploadedPhotos.map((src,i)=>{const disp=editedPhotos[i]||src;return '<img src="'+disp+'" style="width:72px;height:72px;object-fit:cover;border-radius:4px;border:1px solid var(--bd);cursor:pointer" onclick="openImgEditor('+i+')" title="'+(lang==='en'?'Tap to edit':'タップして編集')+'">';}).join('');
}
function updateStepUI(){
  document.querySelectorAll('.step-panel').forEach((el,i)=>el.classList.toggle('on',i+1===currentStep));
  const titleEl=document.getElementById('step-title');
  if(titleEl)titleEl.textContent=currentPostType==='board'?tr('btnPostBoard'):tr('btnPostGear');
  const subEl=document.getElementById('step-sub');if(subEl)subEl.textContent=tr(STEP_SUBS[currentStep-1]);
  const ptitleEl=document.getElementById('post-title');
  if(ptitleEl)ptitleEl.placeholder=tr(currentPostType==='gear'?'phTitleGear':'phTitle');
  document.getElementById('step-dots').innerHTML=Array.from({length:TOTAL_STEPS},(_,i)=>'<div class="step-dot '+(i+1===currentStep?'on':i+1<currentStep?'done':'')+'"></div>').join('');
  document.querySelectorAll('.step-btn.back').forEach(b=>b.textContent=tr('btnBack'));
  document.querySelectorAll('.step-btn.next').forEach(b=>{if(b.id!=='gear-next-btn')b.textContent=tr('btnNext')+' →';});
  const submitBtn=document.getElementById('submit-btn');if(submitBtn&&!submitBtn.disabled)submitBtn.textContent=tr('btnSubmit');
  const gearNextBtn=document.getElementById('gear-next-btn');if(gearNextBtn)gearNextBtn.textContent=tr('btnNext');
  if(currentStep===1){
    const ua=document.getElementById('upload-area-main');
    if(ua){const divs=ua.querySelectorAll('div');if(divs[0])divs[0].textContent=tr('uploadAreaText');if(divs[1])divs[1].textContent=tr('uploadAreaSub');}
    const hint=document.getElementById('upload-hint');if(hint)hint.textContent=tr('uploadAreaHint');
    const skipBtn=document.getElementById('skip-photo-btn');if(skipBtn)skipBtn.style.display='none';
  }
  if(currentStep===3){
    const gs=document.getElementById('gear-search');if(gs)gs.placeholder=tr('gearPlaceholder');
    const h1=document.getElementById('gear-hint1');if(h1)h1.textContent=tr('gearHint1');
    const h2=document.getElementById('gear-hint2');if(h2)h2.textContent=tr('gearHint2');
    const h3=document.getElementById('gear-hint3');if(h3)h3.textContent=tr('gearHint3');
    const later=document.getElementById('later-input-btn');if(later)later.textContent=tr('laterInput');
    updateGearFeedback();
  }
}
function renderConfirm(){
  const username=document.getElementById('post-username').value.trim()||(lang==='en'?'Anonymous':'匿名ユーザー');
  const title=document.getElementById('post-title').value.trim();const desc=document.getElementById('post-desc').value.trim();const yt=document.getElementById('post-youtube').value.trim();
  const genres=[...document.querySelectorAll('#post-genre-select .gs.on')].map(el=>el.getAttribute('data-val')||el.textContent.trim());
  const none=lang==='en'?'(none)':'(未入力)';const noSel=lang==='en'?'(none)':'(未選択)';
  document.getElementById('confirm-content').innerHTML=[
    [tr('confirmType'),currentPostType==='board'?tr('typeBoard'):tr('typeGear')],
    [tr('confirmUser'),username],[tr('confirmTitle'),title||none],
    [tr('confirmGear'),selectedGears.map(g=>g.name).join(', ')||none],
    [tr('confirmGenre'),genres.join(', ')||noSel],
    [tr('confirmDesc'),desc?desc.slice(0,60)+(desc.length>60?'...':''):none],
    [tr('confirmYt'),yt||none],
    [tr('confirmPhoto'),(editedPhotos.filter(x=>x).length||uploadedPhotos.length)+(lang==='en'?' photos':'枚')],
  ].map(([l,v])=>'<div class="confirm-row"><div class="confirm-lbl">'+l+'</div><div class="confirm-val">'+v+'</div></div>').join('');
}

// ── 写真
let uploadedPhotos=[],editedPhotos=[];
const MAX_PHOTOS=3,MAX_DIM=1280,JPEG_QUALITY=0.82;
function compressImage(dataUrl){
  return new Promise(resolve=>{const img=new Image();img.onload=()=>{let{width,height}=img;if(width>MAX_DIM||height>MAX_DIM){const ratio=Math.min(MAX_DIM/width,MAX_DIM/height);width=Math.round(width*ratio);height=Math.round(height*ratio);}const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;canvas.getContext('2d').drawImage(img,0,0,width,height);resolve(canvas.toDataURL('image/jpeg',JPEG_QUALITY));};img.src=dataUrl;});
}
function handlePhotos(e){
  const files=Array.from(e.target.files);const rem=MAX_PHOTOS-uploadedPhotos.length;
  files.slice(0,rem).forEach(f=>{const r=new FileReader();r.onload=async ev=>{const compressed=await compressImage(ev.target.result);uploadedPhotos.push(compressed);editedPhotos.push(null);renderPhotoPreviews();};r.readAsDataURL(f);});
  if(files.length>rem)showToast(lang==='en'?'⚠️ Max '+MAX_PHOTOS+' photos':'⚠️ 最大'+MAX_PHOTOS+'枚まで');e.target.value='';
}
function renderPhotoPreviews(){
  const wrap=document.getElementById('photo-previews');if(!wrap)return;
  const thumbs=uploadedPhotos.map((src,i)=>{
    const displaySrc=editedPhotos[i]||src;
    return '<div class="photo-thumb"><img src="'+displaySrc+'">'
      +'<button class="photo-remove" onclick="removePhoto('+i+')">✕</button>'
      +'<button class="photo-edit-btn" onclick="openImgEditor('+i+')">'+tr('photoEditBtn')+'</button>'
      +'</div>';
  }).join('');
  const add=uploadedPhotos.length<MAX_PHOTOS?'<div class="photo-add-btn" onclick="document.getElementById(\'photo-input\').click()"><span>＋</span><span class="photo-add-label">'+(lang==='en'?'Add':'追加')+'</span></div>':'';
  wrap.innerHTML=thumbs+add;
  const cnt=document.getElementById('photo-count');if(cnt)cnt.textContent=uploadedPhotos.length+' / '+MAX_PHOTOS+(lang==='en'?' photos':'枚');
  const ua=document.getElementById('upload-area-main');if(ua)ua.style.display=uploadedPhotos.length>0?'none':'block';
}
function removePhoto(i){uploadedPhotos.splice(i,1);editedPhotos.splice(i,1);renderPhotoPreviews();}
function getFinalPhoto(i){return editedPhotos[i]||uploadedPhotos[i]||null;}

function setUploadProgress(current,total,msg){
  const wrap=document.getElementById('upload-progress-wrap');const bar=document.getElementById('upload-progress-bar');const msgEl=document.getElementById('upload-progress-msg');
  if(!wrap)return;wrap.classList.add('show');bar.style.width=Math.round(current/total*100)+'%';if(msgEl)msgEl.textContent=msg||'アップロード中...';
}
function hideUploadProgress(){const wrap=document.getElementById('upload-progress-wrap');if(wrap)wrap.classList.remove('show');}

async function uploadPhoto(b64,idx,total){
  try{
    const byteStr=atob(b64.split(',')[1]);const mime=b64.split(',')[0].split(':')[1].split(';')[0];
    const ab=new ArrayBuffer(byteStr.length);const ia=new Uint8Array(ab);for(let i=0;i<byteStr.length;i++)ia[i]=byteStr.charCodeAt(i);
    const blob=new Blob([ab],{type:mime});const ext=mime.includes('png')?'png':'jpg';const fn='posts/'+Date.now()+'_'+idx+'.'+ext;
    setUploadProgress(idx,total,'📤 '+(idx+1)+' / '+total+(lang==='en'?' uploading...':'枚目をアップロード中...'));
    const{error}=await sb.storage.from('post-images').upload(fn,blob,{contentType:mime});if(error)return null;
    const{data:u}=sb.storage.from('post-images').getPublicUrl(fn);
    setUploadProgress(idx+1,total,'📤 '+(idx+1)+' / '+total+(lang==='en'?' done':'枚目 完了'));return u.publicUrl;
  }catch(e){console.error(e);return null;}
}

let _skipGearRemind=false;
function closeGearRemind(){const r=document.getElementById('gear-remind-bd');if(r)r.style.display='none';}
async function doSubmitPost(){closeGearRemind();_skipGearRemind=true;await submitPostToDB();}

async function submitPostToDB(){
  if(selectedGears.length===0&&!_skipGearRemind){const remind=document.getElementById('gear-remind-bd');if(remind){remind.style.display='flex';return;}}
  _skipGearRemind=false;
  const btn=document.getElementById('submit-btn');if(btn){btn.disabled=true;btn.textContent=lang==='en'?'Posting...':'投稿中...';}
  const title=document.getElementById('post-title').value.trim();const desc=document.getElementById('post-desc').value.trim();
  const ytRaw=document.getElementById('post-youtube').value.trim();const ytMatch=ytRaw.match(/(https?:\/\/[^\s]+)/);const youtube_url=ytMatch?ytMatch[1]:null;
  const genres=[...document.querySelectorAll('#post-genre-select .gs.on')].map(el=>el.getAttribute('data-val')||el.textContent.trim());
  const pin=['pd1','pd2','pd3','pd4'].map(id=>document.getElementById(id).value).join('');
  if(!title){showToast(lang==='en'?'❌ Please enter a title':'❌ タイトルを入力してください');if(btn){btn.disabled=false;btn.textContent=tr('btnSubmit');}return;}
  if(pin.length<4){showToast(lang==='en'?'❌ Set a 4-digit password':'❌ 4桁パスワードを設定してください');if(btn){btn.disabled=false;btn.textContent=tr('btnSubmit');}return;}
  let image_urls=[];
  if(uploadedPhotos.length>0){
    const finals=uploadedPhotos.map((_,i)=>getFinalPhoto(i));const total=finals.filter(x=>x).length;
    setUploadProgress(0,total,'📤 '+(lang==='en'?'Uploading...':'画像をアップロード中...'));
    for(let i=0;i<finals.length;i++){if(finals[i]){const url=await uploadPhoto(finals[i],i,total);if(url)image_urls.push(url);}}
    hideUploadProgress();
  }
  const{error}=await sb.from('posts').insert({
    username:document.getElementById('post-username').value.trim()||(lang==='en'?'Anonymous':'匿名ユーザー'),
    title,description:desc,genre:genres,
    gear_list:selectedGears.map(g=>({name:g.name,brand:g.brand||'',search_query:g.search_query||null})),
    image_urls,pin_hash:pin,likes:0,post_type:currentPostType,youtube_url
  });
  if(btn){btn.disabled=false;btn.textContent=tr('btnSubmit');}
  if(error){showToast(lang==='en'?'❌ Failed to post':'❌ 投稿に失敗しました');console.error(error);return;}
  closeModal('post-bd');
  selectedGears=[];uploadedPhotos=[];editedPhotos=[];
  ['post-username','post-title','post-desc','post-youtube'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  ['pd1','pd2','pd3','pd4'].forEach(id=>{document.getElementById(id).value='';});
  document.querySelectorAll('#post-genre-select .gs.on').forEach(el=>el.classList.remove('on'));
  document.getElementById('done-sub').textContent=currentPostType==='gear'?tr('doneSubGear'):tr('doneSub');
  document.getElementById('done-bd').classList.add('open');
  await loadPostsFromDB();
}

// ── 編集モーダル
let editGearList=[];
function openEditModal(){
  if(!currentDBPost)return;
  ['pin1','pin2','pin3','pin4'].forEach(id=>{document.getElementById(id).value='';});
  document.getElementById('pin-err').textContent='';
  document.getElementById('edit-step1').style.display='block';document.getElementById('edit-step2').style.display='none';
  document.getElementById('edit-bd').classList.add('open');document.body.style.overflow='hidden';
  setTimeout(()=>document.getElementById('pin1').focus(),300);
}
function verifyPin(){
  const entered=['pin1','pin2','pin3','pin4'].map(id=>document.getElementById(id).value).join('');
  if(entered.length<4){document.getElementById('pin-err').textContent=lang==='en'?'Enter all 4 digits':'4桁すべて入力してください';return;}
  const isMaster=entered.toUpperCase()===MASTER_KEY;
  if(currentDBPost&&(isMaster||entered===currentDBPost.pin_hash)){
    document.getElementById('pin-err').textContent='';document.getElementById('edit-step1').style.display='none';
    document.getElementById('edit-title').value=currentDBPost.title||'';
    const gear=Array.isArray(currentDBPost.gear_list)?currentDBPost.gear_list:[];
    editGearList=gear.map(g=>({name:g.name||g,brand:g.brand||'',search_query:g.search_query||null}));
    renderEditGearSortList();
    document.getElementById('edit-desc').value=currentDBPost.description||'';
    const ytRaw=currentDBPost.youtube_url||'';const ytMatch=ytRaw.match(/(https?:\/\/[^\s]+)/);
    document.getElementById('edit-youtube').value=ytMatch?ytMatch[1]:'';
    document.getElementById('edit-step2').style.display='block';
    if(isMaster)showToast(lang==='en'?'🔑 Logged in as admin':'🔑 管理者としてログインしました');
  }else{
    document.getElementById('pin-err').textContent=lang==='en'?'❌ Incorrect password':'❌ パスワードが違います';
    ['pin1','pin2','pin3','pin4'].forEach(id=>{document.getElementById(id).value='';});document.getElementById('pin1').focus();
  }
}
function renderEditGearSortList(){
  const wrap=document.getElementById('edit-gear-sort-list');if(!wrap)return;
  if(!editGearList.length){wrap.innerHTML='<div style="font-size:12px;color:var(--td);padding:4px 0">機材が登録されていません</div>';return;}
  wrap.innerHTML=editGearList.map((g,i)=>`
    <div style="display:flex;align-items:center;gap:6px;background:var(--sf2);border:1px solid var(--bd);border-radius:3px;padding:6px 10px">
      <span style="color:var(--td);cursor:grab;font-size:16px;user-select:none">⠿</span>
      <span style="flex:1;font-size:13px">${g.name}</span>
      <button type="button" onclick="moveEditGear(${i},-1)" ${i===0?'disabled':''} style="padding:2px 8px;background:var(--sf);border:1px solid var(--bd);border-radius:3px;color:var(--tm);cursor:pointer;font-size:11px;font-family:Noto Sans JP,sans-serif">↑</button>
      <button type="button" onclick="moveEditGear(${i},1)" ${i===editGearList.length-1?'disabled':''} style="padding:2px 8px;background:var(--sf);border:1px solid var(--bd);border-radius:3px;color:var(--tm);cursor:pointer;font-size:11px;font-family:Noto Sans JP,sans-serif">↓</button>
      <button type="button" onclick="removeEditGear(${i})" style="padding:2px 8px;background:transparent;border:1px solid #5a1a1a;border-radius:3px;color:#e05050;cursor:pointer;font-size:11px;font-family:Noto Sans JP,sans-serif">削除</button>
    </div>
  `).join('');
}
function moveEditGear(idx,dir){
  const newIdx=idx+dir;
  if(newIdx<0||newIdx>=editGearList.length)return;
  [editGearList[idx],editGearList[newIdx]]=[editGearList[newIdx],editGearList[idx]];
  renderEditGearSortList();
}
function removeEditGear(idx){editGearList.splice(idx,1);renderEditGearSortList();}
function addEditGearItem(){
  const input=document.getElementById('edit-pedals-add');if(!input)return;
  const name=input.value.trim();if(!name)return;
  editGearList.push({name,brand:'',search_query:null});
  renderEditGearSortList();input.value='';
}
async function saveEdit(){
  const title=document.getElementById('edit-title').value.trim();if(!title){showToast(lang==='en'?'Please enter a title':'タイトルを入力してください');return;}
  const gear_list=editGearList.map(g=>({name:g.name,brand:g.brand||'',search_query:g.search_query||null}));
  const description=document.getElementById('edit-desc').value.trim();const youtube_url=document.getElementById('edit-youtube').value.trim()||null;
  const{error}=await sb.from('posts').update({title,gear_list,description,youtube_url}).eq('id',currentDBPost.id);
  if(error){showToast(lang==='en'?'❌ Update failed':'❌ 更新に失敗しました');return;}
  closeModal('edit-bd');showToast(lang==='en'?'✅ Post updated':'✅ 投稿を更新しました');await loadPostsFromDB();
}
async function confirmDelete(){
  if(!confirm(lang==='en'?'Delete this post? This cannot be undone.':'本当にこの投稿を削除しますか？\nこの操作は取り消せません。'))return;
  const{error}=await sb.from('posts').delete().eq('id',currentDBPost.id);
  if(error){showToast(lang==='en'?'❌ Delete failed':'❌ 削除に失敗しました');return;}
  closeModal('edit-bd');showToast(lang==='en'?'🗑 Post deleted':'🗑 投稿を削除しました');await loadPostsFromDB();
}

function hideTutorial(){localStorage.setItem('mgmb_tutorial_seen','1');}
function tutorialAddNumber(){hideTutorial();if(uploadedPhotos.length>0)openImgEditor(0);}

// ── 画像エディター
let editorPhotoIndex=0,editorCanvas=null,editorCtx=null,editorImage=null;
let editorNumbers=[],editorMode='normal';
let cropStart=null,cropBox={x:0,y:0,w:0,h:0},cropActive=false,cropDragging=false,cropHandleDrag=null;
let isDraggingNum=false,dragNumIdx=-1,dragOffX=0,dragOffY=0,dragMoved=false;
let currentStickerSize='large';
const DEFAULT_STICKER_SIZE=20;
function getStickerSize(){return currentStickerSize==='large'?20:currentStickerSize==='medium'?15:10;}
function cycleStickerSize(){
  currentStickerSize=currentStickerSize==='large'?'medium':currentStickerSize==='medium'?'small':'large';
  editorNumbers.forEach(n=>n.size=getStickerSize());drawEditor();renderEditorToolbar();
}
function stickerSizeLabel(){return currentStickerSize==='large'?'大':'medium'===currentStickerSize?'中':'小';}
function getStickerPosition(num,canvasW,canvasH){
  const cols=6;const idx=num-1;const row=Math.floor(idx/cols);const colInRow=idx%cols;
  const col=(cols-1)-colInRow;const cellW=canvasW/cols;const totalRows=Math.ceil(24/cols);
  const cellH=canvasH/Math.max(totalRows,4);const margin=DEFAULT_STICKER_SIZE+4;
  return{x:Math.min(canvasW-margin,Math.max(margin,cellW*(col+0.5))),y:Math.min(canvasH-margin,Math.max(margin,cellH*(row+0.5)))};
}
function openImgEditor(idx){
  editorPhotoIndex=idx;editorNumbers=[];editorMode='normal';currentStickerSize='large';
  cropStart=null;cropBox={x:0,y:0,w:0,h:0};cropActive=false;cropDragging=false;cropHandleDrag=null;
  document.getElementById('img-editor-bd').classList.add('open');document.body.style.overflow='hidden';
  const tabBar=document.getElementById('img-tab-bar');
  tabBar.innerHTML=uploadedPhotos.map((_,i)=>'<div class="img-tab'+(i===idx?' on':'')+'" onclick="switchEditorPhoto('+i+')">'+(lang==='en'?'Photo ':'写真')+(i+1)+'</div>').join('');
  loadEditorImage(editedPhotos[idx]||uploadedPhotos[idx]);renderEditorToolbar();
}
function switchEditorPhoto(idx){
  saveCurrentEditorState();editorPhotoIndex=idx;editorNumbers=[];editorMode='normal';
  cropStart=null;cropBox={x:0,y:0,w:0,h:0};cropActive=false;
  document.querySelectorAll('.img-tab').forEach((t2,i)=>t2.classList.toggle('on',i===idx));
  loadEditorImage(editedPhotos[idx]||uploadedPhotos[idx]);renderEditorToolbar();
}
function loadEditorImage(src){
  const canvas=document.getElementById('editor-canvas');const wrap=document.getElementById('canvas-wrap');
  editorCanvas=canvas;editorCtx=canvas.getContext('2d');
  const img=new Image();img.onload=()=>{
    editorImage=img;const maxW=wrap.clientWidth||360;const maxH=wrap.clientHeight||400;
    const scale=Math.min(maxW/img.width,maxH/img.height,1);
    canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);drawEditor();
  };img.src=src;
}
function renderEditorToolbar(){
  const toolbar=document.getElementById('img-editor-toolbar');if(!toolbar)return;
  const hint=document.getElementById('editor-hint');
  if(editorMode==='normal'||editorMode==='crop'){
    toolbar.innerHTML=
      '<button class="editor-tool-btn'+(editorMode==='crop'?' active':'')+'" id="tool-crop" onclick="enterCropMode()"><span class="editor-tool-icon">✂️</span>'+tr('toolCrop')+'</button>'
      +'<button class="editor-tool-btn" onclick="rotateImage()"><span class="editor-tool-icon">🔄</span>'+tr('toolRotate')+'</button>'
      +'<button class="editor-tool-btn" onclick="enterNumberMode()" style="background:var(--ac);color:#fff;border-color:var(--ac);font-weight:700"><span class="editor-tool-icon">➕</span>'+tr('toolAddNum')+'</button>'
      +'<button class="editor-tool-btn" id="tool-more" onclick="showEditorMenu(this)" style="min-width:44px"><span class="editor-tool-icon" style="font-size:22px">⋯</span></button>'
      +'<button class="editor-done-btn" onclick="finishEdit()"><span class="editor-done-icon">✅</span>'+tr('toolDone')+'</button>';
    if(hint)hint.textContent=editorMode==='crop'?tr('hintCrop'):tr('hintNormal');
  }else if(editorMode==='number'){
    const _szL=stickerSizeLabel();
    toolbar.innerHTML=
      '<button class="editor-tool-btn" onclick="exitNumberMode()" style="flex:0 0 auto"><span class="editor-tool-icon">◀</span>'+tr('toolBack')+'</button>'
      +'<button class="editor-tool-btn" onclick="addNumberSticker()" style="background:var(--ac);color:#fff;border-color:var(--ac);font-weight:700"><span class="editor-tool-icon">➕</span>'+tr('toolAddNum')+'</button>'
      +'<button class="editor-tool-btn" onclick="cycleStickerSize()" style="min-width:52px;display:flex;flex-direction:column;align-items:center;gap:1px"><span style="font-family:Noto Sans JP,sans-serif;font-size:11px;font-weight:700;line-height:1">'+_szL+'</span><span style="font-family:Noto Sans JP,sans-serif;font-size:8px;color:var(--td);line-height:1">'+(lang==='en'?'size':'サイズ')+'</span></button>'
      +'<button class="editor-tool-btn" onclick="eraseLastNumber()" style="min-width:44px">消す</button>'
      +'<div style="flex:1;display:flex;align-items:center;justify-content:center;font-family:Noto Sans JP,sans-serif;font-size:9px;color:var(--tm)">'+editorNumbers.length+(lang==='en'?' number'+(editorNumbers.length!==1?'s':''):' 個')+'</div>'
      +'<button class="editor-done-btn" onclick="finishEdit()"><span class="editor-done-icon">✅</span>'+tr('toolDone')+'</button>';
    if(hint)hint.textContent=tr('hintNumberMode');
  }
}
function eraseLastNumber(){if(!editorNumbers.length)return;editorNumbers.pop();editorNumbers.forEach((n,i)=>n.num=i+1);drawEditor();renderEditorToolbar();}
function enterCropMode(){editorMode=editorMode==='crop'?'normal':'crop';cropActive=false;cropStart=null;cropBox={x:0,y:0,w:0,h:0};renderEditorToolbar();drawEditor();}
function enterNumberMode(){editorMode='number';addNumberSticker();renderEditorToolbar();}
function exitNumberMode(){editorMode='normal';renderEditorToolbar();drawEditor();}
function showEditorMenu(btn){
  const existing=document.getElementById('editor-menu');if(existing){existing.remove();return;}
  const menu=document.createElement('div');menu.id='editor-menu';
  menu.style.cssText='position:fixed;background:var(--sf);border:1px solid var(--bd);border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.5);z-index:900;min-width:160px;overflow:hidden';
  const rect=btn.getBoundingClientRect();
  menu.style.bottom=(window.innerHeight-rect.top+4)+'px';menu.style.right=(window.innerWidth-rect.right)+'px';
  menu.innerHTML=
    '<div onclick="resetAllEdits();closeEditorMenu()" style="padding:12px 16px;font-family:Noto Sans JP,sans-serif;font-size:10px;font-weight:600;cursor:pointer;border-bottom:1px solid var(--bd);color:var(--tm)" onmouseover="this.style.background=\'rgba(232,85,45,.1)\'" onmouseout="this.style.background=\'\'">↩️ '+tr('menuReset')+'</div>'
    +'<div onclick="removeAllNumbers();closeEditorMenu()" style="padding:12px 16px;font-family:Noto Sans JP,sans-serif;font-size:10px;font-weight:600;cursor:pointer;color:#e05050" onmouseover="this.style.background=\'rgba(224,80,80,.08)\'" onmouseout="this.style.background=\'\'">🗑 '+tr('menuUndo')+'</div>';
  document.body.appendChild(menu);
  setTimeout(()=>document.addEventListener('click',closeEditorMenuOnce,{once:true}),10);
}
function closeEditorMenu(){const m=document.getElementById('editor-menu');if(m)m.remove();}
function closeEditorMenuOnce(){closeEditorMenu();}
function resetAllEdits(){editorNumbers=[];cropBox={x:0,y:0,w:0,h:0};cropActive=false;cropStart=null;editorMode='normal';loadEditorImage(uploadedPhotos[editorPhotoIndex]);renderEditorToolbar();showToast(lang==='en'?'↩️ Reset':'↩️ リセットしました');}
function removeAllNumbers(){editorNumbers=[];drawEditor();renderEditorToolbar();showToast(lang==='en'?'🗑 Numbers removed':'番号をすべて削除しました');}
function updateToolUI(){}
function drawEditor(){
  if(!editorCtx||!editorImage)return;
  const c=editorCanvas,ctx=editorCtx;ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(editorImage,0,0,c.width,c.height);
  if(editorMode==='crop'&&cropActive){
    ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(0,0,c.width,c.height);ctx.clearRect(cropBox.x,cropBox.y,cropBox.w,cropBox.h);
    ctx.drawImage(editorImage,cropBox.x/c.width*editorImage.naturalWidth,cropBox.y/c.height*editorImage.naturalHeight,cropBox.w/c.width*editorImage.naturalWidth,cropBox.h/c.height*editorImage.naturalHeight,cropBox.x,cropBox.y,cropBox.w,cropBox.h);
    ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.setLineDash([]);ctx.strokeRect(cropBox.x,cropBox.y,cropBox.w,cropBox.h);
    [{x:cropBox.x,y:cropBox.y},{x:cropBox.x+cropBox.w,y:cropBox.y},{x:cropBox.x,y:cropBox.y+cropBox.h},{x:cropBox.x+cropBox.w,y:cropBox.y+cropBox.h}].forEach(h=>{ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(h.x,h.y,8,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#e8552d';ctx.lineWidth=2;ctx.stroke();});ctx.setLineDash([]);
  }
  editorNumbers.forEach(n=>{
    const r=n.size||DEFAULT_STICKER_SIZE;ctx.beginPath();ctx.arc(n.x,n.y,r,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,.95)';ctx.fill();ctx.strokeStyle='#e8552d';ctx.lineWidth=2.5;ctx.stroke();
    ctx.fillStyle='#111';const fs=Math.max(10,Math.round(r*0.65));
    ctx.font='bold '+fs+'px JetBrains Mono,monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n.num,n.x,n.y);
  });
}
function addNumberSticker(){
  if(!editorCanvas)return;const num=editorNumbers.length+1;const pos=getStickerPosition(num,editorCanvas.width,editorCanvas.height);
  editorNumbers.push({x:pos.x,y:pos.y,num,size:getStickerSize()});drawEditor();
  if(editorMode==='number')renderEditorToolbar();
}
function rotateImage(){
  if(!editorImage)return;const canvas=document.createElement('canvas');canvas.width=editorImage.naturalHeight;canvas.height=editorImage.naturalWidth;
  const ctx=canvas.getContext('2d');ctx.translate(canvas.width/2,canvas.height/2);ctx.rotate(Math.PI/2);ctx.drawImage(editorImage,-editorImage.naturalWidth/2,-editorImage.naturalHeight/2);
  const rotated=canvas.toDataURL('image/jpeg',0.92);uploadedPhotos[editorPhotoIndex]=rotated;editedPhotos[editorPhotoIndex]=null;
  editorNumbers=[];cropBox={x:0,y:0,w:0,h:0};cropActive=false;loadEditorImage(rotated);showToast(lang==='en'?'🔄 Rotated 90°':'🔄 90度回転しました');
}
function saveCurrentEditorState(){
  if(!editorCanvas||!editorImage)return;
  const c=editorCanvas;let sx=0,sy=0,sw=editorImage.naturalWidth,sh=editorImage.naturalHeight;
  if(cropActive&&cropBox.w>10&&cropBox.h>10){const scaleX=editorImage.naturalWidth/c.width;const scaleY=editorImage.naturalHeight/c.height;sx=cropBox.x*scaleX;sy=cropBox.y*scaleY;sw=cropBox.w*scaleX;sh=cropBox.h*scaleY;}
  const out=document.createElement('canvas');out.width=Math.round(sw);out.height=Math.round(sh);
  const ctx=out.getContext('2d');ctx.drawImage(editorImage,sx,sy,sw,sh,0,0,out.width,out.height);
  editorNumbers.forEach(n=>{
    const realX=n.x/c.width*editorImage.naturalWidth-sx;const realY=n.y/c.height*editorImage.naturalHeight-sy;
    if(realX<0||realY<0||realX>sw||realY>sh)return;
    const r=Math.round((n.size||DEFAULT_STICKER_SIZE)/c.width*editorImage.naturalWidth);const fs=Math.max(10,Math.round(r*0.65));
    ctx.beginPath();ctx.arc(realX,realY,r,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,.95)';ctx.fill();
    ctx.strokeStyle='#e8552d';ctx.lineWidth=Math.max(2,Math.round(r*0.1));ctx.stroke();
    ctx.fillStyle='#111';ctx.font='bold '+fs+'px JetBrains Mono,monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n.num,realX,realY);
  });
  editedPhotos[editorPhotoIndex]=out.toDataURL('image/jpeg',0.92);
}
function finishEdit(){saveCurrentEditorState();document.getElementById('img-editor-bd').classList.remove('open');document.body.style.overflow='hidden';renderPhotoPreviews();showToast(lang==='en'?'✅ Saved':'✅ 編集を保存しました');}
function getCanvasPos(touch){const rect=editorCanvas.getBoundingClientRect();const scaleX=editorCanvas.width/rect.width;const scaleY=editorCanvas.height/rect.height;return{x:(touch.clientX-rect.left)*scaleX,y:(touch.clientY-rect.top)*scaleY};}
function getCropHandle(pos){
  if(!cropActive)return null;
  const handles=[{id:'tl',x:cropBox.x,y:cropBox.y},{id:'tr',x:cropBox.x+cropBox.w,y:cropBox.y},{id:'bl',x:cropBox.x,y:cropBox.y+cropBox.h},{id:'br',x:cropBox.x+cropBox.w,y:cropBox.y+cropBox.h}];
  return handles.find(h=>Math.hypot(h.x-pos.x,h.y-pos.y)<20)||null;
}
function canvasPointerDown(e){
  e.preventDefault();
  if(e.touches&&e.touches.length===2)return;const touch=e.touches?e.touches[0]:e;const pos=getCanvasPos(touch);dragMoved=false;
  if(editorMode==='number'){
    const hit=editorNumbers.findIndex(n=>Math.hypot(n.x-pos.x,n.y-pos.y)<(n.size||DEFAULT_STICKER_SIZE)+8);
    if(hit>=0){isDraggingNum=true;dragNumIdx=hit;dragOffX=pos.x-editorNumbers[hit].x;dragOffY=pos.y-editorNumbers[hit].y;}else isDraggingNum=false;
  }else if(editorMode==='crop'){
    const handle=getCropHandle(pos);
    if(handle){cropHandleDrag=handle;cropDragging=true;}
    else if(cropActive&&pos.x>=cropBox.x&&pos.x<=cropBox.x+cropBox.w&&pos.y>=cropBox.y&&pos.y<=cropBox.y+cropBox.h){cropHandleDrag={id:'move'};cropDragging=true;dragOffX=pos.x-cropBox.x;dragOffY=pos.y-cropBox.y;}
    else{cropStart=pos;cropDragging=true;cropHandleDrag=null;cropActive=false;}
  }
}
function canvasPointerMove(e){
  e.preventDefault();if(!editorCanvas)return;
  if(e.touches&&e.touches.length===2)return;
  const touch=e.touches?e.touches[0]:e;const pos=getCanvasPos(touch);const c=editorCanvas;
  if(editorMode==='number'&&isDraggingNum&&dragNumIdx>=0){
    editorNumbers[dragNumIdx].x=Math.max(10,Math.min(c.width-10,pos.x-dragOffX));editorNumbers[dragNumIdx].y=Math.max(10,Math.min(c.height-10,pos.y-dragOffY));dragMoved=true;drawEditor();
  }else if(editorMode==='crop'&&cropDragging){
    if(cropHandleDrag){const id=cropHandleDrag.id;
      if(id==='move'){cropBox.x=Math.max(0,Math.min(c.width-cropBox.w,pos.x-dragOffX));cropBox.y=Math.max(0,Math.min(c.height-cropBox.h,pos.y-dragOffY));}
      else{let{x,y,w,h}=cropBox;
        if(id==='tl'){const nx=Math.min(pos.x,x+w-20);const ny=Math.min(pos.y,y+h-20);w=x+w-nx;h=y+h-ny;x=nx;y=ny;}
        else if(id==='tr'){w=Math.max(20,pos.x-x);const ny=Math.min(pos.y,y+h-20);h=y+h-ny;y=ny;}
        else if(id==='bl'){const nx=Math.min(pos.x,x+w-20);w=x+w-nx;x=nx;h=Math.max(20,pos.y-y);}
        else if(id==='br'){w=Math.max(20,pos.x-x);h=Math.max(20,pos.y-y);}
        cropBox={x:Math.max(0,x),y:Math.max(0,y),w:Math.min(c.width-x,w),h:Math.min(c.height-y,h)};
      }
    }else if(cropStart){const x=Math.min(cropStart.x,pos.x);const y=Math.min(cropStart.y,pos.y);cropBox={x:Math.max(0,x),y:Math.max(0,y),w:Math.min(c.width-x,Math.abs(pos.x-cropStart.x)),h:Math.min(c.height-y,Math.abs(pos.y-cropStart.y))};cropActive=true;}
    dragMoved=true;drawEditor();
  }
}
function canvasPointerUp(e){
  e.preventDefault();if(e.touches&&e.touches.length>=2)return;
  if(editorMode==='number'){
    if(isDraggingNum&&!dragMoved&&dragNumIdx>=0){editorNumbers.splice(dragNumIdx,1);editorNumbers.forEach((n,i)=>n.num=i+1);showToast(lang==='en'?'Number removed':'番号を削除しました');drawEditor();renderEditorToolbar();}
    isDraggingNum=false;dragNumIdx=-1;dragMoved=false;
  }else if(editorMode==='crop'){
    cropDragging=false;if(cropBox.w>10&&cropBox.h>10)cropActive=true;else cropActive=false;cropHandleDrag=null;cropStart=null;drawEditor();
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(()=>{
    const c=document.getElementById('editor-canvas');if(!c)return;
    c.addEventListener('mousedown',canvasPointerDown);c.addEventListener('mousemove',canvasPointerMove);c.addEventListener('mouseup',canvasPointerUp);
    c.addEventListener('touchstart',canvasPointerDown,{passive:false});c.addEventListener('touchmove',canvasPointerMove,{passive:false});c.addEventListener('touchend',canvasPointerUp,{passive:false});
  },500);
});

function closeModal(id){document.getElementById(id).classList.remove('open');document.body.style.overflow='';}
function closeOnBd(e,id){if(e.target===document.getElementById(id))closeModal(id);}
function closeAll(){['post-bd','edit-bd'].forEach(closeModal);document.getElementById('done-bd').classList.remove('open');}
function showToast(msg){const t2=document.getElementById('toast');t2.textContent=msg;t2.classList.add('show');setTimeout(()=>t2.classList.remove('show'),2400);}

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

function updateMobFilterClear(){
  const bar=document.getElementById('mob-filter-clear-bar');if(!bar)return;
  const active=currentGenreFilter!=='ALL'||currentSearchQuery;
  bar.style.display=active?'flex':'none';
  const lbl=document.getElementById('mob-filter-clear-lbl');
  if(lbl){let txt=currentSearchQuery?'「'+currentSearchQuery+'」を解除':tr('filterClear');lbl.textContent=txt;}
}

// ── スワイプUI
let currentPanel=1,swipeStartX=0,swipeStartY=0,isHorizSwipe=false,swipeDecided=false;
const SWIPE_THRESHOLD=90,ANGLE_LOCK=0.4;
function goPanel(n){
  currentPanel=Math.max(0,Math.min(2,n));const c=document.getElementById('swipe-container');if(!c)return;
  c.style.transition='transform .3s cubic-bezier(.25,.46,.45,.94)';c.style.transform='translateX('+(-currentPanel*window.innerWidth)+'px)';
  document.querySelectorAll('.swipe-dot').forEach((d,i)=>d.classList.toggle('on',i===currentPanel));
}
function initSwipe(){
  const c=document.getElementById('swipe-container');if(!c)return;
  c.style.transform='translateX('+(-currentPanel*window.innerWidth)+'px)';
  c.addEventListener('touchstart',e=>{swipeStartX=e.touches[0].clientX;swipeStartY=e.touches[0].clientY;isHorizSwipe=false;swipeDecided=false;c.style.transition='none';},{passive:true});
  c.addEventListener('touchmove',e=>{
    const dx=e.touches[0].clientX-swipeStartX;const dy=e.touches[0].clientY-swipeStartY;
    if(!swipeDecided&&(Math.abs(dx)>8||Math.abs(dy)>8)){swipeDecided=true;isHorizSwipe=Math.abs(dx)>Math.abs(dy)*(1/ANGLE_LOCK);}
    if(!isHorizSwipe)return;e.preventDefault&&e.cancelable&&e.preventDefault();
    let offset=-currentPanel*window.innerWidth+dx;
    if((currentPanel===0&&dx>0)||(currentPanel===2&&dx<0))offset=-currentPanel*window.innerWidth+dx*0.25;
    c.style.transform='translateX('+offset+'px)';
  },{passive:false});
  c.addEventListener('touchend',e=>{
    if(!isHorizSwipe){goPanel(currentPanel);return;}const dx=e.changedTouches[0].clientX-swipeStartX;
    if(dx<-SWIPE_THRESHOLD)goPanel(currentPanel+1);else if(dx>SWIPE_THRESHOLD)goPanel(currentPanel-1);else goPanel(currentPanel);
  },{passive:true});
  window.addEventListener('resize',()=>{c.style.transition='none';c.style.transform='translateX('+(-currentPanel*window.innerWidth)+'px)';});
}
function checkMobile(){
  const isMob=window.innerWidth<=680;const swipeUI=document.getElementById('swipe-ui');const pcWrap=document.querySelector('.wrap');
  if(swipeUI)swipeUI.style.display=isMob?'block':'none';if(pcWrap)pcWrap.style.display=isMob?'none':'grid';
}
window.addEventListener('resize',checkMobile);

function filterGenreMob(el,genre){document.querySelectorAll('#swipe-ui .tag').forEach(t2=>t2.classList.remove('on'));el.classList.add('on');currentGenreFilter=genre||'ALL';applyFilter();setTimeout(()=>{goPanel(1);updateMobFilterClear();},180);}

function renderRankingWidgetMob(posts){
  const el=document.getElementById('ranking-widget-mob');if(!el)return;
  const bp=posts.filter(p=>!p.post_type||p.post_type==='board');const monthAgo=Date.now()-30*24*60*60*1000;
  const monthly=bp.filter(p=>new Date(p.created_at).getTime()>monthAgo);const target=monthly.length>=3?monthly:bp;
  const sorted=[...target].sort((a,b)=>(b.likes||0)-(a.likes||0)).slice(0,5);
  if(!sorted.length){el.innerHTML='<div style="font-size:10px;color:var(--td);font-family:Noto Sans JP,sans-serif">'+tr('noPost')+'</div>';return;}
  const anon=lang==='en'?'Anonymous':'匿名';
  el.innerHTML=sorted.map((p,i)=>{const crown=i===0?'<span style="margin-right:4px">👑</span>':'';return '<div class="ri" onclick="location.href=\'/post?id='+p.id+'\'">'+'<div class="rn '+(i<2?'hi':'')+'">'+crown+(i+1)+'</div>'+'<div class="ri-i"><div class="ri-t">'+p.title+'</div><div class="ri-u">'+(p.username||anon)+'</div></div>'+'<div class="ri-s">❤️'+(p.likes||0)+'</div></div>';}).join('');
}
function renderGearWidgetMob(posts){
  const el=document.getElementById('gear-widget-mob');if(!el)return;
  const count={};posts.forEach(p=>{const g=Array.isArray(p.gear_list)?p.gear_list:[];g.forEach(x=>{const n=(x.name||x||'').trim();if(n)count[n]=(count[n]||0)+1;});});
  const sorted=Object.entries(count).sort((a,b)=>b[1]-a[1]).slice(0,5);
  if(!sorted.length){el.innerHTML='<div style="font-size:10px;color:var(--td);font-family:Noto Sans JP,sans-serif">'+tr('noData')+'</div>';return;}
  el.innerHTML=sorted.map(([n,c])=>'<div class="gr">'
    +'<a href="'+soundhouseUrl(n)+'" target="_blank" rel="noopener" style="flex:1;min-width:0;text-decoration:none" onclick="event.stopPropagation();filterByGearName(\''+n.replace(/'/g,"\\'")+'\')">'
    +'<div class="gr-n" style="color:var(--tx)">'+n+'</div><div class="gr-b">'+c+tr('posts')+'</div></a>'
    +'<a href="'+soundhouseUrl(n)+'" target="_blank" rel="noopener" style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;flex-shrink:0;text-decoration:none;background:var(--sf2);border:1px solid var(--bd);border-radius:4px;font-size:13px">🔍</a>'
    +'</div>').join('');
}

document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll();});
document.addEventListener('DOMContentLoaded',()=>{
  checkMobile();
  initSwipe();
  loadPostsFromDB();
  loadBrandsDropdown();
  applyLangUI();
  updateStepUI();
  loadNewsWidget();
  initPCScrollSync();
});

// ── 画像ライトボックス
function openLightbox(src){
  const lb=document.getElementById('lightbox');const img=document.getElementById('lightbox-img');
  if(!lb||!img)return;img.src=src;lb.classList.add('open');document.body.style.overflow='hidden';
}
function closeLightbox(){
  const lb=document.getElementById('lightbox');if(lb)lb.classList.remove('open');document.body.style.overflow='';
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox();});

// ── PC版スクロール連携
function initPCScrollSync(){
  const feed=document.querySelector('.feed');const sr=document.querySelector('.sr');
  if(!feed||!sr)return;
  let syncLock=false;
  window.addEventListener('scroll',()=>{if(window.innerWidth<=680)return;if(syncLock)return;syncLock=true;requestAnimationFrame(()=>{syncLock=false;});},{passive:true});
  feed.addEventListener('scroll',()=>{
    if(window.innerWidth<=680)return;if(syncLock)return;syncLock=true;
    const ratio=feed.scrollTop/(feed.scrollHeight-feed.clientHeight||1);
    sr.scrollTop=ratio*(sr.scrollHeight-sr.clientHeight);requestAnimationFrame(()=>{syncLock=false;});
  },{passive:true});
  sr.addEventListener('scroll',()=>{
    if(window.innerWidth<=680)return;if(syncLock)return;syncLock=true;
    const ratio=sr.scrollTop/(sr.scrollHeight-sr.clientHeight||1);
    feed.scrollTop=ratio*(feed.scrollHeight-feed.clientHeight);requestAnimationFrame(()=>{syncLock=false;});
  },{passive:true});
}

// ── 機材NEWSをSupabaseから取得して表示
async function loadNewsWidget(){
  const{data,error}=await sb.from('news').select('*').order('sort_order').order('created_at').limit(10);
  if(error||!data||!data.length)return;
  const html=data.map(item=>`<a class="news-link" href="${item.url}" target="_blank" rel="noopener"><div class="nth">${item.thumb_url?`<img src="${item.thumb_url}" style="width:100%;height:100%;object-fit:cover;border-radius:3px" onerror="this.parentElement.textContent='${item.emoji||'🔗'}'">`:item.emoji||'🔗'}</div><div><div class="nr-t">${item.title}</div><div class="nr-d">${item.subtitle||''}</div></div></a>`).join('');
  const w1=document.getElementById('news-widget');const w2=document.getElementById('news-widget-mob');
  if(w1)w1.innerHTML=html;if(w2)w2.innerHTML=html;
}
