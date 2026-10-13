const DATA = window.BLACKTHORN_DATA || {};
const qs = new URLSearchParams(location.search);
const key = (qs.get('character') || '').toLowerCase();
const app = document.getElementById('app');

const icons = {
  messages:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></svg>',
  photos:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.4"/><path d="m6 17 4-4 3 3 2-2 3 3"/></svg>',
  camera:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h4l1.5-2h5L16 8h4v10H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  blackthorn:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M7 7c1.5 0 3-1.5 5-4 2 2.5 3.5 4 5 4M6 11c2 0 4-1 6-4 2 3 4 4 6 4M5 15c2.5 0 5-1 7-4 2 3 4.5 4 7 4M9 21h6"/></svg>',
  map:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 6 5-2 6 2 5-2v14l-5 2-6-2-5 2zM9 4v14M15 6v14"/><circle cx="15" cy="10" r="1.5"/></svg>',
  notes:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v16H6zM9 8h6M9 12h6M9 16h4"/></svg>',
  calendar:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="14" rx="2"/><path d="M8 3v6M16 3v6M4 10h16"/></svg>',
  calls:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4 4.5 6.5c1.5 6.5 6.5 11.5 13 13L20 17l-4-3-2 2c-3-1-5-3-6-6l2-2z"/></svg>'
};
const appNames={messages:'Messages',photos:'Photos',camera:'Camera',blackthorn:'Blackthorn',map:'Map',notes:'Notes',calendar:'Calendar',calls:'Calls'};
const homeApps=['messages','photos','camera','blackthorn','map','notes','calendar','calls'];

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function wallpaper(c){return c.wallpaper || `assets/wallpaper/${c.theme}.png`}
function thumbFor(src){return src.startsWith('data:') ? src : src.replace('/photos/','/thumbs/').replace(/\.[^.]+$/,'.webp')}
function appButton(id){return `<button class="appIconBtn" data-open="${id}" aria-label="Open ${appNames[id]}"><span class="iconTile ${id}">${icons[id]}</span><span class="label">${appNames[id]}</span></button>`}
function captureKey(){return `blackthorn-captures-${key}`}
function noteKey(){return `blackthorn-note-${key}`}
function unlockKey(id){return `blackthorn-unlocked-${key}-${id}`}
function getCaptures(){try{return JSON.parse(localStorage.getItem(captureKey())||'[]')}catch{return []}}
function saveCapture(dataUrl){let items=getCaptures();items.unshift(dataUrl);items=items.slice(0,6);while(items.length){try{localStorage.setItem(captureKey(),JSON.stringify(items));return true}catch{items.pop()}}return false}
function isUnlocked(id){return localStorage.getItem(unlockKey(id))==='1'}

function renderPicker(){
  document.title='Blackthorn Phones';
  app.innerHTML=`<section class="characterPicker"><div class="pickerBox"><div class="pickerKicker">BLACKTHORN ACADEMY</div><h1>Choose a phone</h1><p>Deze testpagina is alleen de ingang. Voor het spel gebruik je rechtstreeks de unieke QR-link van elk personage.</p><div class="pickerButtons">${Object.entries(DATA).map(([k,c])=>`<a href="?character=${k}">${esc(c.name)}<span>open →</span></a>`).join('')}</div></div></section>`;
}

function renderHome(c){
  stopCam(); document.title=`${c.name} — Blackthorn Phone`;
  app.innerHTML=`<section class="phone theme-${c.theme}" style="background-image:url('${wallpaper(c)}')"><div class="home"><div class="homeHeader"><div class="ownerPill"><i class="ownerDot"></i>${esc(c.name)}</div><div class="academyMark">BLACKTHORN</div></div><div class="grid">${homeApps.map(appButton).join('')}</div><div class="spacer"></div><div class="dock" aria-label="Quick apps">${['calls','messages','camera','blackthorn'].map(appButton).join('')}</div></div></section>`;
  app.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>navigateApp(c,b.dataset.open));
}

