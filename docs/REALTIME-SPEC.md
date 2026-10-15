# Real-time full-speed criteria

The latest user correction fixes the game at1× and removes speed controls, choices and selection state/API. A single20Hz clock advances ordinary player/orb movement every4 ticks (200ms), Teeth/Fangling every8 ticks (400ms), unprotected player sliding every2 ticks (100ms), and countdown20 ticks per real running second. The90-second trial has90 actual running seconds. Paused/menu/interrupted time is discarded rather than caught up.

Held arrows/WASD/D-pad use simulation cadence, with immediate fresh presses where cooldown permits; OS repeat cannot accelerate movement. Pause, menus and existing focus/visibility handlers clear input; resume needs a fresh press. Retry restores terrain, actors, inventory and timer, paused. Contact in either movement order and head-on crossing are lethal. A held player trap releases while its linked plate is weighted.

The32×32 Patient Pursuit map,9×9 player-centered clamped tile viewport, original Fangling art, greater-axis/vertical-tie/fallback/no-detour pursuit, key/door and orb courtyard remain unchanged. See [pursuit criteria and exclusions](PURSUIT-SPEC.md). Exact MS actor phase/controller/forcing quirks remain excluded from the sample.

The nine practice layouts/solutions, atomic forced movement, Undo/scores and existing save/mute schema stay intact. No speed preference is persisted. Public seams are LiveSession input/advance/pause/resume/restart and observable board/actors/time, plus boardViewport. Tests cover fixed rates, coherent time, pause/input clearing, expiry/retry, collisions/obstacles, mandatory lure and literal full-speed completion. Browser verifies removed controls, full-speed input/timer wiring, view and preserved interactions.

The user authorized final Chip’s commit/push and exact-commit CI monitoring after verification. No force push, dependency change or unrelated preview. Refresh only the verified owned5183 listener; preserve prior uncommitted changes and all other source/listener state. Mid-tick fresh-input repeats quantize upward to the next50ms boundary, so no early repeat; this controller convention is not claimed as an exact original-port quirk.
