// Historical compact trial fixture for existing timing regressions.
import type {LiveOptions} from '../../src/realtime';
import type {Level} from '../../src/levels';

// Original layout: a separate proof slice; existing campaign/progress indices stay1–9.
export const timingTrial:Level&LiveOptions={
 name:'The clockwork crossing',subtitle:'A real-time timing trial',
 hint:'Collect the west seed. The upper orb weights the brown plate to release the holding trap. Take the red key in the lower alcove. Open the red door, retreat into the key alcove, and let the roaming orb pass before crossing east for the last seed and gate.',
 rows:['###############','#...p...#######','###############','#@*.T..R..*E###','#..##r##.##.###','#..##.##.##.###','###############'],
 timeLimit:60,
 creatures:[{position:16,direction:'right'},{position:53,direction:'right'}],
 traps:[{position:49,button:19}]
};
