/* Additional learning tools. Existing app styles and content remain the source of truth. */
'use strict';
const StudyCore=(()=>{
 const DAY=86400000;
 const text=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/ß/g,'ss');
 const words=value=>text(value).match(/[a-z0-9]{3,}/g)||[];
 const stop=new Set(words('welche welcher welches warum einer einen einem eine diese dieser dieses wird werden sind kann beim durch nicht einem oder einer sowie fur und ist was wie das der die von mit'));
 const record=v=>v&&typeof v==='object'&&!Array.isArray(v);
 const time=n=>Number.isSafeInteger(n)&&n>=0&&n<=7258118400000;
 function catalog(data){return [...data.courseCards,...data.cards.map(c=>({...c,module:data.lessons.find(l=>l.id===c.lesson_id).module}))]}
 function rate(previous,rating,now){
  if(!['again','unsure','known'].includes(rating)||!time(now))throw Error('Ungültige Kartenbewertung');
  const streak=rating==='known'?Math.min(6,(previous?.streak||0)+1):0;
  const interval=rating==='again'?600000:rating==='unsure'?DAY:Math.min(60,3*2**(streak-1))*DAY;
  return {rating,last:now,due:now+interval,streak};
 }
 function normalize(value,out,data){
  const cards=new Set(catalog(data).map(c=>c.id)),lessons=new Set(data.lessons.map(l=>l.id));
  const questions=new Map(data.lessons.flatMap(l=>l.questions).map(q=>[q.id,q]));
  out.reviewCards={};out.favorites={};out.reading={};out.lastRead=null;out.daily=null;out.examHistory=[];
  if(record(value.reviewCards))for(const [id,r]of Object.entries(value.reviewCards))if(cards.has(id)&&record(r)&&['again','unsure','known'].includes(r.rating)&&time(r.last)&&time(r.due)&&r.due>=r.last&&Number.isInteger(r.streak)&&r.streak>=0&&r.streak<=6)out.reviewCards[id]={rating:r.rating,last:r.last,due:r.due,streak:r.streak};
  if(record(value.favorites))for(const [id,flag]of Object.entries(value.favorites))if(flag===true&&(cards.has(id)||lessons.has(id)))out.favorites[id]=true;
  if(record(value.reading))for(const [id,r]of Object.entries(value.reading))if(lessons.has(id)&&record(r)&&Number.isFinite(r.y)&&r.y>=0&&r.y<=1000000&&time(r.at))out.reading[id]={y:Math.round(r.y),at:r.at};
  if(record(value.lastRead)&&lessons.has(value.lastRead.id)&&time(value.lastRead.at))out.lastRead={id:value.lastRead.id,at:value.lastRead.at};
  const d=value.daily;
  if(record(d)&&/^\d{4}-\d{2}-\d{2}$/.test(d.day)&&Array.isArray(d.plan)&&d.plan.length<=10&&Number.isInteger(d.index)&&d.index>=0&&d.index<=d.plan.length){
   const valid=d.plan.every(p=>record(p)&&((p.kind==='card'&&cards.has(p.id))||(p.kind==='question'&&questions.has(p.id))||(p.kind==='learn'&&lessons.has(p.id))));
   if(valid&&new Set(d.plan.map(p=>p.kind+':'+p.id)).size===d.plan.length){
    const results={};
    if(record(d.results))for(const p of d.plan){const k=p.kind+':'+p.id,r=d.results[k];if(!record(r))continue;if(p.kind==='question'&&Number.isInteger(r.choice)&&r.choice>=0&&r.choice<questions.get(p.id).options.length)results[k]={choice:r.choice};else if(p.kind==='card'&&['again','unsure','known'].includes(r.rating))results[k]={rating:r.rating};else if(p.kind==='learn'&&r.read===true)results[k]={read:true};}
    const prefixComplete=d.plan.slice(0,d.index).every(p=>results[p.kind+':'+p.id]);
    if(prefixComplete)out.daily={day:d.day,plan:d.plan.map(p=>({kind:p.kind,id:p.id})),index:d.index,results};
   }
  }
  if(Array.isArray(value.examHistory))out.examHistory=value.examHistory.filter(r=>record(r)&&time(r.at)&&Array.isArray(r.modules)&&r.modules.every(m=>Number.isInteger(m)&&m>=1&&m<=9)&&Number.isInteger(r.total)&&r.total>0&&r.total<=50&&Number.isInteger(r.correct)&&r.correct>=0&&r.correct<=r.total&&Number.isInteger(r.seconds)&&r.seconds>=0&&r.seconds<=86400).slice(-20).map(r=>({at:r.at,modules:[...new Set(r.modules)],total:r.total,correct:r.correct,seconds:r.seconds}));
  return out;
 }
 function mix(array,seed){
  const out=[...array];let n=[...seed].reduce((h,c)=>(Math.imul(h,31)+c.charCodeAt(0))>>>0,17);
  for(let i=out.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[out[i],out[j]]=[out[j],out[i]]}return out;
 }
 function dailyPlan(data,progress,module,day,now,unlocked){
  const open=new Set(unlocked),cs=catalog(data),plan=[],seen=new Set();
  const add=(kind,id)=>{const key=kind+':'+id;if(plan.length<10&&!seen.has(key)){seen.add(key);plan.push({kind,id})}};
  const lessons=[...data.lessons.filter(l=>l.module===module),...data.lessons.filter(l=>l.module!==module)];
  const next=lessons.find(l=>open.has(l.id)&&!progress.done[l.id]);if(next)add('learn',next.id);
  const due=cs.filter(c=>progress.reviewCards[c.id]?.due<=now).sort((a,b)=>progress.reviewCards[a.id].due-progress.reviewCards[b.id].due);
  const wrong=mix(data.lessons.filter(l=>open.has(l.id)).flatMap(l=>l.questions).filter(q=>progress.wrong[q.id]),day+'wrong');
  for(let i=0;i<Math.max(due.length,wrong.length)&&plan.length<10;i++){if(i<6&&due[i])add('card',due[i].id);if(i<3&&wrong[i])add('question',wrong[i].id);if(i>=6)break;}
  const fresh=mix(cs.filter(c=>open.has(c.lesson_id)&&c.module===module&&!progress.reviewCards[c.id]),day+'new');
  for(const c of fresh){if(plan.filter(p=>p.kind==='card').length>=6)break;add('card',c.id)}
  const qs=mix(data.lessons.filter(l=>open.has(l.id)).flatMap(l=>l.questions),day+'questions');for(const q of qs)add('question',q.id);
  return plan;
 }
 function chapter(question,lesson){
  const manual={'1.1':[1,3,2],'1.2':[0,1,2],'2.9':[2,5,6,1,1,2,2,4,2,1,3,5,1]};
  const position=lesson.questions.findIndex(q=>q.id===question.id);if(manual[lesson.id]?.[position]!==undefined)return manual[lesson.id][position];
  const tokens=words(question.question+' '+(question.options?.[question.correct_index]||question.model_answer||'')+' '+(question.explanation||'')).filter(w=>!stop.has(w));
  let best=0,score=-1;lesson.learning.tutorial.chapters.forEach((c,i)=>{const title=text(c.title),body=text(c.paragraphs.join(' '));const n=tokens.reduce((sum,w)=>sum+(title.includes(w)?5:0)+(body.includes(w)?1:0),0);if(n>score){score=n;best=i}});return best;
 }
 function mini(question,lesson,data){
  const tokens=words(question.question+' '+(question.options?.[question.correct_index]||question.model_answer||'')+' '+(question.explanation||'')).filter(w=>!stop.has(w));
  const cards=data.courseCards.filter(c=>c.lesson_id===lesson.id&&text(c.front)!==text(question.question));
  const ranked=cards.map(c=>({c,score:tokens.reduce((n,w)=>n+(text(c.front+' '+c.answer).includes(w)?1:0),0)})).sort((a,b)=>b.score-a.score);
  if(ranked[0]?.score>0)return {prompt:ranked[0].c.displayFront||ranked[0].c.front,answer:ranked[0].c.answer};
  const p=lesson.practice[0];return p?{prompt:p.question,answer:p.model_answer}:{prompt:lesson.learning.selfCheck.question,answer:lesson.learning.selfCheck.answer};
 }
 function search(data,progress,query,{module='all',kind='all',favorites=false}={}){
  const terms=text(query).match(/[a-z0-9]+/g)||[],items=[];
  for(const l of data.lessons){const t=l.learning.tutorial;items.push({kind:'lesson',id:l.id,module:l.module,title:l.id+' · '+l.title,body:[t.opening,...t.chapters.flatMap(c=>c.paragraphs),...l.learning.terms.map(t=>t.term+' '+t.definition)].join(' ')})}
  for(const c of catalog(data))items.push({kind:'card',id:c.id,module:c.module,title:c.displayFront||c.front,body:c.answer,lesson_id:c.lesson_id});
  return items.filter(i=>(module==='all'||i.module===Number(module))&&(kind==='all'||i.kind===kind)&&(!favorites||progress.favorites[i.id])&&terms.every(t=>text('M'+String(i.module).padStart(2,'0')+' '+i.title+' '+i.body).includes(t))).sort((a,b)=>Number(!!progress.favorites[b.id])-Number(!!progress.favorites[a.id])||a.module-b.module||(a.kind===b.kind?0:a.kind==='lesson'?-1:1)||a.title.localeCompare(b.title,'de'));
 }
 function validateExam(value,data){
  if(!record(value)||!Array.isArray(value.ids)||!value.ids.length||value.ids.length>50||new Set(value.ids).size!==value.ids.length||!Array.isArray(value.answers)||value.answers.length!==value.ids.length||!time(value.started)||!(value.deadline===0||time(value.deadline)&&value.deadline>value.started)||!Number.isInteger(value.index)||value.index<0||value.index>=value.ids.length||typeof value.finished!=='boolean')return null;
  const map=new Map(data.lessons.flatMap(l=>l.questions).map(q=>[q.id,q]));
  if(!value.ids.every((id,i)=>map.has(id)&&(value.answers[i]===null||Number.isInteger(value.answers[i])&&value.answers[i]>=0&&value.answers[i]<map.get(id).options.length)))return null;
  return {ids:[...value.ids],answers:[...value.answers],started:value.started,deadline:value.deadline,index:value.index,finished:value.finished,ended:time(value.ended)?value.ended:0,reason:value.reason==='time'?'time':'submitted'};
 }
 function examResult(exam,data){const map=new Map(data.lessons.flatMap(l=>l.questions).map(q=>[q.id,q]));const rows=exam.ids.map((id,i)=>({question:map.get(id),choice:exam.answers[i],correct:exam.answers[i]===map.get(id).correct_index}));return {rows,total:rows.length,correct:rows.filter(r=>r.correct).length,unanswered:rows.filter(r=>r.choice===null).length};}
 return {DAY,text,rate,normalize,catalog,dailyPlan,chapter,mini,search,mix,validateExam,examResult};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=StudyCore;

const Study=(()=>{
 const EXAM_KEY='skillyr_learn_exam_session_v1';
 let exam=null,examTimer=null,readingTimer=null,readingTarget=null,restoring=false;
 let query='',searchModule='all',searchKind='all',onlyFavorites=false,searchLimit=30;
 let dailyRevealed=false,dailyPick=-1,miniExercise=null,miniDraft='',miniRevealed=false;
 const E=v=>escapeHTML(v),now=()=>Date.now();
 const card=id=>CARD_CATALOG.find(c=>c.id===id);
 const question=id=>DATA.lessons.flatMap(l=>l.questions).find(q=>q.id===id);
 const day=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
 const goto=page=>setPage(page);
 const favorite=id=>`<button type="button" class="quiet study-favorite" data-study-favorite="${E(id)}" aria-pressed="${!!progress.favorites[id]}">${progress.favorites[id]?'Gemerkt':'Merken'}</button>`;
 function normalize(value,out){return StudyCore.normalize(value,out,DATA)}
 function dueCount(){return Object.values(progress.reviewCards).filter(r=>r.due<=now()).length}
 function homeHTML(){
  const unfinished=progress.daily?.day===day()&&progress.daily.index<progress.daily.plan.length;
  const last=progress.lastRead&&isLessonUnlocked(progress.lastRead.id)?L(progress.lastRead.id):null;
  return `<section class="detail-section study-home"><h2 class="section-title">Deine Lernrunde</h2><p class="page-description">${dueCount()} Karten fällig · etwa 10 Minuten</p><button class="primary wide" id="studyToday">${unfinished?'Tagesrunde fortsetzen':'Heute lernen'}</button><div class="buttons study-tools"><button class="quiet" id="studySearch">Suchen & Merken</button><button class="quiet" id="studyExamSetup">${exam?(exam.finished?'Letzte Prüfungsrunde':'Prüfungsrunde fortsetzen'):'Prüfungsrunde'}</button></div>${last?`<button class="back study-resume" data-study-lesson="${E(last.id)}">Weiterlesen: ${moduleCode(last.module)} / ${E(last.id)}</button>`:''}</section>`;
 }
 function lessonTools(l){return `<div class="buttons study-lesson-tools">${favorite(l.id)}${progress.daily?.day===day()&&progress.daily.index<progress.daily.plan.length?'<button class="quiet" id="studyBackDaily">Zur Tagesrunde</button>':''}</div>`}
 function ratingHTML(id,mode='cards'){
  return `<div class="buttons study-ratings" role="group" aria-label="Wie sicher erinnerst du dich?"><button class="secondary" data-study-rate="again" data-study-card="${E(id)}" data-study-mode="${mode}">Nochmal</button><button class="secondary" data-study-rate="unsure" data-study-card="${E(id)}" data-study-mode="${mode}">Unsicher</button><button class="primary" data-study-rate="known" data-study-card="${E(id)}" data-study-mode="${mode}">Sicher</button></div><p class="cards-note">Nochmal: in 10 Minuten · Unsicher: morgen · Sicher: mit wachsendem Abstand.</p>`;
 }
 function cardTools(c){if(!c)return '';const r=progress.reviewCards[c.id];return `<section class="detail-section"><div class="row"><span class="small muted">${r?'Nächste Wiederholung: '+E(new Date(r.due).toLocaleString('de-DE',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})):'Noch nicht bewertet'}</span>${favorite(c.id)}</div>${current.flashRevealed?ratingHTML(c.id):'<p class="cards-note">Erinnere dich zuerst an die Antwort. Nach dem Umdrehen kannst du deine Sicherheit bewerten.</p>'}</section>`}
 function rateCard(id,rating,mode){
  const c=card(id);if(!c)return;
  if(mode==='daily'){
   const d=progress.daily,p=d?.plan[d.index];if(!dailyRevealed||p?.kind!=='card'||p.id!==id)return;
   d.results['card:'+id]={rating};d.index++;dailyRevealed=false;dailyPick=-1;
  }else{const active=moduleCards()[current.flashIndex];if(!current.flashRevealed||active?.id!==id)return;current.flashIndex=Math.min(moduleCards().length-1,current.flashIndex+1);current.flashRevealed=false;}
  progress.reviewCards[id]=StudyCore.rate(progress.reviewCards[id],rating,now());touchDay();save();render(false);
 }
 function captureReading(){
  if(restoring||current.page!=='lesson'||document.querySelector('.learning-dialog[open]'))return;
  const y=Math.max(0,Math.round(window.scrollY)),article=byId('content').querySelector('.learning-text');if(article?.getAttribute('aria-label')!=='Lerntext zu Lektion '+current.lesson)return;
  const at=now();progress.reading[current.lesson]={y,at};progress.lastRead={id:current.lesson,at};save();
 }
 function beforeNavigate(){clearTimeout(readingTimer);captureReading()}
 function afterRender(markTop){
  if(current.page!=='lesson'||!markTop)return;
  const id=current.lesson,target=readingTarget;readingTarget=null;restoring=true;
  requestAnimationFrame(()=>{if(current.page==='lesson'&&current.lesson===id){const el=Number.isInteger(target)?byId('content').querySelectorAll('.tutorial-chapter')[target]:null;if(el)el.scrollIntoView({block:'start',behavior:'instant'});else window.scrollTo({top:progress.reading[id]?.y||0,behavior:'instant'});}restoring=false;});
 }
 function openLesson(id,chapterIndex){if(!LESSON_IDS.has(id)||!isLessonUnlocked(id))return;beforeNavigate();readingTarget=Number.isInteger(chapterIndex)?chapterIndex:null;setPage('lesson',id)}
 function toggleFavorite(id){
  if(!LESSON_IDS.has(id)&&!card(id))return;if(progress.favorites[id])delete progress.favorites[id];else progress.favorites[id]=true;save();
  document.querySelectorAll('[data-study-favorite]').forEach(b=>{if(b.dataset.studyFavorite===id){b.setAttribute('aria-pressed',String(!!progress.favorites[id]));b.textContent=progress.favorites[id]?'Gemerkt':'Merken'}});if(current.page==='search')updateSearch();
 }
 function searchResults(){
  const found=StudyCore.search(DATA,progress,query,{module:searchModule,kind:searchKind,favorites:onlyFavorites});
  return `<p class="page-description" role="status">${found.length} ${found.length===1?'Treffer':'Treffer'}${onlyFavorites?' in deinen Favoriten':''}</p>${found.slice(0,searchLimit).map(item=>{
   const locked=item.kind==='lesson'&&!isLessonUnlocked(item.id);
   const terms=StudyCore.text(query).trim().split(/\s+/).filter(Boolean),needle=terms[0]||'',pos=needle?StudyCore.text(item.body).indexOf(needle):0;
   const start=Math.max(0,pos-50),snippet=item.body.slice(start,start+210);
   return `<article class="review-item study-result"><span>${moduleCode(item.module)} · ${item.kind==='lesson'?'Lerntext':'Lernkarte'}${locked?' · gesperrt':''}</span><p><strong>${E(item.title)}</strong></p><p class="small muted">${start?'…':''}${E(snippet)}${item.body.length>start+210?'…':''}</p><div class="buttons"><button class="secondary" ${item.kind==='lesson'?`data-study-lesson="${E(item.id)}"`:`data-study-open-card="${E(item.id)}"`} ${locked?'disabled':''}>${item.kind==='lesson'?'Lerntext öffnen':'Karte öffnen'}</button>${favorite(item.id)}</div></article>`;
  }).join('')||'<p class="empty">Keine passenden Inhalte gefunden. Ändere den Suchbegriff oder die Filter.</p>'}${found.length>searchLimit?'<button class="secondary wide" id="studyMoreResults">Mehr Ergebnisse</button>':''}`;
 }
 function searchHTML(){return `<button class="back" data-page="path">${plainIcon('arrow')} Zum Lernpfad</button><div class="eyebrow">NACHSCHLAGEN</div><h1 class="title">Suchen & Merken</h1><div class="field-group"><label for="studyQuery">Begriff suchen</label><input id="studyQuery" type="search" maxlength="120" value="${E(query)}" placeholder="Zum Beispiel Normalisierung"></div><div class="field-group"><label for="studySearchModule">Modul</label><select id="studySearchModule"><option value="all">Alle Module</option>${DATA.modules.map(m=>`<option value="${m.id}" ${String(searchModule)===String(m.id)?'selected':''}>${m.code}</option>`).join('')}</select></div><div class="field-group"><label for="studySearchKind">Inhalt</label><select id="studySearchKind"><option value="all" ${searchKind==='all'?'selected':''}>Lerntexte und Karten</option><option value="lesson" ${searchKind==='lesson'?'selected':''}>Lerntexte</option><option value="card" ${searchKind==='card'?'selected':''}>Lernkarten</option></select></div><label class="study-check"><input type="checkbox" id="studyOnlyFavorites" ${onlyFavorites?'checked':''}> Nur gemerkte Inhalte</label><div id="studySearchResults">${searchResults()}</div>`}
 function updateSearch(){searchLimit=30;const target=byId('studySearchResults');if(target)target.innerHTML=searchResults()}
 function openCard(id){const c=card(id);if(!c)return;beforeNavigate();current.module=c.module;progress.activeModule=c.module;setPage('cards');current.flashIndex=moduleCards().findIndex(item=>item.id===id);current.flashRevealed=false;save();render()}
 function startDaily(){
  beforeNavigate();LearningSupport.resetHints();
  const completedToday=progress.daily?.day===day()&&progress.daily.index===progress.daily.plan.length;
  if(completedToday&&dueCount()>0){
   const due=CARD_CATALOG.filter(c=>progress.reviewCards[c.id]?.due<=now()).sort((a,b)=>progress.reviewCards[a.id].due-progress.reviewCards[b.id].due).slice(0,10);
   progress.daily={day:day(),plan:due.map(c=>({kind:'card',id:c.id})),index:0,results:{}};save();
  }else if(progress.daily?.day!==day()){progress.daily={day:day(),plan:StudyCore.dailyPlan(DATA,progress,current.module,day(),now(),DATA.lessons.filter(l=>isLessonUnlocked(l.id)).map(l=>l.id)),index:0,results:{}};save()}
  dailyRevealed=false;dailyPick=-1;goto('daily');
 }
 function dailyHTML(){
  const d=progress.daily;if(!d)return '<div class="empty">Starte deine Tagesrunde im Lernpfad.</div>';
  const p=d.plan[d.index],head=`<button class="back" data-page="path">${plainIcon('arrow')} Zum Lernpfad</button><div class="eyebrow">DEINE TAGESRUNDE</div><h1 class="title">Heute lernen</h1><p class="page-description">${Math.min(d.index+1,d.plan.length)} / ${d.plan.length} Schritte · Fortschritt wird automatisch gespeichert.</p>`;
  if(!p){const answers=d.plan.filter(p=>p.kind==='question').map(p=>({q:question(p.id),r:d.results['question:'+p.id]}));return `${head}<section class="review-summary"><h2>Für heute geschafft!</h2><p>${d.plan.filter(p=>p.kind==='card').length} Karten wiederholt · ${answers.filter(a=>a.r?.choice===a.q.correct_index).length} / ${answers.length} Quizfragen richtig.</p><p class="body">Die neue Erklärung kannst du im Lernpfad mit ihrem eigenen Quiz weiterbearbeiten.</p><button class="primary wide" data-page="path">Zum Lernpfad</button></section>`}
  const result=d.results[p.kind+':'+p.id];
  if(p.kind==='learn'){const l=L(p.id),t=l.learning.tutorial;return `${head}<div class="eyebrow">NEUER LERNSTOFF · ${moduleCode(l.module)} / ${E(l.id)}</div><h2 class="section-title">${E(l.title)}</h2><div class="learning-text"><p>${E(t.opening)}</p><h2>${E(t.chapters[0].title)}</h2>${t.chapters[0].paragraphs.map(p=>`<p>${E(p)}</p>`).join('')}</div><div class="buttons"><button class="quiet" data-study-lesson="${E(l.id)}">Ganzen Lerntext lesen</button><button class="primary" id="studyDailyLearned">Weiter zur Übung</button></div>`}
  if(p.kind==='card'){const c=card(p.id),isCloze=c.type==='Lückentext'&&/\{\{c\d+::/.test(c.front||'');const content=isCloze?clozeCardHTML(c,dailyRevealed):E(dailyRevealed?c.answer:c.displayFront);return `${head}<div class="eyebrow">LERNKARTE · ${moduleCode(c.module)}</div><section class="surface flat"><p class="body study-card-text">${content}</p></section>${dailyRevealed?ratingHTML(c.id,'daily'):'<button class="primary wide" id="studyDailyFlip">Antwort ansehen</button>'}`}
  const q=question(p.id),chosen=result?result.choice:dailyPick;
  return `${head}<div class="eyebrow">QUIZ · ${moduleCode(L(q.lesson_id).module)} / ${E(q.lesson_id)}</div><h2 class="section-title">${E(q.question)}</h2>${q.options.map((option,i)=>`<button class="option ${result?(i===q.correct_index?'correct':i===chosen?'wrong':''):i===chosen?'selected':''}" data-study-daily-choice="${i}" ${result?'disabled':''}><span class="letter">${String.fromCharCode(65+i)}</span>${E(option)}</button>`).join('')}${result?`<section class="feedback ${chosen===q.correct_index?'good':'bad'}"><strong>${chosen===q.correct_index?'Richtig!':'Das schauen wir uns noch einmal an.'}</strong><p>${E(q.explanation)}</p>${chosen!==q.correct_index?helpButton(q):''}</section><button class="primary wide" id="studyDailyNext">Weiter</button>`:`<button class="primary wide" id="studyDailyConfirm" ${chosen<0?'disabled':''}>Antwort prüfen</button>`}`;
 }
 function advanceDaily(){const d=progress.daily;if(!d||!d.plan[d.index])return;d.index++;dailyRevealed=false;dailyPick=-1;save();render()}
 function confirmDaily(){
  const d=progress.daily,p=d?.plan[d.index];if(p?.kind!=='question'||d.results['question:'+p.id])return;const q=question(p.id),choice=dailyPick;if(choice<0||choice>=q.options.length)return;
  d.results['question:'+p.id]={choice};progress.attempts++;if(choice===q.correct_index){delete progress.wrong[q.id];if(!progress.correct[q.id]){progress.correct[q.id]=true;progress.xp+=10}}else progress.wrong[q.id]=true;touchDay();save();render(false);
 }
 function helpButton(q){return `<button type="button" class="quiet study-help" data-study-help="${E(q.id)}">Passende Erklärung & Miniübung</button>`}
 function activeQuestion(){if(current.page==='quiz')return current.session[current.question];if(current.page==='daily'){const p=progress.daily?.plan[progress.daily.index];return p?.kind==='question'?question(p.id):null}return null}
 function openHelp(id){
  const q=activeQuestion();if(!q||q.id!==id)return;const l=L(q.lesson_id),index=StudyCore.chapter(q,l);
  openLearningReference(l.id);const dialog=byId('learningDialog'),target=dialog.querySelectorAll('.tutorial-chapter')[index];
  miniExercise=StudyCore.mini(q,l,DATA);miniDraft='';miniRevealed=false;
  target.insertAdjacentHTML('afterend',`<section class="learning-section study-mini"><h2>Eine ähnliche Miniübung</h2><p>${E(miniExercise.prompt)}</p><label class="small" for="studyMiniDraft">Deine Erklärung in eigenen Worten</label><textarea id="studyMiniDraft" rows="3" maxlength="2000"></textarea><button type="button" class="secondary wide" id="studyMiniReveal" disabled>Musterantwort vergleichen</button><div id="studyMiniAnswer"></div><p class="cards-note">Diese Übung verändert deine ursprüngliche Quizantwort und ihre Bewertung nicht.</p><button class="quiet wide" data-learning-close>Zur laufenden Frage</button></section>`);
  dialog.scrollTop=Math.max(0,target.offsetTop-dialog.querySelector('.learning-dialog-head').offsetHeight-16);
 }
 function saveExam(){try{if(exam)sessionStorage.setItem(EXAM_KEY,JSON.stringify(exam));else sessionStorage.removeItem(EXAM_KEY)}catch{}}
 function clearSessions(){exam=null;clearInterval(examTimer);saveExam();dailyPick=-1;dailyRevealed=false}
 function examSetupHTML(){
  return `<button class="back" data-page="path">${plainIcon('arrow')} Zum Lernpfad</button><div class="eyebrow">GEMISCHT ÜBEN</div><h1 class="title">Prüfungsrunde</h1><p class="page-description">Multiple Choice aus freigegebenen Lektionen. Lösungen erscheinen erst am Ende. Diese Übungsrunde verändert keine Lektionsabschlüsse oder XP.</p><fieldset class="study-module-options"><legend>Module auswählen</legend>${DATA.modules.map(m=>`<label class="study-check"><input type="checkbox" name="studyExamModule" value="${m.id}" ${m.id===current.module?'checked':''}> ${m.code} · ${E(m.title)}</label>`).join('')}</fieldset><div class="field-group"><label for="studyExamCount">Fragenanzahl</label><select id="studyExamCount">${[5,10,20,30,50].map(n=>`<option ${n===10?'selected':''}>${n}</option>`).join('')}</select></div><div class="field-group"><label for="studyExamMinutes">Zeitlimit</label><select id="studyExamMinutes"><option value="0">Ohne Zeitlimit</option>${[1,5,10,20,30,45].map(n=>`<option value="${n}">${n} ${n===1?'Minute':'Minuten'}</option>`).join('')}</select></div><p class="page-description" id="studyExamAvailable" role="status"></p><button class="primary wide" id="studyExamStart">Runde starten</button><p class="cards-note">Vorhandene Übungsfragen, keine offizielle IHK-Prüfung. Bei weniger verfügbaren Fragen wird die Runde entsprechend kürzer.</p>${progress.examHistory.length?`<section class="detail-section"><h2 class="section-title">Letzte Runden</h2>${progress.examHistory.slice(-5).reverse().map(r=>`<p class="small">${E(new Date(r.at).toLocaleDateString('de-DE'))} · ${r.correct} / ${r.total} richtig · ${r.modules.map(m=>moduleCode(m)).join(', ')}</p>`).join('')}</section>`:''}`;
 }
 function selectedModules(){return [...document.querySelectorAll('[name="studyExamModule"]:checked')].map(el=>Number(el.value))}
 function examPool(modules){return DATA.lessons.filter(l=>modules.includes(l.module)&&isLessonUnlocked(l.id)).flatMap(l=>l.questions)}
 function updateExamAvailable(){const el=byId('studyExamAvailable');if(!el)return;const n=examPool(selectedModules()).length;el.textContent=n+' Fragen in freigegebenen Lektionen verfügbar.';byId('studyExamStart').disabled=n===0}
 function startExam(){
  const modules=selectedModules(),pool=examPool(modules),count=Number(byId('studyExamCount').value),minutes=Number(byId('studyExamMinutes').value);if(!pool.length||![5,10,20,30,50].includes(count)||![0,1,5,10,20,30,45].includes(minutes))return;
  const started=now(),shuffled=StudyCore.mix(pool,String(started)),selected=[];
  for(const m of StudyCore.mix(modules,String(started)+'modules')){const q=shuffled.find(q=>L(q.lesson_id).module===m);if(q&&selected.length<count)selected.push(q)}
  for(const q of shuffled)if(selected.length<count&&!selected.some(v=>v.id===q.id))selected.push(q);
  const ids=StudyCore.mix(selected,String(started)+'order').map(q=>q.id);exam={ids,answers:ids.map(()=>null),index:0,started,deadline:minutes?started+minutes*60000:0,finished:false,ended:0,reason:'submitted'};saveExam();goto('exam');startExamTimer();
 }
 function expired(){return exam&&!exam.finished&&exam.deadline>0&&now()>=exam.deadline}
 function checkExamTime(){if(expired())finishExam('time');else{const el=byId('studyExamTimer');if(el)el.textContent=timerText()}}
 function startExamTimer(){clearInterval(examTimer);if(exam&&!exam.finished&&exam.deadline)examTimer=setInterval(checkExamTime,1000)}
 function timerText(){if(!exam?.deadline)return 'Ohne Zeitlimit';const seconds=Math.max(0,Math.ceil((exam.deadline-now())/1000));return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0')}
 function finishExam(reason='submitted'){
  if(!exam||exam.finished)return;exam.finished=true;exam.ended=now();exam.reason=reason;clearInterval(examTimer);
  const result=StudyCore.examResult(exam,DATA);progress.examHistory.push({at:exam.ended,modules:[...new Set(result.rows.map(r=>L(r.question.lesson_id).module))],total:result.total,correct:result.correct,seconds:Math.min(86400,Math.max(0,Math.round((exam.ended-exam.started)/1000)))});progress.examHistory=progress.examHistory.slice(-20);save();saveExam();if(current.page==='exam')render();
 }
 function examHTML(){
  if(!exam)return '<div class="empty">Starte eine Prüfungsrunde im Lernpfad.</div>';
  if(exam.finished)return examResultsHTML();
  const q=question(exam.ids[exam.index]),choice=exam.answers[exam.index];
  return `<div class="quiz-shell"><div class="quiz-top"><button class="quiz-close" data-page="path" aria-label="Runde unterbrechen">×</button><span class="small">Frage ${exam.index+1} / ${exam.ids.length}</span><span class="small" id="studyExamTimer" role="timer">${timerText()}</span></div><div class="quiz-kicker">PRÜFUNGSRUNDE · ${moduleCode(L(q.lesson_id).module)}</div><section class="quiz-hero"><h1 class="quiz-question">${E(q.question)}</h1><p class="quiz-micro">Die Auswertung erscheint nach Abschluss der Runde.</p></section><div class="quiz-choices" role="group" aria-label="Antwortmöglichkeiten">${q.options.map((option,i)=>`<button class="quiz-choice ${choice===i?'selected':''}" data-study-exam-choice="${i}" aria-pressed="${choice===i}"><span class="choice-letter">${String.fromCharCode(65+i)}</span><span class="choice-text">${E(option)}</span></button>`).join('')}</div><div class="quiz-footer"><div class="buttons"><button class="secondary" id="studyExamPrev" ${exam.index===0?'disabled':''}>Zurück</button>${exam.index===exam.ids.length-1?'<button class="primary" id="studyExamFinish">Auswerten</button>':'<button class="primary" id="studyExamNext">Weiter</button>'}</div><p class="quiz-nag">${exam.answers.filter(v=>v!==null).length} / ${exam.ids.length} beantwortet · Antworten können bis zur Abgabe geändert werden.</p><button class="quiz-result-secondary" id="studyExamFinishEarly">Runde jetzt auswerten</button></div></div>`;
 }
 function examResultsHTML(){
  const result=StudyCore.examResult(exam,DATA),weak=[...new Set(result.rows.filter(r=>!r.correct).map(r=>r.question.lesson_id))];
  return `<div class="quiz-shell"><button class="back" data-page="path">${plainIcon('arrow')} Zum Lernpfad</button><div class="quiz-results"><h1>Deine Auswertung</h1><p class="quiz-results-desc">${exam.reason==='time'?'Das Zeitlimit ist abgelaufen.':'Die Runde ist abgeschlossen.'}</p><div class="quiz-result-stats"><div class="quiz-result-stat"><strong>${Math.round(result.correct/result.total*100)}%</strong><span>${result.correct} / ${result.total} richtig</span></div><div class="quiz-result-stat"><strong>${result.unanswered}</strong><span>unbeantwortet</span></div></div></div><section class="detail-section"><h2 class="section-title">Themen nacharbeiten</h2>${weak.length?weak.map(id=>`<button class="quiet wide study-result-link" data-study-lesson="${E(id)}">${moduleCode(L(id).module)} / ${E(id)} · ${E(L(id).title)}</button>`).join(''):'<p class="body">Alle Fragen dieser Runde richtig beantwortet.</p>'}${weak.length?'<button class="secondary wide" id="studyExamToReview">Fehler ins Fehlertraining übernehmen</button>':''}</section><section class="detail-section"><h2 class="section-title">Antworten und Erklärungen</h2>${result.rows.map((r,i)=>`<article class="review-item"><span>${i+1} · ${r.correct?'Richtig':r.choice===null?'Unbeantwortet':'Noch üben'}</span><p><strong>${E(r.question.question)}</strong></p><p>Deine Antwort: ${r.choice===null?'nicht beantwortet':E(r.question.options[r.choice])}</p><p>Richtige Antwort: ${E(r.question.options[r.question.correct_index])}</p><p class="body">${E(r.question.explanation)}</p></article>`).join('')}</section><button class="primary wide" id="studyExamNew">Neue Prüfungsrunde</button></div>`;
 }
 function init(){
  try{exam=StudyCore.validateExam(JSON.parse(sessionStorage.getItem(EXAM_KEY)),DATA)}catch{}
  if(exam&&!exam.finished){current.page='exam';if(expired())finishExam('time');else startExamTimer()}
  document.addEventListener('click',e=>{
   const b=e.target.closest('button');if(!b||b.disabled)return;
   if(b.dataset.studyFavorite){toggleFavorite(b.dataset.studyFavorite);return}
   if(b.dataset.studyLesson){openLesson(b.dataset.studyLesson);return}
   if(b.dataset.studyOpenCard){openCard(b.dataset.studyOpenCard);return}
   if(b.dataset.studyRate){rateCard(b.dataset.studyCard,b.dataset.studyRate,b.dataset.studyMode);return}
   if(b.dataset.studyHelp){openHelp(b.dataset.studyHelp);return}
   if(b.dataset.studyDailyChoice!==undefined){const p=progress.daily?.plan[progress.daily.index];if(p?.kind==='question'&&!progress.daily.results['question:'+p.id]){dailyPick=Number(b.dataset.studyDailyChoice);render(false)}return}
   if(b.dataset.studyExamChoice!==undefined){if(!exam||exam.finished)return;if(expired()){finishExam('time');return}const i=Number(b.dataset.studyExamChoice),q=question(exam.ids[exam.index]);if(Number.isInteger(i)&&i>=0&&i<q.options.length){exam.answers[exam.index]=i;saveExam();render(false)}return}
   switch(b.id){
    case 'studyToday':startDaily();break;
    case 'studyBackDaily':goto('daily');break;
    case 'studySearch':goto('search');break;
    case 'studyMoreResults':searchLimit+=30;byId('studySearchResults').innerHTML=searchResults();break;
    case 'studyDailyFlip':dailyRevealed=true;render(false);break;
    case 'studyDailyLearned':{const d=progress.daily,p=d?.plan[d.index];if(p?.kind==='learn'){d.results['learn:'+p.id]={read:true};advanceDaily()}break}
    case 'studyDailyConfirm':confirmDaily();break;
    case 'studyDailyNext':{const d=progress.daily,p=d?.plan[d.index];if(p&&d.results[p.kind+':'+p.id])advanceDaily();break}
    case 'studyMiniReveal':if(miniExercise&&miniDraft.trim().length>=3&&!miniRevealed){miniRevealed=true;byId('studyMiniAnswer').innerHTML=`<h3>Musterantwort</h3><p>${E(miniExercise.answer)}</p>`;b.disabled=true}break;
    case 'studyExamSetup':if(exam){goto('exam');checkExamTime();startExamTimer()}else goto('examSetup');break;
    case 'studyExamStart':startExam();break;
    case 'studyExamPrev':if(exam&&!exam.finished){if(expired())finishExam('time');else{exam.index=Math.max(0,exam.index-1);saveExam();render()}}break;
    case 'studyExamNext':if(exam&&!exam.finished){if(expired())finishExam('time');else{exam.index=Math.min(exam.ids.length-1,exam.index+1);saveExam();render()}}break;
    case 'studyExamFinish':case 'studyExamFinishEarly':finishExam(expired()?'time':'submitted');break;
    case 'studyExamNew':exam=null;saveExam();goto('examSetup');break;
    case 'studyExamToReview':if(exam?.finished){for(const row of StudyCore.examResult(exam,DATA).rows)if(!row.correct)progress.wrong[row.question.id]=true;save();b.disabled=true;b.textContent='Ins Fehlertraining übernommen'}break;
   }
  });
  document.addEventListener('input',e=>{if(e.target.id==='studyQuery'){query=e.target.value.slice(0,120);updateSearch()}if(e.target.id==='studyMiniDraft'){miniDraft=e.target.value;const b=byId('studyMiniReveal');if(b)b.disabled=miniDraft.trim().length<3||miniRevealed}});
  document.addEventListener('change',e=>{if(e.target.id==='studySearchModule'){searchModule=e.target.value;updateSearch()}if(e.target.id==='studySearchKind'){searchKind=e.target.value;updateSearch()}if(e.target.id==='studyOnlyFavorites'){onlyFavorites=e.target.checked;updateSearch()}if(e.target.name==='studyExamModule')updateExamAvailable()});
  window.addEventListener('scroll',()=>{if(current.page==='lesson'&&!restoring){clearTimeout(readingTimer);readingTimer=setTimeout(captureReading,400)}},{passive:true});
  window.addEventListener('pagehide',captureReading);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)captureReading();checkExamTime()});
 }
 return {normalize,homeHTML,lessonTools,cardTools,captureReading,beforeNavigate,afterRender,searchHTML,dailyHTML,helpButton,examSetupHTML,examHTML,updateExamAvailable,clearSessions,init};
})();
