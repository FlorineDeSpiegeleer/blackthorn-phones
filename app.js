let BUILD=null;
const META=window.BLACKTHORN_META||{caseEvidence:{},evidenceLabels:{},puzzleGates:{}};
const syncChannel=('BroadcastChannel' in window)?new BroadcastChannel('blackthorn-v63-sync'):null;
const qs=new URLSearchParams(location.search), key=(qs.get('character')||'').toLowerCase(), debug=qs.get('debug')==='1';
const app=document.getElementById('app');
let STAGES=[],player=null,screen='home';

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function stateKey(){return 'blackthorn-state-'+key}
function state(){try{return JSON.parse(localStorage.getItem(stateKey())||'{}')}catch{return{}}}
function saveState(s){localStorage.setItem(stateKey(),JSON.stringify(s))}
function currentStage(){return localStorage.getItem('bt-global-stage')||'FOUNDERS_MORNING'}
function setStage(s){localStorage.setItem('bt-global-stage',s);syncChannel?.postMessage({type:'stage',stage:s});renderHome()}
function stageIndex(s){return STAGES.indexOf(s)}
function stageVisible(s){return stageIndex(s)<=stageIndex(currentStage())}
function condOK(cond){
  if(!cond)return true; const st=state();
  if(cond==='map_opened=true')return !!st.map_opened;
  if(cond==='map_opened=false')return !st.map_opened;
  if(cond.startsWith('hazard_choice='))return st.hazard_choice===cond.split('=')[1];
  if(cond.startsWith('w6_route!='))return st.w6_route!==cond.split('!=')[1];
  if(cond.startsWith('w6_route='))return st.w6_route===cond.split('=')[1];
  if(cond.includes('abs(theo_engagement-adrian_engagement)<=1'))return Math.abs(Number(st.theo_engagement||0)-Number(st.adrian_engagement||0))<=1;
  return true;
}
const apps=[['messages','Messages','✉'],['photos','Photos','▧'],['calendar','Calendar','□'],['map','Map','⌖'],['dossier','Dossier','⌘'],['blackthorn','Blackthorn','✦'],['notes','Notes','≡'],['camera','Camera','◎']];

function debugBar(){if(!debug)return '';return `<div class="debugBar"><b>TEST</b><select id="stageSelect">${STAGES.map(s=>`<option ${s===currentStage()?'selected':''}>${s}</option>`).join('')}</select><button id="resetState">Reset</button></div>`}
function bindDebug(){const s=document.getElementById('stageSelect');if(s)s.onchange=()=>setStage(s.value);const r=document.getElementById('resetState');if(r)r.onclick=()=>{localStorage.removeItem(stateKey());renderHome()}}
function topbar(t){return `<header class="topbar"><button id="homeBtn">‹ Home</button><h1>${esc(t)}</h1><span></span></header>`}
function bindTop(){const b=document.getElementById('homeBtn');if(b)b.onclick=renderHome}

