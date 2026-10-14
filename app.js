const DATA = window.BLACKTHORN_DATA || {};
const qs = new URLSearchParams(location.search);
const key = (qs.get('character') || '').toLowerCase();
const app = document.getElementById('app');

const icons = {
  messages:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9.5 13.5h29v19h-17l-8.5 6v-6H9.5z"/><path d="M14.5 18.5 24 25l9.5-6.5"/><path d="M17 30h14"/></svg>',
  photos:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="10" width="28" height="28" rx="3"/><circle cx="18" cy="18" r="3"/><path d="m13 34 8.5-9 5.5 5 3.5-3.5L36 34"/><path d="M32 13v6M29 16h6"/></svg>',
  camera:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 17h8l2.5-4h9L31 17h8v21H9z"/><circle cx="24" cy="27" r="7"/><circle cx="24" cy="27" r="3.5"/><path d="M14 13h6M34 21h1"/></svg>',
  blackthorn:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 7v31"/><path d="M15 17c3.2 0 6-3.4 9-8 3 4.6 5.8 8 9 8"/><path d="M12.5 25c4.6 0 8-2.5 11.5-7.5 3.5 5 6.9 7.5 11.5 7.5"/><path d="M10 33c5.4 0 10-2.9 14-8.5 4 5.6 8.6 8.5 14 8.5"/><path d="M18 40h12"/><path d="m24 4 1.1 2.4 2.4 1.1-2.4 1.1L24 11l-1.1-2.4-2.4-1.1 2.4-1.1z"/></svg>',
  map:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m9 14 10-4 10 4 10-4v25l-10 4-10-4-10 4z"/><path d="M19 10v25M29 14v25"/><circle cx="29" cy="23" r="4"/><path d="M29 17v2M29 27v2M23 23h2M33 23h2"/></svg>',
  notes:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 9h23v30H13z"/><path d="M18 9v30M23 17h8M23 23h8M23 29h6"/><path d="m11 14 4-2M11 22l4-2M11 30l4-2"/></svg>',
  calendar:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="12" width="28" height="27" rx="3"/><path d="M17 8v8M31 8v8M10 20h28"/><path d="m24 25 1.2 2.5 2.6 1.2-2.6 1.2L24 33l-1.2-3.1-2.6-1.2 2.6-1.2z"/></svg>',
  calls:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 10c-2 1.3-4 4.2-4 7 0 10.7 9.3 20 20 20 2.8 0 5.7-2 7-4l-6.5-6-4 3c-4.7-1.4-8.6-5.3-10-10l3-4z"/><path d="M29 12c4.7 1 7 3.3 8 8M28 18c2 .4 3.6 2 4 4"/></svg>'
};
const appNames={messages:'Messages',photos:'Photos',camera:'Camera',blackthorn:'Blackthorn',map:'Map',notes:'Notes',calendar:'Calendar',calls:'Calls'};
const homeApps=['messages','photos','camera','blackthorn','map','notes','calendar','calls'];
const STAGES=['FOUNDERS_MORNING','GETTING_READY','BALL','INCIDENT','WEEK1','WEEK2','WEEK3','WEEK4','FINALE','EPILOGUE'];

