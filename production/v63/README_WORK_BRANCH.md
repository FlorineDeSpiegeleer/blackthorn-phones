# Blackthorn V2 Work Branch

This branch is the controlled implementation workspace for the approved Blackthorn Academy production build.

## Locked sources
- V13 canonical foundation: locked
- Story Architecture V3: locked
- Master Flow V4.1: implementation lock
- V6.3 production layer: externally approved

## Current policy
- Do not merge to main yet.
- Do not deploy as final Pages build yet.
- Build and test here first.
- Player-facing content must not reveal GM-only finale/consequence blocks.
- Hidden truth/evidence logic must not be casually changed.
- Protected opaque finale/consequence sources still need to be linked and SHA-256 recorded before definitive technical lock.

## Current implementation target
The current local V2 build already includes:
- three phone UIs;
- approved V6.3 phone flow with intent/reaction interactions;
- stage gating;
- Photos, Calendar, Map, Blackthorn, Directory, Notes, Camera shell;
- Dossier app;
- CASE evidence unlocks;
- P1–P4 gate checks;
- projector from approved V6.3 scene table;
- cross-tab stage synchronization;
- visual asset mapping.

The full local V2 build is being transferred incrementally to this branch so the existing live main branch remains untouched.

## Next GitHub implementation passes
1. Transfer phone/projector runtime files.
2. Re-map/reuse repository image assets where possible.
3. Add missing normalized assets only where necessary.
4. Run technical smoke tests.
5. Link protected opaque GM sources and record hashes.
6. Merge only after final implementation validation.
