const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root=path.join(__dirname,'..');
const D=JSON.parse(fs.readFileSync(path.join(root,'data-m01-m09.json'),'utf8'));
const KEY='skillyr_learn_m01_m05_preview_v1';
const LEGACY='skillyr_learn_m02_preview_v1';
const THEME='skillyr_learn_theme_v1';
const results=path.resolve(process.env.TEST_OUTPUT_DIR || path.join(root,'test-results'));
fs.mkdirSync(results,{recursive:true});
const blank=()=>({activeModule:2,xp:0,done:{},correct:{},wrong:{},attempts:0,practices:{},days:[],reviewCards:{},coachReviews:{}});
const allowed=new Set(['index.html','sw.js','manifest.webmanifest','data-m02.json','data-m01-m05.json','data-m01-m09.json','icon-192.png','icon-512.png']);
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png'};
let servePreviousVersion=false;
const previousAssets=Object.fromEntries([...allowed].map(name=>[name,require('node:child_process').execFileSync('git',['show',`33beb11:${name}`],{cwd:root,maxBuffer:5000000})]));
const server=http.createServer((req,res)=>{
  const name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';
  if(!allowed.has(name)){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(name)],'Cache-Control':'no-cache'});
  res.end(servePreviousVersion?previousAssets[name]:fs.readFileSync(path.join(root,name)));
});
let browser;
const errors=[];
async function context(width=390){
  const c=await browser.newContext({viewport:{width,height:844},isMobile:width<600,hasTouch:width<600,reducedMotion:'reduce',acceptDownloads:true});
  c.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
  return c;
}
async function seed(c,url,progress,key=KEY){
  const p=await c.newPage();await p.goto(url);
  await p.evaluate(({key,progress,THEME})=>{localStorage.clear();localStorage.setItem(key,JSON.stringify(progress));localStorage.setItem(THEME,'petrol')},{key,progress,THEME});
  await p.reload();return p;
}
async function stored(p,key=KEY){return p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key)}
async function noOverflow(p){assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal page overflow');}
async function lookupAndReturn(p,expectedLesson){
  const before=await p.locator('.quiz-question').innerText();
  const progress=await stored(p);
  await p.locator('#readLesson').click();
  await p.locator('#learningDialog[open]').waitFor();
  assert.match(await p.locator('#learningReferenceContent h3').innerText(),new RegExp(expectedLesson.replace('.','\\.')));
  assert.equal(await p.locator('#learningDialog .learning-terms').count(),1);
  assert(await p.locator('#learningDialog').evaluate(el=>el.scrollWidth<=el.clientWidth+1),'horizontal dialog overflow');
  await p.locator('#learningDialog .learning-check summary').click();
  await p.keyboard.press('Escape');
  assert.equal(await p.locator('#learningDialog').getAttribute('open'),null);
  assert.equal(await p.locator('.quiz-question').innerText(),before);
  assert.deepEqual(await stored(p),progress);
  assert.equal(await p.locator('#readLesson').evaluate(el=>el===document.activeElement),true);
}
async function mixedQuiz(p,id){
  const lesson=D.lessons.find(l=>l.id===id);
  let mc=0,free=0;
  for(let step=0;step<10;step++){
    if(await p.locator('.quiz-results').count())break;
    const question=await p.locator('.quiz-question').innerText();
    const q=lesson.questions.find(q=>q.question===question);
    if(q){
      await p.locator(`[data-option="${q.correct_index}"]`).click();
      await lookupAndReturn(p,id);
      assert.equal(await p.locator(`[data-option="${q.correct_index}"]`).getAttribute('aria-pressed'),'true');
      await p.locator('#confirmAnswer').click();
      await lookupAndReturn(p,id);
      assert.equal(await p.locator('.quiz-choice.right').count(),1);mc++;
    }else{
      const draft='Ich trenne Artikel mit Artikelname und die Position mit Lieferung, Artikel und Menge. Die Menge gehört zur konkreten Zuordnung.';
      await p.locator('#quizFreeText').fill(draft);
      await lookupAndReturn(p,id);
      assert.equal(await p.locator('#quizFreeText').inputValue(),draft);
      await p.locator('#submitFree').click();
      await lookupAndReturn(p,id);
      assert.equal(await p.locator('#quizFreeText').inputValue(),draft);
      await p.locator('#freeKnown').click();
      await lookupAndReturn(p,id);
      assert.equal(await p.locator('#nextQuestion').isEnabled(),true);free++;
    }
    await p.locator('#nextQuestion').click();
  }
  assert.equal(mc,Math.min(5,lesson.questions.length));assert.equal(free,1);
  assert.equal(await p.locator('.quiz-results').count(),1);
  assert.match(await p.locator('.quiz-result-count').innerText(),/6 von 6/);
}
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url=`http://localhost:${server.address().port}/`;
  browser=await chromium.launch({headless:true,...(process.env.TEST_BROWSER_CHANNEL?{channel:process.env.TEST_BROWSER_CHANNEL}:{})});
  try{
    // Visit each lesson through the real module and path buttons.
    const c=await context();
    const state={...blank(),done:Object.fromEntries(D.lessons.map(l=>[l.id,true])),xp:170,attempts:19,practices:{'2.9':{text:'Eigene frühere Antwort',known:true,mode:'self'}}};
    const p=await seed(c,url,state);
    for(const module of D.modules){
      await p.locator(`[data-module="${module.id}"]`).click();
      for(const lesson of D.lessons.filter(l=>l.module===module.id)){
        const before=await stored(p);
        await p.locator(`.node[data-lesson="${lesson.id}"]`).click();
        assert.equal(await p.locator('.learning-text').count(),1);
        assert.equal(await p.locator('.quiz-question').count(),0);
        assert.equal(await p.locator('.learning-terms dt').count(),lesson.learning.terms.length);
        assert.match(await p.locator('.learning-example').innerText(),/Schritt für Schritt/);
        assert(await p.locator('#startLessonQuiz').evaluate(el=>el.compareDocumentPosition(document.querySelector('.learning-text'))&Node.DOCUMENT_POSITION_PRECEDING));
        await p.locator('.learning-check summary').click();
        assert.deepEqual(await stored(p),before,'reading must not award XP or completion');
        await noOverflow(p);
        await p.locator('#startLessonQuiz').click();
        assert.equal(await p.locator('.quiz-question').count(),1);
        assert.equal(await p.locator('#readLesson').count(),1);
        await p.locator('.quiz-close').click();
        assert.equal(await p.locator('.learning-text').count(),1);
        await p.locator('.back[data-page="path"]').click();
      }
    }
    console.log('PASS: all 67 lessons in nine modules open with learning text before quiz; reading changes no progress.');
    await c.close();

    // Actual M02/2.9 progression with old progress and a mixed session.
    const mobile=await context(320);
    const initial={...blank(),done:{'2.8':true},xp:120,attempts:15,correct:{[D.lessons[0].questions[0].id]:true},wrong:{[D.lessons.find(l=>l.id==='2.9').questions[0].id]:true},practices:{'2.8':{text:'Bisherige Freitextantwort',known:true,mode:'self'}}};
    const q=await seed(mobile,url,initial);
    assert.equal(await q.locator('.node[data-lesson="2.9"]').isEnabled(),true);
    assert.equal(await q.locator('.node[data-lesson="2.10"]').isDisabled(),true);
    await q.locator('.node[data-lesson="2.9"]').click();
    assert.deepEqual(await stored(q),initial);
    await q.screenshot({path:path.join(results,'m02-2-9-learning-320.png'),fullPage:true});
    await q.locator('#startLessonQuiz').click();
    await lookupAndReturn(q,'2.9');
    await q.screenshot({path:path.join(results,'m02-2-9-quiz-320.png'),fullPage:true});
    await mixedQuiz(q,'2.9');
    const completed=await stored(q);
    assert.equal(completed.done['2.8'],true);assert.equal(completed.done['2.9'],true);
    assert.deepEqual(completed.practices['2.8'],initial.practices['2.8']);
    assert.equal(completed.xp,initial.xp+60);assert.equal(completed.attempts,initial.attempts+6);
    await q.locator('.quiz-result-secondary').click();
    assert.equal(await q.locator('.node[data-lesson="2.10"]').isEnabled(),true);
    assert.equal(await q.locator('.node[data-lesson="2.11"]').isDisabled(),true);
    await q.reload();assert.deepEqual(await stored(q),completed);
    await q.locator('.node[data-lesson="2.9"]').click();
    await q.locator('#startLessonQuiz').click();
    await q.locator('#readLesson').click();
    await q.screenshot({path:path.join(results,'m02-2-9-reference-320.png')});
    await q.locator('#learningDialog [data-learning-close]').first().click();
    assert.equal(await q.locator('.quiz-question').count(),1);
    console.log('PASS: M02/2.9 mixed quiz, selected answers, submitted and unsubmitted free text, XP and direct successor unlock.');

    // Export/import uses the existing schema and existing confirmation flow.
    await q.locator('.quiz-close').click();await q.locator('[data-page="stats"]').first().click();
    await q.locator('.data-settings>summary').click();
    const download=q.waitForEvent('download');await q.locator('#exportProgress').click();
    const backup=path.join(results,'progress-backup.json');await (await download).saveAs(backup);
    const exported=JSON.parse(fs.readFileSync(backup,'utf8'));
    assert.equal(exported.app,'skillyr-learn-m01-m09');assert.equal(exported.schemaVersion,3);assert.deepEqual(exported.progress,completed);
    await q.locator('.reset-settings>summary').click();q.once('dialog',d=>d.accept());await q.locator('#resetProgress').click();
    assert.equal((await stored(q)).xp,0);
    await q.locator('.data-settings>summary').click();q.once('dialog',d=>d.accept());await q.locator('#importProgress').setInputFiles(backup);
    await q.waitForFunction(({KEY,xp})=>JSON.parse(localStorage.getItem(KEY)).xp===xp,{KEY,xp:completed.xp});
    assert.deepEqual(await stored(q),completed);
    assert.equal(await q.evaluate(k=>localStorage.getItem(k),THEME),'petrol');
    console.log('PASS: export, reset and import preserve the previous schema, progress and separate theme preference.');

    // Offline reload and learning/quiz lookup need no external content.
    await q.evaluate(async()=>{await navigator.serviceWorker.ready;});
    await q.reload();await q.waitForFunction(()=>!!navigator.serviceWorker.controller);
    await mobile.setOffline(true);await q.reload();
    await q.locator('[data-module="2"]').click();await q.locator('.node[data-lesson="2.9"]').click();
    assert.match(await q.locator('.learning-text').innerText(),/Dritte Normalform/);
    await q.locator('#startLessonQuiz').click();await lookupAndReturn(q,'2.9');
    assert.deepEqual(await stored(q),completed);
    await mobile.setOffline(false);await mobile.close();
    console.log('PASS: offline reload, learning text and quiz reference.');

    // Legacy M02 storage migrates without touching its original entry.
    const legacyContext=await context(1280);const legacyProgress={...blank(),xp:90,attempts:9,done:{'2.8':true},practices:{'2.8':{text:'Alter M02-Stand',known:true,mode:'self'}}};
    const legacyPage=await seed(legacyContext,url,legacyProgress,LEGACY);
    assert.deepEqual(await stored(legacyPage,LEGACY),legacyProgress);
    assert.deepEqual(await stored(legacyPage),legacyProgress);
    await legacyPage.locator('.node[data-lesson="2.9"]').click();await noOverflow(legacyPage);
    await legacyPage.screenshot({path:path.join(results,'m02-2-9-learning-desktop.png')});
    await legacyContext.close();
    console.log('PASS: legacy M02 migration and desktop layout.');

    // Failed answers remain eligible for scoped error training; lookup follows the actual question lesson.
    const reviewContext=await context();
    const wrong=D.lessons.find(l=>l.id==='2.8').questions[0];
    const r=await seed(reviewContext,url,{...completed,wrong:{[wrong.id]:true}});
    await r.locator('[data-page="review"]').first().click();await r.locator('#beginReview').click();
    await lookupAndReturn(r,'2.8');
    await reviewContext.close();

    // Upgrade an already installed v13 service worker without resetting progress or unrelated caches.
    servePreviousVersion=true;
    const upgradeContext=await context();const old=await seed(upgradeContext,url,initial);
    await old.evaluate(async()=>{await navigator.serviceWorker.ready;await caches.open('unrelated-app-test-cache');});
    await old.reload();await old.waitForFunction(()=>!!navigator.serviceWorker.controller);
    await old.locator('.node[data-lesson="2.9"]').click();
    assert.equal(await old.locator('#nextConcept').count(),1);
    servePreviousVersion=false;
    await old.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update();});
    await old.waitForFunction(async()=>{const keys=await caches.keys();return keys.includes('skillyr-m02-test::m01-m09-learning-texts-v14')&&!keys.includes('skillyr-m02-test::m01-m09-iphone-status-bar-v13');});
    await old.reload();await old.locator('.node[data-lesson="2.9"]').click();
    assert.equal(await old.locator('#startLessonQuiz').count(),1);
    assert.deepEqual(await stored(old),initial);
    assert(await old.evaluate(async()=>(await caches.keys()).includes('unrelated-app-test-cache')));
    await upgradeContext.setOffline(true);await old.reload();
    await old.locator('.node[data-lesson="2.9"]').click();
    assert.match(await old.locator('.learning-text').innerText(),/Dritte Normalform/);
    await upgradeContext.close();
    console.log('PASS: existing v13 offline installation upgrades to v14, retaining progress and unrelated caches.');
    assert.deepEqual(errors,[],'browser script errors');
    console.log('PASS: error-training lookup uses the current question lesson; no browser script errors.');
  }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;server.close();});