function stageKey(){return `blackthorn-stage-${key}`}
function currentStage(){const s=localStorage.getItem(stageKey())||'FOUNDERS_MORNING';return STAGES.includes(s)?s:'FOUNDERS_MORNING'}
function stageIndex(stage){const i=STAGES.indexOf(stage||'FOUNDERS_MORNING');return i<0?0:i}
function isVisible(item){return stageIndex(item?.stage)<=stageIndex(currentStage())}
function visibleItems(items){return (items||[]).filter(isVisible)}
function visibleMessages(thread){return (thread?.messages||[]).filter(isVisible)}
function visibleThreads(c){return (c.messages||[]).map((t,index)=>({...t,_sourceIndex:index,messages:visibleMessages(t)})).filter(t=>t.messages.length)}

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function wallpaper(c){
  if(c.wallpaper) return c.wallpaper;
  return c.theme === 'florine' ? 'assets/wallpaper/florine.jpg' : `assets/wallpaper/${c.theme}.png`;
}
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
  app.innerHTML=`<section class="phone theme-${c.theme}" style="background-image:url('${wallpaper(c)}')"><div class="home"><div class="homeHeader"><div class="ownerPill"><i class="ownerDot"></i>${esc(c.name)}</div><div class="academyMark"><span class="academySigil">✦</span><span>BLACKTHORN</span></div></div><div class="grid">${homeApps.map(appButton).join('')}</div><div class="spacer"></div><div class="dock" aria-label="Quick apps">${['calls','messages','camera','blackthorn'].map(appButton).join('')}</div></div></section>`;
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
  app.innerHTML=`<section class="screen theme-${DATA[key]?.theme||''}"><header class="topbar"><button id="back" aria-label="Terug naar beginscherm">‹ Home</button><div class="titleWrap"><span class="titleRune">✦</span><h1>${esc(title)}</h1><span class="titleRune">✦</span></div><div class="right">${right}</div></header><div class="content">${body}</div></section>`;
  document.getElementById('back').onclick=goHome;
}
function empty(title,text,id='messages'){
  return `<div class="empty"><div class="emptyIcon">${icons[id]||icons.notes}</div><h2>${esc(title)}</h2><p>${esc(text)}</p></div>`
}

function renderApp(c,id){
  stopCam();
  ({messages:renderMessages,calls:renderCalls,photos:renderPhotos,camera:renderCamera,notes:renderNotes,calendar:renderCalendar,map:renderMap,blackthorn:renderBlackthorn}[id]||renderHome)(c);
}

function renderMessages(c){
  const threads=visibleThreads(c);
  if(!threads.length) return shell('Messages',`<div class="searchBar">${searchIcon()}Search conversations</div>${empty('No conversations','There are no conversations on this phone yet.','messages')}`);
  const rows=threads.map((m,i)=>{
    const last=m.messages[m.messages.length-1]||{};
    return `<button class="thread" data-thread="${m._sourceIndex}"><span class="avatar">${esc((m.name||'?').slice(0,1))}</span><span class="threadMain"><span class="threadTop"><b>${esc(m.name)}</b><time>${esc(last.time||'')}</time></span><span class="threadPreview">${esc(last.text||'')}</span></span><span class="chevron">›</span></button>`;
  }).join('');
  shell('Messages',`<div class="searchBar">${searchIcon()}Search conversations</div><div class="listCard">${rows}</div>`);
  app.querySelectorAll('[data-thread]').forEach(b=>b.onclick=()=>renderThread(c,+b.dataset.thread));
}
function searchIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg>'}
function lastMessage(thread){const arr=visibleMessages(thread);return arr.length?arr[arr.length-1].text:''}
function storyChoiceKey(flowId){return `blackthorn-choice-${key}-${flowId}`}
function renderThread(c,index){
  const t=c.messages?.[index]; if(!t) return renderMessages(c);
  const msgs=visibleMessages(t);
  const html=msgs.map(m=>{
    const picked=m.flowId?localStorage.getItem(storyChoiceKey(m.flowId)):'';
    const choiceHtml=(m.choices||[]).length && picked==='' ? `<div class="replyChoices">${m.choices.map((x,i)=>`<button class="replyChoice" data-flow="${esc(m.flowId)}" data-i="${i}">${esc(x.label)}</button>`).join('')}</div>` : '';
    const pickedObj=picked!=='' ? (m.choices||[])[Number(picked)] : null;
    const replyHtml=pickedObj ? `<div class="bubbleRow mine"><div class="bubble choiceReply"><span class="bubbleSender">JOUW KEUZE</span><p>${esc(pickedObj.label)}</p></div></div>${pickedObj.reply?`<div class="bubbleRow theirs"><div class="bubble"><span class="bubbleSender">${esc(m.from||t.name)}</span><p>${esc(pickedObj.reply)}</p></div></div>`:''}` : '';
    return `<div class="bubbleRow ${m.from==='me'?'mine':'theirs'}"><div class="bubble">${m.from&&m.from!=='me'? `<span class="bubbleSender">${esc(m.from)}</span>` : ''}<p>${esc(m.text||'')}</p>${m.time?`<time>${esc(m.time)}</time>`:''}</div></div>${choiceHtml}${replyHtml}`;
  }).join('');
  shell(t.name||'Conversation',msgs.length?`<div class="conversation">${html}</div>`:empty('No messages','No messages are available at this point.','messages'));
  document.getElementById('back').textContent='‹ Messages';
  document.getElementById('back').onclick=()=>renderMessages(c);
  app.querySelectorAll('.replyChoice').forEach(b=>b.onclick=()=>{localStorage.setItem(storyChoiceKey(b.dataset.flow),b.dataset.i);renderThread(c,index)});
}
function renderCalls(c){
  const calls=visibleItems(c.calls);
  if(!calls.length) return shell('Calls',empty('No recent calls','There are no calls in the recent history.','calls'));
  shell('Calls',`<div class="listCard">${calls.map(x=>`<div class="callRow"><div class="callIcon">${icons.calls}</div><div class="callMeta"><b>${esc(x.name)}</b><span>${esc(x.type||'Call')}</span></div><time>${esc(x.time||'')}</time></div>`).join('')}</div>`);
}

