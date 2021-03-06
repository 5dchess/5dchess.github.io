const c = document.querySelector("#c");
const dpi = window.devicePixelRatio;
const dpiinv = 1/dpi;
const ctx = c.getContext("2d");

//images
ctx.imageSmoothingEnabled = 'false';
var pIMG = {};
if(true){ //for collapsing
  pIMG[__] = new Image;
  pIMG[wP] = new Image; pIMG[wP].src = "https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FwP.svg?v=1617102031643";
  pIMG[wR] = new Image; pIMG[wR].src = "https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FwR.svg?v=1617102031925";
  pIMG[wN] = new Image; pIMG[wN].src = "https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FwN.svg?v=1617102031915";
  pIMG[wB] = new Image; pIMG[wB].src = "https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FwB.svg?v=1617102037456";
  pIMG[wQ] = new Image; pIMG[wQ].src = "https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FwQ.svg?v=1617102031643";
  pIMG[wK] = new Image; pIMG[wK].src = "https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FwK.svg?v=1617102031712";
  pIMG[wP_] = pIMG[wP];
  pIMG[wR_] = pIMG[wR];
  pIMG[wK_] = pIMG[wK];
  pIMG[bP] = new Image; pIMG[bP].src = "https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FbP.svg?v=1617102118623";
  pIMG[bR] = new Image; pIMG[bR].src = "https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FbR.svg?v=1617102119358";
  pIMG[bN] = new Image; pIMG[bN].src = "https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FbN.svg?v=1617102119524";
  pIMG[bB] = new Image; pIMG[bB].src = "https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FbB.svg?v=1617102118548";
  pIMG[bQ] = new Image; pIMG[bQ].src = "https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FbQ.svg?v=1617102119676";
  pIMG[bK] = new Image; pIMG[bK].src = "https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FbK.svg?v=1617102118749";
  pIMG[bP_] = pIMG[bP];
  pIMG[bR_] = pIMG[bR];
  pIMG[bK_] = pIMG[bK];
}
var bIMG = new Image; bIMG.src = "https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2Fbrown.svg?v=1617102060746";

//sounds
const sfx = {
  move: new Audio('https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2Fpublic_sound_standard_Move.mp3?v=1619558550313'),
  capture: new Audio('https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2Fpublic_sound_standard_Capture.mp3?v=1619561706712'),
  notification: new Audio('https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2Fpublic_sound_standard_GenericNotify.mp3?v=1619562589599')
};

//defining constants so I dont need to write it out later
var boardScale = 30*8; const oboardScale = 30*8;
var boardBuffer = 60; const oboardBuffer = 60;
var scale = 1;

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

//note: time <-> x, timeline <-> y
const Npaths = [(1,2),(-1,2),(1,-2),(-1,-2),(2,1),(2,-1),(-2,1),(-2,-1)];
const Bpaths = [(1,1),(1,-1),(-1,1),(-1,-1)];
const Rpaths = [(1,0),(0,-1),(-1,0),(0,1)];
const Ppaths = [(1,1),(-1,1)]; //note: y*= -1 for black //note2: this is for normal capture movement only
const Qpaths = [[-1, -1, -1, -1], [0, -1, -1, -1], [1, -1, -1, -1], [-1, 0, -1, -1], [0, 0, -1, -1], [1, 0, -1, -1], [-1, 1, -1, -1], [0, 1, -1, -1], [1, 1, -1, -1], [-1, -1, 0, -1], [0, -1, 0, -1], [1, -1, 0, -1], [-1, 0, 0, -1], [0, 0, 0, -1], [1, 0, 0, -1], [-1, 1, 0, -1], [0, 1, 0, -1], [1, 1, 0, -1], [-1, -1, 1, -1], [0, -1, 1, -1], [1, -1, 1, -1], [-1, 0, 1, -1], [0, 0, 1, -1], [1, 0, 1, -1], [-1, 1, 1, -1], [0, 1, 1, -1], [1, 1, 1, -1], [-1, -1, -1, 0], [0, -1, -1, 0], [1, -1, -1, 0], [-1, 0, -1, 0], [0, 0, -1, 0], [1, 0, -1, 0], [-1, 1, -1, 0], [0, 1, -1, 0], [1, 1, -1, 0], [-1, -1, 0, 0], [0, -1, 0, 0], [1, -1, 0, 0], [-1, 0, 0, 0], [0, 0, 0, 0], [1, 0, 0, 0], [-1, 1, 0, 0], [0, 1, 0, 0], [1, 1, 0, 0], [-1, -1, 1, 0], [0, -1, 1, 0], [1, -1, 1, 0], [-1, 0, 1, 0], [0, 0, 1, 0], [1, 0, 1, 0], [-1, 1, 1, 0], [0, 1, 1, 0], [1, 1, 1, 0], [-1, -1, -1, 1], [0, -1, -1, 1], [1, -1, -1, 1], [-1, 0, -1, 1], [0, 0, -1, 1], [1, 0, -1, 1], [-1, 1, -1, 1], [0, 1, -1, 1], [1, 1, -1, 1], [-1, -1, 0, 1], [0, -1, 0, 1], [1, -1, 0, 1], [-1, 0, 0, 1], [0, 0, 0, 1], [1, 0, 0, 1], [-1, 1, 0, 1], [0, 1, 0, 1], [1, 1, 0, 1], [-1, -1, 1, 1], [0, -1, 1, 1], [1, -1, 1, 1], [-1, 0, 1, 1], [0, 0, 1, 1], [1, 0, 1, 1], [-1, 1, 1, 1], [0, 1, 1, 1], [1, 1, 1, 1]];
//note: all 4 are for travel along any number of axes //note2: for all purposes, a king is a 1-range queen

//CLONE FUNCTION
//
//
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


//ZOOM FUNCTION
//
//
function zoom(event) {
  event.preventDefault();

  scale += event.deltaY * -0.005;

  // Restrict scale
  scale = Math.min(Math.max(.125, scale), 2);
  boardScale = scale*oboardScale;
  boardBuffer = scale*oboardBuffer;
}
c.onwheel = zoom;

