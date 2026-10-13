const SCENES = [
  {
    id:'A0', label:'A0 — Suite 417',
    image:'assets/guest_suite_getting_ready.png',
    steps:[
      {type:'title',location:'BLACKTHORN ACADEMY • GUEST SUITE 417',kicker:'FOUNDERS’ WEEK',title:'THE NIGHT OF THE VEILED MOON',subtitle:'De gastenprocessie sluit om 20:15. Jullie vertrekken vanuit Suite 417.'},
      {type:'title',location:'BLACKTHORN ACADEMY • GUEST SUITE 417',kicker:'VERTREK',title:'20:14',subtitle:'Jullie verlaten Suite 417.'},
      {type:'transition',from:'GUEST SUITE 417',to:'GRAND STAIR CHECKPOINT'}
    ]
  },
  {
    id:'A1', label:'A1 — Grand Stair',
    image:'assets/grand_stair_arrival.png',
    steps:[
      {type:'narration',location:'BLACKTHORN ACADEMY • GRAND STAIR CHECKPOINT',text:'Regen tikt tegen de hoge ramen. Het ceremoniële koord is al gesloten; de laatste processiegasten zijn uit zicht.'},
      {type:'dialogue',location:'BLACKTHORN ACADEMY • GRAND STAIR CHECKPOINT',speaker:'GIDEON BELL',text:'Goedenavond. Jullie komen na de processiesluiting binnen. Mag ik jullie namen?',choices:[
        {label:'ANTWOORD IN JULLIE EIGEN WOORDEN',reply:'Dank u. Ik schrijf jullie als één late aankomstgroep in.'}
      ]},
      {type:'private',location:'BLACKTHORN ACADEMY • GRAND STAIR CHECKPOINT',title:'PRIVÉMOMENTEN',subtitle:'Florine krijgt een privégesprek. Maxine en Sam krijgen elk hun eigen telefoonactiviteit.'},
      {type:'transition',from:'GRAND STAIR CHECKPOINT',to:'RECEPTION ARCADE'},
      {type:'private',location:'BLACKTHORN ACADEMY • RECEPTION ARCADE',title:'PRIVÉMOMENT',subtitle:'Sam krijgt een privégesprek op haar telefoon.'},
      {type:'transition',from:'RECEPTION ARCADE',to:'GRAND HALL BALLROOM'}
    ]
  },
  {
    id:'A2', label:'A2 — Ballroom',
    image:'assets/grand_hall_masked_ball.png',
    steps:[
      {type:'narration',location:'BLACKTHORN ACADEMY • GRAND HALL BALLROOM',text:'Warm koperlicht, gemaskerde gasten, een strijkensemble en het constante geroezemoes van Founders’ Week.'},
      {type:'dialogue',location:'BLACKTHORN ACADEMY • GRAND HALL BALLROOM',speaker:'PROFESSOR ALDOUS VEYNE',text:'Als je te laat komt, doe het dan tenminste zo dat iemand het onthoudt. De helft van deze zaal heeft jaren geoefend om stipt onopvallend te zijn.',choices:[
        {label:'LAAT HEM VERDERGAAN',reply:'Blackthorn houdt het meest van protocol wanneer niemand vraagt welk probleem dat protocol ooit moest oplossen.'}
      ]},
      {type:'dialogue',location:'BLACKTHORN ACADEMY • GRAND HALL BALLROOM',speaker:'PROFESSOR CELESTE ROOK',text:'Welkom op Blackthorn. Geloof niemand die beweert dat Founders’ Week normaal rustiger verloopt. Die persoon beschermt het merk.',choices:[
        {label:'VRAAG WAT ZE DOCEERT',reply:'Ritual History. In de praktijk betekent dat vooral aantonen dat tradities ooit praktische beslissingen van vermoeide mensen waren.'},
        {label:'VRAAG OF ZE VAN HET BAL GENIET',reply:'In zorgvuldig afgemeten porties. Ik verkies de momenten waarop mensen even vergeten dat ze een familienaam vertegenwoordigen.'},
        {label:'ANTWOORD IN JE EIGEN WOORDEN',reply:'Dan laat ik jouw woorden staan.'}
      ]},
      {type:'private',location:'BLACKTHORN ACADEMY • GRAND HALL BALLROOM',title:'PRIVÉGESPREKKEN',subtitle:'De drie telefoons lopen nu tegelijk. De beamer blijft op de balzaal.'},
      {type:'activity',location:'BLACKTHORN ACADEMY • GRAND HALL BALLROOM',title:'KIES HOE JULLIE DE VOLGENDE MINUTEN DOORBRENGEN',choices:['GROEPSFOTO','MASKERDISPLAY','IETS DRINKEN','KIJK ROND'],nonBlocking:true}
    ]
  },
  {
    id:'A3', label:'A3 — Incident',
    image:'assets/observatory_gallery_night.png',
    steps:[
      {type:'title',location:'BLACKTHORN ACADEMY',kicker:'FOUNDERS’ WEEK',title:'PROGRAMMA ONDERBROKEN',subtitle:''},
      {type:'transition',from:'GRAND HALL BALLROOM',to:'OBSERVATORY GALLERY'},
      {type:'narration',location:'BLACKTHORN ACADEMY • OBSERVATORY GALLERY',text:'Staff bewaakt de gallery. Gasten blijven buiten de gemarkeerde inspectiezone.'},
      {type:'dialogue',location:'BLACKTHORN ACADEMY • OBSERVATORY GALLERY',speaker:'HEADMISTRESS BLACKTHORN',text:'Jullie staan in de late registratie en op publiek eventmateriaal. Dat maakt jullie bruikbaar als onafhankelijke getuigen.',choices:[
        {label:'VERDER',reply:'Jullie krijgen een beperkte incidentmap. Als jullie een conclusie trekken, wil ik de bron erbij zien.'}
      ]},
      {type:'dialogue',location:'BLACKTHORN ACADEMY • OBSERVATORY GALLERY',speaker:'HEADMISTRESS BLACKTHORN',text:'Jullie mogen één vraag stellen voor de inspectie begint.',choices:[
        {label:'VRAAG NAAR TOEGANG TOT AFGESLOTEN ZONES',reply:'Toegang is verspreid over credentials, fysieke sleutels en tijdelijke uitgiftes. Jullie krijgen de registers die voor deze incidentmap zijn vrijgegeven.'},
        {label:'VRAAG NAAR DE ONTDEKKING',reply:'De gallery is na de onderbreking gecontroleerd en vervolgens afgesloten. De eerste scènebeschrijving blijft zoals ze werd aangetroffen.'},
        {label:'VRAAG WAAROM JULLIE DOSSIERTOEGANG KRIJGEN',reply:'Omdat jullie onafhankelijk van de Academy-structuur zijn en al vóór de lockdown in meerdere publieke ruimtes geregistreerd stonden.'},
        {label:'STEL ZELF EEN VRAAG',reply:'Als het bevestigd is in de incidentmap, krijgen jullie de bron. Wat niet bevestigd is, vul ik niet in.'}
      ]}
    ]
  },
  {
    id:'A4', label:'A4 — Inspectie',
    image:'assets/investigation_scene_wide.png',
    steps:[
      {type:'details',location:'BLACKTHORN ACADEMY • OBSERVATORY GALLERY • BEPERKTE INSPECTIE',title:'OPEN DE DETAILS-LIJST',details:[
        {title:'BRANDYGLAS',body:'Helder drinkglas, kleine hoeveelheid amberkleurige vloeistof, geen zichtbare breuk.'},
        {title:'CEREMONIEEL MASKER',body:'Ceremonieel masker naast Veyne. Gelakte buitenzijde en zichtbare sluiting.'},
        {title:'WYCLIFFE-REFERENTIEBLAD',body:'Archief-/Council-referentieblad met Wycliffe-identificatie.'}
      ]},
      {type:'transition',from:'OBSERVATORY GALLERY',to:'INCIDENT INTERVIEW ROOM'}
    ]
  },
  {
    id:'A5', label:'A5 — Gideon / archief',
    image:'assets/grand_hall_side_room.png',
    steps:[
      {type:'dialogue',location:'BLACKTHORN ACADEMY • INCIDENT INTERVIEW ROOM',speaker:'GIDEON BELL',text:'Ik hield de late processie bij en werkte daarna verder bij Event Logistics. Vraag per onderwerp; dan hou ik mijn eigen herinnering en het papier uit elkaar.',choices:[
        {label:'LATE AANKOMST',reply:'Dit is het papieren log van het checkpoint. Ik heb het zelf ingevuld.'},
        {label:'DIENSTBEWEGINGEN',reply:'Dit is mijn getekende sightline-verklaring. Ze zegt alleen wat ik vanaf mijn route kon zien.'},
        {label:'MASK STATION',reply:'Voor het Mask Station bestaan aparte eventrecords. Ik kan ze tonen zodra die bron in jullie ronde openstaat.'},
        {label:'STEL ZELF EEN VRAAG',reply:'Als ik het zelf gezien of geregistreerd heb, geef ik de bron. Anders zeg ik dat ik het niet weet.'}
      ]},
      {type:'archives',location:'BLACKTHORN ACADEMY • INCIDENT INTERVIEW ROOM',title:'KIES ÉÉN ARCHIEF',archives:[
        {title:'EVENT PHOTOGRAPHY',subtitle:'Isolde Maren — chronologisch eventalbum',reply:'Geef me een tijdvak, geen theorie. Mijn album staat op opnamevolgorde.'},
        {title:'EVENT LOGISTICS',subtitle:'Alleen-lezen eventrecords',reply:'De vrijgegeven logistieke documenten worden geopend.'}
      ]}
    ]
  }
];