const CALENDAR_WEEKS = [
  {id:'founders',label:'Founders Week',range:'6–12 OCT',days:[
    {dow:'MON',day:'06'},{dow:'TUE',day:'07'},{dow:'WED',day:'08'},{dow:'THU',day:'09'},{dow:'FRI',day:'10'},{dow:'SAT',day:'11'},{dow:'SUN',day:'12'}
  ]},
  {id:'week2',label:'Second Week',range:'13–19 OCT',days:[
    {dow:'MON',day:'13'},{dow:'TUE',day:'14'},{dow:'WED',day:'15'},{dow:'THU',day:'16'},{dow:'FRI',day:'17'},{dow:'SAT',day:'18'},{dow:'SUN',day:'19'}
  ]},
  {id:'week3',label:'Third Week',range:'20–26 OCT',days:[
    {dow:'MON',day:'20'},{dow:'TUE',day:'21'},{dow:'WED',day:'22'},{dow:'THU',day:'23'},{dow:'FRI',day:'24'},{dow:'SAT',day:'25'},{dow:'SUN',day:'26'}
  ]},
  {id:'week4',label:'Final Week',range:'27 OCT – 2 NOV',days:[
    {dow:'MON',day:'27'},{dow:'TUE',day:'28'},{dow:'WED',day:'29'},{dow:'THU',day:'30'},{dow:'FRI',day:'31'},{dow:'SAT',day:'01'},{dow:'SUN',day:'02'}
  ]}
];

function currentCalendarWeekIndex(){
  const s=currentStage();
  if(['FOUNDERS_MORNING','GETTING_READY','BALL','INCIDENT','WEEK1'].includes(s)) return 0;
  if(s==='WEEK2') return 1;
  if(s==='WEEK3') return 2;
  return 3;
}
function calendarDayKey(e){
  const m=String(e.date||'').match(/(?:MON|TUE|WED|THU|FRI|SAT|SUN)\s+(\d{2})\s+([A-Z]{3})/);
  if(!m) return '';
  return `${m[1]}-${m[2]}`;
}
function weekDayKey(day,weekIndex){
  const month=(weekIndex===3 && ['01','02'].includes(day.day))?'NOV':'OCT';
  return `${day.day}-${month}`;
}
function latestVisibleDayIndex(week,weekIndex,events){
  let latest=0;
  week.days.forEach((d,i)=>{
    if(events.some(e=>calendarDayKey(e)===weekDayKey(d,weekIndex))) latest=i;
  });
  return latest;
}

