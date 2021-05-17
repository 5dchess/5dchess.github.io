var DB = null;
var PB = null;

/**
 * Render "Home" Page
 */
var home = function(req, res) {
  //Creates new player profile
  req.session.regenerate(function(err) {
    if (err) {res.redirect('/'); return; }
    req.session.playerID = PB.add();
  });
  
  // Welcome
  res.render('home');
};

/**
 * Render "Game" Page (or redirect to home page if session is invalid)
 */
var game = function(req, res) {
  // Validate session data

  // Find specified game
  let gameID = req.route.params.id;
  var game = DB.find(gameID);
  if (!game) { res.redirect('/'); return;}

  // Save data to session
  if(game.players['white']==req.SessionID){
    req.session.playerColor;
  }

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
var match = function(req, res){
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
    //random color
    let newcolor = req.body.color=='random'?(Math.random()>0.5?'white':'black'):req.body.color;
    
    var gameID = DB.add({pID:req.playerID, color:newcolor, views:req.body.views},'multi');
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
  app.post('/start',   match);
  app.all('*',         invalid);
};
