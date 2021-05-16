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
    if (err) {res.redirect('/'); return; }

    // Find specified game
    console.log("AAa+ "+window.location.href.substring("5dchess.glitch.me/game/".length));
    var game = DB.find(window.location.href.substring("5dchess.glitch.me/game/".length));
    if (!game) { res.redirect('/'); return;}

    // Determine which player (color) to join as
    var joinColor = (game.players[0].joined) ? game.players[1].color : game.players[0].color;

    // Save data to session
    req.session.gameID      = null;
    req.session.playerColor = joinColor;
  });

  // Render the game page
  res.render('game');
};

/**
 * Process "Start Game" form submission
 * Redirects to game page on success or home page on failure
 */
var newGame = function(req, res) {

  console.log(req.body);
  // Create a new session
  req.session.regenerate(function(err) {
    if (err) { res.redirect('/'); return; }
    
    

    // Create new game
    

    // Save data to session
    req.session.gameID      = gameID;
    req.session.playerColor = req.color;

    // Redirect to game page
    res.redirect('/game/'+gameID);
  });
};

/**
 * Process "Join Game" form submission
 * Redirects to game page on success or home page on failure
 */
var joinGame = function(req, res) {

  // Create a new session
  req.session.regenerate(function(err) {
    if (err) {res.redirect('/'); return; }

    // Validate form input
    var validData = validateJoinGame(req);
    if (!validData) { res.redirect('/'); return; }

    // Find specified game
    var game = DB.find(validData.gameID);
    if (!game) { res.redirect('/'); return;}

    // Determine which player (color) to join as
    var joinColor = (game.players[0].joined) ? game.players[1].color : game.players[0].color;

    // Save data to session
    req.session.gameID      = validData.gameID;
    req.session.playerColor = joinColor;
    req.session.playerName  = validData.playerName;

    // Redirect to game page
    res.redirect('/game/'+validData.gameID);
  });
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
      console.log("K"+key);
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
    var gameID = DB.add({player:req.SessionID, color:newcolor, views:req.body.views});
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
