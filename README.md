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
