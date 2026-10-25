const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../study-features.js'),D=require('../data-m01-m09.json');
const blank=()=>({activeModule:1,xp:20,done:{'1.1':true},correct:{},wrong:{},attempts:2,practices:{},days:[],reviewCards:{},coachReviews:{},favorites:{},reading:{},lastRead:null,daily:null,examHistory:[]});
const at=Date.UTC(2026,9,25,10),first=D.courseCards[0],q=D.lessons[0].questions[0];
test('Recall ratings schedule real delays and repeated secure recall grows to a bounded interval',()=>{
 assert.equal(C.rate(null,'again',at).due,at+600000);
 assert.equal(C.rate(null,'unsure',at).due,at+C.DAY);
 let r=C.rate(null,'known',at);assert.equal(r.due,at+3*C.DAY);
 r=C.rate(r,'known',at);assert.equal(r.due,at+6*C.DAY);
 for(let i=0;i<20;i++)r=C.rate(r,'known',at);
 assert.equal(r.due,at+60*C.DAY);assert.equal(C.rate(r,'again',at).streak,0);
 assert.throws(()=>C.rate(null,'invalid',at));
});
test('Old backups keep core progress while new state is validated without destroying valid data',()=>{
 const old={xp:90,done:{'1.1':true}};const out=blank();out.xp=old.xp;C.normalize(old,out,D);
 assert.equal(out.xp,90);assert.deepEqual(out.done,{'1.1':true});assert.deepEqual(out.reviewCards,{});
 const value={reviewCards:{[first.id]:C.rate(null,'known',at),bad:{rating:'known',last:at,due:Infinity,streak:1}},favorites:{[first.id]:true,'1.1':true,bad:true},reading:{'1.1':{y:456,at}},lastRead:{id:'1.1',at}};
 const normalized=C.normalize(value,blank(),D);
 assert.equal(Object.keys(normalized.reviewCards).length,1);assert.equal(normalized.reading['1.1'].y,456);assert.equal(normalized.favorites.bad,undefined);
 assert.deepEqual(C.normalize(normalized,blank(),D),normalized);
});
test('Daily round is deterministic, bounded, includes due cards and errors, and respects lesson access',()=>{
 const p=blank();p.done={};p.reviewCards[first.id]=C.rate(null,'again',at-700000);p.wrong[q.id]=true;
 const plan=C.dailyPlan(D,p,1,'2026-10-25',at,['1.1']);
 assert.ok(plan.length<=10);assert.equal(new Set(plan.map(p=>p.kind+':'+p.id)).size,plan.length);
 assert.ok(plan.some(p=>p.kind==='learn'&&p.id==='1.1'));
 assert.ok(plan.some(p=>p.kind==='card'&&p.id===first.id));
 assert.ok(plan.some(p=>p.kind==='question'&&p.id===q.id));
 assert.deepEqual(C.dailyPlan(D,p,1,'2026-10-25',at,['1.1']),plan);
 for(const item of plan.filter(p=>p.kind==='question'))assert.equal(D.lessons.flatMap(l=>l.questions).find(q=>q.id===item.id).lesson_id,'1.1');
 const future=blank();future.done={'1.1':true};future.reviewCards[first.id]=C.rate(null,'known',at);
 assert.ok(!C.dailyPlan(D,future,1,'2026-10-25',at,['1.1']).some(p=>p.kind==='card'&&p.id===first.id));
});
test('Daily progress restores only valid completed prefixes and recognized tasks',()=>{
 const value={daily:{day:'2026-10-25',plan:[{kind:'card',id:first.id},{kind:'question',id:q.id}],index:1,results:{['card:'+first.id]:{rating:'known'}}}};
 assert.equal(C.normalize(value,blank(),D).daily.index,1);
 value.daily.results={};assert.equal(C.normalize(value,blank(),D).daily,null);
 value.daily.index=0;value.daily.plan[0].id='missing';assert.equal(C.normalize(value,blank(),D).daily,null);
});
test('Search finds explanations and cards across modules, accent-insensitively, with exact favorite and module filters',()=>{
 const p=blank();p.favorites['2.9']=true;
 assert.ok(C.search(D,p,'Normalisierung').some(r=>r.kind==='lesson'&&r.id==='2.9'));
 assert.ok(C.search(D,p,'Primärschlüssel').some(r=>r.id==='2.9'));
 assert.deepEqual(C.search(D,p,'',{favorites:true}).map(r=>r.id),['2.9']);
 assert.ok(C.search(D,p,'M02',{kind:'lesson'}).every(r=>r.module===2));
 assert.equal(C.search(D,p,'Normalisierung',{module:9,kind:'card'}).every(r=>r.module===9&&r.kind==='card'),true);
 assert.ok(C.search(D,p,'API',{kind:'card'}).length>0);
});
test('Specific mistakes select the relevant chapter and a related exercise without modifying the quiz',()=>{
 const l=D.lessons.find(l=>l.id==='1.1');
 assert.deepEqual(l.questions.map(q=>C.chapter(q,l)),[1,3,2]);
 const exercise=C.mini(l.questions[2],l,D);assert.match(exercise.prompt,/Cornell/);assert.ok(exercise.answer.length>30);
 const db=D.lessons.find(l=>l.id==='2.9');assert.equal(C.chapter(db.questions[1],db),5);
 for(const l of D.lessons)for(const q of l.questions){const i=C.chapter(q,l);assert.ok(i>=0&&i<l.learning.tutorial.chapters.length,q.id);const mini=C.mini(q,l,D);assert.ok(mini.prompt&&mini.answer,q.id);}
});
test('Exam restoration validates question IDs and answers, and scores skipped questions correctly',()=>{
 const qs=D.lessons[0].questions;
 const e={ids:qs.map(q=>q.id),answers:[qs[0].correct_index,null,(qs[2].correct_index+1)%4],started:at,deadline:at+60000,index:1,finished:false,ended:0};
 const restored=C.validateExam(e,D);assert.ok(restored);
 const r=C.examResult(restored,D);assert.equal(r.total,3);assert.equal(r.correct,1);assert.equal(r.unanswered,1);
 assert.equal(C.validateExam({...e,ids:[q.id,q.id,q.id]},D),null);
 assert.equal(C.validateExam({...e,answers:[99,null,null]},D),null);
 assert.equal(C.validateExam({...e,deadline:at-1},D),null);
});
