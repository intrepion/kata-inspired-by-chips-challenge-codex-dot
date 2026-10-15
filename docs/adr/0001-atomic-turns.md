Scope since2026-10-14: retained for the nine practice chambers; the separate timing trial follows [ADR0002](0002-realtime-trial.md).

# Atomic turns and full recovery
The campaign uses deterministic command-driven turns with no clock or moving enemies. Ice/conveyors resolve within a single undoable turn, making the same route work across touch, keyboard and varying frame rates. Full snapshot undo trades a little memory for exact recovery of terrain, consumed items and death; cycle detection turns forced loops into recoverable loss.
