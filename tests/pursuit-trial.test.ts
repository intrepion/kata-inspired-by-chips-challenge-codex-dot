import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LiveSession} from '../src/realtime.js';
import {timingTrial} from '../src/trial.js';

test('the larger trial starts in a safe observation room and waiting there cannot release the route',()=>{
 const game=new LiveSession(timingTrial.rows,timingTrial);
 assert.equal(game.state.width,32);assert.equal(game.state.height,32);
 game.advance(10000);assert.equal(game.state.status,'playing');assert.equal(game.state.player,130);
 assert.equal(game.trapOpen(275),false);assert.equal(game.creatures.find(c=>c.kind==='teeth')?.position,328);
});

const directions={R:'right',L:'left',U:'up',D:'down'} as const;
const approach='URRRRDDDDD'+'R'.repeat(13);
function inputs(game:LiveSession,route:string,elapsed:number){
 for(const key of route){if(key!=='W')game.tap(directions[key as keyof typeof directions]);game.advance(elapsed);}
}

test('the full-speed literal route lures Teeth, takes the key, crosses the patrol and wins',()=>{
 const game=new LiveSession(timingTrial.rows,timingTrial);
 inputs(game,approach,200);assert.equal(game.state.player,275);assert.equal(game.trapOpen(275),false);assert.equal(game.state.remaining,2);
 inputs(game,'W'.repeat(20),200);assert.equal(game.creatures.find(c=>c.kind==='teeth')?.position,339);assert.equal(game.trapOpen(275),true);assert.equal(game.state.player,276);
 inputs(game,'RRRRUUURR',200);assert.equal(game.state.player,186);assert.equal(game.state.keys.r,1);
 inputs(game,'D'.repeat(12)+'RRRLLL',200);assert.equal(game.state.player,570);assert.equal(game.state.keys.r,0);assert.equal(game.state.remaining,1);
 inputs(game,'W'+'D'.repeat(10)+'L'.repeat(9)+'D'+'R'.repeat(11),200);
 assert.equal(game.state.status,'won');assert.equal(game.state.player,924);assert.equal(game.state.moves,82);assert.equal(game.state.remaining,0);assert.equal(game.remainingSeconds,70);
});

test('without luring the pursuer, the holding trap cannot release Pip',()=>{
 const game=new LiveSession(timingTrial.rows,{...timingTrial,creatures:timingTrial.creatures!.filter(c=>c.kind!=='teeth')});
 inputs(game,approach,200);inputs(game,'W'.repeat(40),200);
 assert.equal(game.state.player,275);assert.equal(game.state.status,'playing');assert.equal(game.trapOpen(275),false);
 game.press('Right','right');game.advance(2000);assert.equal(game.state.player,275);
});
