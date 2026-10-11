export interface Level {name:string;subtitle:string;hint:string;rows:string[];solution:string}
export const levels:Level[]=[
 {name:'First light',subtitle:'The courtyard',hint:'Visit both alcoves before taking the east gate.',rows:['#########','#*..#..E#','#.#.#.#.#','#.@...*.#','#########'],solution:''},
 {name:'Chromatic passage',subtitle:'The lock gallery',hint:'The red key opens the central passage. The blue key waits beyond it.',rows:['###########','#*r.#b..BE#','#.#.R.##.##','#.@.#.*..##','###########'],solution:''},
 {name:'A bridge of one',subtitle:'The flooded stacks',hint:'Stand west of the crate and push it into the water. You can undo any push.',rows:['#########','#*..#.*E#','#.#.#.###','#.@O~...#','#########'],solution:''},
 {name:'Ember courier',subtitle:'The furnace wing',hint:'Ember boots are in the lower alcove. Every route east crosses fire.',rows:['#########','#*..f.*E#','#.#.f.#.#','#.@Ff...#','#########'],solution:''},
 {name:'The quiet pool',subtitle:'The cistern',hint:'Find the wave cloak below. Then water becomes a path to the key.',rows:['###########','#*..~r.R*E#','#.#.~.#####','#.@W~....##','###########'],solution:''},
 {name:'Slippery shelves',subtitle:'The frost library',hint:'Slide to the far shore, pick up cleats below, then return to the seed above the ice.',rows:['###########','#####*#####','#@..iiii.E#','########C##','########*##','###########'],solution:''},
 {name:'Against the current',subtitle:'The wind tunnel',hint:'Get the anchor below before attempting to walk east against the arrows.',rows:['###########','#@.<<<<.*E#','#.#########','#M*########','###########'],solution:''},
 {name:'Crate choreography',subtitle:'The twin channels',hint:'Two crates, two channels. First collect the west seed. Move each crate east across its own channel.',rows:['###########','#*..#..*.E#','#..O~..####','#...#..####','#..O~r.R*##','#@..#..####','###########'],solution:''},
 {name:'The lantern vault',subtitle:'The heart of the archive',hint:'Restore the west seed, build the bridge, gather both protections, then open red before blue. Cleats help on the return route.',rows:['################','#*..#F.f*rR*bBE#','#.#.#..##.######','#@.O~W~..i*....#','#########C######','################'],solution:''}
];