function navigateApp(c,id){
  const lock=c.locks?.[id];
  if(lock && !isUnlocked(id)) return showLock(c,id,lock);
  if(location.hash!==`#${id}`) history.pushState({app:id},'',`${location.pathname}${location.search}#${id}`);
  renderApp(c,id);
}
function goHome(){if(location.hash) history.back(); else renderHome(DATA[key])}
function shell(title,body,right=''){
  app.innerHTML=`<section class="screen theme-${DATA[key]?.theme||''}"><header class="topbar"><button id="back" aria-label="Terug naar beginscherm">‹ Home</button><h1>${esc(title)}</h1><div class="right">${right}</div></header><div class="content">${body}</div></section>`;
  document.getElementById('back').onclick=goHome;
}
function empty(title,text,id='messages'){
  return `<div class="empty"><div class="emptyIcon">${icons[id]||icons.notes}</div><h2>${esc(title)}</h2><p>${esc(text)}</p><span class="placeholderTag">Klaar om later in te vullen</span></div>`
}

function renderApp(c,id){
  stopCam();
  ({messages:renderMessages,calls:renderCalls,photos:renderPhotos,camera:renderCamera,notes:renderNotes,calendar:renderCalendar,map:renderMap,blackthorn:renderBlackthorn}[id]||renderHome)(c);
}

function renderMessages(c){
  if(!c.messages?.length) return shell('Messages',`<div class="searchBar">${searchIcon()}Search conversations</div>${empty('No conversations yet','Chats, groepsgesprekken, timestamps en latere vergrendelde threads verschijnen hier.','messages')}`);
  const rows=c.messages.map((m,i)=>`<button class="thread" data-thread="${i}"><span class="avatar">${esc((m.name||'?').slice(0,1))}</span><span class="threadMain"><span class="threadTop"><b>${esc(m.name)}</b><time>${esc(m.time||'')}</time></span><span class="threadPreview">${esc(m.preview||lastMessage(m)||'')}</span></span><span class="chevron">›</span></button>`).join('');
  shell('Messages',`<div class="searchBar">${searchIcon()}Search conversations</div><div class="listCard">${rows}</div>`);
  app.querySelectorAll('[data-thread]').forEach(b=>b.onclick=()=>renderThread(c,+b.dataset.thread));
}
function searchIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg>'}
function lastMessage(thread){const arr=thread.messages||[];return arr.length?arr[arr.length-1].text:''}
function renderThread(c,index){
  const t=c.messages?.[index]; if(!t) return renderMessages(c);
  const msgs=t.messages||[];
  shell(t.name||'Conversation',msgs.length?`<div class="conversation">${msgs.map(m=>`<div class="bubbleRow ${m.from==='me'?'mine':'theirs'}"><div class="bubble"><p>${esc(m.text||'')}</p>${m.time?`<time>${esc(m.time)}</time>`:''}</div></div>`).join('')}</div>`:empty('No messages yet','Deze conversatie is aangemaakt maar bevat nog geen berichten.','messages'));
  document.getElementById('back').textContent='‹ Messages';
  document.getElementById('back').onclick=()=>renderMessages(c);
}

function renderCalls(c){
  if(!c.calls?.length) return shell('Calls',empty('No calls yet','Gemiste, inkomende en uitgaande oproepen kunnen later per personage worden toegevoegd.','calls'));
  shell('Calls',`<div class="listCard">${c.calls.map(x=>`<div class="callRow"><div class="callIcon">${icons.calls}</div><div class="callMeta"><b>${esc(x.name)}</b><span>${esc(x.type||'Call')}</span></div><time>${esc(x.time||'')}</time></div>`).join('')}</div>`);
}

function renderCalendar(c){
  if(!c.calendar?.length) return shell('Calendar',empty('Nothing scheduled yet','Lessen, afspraken, het bal en tijdlijn-clues kunnen hier later worden toegevoegd.','calendar'));
  shell('Calendar',`<div class="calendarList">${c.calendar.map(e=>`<div class="card day"><div class="dateBox"><small>${esc(e.month||'')}</small><b>${esc(e.day||'')}</b></div><div class="event"><strong>${esc(e.title)}</strong><span>${[e.time,e.location].filter(Boolean).map(esc).join(' · ')}</span>${e.note?`<p>${esc(e.note)}</p>`:''}</div></div>`).join('')}</div>`);
}