//CLIENT
//
//
var Client = (function(window) {
  
  var playerName  = null;
  var socket      = null;

  var container   = null;
  var messages    = null;
  
  var gameOverMessage     = null;
  var pawnPromotionPrompt = null;
  var forfeitPrompt       = null;
  
  var games;
  
  function draw(){
    //canvas part
    //resizes canvas, if necessary
    if(window.innerWidth*dpi!=c.width||window.innerHeight*dpi!=c.height){
      c.width = window.innerWidth*dpi;
      c.height = window.innerHeight*dpi;
      c.style.width = window.innerWidth +"px";
      c.style.height = window.innerHeight +"px";
      console.log("dpi: ",dpi);
    }
    
    
    //console.log(this);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpi,dpi);
    ctx.clearRect(0,0,c.width,c.height);
    ctx.translate(CAMERA.x*scale+c.width*0.5*dpiinv, CAMERA.y*scale+c.height*0.5*dpiinv);
    
    //reversals for black client vs white client
    let ymod = playerColor=="white"?1:-1;
    
    if(this!=null){
      //draws the board connectors
      for(let tli in this.spacetime){
        ctx.strokeStyle = "rgba(140, 50, 215, 0.75)"
        ctx.beginPath();
        if(this.spacetime[tli].branch.time>-1) {//filters out start timeline parent
          
          let startpt = [this.spacetime[tli].branch.time * (boardScale+boardBuffer)+boardScale, -ymod*(this.spacetime[tli].branch.timeline* (boardScale+boardBuffer) )+ (boardScale/2)];
          let endpt = [this.spacetime[tli].branch.time* (boardScale+boardBuffer)+boardScale+boardBuffer, -ymod*(this.spacetime[tli].timeline* (boardScale+boardBuffer) )+ (boardScale/2)];
          let deltapt = [endpt[0]-startpt[0],endpt[1]-startpt[1]];
          ctx.moveTo(startpt[0],startpt[1]);
          ctx.quadraticCurveTo(startpt[0]+deltapt[0]*0.5, startpt[1], startpt[0]+deltapt[0]*0.5,startpt[1]+deltapt[1]*0.5);
          ctx.quadraticCurveTo(startpt[0]+deltapt[0]*0.5, endpt[1],endpt[0],endpt[1]);
        }
        ctx.lineWidth = boardScale*0.35;
        if((tli>0 && !(-Number(tli)+1 in this.spacetime)) || (tli<0 && !(-Number(tli)-1 in this.spacetime))) ctx.strokeStyle = tli>0?"rgba(255,255,255,0.75)":"rgba(0,0,0,0.75)";
        else ctx.strokeStyle = "rgba(140, 50, 215, 0.75)";
        ctx.stroke();
        ctx.closePath();
        for(let i =0; i < this.spacetime[tli].boards.length; i++){
          if(this.spacetime[tli].boards[i]!=null&&i+1<this.spacetime[tli].boards.length){
            ctx.beginPath();
            ctx.moveTo(i*(boardScale+boardBuffer)+boardScale,-ymod*(tli* (boardScale+boardBuffer) )+ (boardScale/2));
            ctx.lineTo((i+1)*(boardScale+boardBuffer),-ymod*(tli* (boardScale+boardBuffer) )+ (boardScale/2));
            ctx.lineWidth = boardScale*0.35;
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
      //draws present line
      ctx.beginPath();
      ctx.rect(this.present*(boardScale+boardBuffer)+(0.5-0.2)*boardScale, -CAMERA.y*scale-c.height*0.5, 2*(0.2)*boardScale, c.height);
      ctx.fillStyle = this.present%2==0?"rgba(255, 255, 255, 0.8)":"rgba(0, 0, 0, 0.8)";
      ctx.fill();
      ctx.closePath();
      //draws color board borders
      for(let tli in this.spacetime){
        for(let i=0; i < this.spacetime[tli].boards.length;i++){
          if(this.spacetime[tli].boards[i]!=null){ //draws board if it exists
            //draws color border
            ctx.beginPath();
            ctx.rect(0+(boardScale+boardBuffer)*i, -ymod*(boardScale+boardBuffer)*this.spacetime[tli].timeline,boardScale,boardScale);
            ctx.strokeStyle = i%2==0?"white":"black";
            ctx.lineWidth = boardScale/16;
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
      //draws check board borders
      for(let onemove of this.checks[playerColor]){
        ctx.beginPath();
        ctx.rect(0+(boardScale+boardBuffer)*onemove.src.time, -ymod*(boardScale+boardBuffer)*onemove.src.timeline,boardScale,boardScale);
        ctx.strokeStyle = "rgb(204,0,0)";
        ctx.lineWidth = boardScale/16;
        ctx.stroke();
        ctx.closePath();
      }
      //draws the boards
      for(let tli in this.spacetime){
        for(let i=0; i < this.spacetime[tli].boards.length;i++){
          if(this.spacetime[tli].boards[i]!=null){ //draws board if it exists
            //draws board img
            ctx.drawImage(bIMG,0+(boardScale+boardBuffer)*i, -ymod*(boardScale+boardBuffer)*this.spacetime[tli].timeline,boardScale,boardScale);
          }
        }
      }
      //draws highlighted last moves
      for(let onemove of this.lastMove){
        ctx.beginPath();
        if(playerColor=="white"){
          if(onemove.type== "normal"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*onemove.src.x,-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*(7-onemove.src.y),boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*(onemove.end.time+1)+boardScale/8*onemove.end.x,-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*(7-onemove.end.y),boardScale/8,boardScale/8);
          }
          else if(onemove.type== "castle"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*onemove.src.x,-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*(7-onemove.src.y),boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*(onemove.end.time+1)+boardScale/8*onemove.end.x,-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*(7-onemove.end.y),boardScale/8,boardScale/8);
          }
          else if(onemove.type=="en passant"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*onemove.src.x,-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*(7-onemove.src.y),boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*(onemove.end.time+1)+boardScale/8*onemove.end.x,-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*(7-onemove.end.y),boardScale/8,boardScale/8);
          }
          else if(onemove.type=="time travel"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*onemove.src.x,-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*(7-onemove.src.y),boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*onemove.end.time+boardScale/8*onemove.end.x,-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*(7-onemove.end.y),boardScale/8,boardScale/8);
          }
          else if(onemove.type== "promotion"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*onemove.src.x,-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*(7-onemove.src.y),boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*(onemove.end.time+1)+boardScale/8*onemove.end.x,-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*(7-onemove.end.y),boardScale/8,boardScale/8);
          }
        }
        else{
          if(onemove.type == "normal"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*(7-onemove.src.x),-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*onemove.src.y,boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*(onemove.end.time+1)+boardScale/8*(7-onemove.end.x),-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*onemove.end.y,boardScale/8,boardScale/8);
          }
          else if(onemove.type == "castle"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*(7-onemove.src.x),-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*onemove.src.y,boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*(onemove.end.time+1)+boardScale/8*(7-onemove.end.x),-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*onemove.end.y,boardScale/8,boardScale/8);
          }
          else if(onemove.type == "en passant"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*(7-onemove.src.x),-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*onemove.src.y,boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*(onemove.end.time+1)+boardScale/8*(7-onemove.end.x),-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*onemove.end.y,boardScale/8,boardScale/8);
          }
          else if(onemove.type == "time travel"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*(7-onemove.src.x),-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*onemove.src.y,boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*onemove.end.time+boardScale/8*(7-onemove.end.x),-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*onemove.end.y,boardScale/8,boardScale/8);
          }
          else if(onemove.type == "promotion"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*(7-onemove.src.x),-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*onemove.src.y,boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*(onemove.end.time+1)+boardScale/8*(7-onemove.end.x),-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*onemove.end.y,boardScale/8,boardScale/8);
          }
        }
        ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
        ctx.fill();
        ctx.closePath();
      }
      //draws highlighted current move squares
      for(let onemove of move){
        ctx.beginPath();
        if(playerColor=="white"){
          if(onemove.type== "normal"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*onemove.src.x,-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*(7-onemove.src.y),boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*(onemove.end.time+1)+boardScale/8*onemove.end.x,-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*(7-onemove.end.y),boardScale/8,boardScale/8);
          }
          else if(onemove.type== "castle"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*onemove.src.x,-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*(7-onemove.src.y),boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*(onemove.end.time+1)+boardScale/8*onemove.end.x,-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*(7-onemove.end.y),boardScale/8,boardScale/8);
          }
          else if(onemove.type=="en passant"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*onemove.src.x,-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*(7-onemove.src.y),boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*(onemove.end.time+1)+boardScale/8*onemove.end.x,-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*(7-onemove.end.y),boardScale/8,boardScale/8);
          }
          else if(onemove.type=="time travel"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*onemove.src.x,-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*(7-onemove.src.y),boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*onemove.end.time+boardScale/8*onemove.end.x,-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*(7-onemove.end.y),boardScale/8,boardScale/8);
          }
          else if(onemove.type== "promotion"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*onemove.src.x,-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*(7-onemove.src.y),boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*(onemove.end.time+1)+boardScale/8*onemove.end.x,-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*(7-onemove.end.y),boardScale/8,boardScale/8);
          }
        }
        else{
          if(onemove.type == "normal"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*(7-onemove.src.x),-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*onemove.src.y,boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*(onemove.end.time+1)+boardScale/8*(7-onemove.end.x),-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*onemove.end.y,boardScale/8,boardScale/8);
          }
          else if(onemove.type == "castle"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*(7-onemove.src.x),-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*onemove.src.y,boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*(onemove.end.time+1)+boardScale/8*(7-onemove.end.x),-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*onemove.end.y,boardScale/8,boardScale/8);
          }
          else if(onemove.type == "en passant"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*(7-onemove.src.x),-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*onemove.src.y,boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*(onemove.end.time+1)+boardScale/8*(7-onemove.end.x),-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*onemove.end.y,boardScale/8,boardScale/8);
          }
          else if(onemove.type == "time travel"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*(7-onemove.src.x),-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*onemove.src.y,boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*onemove.end.time+boardScale/8*(7-onemove.end.x),-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*onemove.end.y,boardScale/8,boardScale/8);
          }
          else if(onemove.type == "promotion"){
            ctx.rect((boardScale+boardBuffer)*onemove.src.time+boardScale/8*(7-onemove.src.x),-ymod*(boardScale+boardBuffer)*onemove.src.timeline+boardScale/8*onemove.src.y,boardScale/8,boardScale/8);
            ctx.rect((boardScale+boardBuffer)*(onemove.end.time+1)+boardScale/8*(7-onemove.end.x),-ymod*(boardScale+boardBuffer)*onemove.end.timeline+boardScale/8*onemove.end.y,boardScale/8,boardScale/8);
          }
        }
        ctx.fillStyle = "rgba(100, 0, 155, 0.3)";
        ctx.fill();
        ctx.closePath();
      }
      //highlights selected piece squares
      if(selected!=null && JSON.stringify(deepClone(selected)) in this.validMoves){
        ctx.beginPath();
        if(playerColor=="white") ctx.rect((boardScale+boardBuffer)*selected.time+(boardScale/8)*selected.x,-(boardScale+boardBuffer)*selected.timeline+(boardScale/8)*(7-selected.y),boardScale/8,boardScale/8);
        else ctx.rect((boardScale+boardBuffer)*selected.time+(boardScale/8)*(7-selected.x),(boardScale+boardBuffer)*selected.timeline+(boardScale/8)*(selected.y),boardScale/8,boardScale/8);
        ctx.fillStyle = "rgba(0, 153, 25, 0.3)";
        ctx.fill();
        ctx.closePath();
        for(let onemove of this.validMoves[JSON.stringify(deepClone(selected))]){
          let ooo = onemove.end;
          let ooox = playerColor=="white"?(boardScale+boardBuffer)*ooo.time+(boardScale/8)*ooo.x:(boardScale+boardBuffer)*ooo.time+(boardScale/8)*(7-ooo.x);
          let oooy = playerColor=="white"?-(boardScale+boardBuffer)*ooo.timeline+(boardScale/8)*(7-ooo.y):(boardScale+boardBuffer)*ooo.timeline+(boardScale/8)*ooo.y;
          ctx.beginPath();
          ctx.rect(ooox,oooy,boardScale/8,boardScale/8);
          ctx.fillStyle = "rgba(0, 153, 25, 0.3)";
          ctx.fill();
          ctx.closePath();
        }
      }
      //draws pieces
      for(let tli in this.spacetime){
        for(let i = 0; i < this.spacetime[tli].boards.length;i++){
          //b = current board
          let b = this.spacetime[tli].boards[i];
          
          if(b!=null){ //draw pieces on the board
            if(playerColor=="white"){
              for(let j = 0; j < 8; j++){
                for(let k = 0; k < 8; k++){
                  ctx.drawImage(pIMG[b[k][j]],(boardScale+boardBuffer)*i+k*boardScale/8, -ymod*(boardScale+boardBuffer)*this.spacetime[tli].timeline+(7-j)*boardScale/8,boardScale/8,boardScale/8);
                }
              }
            }
            else if(playerColor=="black"){
              for(let j = 0; j < 8; j++){
                for(let k = 0; k < 8; k++){
                  ctx.drawImage(pIMG[b[7-k][7-j]],(boardScale+boardBuffer)*i+k*boardScale/8, -ymod*(boardScale+boardBuffer)*this.spacetime[tli].timeline+(7-j)*boardScale/8,boardScale/8,boardScale/8);
                }
              }
            }
          }
        }
      }
      //draws timeline arrows
      
      //draws check arrows
      for(let onemove of this.checks[playerColor]){
        drawArrow(onemove.src,onemove.end,"rgb(204,0,0,0.75)");
      }
    }
    
    if(!socket==null && !socket.connected) statusblip.css('color','red');
    window.requestAnimationFrame(draw);
  }
  
  draw();
  
  //returns canvas coordinate system for mouse coords
  function trueMousePos(mPos){
    return {x: mPos.x-CAMERA.x*scale-c.width*0.5*dpiinv,y: mPos.y-CAMERA.y*scale-c.height*0.5*dpiinv};
  }
  
  //centers camera on a board
  function centerCAM(pos){
    CAMERA.x = -(pos.time*(boardScale+boardBuffer)+boardScale*0.5)/scale;
    CAMERA.y = playerColor=="white"?(pos.timeline*(boardScale+boardBuffer)-boardScale*0.5)/scale:-(pos.timeline*(boardScale+boardBuffer)+boardScale*0.5)/scale;
  }
  
  //disables/enables submission button
  function disableSubmit(){
    //no moves, no submitting
    if(move.length==0){
      $("#submit")[0].disabled = true;
      return;
    }
    
    //moves in present, same color
    let unlocksub = true;
    for(let tli in this.spacetime){
      if(((tli>0&&-tli+1 in this.spacetime)||(tli<0&&-tli-1 in this.spacetime)) && this.spacetime[tli].boards.length-1==this.present && ((this.spacetime[tli].boards.length%2==1&&playerColor=="white")||(this.spacetime[tli].boards.length%2==0&&playerColor=="black"))){
        unlocksub = false;
        break;
      }
    }
    //checks that no potential checks are present
    let danger = false;
    this.checks[playerColor].forEach(x=>danger = danger||x.src.time==nextPresent);
    if(!unlocksub || danger) $("#submit")[0].disabled = true;
    else $("#submit")[0].disabled = false;
  }

  /*
  * Canvas event listeners
  * essentially the game control inputs
  */
  
  //triggers piece selection, camera dragging
  c.addEventListener("mousedown",e=>{
    let xx = e.clientX - c.getBoundingClientRect().left;
    let yy = e.clientY - c.getBoundingClientRect().top;
    
    let x = trueMousePos({x:xx,y:yy}).x;
    let y = trueMousePos({x:xx,y:yy}).y;
    
    if(this.status!="ongoing") {
      mouseDownPos = [xx,yy];
      cameraDownPos = deepClone(CAMERA);
      return;
    }
        
    console.log("click at: ",x,y);
    let addon = {timeline:null,time:null,x:null,y:null,piece:null};
    let ymod = playerColor=="white"?1:-1;
    for(let tli in this.spacetime){
      tli = Number(tli);
      if(playerColor=="black"){
        if (y>tli*boardScale+boardBuffer*tli && y<(tli+1)*boardScale+boardBuffer*tli){
          addon.timeline = Number(tli);
          break;
        }  
      }
      else{
        if (y>-tli*boardScale-boardBuffer*tli && y<-(tli-1)*boardScale-boardBuffer*tli){
          addon.timeline = Number(tli);
          break;
        }  
      }
    }
    if(addon.timeline==null) {
      console.log("No timeline found");
      mouseDownPos = [xx,yy];
      cameraDownPos = deepClone(CAMERA);
      return;
    }
    
    for(let ti =0; ti< this.spacetime[addon.timeline].boards.length; ti++){
      if (this.spacetime[addon.timeline].boards[ti]!=null && x>ti*boardScale+boardBuffer*ti && x<(ti+1)*boardScale+boardBuffer*ti){
        addon.time = Number(ti);
        break;
      }
    }
    if(addon.time==null) {
      console.log("No time found");
      mouseDownPos = [xx,yy];
      cameraDownPos = deepClone(CAMERA);
      return;
    }
    
    for(let i= 0; i < 8; i++){
      if (x>addon.time*(boardScale+boardBuffer)+boardScale/8*i && x<addon.time*(boardScale+boardBuffer)+boardScale/8*(i+1)){
        addon.x = playerColor=="white"?i:7-i;
        break;
      }
    }
    if(addon.x==null) {
      console.log("No boardx found");
      mouseDownPos = [xx,yy];
      cameraDownPos = deepClone(CAMERA);
      return;
    }
    
    for(let i= 0; i < 8; i++){
      
      if (y>-ymod*addon.timeline*(boardScale+boardBuffer)+boardScale/8*i && y<-ymod*addon.timeline*(boardScale+boardBuffer)+boardScale/8*(i+1)){
        addon.y = playerColor=="white"?7-i:i;
        addon.piece = this.spacetime[addon.timeline].boards[addon.time][addon.x][addon.y];
        break;
      }
    }
    if(addon.y==null) {
      console.log("No boardy found");
      mouseDownPos = [xx,yy];
      cameraDownPos = deepClone(CAMERA);
      return;
    }
        
    console.log("Board Pos: ", addon);
    if(selected==null){
      if(!((addon.piece>-1&&addon.piece<10&&playerColor=="white"&&addon.time%2==0) || (addon.piece>9&&addon.piece<20&&playerColor=="black"&&addon.time%2==1))) return;
      selected= addon;
      //not a valid move start position, back to null
      if(!(JSON.stringify(deepClone(selected)) in this.validMoves)) selected = null;
    }
    else if(selected.x==addon.x&&selected.y==addon.y&&selected.time==addon.time&&selected.timeline==addon.timeline) selected = null;
    else{ //selects a piece
      if(this.activePlayer.color!=playerColor) return; //not your turn, no selection
      let validEndMove = false;
      for(let onemove of this.validMoves[JSON.stringify(deepClone(selected))]){
        let ed = onemove.end;
        if(ed.x==addon.x&&ed.y==addon.y&&ed.time==addon.time&&ed.timeline==addon.timeline){
          validEndMove = true;
          this.doMove(onemove);
        }
      }
      if(!validEndMove) return;
      else $("#undo")[0].disabled = false;
      
      selected = null;
    }
    
  });
  
  //updates camera dragging
  c.addEventListener("mousemove", e => {
    //drags camera
    if(mouseDownPos!=null){
      let x = e.clientX - c.getBoundingClientRect().left;
      let y = e.clientY - c.getBoundingClientRect().top;
      CAMERA.x = cameraDownPos.x+ (x-mouseDownPos[0])/scale;
      CAMERA.y = cameraDownPos.y + (y-mouseDownPos[1])/scale;
    }
    else{
      // CAMERA.x -= e.movementX*0.2/scale;
      // CAMERA.y -= e.movementY*0.2/scale;
    }
  });
  c.addEventListener("mouseup",e=>{
    let x = e.clientX - c.getBoundingClientRect().left;
    let y = e.clientY - c.getBoundingClientRect().top;
    
    mouseDownPos = null;
    cameraDownPos = null;
  });
  c.addEventListener("onwheel",e=>{
    console.log(e);
    boardScale+=e.deltaY;
    boardBuffer+=e.deltaY;
  });
  
  
  /**
   * Initialize the UI
   */
  var init = function(config) {
    playerName  = config.playerName;

    container           = $('#game');
    messages            = $('#messages');
    gameOverMessage     = $('#game-over');
    pawnPromotionPrompt = $('#pawn-promotion');
    forfeitPrompt       = $('#forfeit-game');
    
    // Set the radio button images
    
    if(playerColor=="white"){
      document.getElementById("N").src = 'https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FwN.svg?v=1617102031915';
      document.getElementById("B").src = 'https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FwB.svg?v=1617102037456';
      document.getElementById("R").src = 'https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FwR.svg?v=1617102031925';
      document.getElementById("Q").src = 'https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FwQ.svg?v=1617102031643';
    }
    else{
      document.getElementById("N").src = 'https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FbN.svg?v=1617102119524';
      document.getElementById("B").src = 'https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FbB.svg?v=1619264125655';
      document.getElementById("R").src = 'https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FbR.svg?v=1617102119358';
      document.getElementById("Q").src = 'https://cdn.glitch.com/5e0f9006-3453-41ad-b0eb-222438390afa%2FbQ.svg?v=1617102119676';
      
    }


    // Attach event handlers
    attachSocketEventHandlers();
    attachDOMEventHandlers();

    // Initialize modal popup windows
    gameOverMessage.modal({show: false, keyboard: false, backdrop: 'static'});
    pawnPromotionPrompt.modal({show: false, keyboard: false, backdrop: 'static'});
    forfeitPrompt.modal({show: false, keyboard: false, backdrop: 'static'});

    // Join game
    socket.emit('join', gameID);
  };
  
  var attachSocketEventHandlers = function() {

    // Update UI with new game state
    socket.on('update', function(data) {
      console.log(data);
      data.forEach(onemove=>this.doMove(onemove));
      move = [];
      
      if(this.status=="ongoing") {
        statusblip.css('color','green');
        sfx['notification'].play();
      }
      else statusblip.css('color','yellow');
      
      $("#submit")[0].disabled = true;
      $("#undo")[0].disabled = true;
    });


    // Display an error
    socket.on('error', function(data) {
      console.log(data);
      showErrorMessage(data);
    });
  };

  
  //attaches DOM event handlers
  var attachDOMEventHandlers = function() {
    container.on('click', '#forfeit', function(ev) {
      showForfeitPrompt(function(confirmed) {
        if (confirmed) {
          messages.empty();
          socket.emit('forfeit', gameID);
        }
      });
    });
    container.on('click', '#submit', function(ev) {
      if(this.status!="ongoing" || move.length==0) return;
      console.log("submitting");
      $("#submit")[0].disabled = true;
      socket.emit('move',{player:playerColor,gameID:gameID, move:move});
    });
    container.on('click', '#undo', function(ev) {
      //no moves to undo, exits
      if(move.length==0) return;
      
      let onemove = move.pop();
       
      if(onemove.type == "normal"){
        this.spacetime[onemove.src.timeline].boards.pop();
        this.spacetime[onemove.src.timeline].boards[onemove.src.time][onemove.src.x][onemove.src.y] = onemove.src.piece;
        this.spacetime[onemove.end.timeline].boards[onemove.end.time][onemove.end.x][onemove.end.y] = onemove.end.piece;
      }
      else if(onemove.type == "castle"){

      }
      else if(onemove.type == "en passant"){

      }
      else if(onemove.type == "time travel"){

      }
      else if(onemove.type == "promotion"){
        
      }
      else if(onemove.type == "debug"){
        this.spacetime[onemove.src.timeline].boards.push(this.spacetime[onemove.src.timeline].boards.last());
        this.spacetime[onemove.src.timeline].boards[onemove.src.time+1][onemove.src.x][onemove.src.y] = __;
        this.spacetime[onemove.end.timeline].boards[onemove.end.time+1][onemove.end.x][onemove.end.y] = onemove.src.piece;
      }
      //recalculates moves and checks
      socket.emit('recalc',{gameID: gameID, player:playerColor, data:this.spacetime});
      
      //shifts camera back
      centerCAM({time:onemove.src.time,timeline:onemove.src.timeline});
      
      //disableds button if no moves 
      if(move.length==0) $("#undo")[0].disabled = true;
      
    });
  }

  /**
   * Display an error message on the page
   */
  var showErrorMessage = function(data) {
    var msg, html = '';

    if (data == 'handshake unauthorized') {
      msg = 'Client connection failed';
    } else {
      msg = data.message;
    }

  };

  /**
   * Display the "Game Over" window
   */
  var showGameOverMessage = function(type) {
    var header = gameOverMessage.find('h2');

    // Set the header's content and CSS classes
    header.removeClass('alert-success alert-danger alert-warning');
    switch (type) {
      case 'checkmate-win'  : header.addClass('alert-success').text('Checkmate'); break;
      case 'checkmate-lose' : header.addClass('alert-danger').text('Checkmate'); break;
      case 'forfeit-win'    : header.addClass('alert-success').text('Your opponent has forfeited the game'); break;
      case 'forfeit-lose'   : header.addClass('alert-danger').text('You have forfeited the game'); break;
      case 'stalemate'      : header.addClass('alert-warning').text('Stalemate'); break;
    }

    gameOverMessage.modal('show');
  };

  /**
   * Display the "Pawn Promotion" prompt
   */
  var showPawnPromotionPrompt = function(callback) {
    // Temporarily attach click handler for the Promote button, note the use of .one()
    pawnPromotionPrompt.one('click', 'button', function(ev) {
      var selection = pawnPromotionPrompt.find("input[type='radio'][name='promotion']:checked").val();
      callback(selection);
      pawnPromotionPrompt.modal('hide');
    });

    pawnPromotionPrompt.modal('show');
  };

  /**
   * Display the "Forfeit Game" confirmation prompt
   */
  var showForfeitPrompt = function(callback) {

    // Temporarily attach click handler for the Cancel button, note the use of .one()
    forfeitPrompt.one('click', '#cancel-forfeit', function(ev) {
      callback(false);
      forfeitPrompt.modal('hide');
    });

    // Temporarily attach click handler for the Confirm button, note the use of .one()
    forfeitPrompt.one('click', '#confirm-forfeit', function(ev) {
      callback(true);
      forfeitPrompt.modal('hide');
    });

    forfeitPrompt.modal('show');
  };

  /**
   * Get the corresponding CSS classes for a given piece
   */
  var getPieceClasses = function(piece) {
    switch (piece) {
      case 'bP'  : return 'black pawn';
      case 'bP_' : return 'black pawn not-moved';
      case 'bR'  : return 'black rook';
      case 'bR_' : return 'black rook not-moved';
      case 'bN'  : return 'black knight';
      case 'bN_' : return 'black knight not-moved';
      case 'bB'  : return 'black bishop';
      case 'bB_' : return 'black bishop not-moved';
      case 'bQ'  : return 'black queen';
      case 'bQ_' : return 'black queen not-moved';
      case 'bK'  : return 'black king';
      case 'bK_' : return 'black king not-moved';
      case 'wP'  : return 'white pawn';
      case 'wP_' : return 'white pawn not-moved';
      case 'wR'  : return 'white rook';
      case 'wR_' : return 'white rook not-moved';
      case 'wN'  : return 'white knight';
      case 'wN_' : return 'white knight not-moved';
      case 'wB'  : return 'white bishop';
      case 'wB_' : return 'white bishop not-moved';
      case 'wQ'  : return 'white queen';
      case 'wQ_' : return 'white queen not-moved';
      case 'wK'  : return 'white king';
      case 'wK_' : return 'white king not-moved';
      default    : return 'empty';
    }
  };

  return init;

}(window));

