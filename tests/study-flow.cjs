const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.join(__dirname,'..'),D=require('../data-m01-m09.json'),KEY='skillyr_learn_m01_m05_preview_v1';
const out=path.join(root,'test-results');fs.mkdirSync(out,{recursive:true});
const files=new Set(['index.html','appearance.css','glossary-examples.js','learning-support.css','learning-support-data.js','learning-support.js','study-features.js','sw.js','manifest.webmanifest','data-m02.json','data-m01-m05.json','data-m01-m09.json','icon-192.png','icon-512.png']);
const server=http.createServer((req,res)=>{const file=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';if(!files.has(file)){res.writeHead(404);res.end();return}res.writeHead(200,{'Content-Type':file.endsWith('.css')?'text/css':file.endsWith('.js')?'application/javascript':file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.png')?'image/png':'application/json','Cache-Control':'no-cache'});res.end(fs.readFileSync(path.join(root,file)))});
const blank=()=>({activeModule:1,xp:0,done:{},correct:{},wrong:{},attempts:0,practices:{},days:[],reviewCards:{},coachReviews:{},favorites:{},reading:{},lastRead:null,daily:null,examHistory:[]});
const allQ=D.lessons.flatMap(l=>l.questions),questions=new Map(allQ.map(q=>[q.question,q]));
const errors=[];let browser,url;
async function context(width=390){const c=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce',acceptDownloads:true});c.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));return c}
async function seed(c,state){const p=await c.newPage();await p.goto(url);await p.evaluate(({KEY,state})=>{localStorage.setItem(KEY,JSON.stringify(state));localStorage.setItem('skillyr_learn_theme_v1','petrol')},{KEY,state});await p.reload();return p}
const saved=p=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
async function checkWidth(p){assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow')}
async function cards(p){await p.locator('#nav-cards').click();return p.locator('[data-study-favorite]').getAttribute('data-study-favorite')}
async function chooseExam(p,correct=true){const text=await p.locator('.quiz-question').innerText(),q=questions.get(text);assert.ok(q);await p.locator(`[data-study-exam-choice="${correct?q.correct_index:(q.correct_index+1)%4}"]`).click();return q}
async function help(p){
 const before=await saved(p);await p.locator('[data-study-help]').click();await p.locator('#learningDialog[open]').waitFor();
 assert(await p.locator('#learningDialog').evaluate(d=>d.scrollTop>0));
 await p.locator('#studyMiniDraft').fill('Ich übertrage die Regel auf einen eigenen Fall und begründe die Zuordnung.');
 await p.locator('#studyMiniReveal').click();assert((await p.locator('#studyMiniAnswer').innerText()).length>30);
 await p.keyboard.press('Escape');assert.deepEqual(await saved(p),before,'mini exercise does not change original score');
}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));url=`http://localhost:${server.address().port}/`;
 browser=await chromium.launch({headless:true,...(process.env.TEST_BROWSER_CHANNEL?{channel:process.env.TEST_BROWSER_CHANNEL}:{})});
 try{
  const c=await context(320),initial={...blank(),xp:100,attempts:12,done:{'2.8':true},practices:{'2.8':{text:'Vorhandene Antwort',known:true,mode:'self'}}};
  const p=await seed(c,initial);await checkWidth(p);await p.screenshot({path:path.join(out,'study-home-320.png'),fullPage:true});
  const first=await cards(p);await p.locator(`[data-study-favorite="${first}"]`).click();await p.locator('#flip').click();
  let before=Date.now();await p.locator('[data-study-mode="cards"][data-study-rate="known"]').click();let state=await saved(p);
  assert(Math.abs(state.reviewCards[first].due-before-3*86400000)<5000);assert.equal(state.favorites[first],true);assert.equal(state.xp,100);
  await p.reload();await cards(p);assert.equal(await p.locator(`[data-study-favorite="${first}"]`).getAttribute('aria-pressed'),'true');await p.locator('#flip').click();
  before=Date.now();await p.locator('[data-study-mode="cards"][data-study-rate="again"]').click();state=await saved(p);assert(Math.abs(state.reviewCards[first].due-before-600000)<5000);
  const second=await p.locator('[data-study-favorite]').getAttribute('data-study-favorite');await p.locator('#flip').click();before=Date.now();await p.locator('[data-study-mode="cards"][data-study-rate="unsure"]').click();state=await saved(p);assert(Math.abs(state.reviewCards[second].due-before-86400000)<5000);
  console.log('PASS: all three recall ratings, real due dates, favorite and reload persistence without changing XP.');

  await p.locator('#nav-path').click();await p.locator('#studySearch').click();await p.locator('#studyQuery').fill('Normalisierung');
  assert.equal(await p.locator('#studyQuery').inputValue(),'Normalisierung');await p.locator('#studySearchModule').selectOption('2');await p.locator('#studySearchKind').selectOption('lesson');
  await p.locator('[data-study-favorite="2.9"]').click();await p.locator('#studyOnlyFavorites').check();assert.equal(await p.locator('[data-study-lesson="2.9"]').count(),1);
  await checkWidth(p);await p.screenshot({path:path.join(out,'study-search-320.png')});
  await p.locator('[data-study-lesson="2.9"]').click();assert.equal(await p.locator('[data-study-favorite="2.9"]').getAttribute('aria-pressed'),'true');
  await p.locator('.tutorial-chapter').nth(4).scrollIntoViewIfNeeded();await p.waitForFunction(k=>JSON.parse(localStorage.getItem(k)).reading['2.9']?.y>1000,KEY);
  await p.locator('#nav-path').click();const position=(await saved(p)).reading['2.9'].y;
  await p.locator('[data-study-lesson="2.9"]').click();await p.waitForFunction(y=>Math.abs(scrollY-y)<10,position);
  await p.reload();await p.locator('[data-study-lesson="2.9"]').click();await p.waitForFunction(y=>Math.abs(scrollY-y)<10,position);
  state=await saved(p);assert.equal(state.xp,100);assert.deepEqual(state.done,initial.done);
  await p.locator('#nav-stats').click();await p.locator('.data-settings>summary').click();const download=p.waitForEvent('download');await p.locator('#exportProgress').click();const backup=path.join(out,'study-progress.json');await(await download).saveAs(backup);const exported=JSON.parse(fs.readFileSync(backup,'utf8'));assert.equal(exported.schemaVersion,4);assert.equal(exported.progress.favorites['2.9'],true);assert.ok(exported.progress.reviewCards[first]);assert.ok(exported.progress.reading['2.9']);
  await p.locator('.reset-settings>summary').click();p.once('dialog',d=>d.accept());await p.locator('#resetProgress').click();assert.deepEqual((await saved(p)).favorites,{});
  await p.locator('.data-settings>summary').click();p.once('dialog',d=>d.accept());await p.locator('#importProgress').setInputFiles(backup);await p.waitForFunction(k=>JSON.parse(localStorage.getItem(k)).favorites['2.9']===true,KEY);
  state=await saved(p);for(const key of ['reviewCards','favorites','reading','lastRead','xp','done','practices'])assert.deepEqual(state[key],exported.progress[key]);
  await c.close();console.log('PASS: search and filters, lesson favorites, exact reading-position resume after reload, full new-state export/import.');

  const oldContext=await context(),old=await seed(oldContext,blank());await old.locator('#nav-stats').click();await old.locator('.data-settings>summary').click();const oldFile=path.join(out,'old-schema3.json');fs.writeFileSync(oldFile,JSON.stringify({app:'skillyr-learn-m01-m09',schemaVersion:3,progress:{activeModule:2,xp:77,attempts:7,done:{'2.8':true},practices:{'2.8':{text:'Alter Lernstand'}}}}));old.once('dialog',d=>d.accept());await old.locator('#importProgress').setInputFiles(oldFile);await old.waitForFunction(k=>JSON.parse(localStorage.getItem(k)).xp===77,KEY);assert.equal((await saved(old)).done['2.8'],true);assert.deepEqual((await saved(old)).reviewCards,{});await oldContext.close();
  console.log('PASS: schema 3 backups still import with original progress intact.');

  const dailyContext=await context(),d=await seed(dailyContext,{...blank(),wrong:{[D.lessons[0].questions[0].id]:true},reviewCards:{[first]:{rating:'again',last:Date.now()-1000000,due:Date.now()-400000,streak:0}}});
  await d.locator('#studyToday').click();assert.equal(await d.locator('#studyDailyLearned').count(),1);await d.locator('[data-study-lesson="1.1"]').click();await d.locator('#studyBackDaily').click();await d.locator('#studyDailyLearned').click();
  const index=(await saved(d)).daily.index;await d.reload();await d.locator('#studyToday').click();assert.equal((await saved(d)).daily.index,index);
  let intentionallyWrong=false;
  for(let n=0;n<15;n++){
   const daily=(await saved(d)).daily;if(daily.index===daily.plan.length)break;
   const item=daily.plan[daily.index];
   if(item.kind==='learn'){await d.locator('#studyDailyLearned').click();continue}
   if(item.kind==='card'){await d.locator('#studyDailyFlip').click();await d.locator(`[data-study-mode="daily"][data-study-rate="${item.id===first?'again':'known'}"]`).click();continue}
   const q=allQ.find(q=>q.id===item.id);const choice=intentionallyWrong?q.correct_index:(q.correct_index+1)%4;await d.locator(`[data-study-daily-choice="${choice}"]`).click();await d.locator('#studyDailyConfirm').click();
   if(!intentionallyWrong){await help(d);intentionallyWrong=true;}
   await d.locator('#studyDailyNext').click();
  }
  const dailyState=await saved(d);assert.equal(dailyState.daily.index,dailyState.daily.plan.length);assert.equal(Object.keys(dailyState.daily.results).length,dailyState.daily.plan.length);assert.deepEqual(dailyState.done,{});assert.ok(dailyState.reviewCards[first].due>Date.now());
  const xp=dailyState.xp;await d.locator('[data-page="path"]').first().click();await d.locator('#studyToday').click();assert.match(await d.locator('.review-summary').innerText(),/Für heute geschafft/);assert.equal((await saved(d)).xp,xp);
  await d.clock.install();await d.clock.fastForward(660000);await d.locator('[data-page="path"]').first().click();await d.locator('#studyToday').click();
  assert((await saved(d)).daily.plan.some(p=>p.kind==='card'&&p.id===first),'again card must return after ten minutes on the same day');
  await d.locator('#studyDailyFlip').click();await d.locator('[data-study-mode="daily"][data-study-rate="known"]').click();assert.equal((await saved(d)).xp,xp);
  await dailyContext.close();console.log('PASS: daily mix, due card, new explanation, error help, resume, completion and same-day recall after ten minutes; no repeat XP or lesson unlock.');

  const helpContext=await context();await helpContext.addInitScript(()=>{Math.random=()=>0.5});const h=await seed(helpContext,blank());
  await h.locator('.node[data-lesson="1.1"]').click();await h.locator('#startLessonQuiz').click();const prompt=await h.locator('.quiz-question').innerText(),q=questions.get(prompt);await h.locator(`[data-option="${(q.correct_index+1)%4}"]`).click();await h.locator('#confirmAnswer').click();await help(h);assert.equal(await h.locator('.quiz-question').innerText(),prompt);assert.equal((await saved(h)).wrong[q.id],true);assert.equal(await h.locator('#nextQuestion').isEnabled(),true);
  await h.locator('#nextQuestion').click();const next=questions.get(await h.locator('.quiz-question').innerText());await h.locator(`[data-option="${next.correct_index}"]`).click();await h.locator('#confirmAnswer').click();await h.locator('#nextQuestion').click();await h.locator('#quizFreeText').fill(D.lessons[0].practice[0].model_answer);await h.locator('#submitFree').click();await h.locator('#freeRetry').click();await help(h);
  await helpContext.close();console.log('PASS: contextual chapter and mini exercise after incorrect MC and free-text self-assessment, original answer unchanged.');

  const examContext=await context(),e=await seed(examContext,initial);await e.locator('#studyExamSetup').click();await e.locator('[name="studyExamModule"][value="2"]').check();await e.locator('#studyExamCount').selectOption('5');await e.locator('#studyExamStart').click();
  assert.equal(await e.locator('#readLesson').count(),0);assert.equal(await e.locator('.quiz-feedback').count(),0);
  await chooseExam(e,false);const session=await e.evaluate(()=>JSON.parse(sessionStorage.getItem('skillyr_learn_exam_session_v1')));
  const modules=new Set(session.ids.map(id=>allQ.find(q=>q.id===id).module));assert.deepEqual([...modules].sort(),[1,2]);
  await e.locator('#studyExamNext').click();await chooseExam(e,true);await e.locator('#studyExamPrev').click();assert.equal(await e.locator('.quiz-choice.selected').count(),1);await e.reload();assert.equal(await e.locator('.quiz-question').count(),1);assert.equal(await e.locator('.quiz-choice.selected').count(),1);assert.equal(await e.locator('.quiz-choice.right').count(),0);
  const restored=await e.evaluate(()=>JSON.parse(sessionStorage.getItem('skillyr_learn_exam_session_v1')));assert.deepEqual(restored.answers,session.answers.map((a,i)=>i===1?questions.get(allQ.find(q=>q.id===session.ids[1]).question).correct_index:a));
  await e.locator('#studyExamNext').click();await e.locator('#studyExamNext').click();await e.locator('#studyExamNext').click();await chooseExam(e,true);await e.locator('#studyExamNext').click();await chooseExam(e,true);await e.locator('#studyExamFinish').click();
  assert.match(await e.locator('.quiz-results').innerText(),/3 \/ 5 richtig/);assert.match(await e.locator('.quiz-results').innerText(),/1\s+unbeantwortet/);await checkWidth(e);await e.screenshot({path:path.join(out,'study-exam-result.png')});
  let examState=await saved(e);assert.equal(examState.xp,100);assert.deepEqual(examState.done,initial.done);assert.equal(examState.examHistory.length,1);assert.equal(examState.examHistory[0].correct,3);
  await e.locator('#studyExamToReview').click();examState=await saved(e);assert.equal(Object.keys(examState.wrong).length,2);
  await e.locator('#studyExamNew').click();await e.locator('#studyExamMinutes').selectOption('1');await e.locator('#studyExamCount').selectOption('5');
  await e.clock.install();await e.locator('#studyExamStart').click();const timed=await e.evaluate(()=>JSON.parse(sessionStorage.getItem('skillyr_learn_exam_session_v1')));await chooseExam(e,true);await e.reload();const sameDeadline=await e.evaluate(()=>JSON.parse(sessionStorage.getItem('skillyr_learn_exam_session_v1')).deadline);assert.equal(sameDeadline,timed.deadline);await e.clock.fastForward(61000);await e.locator('.quiz-results').waitFor();assert.match(await e.locator('.quiz-results-desc').innerText(),/Zeitlimit/);assert.equal((await saved(e)).examHistory.length,2);await e.reload();assert.equal((await saved(e)).examHistory.length,2);
  await examContext.close();console.log('PASS: mixed modules, deferred solutions, navigation and reload, skipped answers, history and review transfer; persistent timer expires exactly once.');

  const offlineContext=await context(),off=await seed(offlineContext,blank());await off.evaluate(async()=>await navigator.serviceWorker.ready);await off.reload();await off.waitForFunction(()=>!!navigator.serviceWorker.controller);await offlineContext.setOffline(true);await off.reload();await off.locator('#studySearch').click();await off.locator('#studyQuery').fill('Cornell');assert(await off.locator('.study-result').count()>0);await off.locator('#nav-path').click();await off.locator('#studyToday').click();assert.equal(await off.locator('#studyDailyLearned').count(),1);await offlineContext.close();
  assert.deepEqual(errors,[]);console.log('PASS: new tools remain available offline; no browser script errors.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{console.error(error);process.exitCode=1;server.close()});