function renderMap(c){
  const locations=c.mapLocations||[];
  shell('Map',`<div class="mapStage"><div class="mapPaper"></div><div class="mapBuilding"></div><div class="pin"></div><div class="mapLegend">Blackthorn Academy · interactieve locaties worden later toegevoegd</div></div>${locations.length?`<div class="sectionLabel">Locations</div><div class="listCard">${locations.map((l,i)=>`<button class="mapRow" data-location="${i}"><span class="mapDot"></span><span><b>${esc(l.name)}</b><small>${esc(l.description||'')}</small></span><span class="chevron">›</span></button>`).join('')}</div>`:`<div class="card"><h3>Map placeholder</h3><p>Hier kunnen later Grand Hall, East Gallery, Observatory, West Service Corridor, Library en andere clue-locaties klikbaar worden gemaakt.</p></div>`}`);
}

function renderBlackthorn(c){
  const ann=c.announcements||[];
  shell('Blackthorn',`<div class="baHero"><div class="baCrest">✦</div><h2>Blackthorn Academy</h2><p>Official academy portal · ${esc(c.name)}</p></div><div class="sectionLabel">Academy services</div><div class="baGrid"><button class="baTile" data-ba="announcements"><span class="mini">◇</span><b>Announcements</b><span>${ann.length?`${ann.length} notice(s)`:'Placeholder'}</span></button><button class="baTile" data-ba="directory"><span class="mini">⌁</span><b>Directory</b><span>Students & staff</span></button><button class="baTile" data-ba="events"><span class="mini">◌</span><b>Events</b><span>Schedule & ball</span></button><button class="baTile" data-ba="access"><span class="mini">⌂</span><b>Access</b><span>Buildings & rooms</span></button></div><div class="sectionLabel">Latest</div>${ann.length?ann.map(a=>`<div class="card"><h3>${esc(a.title)}</h3><p>${esc(a.body||'')}</p></div>`).join(''):`<div class="card"><h3>No academy notices yet</h3><p>Deze sectie is voorbereid voor officiële mededelingen, clue-updates of vrijgegeven documenten.</p></div>`}`);
  app.querySelectorAll('[data-ba]').forEach(b=>b.onclick=()=>renderBlackthornSection(c,b.dataset.ba));
}
function renderBlackthornSection(c,section){
  const cfg={
    announcements:['Announcements',c.announcements||[],'Officiële mededelingen verschijnen hier.'],
    directory:['Directory',c.directory||[],'Studenten en medewerkers kunnen hier later worden toegevoegd.'],
    events:['Events',c.calendar||[],'Academy-events en het balprogramma verschijnen hier.'],
    access:['Access',c.mapLocations||[],'Gebouwen, ruimtes en toegangsstatus kunnen hier later worden toegevoegd.']
  }[section];
  if(!cfg) return renderBlackthorn(c);
  const [title,items,placeholder]=cfg;
  const body=items.length?items.map(item=>`<div class="card"><h3>${esc(item.title||item.name||'Item')}</h3><p>${esc(item.body||item.description||item.note||[item.time,item.location].filter(Boolean).join(' · ')||'')}</p></div>`).join(''):empty(`No ${title.toLowerCase()} yet`,placeholder,'blackthorn');
  shell(title,body);
  document.getElementById('back').textContent='‹ Blackthorn'; document.getElementById('back').onclick=()=>renderBlackthorn(c);
}

function renderPhotos(c){
  const captures=getCaptures();
  const staticPhotos=(c.photos||[]).map(src=>({src,thumb:thumbFor(src)}));
  const photos=[...captures.map(src=>({src,thumb:src,captured:true})),...staticPhotos];
  const body=photos.length?`<div class="photoHeader"><h2>Library</h2><span>${photos.length} photos</span></div><div class="photosGrid">${photos.map((p,i)=>`<button data-photo="${i}" aria-label="Open photo ${i+1}"><img loading="lazy" decoding="async" src="${p.thumb}" alt="Photo ${i+1}"></button>`).join('')}</div>`:empty('No photos','Voeg later beelden toe aan de camera roll.','photos');
  shell('Photos',body);
  app.querySelectorAll('[data-photo]').forEach(b=>b.onclick=()=>openViewer(photos,+b.dataset.photo));
}
function openViewer(photos,index){
  const p=photos[index]; const v=document.createElement('div');v.className='viewer';
  v.innerHTML=`<div class="viewerTop"><button>‹ Back</button><span>${index+1} of ${photos.length}</span><span></span></div><img src="${p.src}" alt="Photo ${index+1}">`;
  v.querySelector('button').onclick=()=>v.remove();document.body.appendChild(v);
}

