/* Approved V6.3 projector source loader. */
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
window.BLACKTHORN_SCENE_IMAGE_MAP={
  S00:'assets/blackthorn_academy_exterior_rainy_evening.png',
  S01:'assets/guest_suite_getting_ready.png',
  S03:'assets/guest_suite_getting_ready.png',
  S04:'assets/grand_stair_arrival.png',
  S05:'assets/grand_hall_masked_ball.png',
  S06:'assets/observatory_gallery_night.png',
  S06A:'assets/investigation_scene_wide.png',
  S08:'assets/grand_hall_masked_ball.png',
  S10:'assets/blackthorn_library_evening.png',
  S12C:'assets/east_gallery_evening.png',
  S13:'assets/blackthorn_library_evening.png',
  S14:'assets/council_room_blackthorn.png',
  S16:'assets/maintenance_stair.png',
  S16A:'assets/maintenance_stair.png',
  S16B:'assets/maintenance_stair.png',
  S17:'assets/clinic_examination_room.png',
  S18:'assets/blackthorn_library_evening.png',
  S20:'assets/library_annex_archive_room.png',
  S22:'assets/service_corridor.png',
  S23:'assets/council_room_blackthorn.png',
  S24C:'assets/conservation_room.png',
  S26:'assets/council_room_blackthorn.png',
  S27:'assets/council_room_blackthorn.png',
  S30:'assets/guest_suite_getting_ready.png'
};
window.BLACKTHORN_PROJECTOR_READY=fetch('../production/v63/scenes.csv').then(r=>{if(!r.ok)throw new Error('V6.3 scene table unavailable');return r.text()}).then(t=>{window.BLACKTHORN_SCENES_V63=btParseCsv(t);});