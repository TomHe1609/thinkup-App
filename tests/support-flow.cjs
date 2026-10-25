const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.join(__dirname,'..'),D=require('../data-m01-m09.json'),aids=require('../learning-support-data.js'),themes=require('../appearance-palettes.json').themes;
const KEY='skillyr_learn_m01_m05_preview_v1',out=path.join(root,'test-results');fs.mkdirSync(out,{recursive:true});
const files=new Set(['index.html','appearance.css','learning-support.css','learning-support-data.js','learning-support.js','study-features.js','sw.js','manifest.webmanifest','data-m02.json','data-m01-m05.json','data-m01-m09.json','icon-192.png','icon-512.png']);
const previous=Object.fromEntries([...files].filter(name=>!name.startsWith('learning-support')).map(name=>[name,execFileSync('git',['show',`b744aba:${name}`],{cwd:root,maxBuffer:5000000})]));
let oldVersion=false;
const server=http.createServer((req,res)=>{const name=new URL(req.url,'http://localhost').pathname.replace(/^\/thinkup-App\//,'')||'index.html';if(!files.has(name)){res.writeHead(404);res.end();return}
 const mime={'.css':'text/css','.js':'application/javascript','.html':'text/html; charset=utf-8','.png':'image/png','.webmanifest':'application/manifest+json','.json':'application/json'};
 res.writeHead(200,{'Content-Type':mime[path.extname(name)],'Cache-Control':'no-cache'});res.end(oldVersion?(previous[name]||''):fs.readFileSync(path.join(root,name)));
});
const state=()=>({activeModule:2,xp:120,done:Object.fromEntries(D.lessons.map(l=>[l.id,true])),correct:{},wrong:{'SKY-054':true},attempts:12,practices:{},days:[],reviewCards:{},coachReviews:{},favorites:{},reading:{},lastRead:null,daily:null,examHistory:[]});
const saved=p=>p.evaluate(KEY=>JSON.parse(localStorage.getItem(KEY)),KEY);
const core=s=>Object.fromEntries(['xp','done','correct','wrong','attempts','practices','reviewCards','favorites','daily','days','coachReviews'].map(k=>[k,s[k]]));
let browser,url;const errors=[];
async function seed(c){const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(url);await p.evaluate(({KEY,value})=>{localStorage.setItem(KEY,JSON.stringify(value));localStorage.setItem('skillyr_learn_theme_v1','petrol')},{KEY,value:state()});await p.reload();return p}
async function appearance(p,mode,id){await p.locator('[data-theme-open]:visible').first().click();await p.locator(`[name="appMode"][value="${mode}"]`).check();await p.locator(`[name="appTheme"][value="${id}"]`).check();await p.locator('[data-theme-close]').click()}
async function readable(p,selector){const {fg,bg}=await p.locator(selector).first().evaluate(el=>{const values=s=>s.match(/[\d.]+/g)?.map(Number);let bg;for(let node=el;node;node=node.parentElement){const v=values(getComputedStyle(node).backgroundColor);if(v&&v.length===3||v?.[3]===1){bg=v.slice(0,3);break}}return{fg:values(getComputedStyle(el).color).slice(0,3),bg:bg||[20,20,20]}});const lum=rgb=>rgb.map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);const contrast=(Math.max(lum(fg),lum(bg))+.05)/(Math.min(lum(fg),lum(bg))+.05);assert(contrast>=4.5,selector+' contrast '+contrast)}
async function nestedTerm(p){await p.locator('#readLesson').click();await p.locator('#learningDialog[open]').waitFor();const term=p.locator('#learningReferenceContent .learning-tutorial [aria-label="Fremdschlüssel erklären"]').first();await term.click();assert.equal(await p.locator('#supportTermDialog[open]').count(),1);assert.match(await p.locator('#supportTermDefinition').innerText(),/eindeutigen Schlüssel/);return term}
async function answerMC(p){const prompt=await p.locator('.quiz-question').innerText(),q=D.lessons.flatMap(l=>l.questions).find(q=>q.question===prompt);assert(q);await p.locator(`[data-option="${q.correct_index}"]`).click();await p.locator('#confirmAnswer').click();await p.locator('#nextQuestion').click()}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));url=`http://localhost:${server.address().port}/thinkup-App/`;
 browser=await chromium.launch({headless:true,...(process.env.TEST_BROWSER_CHANNEL?{channel:process.env.TEST_BROWSER_CHANNEL}:{})});
 try{
  const c=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),p=await seed(c);
  await p.locator('.node[data-lesson="2.9"]').click();
  assert(await p.locator('.learning-tutorial [data-support-term]').count()>10);
  assert.equal(await p.locator('.learning-terms dt button').count(),6);
  const textUnchanged=await p.evaluate(()=>{const template=document.createElement('template');template.innerHTML=learningTextHTML(DATA.lessons.find(l=>l.id==='2.9'));return template.content.querySelector('.learning-text').textContent===document.querySelector('#content .learning-text').textContent});assert(textUnchanged);
  const inline=p.locator('#content .learning-tutorial [aria-label="Fremdschlüssel erklären"]').first();await inline.scrollIntoViewIfNeeded();const y=await p.evaluate(()=>scrollY),before=core(await saved(p));await inline.click();
  assert.match(await p.locator('#supportTermDefinition').innerText(),/Verweist/);assert.match(await p.locator('#supportTermExample').innerText(),/kunde_id/);
  await p.keyboard.press('Escape');assert.equal(await inline.evaluate(el=>el===document.activeElement),true);assert(Math.abs(await p.evaluate(()=>scrollY)-y)<=2);assert.deepEqual(core(await saved(p)),before);
  console.log('PASS: inline glossary preserves the entire lesson text, local definitions, worked examples, scroll position, keyboard focus and core progress.');
  await p.locator('#startLessonQuiz').click();
  const questionId=await p.locator('[data-support-hints]').getAttribute('data-support-hints');assert.equal(questionId,'SKY-054');
  const q=D.lessons.flatMap(l=>l.questions).find(q=>q.id===questionId);await p.locator(`[data-option="${q.correct_index}"]`).click();const beforeHints=core(await saved(p));
  assert.equal(await p.locator('.support-hint-copy p').count(),0);await p.locator('[data-support-hint]').click();assert.equal(await p.locator('.support-hint-copy p').count(),1);assert.equal(await p.locator('.support-hint-copy p').innerText(),aids.hints[q.id][0]);
  await p.locator('[data-support-hint]').click();assert.equal(await p.locator('.support-hint-copy p').count(),2);assert.equal(await p.locator('.support-hint-copy p').nth(1).innerText(),aids.hints[q.id][1]);assert.equal(await p.locator('[data-support-hint]').count(),0);assert.equal(await p.locator('.quiz-choice.selected').count(),1);assert.deepEqual(core(await saved(p)),beforeHints);
  await p.locator(`[data-option="${(q.correct_index+1)%4}"]`).click();assert.equal(await p.locator('.support-hint-copy p').count(),2);await p.locator(`[data-option="${q.correct_index}"]`).click();assert.deepEqual(core(await saved(p)),beforeHints);
  for(const mode of ['dark','light'])for(const theme of themes){
   await appearance(p,mode,theme.id);await readable(p,'.support-hints h2');await readable(p,'.support-hint-copy p');
   const nested=await nestedTerm(p);await readable(p,'#supportTermDefinition');await readable(p,'#supportTermExample p');
   assert(await p.locator('#supportTermDialog').evaluate(el=>el.scrollWidth<=el.clientWidth+1));
   if(mode==='light'&&theme.id==='forest')await p.screenshot({path:path.join(out,'support-terms-light.png')});
   await p.keyboard.press('Escape');assert.equal(await p.locator('#learningDialog[open]').count(),1);assert.equal(await nested.evaluate(el=>el===document.activeElement),true);await p.keyboard.press('Escape');
   assert.equal(await p.locator('.quiz-choice.selected').count(),1);assert.equal(await p.locator('.support-hint-copy p').count(),2);
  }
  await appearance(p,'dark','petrol');await p.screenshot({path:path.join(out,'support-hints-dark.png')});
  await p.locator('#confirmAnswer').click();assert.equal(await p.locator('.support-hints').count(),0);assert.equal((await saved(p)).xp,beforeHints.xp+10);await p.locator('#nextQuestion').click();assert.equal(await p.locator('.support-hint-copy p').count(),0);
  await answerMC(p);assert.equal(await p.locator('#quizFreeText').count(),1);const draft='Ich trenne die Information über den Artikel von den Angaben zur konkreten Lieferung.';await p.locator('#quizFreeText').fill(draft);const freeBefore=core(await saved(p));await p.locator('[data-support-hint]').click();await p.locator('[data-support-hint]').click();assert.equal(await p.locator('#quizFreeText').inputValue(),draft);await nestedTerm(p);await p.keyboard.press('Escape');await p.keyboard.press('Escape');assert.equal(await p.locator('#quizFreeText').inputValue(),draft);assert.deepEqual(core(await saved(p)),freeBefore);
  await p.locator('#submitFree').click();assert.equal(await p.locator('.support-hints').count(),0);await p.locator('#freeKnown').click();assert.equal((await saved(p)).xp,freeBefore.xp+10);
  console.log('PASS: M02/2.9 stages reveal separately, survive read-back and all twelve palettes, preserve choice/draft/progress and award the original XP only after assessment.');
  await p.locator('.quiz-close').click();await p.locator('.back[data-page="path"]').click();await p.locator('#studyExamSetup').click();await p.locator('#studyExamStart').click();assert.equal(await p.locator('#content .support-hints').count(),0);assert.equal(await p.locator('#content [data-support-term]').count(),0);assert.equal(await p.locator('#learningDialog[open]').count(),0);await c.close();
  console.log('PASS: practice-exam questions expose neither hints nor glossary answers.');
  const dailyContext=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),daily=await seed(dailyContext);await daily.locator('#studyToday').click();
  for(let i=0;i<10&&!await daily.locator('#studyDailyConfirm').count();i++){await daily.locator('#studyDailyFlip').click();await daily.locator('[data-study-mode="daily"][data-study-rate="known"]').click()}
  assert.equal(await daily.locator('#studyDailyConfirm').count(),1);const dailyBefore=core(await saved(daily));await daily.locator('[data-support-hint]').click();await daily.locator('[data-support-hint]').click();assert.equal(await daily.locator('.support-hint-copy p').count(),2);assert.deepEqual(core(await saved(daily)),dailyBefore);await dailyContext.close();
  console.log('PASS: daily-round question hints reveal independently without advancing the daily round or changing XP.');
  oldVersion=true;const upgrade=await browser.newContext({viewport:{width:320,height:740},reducedMotion:'reduce'}),old=await seed(upgrade);
  await old.evaluate(async()=>{await navigator.serviceWorker.ready;await caches.open('unrelated-learning-app-cache')});await old.reload();await old.waitForFunction(()=>!!navigator.serviceWorker.controller);const previousProgress=core(await saved(old));
  oldVersion=false;await old.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update()});await old.waitForFunction(async()=>(await caches.keys()).includes('skillyr-m02-test::thinkup-learning-support-v19'));
  await old.reload();assert.deepEqual(core(await saved(old)),previousProgress);assert(await old.evaluate(async()=>(await caches.keys()).includes('unrelated-learning-app-cache')));await upgrade.setOffline(true);await old.reload();
  await old.locator('.node[data-lesson="2.9"]').click();await old.locator('.learning-tutorial [aria-label="Fremdschlüssel erklären"]').first().click();assert.equal(await old.locator('#supportTermDialog[open]').count(),1);await old.keyboard.press('Escape');await old.locator('#startLessonQuiz').click();await old.locator('[data-support-hint]').click();await old.locator('[data-support-hint]').click();assert.equal(await old.locator('.support-hint-copy p').count(),2);assert(await old.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await old.screenshot({path:path.join(out,'support-offline-320.png')});await upgrade.close();
  assert.deepEqual(errors,[]);console.log('PASS: v18 upgrades to v19 without progress loss, new glossary and both hint stages work offline at 320px, unrelated caches remain, no browser errors.');
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{console.error(error);process.exitCode=1;server.close()});
