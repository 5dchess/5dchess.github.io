var _ = require('underscore');

//defining constants so I dont need to quote
const __ = -1;

const wP = 0;
const wR = 1;
const wN = 2;
const wB = 3;
const wQ = 4;
const wK = 5;
const wP_ = 6;
const wR_ = 7;
const wK_ = 8;

const bP = 10;
const bR = 11;
const bN = 12;
const bB = 13;
const bQ = 14;
const bK = 15;
const bP_ = 16;
const bR_ = 17;
const bK_ = 18;

const initBoard =[[wR_,  wP_,   __,   __,  __,  __,  bP_,  bR_],
                  [wN ,  wP_,   __,   __,  __,  __,  bP_,  bN ],
                  [wB ,  wP_,   __,   __,  __,  __,  bP_,  bB ],
                  [wQ ,  wP_,   __,   __,  __,  __,  bP_,  bQ ],
                  [wK_,  wP_,   __,   __,  __,  __,  bP_,  bK_],
                  [wB ,  wP_,   __,   __,  __,  __,  bP_,  bB ],
                  [wN ,  wP_,   __,   __,  __,  __,  bP_,  bN ],
                  [wR_,  wP_,   __,   __,  __,  __,  bP_,  bR_]];
// const initBoard = [[wR_,  wP_,   __,   __,  __,  __,  bP_,  bR_],
//                   [wN ,  wP_,   __,   __,  __,  __,  bP_,  bN ],
//                   [wB ,  wP_,   __,   __,  __,  __,  bP_,  bB ],
//                   [wQ ,  wP_,   __,   __,  __,  __,  bP_,  bQ ],
//                   [wK_,  wP_,   __,   __,  __,  __,  bP_,  bK_],
//                   [wB ,  wP_,   __,   __,  __,  __,  bP_,  bB ],
//                   [wN ,  wP_,   __,   __,  __,  __,  bP_,  bN ],
//                   [wR_,  wP_,   __,   __,  __,  __,  wP,  bR_]];

//note: time <-> x, timeline <-> y
const Npaths = [[1,2],[-1,2],[1,-2],[-1,-2],[2,1],[2,-1],[-2,1],[-2,-1]];
const Bpaths = [[1,1],[1,-1],[-1,1],[-1,-1]];
const Rpaths = [[1,0],[0,-1],[-1,0],[0,1]];
const Ppaths = [[1,1],[-1,1]]; //note: y*= -1 for black //note2: this is for normal capture movement only
const Qpaths = [[-1, -1, -1, -1], [0, -1, -1, -1], [1, -1, -1, -1], [-1, 0, -1, -1], [0, 0, -1, -1], [1, 0, -1, -1], [-1, 1, -1, -1], [0, 1, -1, -1], [1, 1, -1, -1], [-1, -1, 0, -1], [0, -1, 0, -1], [1, -1, 0, -1], [-1, 0, 0, -1], [0, 0, 0, -1], [1, 0, 0, -1], [-1, 1, 0, -1], [0, 1, 0, -1], [1, 1, 0, -1], [-1, -1, 1, -1], [0, -1, 1, -1], [1, -1, 1, -1], [-1, 0, 1, -1], [0, 0, 1, -1], [1, 0, 1, -1], [-1, 1, 1, -1], [0, 1, 1, -1], [1, 1, 1, -1], [-1, -1, -1, 0], [0, -1, -1, 0], [1, -1, -1, 0], [-1, 0, -1, 0], [0, 0, -1, 0], [1, 0, -1, 0], [-1, 1, -1, 0], [0, 1, -1, 0], [1, 1, -1, 0], [-1, -1, 0, 0], [0, -1, 0, 0], [1, -1, 0, 0], [-1, 0, 0, 0], [0, 0, 0, 0], [1, 0, 0, 0], [-1, 1, 0, 0], [0, 1, 0, 0], [1, 1, 0, 0], [-1, -1, 1, 0], [0, -1, 1, 0], [1, -1, 1, 0], [-1, 0, 1, 0], [0, 0, 1, 0], [1, 0, 1, 0], [-1, 1, 1, 0], [0, 1, 1, 0], [1, 1, 1, 0], [-1, -1, -1, 1], [0, -1, -1, 1], [1, -1, -1, 1], [-1, 0, -1, 1], [0, 0, -1, 1], [1, 0, -1, 1], [-1, 1, -1, 1], [0, 1, -1, 1], [1, 1, -1, 1], [-1, -1, 0, 1], [0, -1, 0, 1], [1, -1, 0, 1], [-1, 0, 0, 1], [0, 0, 0, 1], [1, 0, 0, 1], [-1, 1, 0, 1], [0, 1, 0, 1], [1, 1, 0, 1], [-1, -1, 1, 1], [0, -1, 1, 1], [1, -1, 1, 1], [-1, 0, 1, 1], [0, 0, 1, 1], [1, 0, 1, 1], [-1, 1, 1, 1], [0, 1, 1, 1], [1, 1, 1, 1]];
//note: all 4 are for travel along any number of axes //note2: for all purposes, a king is a 1-range queen

function deepClone(obj, hash = new WeakMap()) {
  // Do not try to clone primitives or functions
  if (Object(obj) !== obj || obj instanceof Function) return obj;
  if (hash.has(obj)) return hash.get(obj); // Cyclic reference
  try {
    // Try to run constructor (without arguments, as we don't know them)
    var result = new obj.constructor();
  } catch (e) {
    // Constructor failed, create object without running the constructor
    result = Object.create(Object.getPrototypeOf(obj));
  }
  // Optional: support for some standard constructors (extend as desired)
  if (obj instanceof Map)
    Array.from(obj, ([key, val]) =>
      result.set(deepClone(key, hash), deepClone(val, hash))
    );
  else if (obj instanceof Set)
    Array.from(obj, key => result.add(deepClone(key, hash)));
  // Register in hash
  hash.set(obj, result);
  // Clone and assign enumerable own properties recursively
  return Object.assign(
    result,
    ...Object.keys(obj).map(key => ({ [key]: deepClone(obj[key], hash) }))
  );
}
Array.prototype.last = function() {
    return deepClone(this[this.length - 1]);
}
/*
 * The Game object
 */

/**
 * Create new game and initialize
 */
function Game(id,params,mode='multi') {
  this.gameID = id;
  this.mode = mode;
  
  this.players = {white:null, black:null}; 
  this.players[params.color] = params.player;
  
  this.views = params.views;
  this.status = "waiting";
}

/**
* Joins game, returns true on successful join
*/
Game.prototype.join = function(params){
  //game is full
  if(this.players['white']!=null && this.players['black']!=null) return false;
  
  //joins free color
  this.players["white"]==null?this.players["white"] = params.player:this.players["black"] = params.player;
  
  this.status = "in game";
  return true;
}

/**
* Starts the game
*/

/**
* Leaves game, returns true on successful leave
*/
Game.prototype.leave = function(params){
  
}

// Export the game object
module.exports = Game;
//module.exports = Timeline;