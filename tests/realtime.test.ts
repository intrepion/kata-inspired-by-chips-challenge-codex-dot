import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LiveSession} from '../src/realtime.js';
import {timingTrial} from './fixtures/clockwork-trial.js';
import {levels} from '../src/levels.js';
import {Session} from '../src/engine.js';
import {readFileSync} from 'node:fs';

test('holding uses200ms tile cadence; OS repeats cannot accelerate; release stops',()=>{
 const game=new LiveSession(['############','#@........E#','############']);
 game.press('ArrowRight','right');assert.equal(game.state.player,14);
 game.advance(199);assert.equal(game.state.player,14);
 game.press('ArrowRight','right');assert.equal(game.state.player,14);
 game.advance(1);assert.equal(game.state.player,15);
 game.advance(400);assert.equal(game.state.player,17);
 game.release('ArrowRight');game.advance(800);assert.equal(game.state.player,17);
});

test('a press partway through a tick cannot repeat before200ms',()=>{
 const game=new LiveSession(['############','#@........E#','############']);game.advance(49);game.press('Right','right');assert.equal(game.state.player,14);
 game.advance(199);assert.equal(game.state.player,14);game.advance(2);assert.equal(game.state.player,15);
});

test('all nine existing practice routes and scores survive the held-control adapter',()=>{
 const solutions:string[]=JSON.parse(readFileSync(new URL('../src/solutions.json',import.meta.url),'utf8'));
 const directions={R:'right',L:'left',U:'up',D:'down'} as const;
 for(const [i,level] of levels.entries()){
  const live=new LiveSession(level.rows,{practice:true}),legacy=new Session(level.rows);
  for(const input of solutions[i]){const direction=directions[input as keyof typeof directions];live.tap(direction);live.advance(200);legacy.command(direction);}
  assert.equal(live.state.status,'won',level.name);assert.deepEqual(live.state,legacy.state,level.name);
 }
});

test('sample ordinary-input route times trap, takes key, evades orb and completes',()=>{
 const game=new LiveSession(timingTrial.rows,timingTrial);
 const directions={R:'right',L:'left',U:'up',D:'down'} as const;
 for(const input of 'RRRWDURRLLDWURRRRRR'){
  if(input!=='W')game.tap(directions[input as keyof typeof directions]);
  game.advance(200);
 }
 assert.equal(game.state.status,'won');assert.equal(game.state.remaining,0);assert.equal(game.state.keys.r,0);
 assert.equal(game.remainingSeconds,57);const ended=structuredClone(game.state);game.advance(90000);assert.deepEqual(game.state,ended);
});

test('player contact and head-on edge crossing cannot tunnel through an orb',()=>{
 const immediate=new LiveSession(['########','#@....E#','########'],{creatures:[{position:10,direction:'right'}]});immediate.press('Right','right');assert.equal(immediate.state.status,'lost');
 const crossing=new LiveSession(['########','#@....E#','########'],{creatures:[{position:11,direction:'left'}]});crossing.press('Right','right');crossing.advance(200);assert.equal(crossing.state.status,'lost');assert.equal(crossing.state.player,10);assert.equal(crossing.state.moves,1);
});

test('shut doors and seeds block creatures; malformed level metadata rejects',()=>{
 const game=new LiveSession(['########','#@.R.*E#','########'],{creatures:[{position:12,direction:'left'}]});game.advance(1000);assert.equal(game.creatures[0].position,12);
 assert.throws(()=>new LiveSession(['#####','#@.E#','#####'],{creatures:[{position:6,direction:'right'}]}),/spawn/);
 assert.throws(()=>new LiveSession(['#####','#@TE#','#####']),/trap/);
 assert.throws(()=>new LiveSession(['#####','#@.E#','#####'],{timeLimit:0}),/time/);
});

test('direction priority and alias release obey cadence without extra movement',()=>{
 const game=new LiveSession(['########','#...@.E#','########']);game.press('ArrowLeft','left');assert.equal(game.state.player,11);
 game.press('KeyD','right');game.advance(200);assert.equal(game.state.player,12);
 game.release('KeyD');game.advance(200);assert.equal(game.state.player,11);
 game.press('KeyA','left');game.release('ArrowLeft');game.advance(200);assert.equal(game.state.player,10);
 game.release('KeyA');game.advance(400);assert.equal(game.state.player,10);
});

test('blocked movement still spends real time; gate is closed until all seeds',()=>{
 const game=new LiveSession(['#######','#@E.*##','#######'],{timeLimit:2});game.tap('right');assert.equal(game.state.status,'playing');assert.equal(game.state.remaining,1);
 game.press('Up','up');game.advance(2000);assert.equal(game.state.status,'lost');assert.equal(game.remainingSeconds,0);
});

