const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
const {readAnki}=require('../scripts/read-anki.cjs');
const root=path.join(__dirname,'..'),D=require('../data-m01-m09.json');
const source=fs.readFileSync(path.join(root,'imports/skillyr-lernkarten.anki.txt'));
const parsed=readAnki(source),hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const base=file=>cp.execFileSync('git',['show','780956e992f9aa908ae11460b5bae5143f178bbe:'+file],{cwd:root,maxBuffer:10000000,encoding:'utf8'}).replace(/\r\n/g,'\n');
test('Independent TSV reader reproduces every original module/front/back/tag field and physical record boundary',()=>{
 assert.equal(hash(source),'069ccbdb5d0d1a09dd022871de48b8eb5e93bcc75498ca88683bc51c814598b7');
 assert.equal(parsed.records.length,521);assert.equal(D.courseCards.length,521);assert.equal(D.cards.length,0);
 assert.equal(new Set(D.courseCards.map(c=>c.id)).size,521);
 assert.deepEqual(Array.from({length:9},(_,i)=>D.courseCards.filter(c=>c.module===i+1).length),[37,84,82,71,54,60,50,40,43]);
 assert.equal(parsed.records.filter(r=>r.sourceLines[0]!==r.sourceLines[1]).length,265);
 parsed.records.forEach(({fields,sourceLines},i)=>{
  const c=D.courseCards[i];assert.deepEqual([c.deck,c.frontHtml,c.backHtml,c.tagsRaw],fields,'record '+(i+1));
  assert.deepEqual(c.sourceLines,sourceLines);assert.equal(c.sourceRecord,i+1);
  assert.equal(c.frontSha256,hash(fields[1]));assert.equal(c.backSha256,hash(fields[2]));
  assert.deepEqual(c.tags,fields[3].split(/\s+/));assert.equal(c.moduleCode,fields[0].split('::')[1].slice(0,3));
  assert.equal(c.originalBackExtracted,true);assert.equal(c.sourceFormat,'anki-tsv-html');
 });
});
test('TSV quoting handles embedded tabs, escaped quotes, CRLF, blank/comment-like cell lines and UTF-8 without splitting records',()=>{
 const headers='#separator:tab\r\n#html:true\r\n#deck column:1\r\n#tags column:4\r\n';
 const fields=['Skillyr::M01 – Übung','<p>"Frage"</p>','<pre>\tA\r\n\r\n# kein Header\r\n😀 &amp; ä</pre>','modul-01 test'];
 const row=fields.map(s=>'"'+s.replaceAll('"','""')+'"').join('\t');
 assert.deepEqual(readAnki(Buffer.from(headers+row+'\r\n')).records[0].fields,fields);
 for(const bad of ['"deck"\t"unclosed','"deck"oops\tq\ta\tt','deck\tq\ta','deck\tq\ta\tt\textra'])assert.throws(()=>readAnki(Buffer.from(headers+bad)));
 assert.throws(()=>readAnki(Buffer.concat([Buffer.from(headers),Buffer.from([0xff])])));
});
test('Learning paths, all quizzes, supporting lesson explanations and existing visual styles are unchanged',()=>{
 const old=JSON.parse(base('data-m01-m09.json'));
 assert.deepEqual(D.lessons,old.lessons);assert.deepEqual(D.lessonReferenceCards,old.courseCards);
 assert.deepEqual(D.modules.map(({cardCount,...m})=>m),old.modules.map(({cardCount,...m})=>m));
 assert.deepEqual(D.courseCards.map(c=>({id:c.id,lesson:c.lesson_id,module:c.module,number:c.number})),old.courseCards.map(c=>({id:c.id,lesson:c.lesson_id,module:c.module,number:c.number})));
 for(const file of ['appearance.css','learning-support.css','learning-support.js','learning-support-data.js','glossary-examples.js','ui-glass.css','data-m02.json','data-m01-m05.json'])assert.equal(fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n'),base(file),file);
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const style=s=>[...s.matchAll(/<style[^>]*>[\s\S]*?<\/style>/g)].map(m=>m[0]);
 assert.deepEqual(style(html),style(base('index.html')));
 for(const pattern of [/<header>[\s\S]*?<\/header>/,/<nav class="bottomnav"[\s\S]*?<\/nav>/])assert.equal(html.match(pattern)[0],base('index.html').match(pattern)[0]);
});
test('All original edge cases remain literal and differently answered cross-module questions stay separate',()=>{
 const special=D.courseCards[170];assert(special.frontHtml.includes('{{c2::type(scope): description}}'));assert(special.backHtml.includes('{{c2::type(scope): description}}'));
 for(const [a,b]of [[80,156],[103,158],[106,157]]){assert.equal(D.courseCards[a-1].frontHtml,D.courseCards[b-1].frontHtml);assert.notEqual(D.courseCards[a-1].backHtml,D.courseCards[b-1].backHtml);assert.notEqual(D.courseCards[a-1].module,D.courseCards[b-1].module);}
 for(const i of [172,350])assert(D.courseCards[i-1].front.includes('..______'));
 assert(D.courseCards[389].front.includes('steht für ---'));
});