class Game{
  
};

//checks to see if a position is a valid location
Game.prototype.validPos = function(pos){
  if(pos.x>-1 && pos.x<8 && pos.y>-1 && pos.y<8) 
    if(pos.timeline in this.spacetime)
      if(pos.time>-1 && pos.time<this.spacetime[pos.timeline].boards.length)
        if(this.spacetime[pos.timeline].boards[pos.time]!=null)
          return true;
  return false;
}

//checks color based on piece
Game.prototype.getTeam = function(piece){
  if(piece.piece>-100) piece = piece.piece;
  else if(piece.x>-1){ //is position input, convert to piece
    piece = this.spacetime[piece.timeline].boards[piece.time][piece.x][piece.y];
  }
  if(piece<0) return "none";
  if(piece>-1 && piece<10) return "white";
  if(piece>9&&piece<20) return "black";
  return null;
}

//returns piece value at position
Game.prototype.getPiece = function(pos){
  if(!this.validPos(pos)) return false;
  return this.spacetime[pos.timeline].boards[pos.time][pos.x][pos.y];
}

//adds move p2 to position p1 and returns new position, order DOES matter
Game.prototype.addPos = function(p1,p2){
  let ret = {x:p1.x+p2.x,y:p1.y+p2.y,timeline:Number(p1.timeline)+Number(p2.timeline),time:Number(p1.time)+2*Number(p2.time)};
  //NOTE: time is scaled x2 due to black/white both on time
  if(!this.validPos(ret)) {
    return {x:-1,y:-1,time:-1,timeline:-1,piece:-100};
  }
  if(p1.piece) {
    let pp = this.getPiece(ret);
    return {x:ret.x,y:ret.y,timeline:ret.timeline,time:ret.time,piece:pp};
  }
  return ret;
}

