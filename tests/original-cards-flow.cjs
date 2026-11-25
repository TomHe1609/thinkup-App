const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.join(__dirname,'..'),D=require('../data-m01-m09.json');
const KEY='skillyr_learn_m01_m05_preview_v1',BACKUP=KEY+'::before-official-cards-2026-11-25';
const out=path.resolve(process.env.TEST_OUTPUT_DIR||path.join(root,'test-results'));fs.mkdirSync(out,{recursive:true});
const base='780956e992f9aa908ae11460b5bae5143f178bbe',oldData=JSON.parse(execFileSync('git',['show',base+':data-m01-m09.json'],{cwd:root,maxBuffer:10000000}));
const files=['index.html','style.css','appearance.css','ui-glass.css','learning-support.css','glossary-examples.js','learning-support-data.js','learning-support.js','study-features.js','flashcard-content.js','flashcard-content.css','sw.js','manifest.webmanifest','data-m01-m09.json','data-m01-m05.json','data-m02.json','icon-192.png','icon-512.png'];
const previous=Object.fromEntries(files.filter(f=>f!=='style.css'&&!f.startsWith('flashcard-content.')).map(f=>[f,execFileSync('git',['show',base+':'+f],{cwd:root,maxBuffer:10000000})]));
let oldVersion=false,browser;
const server=http.createServer((req,res)=>{
 const name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';
 if(!files.includes(name)||oldVersion&&!previous[name]){res.writeHead(404);res.end();return;}
 const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png'};
 res.writeHead(200,{'Content-Type':mime[path.extname(name)],'Cache-Control':'no-cache'});res.end(oldVersion?previous[name]:fs.readFileSync(path.join(root,name)));
});
const state={activeModule:1,xp:870,done:{'1.1':true},correct:{},wrong:{},attempts:87,practices:{},days:[],reviewCards:{[D.courseCards[0].id]:{rating:'known',last:1795500000000,due:1795759200000,streak:1},[oldData.cards[0].id]:{rating:'again',last:1795500000000,due:1795500600000,streak:0}},coachReviews:{},favorites:{[D.courseCards[0].id]:true,[oldData.cards[0].id]:true,'1.1':true},reading:{},lastRead:null,daily:null,examHistory:[]};
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const url='http://localhost:'+server.address().port+'/';
 browser=await chromium.launch({headless:true,...(process.env.TEST_BROWSER_CHANNEL?{channel:process.env.TEST_BROWSER_CHANNEL}:{})});
 try{
  const c=await browser.newContext({viewport:{width:320,height:740},reducedMotion:'reduce'}),p=await c.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await c.addInitScript(({KEY,BACKUP,state})=>{if(!localStorage.getItem('__seeded')){localStorage.setItem(KEY,JSON.stringify(state));localStorage.removeItem(BACKUP);localStorage.setItem('__seeded','yes');}},{KEY,BACKUP,state});
  await p.goto(url);await p.locator('#nav-cards').click();await p.locator('#cardModule').selectOption('all');
  assert.match(await p.locator('#cardModule').innerText(),/Alle Module · 521 Karten/);
  const full=await p.evaluate(()=>{
   const errors=[];current.cardModule='all';
   for(let i=0;i<CARD_CATALOG.length;i++){
    current.flashIndex=i;const c=CARD_CATALOG[i];
    for(const revealed of [false,true]){
     current.flashRevealed=revealed;const shell=document.createElement('div');shell.innerHTML=cardsHTML();
     const actual=shell.querySelector('.flashcard-content').innerHTML;
     const expected=new DOMParser().parseFromString(revealed?c.backHtml:c.frontHtml,'text/html').body.innerHTML;
     if(actual!==expected)errors.push({id:c.id,revealed});
    }
   }
   return {errors,faces:CARD_CATALOG.length*2};
  });assert.equal(full.faces,1042);assert.deepEqual(full.errors,[]);
  console.log('PASS: all 1,042 original card faces render as the exact canonical HTML of their paired source fields.');
  const backed=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),BACKUP);assert.equal(backed.raw,JSON.stringify(state));
  let live=await p.evaluate(()=>progress);assert.equal(live.xp,state.xp);assert.deepEqual(live.done,state.done);assert.deepEqual(live.reviewCards[D.courseCards[0].id],state.reviewCards[D.courseCards[0].id]);assert(live.favorites[D.courseCards[0].id]);assert.equal(live.reviewCards[oldData.cards[0].id],undefined);
  await p.reload();assert.deepEqual(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),BACKUP),backed);
  await p.locator('#nav-cards').click();await p.locator('#cardModule').selectOption('all');
  const focus=async(i)=>{await p.evaluate(i=>{current.cardModule='all';current.flashIndex=i;current.flashRevealed=false;render();},i);await p.locator('#flip').click();assert.equal(await p.locator('#flip').getAttribute('aria-pressed'),'true');assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));};
  const table=D.courseCards.findIndex(c=>c.backHtml.includes('<table>')),code=D.courseCards.findIndex(c=>c.backHtml.includes('<pre>'));
  await focus(table);assert.equal(await p.locator('#flip table').count(),1);await p.screenshot({path:path.join(out,'original-table-320.png'),fullPage:true});
  await focus(code);assert.equal(await p.locator('#flip pre').count(),1);await p.screenshot({path:path.join(out,'original-code-320.png'),fullPage:true});
  for(const i of [170,171,349,389]){await focus(i);assert.equal(await p.locator('#flip .flashcard-content').innerHTML(),await p.evaluate(i=>new DOMParser().parseFromString(DATA.courseCards[i].backHtml,'text/html').body.innerHTML,i));}
  for(const mode of ['dark','light'])for(const theme of ['violet','petrol','blue','apricot','forest','rose']){await p.evaluate(({mode,theme})=>{applyDisplayMode(mode);applyColorTheme(theme);},{mode,theme});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
  const clean=await p.evaluate(()=>FlashcardContent.html({frontHtml:'<p onclick="alert(1)">safe</p><script>bad()</script><img onerror="bad()"><code>&lt;T&gt;</code>'},false));assert.equal(clean,'<p>safe</p><code>&lt;T&gt;</code>');
  await p.evaluate(()=>{current.page='daily';progress.daily={contentRevision:DATA.contentRevision,day:'2026-11-25',plan:[{kind:'card',id:DATA.courseCards.find(c=>c.backHtml.includes('<table>')).id}],index:0,results:{}};render();});await p.locator('#studyDailyFlip').click();assert.equal(await p.locator('.study-card-text table').count(),1);
  assert.deepEqual(errors,[]);await c.close();
  console.log('PASS: 320px tables/code, literal special cases, all twelve palettes, daily-card HTML, exact browser backup and retained progress.');
  const blocked=await browser.newContext(),b=await blocked.newPage();
  await blocked.addInitScript(({KEY,BACKUP,state})=>{const original=Storage.prototype.setItem;original.call(localStorage,KEY,JSON.stringify(state));localStorage.removeItem(BACKUP);Storage.prototype.setItem=function(key,value){if(key===BACKUP)throw new DOMException('Full','QuotaExceededError');return original.call(this,key,value);};},{KEY,BACKUP,state});
  await b.goto(url);await b.locator('#nav-cards').click();await b.locator('#flip').click();await b.locator('[data-study-rate="known"][data-study-mode="cards"]').click();assert.equal(await b.evaluate(k=>localStorage.getItem(k),KEY),JSON.stringify(state));await blocked.close();
  console.log('PASS: failed backup cannot overwrite the old browser progress.');
  oldVersion=true;const upgrade=await browser.newContext({viewport:{width:320,height:740}}),u=await upgrade.newPage();
  await u.goto(url);await u.evaluate(({KEY,state})=>localStorage.setItem(KEY,JSON.stringify(state)),{KEY,state});await u.reload();await u.evaluate(()=>navigator.serviceWorker.ready);await u.waitForFunction(()=>!!navigator.serviceWorker.controller);
  const before=await u.evaluate(k=>localStorage.getItem(k),KEY);await u.evaluate(()=>caches.open('unrelated-card-test-cache'));
  oldVersion=false;await u.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update();});
  await u.waitForFunction(async()=>{const keys=await caches.keys();return keys.includes('skillyr-m02-test::thinkup-styles-v25')&&!keys.includes('skillyr-m02-test::thinkup-applied-quizzes-v23-glass-v2');});
  await u.reload();assert.equal(await u.evaluate(()=>CARD_CATALOG.length),521);assert.equal((await u.evaluate(k=>JSON.parse(localStorage.getItem(k)),BACKUP)).raw,before);assert.equal(await u.evaluate(()=>progress.xp),state.xp);
  await upgrade.setOffline(true);await u.reload();await u.locator('#nav-cards').click();await u.locator('#flip').click();assert.equal(await u.locator('#flip ol li').count(),4);assert(await u.evaluate(async()=>(await caches.keys()).includes('unrelated-card-test-cache')));await upgrade.close();
  console.log('PASS: v23 installation upgrades to v25, snapshots old progress and works completely offline; unrelated caches survive.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