function renderCalendar(c){
  const events=visibleItems(c.calendar);
  if(!events.length) return shell('Calendar',empty('Nothing scheduled','No visible events are scheduled.','calendar'));

  let weekIndex=Number(sessionStorage.getItem(`blackthorn-calendar-week-${key}`));
  const maxWeek=currentCalendarWeekIndex();
  if(!Number.isInteger(weekIndex) || weekIndex<0 || weekIndex>maxWeek) weekIndex=maxWeek;

  const week=CALENDAR_WEEKS[weekIndex];
  let dayIndex=Number(sessionStorage.getItem(`blackthorn-calendar-day-${key}-${week.id}`));
  if(!Number.isInteger(dayIndex) || dayIndex<0 || dayIndex>6){
    dayIndex=latestVisibleDayIndex(week,weekIndex,events);
  }

  const selected=week.days[dayIndex];
  const selectedKey=weekDayKey(selected,weekIndex);
  const dayEvents=events.filter(e=>calendarDayKey(e)===selectedKey);
  const weekEvents=events.filter(e=>week.days.some(d=>weekDayKey(d,weekIndex)===calendarDayKey(e)));

  const dayStrip=week.days.map((d,i)=>{
    const k=weekDayKey(d,weekIndex);
    const count=events.filter(e=>calendarDayKey(e)===k).length;
    return `<button class="weekDay ${i===dayIndex?'active':''} ${count?'hasEvents':''}" data-day="${i}">
      <span class="weekDow">${d.dow}</span>
      <span class="weekNum">${d.day}</span>
      <span class="weekDots">${count?'<i></i>':''}</span>
    </button>`;
  }).join('');

  const schedule=dayEvents.length ? dayEvents.map((e,i)=>{
    const isSpecial=/Veiled Moon|Memorial|Summons|Processional|Reinspection/i.test(e.title||'');
    return `<article class="weekEvent ${isSpecial?'special':''}">
      <div class="weekTime">${esc(e.time||'')}</div>
      <div class="weekEventLine"><span></span></div>
      <div class="weekEventBody">
        <h3>${esc(e.title)}</h3>
        <div class="weekMeta">${esc(e.location||'')}</div>
        ${e.note?`<p>${esc(e.note)}</p>`:''}
      </div>
    </article>`;
  }).join('') : `<div class="calendarFree"><span>✦</span><h3>No scheduled classes</h3><p>This day is currently clear.</p></div>`;

  const visibleCount=weekEvents.length;
  const navLeft=weekIndex>0 ? '<button class="weekNav" data-week="-1" aria-label="Previous week">‹</button>' : '<span class="weekNav ghost"></span>';
  const navRight=weekIndex<maxWeek ? '<button class="weekNav" data-week="1" aria-label="Next week">›</button>' : '<span class="weekNav ghost"></span>';

  shell('Calendar',`
    <section class="weekCalendar">
      <div class="weekHeader">
        ${navLeft}
        <div class="weekTitle">
          <span class="weekKicker">BLACKTHORN ACADEMY</span>
          <h2>${week.label}</h2>
          <small>${week.range} · ${visibleCount} scheduled</small>
        </div>
        ${navRight}
      </div>
      <div class="weekStrip">${dayStrip}</div>
      <div class="dayHeading">
        <div>
          <span>${selected.dow}</span>
          <h3>${selected.day} ${weekIndex===3 && ['01','02'].includes(selected.day)?'NOV':'OCT'}</h3>
        </div>
        <div class="dayHeadingMark">✦</div>
      </div>
      <div class="weekSchedule">${schedule}</div>
    </section>
  `,`Week ${weekIndex+1}`);

  app.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{
    sessionStorage.setItem(`blackthorn-calendar-day-${key}-${week.id}`,b.dataset.day);
    renderCalendar(c);
  });
  app.querySelectorAll('[data-week]').forEach(b=>b.onclick=()=>{
    const next=Math.max(0,Math.min(maxWeek,weekIndex+Number(b.dataset.week)));
    sessionStorage.setItem(`blackthorn-calendar-week-${key}`,String(next));
    renderCalendar(c);
  });
}

function renderMap(c){
  const locations=visibleItems(c.mapLocations);
  shell('Map',`<div class="mapStage"><div class="mapPaper"></div><div class="mapBuilding"></div><div class="pin"></div><div class="mapCompass">✦</div><div class="mapLegend"><b>BLACKTHORN ACADEMY</b><span>Access information updates with Academy instructions</span></div></div><div class="sectionLabel">Locations</div><div class="listCard">${locations.map((l,i)=>`<div class="mapRow"><span class="mapDot"></span><span><b>${esc(l.name)}</b><small>${esc(l.status||'')}${l.description?' · '+esc(l.description):''}</small></span></div>`).join('')}</div>`);
}