//returns the lists of pair of positions that are checking and in check 
Game.prototype.getChecks = function(){
  let ret = {"white":[],"black":[]};
  for(let tli in this.spacetime){
    for(let ooo = 0; ooo < this.spacetime[tli].boards.length; ooo++){
      let b = this.spacetime[tli].boards[ooo];
      if(b!=null){
        for(let i = 0; i < 8; i++){
          for(let j = 0; j < 8; j++){
            if(b[i][j]==wK || b[i][j]==wK_){
              let allchecks = this.findChecks({x:i,y:j,timeline:tli,time:ooo},"white");
              for(let x of allchecks){
                if(x.time==this.spacetime[x.timeline].boards.length-1){
                  ret["white"].push({src:x,end:{x:i,y:j,timeline:Number(tli),time:ooo}})
                }
              }
            }
            else if(b[i][j]==bK || b[i][j]==bK_){
              let allchecks = this.findChecks({x:i,y:j,timeline:tli,time:ooo},"black");
              for(let x of allchecks){
                console.dir(x);
                if(x.time==this.spacetime[x.timeline].boards.length-1){
                  ret["black"].push({src:x,end:{x:i,y:j,timeline:Number(tli),time:ooo}})
                }
              }
            }
          }
        }
      }
    }
  }
  this.checks = ret;
}

