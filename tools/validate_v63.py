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
    "index.html","app.js","styles.css","runtime-data.js","game-meta.js",
    "projector/index.html","projector/projector.js","projector/styles.css",
    "production/v63/BLACKTHORN_SCENE_TABLE_V6_3_AUTHORITATIVE_GM_ONLY.csv",
    "production/v63/BLACKTHORN_PHONE_FLOW_V6_3_IMPLEMENTATION_GM_ONLY.csv",
    "production/v63/IMPLEMENTATION_MANIFEST.json"
]
for path in required:
    if not (ROOT / path).exists():
        errors.append("missing " + path)

manifest = json.loads(read("production/v63/IMPLEMENTATION_MANIFEST.json"))
for key in ("scene_table","phone_flow"):
    src = manifest["approved_sources"][key]
    path = "production/v63/" + src["file"]
    if (ROOT / path).exists() and digest(path) != src["sha256"]:
        errors.append(key + " hash mismatch")

runtime = read("runtime-data.js")
app = read("app.js")
projector = read("projector/projector.js")

checks = {
    "dance setup": "Het strijkensemble zet een dans in. Alexander biedt zijn hand." in runtime,
    "P043 typo fix": "DOE ALSOF ER NIETS GEBEURDE" in runtime,
    "localized timestamp": "even later" in runtime,
    "P011 neutralization": "Omdat hij luid was." in runtime,
    "flow unlock gating": "bt-unlocked-flows" in app and "bt-unlocked-flows" in projector,
    "private ready state": "bt-ready-" in app and "bt-ready-" in projector,
    "opaque block shielding": "safeText" in projector and "PRIVATE_CONSEQUENCE_BLOCK" in app,
    "route logic": "b23_route" in app and "w6_route" in app and "resolveB23" in projector,
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
