import {createGame, move, vectors, forcedDirections, type Direction, type Game} from './engine';
export interface Creature {position:number;direction:Direction;kind?:'orb'|'teeth'}
export interface Trap {position:number;button:number}
export interface LiveOptions {timeLimit?:number;creatures?:Creature[];traps?:Trap[];practice?:boolean}

// Public elapsed-gameplay/input seam; expanded one verified behavior at a time.
export class LiveSession {
 state:Game;
 paused=false;
 private held=new Map<string,Direction>();
 private remainder=0;
 private cooldown=0;
 private facing:Direction='right';
 ticks=0;
 creatures:Creature[];
 history:Game[]=[];
 constructor(public rows:string[],public options:LiveOptions={}){
  this.state=createGame(rows);
  this.options=structuredClone(options);
  this.creatures=structuredClone(options.creatures??[]);
  if(this.creatures.some((c,i)=>!Number.isInteger(c.position)||!'.pTrb'.includes(this.state.tiles[c.position]??'?')||c.position===this.state.player||!Object.hasOwn(vectors,c.direction)||(c.kind!==undefined&&c.kind!=='orb'&&c.kind!=='teeth')||this.creatures.slice(0,i).some(other=>other.position===c.position)))throw Error('Invalid creature spawn');
  if(options.timeLimit!==undefined&&(!Number.isInteger(options.timeLimit)||options.timeLimit<=0))throw Error('Invalid time limit');
  if((options.traps??[]).some((t,i)=>this.state.tiles[t.position]!=='T'||this.state.tiles[t.button]!=='p'||options.traps!.slice(0,i).some(other=>other.position===t.position))||this.state.tiles.some((t,i)=>t==='T'&&!options.traps?.some(trap=>trap.position===i)))throw Error('Invalid trap link');
 }
 get remainingSeconds(){return this.options.timeLimit===undefined?undefined:Math.max(0,this.options.timeLimit-Math.floor(this.ticks/20));}
 trapOpen(position:number){
  const trap=this.options.traps?.find(t=>t.position===position);
  return !!trap&&(this.state.player===trap.button||this.creatures.some(c=>c.position===trap.button)||this.state.tiles[trap.button]==='O');
 }
 press(source:string,direction:Direction){
  if(this.paused||this.state.status!=='playing'||this.held.has(source))return;
  this.held.set(source,direction);
  if(!this.cooldown)this.walk(this.forcedDirection()??direction);
 }
 release(source:string){this.held.delete(source);}
 pause(){this.paused=true;this.held.clear();this.remainder=0;}
 resume(){if(this.state.status==='playing')this.paused=false;}
 restart(){
  this.state=createGame(this.rows);this.creatures=structuredClone(this.options.creatures??[]);
  this.ticks=0;this.cooldown=0;this.remainder=0;this.facing='right';this.history=[];this.pause();return this.state;
 }
 tap(direction:Direction){this.press('tap',direction);this.release('tap');return this.state;}
 undo(){
  if(this.options.practice){const prior=this.history.pop();if(prior)this.state=prior;this.held.clear();this.cooldown=0;this.remainder=0;}
  return this.state;
 }
 advance(milliseconds:number){
  if(!Number.isFinite(milliseconds)||milliseconds<0)throw Error('Invalid elapsed time');
  if(this.paused||this.state.status!=='playing')return;
  this.remainder+=milliseconds;
  while(this.remainder>=50&&this.state.status==='playing'){
   this.remainder-=50;this.ticks++;
   if(this.remainingSeconds===0){this.state={...this.state,status:'lost',message:'Time ran out. Retry the timing trial.'};this.held.clear();break;}
   if(this.ticks%4===0)this.moveCreatures();
   if(this.state.status!=='playing')break;
   this.cooldown=Math.max(0,this.cooldown-1);
   const release=this.options.traps?.some(t=>t.position===this.state.player&&this.trapOpen(t.position))?this.facing:undefined;
   const direction=release??this.forcedDirection()??[...this.held.values()].at(-1);
   if(!this.cooldown&&direction)this.walk(direction,true);
  }
 }
 private walk(direction:Direction,fromTick=false){
  this.facing=direction;
  if(this.options.traps?.some(t=>t.position===this.state.player&&!this.trapOpen(t.position))){this.cooldown=1;return;}
  const target=this.nextPosition(this.state.player,direction);
  const pushed=target===undefined?undefined:this.nextPosition(target,direction);
  if(target!==undefined&&this.state.tiles[target]==='O'&&this.creatures.some(c=>c.position===pushed)){this.cooldown=1;return;}
  const prior=this.state;const next=move(prior,direction,this.options.practice===true);
  const moved=next!==this.state;
  this.facing=direction;
  if(moved&&this.options.practice)this.history.push(prior);
  this.state=next;this.cooldown=this.forcedDirection()?2:moved?4:1;
  // Input between fixed ticks must not spend a whole cooldown tick immediately.
  // First repeat rounds up by <50ms; subsequent simulation steps keep exact cadence.
  if(!fromTick&&moved&&this.remainder>0)this.cooldown++;
  this.checkContact();
 }
 private forcedDirection():Direction|undefined{
  if(this.options.practice)return;
  const tile=this.state.tiles[this.state.player];
  if(tile==='i'&&!this.state.gear.includes('C'))return this.facing;
  if(!this.state.gear.includes('M'))return forcedDirections[tile];
 }
 private nextPosition(position:number,direction:Direction){
  const [dx,dy]=vectors[direction];const x=position%this.state.width+dx,y=Math.floor(position/this.state.width)+dy;
  if(x>=0&&x<this.state.width&&y>=0&&y<this.state.height)return y*this.state.width+x;
 }
 private moveCreatures(){
  const reverse:Record<Direction,Direction>={up:'down',down:'up',left:'right',right:'left'};
  for(const creature of this.creatures){
   if(creature.kind==='teeth'&&this.ticks%8!==0)continue;
   if(this.options.traps?.some(t=>t.position===creature.position&&!this.trapOpen(t.position)))continue;
   const clear=(position:number|undefined)=>position!==undefined&&'.pTrb~f'.includes(this.state.tiles[position])&&!this.creatures.some(other=>other!==creature&&other.position===position);
   let next:number|undefined;
   if(creature.kind==='teeth'){
    const dx=this.state.player%this.state.width-creature.position%this.state.width;
    const dy=Math.floor(this.state.player/this.state.width)-Math.floor(creature.position/this.state.width);
    const horizontal:Direction|undefined=dx<0?'left':dx>0?'right':undefined;
    const vertical:Direction|undefined=dy<0?'up':dy>0?'down':undefined;
    const choices=Math.abs(dx)>Math.abs(dy)?[horizontal,vertical]:[vertical,horizontal];
    for(const direction of choices){
     if(!direction)continue;
     const candidate=this.nextPosition(creature.position,direction);
     if(clear(candidate)){creature.direction=direction;next=candidate;break;}
    }
   }else{
    next=this.nextPosition(creature.position,creature.direction);
    if(!clear(next)){creature.direction=reverse[creature.direction];next=this.nextPosition(creature.position,creature.direction);}
   }
   if(clear(next))creature.position=next!;
   if('~f'.includes(this.state.tiles[creature.position])){this.creatures=this.creatures.filter(other=>other!==creature);continue;}
   this.checkContact();if(this.state.status!=='playing')break;
  }
 }
 private checkContact(){
  if(this.creatures.some(c=>c.position===this.state.player)){
   this.state={...this.state,status:'lost',message:'A roaming creature caught Pip. Retry the timing trial.'};this.held.clear();
  }
 }
}