//checks to see if the position is being attacked by enemy pieces
Game.prototype.findChecks = function(pos,team){
  let ret = [];
  let modifier = team=="white"? 10:0;
  //checks for knight attacks
  for(let delta of Npaths){
    //combines all time/space combos for 2 axis
    let newpos = this.addPos(pos,{x:delta[0],y:delta[1],time:0,timeline:0});
    if(this.validPos(newpos)&& this.getPiece(newpos)==wN+modifier) ret.push(newpos);
    
    newpos = this.addPos(pos,{x:delta[0],y:0,time:0,timeline:delta[1]});
    if(this.validPos(newpos)&& this.getPiece(newpos)==wN+modifier) ret.push(newpos);
      
    newpos = this.addPos(pos,{x:0,y:delta[1],time:delta[0],timeline:0});
    if(this.validPos(newpos)&& this.getPiece(newpos)==wN+modifier) ret.push(newpos);
      
    newpos = this.addPos(pos,{x:0,y:0,time:delta[0],timeline:delta[1]});
    if(this.validPos(newpos)&& this.getPiece(newpos)==wN+modifier) ret.push(newpos);
  }
  
  //checks for bishop attacks
  for(let delta of Bpaths){
    let newdeltas = [{x:delta[0],y:delta[1],time:0,timeline:0},{x:delta[0],y:0,time:0,timeline:delta[1]},{x:0,y:delta[1],time:delta[0],timeline:0},{x:0,y:0,time:delta[0],timeline:delta[1]}];
    for(let newdelta of newdeltas){
      while(true){
        let newpos = this.addPos(pos,newdelta);
        //off the board position, break
        if(!this.validPos(newpos)) break;
        //enemy bishop spotted
        if(this.getPiece(newpos)==wB+modifier){
          ret.push(newpos);
          break;
        } 
        //other piece blocking LOS
        if(this.getPiece(newpos)!=__) break;
        //increments the distance along axes
        for(let key in newdelta){
          if(newdelta[key]>0) newdelta[key]++;
          if(newdelta[key]<0) newdelta[key]--;
        }
      }
    }
  }
  
  //checks for rook attacks
  for(let delta of Rpaths){
    let newdeltas = [{x:delta[0],y:delta[1],time:0,timeline:0},{x:delta[0],y:0,time:0,timeline:delta[1]},{x:0,y:delta[1],time:delta[0],timeline:0},{x:0,y:0,time:delta[0],timeline:delta[1]}];
    for(let newdelta of newdeltas){
      while(true){
        let newpos = this.addPos(pos,newdelta);
        //off the board position, break
        if(!this.validPos(newpos)) break;
        //enemy rook spotted
        if(this.getPiece(newpos)==wR+modifier || this.getPiece(newpos)==wR_+modifier) {
          ret.push(newpos);
          break;
        }
        //other piece blocking LOS
        if(this.getPiece(newpos)!=__) break;
        
        //increments the distance along axes
        for(let key in newdelta){
          if(newdelta[key]>0) newdelta[key]++;
          if(newdelta[key]<0) newdelta[key]--;
        }
      }
    }
  }
  
  //checks for pawn attacks
  for(let delta of Ppaths){
    //reverses for black
    let newpos = this.addPos(pos,{x:delta[0],y:team=="white"?delta[1]:-1*delta[1],time:0,timeline:0});
    if(this.validPos(newpos)&& (this.getPiece(newpos)==wP+modifier||this.getPiece(newpos)==wP_+modifier)) ret.push(newpos);
    
    newpos = this.addPos(pos,{x:0,y:0,time:delta[0],timeline:team=="white"?delta[1]:-1*delta[1]});
    if(this.validPos(newpos)&& (this.getPiece(newpos)==wP+modifier||this.getPiece(newpos)==wP_+modifier)) ret.push(newpos);
  }
  
  //checks for queen/king attacks
  for(let delta of Qpaths){
    let newdeltas = [{x:delta[0],y:delta[1],time:delta[2],timeline:delta[3]}];
    for(let newdelta of newdeltas){
      //checks king 1-radius first
      let newpos = this.addPos(pos,newdelta);
      //off the board position, break
      if(this.validPos(newpos) && (this.getPiece(newpos)==wK+modifier||this.getPiece(newpos)==wK_+modifier)) ret.push(newpos);
      
      //checks queen
      while(true){
        let newpos = this.addPos(pos,newdelta);
        //off the board position, break
        if(!this.validPos(newpos)) break;        
        if(this.getPiece(newpos)==wQ+modifier){
          ret.push(newpos);
          break;
        }
        //other piece blocking LOS
        if(this.getPiece(newpos)!=__) break;
        
        //increments the distance along axes
        for(let key in newdelta){
          if(newdelta[key]>0) newdelta[key]++;
          if(newdelta[key]<0) newdelta[key]--;
        }
      }
    }
  }
  return ret;
}

