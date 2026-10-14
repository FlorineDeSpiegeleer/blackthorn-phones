#!/usr/bin/env python3
from pathlib import Path
import csv, hashlib, json, re, sys

ROOT=Path(__file__).resolve().parents[1]
errors=[]

def fail(msg): errors.append(msg)
def text(path): return (ROOT/path).read_text(encoding="utf-8")
def sha(path): return hashlib.sha256((ROOT/path).read_bytes()).hexdigest()

required=[
 "index.html","app.js","styles.css","runtime-data.js","game-meta.js",
 "projector/index.html","projector/projector.js","projector/styles.css",
 "production/v63/BLACKTHORN_SCENE_TABLE_V6_3_AUTHORITATIVE_GM_ONLY.csv",
 "production/v63/BLACKTHORN_PHONE_FLOW_V6_3_IMPLEMENTATION_GM_ONLY.csv",
 "production/v63/IMPLEMENTATION_MANIFEST.json"
]
for p in required:
    if not (ROOT/p).exists(): fail("missing "+p)

manifest=json.loads(text("production/v63/IMPLEMENTATION_MANIFEST.json"))
sources=manifest["approved_sources"]
for key in ("scene_table","phone_flow"):
    p=ROOT/"production/v63"/sources[key]["file"]
    if p.exists():
        got=sha(p); exp=sources[key]["sha256"]
        if got!=exp: fail(f"{key} hash mismatch: {got} != {exp}")

runtime=text("runtime-data.js")
app=text("app.js")
proj=text("projector/projector.js")

checks={
 "dance setup":"Het strijkensemble zet een dans in. Alexander biedt zijn hand." in runtime,
 "P043 typo fix":"DOE ALSOF ER NIETS GEBEURDE" in runtime,
 "localized timestamp":"even later" in runtime and "moments later" not in runtime,
 "P011 neutralization":"Omdat hij luid was." in runtime,
 "flow unlock gating":"bt-unlocked-flows" in app and "bt-unlocked-flows" in proj,
 "private ready state":"bt-ready-" in app and "bt-ready-" in proj,
 "opaque block shield":"PRIVATE_CONSEQUENCE_BLOCK" in app and "safeText" in proj,
 "route sync":"b23_route" in app and "w6_route" in app and "resolveB23" in proj,
}
for name,ok in checks.items():
    if not ok: fail("implementation check failed: "+name)

# Player-facing runtime files must not contain literal protected payloads.
for p in ["index.html","app.js","styles.css","runtime-data.js","game-meta.js","projector/index.html","projector/projector.js","projector/styles.css"]:
    s=text(p)
    if re.search(r"FINAL_REVEAL_BLOCK_GM_\d+|PRIVATE_CONSEQUENCE_BLOCK_[A-Z]+_GM_\d+",s):
        # references in shielding regex are allowed, payloads are not.
        lines=[ln for ln in s.splitlines() if "FINAL_REVEAL_BLOCK_GM_" in ln or "PRIVATE_CONSEQUENCE_BLOCK_" in ln]
        unsafe=[ln for ln in lines if "test(" not in ln and "match(" not in ln and "replace(" not in ln and "/(?:" not in ln]
        if unsafe: fail("protected placeholder leaked into player runtime: "+p)

with (ROOT/"production/v63/BLACKTHORN_PHONE_FLOW_V6_3_IMPLEMENTATION_GM_ONLY.csv").open(encoding="utf-8",newline="") as f:
    rows=list(csv.DictReader(f))
ids={r["flow_id"] for r in rows}
for need in ["P001","P004B","P011","P025","P036","P040","P041","P043T","P043A","P050","P051","P052","P063"]:
    if need not in ids: fail("missing required flow "+need)

with (ROOT/"production/v63/BLACKTHORN_SCENE_TABLE_V6_3_AUTHORITATIVE_GM_ONLY.csv").open(encoding="utf-8",newline="") as f:
    scenes=list(csv.DictReader(f))
sceneids={r["scene_id"] for r in scenes}
for need in ["S00","S01","S03","S04","S06","S16","S22","S25","S27","S28","S30"]:
    if need not in sceneids: fail("missing required scene "+need)

print("BLACKTHORN V6.3 VALIDATION", "PASSED" if not errors else "FAILED")
print("source files:",2)
print("phone flows:",len(rows))
print("scenes:",len(scenes))
print("opaque player-side shielding: enabled")
print("private-window ready state: enabled")
if errors:
    for e in errors: print("-",e)
    sys.exit(1)