test('fixed ticks produce the same outcome across different frame chunks',()=>{
 const rows=['############','#@........E#','############'];const a=new LiveSession(rows,{timeLimit:10}),b=new LiveSession(rows,{timeLimit:10});a.press('Right','right');b.press('Right','right');a.advance(734);for(let i=0;i<14;i++)b.advance(50);b.advance(34);assert.deepEqual(a.state,b.state);assert.equal(a.ticks,b.ticks);assert.equal(a.remainingSeconds,b.remainingSeconds);
 a.pause();b.pause();a.advance(8000);b.advance(1);assert.deepEqual(a.state,b.state);
});

test('crate cannot be pushed into a creature and creatures cannot walk through crates',()=>{
 const game=new LiveSession(['########','#@O...E#','########'],{creatures:[{position:11,direction:'left'}]});
 game.tap('right');assert.equal(game.state.player,9);assert.equal(game.state.tiles[10],'O');
 game.advance(200);assert.equal(game.creatures[0].position,12);
});

test('practice retains atomic forces, original move score and exact undo',()=>{
 const game=new LiveSession(['########','#@iii*E#','########'],{practice:true});const before=structuredClone(game.state);
 game.tap('right');assert.equal(game.state.player,13);assert.equal(game.state.moves,1);assert.equal(game.history.length,1);
 game.undo();assert.deepEqual(game.state,before);
});

test('retry restores clock, inventory, actors and terrain, paused with no stale input',()=>{
 const rows=['########','#@*...E#','########'];const options={timeLimit:1,creatures:[{position:13,direction:'left' as const}]};
 const game=new LiveSession(rows,options);game.press('Right','right');game.advance(1000);assert.equal(game.state.status,'lost');
 game.restart();assert.equal(game.state.status,'playing');assert.equal(game.state.player,9);assert.equal(game.state.remaining,1);
 assert.deepEqual(game.creatures,options.creatures);assert.equal(game.remainingSeconds,1);assert.equal(game.paused,true);
 game.resume();game.advance(100);assert.equal(game.state.player,9);assert.equal(game.remainingSeconds,1);
});

test('moving ball weights a plate; shut trap admits then holds and release ejects',()=>{
 const game=new LiveSession(['########','#..p..##','########','#@T..*E#','########'],{creatures:[{position:12,direction:'right'}],traps:[{position:26,button:11}]});
 assert.equal(game.trapOpen(26),false);
 game.press('ArrowRight','right');game.release('ArrowRight');assert.equal(game.state.player,26);
 game.advance(400);game.press('ArrowRight','right');game.release('ArrowRight');assert.equal(game.state.player,26);
 game.advance(199);assert.equal(game.state.player,26);
 game.advance(1);assert.equal(game.trapOpen(26),true);assert.equal(game.state.player,27);
 game.advance(200);assert.equal(game.trapOpen(26),false);assert.equal(game.state.player,27);
});

test('ball advances autonomously, reverses at walls, and contact kills a waiting player',()=>{
 const game=new LiveSession(['########','#@....E#','########'],{creatures:[{position:12,direction:'right'}]});
 game.advance(199);assert.equal(game.creatures[0].position,12);
 game.advance(1);assert.equal(game.creatures[0].position,13);
 game.advance(200);assert.equal(game.creatures[0].position,12);assert.equal(game.creatures[0].direction,'left');
 game.advance(600);assert.equal(game.state.status,'lost');assert.match(game.state.message,/creature/i);
});

test('clock runs while waiting, freezes on pause, and expiry is a terminal loss',()=>{
 const game=new LiveSession(['#####','#@*E#','#####'],{timeLimit:2});
 game.advance(1000);assert.equal(game.remainingSeconds,1);
 game.pause();game.advance(9000);assert.equal(game.remainingSeconds,1);
 game.resume();game.advance(999);assert.equal(game.state.status,'playing');
 game.advance(1);assert.equal(game.state.status,'lost');assert.match(game.state.message,/time/i);
 const ended=structuredClone(game.state);game.press('Right','right');game.advance(400);assert.deepEqual(game.state,ended);
});

test('unprotected sliding takes100ms per tile and continues after key release',()=>{
 const game=new LiveSession(['########','#@iii*E#','########']);
 game.press('ArrowRight','right');game.release('ArrowRight');
 assert.equal(game.state.player,10);assert.equal(game.state.remaining,1);
 game.advance(99);assert.equal(game.state.player,10);
 game.advance(1);assert.equal(game.state.player,11);
 game.advance(200);assert.equal(game.state.player,13);assert.equal(game.state.remaining,0);
 assert.equal(game.state.status,'playing');game.advance(200);
 game.press('ArrowRight','right');assert.equal(game.state.status,'won');
});

test('pause freezes time and cancels input; resume needs a fresh press',()=>{
 const game=new LiveSession(['############','#@........E#','############']);
 game.press('ArrowRight','right');game.advance(100);game.pause();
 game.advance(1000);assert.equal(game.state.player,14);assert.equal(game.paused,true);
 game.resume();game.release('ArrowRight');game.advance(400);assert.equal(game.state.player,14);
 game.press('ArrowRight','right');assert.equal(game.state.player,15);
});
