var GameStore = require('./GameStore');

function PlayerStore(){
  this.players = {};
  
  //deletes inactive players
  setInterval(function(p) {
    for (var key in p) {
      if (Date.now() - p[key].modifiedOn > (1 * 60 * 60 * 1000)) {
        console.log("Deleting player " + key + ". No activity for atleast 1 hours.");
        delete p[key];
      }
    }
  }, (1 * 60 * 60 * 1000), this.players);
}
GameStore.prototype.add = function(gameParams) {
  var key       = '';
  var keyLength = 7;
  var chars     = 'abcdefghijklmnopqrstuvwxyz0123456789';

  // Generate a key until we get a unique one
  do {
    for (var i=0; i<keyLength; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    };
  } while (this.games.hasOwnProperty(key))

  // Create a new game and save using key
  this.games[key] = {
    modifiedOn: Date.now(),
    games: 
  };

  return key;
};

GameStore.prototype.remove = function(key) {
  if (this.games.hasOwnProperty(key)) {
    delete this.games[key];
    return true;
  } else {
    return false;
  }
};

GameStore.prototype.find = function(key) {
  return (this.games.hasOwnProperty(key)) ? this.games[key] : false ;
};

module.exports = GameStore;