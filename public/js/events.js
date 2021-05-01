$("#tabs").on('click', '#submit', function(ev) {
  if(this.status!="ongoing" || move.length==0) return;
  console.log("submitting");
  $("#submit")[0].disabled = true;
  socket.emit('move',{player:playerColor,gameID:gameID, move:move});
});