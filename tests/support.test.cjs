const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const D=require('../data-m01-m09.json'),content=require('../learning-support-data.js'),Core=require('../learning-support.js');
const root=path.join(__dirname,'..');
test('Every existing MC and free-text task has two authored stages without copying its full solution',()=>{
 const questions=D.lessons.flatMap(l=>[...l.questions,...l.practice]);assert.equal(questions.length,278);
 assert.deepEqual(Object.keys(content.hints).sort(),questions.map(q=>q.id).sort());
 for(const q of questions){const pair=content.hints[q.id];assert.equal(pair.length,2,q.id);assert.notEqual(pair[0],pair[1]);
  for(const hint of pair){assert.equal(typeof hint,'string');assert(hint.length>=40&&hint.length<=400,q.id);assert(!/<\/?\w|Antwort [A-D] ist|richtig ist [A-D]/i.test(hint),q.id);
   const solution=q.model_answer||q.options[q.correct_index];if(solution.length>35)assert(!hint.includes(solution),q.id+' copies solution');
  }
 }
});
test('Glossaries retain all 255 local definitions and examples plus central database terms',()=>{
 let count=0;for(const lesson of D.lessons){const entries=Core.catalog(lesson,content);assert.equal(entries.length,lesson.learning.terms.length+content.glossary.length);
  for(const [i,term] of lesson.learning.terms.entries()){assert.equal(entries[i].definition,term.definition);assert.equal(entries[i].term,term.term);assert.equal(entries[i].examples.length,1);assert(entries[i].examples.every(text=>text.length>30));count++}
 }
 assert.equal(count,255);
 for(const name of ['Normalisierung','Kardinalität','1NF','2NF','3NF','API'])assert(content.glossary.some(t=>t.term===name));
});
test('Every glossary example is specific to its entry, distinct from definitions and never a reused whole-lesson example',()=>{
 const curated=require('../glossary-examples.js'),all=[];
 assert.deepEqual(Object.keys(curated.local).sort(),D.lessons.map(l=>l.id).sort());
 for(const lesson of D.lessons){assert.deepEqual(Object.keys(curated.local[lesson.id]).sort(),lesson.learning.terms.map(t=>t.term).sort());
  for(const entry of Core.catalog(lesson,content).slice(0,lesson.learning.terms.length)){
   const example=entry.examples[0];assert.equal(example,curated.local[lesson.id][entry.term]);
   assert(example.length>=100&&example.length<=650,entry.id);assert.notEqual(example,entry.definition);assert(!example.includes(entry.definition),entry.id);
   assert(!lesson.learning.example.steps.includes(example),entry.id);assert.notEqual(example,lesson.learning.example.steps.join(' '));all.push(example);
  }
 }
 assert.deepEqual(Object.keys(curated.common).sort(),content.glossary.map(t=>t.term).sort());
 for(const term of content.glossary){assert.equal(term.example,curated.common[term.term]);assert(!term.example.includes(term.definition),term.term);all.push(term.example)}
 assert.equal(all.length,275);assert.equal(new Set(all.map(Core.key)).size,275,'Examples were unintentionally shared between terms');
});
test('Missing future examples never fall back to a lesson-wide story or a definition',()=>{
 const l=D.lessons.find(l=>l.id==='2.9'),entries=Core.catalog(l,{...content,examples:{}});
 for(const entry of entries.slice(0,l.learning.terms.length)){assert.equal(typeof entry.definition,'string');assert.deepEqual(entry.examples,[])}
});
test('Example correction retains all quiz hints, common definitions and aliases from the published version',()=>{
 const previous=require('node:child_process').execFileSync('git',['show','4facbb1:learning-support-data.js'],{cwd:root,encoding:'utf8',maxBuffer:2000000}),scope={module:{exports:{}}};
 vm.runInNewContext(previous,scope);const old=JSON.parse(JSON.stringify(scope.module.exports));
 assert.deepEqual(content.hints,old.hints);assert.deepEqual(content.aliases,old.aliases);
 const definitions=terms=>terms.map(({example,...term})=>term);assert.deepEqual(definitions(content.glossary),definitions(old.glossary));
});
test('Earned-value examples separate planned value, completed value and actual costs with correct ratios',()=>{
 const e=content.examples['9.7'];assert(e.PV.includes('4.000'));assert(e.EV.includes('3.000'));assert(e.AC.includes('3.750'));
 const format=n=>n.toLocaleString('de-DE',{minimumFractionDigits:0,maximumFractionDigits:2});
 assert(e.CPI.includes('CPI = 3.000 / 3.750 = '+format(3000/3750)));assert(e.SPI.includes('SPI = 3.000 / 4.000 = '+format(3000/4000)));
});
test('Term matching respects German word boundaries, compound names, local definitions and original text',()=>{
 const lesson=D.lessons.find(l=>l.id==='2.9'),entries=Core.catalog(lesson,content),match=Core.matcher(entries);
 const input='Die Primärschlüssel und Fremdschlüssel verbinden Entitäten. Normalisierung vermeidet Redundanz.';
 const parts=match(input);assert.deepEqual(parts.map(m=>input.slice(m.start,m.end)),['Primärschlüssel','Fremdschlüssel','Entitäten','Normalisierung','Redundanz']);
 assert.equal(parts[0].entry.definition,lesson.learning.terms.find(t=>t.term==='Primärschlüssel').definition);
 const one=Core.matcher(Core.catalog(D.lessons.find(l=>l.id==='9.7'),content));
 assert.deepEqual(one('RACI enthält AC nicht als eigenständiges Wort. VAC und AC sind verschieden.').map(m=>m.entry.term),['AC']);
 assert.equal(match('KeineAPIundkeinSQL und PräSQL sowie Normalisierungswerkzeug').length,0);
 assert.equal(match('SQL SQL').length,1);
 assert.equal(match('Den Rest erkläre ich später; REST beschreibt einen Architekturstil.').length,1);
 assert.equal(match('Der Rest bleibt übrig.').length,0);
 const pairs=Core.matcher(Core.catalog(D.lessons.find(l=>l.id==='2.5'),content))('PoC und MVP sind unterschiedliche Dinge.');assert.equal(pairs.length,1);assert.equal(pairs[0].entry.term,'PoC und MVP');
});
test('New scripts parse and all learning aids are available in the offline cache',()=>{
 for(const name of ['glossary-examples.js','learning-support-data.js','learning-support.js'])new vm.Script(fs.readFileSync(path.join(root,name),'utf8'));
 const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 for(const name of ['glossary-examples.js','learning-support-data.js','learning-support.js','learning-support.css'])assert(sw.includes("'./"+name+"'"));
 assert(html.includes('LearningSupport.init(DATA,LearningSupportData)'));assert(sw.includes('thinkup-glossary-examples-v20'));
 assert(!fs.readFileSync(path.join(root,'learning-support.js'),'utf8').includes('localStorage'));
});
