import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LiveSession} from '../src/realtime.js';

test('one real second advances the full-speed player/orb clock and half-frequency Teeth together',()=>{
 const rows=['#############','#.......E####','#############','#@..........#','#############','#...........#','#############'];
 const game=new LiveSession(rows,{timeLimit:10,creatures:[{kind:'orb',position:14,direction:'right'},{kind:'teeth',position:66,direction:'right'}]});
 game.press('Right','right');game.advance(199);assert.equal(game.state.player,41);assert.equal(game.creatures[0].position,14);assert.equal(game.creatures[1].position,66);
 game.advance(1);assert.equal(game.state.player,42);assert.equal(game.creatures[0].position,15);assert.equal(game.creatures[1].position,66);
 game.advance(199);assert.equal(game.creatures[1].position,66);
 game.advance(1);assert.equal(game.state.player,43);assert.equal(game.creatures[0].position,16);assert.equal(game.creatures[1].position,67);
 game.release('Right');game.advance(600);assert.equal(game.state.player,43);assert.equal(game.creatures[0].position,19);assert.equal(game.creatures[1].position,68);assert.equal(game.remainingSeconds,9);
});

test('full-speed expiry spends one real second, and pause/resume discards paused time and held input',()=>{
 const game=new LiveSession(['############','#@........E#','############'],{timeLimit:1});
 game.press('Right','right');game.advance(125);game.pause();const board=structuredClone(game.state),ticks=game.ticks;
 game.advance(5000);assert.deepEqual(game.state,board);assert.equal(game.ticks,ticks);
 game.resume();game.advance(899);assert.equal(game.state.status,'playing');assert.equal(game.state.player,board.player);
 game.advance(1);assert.equal(game.state.status,'lost');assert.equal(game.remainingSeconds,0);
 game.restart();assert.equal(game.remainingSeconds,1);assert.equal(game.paused,true);assert.equal(game.state.moves,0);
});
