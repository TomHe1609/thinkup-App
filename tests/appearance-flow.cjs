const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.join(__dirname,'..'),D=require('../data-m01-m09.json'),themes=require('../appearance-palettes.json').themes;
const KEY='skillyr_learn_m01_m05_preview_v1',THEME='skillyr_learn_theme_v1',MODE='skillyr_learn_mode_v1';
const out=path.join(root,'test-results');fs.mkdirSync(out,{recursive:true});
const allowed=new Set(['index.html','appearance.css','learning-support.css','learning-support-data.js','learning-support.js','study-features.js','sw.js','manifest.webmanifest','data-m02.json','data-m01-m05.json','data-m01-m09.json','icon-192.png','icon-512.png']);
const server=http.createServer((req,res)=>{const file=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';if(!allowed.has(file)){res.writeHead(404);res.end();return}const mime=file.endsWith('.css')?'text/css':file.endsWith('.js')?'application/javascript':file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.png')?'image/png':'application/json';res.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-cache'});res.end(fs.readFileSync(path.join(root,file)))});
const initial={activeModule:1,xp:40,done:{'2.8':true},correct:{},wrong:{},attempts:4,practices:{},days:[],reviewCards:{},coachReviews:{},favorites:{'2.9':true},reading:{},lastRead:null,daily:null,examHistory:[]};
const errors=[];let browser,url;
const stored=p=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
async function appearance(p,mode,id){
 if(!await p.locator('#themeDialog[open]').count())await p.locator('[data-theme-open]:visible').first().click();
 await p.locator(`[name="appMode"][value="${mode}"]`).check();
 await p.locator(`[name="appTheme"][value="${id}"]`).check();
 await p.locator('[data-theme-close]').click();
 assert.equal(await p.locator('html').getAttribute('data-theme'),id);assert.equal(await p.locator('html').getAttribute('data-color-mode'),mode);
 assert.equal(await p.evaluate(()=>getComputedStyle(document.documentElement).colorScheme),mode);
 const theme=themes.find(t=>t.id===id);assert.equal(await p.locator('meta[name="theme-color"]').getAttribute('content'),theme[mode].bg);
}
async function readable(p,selector,label){
 const sample=await p.locator(selector).first().evaluate(el=>{
  const parse=s=>{if(s.startsWith('#'))return [parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16),1];const n=s.match(/[\d.]+/g)?.map(Number)||[0,0,0,0];return[n[0],n[1],n[2],n[3]??1]};
  const base=parse(getComputedStyle(document.documentElement).getPropertyValue('--theme-bg').trim());
  const over=(a,b)=>[0,1,2].map(i=>a[i]*a[3]+b[i]*(1-a[3])).concat(1);
  const background=node=>{if(!node)return base;return over(parse(getComputedStyle(node).backgroundColor),background(node.parentElement))};
  const bg=background(el),color=over(parse(getComputedStyle(el).color),bg);
  const lum=c=>{const x=c.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return x[0]*.2126+x[1]*.7152+x[2]*.0722};
  return {fg:color,bg,ratio:(Math.max(lum(color),lum(bg))+.05)/(Math.min(lum(color),lum(bg))+.05)};
 });
 assert(sample.ratio>=4.5,`${label||selector}: contrast ${sample.ratio.toFixed(2)}: ${JSON.stringify(sample)}`);
}
async function width(p){assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal page overflow')}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));url=`http://localhost:${server.address().port}/`;
 browser=await chromium.launch({headless:true,...(process.env.TEST_BROWSER_CHANNEL?{channel:process.env.TEST_BROWSER_CHANNEL}:{})});
 try{
  const c=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce',acceptDownloads:true});c.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
  const p=await c.newPage();await p.goto(url);
  await p.evaluate(({KEY,THEME,MODE,initial})=>{localStorage.setItem(KEY,JSON.stringify(initial));localStorage.setItem(THEME,'petrol');localStorage.removeItem(MODE)},{KEY,THEME,MODE,initial});await p.reload();
  assert.equal(await p.locator('html').getAttribute('data-theme'),'petrol');assert.equal(await p.locator('html').getAttribute('data-color-mode'),'dark');
  const baselineHeader=await p.locator('header').boundingBox();
  for(const mode of ['dark','light'])for(const t of themes){
   await appearance(p,mode,t.id);await width(p);assert.deepEqual(await stored(p),initial);
   assert.deepEqual(await p.locator('header').boundingBox(),baselineHeader);
   await readable(p,'.title',mode+' '+t.id+' title');
   await readable(p,'#studyToday',mode+' '+t.id+' primary action');
   if(mode==='light'||['forest','rose'].includes(t.id)){
    await readable(p,'.learning-note',mode+' '+t.id+' secondary text');
    await readable(p,'.node.current .num',mode+' '+t.id+' current lesson');
    await readable(p,'.mod.active',mode+' '+t.id+' active module');
   }
   if(mode==='light'||['forest','rose'].includes(t.id))await p.screenshot({path:path.join(out,`appearance-${mode}-${t.id}.png`)});
  }
  console.log('PASS: six dark and six light palettes, actual text and action contrast, old preference compatibility and identical header layout.');
  await p.locator('[data-theme-open]:visible').click();assert.equal(await p.locator('[name="appTheme"]').count(),6);assert.equal(await p.locator('[name="appMode"]').count(),2);await p.locator('[data-theme-close]').click();
  await p.reload();assert.equal(await p.locator('html').getAttribute('data-color-mode'),'light');assert.equal(await p.locator('html').getAttribute('data-theme'),'rose');

  await p.locator('.node[data-lesson="1.1"]').click();await readable(p,'.learning-intro');await p.locator('#startLessonQuiz').click();
  const prompt=await p.locator('.quiz-question').innerText(),lesson=D.lessons.find(l=>l.id==='1.1'),q=lesson.questions.find(q=>q.question===prompt);await p.locator(`[data-option="${q.correct_index}"]`).click();
  const before=await stored(p);
  for(const mode of ['dark','light'])for(const t of themes){await appearance(p,mode,t.id);assert.equal(await p.locator('.quiz-question').innerText(),prompt);assert.equal(await p.locator(`[data-option="${q.correct_index}"]`).getAttribute('aria-pressed'),'true');assert.deepEqual(await stored(p),before);if(mode==='light'){await readable(p,'.quiz-question');await readable(p,'.quiz-choice.selected .choice-text');await readable(p,'.quiz-choice.selected .choice-letter');}}
  const other=await c.newPage();await other.goto(url);await appearance(other,'dark','forest');await p.waitForFunction(()=>document.documentElement.dataset.colorMode==='dark'&&document.documentElement.dataset.theme==='forest');assert.equal(await p.locator('.quiz-question').innerText(),prompt);assert.equal(await p.locator('.quiz-choice.selected').count(),1);await appearance(other,'light','blue');await p.waitForFunction(()=>document.documentElement.dataset.colorMode==='light'&&document.documentElement.dataset.theme==='blue');await other.close();
  await p.locator('#confirmAnswer').click();
  for(const t of themes){await appearance(p,'light',t.id);await readable(p,'.quiz-choice.right .choice-text');await readable(p,'.quiz-feedback-title');await readable(p,'.quiz-feedback-explanation');await readable(p,'.quiz-choice.right .choice-letter');}
  await p.locator('#nextQuestion').click();const badPrompt=await p.locator('.quiz-question').innerText(),bad=lesson.questions.find(q=>q.question===badPrompt);await p.locator(`[data-option="${(bad.correct_index+1)%4}"]`).click();await p.locator('#confirmAnswer').click();
  for(const t of themes){await appearance(p,'light',t.id);await readable(p,'.quiz-choice.incorrect .choice-text');await readable(p,'.quiz-feedback-title');await readable(p,'.quiz-feedback-explanation');await readable(p,'.quiz-choice.incorrect .choice-letter');}
  await p.screenshot({path:path.join(out,'appearance-light-rose-feedback.png')});
  console.log('PASS: live palette and mode switches plus cross-tab sync preserve selected quiz answers; positive and negative feedback stay readable.');

  await p.locator('#nextQuestion').click();const draft='Ich plane eine eigene Abrufübung und wiederhole das Ergebnis mit zeitlichem Abstand.';await p.locator('#quizFreeText').fill(draft);const freeBefore=await stored(p);
  for(const t of themes){await appearance(p,'light',t.id);assert.equal(await p.locator('#quizFreeText').inputValue(),draft);await readable(p,'#quizFreeText');await readable(p,'.quiz-editor-header');assert.deepEqual(await stored(p),freeBefore)}
  await p.locator('#submitFree').click();for(const t of themes){await appearance(p,'light',t.id);await readable(p,'.quiz-model-answer p');await readable(p,'.quiz-selfcheck p');await readable(p,'#freeKnown');}
  await p.locator('.quiz-close').click();await p.locator('#nav-cards').click();await p.locator('#flip').click();for(const t of themes){await appearance(p,'light',t.id);await readable(p,'.card-front h2');await readable(p,'[data-study-rate="known"]')}
  await p.locator('#nav-path').click();await p.locator('#studySearch').click();await p.locator('#studyQuery').fill('Cornell');for(const t of themes){await appearance(p,'light',t.id);await readable(p,'#studyQuery');await readable(p,'.study-result p');await width(p)}
  console.log('PASS: free-text drafts and model solutions, cards and recall controls, search and results in all six light palettes.');

  await p.setViewportSize({width:320,height:568});await p.locator('[data-theme-open]:visible').click();await p.locator('[name="appTheme"][value="forest"]').check();await p.screenshot({path:path.join(out,'appearance-picker-light-320.png')});
  assert(await p.locator('#themeDialog').evaluate(el=>el.scrollWidth<=el.clientWidth+1));const close=await p.locator('[data-theme-close]').boundingBox(),dialog=await p.locator('#themeDialog').boundingBox();assert(close.y>=dialog.y&&close.y+close.height<=dialog.y+dialog.height,'picker close must stay reachable');await p.locator('[data-theme-close]').click();
  await p.setViewportSize({width:844,height:390});await p.locator('[data-theme-open]:visible').click();await p.locator('[name="appMode"][value="dark"]').check();await p.locator('[name="appTheme"][value="rose"]').check();assert(await p.locator('#themeDialog').evaluate(el=>el.scrollWidth<=el.clientWidth+1));await p.locator('[data-theme-close]').click();
  await p.setViewportSize({width:390,height:844});await appearance(p,'light','forest');await p.locator('#nav-stats').click();await readable(p,'.stat strong');
  await p.locator('.data-settings>summary').click();const download=p.waitForEvent('download');await p.locator('#exportProgress').click();const backup=path.join(out,'appearance-progress.json');await(await download).saveAs(backup);const backupData=JSON.parse(fs.readFileSync(backup,'utf8'));assert.equal(backupData.progress.colorMode,undefined);
  await p.locator('.reset-settings>summary').click();p.once('dialog',d=>d.accept());await p.locator('#resetProgress').click();assert.equal(await p.locator('html').getAttribute('data-color-mode'),'light');assert.equal(await p.evaluate(k=>localStorage.getItem(k),MODE),'light');await p.locator('.data-settings>summary').click();p.once('dialog',d=>d.accept());await p.locator('#importProgress').setInputFiles(backup);await p.waitForFunction(({KEY,xp})=>JSON.parse(localStorage.getItem(KEY)).xp===xp,{KEY,xp:backupData.progress.xp});assert.equal(await p.locator('html').getAttribute('data-theme'),'forest');assert.equal(await p.locator('html').getAttribute('data-color-mode'),'light');
  await p.evaluate(async()=>await navigator.serviceWorker.ready);await p.reload();await p.waitForFunction(()=>!!navigator.serviceWorker.controller);await c.setOffline(true);await p.reload();assert.equal(await p.locator('html').getAttribute('data-theme'),'forest');assert.equal(await p.locator('html').getAttribute('data-color-mode'),'light');await readable(p,'.title');await appearance(p,'light','apricot');await readable(p,'#studyToday');await c.setOffline(false);
  assert.deepEqual(errors,[]);await c.close();
  console.log('PASS: small portrait and landscape picker, separate preference persistence across reset/import, offline reload and colour changes; no browser errors.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e);process.exitCode=1;server.close()});
