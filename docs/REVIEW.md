> The speed-choice results below are historical. The latest correction removes all speed controls and fixes1× full speed. Current follow-up evidence: /Users/intrepion/Documents/Codex/2026-10-14/task/chips-full-speed/delivery-report.md.

# Independent code review

Baseline bf9aa95 (empty repository) → initial implementation 96892fb. Two parallel agents followed the local Matt Pocock code-review skill, independently checking CODING_STANDARDS.md and docs/SPEC.md.

## Standards
One P2: rebuilding the UI restored data-action controls but not data-dir controls, losing visible keyboard focus after D-pad activation. Fixed by recording/restoring the direction control identity. Browser verification: Enter on Move right moves Pip; document.activeElement remains labeled Move right. Escape from menu restores Chambers focus.

## Spec
One P1: stage 8 could win without moving its lower crate because the east channels connected. Fixed by separating east regions with a wall row. New BFS necessity test removes each starting crate in turn and proves neither modified stage can win. Revised successful route replays through public commands and normal Chrome arrow keys.

Both axes found no other material violations. See verification for validation after repairs.

Reviewers rechecked 771a696 and confirmed both findings closed, with no remaining material issues. An additional final-vault bypass check tightened mandatory fire protection and added a reachability regression test.

## Real-time slice review · 2026-10-14–15

Two independent Standards/Spec reviews completed against baseline 6ecdc840b87fd06e9b0d338b4ac6458ca229392c and the local slice. Standards found no hard violations; optional duplicated forced-floor mapping was consolidated. Spec found no critical mismatch/scope creep; a mid-tick first-repeat observation gained a failing regression and was corrected so repeats cannot occur before 200 ms. Independent recheck passed all 17 focused cases.

Actual Chrome subsequently found the startup-clock exception missed by the engine tests. The two-line first-callback initialization correction was independently reviewed on both axes. A harness executing the actual transpiled frame block with real LiveSession passed startup, cadence, interruption/pause/modal baselines and callback scheduling. Fresh actual-checkout tests/typecheck/build/solver pass; Chrome now verifies held movement, autonomous orbs/trap release, countdown, contact death/retry, pause, complete sample win and natural timeout. Native focus-loss testing remains pending a manually unlocked Mac. The complete 15-file slice remains local, uncommitted and unpushed. See current verification for observed facts and testing limits.


## Pacing follow-up

Review this focused change against the pre-pacing source snapshot in the task workspace chips-pacing/before rather than treating earlier uncommitted fidelity code as new pacing work. Originating requirements are Comfortable default, retained Classic pace, a shared action/hazard/countdown scale, stable switching/pause/input and preserved campaign/save behavior. Independent Standards and Spec reviews and their closure are recorded in the pacing task report.

Pacing review closure: both independent reviewers found zero implementation findings. The actual checkout passes all47 tests, typecheck, build and nine solver routes. Chrome pacing/input/switching checks pass. Native app focus loss and the new screenshot remain unverified after computer-control/capture timeouts; these are explicit QA gaps in the delivery report, not claimed successes.

## Gentle pursuit follow-up

Reviewed against the captured pre-iteration local snapshot in chips-teeth/before, with scope in chips-teeth/SPEC.md and docs/PURSUIT-SPEC.md. Independent Standards and Spec reviews found zero implementation findings. Prior uncommitted fidelity/pacing work was preserved and excluded from this focused diff. Actual 59 tests/typecheck/build/nine solver routes pass. Chrome Gentle win, lure/camera/controls/key-door/pause/retry/practice Undo and original fanged art pass; detailed evidence and remaining native-focus/device/exact-port gaps are in the task delivery report. The single evidence-backed approval retry applied the 19-file patch successfully and only 5183 was refreshed. No commit or push.

## Fixed full speed follow-up · applied and browser-verified locally

Removed the speed widget, selection copy/state, rate table/API and obsolete speed-option tests. The single 1× clock retains 200ms ordinary player/orb steps, 400ms Fangling steps, 100ms sliding and a 90-second running-time budget. Terrain, viewport, pursuit behavior, save parser, campaign layouts/solutions and dependencies are unchanged from the pre-correction snapshot.

Actual checkout: **53/53 tests**, typecheck, production build and all nine campaign solver routes pass. Both independent reviews report zero implementation findings. Canonical port5183 alone was refreshed, owned PID60845→75063; served HTML/JS/CSS match the actual build (index-wWfHDAhY.js). Preview hashes and process details are in chips-full-speed/preview-5.json.

Chrome verified zero speed widgets, current full-speed guide copy, three steps from a 450ms Right hold, a one-second decrement from a 1100ms no-movement hold, paused time/position stability, retry, scrolling 9×9 view through the32×32 map, Fangling plate/trap release, key/door and a complete 82-step win with66 seconds remaining. Returning to practice, clicking Move right and pressing U restored the prior position/turn. Campaign footer stayed0/9; no save reset or storage injection. The final trial is paused90s/00steps. A compact actual completion screenshot is saved and visually checked at chips-full-speed/qa/full-speed-complete.jpg; console error read returned none.

Exact timing is automated evidence: independent public probe on Patient Pursuit remains playing at89,999ms, expires at90,000ms/1,800ticks and retries paused90s. Browser rate observations are approximate. This follow-up did not repeat a full90-second browser timeout, intentional collision loss, native OS focus-loss, physical touch, mobile, screen-reader or cross-browser checks. Prior native focus evidence remains inconclusive. Historical speed-choice evidence above is superseded. No commit, push, dependency change or autostart. Full current report: /Users/intrepion/Documents/Codex/2026-10-14/task/chips-full-speed/delivery-report.md.

## Final publication review

Pinned full-scope baseline: origin/main0265ea0 (MIT/ignore maintenance retained), complete22 tracked/new paths including all prior uncommitted fidelity work. Independent Standards review found one P2 visible-focus regression on Escape; Chrome reproduced BODY focus. The cancel handler now prevents default and invokes the existing close/opener-focus path. Independent source repair recheck leaves zero source findings; fresh Chrome verifies both dialogs return focus to their corresponding opener button while gameplay stays paused. Independent Spec review found zero implementation findings or scope creep. Raw reports and separate closure remain in the chips-wrap-up workspace.

Final actual-checkout53tests/typecheck/build/nine solver routes pass, and the dependency audit finds zero vulnerabilities. Latest human approval authorizes commit/push and exact-SHA CI monitoring; historical no-commit statements above describe prior iterations. Native OS focus loss/return is still blocked by unreliable window targeting/unavailable control and then an explicitly locked Mac. No success inferred from synthetic engine tests or unrelated window observations. Full evidence, exact commit and terminal CI results: /Users/intrepion/Documents/Codex/2026-10-14/task/chips-wrap-up/delivery-report.md.
