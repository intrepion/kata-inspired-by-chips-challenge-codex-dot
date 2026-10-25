# Lantern Vault

An original real-time timing trial plus nine preserved practice chambers, inspired by Chip's Challenge. Courier Pip restores a forgotten mountain archive by collecting light seeds, unlocking colored doors, building crate bridges, finding protective equipment and mastering ice and arrow currents.

## Play locally

Requires Node 24. From this directory:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5183. Port 5183 is strict; occupied ports fail rather than taking a neighbor's port. The server binds only to this Mac. The current review serves the production build through a detached Vite preview for this Mac session. Its PID, output log and served-asset hashes are recorded in the review workspace at `/Users/intrepion/Documents/Codex/2026-10-14/task/chips-wrap-up/preview-5.json`. Stopping that process or rebooting ends it; no boot/login startup is installed. For a fresh foreground production preview, run `npm run build`, then `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 5183 --strictPort`. The existing `npm run dev` command remains available for source development. Check whether this project's port is occupied before starting another server.

The **Patient Pursuit** trial opens paused: choose **Start trial**. It runs at **full speed (1×)** with no speed controls: ordinary player/orb steps take 200ms and Fangling/Teeth steps take 400ms. Its 90 trial seconds equal 90 actual running seconds. Pause and menus freeze the world; resume needs fresh movement input.

Hold arrows/WASD or the D-pad to walk; click an adjacent visible tile for one step. P/Escape pauses, Space resumes, R retries. Focus loss, hidden tabs and menus are wired to pause and discard input, but native app-focus verification remains blocked by unavailable reliable window control and a locked Mac. The 32×32 world scrolls in whole tiles through a nine-by-nine view, with Pip centered except near edges. It does not shrink the entire map to fit. View coordinates help you keep your bearings. Field guide and the field note explain the puzzle. U undoes a practice turn; the trial has no Undo. Completed chambers, best moves and mute retain the existing save format. In-progress boards do not survive reload; reduced-motion preferences are respected.

## Rules

In practice, every accepted move is one deterministic turn, including forced movement. All seeds are required for a gate. Red/blue keys are consumed by matching doors. Crates push one at a time on floor, bridge water, and extinguish fire; they cannot push onto items, ice or currents. Ember boots protect fire, wave cloak protects water, cleats stop ice, anchor stops currents. A forced-motion loop causes recoverable loss. Practice state can be restored by undo or restart. These nine chambers remain untimed practice, with their original terrain, solutions, atomic forced turns and move scores. The separate Patient Pursuit trial has a protected western observation room, gravel that creatures cannot enter, a Fangling gallery and a larger orb courtyard. The original fanged creature uses Teeth-style pursuit: it is half as fast as Pip, favors the greater separation (vertical on ties), tries the other toward-Pip axis if blocked, then stays put. It never routes around walls. Lure it east onto the plate below the holding trap, then cross, take the northeast key and its south door, collect both courtyard seeds and reach the southeast gate. A shut trap accepts entry but holds Pip until released. Orb contact is lethal; watch from a different row before crossing. Trial completion does not change campaign unlocks or scores; Return to practice preserves its in-memory board.

## Verify

```sh
npm test
npm run typecheck
npm run build
npm audit --audit-level=high
node --import tsx tests/solve.ts
```

Campaign solution certificates live in `src/solutions.json`; the test suite replays them through the public Session command API. The solver is development tooling, not bundled into the game. Tests also prove both stage-eight crates are required. CI repeats tests, production build/typecheck and audit on pushes.

See [acceptance criteria](docs/SPEC.md), [glossary](GLOSSARY.md), [verification evidence](docs/VERIFICATION.md), and [review results](docs/REVIEW.md).

All layouts, character design, CSS art and synthesized tones are original. No commercial assets or external runtime services. The folder is a Git clone; no Codex sidebar project registration was performed.

![Desktop](docs/screenshots/desktop.jpg)
![Touch layout](docs/screenshots/mobile.jpg)

## Full-speed pursuit

The single clock uses 20 game ticks per real second. Ordinary movement takes 4 ticks (200ms), Fangling/Teeth 8 ticks (400ms), and unprotected player sliding 2 ticks (100ms). Keyboard repeat does not set speed. No selectable pace or speed preference is retained.

The original Tile World author's [MS engine](https://github.com/BR903/tworld/blob/master/mslogic.c) supplies the independently implemented pursuit reference; [gen.h](https://github.com/BR903/tworld/blob/master/gen.h) supplies 20Hz/32×32 dimensions. Exact original simultaneous-step/phase and enemy forcing/controller quirks remain outside this sample. Nine-by-nine is the documented viewport convention, not a direct commercial-executable measurement. All nine campaign layouts/solutions, existing saves and atomic practice behavior are preserved.

Current local verification: 53 tests, typecheck, build and all nine solver routes pass. Chrome completed the full-speed trial in 82 steps with 66 seconds remaining; practice step/Undo and campaign progress were preserved.

Read [pursuit criteria](docs/PURSUIT-SPEC.md), [real-time criteria](docs/REALTIME-SPEC.md), [verification](docs/VERIFICATION.md) and the local follow-up report at /Users/intrepion/Documents/Codex/2026-10-14/task/chips-wrap-up/delivery-report.md. That report records the publication commit, exact CI results and remaining native focus/device limitations.

## Play online

[Play the hosted game](https://intrepion.github.io/kata-inspired-by-chips-challenge-codex-dot/)
