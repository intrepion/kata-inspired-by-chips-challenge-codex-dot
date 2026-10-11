# Verification — 2026-10-11

## Automated
22 tests pass through public engine/session/save seams: single-use seeds, required-gate seeds, colored door consumption, no negative keys, crate bridges/extinguishing, blocked/chain/item/ice/current pushes, water/fire protection and loss, forced motion direction/block termination/cycle detection, anchor/cleats, atomic undo restoring terrain/inventory/death, full restart, unknown-tile rejection, save corruption and bounds. Nine campaign solution routes replay and reset. Stage 8 requires both crates (exhaustive reachable-state searches with either removed).

Strict typecheck and production build pass. npm audit reports zero vulnerabilities. Initial test invocation used tsx CLI and hit sandbox IPC restrictions; scripts use Node --import tsx directly. No security changes.

## Mac Chrome visible play
Played every stage using normal controls: stage 1 adjacent-tile click + arrow keys; stages 2–5 arrow keys; stage 6 visible D-pad buttons; stages 7–9 arrow keys. Each visibly reported “Chamber restored”; final stage showed “Expedition complete”. Original routes stored in src/solutions.json. Checked unprotected fire death in stage 4, U recovery, restart and successful protected crossing.

Reload showed completed stage 1 score and stage 2 unlocked while stage 3 remained locked; final reload preserved all nine unlocks. Mute persisted on reload. While Chambers dialog open, Right left player/turn unchanged. Escape restored Chambers button focus. D-pad Enter retained “Move right” focus after moving. Native buttons also support Tab/Enter navigation.

390×844 viewport: visible D-pad activation moved Pip; document clientWidth and scrollWidth both 375 (scrollbar consumes 15px), no horizontal overflow. Full-page desktop/mobile screenshots saved and visually inspected. Viewport reset afterward. CSS honors prefers-reduced-motion, with no gameplay timer/animation dependency. App console had no errors; existing MetaMask extension produced unrelated stream/listener warnings.

## Workflow adaptation and limits
Read local Grill with Docs, grilling, domain-modeling (including formats), Implement, TDD, code-review, plus official Grill with Docs/Implement GitHub pages. User delegation replaced design interview and seam-confirmation pauses. Public seams were documented before tests. Actual red→green evidence: initial seed/gate test failed for missing engine, then passed; unknown-tile test failed before validation and passed after fix. Remaining interaction/campaign tests were added around the implemented engine and are regression/specification checks, not a claim of complete slice-by-slice TDD. UI/CSS are browser verified, not test-first. Independent review agents were explicitly required by code-review skill.

No automated cross-browser matrix or screen-reader session. Persistence stores campaign results/settings, not mid-stage snapshots. QA completion is cleared through the visible Reset expedition progress control before handoff. No sidebar registration API was available; folder clone is the deliverable. No public deployment, external art/audio, paid service, autostart or security changes.
