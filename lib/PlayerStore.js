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
PlayerStore.prototype.add = function(playerParams) {

  // Create a new game and save using key
  this.games[playerParams.id] = {
    modifiedOn: Date.now(),
    games:[],
    playerName: playerParams.name,
    playerKey: playerParams.id
  };

  return true;
};

PlayerStore.prototype.remove = function(key) {
  if (this.games.hasOwnProperty(key)) {
    delete this.games[key];
    return true;
  } else {
    return false;
  }
};

PlayerStore.prototype.find = function(key) {
  return (this.games.hasOwnProperty(key)) ? this.games[key] : false ;
};

module.exports = PlayerStore;