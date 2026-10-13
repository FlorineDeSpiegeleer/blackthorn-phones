const SCENES = [
  {
    id:'A0',
    label:'A0 — Voorbereiding',
    image:'assets/guest_suite_getting_ready.png',
    steps:[
      {
        type:'title',
        location:'BLACKTHORN ACADEMY • GUEST SUITE 417',
        kicker:'FOUNDERS’ WEEK',
        title:'THE NIGHT OF THE VEILED MOON',
        subtitle:'Jullie zijn net aangekomen in Suite 417. Buiten tikt regen tegen de hoge ramen. Beneden is het bal al begonnen.'
      },
      {
        type:'story',
        location:'BLACKTHORN ACADEMY • GUEST SUITE 417',
        kicker:'VOORBEREIDING',
        title:'Nog één ding voor jullie vertrekken.',
        text:'Kies op jullie telefoon je masker en wat je meeneemt. Maak gerust nog een foto. De gastenprocessie sluit om 20:15.'
      },
      {
        type:'phone',
        location:'BLACKTHORN ACADEMY • GUEST SUITE 417',
        title:'PAK JULLIE TELEFOON',
        subtitle:'Rond de korte voorbereiding op jullie eigen toestel af. Als iedereen klaar is, gaan jullie samen naar beneden.',
        action:'IEDEREEN KLAAR? → GA VERDER'
      },
      {
        type:'title',
        location:'BLACKTHORN ACADEMY • GUEST SUITE 417',
        kicker:'VERTREK',
        title:'20:14',
        subtitle:'Jullie trekken de deur van Suite 417 achter jullie dicht.'
      },
      {type:'transition',from:'GUEST SUITE 417',to:'GRAND STAIR CHECKPOINT'}
    ]
  },
  {
    id:'A1',
    label:'A1 — Late aankomst',
    image:'assets/grand_stair_arrival.png',
    steps:[
      {
        type:'story',
        location:'BLACKTHORN ACADEMY • GRAND STAIR CHECKPOINT',
        kicker:'LATE AANKOMST',
        title:'De processie is al voorbij.',
        text:'Regen tikt tegen de hoge ramen. Het ceremoniële koord is gesloten. Achter de checkpointtafel kijkt een man op uit een papieren logboek.'
      },
      {
        type:'dialogue',
        location:'BLACKTHORN ACADEMY • GRAND STAIR CHECKPOINT',
        speaker:'GIDEON BELL',
        text:'Goedenavond. Jullie komen na de processiesluiting binnen. Mag ik jullie namen?',
        choices:[
          {label:'ANTWOORD IN JULLIE EIGEN WOORDEN',reply:'Dank u. Ik schrijf jullie als één late aankomstgroep in.'}
        ]
      },
      {
        type:'story',
        location:'BLACKTHORN ACADEMY • GRAND STAIR CHECKPOINT',
        kicker:'CHECKPOINT',
        title:'Gideon buigt zich weer over zijn logboek.',
        text:'Aan de andere kant van het gesloten processiekoord wacht de gewone gastenroute richting Grand Hall.'
      },
      {
        type:'phone',
        location:'BLACKTHORN ACADEMY • GRAND STAIR CHECKPOINT',
        title:'KORTE PRIVÉMOMENTEN',
        subtitle:'Florine krijgt een privégesprek. Maxine bekijkt het publieke fotobord. Sam heeft het programma en de publieke kaart op haar telefoon.',
        action:'KLAAR? → GA VERDER'
      },
      {type:'transition',from:'GRAND STAIR CHECKPOINT',to:'RECEPTION ARCADE'},
      {
        type:'story',
        location:'BLACKTHORN ACADEMY • RECEPTION ARCADE',
        kicker:'OP WEG NAAR HET BAL',
        title:'De muziek uit de Grand Hall wordt luider.',
        text:'Personeel ruimt de laatste resten van de processie op. De meeste gasten zijn al binnen.'
      },
      {
        type:'phone',
        location:'BLACKTHORN ACADEMY • RECEPTION ARCADE',
        title:'SAM — PRIVÉGESPREK',
        subtitle:'Sam krijgt onderweg een kort privégesprek. Maxine en Florine blijven in de gedeelde ruimte.',
        action:'SAM KLAAR? → GA VERDER'
      },
      {type:'transition',from:'RECEPTION ARCADE',to:'GRAND HALL BALLROOM'}
    ]
  },
  {
    id:'A2',
    label:'A2 — Het gemaskerde bal',
    image:'assets/grand_hall_masked_ball.png',
    steps:[
      {
        type:'story',
        location:'BLACKTHORN ACADEMY • GRAND HALL BALLROOM',
        kicker:'THE NIGHT OF THE VEILED MOON',
        title:'Jullie stappen de balzaal binnen.',
        text:'Warm koperlicht glijdt over donkere houten balkons. Maskers, avondkleding en oude familiekleuren bewegen door elkaar terwijl een strijkensemble verder speelt.'
      },
      {
        type:'dialogue',
        location:'BLACKTHORN ACADEMY • GRAND HALL BALLROOM',
        speaker:'PROFESSOR ALDOUS VEYNE',
        text:'Als je te laat komt, doe het dan tenminste zo dat iemand het onthoudt. De helft van deze zaal heeft jaren geoefend om stipt onopvallend te zijn.',
        choices:[
          {label:'LAAT HEM VERDERGAAN',reply:'Blackthorn houdt het meest van protocol wanneer niemand vraagt welk probleem dat protocol ooit moest oplossen.'}
        ]
      },
      {
        type:'dialogue',
        location:'BLACKTHORN ACADEMY • GRAND HALL BALLROOM',
        speaker:'PROFESSOR ALDOUS VEYNE',
        text:'Als je deze avond juist wilt onthouden, noteer dan wat mensen zeggen vóór ze weten wat ze achteraf hadden moeten zeggen.',
        choices:[
          {label:'LAAT HEM GAAN',reply:'Veyne knikt kort, neemt zijn programma mee en verdwijnt opnieuw tussen de gasten.'}
        ]
      },
      {
        type:'story',
        location:'BLACKTHORN ACADEMY • GRAND HALL BALLROOM',
        kicker:'ENKELE MOMENTEN LATER',
        title:'Bij een ceremoniële maskerdisplay staat een vrouw een losgeraakt lint recht te leggen.',
        text:'Onder haar arm zit een donkere documentenkoffer. Ze kijkt op wanneer jullie dichterbij komen.'
      },
      {
        type:'dialogue',
        location:'BLACKTHORN ACADEMY • GRAND HALL BALLROOM',
        speaker:'PROFESSOR CELESTE ROOK',
        text:'Welkom op Blackthorn. Geloof niemand die beweert dat Founders’ Week normaal rustiger verloopt. Die persoon beschermt het merk.',
        choices:[
          {label:'VRAAG WAT ZE DOCEERT',reply:'Ritual History. In de praktijk betekent dat vooral aantonen dat tradities ooit praktische beslissingen van vermoeide mensen waren.'},
          {label:'VRAAG OF ZE VAN HET BAL GENIET',reply:'In zorgvuldig afgemeten porties. Ik verkies de momenten waarop mensen even vergeten dat ze een familienaam vertegenwoordigen.'},
          {label:'ANTWOORD IN JE EIGEN WOORDEN',reply:'Dan laat ik jouw woorden staan.'}
        ]
      },
      {
        type:'phone',
        location:'BLACKTHORN ACADEMY • GRAND HALL BALLROOM',
        title:'DE ZAAL GAAT OPEN',
        subtitle:'Jullie hoeven nu niet naast elkaar te blijven. Op de drie telefoons lopen korte persoonlijke gesprekken tegelijk. De beamer blijft de gedeelde balzaal.',
        action:'IEDEREEN KLAAR? → GA VERDER'
      },
      {
        type:'activity',
        location:'BLACKTHORN ACADEMY • GRAND HALL BALLROOM',
        kicker:'REGROUP — KORT EN NIET-BLOKKEREND',
        title:'Wat doen jullie nog even samen?',
        choices:['GROEPSFOTO','MASKERDISPLAY','IETS DRINKEN','KIJK ROND'],
        confirmation:'Prima. Het bal gaat verder.'
      },
      {
        type:'story',
        location:'BLACKTHORN ACADEMY • GRAND HALL BALLROOM',
        kicker:'LATER OP DE AVOND',
        title:'De muziek speelt verder.',
        text:'Gesprekken verschuiven door de zaal. Glazen worden bijgevuld. Niemand in de balzaal weet dat de avond op het punt staat volledig te veranderen.'
      }
    ]
  },
  {
    id:'A3',
    label:'A3 — De onderbreking',
    image:'assets/observatory_gallery_night.png',
    steps:[
      {
        type:'interrupt',
        location:'BLACKTHORN ACADEMY • GRAND HALL BALLROOM',
        kicker:'FOUNDERS’ WEEK',
        title:'PROGRAMMA ONDERBROKEN',
        subtitle:'De muziek stopt midden in een passage.'
      },
      {
        type:'story',
        location:'BLACKTHORN ACADEMY • GRAND HALL BALLROOM',
        kicker:'ONRUST IN DE ZAAL',
        title:'Personeel sluit een deel van de Academy af.',
        text:'Gasten worden uit doorgangen gehouden. Een boodschap van de Headmistress gaat door de zaal: iedereen blijft beschikbaar voor vragen.'
      },
      {type:'transition',from:'GRAND HALL BALLROOM',to:'OBSERVATORY GALLERY'},
      {
        type:'story',
        location:'BLACKTHORN ACADEMY • OBSERVATORY GALLERY',
        kicker:'BEPERKTE ZONE',
        title:'De gallery is afgezet.',
        text:'Staff bewaakt de toegang. Jullie blijven aan de buitenzijde van de gemarkeerde inspectiezone tot de Headmistress naar jullie toekomt.'
      },
      {
        type:'dialogue',
        location:'BLACKTHORN ACADEMY • OBSERVATORY GALLERY',
        speaker:'HEADMISTRESS BLACKTHORN',
        text:'Jullie staan in de late registratie en op publiek eventmateriaal. Dat maakt jullie bruikbaar als onafhankelijke getuigen.',
        choices:[
          {label:'LUISTER VERDER',reply:'Jullie krijgen een beperkte incidentmap. Als jullie een conclusie trekken, wil ik de bron erbij zien.'}
        ]
      },
      {
        type:'phone',
        location:'BLACKTHORN ACADEMY • OBSERVATORY GALLERY',
        title:'INCIDENT DOSSIER ONTGRENDELD',
        subtitle:'Open het dossier op jullie telefoon. De eerste vrijgegeven bronkaarten verschijnen daar.',
        action:'DOSSIER GEOPEND? → GA VERDER'
      },
      {
        type:'dialogue',
        location:'BLACKTHORN ACADEMY • OBSERVATORY GALLERY',
        speaker:'HEADMISTRESS BLACKTHORN',
        text:'Voor de inspectie begint, mogen jullie één vraag stellen.',
        choices:[
          {label:'VRAAG NAAR TOEGANG TOT AFGESLOTEN ZONES',reply:'Toegang is verspreid over credentials, fysieke sleutels en tijdelijke uitgiftes. Jullie krijgen de registers die voor deze incidentmap zijn vrijgegeven.'},
          {label:'VRAAG NAAR DE ONTDEKKING',reply:'De gallery is na de onderbreking gecontroleerd en vervolgens afgesloten. De eerste scènebeschrijving blijft zoals ze werd aangetroffen.'},
          {label:'VRAAG WAAROM JULLIE DOSSIERTOEGANG KRIJGEN',reply:'Omdat jullie onafhankelijk van de Academy-structuur zijn en al vóór de lockdown in meerdere publieke ruimtes geregistreerd stonden.'},
          {label:'STEL ZELF EEN VRAAG',reply:'Als het bevestigd is in de incidentmap, krijgen jullie de bron. Wat niet bevestigd is, vul ik niet in.'}
        ]
      },
      {
        type:'story',
        location:'BLACKTHORN ACADEMY • OBSERVATORY GALLERY',
        kicker:'DE HEADMISTRESS STAPT OPZIJ',
        title:'Jullie mogen de afgebakende scène bekijken.',
        text:'Niets aanraken. Gebruik de Details-lijst op het volgende scherm om de drie zichtbare objecten één voor één te openen.'
      }
    ]
  },
  {
    id:'A4',
    label:'A4 — Scène-inspectie',
    image:'assets/investigation_scene_wide.png',
    steps:[
      {
        type:'details',
        location:'BLACKTHORN ACADEMY • OBSERVATORY GALLERY • BEPERKTE INSPECTIE',
        title:'BEKIJK DE ZICHTBARE DETAILS',
        details:[
          {title:'BRANDYGLAS',body:'Helder drinkglas. Kleine hoeveelheid amberkleurige vloeistof. Geen zichtbare breuk.'},
          {title:'CEREMONIEEL MASKER',body:'Ceremonieel masker naast Veyne. Gelakte buitenzijde. De sluiting is zichtbaar.'},
          {title:'WYCLIFFE-REFERENTIEBLAD',body:'Archief-/Council-referentieblad met Wycliffe-identificatie.'}
        ]
      },
      {
        type:'story',
        location:'BLACKTHORN ACADEMY • OBSERVATORY GALLERY',
        kicker:'INSPECTIE VOLTOOID',
        title:'Jullie hebben de drie zichtbare objecten bekeken.',
        text:'De objectbeschrijvingen worden aan het gedeelde dossier toegevoegd. De Headmistress laat jullie daarna naar een aparte interviewruimte brengen.'
      },
      {type:'transition',from:'OBSERVATORY GALLERY',to:'INCIDENT INTERVIEW ROOM'}
    ]
  },
  {
    id:'A5',
    label:'A5 — Eerste onderzoeksronde',
    image:'assets/grand_hall_side_room.png',
    steps:[
      {
        type:'story',
        location:'BLACKTHORN ACADEMY • INCIDENT INTERVIEW ROOM',
        kicker:'EERSTE ONDERZOEKSRONDE',
        title:'De deur valt achter jullie dicht.',
        text:'Op tafel liggen drie lege dossiermappen. Gideon Bell zit tegenover jullie met zijn papieren logboek en een ondertekende verklaring.'
      },
      {
        type:'dialogueMulti',
        location:'BLACKTHORN ACADEMY • INCIDENT INTERVIEW ROOM',
        speaker:'GIDEON BELL',
        text:'Ik hield de late processie bij en werkte daarna verder bij Event Logistics. Vraag per onderwerp; dan hou ik mijn eigen herinnering en het papier uit elkaar.',
        topics:[
          {label:'LATE AANKOMST',reply:'Dit is het papieren log van het checkpoint. Ik heb het zelf ingevuld.',doneLabel:'LOG TOEGEVOEGD'},
          {label:'DIENSTBEWEGINGEN',reply:'Dit is mijn getekende sightline-verklaring. Ze zegt alleen wat ik vanaf mijn route kon zien.',doneLabel:'VERKLARING TOEGEVOEGD'},
          {label:'MASK STATION',reply:'Voor het Mask Station bestaan aparte eventrecords. Die bron zit niet in mijn getuigenverklaring.',doneLabel:'BEANTWOORD'},
          {label:'STEL ZELF EEN VRAAG',reply:'Als ik het zelf gezien of geregistreerd heb, geef ik de bron. Anders zeg ik dat ik het niet weet.',doneLabel:'BEANTWOORD'}
        ],
        required:['LATE AANKOMST','DIENSTBEWEGINGEN']
      },
      {
        type:'story',
        location:'BLACKTHORN ACADEMY • INCIDENT INTERVIEW ROOM',
        kicker:'GIDEON STAAT OP',
        title:'Voor hij vertrekt, schuift hij twee documenten naar jullie toe.',
        text:'Het late-processielog en zijn getekende verklaring worden aan het dossier toegevoegd.'
      },
      {
        type:'archives',
        location:'BLACKTHORN ACADEMY • INCIDENT INTERVIEW ROOM',
        title:'KIES ÉÉN ARCHIEF VOOR DEZE RONDE',
        subtitle:'De andere bron verdwijnt niet. Jullie krijgen er later nog toegang toe.',
        archives:[
          {title:'EVENT PHOTOGRAPHY',subtitle:'Isolde Maren — chronologisch eventalbum',reply:'Isolde opent het chronologische eventalbum. “Geef me een tijdvak, geen theorie.”'},
          {title:'EVENT LOGISTICS',subtitle:'Alleen-lezen eventrecords',reply:'De vrijgegeven logistieke eventrecords worden geopend.'}
        ]
      },
      {
        type:'phone',
        location:'BLACKTHORN ACADEMY • INCIDENT INTERVIEW ROOM',
        title:'CHECK JULLIE DOSSIER',
        subtitle:'Bekijk wat jullie nu bezitten. Bewaar privé wat privé is en deel alleen wat jullie zelf willen delen.',
        action:'KLAAR VOOR DE RECONSTRUCTIE? → GA VERDER'
      },
      {
        type:'title',
        location:'BLACKTHORN ACADEMY • INCIDENT INTERVIEW ROOM',
        kicker:'EERSTE ONDERZOEKSRONDE AFGEROND',
        title:'De avond ligt nu in stukken voor jullie.',
        subtitle:'De volgende stap is niet raden wie liegt. Eerst moeten jullie reconstrueren wanneer de registraties werkelijk op elkaar aansluiten.'
      }
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

function foot(extra=''){
  const dots=current().steps.map((_,i)=>`<i class="dot ${i===stepIndex?'active':''}"></i>`).join('');
  return `</div><div class="footer"><div class="progress">${dots}</div><div class="hint">${extra||'← → volgende/vorige • G = GM'}</div></div></div></section>`;
}

function render(){
  jump.value=sceneIndex;
  const s=step();
  if(!s)return;

  if(s.type==='title'||s.type==='interrupt'){
    root.innerHTML=stageOpen(s)+`<div class="scene-kicker">${safe(s.kicker||'')}</div><h1 class="title">${safe(s.title)}</h1><p class="subtitle">${safe(s.subtitle||'')}</p>`+foot();
  }
  if(s.type==='story'){
    root.innerHTML=stageOpen(s)+`<div class="scene-kicker">${safe(s.kicker||'')}</div><h1 class="title">${safe(s.title||'')}</h1><p class="subtitle">${safe(s.text||'')}</p>`+foot();
  }
  if(s.type==='transition'){
    root.innerHTML=`<section class="stage no-image"><div class="wrap"><div></div><div class="main transition"><div class="small">JULLIE VERLATEN</div><div class="big">${safe(s.from)}</div><div class="small">VOLGENDE LOCATIE</div><div class="big">${safe(s.to)}</div></div><div class="footer"><div></div><div class="hint">← → volgende/vorige • G = GM</div></div></div></section>`;
  }
  if(s.type==='dialogue') renderDialogue(s);
  if(s.type==='dialogueMulti') renderDialogueMulti(s);
  if(s.type==='phone') renderPhone(s);
  if(s.type==='activity') renderActivity(s);
  if(s.type==='details') renderDetails(s);
  if(s.type==='archives') renderArchives(s);
}

function renderDialogue(s){
  root.innerHTML=stageOpen(s)+
    `<div class="dialogue-card"><div class="speaker">${safe(s.speaker)}</div><p class="quote">“${safe(s.text)}”</p></div>
     <div class="choices">${s.choices.map((c,i)=>`<button class="choice ${s.choices.length===1?'wide':''}" data-choice="${i}">${safe(c.label)}</button>`).join('')}</div>`+
    foot('Kies één reactie');

  root.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{
    const c=s.choices[+b.dataset.choice];
    root.querySelector('.dialogue-card').innerHTML=`<div class="speaker">${safe(s.speaker)}</div><p class="quote">“${safe(c.reply)}”</p>`;
    root.querySelector('.choices').innerHTML=`<button class="choice wide" id="continueChoice">GA VERDER →</button>`;
    document.getElementById('continueChoice').onclick=next;
  });
}

function renderDialogueMulti(s){
  const opened=new Set();
  root.innerHTML=stageOpen(s)+
    `<div class="dialogue-card"><div class="speaker">${safe(s.speaker)}</div><p class="quote">“${safe(s.text)}”</p></div>
     <div class="choices">${s.topics.map((c,i)=>`<button class="choice" data-topic="${i}">${safe(c.label)}</button>`).join('')}</div>`+
    foot('Open de onderwerpen die jullie willen bespreken');

  root.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>{
    const c=s.topics[+b.dataset.topic];
    opened.add(c.label);
    b.classList.add('used');
    b.textContent=c.doneLabel||'GEOPEND';
    root.querySelector('.dialogue-card').innerHTML=`<div class="speaker">${safe(s.speaker)}</div><p class="quote">“${safe(c.reply)}”</p>`;
    const ready=(s.required||[]).every(x=>opened.has(x));
    if(ready && !document.getElementById('multiContinue')){
      const holder=root.querySelector('.choices');
      const go=document.createElement('button');
      go.id='multiContinue';go.className='choice wide';go.textContent='INTERVIEW AFRONDEN →';
      go.onclick=next;holder.appendChild(go);
    }
  });
}

function renderPhone(s){
  root.innerHTML=stageOpen(s)+
    `<div class="scene-kicker">PRIVÉ OP TELEFOONS</div><h1 class="title">${safe(s.title)}</h1><p class="subtitle">${safe(s.subtitle)}</p>
     <div class="choices"><button class="choice wide" id="phoneDone">${safe(s.action||'KLAAR →')}</button></div>`+
    foot('De beamer wacht; privé-inhoud blijft op de telefoons');
  document.getElementById('phoneDone').onclick=next;
}

function renderActivity(s){
  root.innerHTML=stageOpen(s)+
    `<div class="scene-kicker">${safe(s.kicker||'')}</div><h1 class="title">${safe(s.title)}</h1>
     <div class="choices">${s.choices.map((x,i)=>`<button class="choice" data-activity="${i}">${safe(x)}</button>`).join('')}</div>`+
    foot('Kies één; dit blokkeert het verhaal niet');

  root.querySelectorAll('[data-activity]').forEach(b=>b.onclick=()=>{
    root.querySelectorAll('[data-activity]').forEach(x=>x.classList.remove('used'));
    b.classList.add('used');
    showModal('KEUZE GEMAAKT',s.confirmation||'Ga verder wanneer jullie klaar zijn.',true);
  });
}

function renderDetails(s){
  const seen=new Set();
  root.innerHTML=stageOpen(s)+
    `<div class="scene-kicker">BEPERKTE INSPECTIE</div><h1 class="title">${safe(s.title)}</h1>
     <div class="details">${s.details.map((d,i)=>`<button class="detail" data-detail="${i}"><b>${safe(d.title)}</b><p>OPEN DETAIL</p></button>`).join('')}</div>`+
    foot('Open alle drie de zichtbare details');

  root.querySelectorAll('[data-detail]').forEach(b=>b.onclick=()=>{
    const i=+b.dataset.detail,d=s.details[i];
    seen.add(i);b.classList.add('done');b.querySelector('p').textContent=d.body;
    if(seen.size===s.details.length && !document.getElementById('detailContinue')){
      const go=document.createElement('button');go.id='detailContinue';go.className='choice wide';go.textContent='INSPECTIE AFRONDEN →';go.onclick=next;
      const holder=document.createElement('div');holder.className='choices';holder.appendChild(go);root.querySelector('.main').appendChild(holder);
    }
  });
}

function renderArchives(s){
  root.innerHTML=stageOpen(s)+
    `<div class="scene-kicker">EERSTE ONDERZOEKSRONDE</div><h1 class="title">${safe(s.title)}</h1>
     <p class="subtitle">${safe(s.subtitle||'')}</p>
     <div class="archive-grid">${s.archives.map((a,i)=>`<button class="archive" data-archive="${i}"><h3>${safe(a.title)}</h3><p>${safe(a.subtitle)}</p></button>`).join('')}</div>`+
    foot('Kies één archief');

  root.querySelectorAll('[data-archive]').forEach(b=>b.onclick=()=>{
    const a=s.archives[+b.dataset.archive];
    root.querySelectorAll('[data-archive]').forEach(x=>x.disabled=true);
    showModal(a.title,a.reply,true);
  });
}

function showModal(title,body,continueAfter=false){
  const o=document.createElement('div');o.className='overlay';
  o.innerHTML=`<div class="modal"><h2>${safe(title)}</h2><p>${safe(body)}</p><button>${continueAfter?'GA VERDER →':'SLUIT'}</button></div>`;
  o.querySelector('button').onclick=()=>{o.remove();if(continueAfter)next()};
  document.body.appendChild(o);
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