function renderPicker(){
  app.innerHTML=`<section class="picker"><div class="brand">✦ BLACKTHORN ACADEMY</div><h1>Kies een telefoon</h1><div class="pickerGrid">${Object.entries(BUILD.players).map(([k,p])=>`<a href="?character=${k}"><img src="${p.portrait}"><span>${p.name}</span></a>`).join('')}</div></section>`;
}
function renderHome(){
  if(!player)return renderPicker();screen='home';
  app.innerHTML=`${debugBar()}<section class="phone" style="--wall:url('${player.wallpaper}')"><div class="homeContent">
  <div class="owner"><img src="${player.portrait}"><div><small>BLACKTHORN ACADEMY</small><b>${player.name}</b></div></div>
  <div class="appGrid">${apps.map(([id,l,ic])=>`<button class="appIcon" data-app="${id}"><i>${ic}</i><span>${l}</span></button>`).join('')}</div>
  <div class="stagePill">${currentStage().replaceAll('_',' ')}</div></div></section>`;
  document.querySelectorAll('[data-app]').forEach(b=>b.onclick=()=>renderApp(b.dataset.app));bindDebug();
}
function renderApp(id){
  ({messages:renderMessages,photos:renderPhotos,calendar:renderCalendar,map:renderMap,dossier:renderDossier,blackthorn:renderBlackthorn,notes:renderNotes,camera:renderCamera}[id]||renderHome)();
}
function unlockedFlows(){try{return JSON.parse(localStorage.getItem('bt-unlocked-flows')||'["P001"]')}catch{return["P001"]}}
function activeWindow(){return localStorage.getItem('bt-global-window')||''}
function resolveRoutes(){
  if(key!=='maxine')return;
  const st=state(),t=Number(st.theo_engagement||0),a=Number(st.adrian_engagement||0),w=activeWindow();
  if(w==='B23' && Math.abs(t-a)>=2 && !st.b23_route){st.b23_route=t>a?'Theo':'Adrian';saveState(st)}
  if(w==='W6' && t!==a && !st.w6_route){st.w6_route=t>a?'Theo':'Adrian';saveState(st)}
}
function visibleRows(){
  resolveRoutes();
  const unlocked=new Set(unlockedFlows());
  return BUILD.phoneFlow.filter(r=>(r.character==='ALL'||r.character===player.name)&&unlocked.has(r.flow_id)&&stageVisible(r.stage)&&condOK(r.condition));
}
function w6RouteChooser(){
  if(key!=='maxine'||activeWindow()!=='W6')return '';
  const st=state(),t=Number(st.theo_engagement||0),a=Number(st.adrian_engagement||0);
  if(t!==a||st.w6_route)return '';
  return '<div class="routeGate"><small>PRIVÉVENSTER</small><h3>Wie wil je nu spreken?</h3><div><button data-w6="Theo">Theo</button><button data-w6="Adrian">Adrian</button><button data-w6="none">Alleen verder</button></div></div>';
}
function privateReadyCard(){
  const w=activeWindow(); if(!w)return '';
  const active=unlockedFlows().some(id=>{const r=BUILD.phoneFlow.find(x=>x.flow_id===id);return r&&r.character===player.name&&r.window===w});
  if(!active)return '';
  const ready=localStorage.getItem('bt-ready-'+w+'-'+key)==='1';
  return `<div class="readyCard"><b>${ready?'Klaar ✓':'Privévenster '+esc(w)}</b><p>${ready?'Je telefoon blijft bruikbaar terwijl de anderen afronden.':'Rond je huidige gesprek af en markeer daarna dat je klaar bent.'}</p><button id="readyBtn">${ready?'Niet meer klaar':'Ik ben klaar'}</button></div>`;
}
function bindWindowControls(){
  document.querySelectorAll('[data-w6]').forEach(b=>b.onclick=()=>{const st=state();st.w6_route=b.dataset.w6;saveState(st);renderMessages()});
  const rb=document.getElementById('readyBtn');if(rb)rb.onclick=()=>{const w=activeWindow(),k='bt-ready-'+w+'-'+key;localStorage.setItem(k,localStorage.getItem(k)==='1'?'0':'1');syncChannel?.postMessage({type:'ready',window:w});renderMessages()};
}
function renderMessages(){
  const groups=new Map();visibleRows().forEach(r=>{if(!groups.has(r.thread))groups.set(r.thread,[]);groups.get(r.thread).push(r)});
  app.innerHTML=`${debugBar()}<section class="screen">${topbar('Messages')}${w6RouteChooser()}<div class="search">Zoek gesprekken</div><div class="threadList">${[...groups].map(([n,rs])=>{const last=rs.at(-1);return `<button class="thread" data-thread="${esc(n)}"><span class="avatar">${esc(n[0])}</span><span><b>${esc(n)}</b><small>${esc(last.opening_text||'')}</small></span><time>${esc(last.visible_timestamp||'')}</time></button>`}).join('')||'<div class="empty">Nog geen gesprekken.</div>'}</div>${privateReadyCard()}</section>`;
  document.querySelectorAll('[data-thread]').forEach(b=>b.onclick=()=>renderThread(b.dataset.thread));bindWindowControls();bindTop();bindDebug();
}
function choiceKey(flow){return 'bt-choice-'+key+'-'+flow}
function renderThread(name){
  const rows=visibleRows().filter(r=>r.thread===name);let html='';
  rows.forEach(r=>{
    const picked=localStorage.getItem(choiceKey(r.flow_id));
    if(r.opening_text)html+=`<div class="bubbleRow theirs"><div class="bubble"><p>${esc(r.opening_text)}</p>${r.visible_timestamp?`<time>${esc(r.visible_timestamp)}</time>`:''}</div></div>`;
    const intents=[1,2,3].map(i=>({label:r['intent_'+i],reply:r['reaction_'+i]})).filter(x=>x.label);
    if(intents.length&&picked===null)html+=`<div class="intentGrid">${intents.map((x,i)=>`<button class="intent" data-flow="${r.flow_id}" data-i="${i}">${esc(x.label)}</button>`).join('')}</div>`;
    if(picked!==null&&intents[+picked]){const c=intents[+picked];html+=`<div class="bubbleRow mine"><div class="bubble"><p>${esc(c.label)}</p></div></div>${c.reply?`<div class="bubbleRow theirs"><div class="bubble"><p>${esc(c.reply)}</p></div></div>`:''}`}
  });
  app.innerHTML=`${debugBar()}<section class="screen">${topbar(name)}<div class="conversation">${html||'<div class="empty">Nog geen berichten.</div>'}</div></section>`;
  document.querySelectorAll('[data-flow]').forEach(b=>b.onclick=()=>{
    const r=rows.find(x=>x.flow_id===b.dataset.flow),idx=+b.dataset.i+1,label=r['intent_'+idx],st=state();
    localStorage.setItem(choiceKey(r.flow_id),b.dataset.i);
    if(r.flow_id==='P025')st.hazard_choice=label.startsWith('WACHT')?'A':label.startsWith('BLIJF')?'B':'C';
    if(r.flow_id==='P036')st.b23_route=label==='THEO'?'Theo':label==='ADRIAN'?'Adrian':'none';
    if((r.state_write||'').includes('theo_engagement+=1'))st.theo_engagement=Number(st.theo_engagement||0)+1;
    if((r.state_write||'').includes('adrian_engagement+=1'))st.adrian_engagement=Number(st.adrian_engagement||0)+1;
    saveState(st);renderThread(name);
  });bindWindowControls();bindTop();bindDebug();
}
function renderPhotos(){app.innerHTML=`${debugBar()}<section class="screen">${topbar('Photos')}<div class="photoGrid">${player.photos.map(([s,c])=>`<figure><img src="${s}"><figcaption>${esc(c)}</figcaption></figure>`).join('')}</div></section>`;bindTop();bindDebug()}
function renderCalendar(){const items=BUILD.calendar.filter(x=>stageVisible(x.stage));app.innerHTML=`${debugBar()}<section class="screen">${topbar('Calendar')}<div class="calendarList">${items.map(e=>`<article><div class="date">${esc(e.date)}</div><time>${esc(e.time)}</time><h3>${esc(e.title)}</h3><p>${esc(e.location)}</p></article>`).join('')}</div></section>`;bindTop();bindDebug()}
function renderMap(){app.innerHTML=`${debugBar()}<section class="screen">${topbar('Map')}<div class="mapHero"><img src="assets/florine/photos/Rainy-Gothic-Manor-Arrival.png"><div><b>BLACKTHORN ACADEMY</b><span>Locaties en toegangsstatus</span></div></div><div class="locationList">${BUILD.locations.map(l=>`<button class="locationRow" data-map><img src="${l.image}"><span><b>${esc(l.name)}</b><small>${esc(l.status)}</small></span></button>`).join('')}</div></section>`;document.querySelectorAll('[data-map]').forEach(b=>b.onclick=()=>{const st=state();st.map_opened=true;saveState(st);b.classList.add('seen')});bindTop();bindDebug()}
function ownedEvidence(){try{return JSON.parse(localStorage.getItem('bt-owned-evidence')||'[]')}catch{return[]}}
function renderDossier(){const o=ownedEvidence();app.innerHTML=`${debugBar()}<section class="screen">${topbar('Dossier')}<div class="portalHero"><span>⌘</span><h2>Vrijgegeven dossier</h2><p>Alleen reeds vrijgegeven materiaal verschijnt hier.</p></div><div class="evidenceList">${o.length?o.map(id=>`<article class="evidenceCard"><small>VRIJGEGEVEN</small><h3>${esc(META.evidenceLabels[id]||id.replaceAll('_',' '))}</h3></article>`).join(''):'<div class="empty">Nog geen dossiermateriaal.</div>'}</div></section>`;bindTop();bindDebug()}
function renderBlackthorn(){const a=BUILD.announcements.filter(x=>stageVisible(x.stage));app.innerHTML=`${debugBar()}<section class="screen">${topbar('Blackthorn')}<div class="portalHero"><span>✦</span><h2>Blackthorn Academy</h2><p>Officieel studentenportaal</p></div><h3 class="sectionTitle">Meldingen</h3>${a.slice().reverse().map(x=>`<article class="notice"><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p></article>`).join('')}<h3 class="sectionTitle">Directory</h3><div class="directory">${BUILD.directory.map(d=>`<div class="dirRow"><span class="avatar">${esc(d.name[0])}</span><span><b>${esc(d.name)}</b><small>${esc(d.role)}</small></span></div>`).join('')}</div></section>`;bindTop();bindDebug()}
function renderNotes(){const n='bt-notes-'+key,v=localStorage.getItem(n)||'';app.innerHTML=`${debugBar()}<section class="screen">${topbar('Notes')}<textarea id="notes" placeholder="Jullie eigen notities…">${esc(v)}</textarea></section>`;document.getElementById('notes').oninput=e=>localStorage.setItem(n,e.target.value);bindTop();bindDebug()}
function renderCamera(){app.innerHTML=`${debugBar()}<section class="screen">${topbar('Camera')}<div class="fakeCamera"><img src="${player.wallpaper}"><div class="cameraFrame"></div></div><button class="shutter">●</button><p class="cameraHint">Technische build.</p></section>`;bindTop();bindDebug()}
async function init(){
  try{BUILD=await loadBlackthornBuild();STAGES=BUILD.stageOrder;player=BUILD.players[key]||null;renderHome()}
  catch(e){app.innerHTML=`<div class="loadError"><h1>Blackthorn kon niet laden</h1><p>${esc(e.message)}</p></div>`;console.error(e)}
}
window.addEventListener('storage',e=>{if(['bt-global-stage','bt-global-window','bt-unlocked-flows'].includes(e.key)&&screen==='home')renderHome()});
syncChannel?.addEventListener('message',e=>{if(e.data?.type==='stage'&&screen==='home')renderHome()});
init();