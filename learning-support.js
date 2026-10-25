'use strict';
const LearningSupportCore=(()=>{
 const key=value=>String(value).normalize('NFC').toLocaleLowerCase('de-DE');
 const quote=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 function catalog(lesson,content){
  const common=content.glossary,entries=[];
  for(const [i,term] of lesson.learning.terms.entries()){
   const aliases=[term.term,...(content.aliases[term.term]||[])];
   const extra=common.find(item=>aliases.some(alias=>key(alias)===key(item.term)));
   entries.push({id:lesson.id+':'+i,term:term.term,definition:term.definition,aliases:[...new Set([...aliases,...(extra?.aliases||[])])],examples:extra?[extra.example]:lesson.learning.example.steps,lessonId:lesson.id});
  }
  for(const [i,term] of common.entries())entries.push({...term,id:'common:'+i,aliases:[term.term,...(term.aliases||[])],examples:[term.example]});
  return entries;
 }
 function matcher(entries){
  const aliases=new Map();
  for(const entry of entries)for(const alias of entry.aliases)if(!aliases.has(key(alias)))aliases.set(key(alias),{entry,alias});
  const choices=[...aliases.keys()].sort((a,b)=>b.length-a.length).map(quote);
  const pattern=new RegExp('(^|[^\\p{L}\\p{N}_])('+choices.join('|')+')(?=$|[^\\p{L}\\p{N}_])','giu');
  return text=>{pattern.lastIndex=0;const seen=new Set(),found=[];for(const match of text.matchAll(pattern)){const {entry,alias}=aliases.get(key(match[2]));if(/^[A-Z][A-Z0-9]{1,5}$/.test(alias)&&match[2]!==alias)continue;if(seen.has(entry.id))continue;seen.add(entry.id);const start=match.index+match[1].length;found.push({start,end:start+match[2].length,entry})}return found};
 }
 return {catalog,matcher,key};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=LearningSupportCore;

const LearningSupport=(()=>{
 let course,content,returnTarget;
 const catalogs=new Map(),matchers=new Map(),entriesById=new Map(),stages=new Map();
 const E=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function getCatalog(lessonId){
  if(!catalogs.has(lessonId)){const lesson=course.lessons.find(l=>l.id===lessonId);if(!lesson)return [];
   const entries=LearningSupportCore.catalog(lesson,content);catalogs.set(lessonId,entries);matchers.set(lessonId,LearningSupportCore.matcher(entries));entries.forEach(entry=>entriesById.set(entry.id,entry));
  }
  return catalogs.get(lessonId);
 }
 function termButton(text,entry){
  const button=document.createElement('button');button.type='button';button.className='support-term';button.textContent=text;
  button.dataset.supportTerm=entry.id;button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','supportTermDialog');button.setAttribute('aria-label',text+' erklären');return button;
 }
 function decorate(scope,lessonId){
  const entries=getCatalog(lessonId);if(!entries.length)return;
  const match=matchers.get(lessonId);
  for(const article of scope.querySelectorAll('.learning-text:not([data-support-decorated])')){
   article.dataset.supportDecorated='true';const nodes=[],counts=new Map();
   const walker=document.createTreeWalker(article,NodeFilter.SHOW_TEXT,{acceptNode:node=>node.parentElement.closest('button,a,summary,pre,code,dt,dd,h1,h2,h3,script,style')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
   while(walker.nextNode())nodes.push(walker.currentNode);
   for(const node of nodes){
    const found=match(node.textContent).filter(({entry})=>(counts.get(entry.id)||0)<3);if(!found.length)continue;
    const fragment=document.createDocumentFragment();let end=0;
    for(const item of found){fragment.append(document.createTextNode(node.textContent.slice(end,item.start)),termButton(node.textContent.slice(item.start,item.end),item.entry));end=item.end;counts.set(item.entry.id,(counts.get(item.entry.id)||0)+1)}
    fragment.append(document.createTextNode(node.textContent.slice(end)));node.replaceWith(fragment);
   }
   for(const [i,dt] of [...article.querySelectorAll('.learning-terms dt')].entries()){
    const entry=entries[i];if(entry)dt.replaceChildren(termButton(dt.textContent,entry));
   }
  }
 }
 function openTerm(button){
  const entry=entriesById.get(button.dataset.supportTerm);if(!entry)return;
  const dialog=document.getElementById('supportTermDialog');if(dialog.open)return;
  returnTarget=button;document.getElementById('supportTermTitle').textContent=entry.term;
  document.getElementById('supportTermDefinition').textContent=entry.definition;
  document.getElementById('supportTermExampleTitle').textContent=entry.lessonId&&entry.examples.length>1?'Praxisbeispiel aus dieser Lektion':'Ein Beispiel';
  const example=document.getElementById('supportTermExample');example.replaceChildren();
  for(const text of entry.examples){const p=document.createElement('p');p.textContent=text;example.append(p)}
  dialog.showModal();dialog.scrollTop=0;
 }
 function hintMarkup(question){
  const pair=content.hints[question.id];if(!pair)return '';
  const stage=stages.get(question.id)||0;
  return `<section class="support-hints" aria-label="Freiwillige Hinweise" data-support-hints="${E(question.id)}"><div class="support-hint-copy" aria-live="polite" aria-atomic="true">${stage>=1?`<h2>1 · Denkansatz</h2><p>${E(pair[0])}</p>`:''}${stage>=2?`<h2>2 · Beispiel</h2><p>${E(pair[1])}</p>`:''}</div>${stage<2?`<button type="button" class="quiet support-hint-button" data-support-hint="${E(question.id)}">${stage===0?'Hinweis 1: Denkansatz anzeigen':'Hinweis 2: Beispiel anzeigen'}</button>`:'<p class="support-hint-end">Übertrage den Gedanken jetzt auf deine Aufgabe.</p>'}</section>`;
 }
 function activeQuestion(){
  if(current.page==='quiz')return current.answer===-1?current.session[current.question]:null;
  if(current.page==='daily'){const d=progress.daily,item=d?.plan[d.index];if(item?.kind==='question'&&!d.results['question:'+item.id])return course.lessons.flatMap(l=>l.questions).find(q=>q.id===item.id)}
  return null;
 }
 function showHint(button){
  const q=activeQuestion();if(!q||q.id!==button.dataset.supportHint)return;
  const section=button.closest('[data-support-hints]');if(!section)return;
  stages.set(q.id,Math.min(2,(stages.get(q.id)||0)+1));
  const template=document.createElement('template');template.innerHTML=hintMarkup(q);const next=template.content.firstElementChild;
  const copy=section.querySelector('.support-hint-copy');copy.innerHTML=next.querySelector('.support-hint-copy').innerHTML;
  for(const child of [...section.children])if(child!==copy)child.remove();
  for(const child of [...next.children])if(!child.classList.contains('support-hint-copy'))section.append(child);
  const focus=section.querySelector('button')||copy;focus.tabIndex=focus.tagName==='BUTTON'?0:-1;focus.focus({preventScroll:true});
 }
 function afterRender(){
  let lessonId=current.lesson;
  if(current.page==='daily'){const item=progress.daily?.plan[progress.daily.index];if(item?.kind==='learn')lessonId=item.id}
  decorate(document.getElementById('content'),lessonId);
  const question=activeQuestion();if(!question)return;
  const hero=document.querySelector('#content .quiz-hero');
  if(current.page==='quiz'&&hero)hero.insertAdjacentHTML('afterend',hintMarkup(question));
  if(current.page==='daily')document.getElementById('studyDailyConfirm')?.insertAdjacentHTML('beforebegin',hintMarkup(question));
 }
 function init(data,aids){
  course=data;content=aids;
  const dialog=document.getElementById('supportTermDialog');
  dialog.addEventListener('close',()=>{if(returnTarget?.isConnected)returnTarget.focus({preventScroll:true});returnTarget=null});
  document.addEventListener('click',event=>{const button=event.target.closest('button');if(!button||button.disabled)return;
   if(button.hasAttribute('data-support-term'))openTerm(button);
   if(button.hasAttribute('data-support-close'))dialog.close();
   if(button.hasAttribute('data-support-hint'))showHint(button);
  });
 }
 return {init,decorate,afterRender,resetHints:()=>stages.clear()};
})();
