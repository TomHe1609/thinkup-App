const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),themes=require('../appearance-palettes.json').themes,html=fs.readFileSync(path.join(root,'index.html'),'utf8'),css=fs.readFileSync(path.join(root,'appearance.css'),'utf8');
const lum=hex=>{const channels=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722};
const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
test('Six colour families each provide a dark and light presentation, retaining the four existing IDs',()=>{
 assert.equal(themes.length,6);assert.equal(new Set(themes.map(t=>t.id)).size,6);
 assert.deepEqual(themes.slice(0,4).map(t=>t.id),['violet','petrol','blue','apricot']);
 assert.deepEqual(themes.slice(4).map(t=>t.id),['forest','rose']);
 assert.equal(new Set(themes.map(t=>t.light.name)).size,6);
 for(const t of themes){assert.ok(t.dark.name&&t.light.name);assert.ok(css.includes(`:root[data-color-mode="light"][data-theme="${t.id}"]`));}
});
test('Every generated palette supplies all existing colour tokens so no dark surface leaks into light mode',()=>{
 const base=html.match(/:root\{(--c-[^}]+)\}/)[1];const names=[...base.matchAll(/--c-([0-9a-f]{6,8}):/g)].map(m=>m[1]);assert.ok(names.length>500);
 for(const t of themes)for(const mode of ['dark','light']){
  if(mode==='dark'&&!['forest','rose'].includes(t.id))continue;
  const selector=mode==='light'?`:root[data-color-mode="light"][data-theme="${t.id}"]`:`:root[data-theme="${t.id}"]`;
  const body=css.slice(css.indexOf(selector)+selector.length+1).split('}')[0];
  for(const name of names)assert.ok(body.includes('--c-'+name+':'),`${mode} ${t.id}: missing ${name}`);
 }
});
test('New light text, secondary text and primary actions provide at least 4.5:1 contrast',()=>{
 for(const t of themes){const p=t.light;for(const [fg,bg]of [[p.ink,p.bg],[p.ink,p.panel],[p.muted,p.bg],[p.muted,p.panel],[p.actionText,p.action],[p.accent,p.bg]])assert.ok(contrast(fg,bg)>=4.5,`${t.id}: ${fg} on ${bg} = ${contrast(fg,bg)}`);}
 for(const t of themes.slice(4))assert.ok(contrast(t.dark.actionText,t.dark.action)>=4.5);
 for(const [fg,bg]of [['#1b5737','#e5f5ec'],['#8b263e','#fce9ed']])assert.ok(contrast(fg,bg)>=4.5);
});
test('Appearance preferences remain separate from learning progress and offline assets include the new stylesheet',()=>{
 assert.ok(html.includes("const MODE_KEY='skillyr_learn_mode_v1'"));assert.ok(html.includes("const THEME_KEY='skillyr_learn_theme_v1'"));
 assert.ok(html.includes('Object.hasOwn(backgrounds,saved)'));
 assert.ok(html.includes('name="appMode" value="light"'));
 assert.equal((html.match(/name="appTheme" value=/g)||[]).length,6);
 assert.ok(html.includes('<link rel="stylesheet" href="appearance.css">'));
 assert.ok(fs.readFileSync(path.join(root,'sw.js'),'utf8').includes("'./appearance.css'"));
});
