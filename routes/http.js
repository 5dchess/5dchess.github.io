var DB = null;
var PB = null;

/**
 * Validate session data for "Game" page
 * Returns valid data on success or null on failure
 */
var validateGame = function(req) {

  // These must exist
  if (!req.session.gameID)      { return null; }
  if (!req.session.playerColor) { return null; }
  if (!req.session.playerName)  { return null; }
  if (!req.params.id)           { return null; }

  // These must match
  if (req.session.gameID !== req.params.id) { return null; }

  return {
    gameID      : req.session.gameID,
    playerColor : req.session.playerColor,
    playerName  : req.session.playerName
  };
};

/**
 * Validate "Start Game" form input
 * Returns valid data on success or null on failure
 */
var validateStartGame = function(req) {

  // These must exist
  if (!req.body['player-color']) { return null; }

  // Player Color must be 'white' or 'black'
  if (req.body['player-color'] !== 'white' && req.body['player-color'] !== 'black') { return null; }

  // If Player Name consists only of whitespace, set as 'Player 1'
  if (/^\s*$/.test(req.body['player-name'])) { req.body['player-name'] = 'Player 1'; }

  return {
    playerColor : req.body['player-color'],
    playerName  : req.body['player-name']
  };
};

/**
 * Validate "Join Game" form input
 * Returns valid data on success or null on failure
 */
var validateJoinGame = function(req) {

  // These must exist
  if (!req.body['game-id']) { return null; }

  // If Game ID consists of only whitespace, return null
  if (/^\s*$/.test(req.body['game-id'])) { return null; }

  // If Player Name consists only of whitespace, set as 'Player 2'
  if (/^\s*$/.test(req.body['player-name'])) { req.body['player-name'] = 'Player 2'; }

  return {
    gameID      : req.body['game-id'],
    playerName  : req.body['player-name']
  };
};

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
  var validData = validateGame(req);
  if (!validData) { res.redirect('/'); return; }

  // Render the game page
  res.render('game', validData);
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
  app.post('/newgame', newGame);
  app.post('/join',    joinGame);
  app.all('*',         invalid);
};
