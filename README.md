# Blackthorn Phones

Mobiele in-game telefoons voor Sam, Maxine en Florine. 

## Vaste spel-links
- Sam: https://FlorineDeSpiegeleer.github.io/blackthorn-phones/?character=sam
- Maxine: https://FlorineDeSpiegeleer.github.io/blackthorn-phones/?character=maxine
- Florine: https://FlorineDeSpiegeleer.github.io/blackthorn-phones/?character=florine

De drie versies gebruiken dezelfde interface en apps, met per personage eigen inhoud en vormgeving.

## Apps
Messages · Photos · Camera · Blackthorn · Map · Notes · Calendar · Calls

De verhaalinformatie in Messages, Calls, Calendar, Map en Blackthorn is voorlopig als placeholder voorbereid en kan later in `data.js` worden ingevuld. De code bevat ook voorbereiding voor latere PIN-vergrendelingen.

## GitHub Pages
De repository bevat een Pages workflow in `.github/workflows/pages.yml`. Bij wijzigingen op `main` wordt de statische site opnieuw gedeployed.

## Telefoontest
Voor het spel: open iedere character-link op een echte telefoon en test Photos, Notes, browser-terug en Camera-toestemming.


## Content handoff V2 — changelog
Updated files:
- `data.js`: canonical Calendar, Announcements, Directory, Map, Calls and character-specific Messages.
- `app.js`: story-stage filtering, refresh-safe per-device stage storage and hidden GM stage controls.
- `styles.css`: sender labels and GM control styling.

Implemented stages:
`FOUNDERS_MORNING` → `GETTING_READY` → `BALL` → `INCIDENT` → `WEEK1` → `WEEK2` → `WEEK3` → `WEEK4` → `FINALE` → `EPILOGUE`.

Production control:
Append `#gm` to a character URL to open the hidden stage selector on that device. The selected stage is stored locally for that character and survives refreshes.

Photos, Camera and Notes were left technically intact.


## V6.3 production build

Branch `production-v63-build` wires the externally approved V6.3 production layer into the existing site.

- `production/v63/scenes.csv`: approved scene table.
- `production/v63/phones.csv`: approved phone flow.
- `story-v63.js`: loads the phone flow into the three existing phone interfaces.
- Phone conversations now render approved intent buttons and NPC reactions.
- The existing Calendar, Photos, Map, Camera, Notes and hidden stage controls remain intact.
- `projector/v63-scenes.js` loads the approved scene table.
- `projector/projector.js` renders directly from that table instead of the old A0–A5 prototype.
- `production/v63/image-plan.json` maps the supplied image library to scenes and characters for the asset pass.

The visual-library files themselves are not renamed or uploaded by this commit; the mapping is isolated so assets can be inserted without changing story logic.
