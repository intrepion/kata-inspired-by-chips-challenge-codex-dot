import type {Game} from './engine';

export function boardViewport(state:Pick<Game,'width'|'height'|'player'>){
 const columns=Math.min(9,state.width),rows=Math.min(9,state.height);
 const left=Math.max(0,Math.min(state.width-columns,state.player%state.width-4));
 const top=Math.max(0,Math.min(state.height-rows,Math.floor(state.player/state.width)-4));
 const cells=Array.from({length:columns*rows},(_,i)=>(top+Math.floor(i/columns))*state.width+left+i%columns);
 return {left,top,columns,rows,cells};
}