function renderNotes(c){
  shell('Notes',`<div class="notesIntro"><div class="roundIcon">✎</div><div><b>${esc(c.name)}'s notes</b><small>Saved on this device</small></div></div><textarea class="noteArea" id="note" spellcheck="true" placeholder="Personal notes…"></textarea>`,'Auto-save');
  const t=document.getElementById('note');t.value=localStorage.getItem(noteKey())||c.notes||'';t.addEventListener('input',()=>{try{localStorage.setItem(noteKey(),t.value)}catch{}});
}

async function renderCamera(c){
  app.innerHTML=`<section class="cameraScreen"><div class="cameraVideo"><video id="video" autoplay playsinline muted></video><div id="camMsg" class="camMessage">Camera wordt gestart…</div><div id="flash" class="flash"></div></div><div class="camControls"><button class="camBack" id="camBack">‹ Home</button><button class="shutter" id="shutter" aria-label="Take photo"></button><button class="camGallery" id="camGallery" aria-label="Open photos">▧</button></div></section>`;
  document.getElementById('camBack').onclick=goHome;
  document.getElementById('camGallery').onclick=()=>{stopCam();history.replaceState({app:'photos'},'',`${location.pathname}${location.search}#photos`);renderPhotos(c)};
  const msg=document.getElementById('camMsg');
  try{
    if(!navigator.mediaDevices?.getUserMedia) throw new Error('Camera API unavailable');
    const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});
    if(!document.getElementById('video')){stream.getTracks().forEach(t=>t.stop());return}
    window._stream=stream; const v=document.getElementById('video'); v.srcObject=stream; msg.style.display='none';
  }catch(e){msg.innerHTML='Camera-toegang is niet beschikbaar.<br><small>Op GitHub Pages werkt dit via HTTPS nadat toestemming is gegeven.</small>'}
  document.getElementById('shutter').onclick=takePhoto;
}
function takePhoto(){
  const v=document.getElementById('video');
  if(!v||!v.videoWidth){const m=document.getElementById('camMsg');m.style.display='block';m.textContent='De camera is nog niet klaar.';return}
  const maxW=900,scale=Math.min(1,maxW/v.videoWidth),canvas=document.createElement('canvas');
  canvas.width=Math.round(v.videoWidth*scale);canvas.height=Math.round(v.videoHeight*scale);canvas.getContext('2d').drawImage(v,0,0,canvas.width,canvas.height);
  const ok=saveCapture(canvas.toDataURL('image/jpeg',.76));const f=document.getElementById('flash');f.classList.add('on');setTimeout(()=>f.classList.remove('on'),120);
  if(!ok){const m=document.getElementById('camMsg');m.style.display='block';m.textContent='Foto gemaakt, maar lokale opslag is vol.';setTimeout(()=>m.style.display='none',1800)}
}
function stopCam(){if(window._stream){window._stream.getTracks().forEach(t=>t.stop());window._stream=null}}

function showLock(c,id,lock){
  const o=document.createElement('div');o.className=`lockOverlay theme-${c.theme}`;
  o.innerHTML=`<div class="lockCard"><div class="lockGlyph">⌁</div><h2>Locked</h2><p>${esc(lock.hint||'Enter the code to unlock this content.')}</p><input inputmode="numeric" autocomplete="off" maxlength="12" aria-label="Unlock code"><div class="lockError"></div><div class="lockActions"><button class="cancel">Cancel</button><button class="unlock">Unlock</button></div></div>`;
  document.body.appendChild(o);const input=o.querySelector('input');input.focus();o.querySelector('.cancel').onclick=()=>o.remove();
  const submit=()=>{if(input.value===String(lock.code)){localStorage.setItem(unlockKey(id),'1');o.remove();navigateApp(c,id)}else{o.querySelector('.lockError').textContent='Incorrect code';input.select()}};
  o.querySelector('.unlock').onclick=submit;input.addEventListener('keydown',e=>{if(e.key==='Enter')submit()});
}

function route(){
  stopCam();
  if(!(key&&DATA[key])) return renderPicker();
  const id=location.hash.replace('#','');
  if(id&&icons[id]){
    const c=DATA[key],lock=c.locks?.[id];
    if(lock&&!isUnlocked(id)){history.replaceState({},'',`${location.pathname}${location.search}`);return renderHome(c)}
    return renderApp(c,id);
  }
  renderHome(DATA[key]);
}
window.addEventListener('popstate',route);window.addEventListener('pagehide',stopCam);route();
