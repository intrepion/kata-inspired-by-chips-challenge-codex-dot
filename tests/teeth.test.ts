import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LiveSession} from '../src/realtime.js';

test('Teeth moves half as often as Pip/orbs and chooses vertical on equal distances',()=>{
 const rows=['#########','#......E#','#.....@.#','#.......#','#.......#','#########'];
 const game=new LiveSession(rows,{creatures:[{kind:'teeth',position:40,direction:'right'}]});
 game.advance(200);assert.equal(game.creatures[0].position,40);
 game.advance(199);assert.equal(game.creatures[0].position,40);
 game.advance(1);assert.equal(game.creatures[0].position,31);assert.equal(game.creatures[0].direction,'up');
});

test('Teeth follows the greater axis, tries the other toward-Pip axis, and never takes a detour',()=>{
 const horizontal=new LiveSession(['#########','#......E#','#.......#','#.....@.#','#.......#','#.......#','#########'],{creatures:[{kind:'teeth',position:38,direction:'down'}]});
 horizontal.advance(400);assert.equal(horizontal.creatures[0].position,39);
 const fallback=new LiveSession(['#########','#......E#','#.....@.#','#...#...#','#.......#','#.......#','#########'],{creatures:[{kind:'teeth',position:40,direction:'down'}]});
 fallback.advance(400);assert.equal(fallback.creatures[0].position,41);assert.equal(fallback.creatures[0].direction,'right');
 const stuck=new LiveSession(['#########','#......E#','#.....@.#','#...#...#','#....#..#','#.......#','#########'],{creatures:[{kind:'teeth',position:40,direction:'down'}]});
 stuck.advance(1600);assert.equal(stuck.creatures[0].position,40);
 const aligned=new LiveSession(['#########','#...@..E#','#.......#','#...#...#','#.......#','#.......#','#########'],{creatures:[{kind:'teeth',position:40,direction:'left'}]});
 aligned.advance(1200);assert.equal(aligned.creatures[0].position,40);
});

test('walls, gravel, seeds, shut doors, crates, equipment, exits and other creatures block Teeth',()=>{
 for(const tile of ['#','g','*','R','B','O','F','W','C','M','E']){
  const game=new LiveSession(['#########',`#@.${tile}...E#`,'#########'],{creatures:[{kind:'teeth',position:13,direction:'left'}]});
  game.advance(800);assert.equal(game.creatures[0].position,13,`Blocked by ${tile}`);
 }
 const occupied=new LiveSession(['#########','#@.....E#','#########'],{creatures:[{kind:'teeth',position:13,direction:'left'},{position:12,direction:'up'}]});
 occupied.advance(400);assert.equal(occupied.creatures[0].position,13);
 const refuge=new LiveSession(['#####','#@gE#','#####']);refuge.tap('right');assert.equal(refuge.state.player,7);assert.equal(refuge.state.tiles[7],'g');
});

test('Teeth crosses keys without collecting them and enters lethal hazards without routing around them',()=>{
 for(const key of ['r','b']){
  const game=new LiveSession(['#########',`#@.${key}...E#`,'#########'],{creatures:[{kind:'teeth',position:13,direction:'left'}]});
  game.advance(400);assert.equal(game.creatures[0].position,12);assert.equal(game.state.tiles[12],key);assert.deepEqual(game.state.keys,{r:0,b:0});
 }
 for(const hazard of ['~','f']){
  const game=new LiveSession(['#########',`#@.${hazard}...E#`,'#.......#','#########'],{creatures:[{kind:'teeth',position:13,direction:'left'}]});
  game.advance(400);assert.equal(game.creatures.length,0);assert.equal(game.state.status,'playing');
  game.restart();assert.equal(game.creatures.length,1);assert.equal(game.creatures[0].position,13);
 }
});

test('player contact, approaching Teeth and head-on crossing are lethal without tunneling',()=>{
 const rows=['########','#@....E#','########'];
 const entered=new LiveSession(rows,{creatures:[{kind:'teeth',position:10,direction:'left'}]});entered.tap('right');assert.equal(entered.state.status,'lost');
 const waiting=new LiveSession(rows,{creatures:[{kind:'teeth',position:10,direction:'left'}]});waiting.advance(399);assert.equal(waiting.state.status,'playing');waiting.advance(1);assert.equal(waiting.state.status,'lost');
 const crossing=new LiveSession(rows,{creatures:[{kind:'teeth',position:12,direction:'left'}]});crossing.press('Right','right');crossing.advance(200);assert.equal(crossing.state.player,11);assert.equal(crossing.state.status,'playing');
 crossing.advance(200);assert.equal(crossing.state.status,'lost');assert.equal(crossing.state.player,11);
});

test('Full speed keeps Teeth at half the player/orb frequency and pauses and retries deterministically',()=>{
 const rows=['#############','#.......E####','#############','#@..........#','#############','#...........#','#############'];
 const game=new LiveSession(rows,{timeLimit:10,creatures:[{kind:'orb',position:14,direction:'right'},{kind:'teeth',position:66,direction:'right'}]});
 game.press('Right','right');game.advance(399);assert.equal(game.state.player,42);assert.equal(game.creatures[0].position,15);assert.equal(game.creatures[1].position,66);
 game.advance(1);assert.equal(game.state.player,43);assert.equal(game.creatures[0].position,16);assert.equal(game.creatures[1].position,67);
 game.pause();const board=structuredClone(game.state),actors=structuredClone(game.creatures),ticks=game.ticks;game.advance(10000);assert.deepEqual(game.state,board);assert.deepEqual(game.creatures,actors);assert.equal(game.ticks,ticks);
 game.resume();game.advance(400);assert.equal(game.state.player,43);assert.equal(game.creatures[1].position,68);
 game.restart();assert.equal(game.paused,true);assert.equal(game.state.player,40);assert.equal(game.creatures[1].position,66);assert.equal(game.remainingSeconds,10);
 assert.throws(()=>new LiveSession(rows,{creatures:[{kind:'dragon',position:66,direction:'left'} as never]}),/spawn/);
});
