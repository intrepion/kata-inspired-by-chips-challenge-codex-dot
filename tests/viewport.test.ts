import {test} from 'node:test';
import assert from 'node:assert/strict';
import {boardViewport} from '../src/viewport.js';

test('nine-tile viewport follows in whole cells and clamps to the world edges',()=>{
 const start=boardViewport({width:32,height:32,player:130});
 assert.deepEqual([start.left,start.top,start.columns,start.rows],[0,0,9,9]);
 assert.equal(start.cells.length,81);assert.equal(start.cells[0],0);assert.equal(start.cells[80],264);
 const middle=boardViewport({width:32,height:32,player:528});
 assert.deepEqual([middle.left,middle.top],[12,12]);assert.equal(middle.cells[40],528);
 const step=boardViewport({width:32,height:32,player:529});assert.deepEqual([step.left,step.top],[13,12]);
 const edge=boardViewport({width:32,height:32,player:1023});assert.deepEqual([edge.left,edge.top],[23,23]);assert.equal(edge.cells[80],1023);
});

test('small practice chambers retain their complete board and global cell indices',()=>{
 const view=boardViewport({width:9,height:5,player:29});
 assert.deepEqual([view.left,view.top,view.columns,view.rows],[0,0,9,5]);assert.equal(view.cells.length,45);assert.equal(view.cells[44],44);
});
