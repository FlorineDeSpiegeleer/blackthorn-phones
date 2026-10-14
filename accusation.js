(()=> {
const PLAYERS=['florine','sam','maxine'];
const ROSTER=[
 'Adrian Voss','Alexander Ashbourne','Nate Beaumont','Gideon Bell','Headmistress Helena Blackthorn',
 'Rowan Kestrel','Captain Luc March','Isolde Maren','Dr Miriam Sable','Professor Celeste Rook',
 'Mara Quill','Agnes Pike','Theo Mercer','Sebastian Wycliffe'
].sort((a,b)=>{
 const clean=s=>s.replace(/^(Headmistress|Captain|Dr|Professor)\s+/,'').trim().split(/\s+/).at(-1);
 return clean(a).localeCompare(clean(b));
});
const SUPPORT={
 OBJECT:['original_veyne_mask','poisoned_reserve_mask','safe_reserve_mask','label_remnant'],
 DOCUMENT:['annotation_notebook','selwyn_loan_record','veyne_ledger_content','label_remnant'],
 ACCESS:['cabinet_keyholder_register','credential_alias_register','p2_profile'],
 TIMELINE:['p1_chronology','p2_profile','p3_board']
};
const LABELS={
 original_veyne_mask:'Geregistreerd ceremonieel masker',
 poisoned_reserve_mask:'Service Niche-masker',
 safe_reserve_mask:'Object naast het slachtoffer',
 label_remnant:'Labelrest — binnenvoering',
 annotation_notebook:'Annotatienotitieboek',
 selwyn_loan_record:'Council loan record',
 veyne_ledger_content:'Ledger-uittreksel',
 cabinet_keyholder_register:'Cabinet keyholder register',
 credential_alias_register:'Credential alias register',
 p1_chronology:'P1 — gecorrigeerde chronologie',
 p2_profile:'P2 — opportunity profile',
 p3_board:'P3 — exclusion board'
};
const KEY='bt-accusation-state';
const chan=('BroadcastChannel' in window)?new BroadcastChannel('blackthorn-v63-sync'):null;
function state(){try{return JSON.parse(localStorage.getItem(KEY)||'null')||{phase:'voting',round:1,history:[],confirmerIndex:0,locked:null,allowed:null}}catch{return{phase:'voting',round:1,history:[],confirmerIndex:0,locked:null,allowed:null}}}
function save(s){localStorage.setItem(KEY,JSON.stringify(s));chan?.postMessage({type:'accusation'});window.dispatchEvent(new CustomEvent('blackthorn-accusation'))}
function voteKey(round,player){return `bt-acc-vote-r${round}-${player}`}
function vote(round,player){try{return JSON.parse(localStorage.getItem(voteKey(round,player))||'null')}catch{return null}}
function votes(round){return PLAYERS.map(p=>({player:p,vote:vote(round,p)})).filter(x=>x.vote)}
function virtualOwned(id){
 if(id==='p1_chronology')return localStorage.getItem('bt-p1-corrected')==='1';
 if(id==='p2_profile')return localStorage.getItem('bt-p2-profile')==='1';
 if(id==='p3_board')return localStorage.getItem('bt-p3-board')==='1';
 return false;
}
function ownedCards(){
 let e=[];try{e=JSON.parse(localStorage.getItem('bt-owned-evidence')||'[]')}catch{}
 const set=new Set(e);return id=>set.has(id)||virtualOwned(id);
}
function availableSupport(cat){const ok=ownedCards();return SUPPORT[cat].filter(ok).map(id=>({id,label:LABELS[id]||id}))}
function submit(player,payload){
 const s=state();if(!['voting','final_vote'].includes(s.phase)||vote(s.round,player))return false;
 if(s.allowed&&!s.allowed.includes(payload.accused))return false;
 if(!ROSTER.includes(payload.accused))return false;
 const cats=['OBJECT','DOCUMENT','ACCESS','TIMELINE'];
 const ok=ownedCards();
 if(!cats.every(c=>payload.support?.[c]&&SUPPORT[c].includes(payload.support[c])&&ok(payload.support[c])))return false;
 localStorage.setItem(voteKey(s.round,player),JSON.stringify(payload));chan?.postMessage({type:'accusation'});tally();return true;
}
function lock(s,accused,reason){
 const roundVotes=votes(s.round).map(x=>({player:x.player,...x.vote}));
 s.history.push({round:s.round,reason,votes:roundVotes,locked:true});
 s.locked={accused,round:s.round,votes:roundVotes};s.phase='locked';s.allowed=null;save(s);
}
function tally(){
 const s=state(),vs=votes(s.round);if(vs.length<3)return save(s);
 const counts={};vs.forEach(x=>counts[x.vote.accused]=(counts[x.vote.accused]||0)+1);
 const groups=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
 if(groups[0][1]===3)return lock(s,groups[0][0],'3-0');
 if(groups[0][1]===2){
   if(s.round>=2||s.phase==='final_vote')return lock(s,groups[0][0],'majority-final');
   const minority=vs.find(x=>x.vote.accused!==groups[0][0]);
   s.history.push({round:s.round,reason:'2-1',votes:vs.map(x=>({player:x.player,...x.vote}))});
   s.phase='minority_decision';s.majority=groups[0][0];s.minorityPlayer=minority.player;save(s);return;
 }
 // 1-1-1
 s.history.push({round:s.round,reason:'1-1-1',votes:vs.map(x=>({player:x.player,...x.vote}))});
 const confirmer=PLAYERS[s.confirmerIndex%PLAYERS.length];s.confirmerIndex++;
 s.confirmerPlayer=confirmer;s.options=groups.map(x=>x[0]);
 if(s.round>=2){s.phase='final_elimination';save(s);return}
 s.phase='confirmer_pick';save(s);
}
function minorityDecision(player,decision){
 const s=state();if(s.phase!=='minority_decision'||s.minorityPlayer!==player)return;
 if(decision==='accept')return lock(s,s.majority,'2-1 accepted');
 s.phase='discussion';s.discussionEnds=Date.now()+60000;s.nextRound=s.round+1;s.allowed=null;save(s);
}
function confirmerPick(player,accused){
 const s=state();if(s.phase!=='confirmer_pick'||s.confirmerPlayer!==player||!s.options.includes(accused))return;
 s.discussFirst=accused;s.phase='discussion';s.discussionEnds=Date.now()+60000;s.nextRound=s.round+1;s.allowed=null;save(s);
}
function eliminate(player,accused){
 const s=state();if(s.phase!=='final_elimination'||s.confirmerPlayer!==player||!s.options.includes(accused))return;
 s.eliminated=accused;s.allowed=s.options.filter(x=>x!==accused);s.round++;s.phase='final_vote';save(s);
}
function startNextVote(){
 const s=state();if(s.phase!=='discussion'||Date.now()<Number(s.discussionEnds||0))return false;
 s.round=s.nextRound||s.round+1;s.phase='voting';s.allowed=null;delete s.majority;delete s.minorityPlayer;delete s.confirmerPlayer;delete s.options;delete s.discussFirst;delete s.discussionEnds;delete s.nextRound;save(s);return true;
}
function reset(){
 const s=state();for(let r=1;r<=6;r++)PLAYERS.forEach(p=>localStorage.removeItem(voteKey(r,p)));
 localStorage.removeItem(KEY);save({phase:'voting',round:1,history:[],confirmerIndex:0,locked:null,allowed:null});
}
window.BlackthornAccusation={PLAYERS,ROSTER,SUPPORT,LABELS,state,vote,votes,submit,tally,minorityDecision,confirmerPick,eliminate,startNextVote,availableSupport,isLocked:()=>!!state().locked,reset};
})();