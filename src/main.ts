import './style.css';
import {parseProgress,type Direction,vectors} from './engine';
import {LiveSession} from './realtime';
import {timingTrial} from './trial';
import {boardViewport} from './viewport';
import {levels} from './levels';
const app=document.querySelector<HTMLDivElement>('#app')!;
let raw:string|null=null;try{raw=localStorage.getItem('lantern-vault-v1');}catch{/* storage unavailable */}
const progress=parseProgress(raw,levels.length);
let stage=0;let trial=true;let campaign=new LiveSession(levels[stage].rows,{practice:true});
let session=new LiveSession(timingTrial.rows,timingTrial);session.pause();
let modal=false;let hint=false;let audio:AudioContext|undefined;let lastView='';let pauseReason='Ready when you are.';
const tiles:Record<string,[string,string,string]>={'.':['','floor','Ground'],'#':['','wall','Archive wall'],'*':['✦','seed','Light seed'],'E':['◈','exit','Gate'],'r':['⚿','red key','Red key'],'b':['⚿','blue key','Blue key'],'R':['▣','red door','Red door'],'B':['▣','blue door','Blue door'],'O':['▧','crate','Crate'],'~':['≈','water','Deep water'],'f':['♨','fire','Fire'],'F':['♜','gear ember','Ember boots'],'W':['♧','gear wave','Wave cloak'],'C':['♜','gear frost','Cleats'],'M':['⚓','gear anchor','Anchor'],'i':['◇','ice','Ice'],'>':['→','current','East current'],'<':['←','current','West current'],'^':['↑','current','North current'],'v':['↓','current','South current'],'p':['◎','plate','Pressure plate'],'T':['⊓','trap','Holding trap'],'g':['·','gravel','Gravel refuge']};
function save(){try{localStorage.setItem('lantern-vault-v1',JSON.stringify(progress));}catch{/* gameplay still works */}}
function tone(win=false){if(progress.mute)return;try{audio??=new AudioContext();void audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=win?660:340;g.gain.setValueAtTime(.025,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.12);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.13);}catch{/* optional audio */}}
function unlocked(n:number){return n===0||progress.completed.includes(n-1);}
function load(n:number){stage=n;trial=false;session=new LiveSession(levels[n].rows,{practice:true});campaign=session;hint=false;pauseReason='';render();}
function enterTrial(){if(!trial){campaign=session;campaign.pause();}trial=true;session=new LiveSession(timingTrial.rows,timingTrial);session.pause();hint=false;pauseReason='Ready when you are.';render();}
function observe(prior:typeof session.state){
 if(prior.moves!==session.state.moves)tone(session.state.status==='won');
 if(!trial&&prior.status!=='won'&&session.state.status==='won'){
  if(!progress.completed.includes(stage))progress.completed.push(stage);
  progress.best[stage]=Math.min(progress.best[stage]??Infinity,session.state.moves);save();
 }
}
function command(dir:Direction){if(modal)return;const prior=session.state;session.tap(dir);observe(prior);render();}
function view(){return JSON.stringify([trial,session.paused,session.state,session.remainingSeconds,session.creatures]);}
function interrupt(reason:string){session.pause();pauseReason=reason;if(!modal)render();}
function render(){const s=session.state,l=trial?timingTrial:levels[stage];const viewport=boardViewport(s);const active=document.activeElement as HTMLElement;const focus=active?.dataset.action;const directionFocus=active?.dataset.dir;
 app.innerHTML=`<header><a class="brand" href="#" aria-label="Lantern Vault home"><span class="brandmark">✦</span> LANTERN VAULT</a><div class="header-actions"><button data-action="sound" aria-pressed="${progress.mute}">${progress.mute?'Sound off':'Sound on'}</button><button data-action="trial">Timing trial</button><button data-action="guide">Field guide</button></div></header>
 <main><section class="intro"><div><p class="eyebrow">A PUZZLE EXPEDITION / ${trial?'REAL-TIME TRIAL':`${String(stage+1).padStart(2,'0')} OF 09 · PRACTICE`}</p><h1>${l.name}</h1><p class="subtitle">${l.subtitle} <span>·</span> Bring the forgotten archive back to light.</p></div><button class="stage-button" data-action="stages">Practice chambers <span>↗</span></button></section>
 <section class="play-layout"><div class="board-panel"><div class="board-top"><span><i class="live-dot"></i> ${s.status==='won'?'CHAMBER RESTORED':s.status==='lost'?'RETRY AVAILABLE':session.paused?'PAUSED':'EXPLORE THE ARCHIVE'}</span><span>${trial?`TRIAL TIME ${session.remainingSeconds}s · STEPS`:'TURN'} ${String(s.moves).padStart(2,'0')}</span></div><div class="board-wrap"><div class="board" style="--cols:${viewport.columns}" data-view-left="${viewport.left}" data-view-top="${viewport.top}" role="group" aria-label="Puzzle board. Pip is at column ${s.player%s.width+1}, row ${Math.floor(s.player/s.width)+1}.">${viewport.cells.map(i=>{const t=s.tiles[i];const [glyph,cls,label]=tiles[t];const creature=session.creatures.find(c=>c.position===i);const teeth=creature?.kind==='teeth';const released=t==='T'&&session.trapOpen(i);const pip=i===s.player;const adjacent=Math.abs(i%s.width-s.player%s.width)+Math.abs(Math.floor(i/s.width)-Math.floor(s.player/s.width))===1;return `<button class="tile ${cls} ${released?'released':''} ${creature?'enemy':''} ${teeth?'fangling':''} ${pip?'pip':''}" data-cell="${i}" tabindex="-1" ${!adjacent||s.status!=='playing'||session.paused?'disabled':''} aria-label="${pip?'Pip, courier':creature?`${teeth?'Fangling, Teeth-style pursuer':'Roaming orb'}, moving ${creature.direction}`:t==='T'?`Holding trap, ${released?'released':'shut'}`:label}, column ${i%s.width+1}, row ${Math.floor(i/s.width)+1}">${teeth?'<b class="fangling-art"><i></i></b>':`<span>${creature?'●':glyph}</span>`}${creature?`<small class="heading-arrow">${({up:'↑',down:'↓',left:'←',right:'→'})[creature.direction]}</small>`:''}${pip?'<b class="character"><i></i></b>':''}</button>`;}).join('')}</div></div><p class="view-caption">View columns ${viewport.left+1}–${viewport.left+viewport.columns}, rows ${viewport.top+1}–${viewport.top+viewport.rows} · ${s.width} × ${s.height} archive</p><div class="board-bottom"><span>Hold ↑ ↓ ← → / WASD to move</span><span>${trial?'P / Esc pause · R retry':'P pause · U undo · R restart'}</span></div></div>
 <aside><div class="mission"><p class="eyebrow">YOUR MISSION</p><h2>Gather the light.</h2><p>Recover every seed, then step into the glowing gate.</p><div class="seed-counter"><span>✦</span><strong>${s.remaining}</strong><small>seed${s.remaining===1?'':'s'} remaining</small></div><div class="inventory"><span class="red">⚿ ${s.keys.r}</span><span class="blue">⚿ ${s.keys.b}</span><span>${s.gear.length?s.gear.map(g=>tiles[g][2]).join(' · '):'No equipment yet'}</span></div></div><div class="status ${s.status}" role="status" aria-live="polite">${session.paused&&s.status==='playing'?pauseReason||'Paused. Resume when you are ready.':s.message}</div>${s.status==='won'?`<button class="primary" data-action="next">${trial?'Timing trial complete ✦ · Retry':stage<8?'Enter next chamber →':'Expedition complete ✦'}</button>`:''}${trial?'<button data-action="campaign" class="hint-button">Return to practice</button>':''}<div class="tools"><button data-action="pause" ${s.status!=='playing'?'disabled':''}>${session.paused?(trial&&session.ticks===0&&s.moves===0?'Start trial':'Resume'):'Pause'}</button><button data-action="undo" ${trial||!session.history.length?'disabled':''}>↶ Undo</button><button data-action="restart">↺ Restart</button></div><button class="hint-button" data-action="hint" aria-expanded="${hint}">${hint?'Hide field note':'Need a field note?'} <span>＋</span></button>${hint?`<p class="hint">${l.hint}</p>`:''}<div class="dpad" aria-label="Touch movement"><button data-dir="up" aria-label="Move up">↑</button><button data-dir="left" aria-label="Move left">←</button><span>✦</span><button data-dir="right" aria-label="Move right">→</button><button data-dir="down" aria-label="Move down">↓</button></div><p class="small">${trial?'Fanglings follow at half your speed.<br>Draw one onto the brown plate.<br>Gravel keeps creatures out.':'Practice: untimed, with Undo.<br>Atomic ice/current turns retained.'}</p></aside></section><footer><span>PIP'S FIELD JOURNAL</span><p>Some doors need a key. Every journey needs a little curiosity.</p><span>${progress.completed.length} / 9 restored</span></footer></main><dialog id="dialog"></dialog>`;
 if(directionFocus)app.querySelector<HTMLButtonElement>(`[data-dir="${directionFocus}"]`)?.focus({preventScroll:true});
 if(focus)app.querySelector<HTMLButtonElement>(`[data-action="${focus}"]`)?.focus({preventScroll:true});
 lastView=view();
}
function action(name:string){
 if(name==='undo'){session.undo();render();}
 else if(name==='restart'||name==='next'&&trial){session.restart();if(!trial)session.resume();pauseReason='Ready for a fresh attempt.';render();}
 else if(name==='pause'){if(session.paused){session.resume();pauseReason='';}else session.pause();render();}
 else if(name==='trial')enterTrial();
 else if(name==='campaign'){trial=false;session=campaign;hint=false;pauseReason='Practice board preserved. Resume when ready.';render();}
 else if(name==='hint'){hint=!hint;render();}
 else if(name==='sound'){progress.mute=!progress.mute;save();render();}
 else if(name==='next'){if(stage<8)load(stage+1);else showModal('stages');}
 else showModal(name);
}
function showModal(kind:string){session.pause();pauseReason='Paused while the field journal is open.';modal=true;const dialog=document.querySelector<HTMLDialogElement>('#dialog')!;
 dialog.innerHTML=kind==='stages'?`<p class="eyebrow">THE MOUNTAIN ARCHIVE</p><h2>Choose a chamber</h2><div class="level-list">${levels.map((l,i)=>`<button data-level="${i}" ${!unlocked(i)?'disabled':''}><span>${String(i+1).padStart(2,'0')}</span><strong>${l.name}</strong><small>${progress.completed.includes(i)?`✦ ${progress.best[i]??'—'} turns`:unlocked(i)?'Explore':'Locked'}</small></button>`).join('')}</div><button data-close>Back to the expedition</button><button data-reset-progress>Reset expedition progress</button>`:`<p class="eyebrow">PIP'S FIELD GUIDE</p><h2>A little light goes a long way.</h2><p>Hold arrows, WASD, or the D-pad to keep moving at a steady tile cadence; click a neighboring tile for one step. P or Escape pauses, Space resumes, and R retries. Gather every ✦ light seed to open the ◈ gate.</p><div class="guide-grid">${['r','b','O','~','f','F','W','i','C','<','M','g'].map(t=>`<p><b class="${tiles[t][1]}">${tiles[t][0]}</b> ${tiles[t][2]}</p>`).join('')}</div><p>Keys open matching doors once. Push crates into water to build bridges, or into fire to extinguish it. You cannot push onto items or slide crates.</p><p>Ember boots protect from fire; wave cloaks protect from water. Ice slides in your entry direction until blocked. Cleats stop sliding; anchors stop arrow currents. In the timing trial, sliding takes time and continues after releasing the key. Practice retains atomic forced turns.</p><p>Timing trial runs at full speed. Orbs move autonomously and bounce at obstacles. Fanglings are Teeth-style pursuers: they act half as often as you, approach along the greater separation (vertical on ties), try the other approach if blocked, and cannot find a route around walls. Gravel stops creatures. In The patient pursuit, lure the Fangling along its gallery onto the brown plate, then cross the released trap. A brown plate releases its linked holding trap while weighted; a shut trap admits you but holds you until released in your facing direction. Avoid orb contact and reach the gate before 90 trial seconds. Pause, menus, focus loss and hidden tabs freeze the world and clear held input; press again after resuming. Undo (U) reverses a whole turn in practice only. Restart (R) restores the chamber. Completed chambers and best scores save on this device.</p><button data-close>Let's explore →</button>`;
 dialog.querySelectorAll<HTMLButtonElement>('[data-level]').forEach(b=>b.onclick=()=>{close();load(Number(b.dataset.level));});
 function close(){modal=false;dialog.close();render();app.querySelector<HTMLButtonElement>(`[data-action="${kind==='stages'?'stages':'guide'}"]`)?.focus();}
 const reset=dialog.querySelector<HTMLButtonElement>('[data-reset-progress]');if(reset)reset.onclick=()=>{progress.completed=[];progress.best={};save();close();load(0);};
 dialog.querySelector<HTMLButtonElement>('[data-close]')!.onclick=close;dialog.oncancel=e=>{e.preventDefault();close();};dialog.showModal();
}
// The stable app element owns pointer capture, so a board redraw cannot lose a hold.
app.addEventListener('pointerdown',e=>{
 const button=(e.target as HTMLElement).closest<HTMLButtonElement>('[data-dir]');
 if(!button||e.button!==0||modal)return;
 e.preventDefault();const prior=session.state;
 session.press(`pointer-${e.pointerId}`,button.dataset.dir as Direction);
 app.setPointerCapture(e.pointerId);observe(prior);render();
});
const releasePointer=(e:PointerEvent)=>session.release(`pointer-${e.pointerId}`);
document.addEventListener('pointerup',releasePointer);document.addEventListener('pointercancel',releasePointer);app.addEventListener('lostpointercapture',releasePointer);
app.addEventListener('click',e=>{
 const target=e.target as HTMLElement;
 if(target.closest('.brand')){e.preventDefault();showModal('stages');return;}
 const button=target.closest<HTMLButtonElement>('button');if(!button||button.disabled)return;
 if(button.dataset.action){action(button.dataset.action);return;}
 if(button.dataset.dir){if(e.detail===0)command(button.dataset.dir as Direction);return;}
 if(button.dataset.cell){const s=session.state,i=Number(button.dataset.cell);const dx=i%s.width-s.player%s.width,dy=Math.floor(i/s.width)-Math.floor(s.player/s.width);const dir=(Object.keys(vectors) as Direction[]).find(d=>vectors[d][0]===dx&&vectors[d][1]===dy);if(dir)command(dir);}
});
const keyDirections:Record<string,Direction>={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right'};
document.addEventListener('keydown',e=>{
 if(modal||e.isComposing||e.altKey||e.ctrlKey||e.metaKey)return;
 const target=e.target as HTMLElement;if(target.matches('input,textarea,select'))return;
 const dir=keyDirections[e.key]??keyDirections[e.key.toLowerCase()];
 if(dir){e.preventDefault();if(e.repeat)return;const prior=session.state;session.press(e.code,dir);observe(prior);render();return;}
 if(e.repeat)return;
 if(e.key.toLowerCase()==='p'||e.key==='Escape'){e.preventDefault();action('pause');}
 else if(e.key===' '&&session.paused){e.preventDefault();action('pause');}
 else if(e.key.toLowerCase()==='u'){e.preventDefault();action('undo');}
 else if(e.key.toLowerCase()==='r'){e.preventDefault();action('restart');}
});
document.addEventListener('keyup',e=>session.release(e.code));
addEventListener('blur',()=>interrupt('Paused after focus loss. Resume, then press a direction again.'));
document.addEventListener('visibilitychange',()=>{if(document.hidden)interrupt('Paused while this tab was hidden. Resume when ready.');});
let lastFrame:number|undefined;
function frame(now:number){
 const elapsed=lastFrame===undefined?0:Math.max(0,now-lastFrame);lastFrame=now;
 if(!modal){
  if(elapsed>250&&!session.paused)interrupt('Paused after an interrupted frame. Resume when ready.');
  else{const prior=session.state;session.advance(elapsed);observe(prior);if(view()!==lastView)render();}
 }
 requestAnimationFrame(frame);
}
render();requestAnimationFrame(frame);
