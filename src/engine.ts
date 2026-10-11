export type Direction='up'|'down'|'left'|'right';
export const vectors:Record<Direction,[number,number]>={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
export interface Game {tiles:string[];width:number;height:number;player:number;remaining:number;keys:{r:number;b:number};gear:string[];status:'playing'|'won'|'lost';moves:number;message:string}
export function createGame(rows:string[]):Game {
 if(rows.join('').split('').some(t=>!'#.@*ErbRBO~fFWCMi<>^v'.includes(t))||!rows.length||rows.some(r=>r.length!==rows[0].length)||rows.join('').split('@').length!==2)throw Error('Invalid stage');
 const tiles=rows.join('').split('');const player=tiles.indexOf('@');tiles[player]='.';
 return {tiles,width:rows[0].length,height:rows.length,player,remaining:tiles.filter(t=>t==='*').length,keys:{r:0,b:0},gear:[],status:'playing',moves:0,message:'Recover every light seed, then reach the gate.'};
}
export function move(input:Game,direction:Direction):Game {
 if(input.status!=='playing')return input;
 const s=structuredClone(input);let dir=direction;let entered=false;const seen=new Set<string>();
 while(s.status==='playing'){
  const [dx,dy]=vectors[dir];const x=s.player%s.width+dx,y=Math.floor(s.player/s.width)+dy;
  if(x<0||x>=s.width||y<0||y>=s.height)break;
  const next=y*s.width+x;let tile=s.tiles[next];
  if(tile==='#')break;
  if(tile==='R'||tile==='B'){
   const key=tile.toLowerCase() as 'r'|'b';if(!s.keys[key])break;s.keys[key]--;s.tiles[next]='.';
  }
  if(tile==='O'){
   const bx=x+dx,by=y+dy;const target=by*s.width+bx;
   if(bx<0||bx>=s.width||by<0||by>=s.height||!['.','~','f'].includes(s.tiles[target]))break;
   s.tiles[target]=s.tiles[target]==='.'?'O':'.';s.tiles[next]='.';
  }
  s.player=next;entered=true;tile=s.tiles[next];
  if(tile==='*'){s.remaining--;s.tiles[next]='.';s.message='A light seed restored.';}
  if(tile==='r'||tile==='b'){s.keys[tile]++;s.tiles[next]='.';s.message='Key collected. Match its door.';}
  if(['F','W','C','M'].includes(tile)){if(!s.gear.includes(tile))s.gear.push(tile);s.tiles[next]='.';s.message='Equipment collected for this stage.';}
  if((tile==='~'&&!s.gear.includes('W'))||(tile==='f'&&!s.gear.includes('F'))){s.status='lost';s.message=tile==='~'?'Deep water! Undo or restart to recover.':'Too hot! Find ember boots. Undo to recover.';break;}
  if(tile==='E'){if(s.remaining===0){s.status='won';s.message='Chamber restored. The archive grows brighter.';}else s.message=`Gate needs ${s.remaining} more light seed${s.remaining===1?'':'s'}.`;}
  const forced:Record<string,Direction>={'^':'up','v':'down','<':'left','>':'right'};
  if(tile==='i'&&!s.gear.includes('C')){/* keep entry direction */}
  else if(forced[tile]&&!s.gear.includes('M'))dir=forced[tile];
  else break;
  const signature=`${s.player}:${dir}:${s.tiles.join('')}:${JSON.stringify(s.keys)}:${s.gear.join('')}`;
  if(seen.has(signature)){s.status='lost';s.message='A current loop caught Pip. Undo to recover.';break;}seen.add(signature);
 }
 if(!entered)return input;s.moves++;return s;
}
export interface Progress {version:1;completed:number[];best:Record<string,number>;mute:boolean}
export function parseProgress(raw:string|null,total:number):Progress {
 const clean:Progress={version:1,completed:[],best:{},mute:false};
 try{const p=JSON.parse(raw??'null');if(!p||p.version!==1)return clean;
 clean.completed=Array.isArray(p.completed)?[...new Set<number>(p.completed.filter((n:unknown)=>Number.isInteger(n)&&Number(n)>=0&&Number(n)<total))].sort((a,b)=>a-b):[];
 if(p.best&&typeof p.best==='object')for(const n of clean.completed){const v=p.best[n];if(Number.isInteger(v)&&v>0&&v<100000)clean.best[n]=v;}
 clean.mute=p.mute===true;return clean;}catch{return clean;}
}
export class Session {
 state:Game;history:Game[]=[];
 constructor(public rows:string[]){this.state=createGame(rows);}
 command(dir:Direction){const next=move(this.state,dir);if(next!==this.state){this.history.push(this.state);this.state=next;}return this.state;}
 undo(){const previous=this.history.pop();if(previous)this.state=previous;return this.state;}
 restart(){this.state=createGame(this.rows);this.history=[];return this.state;}
}
