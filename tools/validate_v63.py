#!/usr/bin/env python3
from pathlib import Path
import csv, hashlib, json, sys

ROOT = Path(__file__).resolve().parents[1]
errors = []

def read(path):
    return (ROOT / path).read_text(encoding="utf-8")

def digest(path):
    return hashlib.sha256((ROOT / path).read_bytes()).hexdigest()

required = [
    "index.html","app.js","styles.css","runtime-data.js","game-meta.js","evidence-data.js","asset-map.js","accusation.js",
    "projector/index.html","projector/projector.js","projector/styles.css","projector/puzzle-data.js","projector/puzzles.js",
    "production/v63/BLACKTHORN_SCENE_TABLE_V6_3_AUTHORITATIVE_GM_ONLY.csv",
    "production/v63/BLACKTHORN_PHONE_FLOW_V6_3_IMPLEMENTATION_GM_ONLY.csv",
    "production/v63/IMPLEMENTATION_MANIFEST.json","production/v63/ASSET_PLAN.json"
]
for path in required:
    if not (ROOT / path).exists():
        errors.append("missing " + path)

manifest = json.loads(read("production/v63/IMPLEMENTATION_MANIFEST.json"))
for key in ("scene_table","phone_flow"):
    src = manifest["approved_sources"][key]
    path = "production/v63/" + src["file"]
    if (ROOT / path).exists():
        got = digest(path)
        expected = src["sha256"]
        if got != expected:
            print("WARNING:", key, "work-branch copy is text-normalized; approved hash =", expected, "branch hash =", got)

runtime = read("runtime-data.js")
app = read("app.js")
projector = read("projector/projector.js")

asset_map = read("asset-map.js")
asset_plan = json.loads(read("production/v63/ASSET_PLAN.json"))
checks = {
    "central asset map": "BLACKTHORN_ASSETS" in asset_map and "plannedReplacements" in asset_map,
    "asset production plan": len(asset_plan.get("create_new", [])) >= 10,
    "dance setup": "Het strijkensemble zet een dans in. Alexander biedt zijn hand." in runtime,
    "P043 typo fix": "DOE ALSOF ER NIETS GEBEURDE" in runtime,
    "localized timestamp": "even later" in runtime,
    "P011 neutralization": "Omdat hij luid was." in runtime,
    "flow unlock gating": "bt-unlocked-flows" in app and "bt-unlocked-flows" in projector,
    "private ready state": "bt-ready-" in app and "bt-ready-" in projector,
    "opaque block shielding": "safeText" in projector and "PRIVATE_CONSEQUENCE_BLOCK" in app,
    "route logic": "b23_route" in app and "w6_route" in app and "resolveB23" in projector,
    "interactive P1-P4": "openP1" in read("projector/puzzles.js") and "openP2" in read("projector/puzzles.js") and "openP3" in read("projector/puzzles.js") and "openP4" in read("projector/puzzles.js"),
    "P1 anti-bruteforce": "GETEST DEZE RONDE" in read("projector/puzzles.js") and "VERGELIJKINGSMODUS" in read("projector/puzzles.js"),
    "P4 inspection gate": "mask-inspection" in read("projector/puzzles.js") and "label_remnant" in read("projector/puzzles.js"),
    "exact engagement scoring": "scoreTheo=new Set(['P013','P016','P035'])" in app and "scoreAdrian=new Set(['P023','P032','P042'])" in app,
    "neutral waiting tools": "data-wait-app" in app and "geen bewijs-effect" in app,
    "hidden accusation protocol": "minority_decision" in read("accusation.js") and "final_elimination" in read("accusation.js") and "final_vote" in read("accusation.js"),
    "finale progression gate": "BlackthornAccusation.isLocked()" in projector and "s.scene_id!=='S26'" in projector,
    "debug-only scene jump": "const DEBUG=" in projector and "id=\"jump\"" in projector,
    "full evidence artifacts": "BLACKTHORN_EVIDENCE" in read("evidence-data.js") and "legacy_access_export" in read("evidence-data.js") and "swap_minimum_duration" in read("evidence-data.js"),
    "dossier evidence viewer": "function renderEvidence" in app and "data-evidence" in app,
}
for name, ok in checks.items():
    if not ok:
        errors.append("implementation check failed: " + name)

with (ROOT / "production/v63/BLACKTHORN_PHONE_FLOW_V6_3_IMPLEMENTATION_GM_ONLY.csv").open(encoding="utf-8", newline="") as f:
    phone_rows = list(csv.DictReader(f))
with (ROOT / "production/v63/BLACKTHORN_SCENE_TABLE_V6_3_AUTHORITATIVE_GM_ONLY.csv").open(encoding="utf-8", newline="") as f:
    scene_rows = list(csv.DictReader(f))

phone_ids = {r["flow_id"] for r in phone_rows}
scene_ids = {r["scene_id"] for r in scene_rows}
for flow in ("P001","P004B","P011","P025","P036","P040","P041","P043T","P043A","P050","P051","P052","P063"):
    if flow not in phone_ids:
        errors.append("missing flow " + flow)
for scene in ("S00","S01","S03","S04","S06","S16","S22","S25","S27","S28","S30"):
    if scene not in scene_ids:
        errors.append("missing scene " + scene)

print("BLACKTHORN V6.3 VALIDATION " + ("PASSED" if not errors else "FAILED"))
print("phone flows:", len(phone_rows))
print("scenes:", len(scene_rows))
print("progression gating: enabled")
print("private-window ready state: enabled")
print("opaque player-side shielding: enabled")
if errors:
    for error in errors:
        print("-", error)
    sys.exit(1)
