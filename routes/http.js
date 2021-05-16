var DB = null;
var PB = null;

/**
 * Render "Home" Page
 */
var home = function(req, res) {

  // Welcome
  res.render('home');
};

/**
 * Render "Game" Page (or redirect to home page if session is invalid)
 */
var game = function(req, res) {
  
  // Validate session data
  req.session.regenerate(function(err) {
    console.log('owo'+req.SessionID);
    if (err) {res.redirect('/'); return; }

    // Find specified game
    let gameID = req.route.params.id;
    var game = DB.find(gameID);
    if (!game) { res.redirect('/'); return;}

    // Save data to session
    req.session.gameID      = null;
    if(game.players['white']==req.SessionID){
      req.session.playerColor;
    }
  });

  // Render the game page
  res.render('game');
};

/**
 * Redirect non-existent routes to the home page
 */
var invalid = function(req, res) {
  // Go home HTTP request, you're drunk
  res.redirect('/');
};

/**
 * Matchmaking
 */
var quickMatch = function(req, res){
  //no form submission, redirect to home page
  if(!req.body.color){
    res.redirect('/');
  }  
  
  //searches for games to join as public
  let newgame = true;
  //random color
  if(req.body.color=='random'){
    for(let key in DB.games){
      if(DB.games[key].players['white']==null){
        console.log("Joining game "+key);
        res.redirect('/game/'+key);
        newgame = false;
      }
      else if(DB.games[key].players['black']==null){
        console.log("Joining game "+key);
        res.redirect('/game/'+key);
        newgame = false;
      }
    }
  }
  //set color
  else{
    if(req.body.views=='public'){
      for(let key in DB.games){
        if(DB.games[key].players[req.body.color]==null){
          res.gameID = key;
          console.log("Joining game "+key);
          res.redirect('/game/'+key);
          newgame = false;
        }
      }
    }
  }
  
  //creates a game
  if(newgame){
    let newcolor = req.body.color=='random'?(Math.random()>0.5?'white':'black'):req.body.color;
    console.log('owo'+req.SessionID);
    var gameID = DB.add({pID:req.SessionID, color:newcolor, views:req.body.views});
    console.log("Creating new game "+gameID);
    res.redirect('/game/'+gameID);
  }
}


/**
 * Attach route handlers to the app
 */
exports.attach = function(app, db) {
  DB = db.game;
  PB = db.player;

  app.get('/',         home);
  app.get('/game/:id', game);
  app.post('/start',   quickMatch);
  app.post('/join',    joinGame);
  app.all('*',         invalid);
};
