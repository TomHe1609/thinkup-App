const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root,'data-m01-m09.json'),'utf8'));
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const baseline = JSON.parse(require('node:child_process').execFileSync('git',['show','33beb11:data-m01-m09.json'], {cwd:root,encoding:'utf8',maxBuffer:5000000}));

test('All application scripts parse and embedded content matches the public JSON',()=>{
  for(const script of scripts) new vm.Script(script);
  new vm.Script(fs.readFileSync(path.join(root,'study-features.js'),'utf8'));
  const match=html.match(/const DATA = (.*);\r?\nconst ICON_PATHS/);
  assert.ok(match);
  assert.deepEqual(JSON.parse(match[1]),data);
});
test('Revision preserves lesson/task/card identities and original course cards while replacing every quiz and practice task',()=>{
  const identity=d=>d.lessons.map(l=>({id:l.id,module:l.module,title:l.title,ids:[...l.questions,...l.practice].map(q=>q.id).sort()}));
  assert.deepEqual(identity(data),identity(baseline));
  assert.deepEqual(data.modules.map(({questionCount,practiceCount,...m})=>m),baseline.modules.map(({questionCount,practiceCount,...m})=>m));
  assert.deepEqual(data.courseCards,baseline.courseCards);
  assert.deepEqual(data.cards.map(c=>c.id),baseline.cards.map(c=>c.id));
  const questions=data.lessons.flatMap(l=>l.questions);
  assert.equal(questions.length,278);assert.equal(new Set(questions.map(q=>q.id)).size,278);assert.equal(new Set(questions.map(q=>q.question)).size,278);
  assert.equal(data.lessons.flatMap(l=>l.practice).length,0);
  for(const l of data.lessons){const old=baseline.lessons.find(x=>x.id===l.id);assert.deepEqual(l.legacyPracticeIds,old.practice.map(q=>q.id));for(const q of l.questions){
   assert.equal(q.type,'single_choice');assert.equal(q.module,l.module);assert.equal(q.lesson_id,l.id);assert.equal(q.contentRevision,2);
   assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert(q.options.every(o=>typeof o==='string'&&o.length));assert(Number.isInteger(q.correct_index)&&q.correct_index>=0&&q.correct_index<4);
   assert(q.explanation.length>=80,q.id);assert.notEqual(q.question,[...old.questions,...old.practice].find(x=>x.id===q.id).question,q.id);
  }}
  for(const m of data.modules){assert.equal(m.practiceCount,0);assert.equal(m.questionCount,data.lessons.filter(l=>l.module===m.id).reduce((n,l)=>n+l.questions.length,0));}
  for(const file of ['data-m02.json','data-m01-m05.json']){
   const old=require('node:child_process').execFileSync('git',['show','33beb11:'+file],{cwd:root,encoding:'utf8'});
   assert.equal(fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n'),old.replace(/\r\n/g,'\n'));
  }
});
test('Every one of 67 lessons in M01–M09 has substantive explanations, defined terms, a worked example and self-check',()=>{
  assert.equal(data.lessons.length,67);
  assert.equal(data.modules.length,9);
  for(const l of data.lessons){
    const text=l.learning;
    assert.ok(text, l.id);
    assert.ok(text.introduction.length>=100,l.id);
    assert.ok(text.terms.length>=3,l.id);
    assert.ok(text.terms.every(t=>t.term&&t.definition.length>=20),l.id);
    assert.ok(text.example.steps.length>=3,l.id);
    assert.ok(text.example.steps.every(s=>s.length>=50),l.id);
    assert.ok(text.selfCheck.question&&text.selfCheck.answer,l.id);
    assert.ok(l.concepts.every(c=>c.body&&c.example),l.id);
  }
});
test('M02/2.9 explains optional cardinalities, keys, anomalies and all three normal forms',()=>{
  const l=data.lessons.find(l=>l.id==='2.9');
  const text=JSON.stringify(l);
  for(const term of ['0..n','1:1','1:n','m:n','Kandidatenschlüssel','Fremdschlüssel','1NF','2NF','3NF','Änderungsanomalie','Einfügeanomalie','Löschanomalie','Superschlüssel','artikel_id → artikelname']) assert.ok(text.includes(term),term);
  assert.equal(l.questions.length,14);
});
test('All guided lessons explain a scenario in ordered paragraphs and map every existing course question',()=>{
  const assigned=[];
  for(const lesson of data.lessons){
    const tutorial=lesson.learning.tutorial;
    assert.ok(tutorial.goal.length>50,lesson.id);
    assert.ok(tutorial.opening.length>100,lesson.id);
    assert.ok(tutorial.chapters.length>=3,lesson.id);
    assert.ok(tutorial.chapters.every(c=>c.title&&c.paragraphs.length&&c.paragraphs.every(p=>p.length>60)),lesson.id);
    assert.ok(tutorial.recap.length>=3,lesson.id);
    const expected=data.courseCards.filter(c=>c.lesson_id===lesson.id).map(c=>c.id);
    assert.deepEqual(lesson.learning.courseCardIds,expected,lesson.id);
    assigned.push(...lesson.learning.courseCardIds);
  }
  assert.equal(assigned.length,521);
  assert.equal(new Set(assigned).size,521);
  const first=JSON.stringify(data.lessons.find(l=>l.id==='1.1').learning.tutorial);
  for(const term of ['Survey','Question','Read','Recite','Review','Cornell','Mind-Map','Concept Map','Loci','Spaced Repetition','Lernzugänge'])assert.ok(first.includes(term),term);
});
test('Learning text is cached with the app and the previous progress storage is retained',()=>{
  assert.ok(html.includes("const STORE='skillyr_learn_m01_m05_preview_v1'"));
  assert.ok(html.includes("const LEGACY_STORE='skillyr_learn_m02_preview_v1'"));
  const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
  assert.ok(sw.includes("const PREFIX='skillyr-m02-test::'"));
  assert.ok(sw.includes('thinkup-applied-quizzes-v21'));
  assert.ok(sw.includes("'./data-m01-m09.json'"));
});
test('The basic design keeps every original style block, header structure and bottom navigation',()=>{
  const before=require('node:child_process').execFileSync('git',['show','3f6f266:index.html'],{cwd:root,encoding:'utf8',maxBuffer:5000000}).replace(/\r\n/g,'\n');
  const current=html.replace(/\r\n/g,'\n');
  const styles=text=>[...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1].trim());
  const oldStyles=styles(before),newStyles=styles(current);
  assert.equal(newStyles.length,oldStyles.length);
  for(let i=0;i<oldStyles.length;i++)assert.ok(newStyles[i].includes(oldStyles[i]),'Original design block '+i+' changed');
  assert.equal(current.match(/<header>[\s\S]*?<\/header>/)[0],before.match(/<header>[\s\S]*?<\/header>/)[0].replace('skillyr<span','thinkup<span').replace('Testversion · M01–M09','Lernpfade · M01–M09'));
  assert.equal(current.match(/<nav class="bottomnav"[\s\S]*?<\/nav>/)[0],before.match(/<nav class="bottomnav"[\s\S]*?<\/nav>/)[0]);
});
