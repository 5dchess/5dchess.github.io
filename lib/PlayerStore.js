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