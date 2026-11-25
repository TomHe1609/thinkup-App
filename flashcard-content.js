/* Render the imported fields as inert HTML, retaining lists, tables and code. */
'use strict';
const FlashcardContent=(()=>{
 const allowed=new Set('p br strong em b i u s ol ul li table thead tbody tfoot tr th td pre code blockquote'.split(' '));
 const drop=new Set('script style iframe object embed svg math form template'.split(' '));
 function html(card,revealed){
  const parsed=new DOMParser().parseFromString(revealed?card.backHtml:card.frontHtml,'text/html');
  const clean=document.createElement('div');
  function copy(node,parent){
   if(node.nodeType===3){parent.appendChild(document.createTextNode(node.textContent));return;}
   if(node.nodeType!==1||drop.has(node.localName))return;
   const target=allowed.has(node.localName)?document.createElement(node.localName):parent;
   if(target!==parent)parent.appendChild(target);
   // No source attributes are required by this collection.
   for(const child of node.childNodes)copy(child,target);
  }
  for(const node of parsed.body.childNodes)copy(node,clean);
  return clean.innerHTML;
 }
 return {html};
})();
