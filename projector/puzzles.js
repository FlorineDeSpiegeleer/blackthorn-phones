(()=> {
const DATA=window.BLACKTHORN_PUZZLE_DATA||{};
const K='bt-puzzle-';
const owned=()=>{try{return JSON.parse(localStorage.getItem('bt-owned-evidence')||'[]')}catch{return[]}};
const setOwned=(ids)=>{const s=new Set(owned());ids.forEach(x=>s.add(x));localStorage.setItem('bt-owned-evidence',JSON.stringify([...s]));};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const done=m=>localStorage.getItem(K+m)==='1';
const setDone=m=>localStorage.setItem(K+m,'1');
const getJSON=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
const setJSON=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
function closeOverlay(){document.querySelector('.puzzleOverlay')?.remove()}
function overlay(inner){
  closeOverlay();
  const o=document.createElement('div');o.className='overlay puzzleOverlay';
  o.innerHTML=`<div class="modal puzzleModal">${inner}</div>`;
  document.body.appendChild(o);return o;
}
function finish(marker,msg,onComplete){
  setDone(marker);
  overlay(`<div class="kicker">PUZZLE VOLTOOID</div><h2>${esc(msg)}</h2><p class="modalBody">De gebruikte bronwaarden blijven ongewijzigd. Alleen jullie vastgelegde reconstructie wordt opgeslagen.</p><button id="puzzleClose">SLUIT</button>`);
  document.getElementById('puzzleClose').onclick=()=>{closeOverlay();onComplete?.()};
}
function button(marker,ready){
  if(!marker)return '';
  if(done(marker))return `<button class="puzzleButton done" data-puzzle="${esc(marker)}">PUZZLE VOLTOOID ✓</button>`;
  return `<button class="puzzleButton" data-puzzle="${esc(marker)}" ${ready?'':'disabled'}>${ready?'START '+esc(marker.replace('_READY','')):'DOSSIER NOG ONVOLLEDIG'}</button>`;
}
function bind(marker,ready,onComplete){
  const b=document.querySelector('[data-puzzle]');
  if(!b)return;
  b.onclick=()=>{if(ready)open(marker,onComplete)};
}
function open(marker,onComplete){
  if(marker==='P1_READY')return openP1(onComplete);
  if(marker==='P2_READY')return openP2(onComplete);
  if(marker==='P3_READY')return openP3(onComplete);
  if(marker==='P4_READY')return openP4(onComplete);
}
function p1State(){return getJSON(K+'P1-state',{round:1,wrong:0,tested:[],a:null,l:null,reason:false,n:4,dir:'LATER'})}
function p1ReasonEligible(a,l){
  const d=DATA.P1_READY,anchor=d.anchors.find(x=>x.id===a),row=d.legacyRows.find(x=>x.id===l),legend=d.readers.find(x=>x.code===row?.reader);
  return !!(anchor&&row&&legend?.mode==='public'&&legend.endpoints.includes(anchor.location));
}
function openP1(onComplete){
  const d=DATA.P1_READY,s=p1State(),have=new Set(owned()),anchors=d.anchors.filter(x=>have.has(x.evidence));
  const rows=d.legacyRows;
  const tested=new Set(s.tested);
  const html=`
  <div class="kicker">RECONSTRUCTIEBORD</div><h2>${esc(d.title)}</h2>
  <p class="modalBody">Kies één ankerbron en één ruwe legacy-rij die volgens jullie dezelfde fysieke doorgang kunnen beschrijven.</p>
  <div class="puzzleColumns">
    <section><h3>ANKERBRON</h3>${anchors.map(x=>`<button class="pickCard ${s.a===x.id?'selected':''}" data-pa="${x.id}"><small>${esc(x.kind)}</small><b>${esc(x.label)}</b><span>${x.time} · ${esc(x.location)}</span></button>`).join('')}</section>
    <section><h3>LEGACY EXPORT</h3><div class="legacyTable">${rows.map(x=>`<button class="legacyRow ${s.l===x.id?'selected':''} ${tested.has(x.id+'|'+s.a)?'tested':''}" data-pl="${x.id}"><span>${x.time}</span><span>${x.reader}</span><span>${x.credential}</span><span>${x.counter}</span><span>${x.event}</span></button>`).join('')}</div></section>
  </div>
  <details class="readerLegend"><summary>Reader Legend</summary>${d.readers.map(r=>`<div><b>${r.code}</b><span>${r.mode==='public'?esc(r.endpoints.join(' ↔ ')):esc(r.text)}</span></div>`).join('')}</details>
  <label class="reasonCheck"><input type="checkbox" id="p1reason" ${s.reason?'checked':''}> De zichtbare locatie van de ankerbron ligt op de doorgang van deze reader.</label>
  <div class="offsetRow"><span>De legacy-lezer loopt</span><input id="p1n" type="number" min="0" max="30" value="${Number(s.n)||0}"><span>minuten</span><select id="p1dir"><option ${s.dir==='LATER'?'selected':''}>LATER</option><option ${s.dir==='EERDER'?'selected':''}>EERDER</option></select><span>dan deze ankerbron.</span></div>
  <div id="p1feedback" class="puzzleFeedback">Ronde ${s.round} · ${s.wrong}/3 mislukte inzendingen</div>
  <div class="modalActions"><button id="p1compare">VERGELIJKINGSMODUS</button><button id="p1submit">TOETS RECONSTRUCTIE</button><button id="p1close">SLUIT</button></div>`;
  overlay(html);
  document.querySelectorAll('[data-pa]').forEach(b=>b.onclick=()=>{s.a=b.dataset.pa;s.reason=false;setJSON(K+'P1-state',s);openP1(onComplete)});
  document.querySelectorAll('[data-pl]').forEach(b=>b.onclick=()=>{s.l=b.dataset.pl;s.reason=false;setJSON(K+'P1-state',s);openP1(onComplete)});
  document.getElementById('p1reason').onchange=e=>{s.reason=e.target.checked;setJSON(K+'P1-state',s)};
  document.getElementById('p1n').onchange=e=>{s.n=Number(e.target.value);setJSON(K+'P1-state',s)};
  document.getElementById('p1dir').onchange=e=>{s.dir=e.target.value;setJSON(K+'P1-state',s)};
  document.getElementById('p1close').onclick=closeOverlay;
  document.getElementById('p1compare').onclick=()=>openP1Compare(onComplete);
  document.getElementById('p1submit').onclick=()=>{
    const fb=document.getElementById('p1feedback');
    if(!s.a||!s.l){fb.textContent='Kies eerst twee kaarten.';return}
    if(!s.reason){fb.textContent='Bevestig eerst de zichtbare-field reden.';return}
    if(!p1ReasonEligible(s.a,s.l)){fb.textContent='Deze twee kaarten delen volgens de zichtbare readerlegenda geen locatie-overlap.';return}
    const pair=s.a+'|'+s.l;
    if(s.tested.includes(pair)){fb.textContent='GETEST DEZE RONDE';return}
    const norm=(s.dir==='LATER'?1:-1)*Number(s.n);
    const ok=d.accepted.some(x=>x.anchor===s.a&&x.legacy===s.l&&x.offset===norm);
    if(ok){
      localStorage.setItem('bt-p1-offset',String(norm));
      localStorage.setItem('bt-p1-corrected','1');
      finish('P1_READY','RECONSTRUCTIE TOEGEPAST',onComplete);return;
    }
    s.wrong++;s.tested.push(pair);setJSON(K+'P1-state',s);
    const eligible=[];
    anchors.forEach(a=>rows.forEach(r=>{if(p1ReasonEligible(a.id,r.id))eligible.push(a.id+'|'+r.id)}));
    const remaining=eligible.some(p=>!s.tested.includes(p));
    if(s.wrong>=3||!remaining){openP1Compare(onComplete);return}
    fb.textContent='Deze combinatie levert nog geen consistente reconstructie op. Bekijk de bronnen opnieuw.';
  };
}
function openP1Compare(onComplete){
  const d=DATA.P1_READY,s=p1State(),have=new Set(owned()),anchors=d.anchors.filter(x=>have.has(x.evidence));
  overlay(`<div class="kicker">VERGELIJKINGSMODUS</div><h2>Alleen zichtbare bronvelden</h2>
  <div class="compareGrid"><section><h3>Ankerbronnen</h3>${anchors.map(a=>`<article><b>${esc(a.label)}</b><span>${a.time}</span><span>${esc(a.location)}</span></article>`).join('')}</section>
  <section><h3>Legacy-rijen</h3>${d.legacyRows.map(r=>`<article><b>${r.time} · ${r.reader}</b><span>${r.credential}</span><span>${r.counter} · ${r.event}</span></article>`).join('')}</section></div>
  <p class="modalBody">Vergelijk tijd, reader en zichtbare locatie. Er wordt geen verborgen identiteit of gecorrigeerde tijd getoond.</p>
  <button id="p1newround">SLUIT VERGELIJKING · NIEUWE RONDE</button>`);
  document.getElementById('p1newround').onclick=()=>{s.round++;s.wrong=0;s.tested=[];setJSON(K+'P1-state',s);openP1(onComplete)};
}

function openP2(onComplete){
  const d=DATA.P2_READY,s=getJSON(K+'P2-state',{last:'',next:'',route:'',duration:2,access:[]});
  const access=new Set(s.access||[]);
  overlay(`<div class="kicker">CABINET WINDOW</div><h2>${esc(d.title)}</h2>
  <div class="puzzleQuadrants">
   <section><h3>1 · CABINET BASELINE</h3><label>Laatste bevestigd ongeopend<select id="p2last"><option value="">— kies —</option>${d.baselineLast.map(x=>`<option ${s.last===x?'selected':''}>${x}</option>`).join('')}</select></label><label>Eerste latere lezing met één tussenliggende opening<select id="p2next"><option value="">— kies —</option>${d.baselineNext.map(x=>`<option ${s.next===x?'selected':''}>${x}</option>`).join('')}</select></label></section>
   <section><h3>2 · CORRECTED ACCESS</h3>${d.routes.map(r=>`<label class="radioCard"><input type="radio" name="route" value="${r.id}" ${s.route===r.id?'checked':''}>${r.label}</label>`).join('')}</section>
   <section><h3>3 · ACCESS RIGHTS</h3>${d.accessTypes.map(a=>`<label class="checkCard"><input type="checkbox" data-access="${a.id}" ${access.has(a.id)?'checked':''}>${esc(a.label)}</label>`).join('')}</section>
   <section><h3>4 · PROCEDURE DURATION</h3><label>Minimumduur<select id="p2dur">${d.durations.map(n=>`<option value="${n}" ${Number(s.duration)===n?'selected':''}>${n} minuten</option>`).join('')}</select></label></section>
  </div>
  <div id="p2feedback" class="puzzleFeedback">De validator beoordeelt interval, route, toegangstypen en duur — geen namen.</div>
  <div class="modalActions"><button id="p2submit">LOCK OPPORTUNITY PROFILE</button><button id="p2close">SLUIT</button></div>`);
  const persist=()=>{
    s.last=document.getElementById('p2last').value;s.next=document.getElementById('p2next').value;s.duration=Number(document.getElementById('p2dur').value);
    s.route=document.querySelector('input[name="route"]:checked')?.value||'';
    s.access=[...document.querySelectorAll('[data-access]:checked')].map(x=>x.dataset.access);setJSON(K+'P2-state',s);
  };
  document.querySelectorAll('select,input').forEach(x=>x.onchange=persist);
  document.getElementById('p2close').onclick=closeOverlay;
  document.getElementById('p2submit').onclick=()=>{
    persist();const fb=document.getElementById('p2feedback'),route=d.routes.find(x=>x.id===s.route),A=new Set(s.access);
    if(s.last!=='20:50'||s.next!=='21:10'){fb.textContent='De gekozen cabinet-lezingen vormen nog geen consistente baseline.';return}
    if(!route?.ok){fb.textContent='Deze passage kan de minimumhandeling niet volledig ná de laatste ongeopende lezing en vóór de latere lezing bevatten.';return}
    if(s.duration!==2){fb.textContent='De gekozen minimumduur komt niet overeen met de vrijgegeven procedure.';return}
    if(!(A.has('cabinet_key')&&A.has('route_credential'))||A.has('photo_badge')||A.has('council_permission')){fb.textContent='Welke soorten toegang moest dezelfde uitvoerder kunnen combineren?';return}
    localStorage.setItem('bt-p2-route',route.label);localStorage.setItem('bt-p2-profile','1');
    finish('P2_READY','OPPORTUNITY PROFILE COMPLETE',onComplete);
  };
}

function p3State(){return getJSON(K+'P3-state',{rowan:false,gideon:false})}
function openP3(onComplete){
  const d=DATA.P3_READY,s=p3State();
  overlay(`<div class="kicker">EXCLUSION BOARD</div><h2>${esc(d.title)}</h2>
  <p class="modalBody">Bouw objectieve tegenspraken. De game markeert niemand als “onschuldig”.</p>
  <div class="laneGrid">
    <button class="laneCard ${s.rowan?'done':''}" id="laneRowan"><b>ROWAN KESTREL</b><span>${s.rowan?'Route uitgesloten ✓':'Test markerpaar + route'}</span></button>
    <button class="laneCard ${s.gideon?'done':''}" id="laneGideon"><b>GIDEON BELL</b><span>${s.gideon?'Route uitgesloten ✓':'Test credential + cabinet-window'}</span></button>
  </div>
  ${s.rowan&&s.gideon?'<div class="puzzleFeedback success">Beide verplichte lanes zijn onderbouwd.</div>':'<div class="puzzleFeedback">Beide verplichte lanes moeten geldig zijn.</div>'}
  <div class="modalActions">${s.rowan&&s.gideon?'<button id="p3finish">EXCLUSION BOARD VOLTOOIEN</button>':''}<button id="p3close">SLUIT</button></div>`);
  document.getElementById('laneRowan').onclick=()=>openP3Rowan(onComplete);
  document.getElementById('laneGideon').onclick=()=>openP3Gideon(onComplete);
  document.getElementById('p3close').onclick=closeOverlay;
  const f=document.getElementById('p3finish');if(f)f.onclick=()=>{localStorage.setItem('bt-p3-board','1');finish('P3_READY','EXCLUSION BOARD COMPLETE',onComplete)};
}
function openP3Rowan(onComplete){
  const d=DATA.P3_READY.rowan;
  overlay(`<div class="kicker">MANDATORY LANE</div><h2>ROWAN KESTREL</h2>
  <div class="puzzleQuadrants">
   <section><h3>MARKER A</h3><select id="rA"><option>— kies —</option>${d.markerA.map(x=>`<option>${x}</option>`).join('')}</select></section>
   <section><h3>TARGET</h3><select id="rT"><option>— kies —</option>${d.targets.map(x=>`<option>${x}</option>`).join('')}</select></section>
   <section><h3>MARKER B</h3><select id="rB"><option>— kies —</option>${d.markerB.map(x=>`<option>${x}</option>`).join('')}</select></section>
   <section><h3>MINIMUM ACTIE</h3><select id="rD">${d.durations.map(x=>`<option value="${x}">${x} min</option>`).join('')}</select></section>
  </div><div id="rf" class="puzzleFeedback">Gebruik alleen de al vrijgegeven cameramarkers en routegeometrie.</div>
  <div class="modalActions"><button id="rtest">TEST RECONSTRUCTIE</button><button id="rback">TERUG</button></div>`);
  document.getElementById('rback').onclick=()=>openP3(onComplete);
  document.getElementById('rtest').onclick=()=>{
    const ok=document.getElementById('rA').value==='20:56 — Conservation Room'&&document.getElementById('rB').value==='21:04 — Conservation Room'&&document.getElementById('rT').value==='Staff Mask Alcove'&&Number(document.getElementById('rD').value)===2;
    if(!ok){document.getElementById('rf').textContent='Deze combinatie vormt nog geen geldige route-tegenspraak.';return}
    const s=p3State();s.rowan=true;setJSON(K+'P3-state',s);document.getElementById('rf').textContent='Deze reconstructie sluit deze route uit.';setTimeout(()=>openP3(onComplete),450);
  };
}
function openP3Gideon(onComplete){
  const d=DATA.P3_READY.gideon;
  overlay(`<div class="kicker">MANDATORY LANE</div><h2>GIDEON BELL</h2>
  <section class="stack"><h3>1 · GEACCEPTEERDE CREDENTIALSET</h3>${d.credentials.map(c=>`<label class="checkCard"><input type="checkbox" data-gc="${c.id}">${c.label}</label>`).join('')}</section>
  <section class="stack"><h3>2 · KORTE GEREGISTREERDE VISIT</h3><select id="gshort"><option>— kies —</option>${d.shortVisits.map(x=>`<option>${x}</option>`).join('')}</select><div class="inlineRadios"><label><input type="radio" name="gfit" value="yes"> uitvoerbaar</label><label><input type="radio" name="gfit" value="no"> niet uitvoerbaar</label></div></section>
  <section class="stack"><h3>3 · LATERE GIDEON-CREDENTIAL VISIT 20:53–21:09</h3><select id="glater"><option>— kies —</option>${d.laterVisits.map(x=>`<option>${x}</option>`).join('')}</select></section>
  <div id="gf" class="puzzleFeedback">Andere credentials blijven zichtbaar maar tellen niet als Gideon-lane.</div>
  <div class="modalActions"><button id="gtest">TEST LANE</button><button id="gback">TERUG</button></div>`);
  document.getElementById('gback').onclick=()=>openP3(onComplete);
  document.getElementById('gtest').onclick=()=>{
    const C=new Set([...document.querySelectorAll('[data-gc]:checked')].map(x=>x.dataset.gc));
    const exact=C.size===2&&C.has('SERVICE')&&C.has('SERVICE-MASTER');
    const ok=exact&&document.getElementById('gshort').value==='20:50 → 20:52'&&document.querySelector('input[name="gfit"]:checked')?.value==='no'&&document.getElementById('glater').value==='Geen geregistreerde Gideon-route';
    if(!ok){document.getElementById('gf').textContent='Deze combinatie onderbouwt de Gideon-lane nog niet volledig.';return}
    const s=p3State();s.gideon=true;setJSON(K+'P3-state',s);document.getElementById('gf').textContent='Gideons geregistreerde cabinet-route bevat geen uitvoerbare opening binnen het vastgelegde venster.';setTimeout(()=>openP3(onComplete),550);
  };
}

function inspectionComplete(){return localStorage.getItem(K+'mask-inspection')==='1'}
function openMaskInspection(onComplete){
  const d=DATA.P4_READY,state=getJSON(K+'mask-details',{maskA:[],maskB:[],maskC:[]});
  overlay(`<div class="kicker">OBJECTINSPECTIE</div><h2>THREE RECOVERED / DOCUMENTED MASKS — DETAILS</h2>
  <div class="maskGrid">${d.masks.map(m=>`<section><h3>${esc(m.label)}</h3>${d.details.map(det=>`<button class="detailBtn ${state[m.id].includes(det)?'seen':''}" data-mask="${m.id}" data-detail="${esc(det)}">${esc(det)}</button>`).join('')}</section>`).join('')}</div>
  <div id="maskfeedback" class="puzzleFeedback">Open alle vijf onderdelen van Masker B.</div>
  <div class="modalActions"><button id="maskDone">KLAAR</button><button id="maskClose">SLUIT</button></div>`);
  document.querySelectorAll('[data-mask]').forEach(b=>b.onclick=()=>{
    const m=b.dataset.mask,det=b.dataset.detail;if(!state[m].includes(det))state[m].push(det);setJSON(K+'mask-details',state);
    const fb=document.getElementById('maskfeedback');
    if(det==='inner lining'&&m==='maskB'){setOwned(['label_remnant']);fb.textContent='Labelrest — binnenvoering toegevoegd aan dossier.'}
    else if(det==='inner lining'){fb.textContent='Geen labelrest zichtbaar.'}
    else fb.textContent='Detail geopend: '+det+'.';
    b.classList.add('seen');
  });
  document.getElementById('maskClose').onclick=closeOverlay;
  document.getElementById('maskDone').onclick=()=>{
    const all=d.details.every(x=>state.maskB.includes(x)),have=new Set(owned());
    if(!all||!have.has('label_remnant')){document.getElementById('maskfeedback').textContent='Er zijn nog onderdelen van deze objectinspectie die niet geopend zijn.';return}
    localStorage.setItem(K+'mask-inspection','1');closeOverlay();onComplete?.();
  };
}
function p4AvailableCards(){
  const d=DATA.P4_READY,have=new Set(owned());
  return d.cards.filter(c=>{
    if(c.id==='p1_chronology')return localStorage.getItem('bt-p1-corrected')==='1';
    if(c.id==='p2_profile')return localStorage.getItem('bt-p2-profile')==='1';
    if(c.id==='p3_board')return localStorage.getItem('bt-p3-board')==='1';
    return have.has(c.id);
  });
}
function normalizePair(a,b){return [a,b].sort().join('|')}
function openP4(onComplete){
  if(!inspectionComplete())return openMaskInspection(onComplete);
  const d=DATA.P4_READY,cards=p4AvailableCards(),s=getJSON(K+'P4-state',{OBJECT:[],DOCUMENT:[],ACCESS:[],TIMELINE:[],valid:{}});
  const cats=['OBJECT','DOCUMENT','ACCESS','TIMELINE'];
  overlay(`<div class="kicker">THEORY BOARD</div><h2>${esc(d.title)}</h2><p class="modalBody">Koppel per categorie twee kaarten waarvan de zichtbare relatie door jullie dossier wordt ondersteund.</p>
  <div class="theoryGrid">${cats.map(cat=>`<section><h3>${cat} ${s.valid[cat]?'✓':''}</h3><div class="theoryCards">${cards.filter(c=>c.types.includes(cat)).map(c=>`<label class="checkCard"><input type="checkbox" data-theory="${cat}" value="${c.id}" ${(s[cat]||[]).includes(c.id)?'checked':''}>${esc(c.label)}</label>`).join('')}</div><button data-validate-cat="${cat}">TOETS RELATIE</button><div class="catFeedback" id="fb-${cat}">${s.valid[cat]?'Relatie ondersteund.':'Nog niet getoetst.'}</div></section>`).join('')}</div>
  <div id="p4feedback" class="puzzleFeedback">Minstens drie unieke evidence-kaarten én één ondersteunde relatie in elke categorie.</div>
  <div class="modalActions"><button id="p4finish">THEORY BOARD VOLTOOIEN</button><button id="p4close">SLUIT</button></div>`);
  document.querySelectorAll('[data-theory]').forEach(x=>x.onchange=()=>{
    const cat=x.dataset.theory;const chosen=[...document.querySelectorAll(`[data-theory="${cat}"]:checked`)].map(y=>y.value);
    if(chosen.length>2){x.checked=false;return}
    s[cat]=chosen;s.valid[cat]=false;setJSON(K+'P4-state',s);document.getElementById('fb-'+cat).textContent='Opnieuw toetsen.';
  });
  document.querySelectorAll('[data-validate-cat]').forEach(b=>b.onclick=()=>{
    const cat=b.dataset.validateCat,pair=(s[cat]||[]);
    if(pair.length!==2){document.getElementById('fb-'+cat).textContent='Kies precies twee kaarten.';return}
    const accepted=(d.acceptedPairs[cat]||[]).some(p=>normalizePair(...p)===normalizePair(...pair));
    s.valid[cat]=accepted;setJSON(K+'P4-state',s);
    document.getElementById('fb-'+cat).textContent=accepted?'Relatie ondersteund.':'Deze combinatie ondersteunt de gekozen relatie nog niet.';
  });
  document.getElementById('p4close').onclick=closeOverlay;
  document.getElementById('p4finish').onclick=()=>{
    const uniq=new Set(cats.flatMap(c=>s[c]||[]));const all=cats.every(c=>s.valid[c]);
    if(!all||uniq.size<3){document.getElementById('p4feedback').textContent='De theory board is nog niet compleet.';return}
    localStorage.setItem('bt-p4-board','1');finish('P4_READY','THEORY BOARD COMPLETE — ACCUSATION AVAILABLE',onComplete);
  };
}

window.BlackthornPuzzles={
  button,bind,open,isComplete:done,
  needsInspection:()=>!inspectionComplete(),
  openMaskInspection
};
})();