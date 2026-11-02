const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.join(__dirname,'..'),D=require('../data-m01-m09.json'),KEY='skillyr_learn_m01_m05_preview_v1',EXAM='skillyr_learn_exam_session_v1';
const allowed=new Set(['index.html','appearance.css','learning-support.css','glossary-examples.js','learning-support-data.js','learning-support.js','study-features.js','sw.js','manifest.webmanifest','data-m01-m09.json','data-m01-m05.json','data-m02.json','icon-192.png','icon-512.png']);
const server=http.createServer((req,res)=>{const file=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';if(!allowed.has(file)){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':'application/json','Cache-Control':'no-store'});res.end(fs.readFileSync(path.join(root,file)));});
let browser;
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 browser=await chromium.launch({headless:true,...(process.env.TEST_BROWSER_CHANNEL?{channel:process.env.TEST_BROWSER_CHANNEL}:{})});
 try{
  const c=await browser.newContext({viewport:{width:320,height:740},reducedMotion:'reduce'}),p=await c.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:'+server.address().port+'/');
  const old={activeModule:1,xp:730,done:{'1.1':true,'2.8':true},correct:{'SKY-008':true},wrong:{'SKY-008':true},attempts:94,practices:{'1.1':{text:'Meine frühere Lernplanung bleibt gespeichert.',known:false,mode:'ai'}},days:['2026-10-25'],coachReviews:{'SKY-008':{lesson_id:'1.1',score:60,verdict:'partial',at:'2026-10-25T10:00:00.000Z'}},reviewCards:{},favorites:{'1.1':true},reading:{'1.1':{y:123,at:1792922400000}},lastRead:{id:'1.1',at:1792922400000},examHistory:[{at:1792922400000,modules:[1],total:3,correct:2,seconds:33}],daily:{day:'2026-11-02',plan:[{kind:'question',id:'SKY-005'}],index:1,results:{'question:SKY-005':{choice:2}}}};
  await p.evaluate(({KEY,EXAM,old})=>{localStorage.setItem(KEY,JSON.stringify(old));sessionStorage.setItem(EXAM,JSON.stringify({ids:['SKY-005'],answers:[2],started:1792922400000,deadline:0,index:0,finished:false}));},{KEY,EXAM,old});
  await p.reload();const state=await p.evaluate(()=>progress);
  for(const key of ['xp','done','correct','wrong','attempts','practices','coachReviews','favorites','reading','lastRead','examHistory'])assert.deepEqual(state[key],old[key],key);
  assert.equal(state.daily,null);assert.equal(await p.locator('.quiz-question').count(),0,'old exam must not score new options');
  await p.locator('.node[data-lesson="1.1"]').click();await p.locator('#startLessonQuiz').click();
  const transfer=D.lessons[0].questions.find(q=>q.id==='SKY-008');let seen=false;
  for(let i=0;i<4;i++){
   assert.equal(await p.locator('textarea').count(),0);
   const prompt=await p.locator('.quiz-question').innerText(),q=D.lessons[0].questions.find(q=>q.question===prompt);assert(q);
   const xp=await p.evaluate(()=>progress.xp);
   await p.locator('[data-option="'+q.correct_index+'"]').click();await p.locator('#confirmAnswer').click();
   if(q.id===transfer.id){seen=true;assert.equal(await p.evaluate(()=>progress.xp),xp,'historical XP is not awarded again');assert.equal(await p.evaluate(()=>progress.practices['1.1'].text),old.practices['1.1'].text);assert.equal(await p.evaluate(()=>progress.practices['1.1'].known),true);}
   await p.locator('#nextQuestion').click();
  }
  assert(seen);assert.equal(await p.locator('.quiz-result-count').innerText(),'4 von 4 Fragen richtig beantwortet');
  const after=await p.evaluate(()=>progress);assert.equal(after.xp,760);assert.equal(after.attempts,98);assert.equal(after.wrong['SKY-008'],undefined);assert.deepEqual(after.coachReviews,old.coachReviews);
  await p.locator('.quiz-result-secondary').click();
  await p.evaluate(()=>{progress.wrong['SKY-008']=true;progress.daily=null;save();});
  await p.locator('#studyToday').click();const plan=await p.evaluate(()=>progress.daily);assert.equal(plan.contentRevision,2);assert(plan.plan.some(x=>x.kind==='question'&&x.id==='SKY-008'));
  await p.locator('#nav-path').click();await p.locator('#studyExamSetup').click();await p.locator('#studyExamCount').selectOption('20');await p.locator('#studyExamStart').click();
  const exam=await p.evaluate(EXAM=>JSON.parse(sessionStorage.getItem(EXAM)),EXAM);assert.equal(exam.contentRevision,2);assert(exam.ids.includes('SKY-008'));assert(exam.ids.includes('SKY-012'));
  assert.equal(await p.locator('[data-support-hint]').count(),0);assert.equal(await p.locator('textarea').count(),0);
  await p.locator('[data-study-exam-choice="0"]').click();await p.reload();assert.equal(await p.locator('.quiz-choice.selected').count(),1);
  assert.deepEqual(errors,[]);await c.close();
  console.log('PASS: historical free-text, coach assessments, XP and completions survive; stale answer indexes are discarded; converted practice enters all quiz pools and does not duplicate XP.');
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
