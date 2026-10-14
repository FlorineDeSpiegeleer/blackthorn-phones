const META=window.BLACKTHORN_META||{caseEvidence:{},evidenceLabels:{},puzzleGates:{}};
const root=document.getElementById('projector');
const DEBUG=new URLSearchParams(location.search).get('debug')==='1';
const syncChannel=('BroadcastChannel' in window)?new BroadcastChannel('blackthorn-v63-sync'):null;
let SCENES=[],i=Number(localStorage.getItem('bt-proj-scene')||0);
const BEGIN_DETAILS={
 S01:{
  UITNODIGINGEN:{title:'Drie persoonlijke uitnodigingen',body:'Drie crèmekleurige kaarten dragen elk een eigen naam. Onderaan staat: Persoonlijke uitnodiging vereist bij de Grand Stair.'},
  PROGRAMMA:{title:'Foundersweek-programma',body:'Ontbijt, lessen en avondprogramma staan op één gevouwen kaart. De Night of the Veiled Moon begint vanavond in de Grand Hall.'},
  KAART:{title:'Campuskaart',body:'De publieke studentenroutes zijn duidelijk gemarkeerd. Service-, Council- en archiefroutes staan niet als gewone studentenroute aangegeven.'},
  MASKERDOZEN:{title:'Maskerdozen',body:'Drie gesloten dozen liggen naast de kledinghoezen. Elke doos is al op naam gelabeld.'},
  RAAM:{title:'Suite 417 — raam',body:'Regen hangt boven de binnenplaats. Beneden worden vlaggen en lantaarns voor Foundersweek vastgezet.'},
  GROEPSFOTO:{title:'Groepsfoto',body:'Een foto van jullie drie staat tussen boeken en losse papieren. Geen dossierstuk. Gewoon van jullie.'}
 },
 S03:{
  KAMERHOTSPOTS:{title:'Suite 417',body:'Kledinghoezen open. Maskerdozen op tafel. De Academy-klok blijft hier zichtbaar.'},
  ACCESSOIRE:{title:'Vaste baloutfits',body:'De outfits liggen volledig klaar. Er is niets te kiezen of te optimaliseren; alleen aantrekken en spullen meenemen.'},
  GROEPSFOTO:{title:'Voor vertrek',body:'De kamer is klaar voor een laatste foto vóór jullie naar beneden gaan.'}
 }
};
const REQUIRED_INTERACTIONS={S01:['UITNODIGINGEN'],S03:['KAMERHOTSPOTS']};
const IMAGES=(window.BLACKTHORN_ASSETS&&window.BLACKTHORN_ASSETS.scenes)||{};
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function split(s){
  const v=String(s||'');
  const sep=v.includes('||')?'||':'|';
  return v.split(sep).map(x=>x.trim()).filter(Boolean);
}
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
function progressKey(scene){return 'bt-scene-progress-'+scene}
function sceneProgress(scene){try{return JSON.parse(localStorage.getItem(progressKey(scene))||'[]')}catch{return[]}}
function markProgress(scene,label){const s=new Set(sceneProgress(scene));s.add(label);localStorage.setItem(progressKey(scene),JSON.stringify([...s]))}
function requirementsDone(s){
  const req=REQUIRED_INTERACTIONS[s.scene_id]||[],seen=new Set(sceneProgress(s.scene_id));
  const base=req.every(x=>seen.has(x));
  const puzzleOK=!s.puzzle_marker||(window.BlackthornPuzzles&&BlackthornPuzzles.isComplete(s.puzzle_marker));
  const accusationOK=s.scene_id!=='S26'||(window.BlackthornAccusation&&BlackthornAccusation.isLocked());
  const protectedOK=s.scene_id!=='S27'||localStorage.getItem('bt-protected-finale-linked')==='1';
  return base&&puzzleOK&&accusationOK&&protectedOK;
}
function accusationPanelHTML(){
  if(!window.BlackthornAccusation||localStorage.getItem('bt-p4-board')!=='1')return '<div class="finalePanel"><b>ACCUSATION</b><p>Theory board nog niet voltooid.</p></div>';
  const A=BlackthornAccusation,s=A.state(),count=A.votes(s.round).length;
  if(s.phase==='locked')return '<div class="finalePanel locked"><b>BESCHULDIGING VERGRENDELD</b><h3>'+esc(s.locked.accused)+'</h3><p>De steunkaarten en stemgeschiedenis zijn opgeslagen.</p></div>';
  if(['voting','final_vote'].includes(s.phase))return '<div class="finalePanel"><b>VERBORGEN STEMRONDE '+s.round+'</b><h3>'+count+'/3 ingediend</h3><p>Stemmen blijven verborgen tot iedereen heeft ingediend.</p></div>';
  if(s.phase==='minority_decision')return '<div class="finalePanel"><b>GROEPSPROTOCOL</b><h3>Er is een 2–1 voorstel.</h3><p>Wacht op de minderheidsbeslissing.</p></div>';
  if(s.phase==='confirmer_pick')return '<div class="finalePanel"><b>GROEPSPROTOCOL</b><h3>Drie verschillende stemmen.</h3><p>De roterende confirmer kiest welke beschuldiging eerst besproken wordt.</p></div>';
  if(s.phase==='final_elimination')return '<div class="finalePanel"><b>FINAL BALLOT</b><h3>Drie opties bleven verdeeld.</h3><p>De confirmer verwijdert één optie uit het laatste stembiljet.</p></div>';
  if(s.phase==='discussion'){
    const sec=Math.max(0,Math.ceil((Number(s.discussionEnds||0)-Date.now())/1000));
    return '<div class="finalePanel"><b>OPEN DISCUSSIE</b><h3 id="discussionClock">'+sec+'s</h3><p>Bespreek alleen wat al in jullie dossier en theory board staat.</p><button id="startNextVote" '+(sec>0?'disabled':'')+'>START VOLGENDE VERBORGEN STEM</button></div>';
  }
  return '';
}
function save(){localStorage.setItem('bt-proj-scene',String(i))}
function next(){const s=SCENES[i];if(s&&!requirementsDone(s))return;if(i<SCENES.length-1){i++;save();render()}}
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
 ${s.scene_id==='S03'?'<div class="academyClock" id="academyClock">19:35</div>':''}
 ${s.kicker?`<div class="kicker">${esc(s.kicker)}</div>`:''}${s.title?`<h1>${esc(s.title)}</h1>`:''}${safeText(s.player_body)?`<p class="body">${esc(safeText(s.player_body))}</p>`:''}
 ${reactions?`<div class="dialogue">${split(reactions).map(x=>`<p>${esc(x)}</p>`).join('')}</div>`:''}
 ${s.shared_interactions?`<div class="choices">${interactions.map((x,n)=>`<button data-c="${n}">${esc(x.label)}</button>`).join('')}</div>`:''}
 ${caseIds.length&&s.scene_id!=='S24C'?`<button class="sourceButton" id="openSource">OPEN VRIJGEGEVEN BRON</button>`:''}
 ${s.puzzle_marker&&window.BlackthornPuzzles?BlackthornPuzzles.button(s.puzzle_marker,ready):''}
 ${effectiveWindow(s)&&/^W\d/.test(effectiveWindow(s))?`<div class="tag">PRIVÉVENSTER ${esc(effectiveWindow(s))} · telefoons · ${esc(readyStatus(s))}</div>`:''}
 ${s.scene_id==='S22'&&!resolveB23()?`<div class="tag waiting">MAXINE · ROUTEKEUZE OP TELEFOON</div>`:''}
 ${s.scene_id==='S26'?accusationPanelHTML():''}
 ${s.team_task_sequence?`<div class="team"><b>TEAMTAKEN</b>${split(s.team_task_sequence).map(x=>`<p>${esc(x)}</p>`).join('')}</div>`:''}
 ${s.puzzle_marker?`<div class="tag ${ready?'ready':'waiting'}">DOSSIERSTAP · ${esc(s.puzzle_marker.replace('_READY',''))} · ${ready?'GEREED':'NOG NIET GEREED'}</div>`:''}
 ${s.pause_after?`<div class="tag pause">PAUZE · ${esc(s.pause_after.replace('_OPTIONAL',''))}</div>`:''}
 ${!requirementsDone(s)?'<div class="requirement">Bekijk eerst het vereiste onderdeel in deze scène.</div>':''}</div>
 <div class="nav"><button id="prev">←</button>${DEBUG?`<select id="jump">${SCENES.map((x,n)=>`<option value="${n}" ${n===i?'selected':''}>${esc(x.scene_id)} · ${esc(x.title||x.stage)}</option>`).join('')}</select>`:`<div class="navLabel">${esc(s.display_location||s.stage)}</div>`}<button id="next" ${requirementsDone(s)?'':'disabled'}>→</button></div></section>`;
 document.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{
   const c=interactions[+b.dataset.c], label=c.label.trim();
   const detail=BEGIN_DETAILS[s.scene_id]?.[label];
   markProgress(s.scene_id,label);
   if(detail){
     const o=document.createElement('div');o.className='overlay';o.innerHTML=`<div class="modal"><div class="kicker">BLACKTHORN</div><h2>${esc(detail.title)}</h2><p class="modalBody">${esc(detail.body)}</p><button id="closeDetail">SLUIT</button></div>`;
     document.body.appendChild(o);document.getElementById('closeDetail').onclick=()=>{o.remove();render()};return;
   }
   if(c.reply){let box=document.querySelector('.choiceReply');if(!box){box=document.createElement('div');box.className='choiceReply';document.querySelector('.choices').after(box)}box.textContent=c.reply}
   else render();
 });
 const src=document.getElementById('openSource');if(src)src.onclick=()=>openSource(caseIds,s.case_key);
 if(s.puzzle_marker&&window.BlackthornPuzzles)BlackthornPuzzles.bind(s.puzzle_marker,ready,()=>render());
 document.getElementById('prev').onclick=prev;document.getElementById('next').onclick=next;
 const jump=document.getElementById('jump');if(jump)jump.onchange=e=>{i=+e.target.value;save();render()};
 const voteBtn=document.getElementById('startNextVote');if(voteBtn)voteBtn.onclick=()=>{if(BlackthornAccusation.startNextVote())render()};
 if(s.scene_id==='S26'&&window.BlackthornAccusation&&BlackthornAccusation.state().phase==='discussion'){
   const end=Number(BlackthornAccusation.state().discussionEnds||0);
   clearTimeout(window.__btDiscussionTimer);window.__btDiscussionTimer=setTimeout(()=>render(),Math.max(250,end-Date.now()+50));
 }
 const clock=document.getElementById('academyClock');if(clock){const seen=sceneProgress('S03').length;clock.textContent=['19:35','19:44','19:57','20:06','20:14'][Math.min(seen,4)]}
}
function openSource(ids,key){
 addEvidence(ids);const o=document.createElement('div');o.className='overlay';o.innerHTML=`<div class="modal"><div class="kicker">VRIJGEGEVEN DOSSIER</div><h2>${esc(key)}</h2><div class="sourceCards">${ids.map(id=>`<div class="sourceCard"><small>TOEGEVOEGD</small><b>${esc(META.evidenceLabels[id]||id.replaceAll('_',' '))}</b></div>`).join('')}</div><button id="closeSource">SLUIT</button></div>`;document.body.appendChild(o);document.getElementById('closeSource').onclick=()=>{o.remove();render()}
}
async function init(){
 try{const r=await fetch('../production/v63/BLACKTHORN_SCENE_TABLE_V6_3_AUTHORITATIVE_GM_ONLY.csv',{cache:'no-store'});SCENES=btParseCsv(await r.text());i=Math.max(0,Math.min(i,SCENES.length-1));render()}
 catch(e){root.innerHTML=`<div class="loadError"><h1>Projector kon niet laden</h1><p>${esc(e.message)}</p></div>`;console.error(e)}
}
window.addEventListener('storage',e=>{if(e.key?.startsWith('bt-ready-')||e.key==='blackthorn-state-maxine')render()});
syncChannel?.addEventListener('message',e=>{if(['ready','route','accusation'].includes(e.data?.type))render()});
window.addEventListener('blackthorn-accusation',()=>render());
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')next();if(e.key==='ArrowLeft')prev()});init();