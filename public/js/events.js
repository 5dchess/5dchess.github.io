const tabs = {lobby:'lobbytab',spec:'spectab',private:'privatetab',ingame:'ingametab'};


//switching between tabs
$('#tabs').click(function (e) {
  if(!(e.target.id) in Object.keys(tabs)) return;
  Object.keys(tabs).forEach(x=>document.getElementById(x).classList.remove('active'));
  Object.keys(tabs).forEach(x=>document.getElementById(tabs[x]).style.display = "none");
  document.getElementById(e.target.id).classList.add('active');
  document.getElementById(tabs[e.target.id]).style.display = "inline";
});

//lobby create game button
$('#lobbycreate').click(function(e) {
  $('.game-setup').css("display" , "flex");
});

//game creation overlay
$('#modal-overlay').click(function(e){
  switch(e.target.className){
    case "close":  $('.game-setup').css("display" , "none");
  }
});