//checks to see if any player is checkmated
//note: you are checkmated if your king remains attacked by an ACTIVE piece. If the piece cannot take your king the next move, then it is not checkmate
Game.prototype.getCheckmate = function(){
  
}

//recalculates the present bar
Game.prototype.findPresent = function() {
  let i = 0;
  let ppp = -1;
  for(let x in this.spacetime) ppp = Math.max(ppp,this.spacetime[x].boards.length);
  while(true){
    //1 shift
    if((i in this.spacetime && -i+1 in this.spacetime)||(i-1 in this.spacetime && -i in this.spacetime)){
      if(i in this.spacetime) ppp = Math.min(ppp,this.spacetime[i].boards.length);
      if(-i in this.spacetime) ppp = Math.min(ppp,this.spacetime[-i].boards.length);
    }
    else break;
    i++;
  }
  this.present = ppp-1;
}

//initializes and returns a timeline object
Game.prototype.newTL = function(params){
  let ret = {
    branch: {timeline: params.src.timeline, time:params.src.time},
    timeline: params.id,
    travelaway: [],
    boards: [],
  };
  for(var i = 0; i < params.src.time+1;i++){
    ret.boards.push(null);
  }
  ret.boards.push(params.init);
  
  return ret
}

//does move
Game.prototype.doMove = function(onemove){
    let sfxtype = "move";
    console.log(onemove.src.piece,onemove.end.piece);
    if(onemove.src.piece>=0 && onemove.src.piece<10&&onemove.end.piece>=10&&onemove.end.piece<20) sfxtype = 'capture';
    else if(onemove.end.piece>=0 && onemove.end.piece<10&&onemove.src.piece>=10&&onemove.src.piece<20) sfxtype = 'capture';
    else if(onemove.type=="en passant") sfxtype = 'capture';
    
    if(onemove.type == "normal"){
      this.spacetime[onemove.src.timeline].boards.push(this.spacetime[onemove.src.timeline].boards.last());
      this.spacetime[onemove.src.timeline].boards[onemove.src.time+1][onemove.src.x][onemove.src.y] = __;
      this.spacetime[onemove.end.timeline].boards[onemove.end.time+1][onemove.end.x][onemove.end.y] = onemove.src.piece;
    }
    else if(onemove.type == "castle"){
      this.spacetime[onemove.src.timeline].boards.push(this.spacetime[onemove.src.timeline].boards.last());
      this.spacetime[onemove.src.timeline].boards[onemove.src.time+1][onemove.src.x][onemove.src.y] = __;
      this.spacetime[onemove.end.timeline].boards[onemove.end.time+1][onemove.end.x][onemove.end.y] = onemove.src.piece;
      if(onemove.src.x>onemove.end.x){ //queenside 
        this.spacetime[onemove.end.timeline].boards[onemove.end.time+1][3][onemove.end.y] = deepClone(this.spacetime[onemove.src.timeline].boards[onemove.src.time+1][0][onemove.src.y]);
        this.spacetime[onemove.src.timeline].boards[onemove.src.time+1][0][onemove.src.y] = __;
      }
      else{ //kindside
        this.spacetime[onemove.end.timeline].boards[onemove.end.time+1][5][onemove.end.y] = deepClone(this.spacetime[onemove.src.timeline].boards[onemove.src.time+1][7][onemove.src.y]);
        this.spacetime[onemove.src.timeline].boards[onemove.src.time+1][7][onemove.src.y] = __;
      }
    }
    else if(onemove.type == "en passant"){
      if(onemove.src.timeline==onemove.end.timeline){
        this.spacetime[onemove.src.timeline].boards.push(this.spacetime[onemove.src.timeline].boards.last());
        let ymod = playerColor=="white"?1:-1;
        this.spacetime[onemove.src.timeline].boards[onemove.src.time+1][onemove.end.x][onemove.end.y-ymod] = __;
        this.spacetime[onemove.src.timeline].boards[onemove.src.time+1][onemove.src.x][onemove.src.y] = __;
        this.spacetime[onemove.end.timeline].boards[onemove.end.time+1][onemove.end.x][onemove.end.y] = onemove.src.piece;
      }
      else{ //time travel en passant, be sad
        //disabling this for now cause multi-timeline en passant is just confusing
      }
    }
    else if(onemove.type == "time travel"){
      //travelling back in time
      if(this.spacetime[onemove.end.timeline].boards.length-1>onemove.end.time){
        let bmax = Math.max( ...Object.keys(this.spacetime));
        let bmin = Math.min( ...Object.keys(this.spacetime));
        let bnew = deepClone(this.spacetime[onemove.end.timeline].boards[onemove.end.time]);

        this.spacetime[onemove.src.timeline].boards.push(this.spacetime[onemove.src.timeline].boards.last());
        this.spacetime[onemove.src.timeline].boards[onemove.src.time+1][onemove.src.x][onemove.src.y] = __;
        bnew[onemove.end.x][onemove.end.y] = onemove.src.piece;

        if(playerColor=="white"){
          this.spacetime[bmax+1] = this.newTL({src:{time:onemove.end.time,timeline:onemove.end.timeline},init:bnew,id:bmax+1});
        }
        else{
          this.spacetime[bmin-1] = this.newTL({src:{time:onemove.end.time,timeline:onemove.end.timeline},init:bnew,id:bmin-1});
        }
      }
      //travelling onto another board, no new timelines created
      else{
        this.spacetime[onemove.src.timeline].boards.push(this.spacetime[onemove.src.timeline].boards.last());
        this.spacetime[onemove.end.timeline].boards.push(this.spacetime[onemove.end.timeline].boards.last());
        this.spacetime[onemove.src.timeline].boards[onemove.src.time+1][onemove.src.x][onemove.src.y] = __;
        this.spacetime[onemove.end.timeline].boards[onemove.end.time+1][onemove.end.x][onemove.end.y] = onemove.src.piece;
      }
    }
    else if(onemove.type== "promotion"){
      showPawnPromotionPrompt(function(p) {
        this.spacetime[onemove.src.timeline].boards.push(this.spacetime[onemove.src.timeline].boards.last());
        this.spacetime[onemove.src.timeline].boards[onemove.src.time+1][onemove.src.x][onemove.src.y] = __;
        this.spacetime[onemove.end.timeline].boards[onemove.end.time+1][onemove.end.x][onemove.end.y] = playerColor=="white"?p:p+10;
        onemove.src.piece = playerColor=="white"?p:p+10;

        move.push(onemove);
        centerCAM({time:onemove.src.time+1,timeline:onemove.src.timeline});
        socket.emit('recalc',{gameID: gameID, player:playerColor, data:this.spacetime});

        disableSubmit();

        messages.empty();
      });
    }
    else if(onemove.type == "debug"){
      this.spacetime[onemove.src.timeline].boards.push(this.spacetime[onemove.src.timeline].boards.last());
      this.spacetime[onemove.src.timeline].boards[onemove.src.time+1][onemove.src.x][onemove.src.y] = __;
      this.spacetime[onemove.end.timeline].boards[onemove.end.time+1][onemove.end.x][onemove.end.y] = onemove.src.piece;
    }
    //except promotion type b/c promotion has pop-up that needs input first
    if(onemove.type!="promotion"){
      move.push(onemove);
      centerCAM({time:onemove.src.time+1,timeline:onemove.src.timeline});
      socket.emit('recalc',{gameID: gameID, player:playerColor, data:this.spacetime});
      
      disableSubmit();
    }
    
    //play the sound
    sfx[sfxtype].play();
  }


