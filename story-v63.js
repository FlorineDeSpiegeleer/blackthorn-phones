/* Approved Blackthorn V6.3 phone-flow overlay. */
function btParseCsv(text){
  const rows=[]; let row=[],cell='',q=false;
  for(let i=0;i<text.length;i++){
    const c=text[i],n=text[i+1];
    if(c==='"'){ if(q&&n==='"'){cell+='"';i++;} else q=!q; }
    else if(c===','&&!q){row.push(cell);cell='';}
    else if((c==='\n'||c==='\r')&&!q){ if(c==='\r'&&n==='\n')i++; row.push(cell);cell=''; if(row.some(v=>v!==''))rows.push(row); row=[]; }
    else cell+=c;
  }
  if(cell.length||row.length){row.push(cell);rows.push(row);}
  const h=rows.shift()||[];
  return rows.map(r=>Object.fromEntries(h.map((k,i)=>[k,r[i]??''])));
}
window.BLACKTHORN_V63_READY=fetch('production/v63/phones.csv').then(r=>{if(!r.ok)throw new Error('V6.3 phone flow unavailable');return r.text()}).then(text=>{
  const rows=btParseCsv(text);
  const chars={sam:'Sam',maxine:'Maxine',florine:'Florine'};
  function keysFor(r){ if(r.character==='ALL')return Object.keys(chars); const k=Object.keys(chars).find(x=>chars[x]===r.character); return k?[k]:[]; }
  function message(r){
    const choices=[];
    for(let i=1;i<=3;i++){ const label=r['intent_'+i],reply=r['reaction_'+i]; if(label)choices.push({label,reply:reply||''}); }
    return {stage:r.stage||'FOUNDERS_MORNING',window:r.window||'',flowId:r.flow_id,from:r.thread||'Blackthorn Academy',time:r.visible_timestamp||'',text:r.opening_text||'',choices,freeText:r.free_text_fallback||'',condition:r.condition||'',stateWrite:r.state_write||''};
  }
  Object.keys(chars).forEach(k=>{
    const c=window.BLACKTHORN_DATA?.[k]; if(!c)return;
    const grouped=new Map();
    rows.filter(r=>keysFor(r).includes(k)).forEach(r=>{const name=r.thread||'Blackthorn Academy'; if(!grouped.has(name))grouped.set(name,[]); grouped.get(name).push(message(r));});
    c.messages=[...grouped.entries()].map(([name,messages])=>({name,messages}));
    c.storyVersion='V6.3';
  });
  window.BLACKTHORN_PHONE_FLOW_V63=rows;
}).catch(err=>{console.error(err);});