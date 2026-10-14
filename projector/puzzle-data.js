window.BLACKTHORN_PUZZLE_DATA={
  P1_READY:{
    title:"P1 — BRONNEN UITLIJNEN",
    anchors:[
      {id:"late_log",evidence:"late_procession_log",kind:"PAPIERLOG",time:"20:19",location:"Grand Stair Checkpoint",label:"Late Procession Log"},
      {id:"arrival_photo",evidence:"isolde_photo_bundle",kind:"FOTO",time:"20:32",location:"Ballroom Threshold",label:"Eventfoto — aankomst"}
    ],
    legacyRows:[
      {id:"g13034",time:"20:23",reader:"GUEST-CHK",credential:"GUEST-MFS",counter:"NET#13034",event:"DOOR"},
      {id:"g13035",time:"20:36",reader:"GH-MIRROR",credential:"GUEST-MFS",counter:"NET#13035",event:"DOOR"},
      {id:"g13036",time:"20:40",reader:"GH-MIRROR",credential:"EVENT-PHOTO",counter:"NET#13036",event:"DOOR"},
      {id:"g13041",time:"20:48",reader:"GH-MIRROR",credential:"GUEST-A12",counter:"NET#13041",event:"DOOR"},
      {id:"g13049",time:"21:05",reader:"LIB-SIDE",credential:"GUEST-NB",counter:"NET#13049",event:"DOOR"},
      {id:"g13053",time:"21:08",reader:"GH-MIRROR",credential:"FAC-RH2",counter:"NET#13053",event:"DOOR"},
      {id:"g13054",time:"21:08",reader:"GH-MIRROR",credential:"FOUNDERS-04",counter:"NET#13054",event:"DOOR"},
      {id:"g13055",time:"21:08",reader:"GH-MIRROR",credential:"EVENT-PHOTO",counter:"NET#13055",event:"DOOR"}
    ],
    readers:[
      {code:"GUEST-CHK",endpoints:["Room 417","Grand Stair Checkpoint"],mode:"public"},
      {code:"GH-MIRROR",endpoints:["Grand Hall Edge","Ballroom Threshold"],mode:"public"},
      {code:"LIB-SIDE",endpoints:["Ballroom Interior","Library"],mode:"public"},
      {code:"DEMO-CLEAN",endpoints:["Pigments Display","Demonstration Cleanup Room"],mode:"public"},
      {code:"PANTRY-WS",text:"Beperkt gebied — zie dossier",mode:"restricted"},
      {code:"WS-ALCOVE",text:"Beperkt gebied — zie dossier",mode:"restricted"},
      {code:"MAINT-STAIR",text:"Beperkt gebied — zie dossier",mode:"restricted"},
      {code:"RH-STORAGE",text:"Beperkt gebied — zie dossier",mode:"restricted"},
      {code:"CONS-SECURE",text:"Beperkt gebied — zie dossier",mode:"restricted"},
      {code:"OBS-SVC",text:"Beperkt gebied — zie dossier",mode:"restricted"},
      {code:"HK-CAVITY",text:"Beperkt gebied — zie dossier",mode:"restricted"},
      {code:"GW-SVC",text:"Geen doorgang",mode:"terminal"},
      {code:"SYS-LEGACY",text:"Geen doorgang",mode:"system"}
    ],
    accepted:[
      {anchor:"late_log",legacy:"g13034",offset:4},
      {anchor:"arrival_photo",legacy:"g13035",offset:4}
    ]
  },
  P2_READY:{
    title:"P2 — RECONSTRUCT THE CABINET WINDOW",
    baselineLast:["20:45","20:50","20:57"],
    baselineNext:["21:07","21:10","21:14"],
    routes:[
      {id:"r1",label:"20:50 → 20:52",ok:false},
      {id:"r2",label:"20:57 → 21:00",ok:true},
      {id:"r3",label:"21:03 → 21:07",ok:true},
      {id:"r4",label:"21:10 → 21:12",ok:false}
    ],
    durations:[1,2,3,4],
    accessTypes:[
      {id:"cabinet_key",label:"Geregistreerde cabinet-sleuteltoegang"},
      {id:"route_credential",label:"Geaccepteerde routecredential"},
      {id:"photo_badge",label:"Eventfotografie-badge"},
      {id:"council_permission",label:"Algemene Council-toestemming"}
    ]
  },
  P3_READY:{
    title:"P3 — TEST THE EXCLUSIONS",
    rowan:{
      markerA:["20:56 — Conservation Room","20:58 — East Gallery","21:00 — Wintergarden"],
      markerB:["21:04 — Conservation Room","21:04 — Ballroom Threshold","21:06 — Ballroom Edge"],
      targets:["Staff Mask Alcove","Grand Hall","Library"],
      durations:[1,2,3]
    },
    gideon:{
      credentials:[
        {id:"SERVICE",label:"SERVICE"},
        {id:"SERVICE-MASTER",label:"SERVICE-MASTER"},
        {id:"FAC-RH2",label:"FAC-RH2"},
        {id:"GUARD",label:"GUARD"}
      ],
      shortVisits:["20:50 → 20:52","20:57 → 21:00","21:03 → 21:07"],
      laterVisits:["Geen geregistreerde Gideon-route","20:57 → 21:00","21:03 → 21:07","21:07 → 21:09"]
    }
  },
  P4_READY:{
    title:"P4 — BUILD A THEORY CHAIN",
    masks:[
      {id:"maskA",label:"Masker A — geregistreerde slot-recovery",evidence:"original_veyne_mask"},
      {id:"maskB",label:"Masker B — Service Niche recovery",evidence:"poisoned_reserve_mask"},
      {id:"maskC",label:"Masker C — object naast het slachtoffer",evidence:"safe_reserve_mask"}
    ],
    details:["fastening / clasp","inner lining","lacquer surface","registration area","strap / edge wear"],
    cards:[
      {id:"original_veyne_mask",label:"Geregistreerd ceremonieel masker",types:["OBJECT"]},
      {id:"poisoned_reserve_mask",label:"Service Niche-masker",types:["OBJECT"]},
      {id:"safe_reserve_mask",label:"Object naast het slachtoffer",types:["OBJECT"]},
      {id:"label_remnant",label:"Labelrest — binnenvoering",types:["OBJECT","DOCUMENT"]},
      {id:"annotation_notebook",label:"Annotatienotitieboek",types:["DOCUMENT"]},
      {id:"selwyn_loan_record",label:"Council loan record",types:["DOCUMENT"]},
      {id:"veyne_ledger_content",label:"Ledger-uittreksel",types:["DOCUMENT"]},
      {id:"cabinet_keyholder_register",label:"Cabinet keyholder register",types:["ACCESS"]},
      {id:"credential_alias_register",label:"Credential alias register",types:["ACCESS"]},
      {id:"p2_profile",label:"P2 — opportunity profile",types:["ACCESS","TIMELINE"],virtual:true},
      {id:"p1_chronology",label:"P1 — gecorrigeerde chronologie",types:["TIMELINE"],virtual:true},
      {id:"p3_board",label:"P3 — exclusion board",types:["TIMELINE"],virtual:true}
    ],
    acceptedPairs:{
      OBJECT:[
        ["original_veyne_mask","poisoned_reserve_mask"],
        ["poisoned_reserve_mask","safe_reserve_mask"],
        ["label_remnant","poisoned_reserve_mask"]
      ],
      DOCUMENT:[
        ["label_remnant","annotation_notebook"],
        ["annotation_notebook","selwyn_loan_record"],
        ["annotation_notebook","veyne_ledger_content"],
        ["selwyn_loan_record","veyne_ledger_content"]
      ],
      ACCESS:[
        ["p2_profile","cabinet_keyholder_register"],
        ["p2_profile","credential_alias_register"]
      ],
      TIMELINE:[
        ["p1_chronology","p3_board"],
        ["p2_profile","p3_board"],
        ["p1_chronology","p2_profile"]
      ]
    }
  }
};