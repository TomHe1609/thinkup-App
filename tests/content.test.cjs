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
  const match=html.match(/const DATA = (.*);\r?\nconst ICON_PATHS/);
  assert.ok(match);
  assert.deepEqual(JSON.parse(match[1]),data);
});
test('Existing module, lesson and task IDs, quiz questions, answers and all 732 cards are unchanged',()=>{
  const select=d=>({modules:d.modules,lessons:d.lessons.map(l=>({id:l.id,module:l.module,title:l.title,questions:l.questions,practice:l.practice})),cards:d.cards,courseCards:d.courseCards});
  assert.deepEqual(select(data),select(baseline));
  assert.equal(data.lessons.flatMap(l=>l.questions).length,211);
  assert.equal(data.cards.length+data.courseCards.length,732);
  for(const file of ['data-m02.json','data-m01-m05.json']){
    const original=require('node:child_process').execFileSync('git',['show',`33beb11:${file}`],{cwd:root});
    const current=fs.readFileSync(path.join(root,file));
    // Git's Windows line-ending conversion is not an application content change.
    assert.equal(current.toString().replace(/\r\n/g,'\n'),original.toString().replace(/\r\n/g,'\n'));
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
  assert.equal(l.questions.length,13);
});
test('Learning text is cached with the app and the previous progress storage is retained',()=>{
  assert.ok(html.includes("const STORE='skillyr_learn_m01_m05_preview_v1'"));
  assert.ok(html.includes("const LEGACY_STORE='skillyr_learn_m02_preview_v1'"));
  const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
  assert.ok(sw.includes("const PREFIX='skillyr-m02-test::'"));
  assert.ok(sw.includes('learning-texts-v14'));
  assert.ok(sw.includes("'./data-m01-m09.json'"));
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(data.lessons.map(l=>l.questions))).digest('hex'),crypto.createHash('sha256').update(JSON.stringify(baseline.lessons.map(l=>l.questions))).digest('hex'));
});
