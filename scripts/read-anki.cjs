'use strict';
const fs=require('node:fs');
// Strict independent reader. A physical newline inside quotes is field content.
function readAnki(bytes){
 let text=new TextDecoder('utf-8',{fatal:true}).decode(bytes),offset=0,line=1;
 const headers={};
 while(text[offset]==='#'){
  let end=text.indexOf('\n',offset);if(end<0)end=text.length;
  const entry=text.slice(offset+1,end).replace(/\r$/,'');const colon=entry.indexOf(':');
  if(colon<1||Object.hasOwn(headers,entry.slice(0,colon)))throw Error('Invalid header');
  headers[entry.slice(0,colon)]=entry.slice(colon+1);offset=end+1;line++;
 }
 if(headers.separator!=='tab'||headers.html!=='true'||headers['deck column']!=='1'||headers['tags column']!=='4')throw Error('Unsupported Anki header');
 const records=[];
 while(offset<text.length){
  const fields=[],start=line;
  while(true){
   let value='';
   if(text[offset]==='"'){
    offset++;let closed=false;
    while(offset<text.length){
     const ch=text[offset++];
     if(ch==='"'){
      if(text[offset]==='"'){value+='"';offset++;}else{closed=true;break;}
     }else{value+=ch;if(ch==='\n')line++;}
    }
    if(!closed)throw Error('Unterminated quoted field');
   }else{
    while(offset<text.length&&!['\t','\r','\n'].includes(text[offset])){
     if(text[offset]==='"')throw Error('Quote inside unquoted field');
     value+=text[offset++];
    }
   }
   fields.push(value);
   const next=text[offset];
   if(next==='\t'){offset++;continue;}
   if(next===undefined||next==='\n'||next==='\r'){
    records.push({fields,sourceLines:[start,line]});
    if(next==='\r'){offset++;if(text[offset]==='\n')offset++;line++;}
    else if(next==='\n'){offset++;line++;}
    if(fields.length!==4)throw Error('Expected four fields at line '+start);
    break;
   }
   throw Error('Unexpected character after quoted field at line '+line);
  }
 }
 return {headers,records};
}
module.exports={readAnki};
if(require.main===module){const parsed=readAnki(fs.readFileSync(process.argv[2]));process.stdout.write(JSON.stringify(parsed,null,2)+'\n');}
