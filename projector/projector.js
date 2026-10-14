const root=document.getElementById('projector');
const gm=document.getElementById('gmPanel');
const sceneJump=document.getElementById('sceneJump');
let SCENES=[],sceneIndex=0;
function safe(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function splitParts(s){return String(s||'').split('||').map(x=>x.trim()).filter(Boolean)}
function choiceParts(s){return splitParts(s).map(x=>{const i=x.indexOf('->');return i<0?{label:x,reply:''}:{label:x.slice(0,i).trim(),reply:x.slice(i+2).trim()}})}
function current(){return SCENES[sceneIndex]||{}}
function next(){if(sceneIndex<SCENES.length-1){sceneIndex++;save();render()}}
function prev(){if(sceneIndex>0){sceneIndex--;save();render()}}
function save(){localStorage.setItem('blackthorn-projector-v63-scene',String(sceneIndex))}
function progress(){return `<div class="progress">${SCENES.map((_,i)=>`<span class="dot ${i===sceneIndex?'active':''}"></span>`).join('')}</div>`}
function render(){
 const s=current(); if(!s.scene_id){root.innerHTML='<section class="stage no-image"></section>';return;}
 const img=(window.BLACKTHORN_SCENE_IMAGE_MAP||{})[s.scene_id];
 let html=`<section class="stage ${img?'':'no-image'}"${img?` style="background-image:url('${img}')"`:''}><div class="wrap"><div class="location">${safe(s.display_location||'BLACKTHORN ACADEMY')}</div><div class="main">`;
 if(s.kicker)html+=`<div class="scene-kicker">${safe(s.kicker)}</div>`;
 if(s.title)html+=`<h1 class="title">${safe(s.title)}</h1>`;
 if(s.player_body)html+=`<p class="subtitle">${safe(s.player_body)}</p>`;
 if(s.npc_and_shared_reactions)html+=`<div class="dialogue-card bt-lines">${splitParts(s.npc_and_shared_reactions).map(x=>`<p class="quote">${safe(x)}</p>`).join('')}</div>`;
 const choices=choiceParts(s.shared_interactions);
 if(choices.length){html+=`<div class="choices">${choices.map((c,i)=>`<button class="choice" data-choice="${i}">${safe(c.label)}</button>`).join('')}</div>`;}
 if(s.window)html+=`<div class="phone-wait"><b>PRIVÉVENSTER ${safe(s.window)}</b><span>De persoonlijke inhoud loopt op de telefoons.</span></div>`;
 if(s.team_task_sequence)html+=`<div class="dialogue-card team-card"><div class="speaker">TEAMTAKEN</div>${splitParts(s.team_task_sequence).map(x=>`<p>${safe(x)}</p>`).join('')}</div>`;
 if(s.puzzle_marker)html+=`<div class="marker">DOSSIERSTAP • ${safe(s.puzzle_marker.replace('_READY',''))}</div>`;
 if(s.pause_after)html+=`<div class="marker pause">PAUZE • ${safe(s.pause_after.replace('_OPTIONAL',''))}</div>`;
 html+=`<div class="choices navChoices"><button class="choice" id="prevBtn">← VORIGE</button><button class="choice" id="nextBtn">VOLGENDE →</button></div></div><div class="footer">${progress()}<div class="hint">V6.3 productielaag • G = GM</div></div></div></section>`;
 root.innerHTML=html;
 root.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{const c=choices[+b.dataset.choice];if(c.reply){const d=document.createElement('div');d.className='dialogue-card reply-card';d.innerHTML=`<p class="quote">${safe(c.reply)}</p>`;b.closest('.choices').insertAdjacentElement('beforebegin',d);}root.querySelectorAll('[data-choice]').forEach(x=>x.disabled=true)});
 document.getElementById('prevBtn').onclick=prev;document.getElementById('nextBtn').onclick=next;if(sceneJump)sceneJump.value=String(sceneIndex);
}
function rebuildJump(){if(!sceneJump)return;sceneJump.innerHTML=SCENES.map((s,i)=>`<option value="${i}">${safe(s.scene_id)} — ${safe(s.title||s.stage)}</option>`).join('');sceneJump.onchange=()=>{sceneIndex=+sceneJump.value;save();render()}}
document.getElementById('prevStep').onclick=prev;document.getElementById('nextStep').onclick=next;document.getElementById('resetScene').onclick=()=>{sceneIndex=0;save();render()};document.getElementById('gmClose').onclick=()=>gm.hidden=true;
document.addEventListener('keydown',e=>{if(e.key==='g'||e.key==='G')gm.hidden=!gm.hidden;if(e.key==='ArrowRight')next();if(e.key==='ArrowLeft')prev()});
Promise.resolve(window.BLACKTHORN_PROJECTOR_READY).then(()=>{SCENES=window.BLACKTHORN_SCENES_V63||[];sceneIndex=Math.max(0,Math.min(SCENES.length-1,Number(localStorage.getItem('blackthorn-projector-v63-scene')||0)));rebuildJump();render();}).catch(err=>{root.innerHTML=`<section class="stage no-image"><div class="wrap"><div></div><div class="main"><h1 class="title">Projector data kon niet laden</h1><p class="subtitle">${safe(err.message)}</p></div><div></div></div></section>`;});