let sceneIndex=0, stepIndex=0;
const root=document.getElementById('projector');
const gm=document.getElementById('gmPanel');
const jump=document.getElementById('sceneJump');
SCENES.forEach((s,i)=>jump.add(new Option(s.label,i)));
jump.onchange=()=>{sceneIndex=+jump.value;stepIndex=0;render()};
document.getElementById('gmClose').onclick=()=>gm.hidden=true;
document.getElementById('prevStep').onclick=()=>prev();
document.getElementById('nextStep').onclick=()=>next();
document.getElementById('resetScene').onclick=()=>{stepIndex=0;render()};
window.addEventListener('keydown',e=>{
  if(e.key.toLowerCase()==='g' && !/input|textarea|select/i.test(document.activeElement?.tagName||'')) gm.hidden=!gm.hidden;
  if(e.key==='ArrowRight' && gm.hidden) next();
  if(e.key==='ArrowLeft' && gm.hidden) prev();
});

function current(){return SCENES[sceneIndex]}
function step(){return current().steps[stepIndex]}
function safe(s){return String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function stageOpen(s){
  return `<section class="stage" style="background-image:url('${current().image}')"><div class="wrap"><div class="location">${safe(s.location||'BLACKTHORN ACADEMY')}</div><div class="main">`;
}
function foot(){
  const dots=current().steps.map((_,i)=>`<i class="dot ${i===stepIndex?'active':''}"></i>`).join('');
  return `</div><div class="footer"><div class="progress">${dots}</div><div class="hint">← → volgende/vorige • G = GM</div></div></div></section>`;
}
function render(){
  jump.value=sceneIndex;
  const s=step(); if(!s)return;
  if(s.type==='title') root.innerHTML=stageOpen(s)+`<div class="scene-kicker">${safe(s.kicker)}</div><h1 class="title">${safe(s.title)}</h1><p class="subtitle">${safe(s.subtitle)}</p>`+foot();
  if(s.type==='narration') root.innerHTML=stageOpen(s)+`<p class="narration">${safe(s.text)}</p>`+foot();
  if(s.type==='transition') root.innerHTML=`<section class="stage no-image"><div class="wrap"><div></div><div class="main transition"><div class="small">JULLIE VERLATEN</div><div class="big">${safe(s.from)}</div><div class="small">VOLGENDE LOCATIE</div><div class="big">${safe(s.to)}</div></div><div class="footer"><div></div><div class="hint">← → volgende/vorige • G = GM</div></div></div></section>`;
  if(s.type==='dialogue') renderDialogue(s);
  if(s.type==='private') root.innerHTML=stageOpen(s)+`<div class="scene-kicker">PRIVÉ OP TELEFOONS</div><h1 class="title">${safe(s.title)}</h1><p class="subtitle">${safe(s.subtitle)}</p>`+foot();
  if(s.type==='activity') renderActivity(s);
  if(s.type==='details') renderDetails(s);
  if(s.type==='archives') renderArchives(s);
}
function renderDialogue(s){
  root.innerHTML=stageOpen(s)+`<div class="dialogue-card"><div class="speaker">${safe(s.speaker)}</div><p class="quote">“${safe(s.text)}”</p></div><div class="choices">${s.choices.map((c,i)=>`<button class="choice ${s.choices.length===1?'wide':''}" data-choice="${i}">${safe(c.label)}</button>`).join('')}</div>`+foot();
  root.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{
    const c=s.choices[+b.dataset.choice];
    root.querySelector('.dialogue-card').innerHTML=`<div class="speaker">${safe(s.speaker)}</div><p class="quote">“${safe(c.reply)}”</p>`;
    root.querySelectorAll('[data-choice]').forEach(x=>x.classList.add('used'));
  });
}
function renderActivity(s){
  root.innerHTML=stageOpen(s)+`<div class="scene-kicker">${s.nonBlocking?'NIET-BLOKKEREND':''}</div><h1 class="title">${safe(s.title)}</h1><div class="choices">${s.choices.map(x=>`<button class="choice">${safe(x)}</button>`).join('')}</div>`+foot();
  root.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{root.querySelectorAll('.choice').forEach(x=>x.classList.remove('used'));b.classList.add('used')});
}
function renderDetails(s){
  const seen=new Set();
  root.innerHTML=stageOpen(s)+`<div class="scene-kicker">BEPERKTE INSPECTIE</div><h1 class="title">${safe(s.title)}</h1><div class="details">${s.details.map((d,i)=>`<button class="detail" data-detail="${i}"><b>${safe(d.title)}</b><p>Open detail</p></button>`).join('')}</div>`+foot();
  root.querySelectorAll('[data-detail]').forEach(b=>b.onclick=()=>{
    const i=+b.dataset.detail,d=s.details[i]; seen.add(i);b.classList.add('done');b.querySelector('p').textContent=d.body;
    if(seen.size===s.details.length) setTimeout(()=>showModal('INSPECTIE VOLTOOID','Alle objecten uit de Details-lijst zijn geopend.'),250);
  });
}
function renderArchives(s){
  root.innerHTML=stageOpen(s)+`<div class="scene-kicker">EERSTE ONDERZOEKSRONDE</div><h1 class="title">${safe(s.title)}</h1><div class="archive-grid">${s.archives.map((a,i)=>`<button class="archive" data-archive="${i}"><h3>${safe(a.title)}</h3><p>${safe(a.subtitle)}</p></button>`).join('')}</div>`+foot();
  root.querySelectorAll('[data-archive]').forEach(b=>b.onclick=()=>{const a=s.archives[+b.dataset.archive];showModal(a.title,a.reply)});
}
function showModal(title,body){
  const o=document.createElement('div');o.className='overlay';
  o.innerHTML=`<div class="modal"><h2>${safe(title)}</h2><p>${safe(body)}</p><button>SLUIT</button></div>`;
  o.querySelector('button').onclick=()=>o.remove();document.body.appendChild(o);
}
function next(){
  if(stepIndex<current().steps.length-1){stepIndex++;render();return}
  if(sceneIndex<SCENES.length-1){sceneIndex++;stepIndex=0;render()}
}
function prev(){
  if(stepIndex>0){stepIndex--;render();return}
  if(sceneIndex>0){sceneIndex--;stepIndex=SCENES[sceneIndex].steps.length-1;render()}
}
render();