function renderBlackthorn(c){
  const ann=visibleItems(c.announcements);
  shell('Blackthorn',`<div class="baHero"><div class="baCrest"><span>✦</span></div><div class="baKicker">EST. MDCCLXXXIII · FOUNDED UNDER THE VEILED STAR</div><h2>Blackthorn Academy</h2><p>Official academy portal · ${esc(c.name)}</p></div><div class="sectionLabel">Academy services</div><div class="baGrid"><button class="baTile" data-ba="announcements"><span class="mini">◇</span><b>Announcements</b><span>${ann.length} notice(s)</span></button><button class="baTile" data-ba="directory"><span class="mini">⌁</span><b>Directory</b><span>Students & staff</span></button><button class="baTile" data-ba="events"><span class="mini">◌</span><b>Events</b><span>Schedule & ball</span></button><button class="baTile" data-ba="access"><span class="mini">⌂</span><b>Access</b><span>Buildings & rooms</span></button></div><div class="sectionLabel">Latest</div>${ann.slice().reverse().slice(0,5).map(a=>`<div class="card"><h3>${esc(a.title)}</h3><p>${esc(a.body||'')}</p></div>`).join('')}</div>`);
  app.querySelectorAll('[data-ba]').forEach(b=>b.onclick=()=>renderBlackthornSection(c,b.dataset.ba));
}
function renderBlackthornSection(c,section){
  const cfg={
    announcements:['Announcements',visibleItems(c.announcements)],
    directory:['Directory',visibleItems(c.directory)],
    events:['Events',visibleItems(c.calendar)],
    access:['Access',visibleItems(c.mapLocations)]
  }[section];
  if(!cfg) return renderBlackthorn(c);
  const [title,items]=cfg;
  let body='';
  if(section==='announcements'){
    body=items.map(item=>`<div class="card"><h3>${esc(item.title)}</h3><p>${esc(item.body||'')}</p></div>`).join('');
  }else if(section==='directory'){
    body=items.map(item=>`<div class="card"><h3>${esc(item.name)}</h3><p><b>${esc(item.role||'')}</b>${item.base?' · '+esc(item.base):''}</p><p>${esc(item.description||'')}</p></div>`).join('');
  }else if(section==='events'){
    body=items.map(item=>`<div class="card"><h3>${esc(item.title)}</h3><p>${esc([item.date,item.time,item.location].filter(Boolean).join(' · '))}</p>${item.note?`<p>${esc(item.note)}</p>`:''}</div>`).join('');
  }else{
    body=items.map(item=>`<div class="card"><h3>${esc(item.name)}</h3><p><b>${esc(item.status||'')}</b></p><p>${esc(item.description||'')}</p></div>`).join('');
  }
  shell(title,body||empty('Nothing available','No entries are available at this stage.','blackthorn'));
  document.getElementById('back').textContent='‹ Blackthorn';
  document.getElementById('back').onclick=()=>renderBlackthorn(c);
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

function renderGM(c){
  const active=currentStage();
  shell('GM Controls',`<div class="card"><h3>Story stage</h3><p>Hidden production control for this device. Current stage: <b>${esc(active)}</b>.</p></div><div class="gmStages">${STAGES.map(s=>`<button class="gmStage ${s===active?'active':''}" data-stage="${s}">${s.replaceAll('_',' ')}</button>`).join('')}</div><div class="card"><p>Changing stage only changes what story content is visible on this character phone. Photos, Camera and Notes are not altered.</p></div>`);
  document.querySelectorAll('[data-stage]').forEach(b=>b.onclick=()=>{
    localStorage.setItem(stageKey(),b.dataset.stage);
    renderGM(c);
  });
}

function route(){
  stopCam();
  if(!(key&&DATA[key])) return renderPicker();
  const id=location.hash.replace('#','');
  if(id==='gm') return renderGM(DATA[key]);
  if(id&&icons[id]){
    const c=DATA[key],lock=c.locks?.[id];
    if(lock&&!isUnlocked(id)){history.replaceState({},'',`${location.pathname}${location.search}`);return renderHome(c)}
    return renderApp(c,id);
  }
  renderHome(DATA[key]);
}
window.addEventListener('popstate',route);window.addEventListener('pagehide',stopCam);Promise.resolve(window.BLACKTHORN_V63_READY).finally(route);
