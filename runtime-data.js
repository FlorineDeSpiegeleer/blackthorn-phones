window.BLACKTHORN_STATIC={
  stageOrder:['FOUNDERS_MORNING','GETTING_READY','BALL','INCIDENT','WEEK1','WEEK2','WEEK3','WEEK4','FINALE','EPILOGUE'],
  players:{
    sam:{name:'Sam',theme:'sam',portrait:'assets/sam/photos/5ceae8d724020b1a09b7b0a58424f22c.jpg',wallpaper:'assets/wallpaper/sam.png',photos:[
      ['assets/sam/photos/5ceae8d724020b1a09b7b0a58424f22c.jpg','Profiel'],
      ['assets/sam/photos/Cosy-Gothic-Library-Study-Retreat.png','Library day'],
      ['assets/sam/photos/Candlelit-Gothic-Masquerade-Ball.png','Founders’ Week'],
      ['assets/sam/photos/Candlelit-Masquerade-Selfie-Trio.png','Suite 417']
    ]},
    maxine:{name:'Maxine',theme:'maxine',portrait:'assets/maxine/photos/4893c7b3e505750b6fe8576e968da595.jpg',wallpaper:'assets/wallpaper/maxine.png',photos:[
      ['assets/maxine/photos/4893c7b3e505750b6fe8576e968da595.jpg','Profiel'],
      ['assets/maxine/photos/Gothic-Library-Selfie-by-Candlelight.png','Library'],
      ['assets/maxine/photos/Candlelit-Masquerade-Celebration.png','Founders’ Week'],
      ['assets/maxine/photos/Candlelit-Masquerade-Selfie-Trio.png','Suite 417']
    ]},
    florine:{name:'Florine',theme:'florine',portrait:'assets/florine/photos/5625da202d3ecb02310070b5870b656e.jpg',wallpaper:'assets/wallpaper/florine.jpg',photos:[
      ['assets/florine/photos/5625da202d3ecb02310070b5870b656e.jpg','Profiel'],
      ['assets/florine/photos/Cosy-Gothic-Library-Study-Retreat.png','Library'],
      ['assets/florine/photos/Candlelit-Gothic-Masquerade-Ball-1-.png','Founders’ Week'],
      ['assets/florine/photos/Candlelit-Masquerade-Selfie-Trio.png','Suite 417']
    ]}
  },
  calendar:[
    {stage:'FOUNDERS_MORNING',date:'MON 06 OCT',time:'08:30',title:'Breakfast',location:'Dining Hall'},
    {stage:'FOUNDERS_MORNING',date:'MON 06 OCT',time:'09:30',title:'Founders History: Masks, Oaths & Processions',location:'North Lecture Hall'},
    {stage:'FOUNDERS_MORNING',date:'MON 06 OCT',time:'11:15',title:'Archive Methods I: Reading Institutional Records',location:'Grand Library Seminar Room'},
    {stage:'GETTING_READY',date:'MON 06 OCT',time:'17:30',title:'Founders’ Week attire delivery',location:'Suite 417'},
    {stage:'GETTING_READY',date:'MON 06 OCT',time:'20:15',title:'Processional access closes',location:'Grand Stair'},
    {stage:'BALL',date:'MON 06 OCT',time:'20:30',title:'The Night of the Veiled Moon',location:'Grand Hall'},
    {stage:'WEEK1',date:'TUE 07 OCT',time:'10:00',title:'Memorial for Professor Veyne',location:'Grand Hall'},
    {stage:'WEEK2',date:'MON 13 OCT',time:'09:30',title:'Conservation I',location:'Conservation Room'},
    {stage:'WEEK2',date:'FRI 17 OCT',time:'12:00',title:'Restricted Route Safety Briefing',location:'West Route'},
    {stage:'WEEK3',date:'TUE 21 OCT',time:'14:00',title:'Security Camera Review',location:'Controlled Records'},
    {stage:'WEEK4',date:'MON 27 OCT',time:'10:00',title:'Reinspection Authorization Briefing',location:'Council Room'},
    {stage:'FINALE',date:'THU 30 OCT',time:'16:00',title:'Administrative Summons',location:'Council Room'},
    {stage:'EPILOGUE',date:'FRI 31 OCT',time:'11:00',title:'Founders’ Month Closing Notice',location:'Blackthorn Academy'}
  ],
  announcements:[
    {stage:'FOUNDERS_MORNING',title:'Founders’ Week begins',body:'Public rooms remain on the Founders timetable this week.'},
    {stage:'GETTING_READY',title:'The Night of the Veiled Moon',body:'Personal invitation required at the Grand Stair checkpoint.'},
    {stage:'INCIDENT',title:'Programme suspended',body:'The evening programme is suspended until further notice.'},
    {stage:'INCIDENT',title:'Temporary access freeze',body:'Restricted areas require incident authorization.'},
    {stage:'WEEK2',title:'Supervised records access',body:'Selected academic records may be consulted under staff supervision.'},
    {stage:'WEEK2',title:'West-route fieldwork suspended',body:'Non-essential field teaching on the western route is suspended.'},
    {stage:'WEEK4',title:'Joint-custody reinspection',body:'Authorized reinspection proceeds under joint staff custody.'}
  ],
  locations:[
    {name:'Suite 417',status:'Resident suite',image:'assets/sam/photos/Cozy-Candlelit-Academy-Bedchamber.png'},
    {name:'Grand Hall',status:'Founders’ Week / assemblies',image:'assets/sam/photos/Candlelit-Gothic-Masquerade-Ball.png'},
    {name:'Grand Library',status:'Public student access',image:'assets/sam/photos/Cosy-Gothic-Library-Study-Retreat.png'},
    {name:'Courtyard',status:'Public',image:'assets/florine/photos/Rainy-Gothic-Manor-Arrival.png'},
    {name:'Council Room',status:'Authorized access',image:'assets/maxine/photos/Gothic-Corridor-Selfie-with-Antique-Books.png'}
  ],
  directory:[
    {name:'Headmistress Blackthorn',role:'Headmistress'},
    {name:'Professor Aldous Veyne',role:'Professor'},
    {name:'Professor Celeste Rook',role:'Professor'},
    {name:'Alexander Ashbourne',role:'Academy Guard / Instructor'},
    {name:'Sebastian Wycliffe',role:'Council representative'},
    {name:'Nate Beaumont',role:'Student / researcher'},
    {name:'Theo Mercer',role:'Clinic / research office'},
    {name:'Adrian Voss',role:'Provenance specialist'}
  ]
};

