# Lantern Vault acceptance criteria
An original nine-stage puzzle expedition starring courier Pip, recovering light seeds from a flooded mountain archive. No commercial art, names, sound or level layouts. All art is CSS and Unicode, audio is synthesized locally.

1. Collect every light seed then enter the gate. Show remaining seeds and inventory.
2. Cardinal commands are atomic turns; no timers/enemies. Red/blue keys consume once on matching doors. Doors remain open.
3. Push one crate onto empty ground; water consumes it to create a permanent bridge; fire consumes it and extinguishes. No chain pushes, no pushing onto collectibles, exits, ice or conveyors.
4. Water and fire kill without matching permanent equipment. Ice continues entry direction; arrows force their indicated direction. Cleats/magnets suppress their respective forces. Blocked forced motion stops. Repeated forced states cause recoverable loss.
5. One undo reverses an entire command including forced motion, consumption and death. Restart resets all stage state. Progress remains earned across restart and undo. No duplicate collection or rewards.
6. Nine hand-authored stages introduce and require mechanisms, then combine them. Encode and replay a solution for each using the public command seam. Meaningful invalid and losing cases tested.
7. Native accessible buttons, keyboard arrows/WASD, touch D-pad, click adjacent cells, hints, guide, stage menu, unlocks, best moves, save validation, mute and reduced motion.
8. Full tests, strict typecheck/build, audit; visible browser play of all stages, recovery, reload, menu focus and narrow layout. Private remote and CI verified; session-only localhost server.

## Delegated design tree
Identity → Lantern Vault, warm midnight archive aesthetic → CSS tile art/local synthesized tones.
Mechanics → deterministic cardinal turns → atomic forced movement → snapshot undo → full reset.
Campaign → nine compact bottleneck stages → equipment recovery and crate positioning → final combined route.
Delivery → Vite/TypeScript without framework → local-only persistence → private GitHub; localhost 5183.
The user delegated recommended choices and requested no design questions. This replaces skill interview waits and seam confirmation. Agreed public test seams: createGame, move, undo/restart (UI orchestration), and parseProgress. Tests begin with failing slices; UI/art are not test-first. Independent standards/spec reviewers run after implementation.

## Movement priority
Status guard → destination bounds/wall → door inventory → crate destination validation/push/terrain conversion → move → collect → lethal terrain → gate eligibility → forced motion. Resolve forced tiles until grounded, blocked or cycle. Invalid voluntary input neither counts nor creates undo history. A successful command counts once regardless of forced steps. Menus consume keyboard input; repeated/composed keys ignored.

## Research
Original publisher-distributed manual: https://cdn.steamstatic.com/steam/apps/1402520/manuals/Chip_s_Challenge.pdf?t=1599518905 confirms collection-gated exits, colored keys/doors, bridge-building blocks, protective gear, ice/force floors. This project deliberately specifies its own deterministic interactions rather than emulating platform-specific quirks.
Verified Matt Pocock sources: https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md and https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md. Local copies and dependencies read before design.
