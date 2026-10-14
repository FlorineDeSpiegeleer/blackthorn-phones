window.BLACKTHORN_META={
 caseEvidence:{
  CASE_01:['headmistress_testimony','legacy_access_export'],
  CASE_02:['safe_reserve_mask'],
  CASE_03:['late_procession_log','gideon_pantry_sightline'],
  CASE_04:['isolde_photo_bundle'],
  CASE_05:['inventory_photo_1915','cab_receipt'],
  CASE_06:['credential_alias_register','service_master_issue_ledger','guard_housekeeping_key_inventory','service_niche_location'],
  CASE_07:['cabinet_keyholder_register','swap_minimum_duration','rowan_service_note','rowan_camera_frames'],
  CASE_08:['alexander_camera_2104'],
  CASE_09:['sable_statement','sebastian_march_observations','march_adrian_observation'],
  CASE_10:['gideon_final_alibi','march_final_alibi','agnes_final_alibi'],
  CASE_11:['selwyn_loan_record','elian_alexander_2056','annotation_notebook','veyne_ledger_content'],
  CASE_12:['original_veyne_mask'],
  CASE_13:['poisoned_reserve_mask'],
  CASE_14:['label_remnant']
 },
 evidenceLabels:{
  headmistress_testimony:'Headmistress — getuigenverklaring',legacy_access_export:'Legacy access export',
  safe_reserve_mask:'Veilig reservemasker',late_procession_log:'Late processional log',
  gideon_pantry_sightline:'Pantry zichtlijnnotitie',isolde_photo_bundle:'Eventfotografie — vrijgegeven selectie',
  inventory_photo_1915:'Inventarisfoto',cab_receipt:'Cabinet receipt',
  credential_alias_register:'Credential alias register',service_master_issue_ledger:'Service-Master issue ledger',
  guard_housekeeping_key_inventory:'Guard / housekeeping key inventory',service_niche_location:'Service-niche locatieblad',
  cabinet_keyholder_register:'Cabinet keyholder register',swap_minimum_duration:'Conservation timing note',
  rowan_service_note:'Rowan — servicenotitie',rowan_camera_frames:'Conservation cameraframes',
  selwyn_loan_record:'Council loan record',elian_alexander_2056:'Council eventfoto',
  annotation_notebook:'Annotatienotitieboek',veyne_ledger_content:'Ledger-uittreksel',
  alexander_camera_2104:'Security cameraframe',sable_statement:'Clinic verklaring',
  sebastian_march_observations:'Guard observations',march_adrian_observation:'Guard route-observatie',
  gideon_final_alibi:'Service alibi',march_final_alibi:'Guard alibi',agnes_final_alibi:'Housekeeping alibi',
  original_veyne_mask:'Teruggevonden ceremonieel masker',poisoned_reserve_mask:'Teruggevonden reservemasker',label_remnant:'Labelrest'
 },
 puzzleGates:{
  P1_READY:{all:['legacy_access_export'],any:[['late_procession_log','isolde_photo_bundle']]},
  P2_READY:{all:['cab_receipt','cabinet_keyholder_register','credential_alias_register','swap_minimum_duration','legacy_access_export']},
  P3_READY:{all:['rowan_camera_frames','alexander_camera_2104','elian_alexander_2056','sable_statement','sebastian_march_observations','march_adrian_observation','gideon_final_alibi','march_final_alibi','agnes_final_alibi','isolde_photo_bundle','legacy_access_export']},
  P4_READY:{all:['original_veyne_mask','poisoned_reserve_mask','label_remnant','annotation_notebook','selwyn_loan_record','veyne_ledger_content','safe_reserve_mask']}
 }
};