window.btParseCsv=function(text){
  const rows=[]; let row=[],cell='',q=false;
  for(let i=0;i<text.length;i++){
    const c=text[i],n=text[i+1];
    if(c==='"'){if(q&&n==='"'){cell+='"';i++;}else q=!q;}
    else if(c===','&&!q){row.push(cell);cell='';}
    else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;row.push(cell);cell='';if(row.some(v=>v!==''))rows.push(row);row=[];}
    else cell+=c;
  }
  if(cell.length||row.length){row.push(cell);rows.push(row);}
  const h=rows.shift()||[];
  return rows.map(r=>Object.fromEntries(h.map((k,i)=>[k,r[i]??''])));
};

window.loadBlackthornBuild=async function(){
  const res=await fetch('production/v63/BLACKTHORN_PHONE_FLOW_V6_3_IMPLEMENTATION_GM_ONLY.csv',{cache:'no-store'});
  const rows=btParseCsv(await res.text()).map(r=>{
    if(r.flow_id==='P004B') r.opening_text='Het strijkensemble zet een dans in. Alexander biedt zijn hand. “Dit is geen Guard-opdracht.”';
    if(r.flow_id==='P043T3'){r.intent_1='DOE ALSOF ER NIETS GEBEURDE';r.visible_timestamp='even later';}
    if(r.flow_id==='P043A3') r.visible_timestamp='even later';
    if(r.flow_id==='P011' && r.reaction_1) r.reaction_1='Omdat hij luid was.';
    return r;
  });
  return {...BLACKTHORN_STATIC,phoneFlow:rows};
};