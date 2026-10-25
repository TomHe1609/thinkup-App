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
  for(const [i,term] of lesson.learning.terms.entries()){assert.equal(entries[i].definition,term.definition);assert.equal(entries[i].term,term.term);assert(entries[i].examples.every(text=>text.length>30));count++}
 }
 assert.equal(count,255);
 for(const name of ['Normalisierung','Kardinalität','1NF','2NF','3NF','API'])assert(content.glossary.some(t=>t.term===name));
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
 for(const name of ['learning-support-data.js','learning-support.js'])new vm.Script(fs.readFileSync(path.join(root,name),'utf8'));
 const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 for(const name of ['learning-support-data.js','learning-support.js','learning-support.css'])assert(sw.includes("'./"+name+"'"));
 assert(html.includes('LearningSupport.init(DATA,LearningSupportData)'));assert(sw.includes('thinkup-learning-support-v19'));
 assert(!fs.readFileSync(path.join(root,'learning-support.js'),'utf8').includes('localStorage'));
});
