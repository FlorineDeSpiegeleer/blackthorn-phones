const META=window.BLACKTHORN_META||{caseEvidence:{},evidenceLabels:{},puzzleGates:{}};
const root=document.getElementById('projector');
const syncChannel=('BroadcastChannel' in window)?new BroadcastChannel('blackthorn-v63-sync'):null;
let SCENES=[],i=Number(localStorage.getItem('bt-proj-scene')||0);
const IMAGES={
 S00:'assets/florine/photos/Rainy-Gothic-Manor-Arrival.png',
 S01:'assets/sam/photos/Cozy-Candlelit-Academy-Bedchamber.png',
 S02:'assets/sam/photos/Cosy-Gothic-Library-Study-Retreat.png',
 S03:'assets/sam/photos/Cozy-Candlelit-Academy-Bedchamber.png',
 S04:'assets/florine/photos/Rainy-Gothic-Manor-Arrival.png',
 S05:'assets/sam/photos/Candlelit-Gothic-Masquerade-Ball.png',
 S06:'assets/maxine/photos/Gothic-Corridor-Selfie-with-Antique-Books.png',
 S06A:'assets/sam/photos/Candlelit-Gothic-Hall-Selfie.png',
 S07:'assets/sam/photos/Cozy-Candlelit-Academy-Bedchamber.png',
 S08:'assets/sam/photos/Candlelit-Gothic-Hall-Selfie.png',
 S10:'assets/sam/photos/Cosy-Gothic-Library-Study-Retreat.png',
 S11:'assets/florine/photos/Golden-Hour-at-the-Gothic-Academy---Copy.png',
 S12A:'assets/maxine/photos/Gothic-Corridor-Selfie-with-Antique-Books.png',
 S12B:'assets/maxine/photos/Cosy-Gothic-Library-Study-Retreat.png',
 S12C:'assets/maxine/photos/Gothic-Corridor-Selfie-with-Antique-Books.png',
 S13:'assets/sam/photos/Cosy-Gothic-Library-Study-Retreat.png',
 S14:'assets/maxine/photos/Gothic-Corridor-Selfie-with-Antique-Books.png',
 S16:'assets/florine/photos/Rainy-Gothic-Manor-Arrival.png',
 S16A:'assets/florine/photos/Rainy-Gothic-Manor-Arrival.png',
 S16B:'assets/florine/photos/Rainy-Gothic-Manor-Arrival.png',
 S17:'assets/sam/photos/Cozy-Candlelit-Academy-Bedchamber.png',
 S18:'assets/sam/photos/Cosy-Gothic-Library-Study-Retreat.png',
 S20:'assets/maxine/photos/Gothic-Corridor-Selfie-with-Antique-Books.png',
 S22:'assets/maxine/photos/Gothic-Corridor-Selfie-with-Antique-Books.png',
 S23:'assets/maxine/photos/Gothic-Corridor-Selfie-with-Antique-Books.png',
 S24A:'assets/maxine/photos/Gothic-Corridor-Selfie-with-Antique-Books.png',
 S24B:'assets/florine/photos/Rainy-Gothic-Manor-Arrival.png',
 S24C:'assets/sam/photos/Cosy-Gothic-Library-Study-Retreat.png',
 S26:'assets/maxine/photos/Gothic-Corridor-Selfie-with-Antique-Books.png',
 S27:'assets/maxine/photos/Gothic-Corridor-Selfie-with-Antique-Books.png',
 S29:'assets/florine/photos/Golden-Hour-at-the-Gothic-Academy---Copy.png',
 S30:'assets/sam/photos/Cozy-Candlelit-Academy-Bedchamber.png'
};
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function split(s){return String(s||'').split('||').map(x=>x.trim()).filter(Boolean)}
function arrows(s){return split(s).map(x=>{const a=x.split('->');return{label:(a.shift()||'').trim(),reply:a.join('->').trim()}})}
function owned(){try{return JSON.parse(localStorage.getItem('bt-owned-evidence')||'[]')}catch{return[]}}
function addEvidence(ids){const set=new Set(owned());ids.forEach(x=>set.add(x));localStorage.setItem('bt-owned-evidence',JSON.stringify([...set]));syncChannel?.postMessage({type:'evidence',ids:[...set]})}
function gateReady(m){const g=META.puzzleGates[m];if(!g)return true;const set=new Set(owned());return(g.all||[]).every(x=>set.has(x))&&(!(g.any||[]).length||(g.any||[]).some(a=>a.every(x=>set.has(x))))}
function flowIds(s){return String(s.phone_flow_ids||'').split('|').map(x=>x.trim()).filter(Boolean)}
function effectiveWindow(s){
  if(s.window)return s.window;
  const ids=flowIds(s);
  if(ids.includes('P036'))return 'B23';
  if(ids.some(x=>['P025','P026A','P026B','P026C'].includes(x)))return 'HAZARD';
  return '';
}
function unlockThroughScene(){
  const ids=new Set();
  for(let n=0;n<=i;n++)flowIds(SCENES[n]).forEach(x=>ids.add(x));
  ids.add('P001');
  localStorage.setItem('bt-unlocked-flows',JSON.stringify([...ids]));
}
function syncStage(s){
  localStorage.setItem('bt-global-stage',s.stage);
  localStorage.setItem('bt-global-window',effectiveWindow(s));
  unlockThroughScene();
  syncChannel?.postMessage({type:'stage',stage:s.stage,window:effectiveWindow(s)});
}
function maxineState(){try{return JSON.parse(localStorage.getItem('blackthorn-state-maxine')||'{}')}catch{return{}}}
function resolveB23(){
  const st=maxineState(),t=Number(st.theo_engagement||0),a=Number(st.adrian_engagement||0);
  if(Math.abs(t-a)>=2&&!st.b23_route){st.b23_route=t>a?'Theo':'Adrian';localStorage.setItem('blackthorn-state-maxine',JSON.stringify(st))}
  return st.b23_route||'';
}
function readyStatus(s){
  const w=effectiveWindow(s); if(!w||!/^W\d/.test(w))return '';
  const chars=['florine','sam','maxine'];
  const count=chars.filter(k=>localStorage.getItem('bt-ready-'+w+'-'+k)==='1').length;
  return `${count}/3 KLAAR`;
}
function safeText(s){
  const v=String(s||'');
  if(/(?:FINAL_REVEAL_BLOCK|PRIVATE_CONSEQUENCE_BLOCK|_GM_\d+)/.test(v))return '';
  return v;
}
function bg(s){return '../'+(IMAGES[s.scene_id]||'assets/florine/photos/Rainy-Gothic-Manor-Arrival.png')}
function save(){localStorage.setItem('bt-proj-scene',String(i))}
function next(){if(i<SCENES.length-1){i++;save();render()}}
function prev(){if(i>0){i--;save();render()}}
function render(){
 const s=SCENES[i];if(!s)return;syncStage(s);
 const interactions=arrows(s.shared_interactions),caseIds=META.caseEvidence[s.case_key]||[],ready=s.puzzle_marker?gateReady(s.puzzle_marker):true;
 let reactions=safeText(s.npc_and_shared_reactions);
 if(s.scene_id==='S22'){
   const route=resolveB23(),parts=split(reactions),base=parts.filter(x=>x.startsWith('AIDE:'));
   const chosen=route==='Theo'?parts.filter(x=>x.startsWith('THEO-VARIANT:')):route==='Adrian'?parts.filter(x=>x.startsWith('ADRIAN-VARIANT:')):route==='none'?parts.filter(x=>x.startsWith('SUPERVISOR-VARIANT:')):[];
   reactions=[...base,...chosen].join(' || ');
 }
 root.innerHTML=`<section class="stage" style="background-image:linear-gradient(90deg,rgba(4,6,9,.89),rgba(4,6,9,.48)),url('${bg(s)}')">
 <div class="chrome"><div>${esc(s.scene_id)} · ${esc(s.stage)}</div><div>${i+1}/${SCENES.length}</div></div>
 <div class="content"><div class="location">${esc(s.display_location||'BLACKTHORN ACADEMY')}</div>
 ${s.kicker?`<div class="kicker">${esc(s.kicker)}</div>`:''}${s.title?`<h1>${esc(s.title)}</h1>`:''}${safeText(s.player_body)?`<p class="body">${esc(safeText(s.player_body))}</p>`:''}
 ${reactions?`<div class="dialogue">${split(reactions).map(x=>`<p>${esc(x)}</p>`).join('')}</div>`:''}
 ${s.shared_interactions?`<div class="choices">${interactions.map((x,n)=>`<button data-c="${n}">${esc(x.label)}</button>`).join('')}</div>`:''}
 ${caseIds.length?`<button class="sourceButton" id="openSource">OPEN VRIJGEGEVEN BRON</button>`:''}
 ${effectiveWindow(s)&&/^W\d/.test(effectiveWindow(s))?`<div class="tag">PRIVÉVENSTER ${esc(effectiveWindow(s))} · telefoons · ${esc(readyStatus(s))}</div>`:''}
 ${s.scene_id==='S22'&&!resolveB23()?`<div class="tag waiting">MAXINE · ROUTEKEUZE OP TELEFOON</div>`:''}
 ${s.team_task_sequence?`<div class="team"><b>TEAMTAKEN</b>${split(s.team_task_sequence).map(x=>`<p>${esc(x)}</p>`).join('')}</div>`:''}
 ${s.puzzle_marker?`<div class="tag ${ready?'ready':'waiting'}">DOSSIERSTAP · ${esc(s.puzzle_marker.replace('_READY',''))} · ${ready?'GEREED':'NOG NIET GEREED'}</div>`:''}
 ${s.pause_after?`<div class="tag pause">PAUZE · ${esc(s.pause_after.replace('_OPTIONAL',''))}</div>`:''}</div>
 <div class="nav"><button id="prev">←</button><select id="jump">${SCENES.map((x,n)=>`<option value="${n}" ${n===i?'selected':''}>${esc(x.scene_id)} · ${esc(x.title||x.stage)}</option>`).join('')}</select><button id="next">→</button></div></section>`;
 document.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const c=interactions[+b.dataset.c];if(!c.reply)return;let box=document.querySelector('.choiceReply');if(!box){box=document.createElement('div');box.className='choiceReply';document.querySelector('.choices').after(box)}box.textContent=c.reply});
 const src=document.getElementById('openSource');if(src)src.onclick=()=>openSource(caseIds,s.case_key);
 document.getElementById('prev').onclick=prev;document.getElementById('next').onclick=next;document.getElementById('jump').onchange=e=>{i=+e.target.value;save();render()};
}
function openSource(ids,key){
 addEvidence(ids);const o=document.createElement('div');o.className='overlay';o.innerHTML=`<div class="modal"><div class="kicker">VRIJGEGEVEN DOSSIER</div><h2>${esc(key)}</h2><div class="sourceCards">${ids.map(id=>`<div class="sourceCard"><small>TOEGEVOEGD</small><b>${esc(META.evidenceLabels[id]||id.replaceAll('_',' '))}</b></div>`).join('')}</div><button id="closeSource">SLUIT</button></div>`;document.body.appendChild(o);document.getElementById('closeSource').onclick=()=>{o.remove();render()}
}
async function init(){
 try{const r=await fetch('../production/v63/BLACKTHORN_SCENE_TABLE_V6_3_AUTHORITATIVE_GM_ONLY.csv',{cache:'no-store'});SCENES=btParseCsv(await r.text());i=Math.max(0,Math.min(i,SCENES.length-1));render()}
 catch(e){root.innerHTML=`<div class="loadError"><h1>Projector kon niet laden</h1><p>${esc(e.message)}</p></div>`;console.error(e)}
}
window.addEventListener('storage',e=>{if(e.key?.startsWith('bt-ready-')||e.key==='blackthorn-state-maxine')render()});
syncChannel?.addEventListener('message',e=>{if(['ready','route'].includes(e.data?.type))render()});
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')next();if(e.key==='ArrowLeft')prev()});init();