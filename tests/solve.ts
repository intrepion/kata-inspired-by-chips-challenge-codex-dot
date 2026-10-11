import {levels} from '../src/levels.js';import {createGame,move,type Game,type Direction} from '../src/engine.js';
import {writeFileSync} from 'node:fs';
const dirs:Direction[]=['up','down','left','right'];const letters=['U','D','L','R'];
const key=(s:Game)=>JSON.stringify([s.tiles,s.player,s.keys,s.gear.sort(),s.remaining]);
const solutions:string[]=[];
for(const l of levels){const start=createGame(l.rows);const queue:{s:Game;path:string}[]=[{s:start,path:''}];const seen=new Set([key(start)]);let path:string|undefined;
 for(let head=0;head<queue.length&&head<250000;head++){const {s,path:p}=queue[head];if(s.status==='won'){path=p;break;}for(let d=0;d<4;d++){const n=move(s,dirs[d]);if(n===s||n.status==='lost')continue;const k=key(n);if(!seen.has(k)){seen.add(k);queue.push({s:n,path:p+letters[d]});}}}
 console.log(l.name,path,seen.size);if(path===undefined)throw Error('Unsolved '+l.name);solutions.push(path);
}
writeFileSync('src/solutions.json',JSON.stringify(solutions,null,2)+'\n');
