const tabs = {lobby:'lobbytab',spec:'spectab',private:'privatetab',ingame:'ingametab'};
var setup_mode = null;

//getting cookie
function getJSessionId(){
    var jsId = document.cookie.match(/JSESSIONID=[^;]+/);
    if(jsId != null) {
        if (jsId instanceof Array)
            jsId = jsId[0].substring(11);
        else
            jsId = jsId.substring(11);
    }
    return jsId;
}

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
  $('#joinoverlay').css("display" , "none");
  $('#createoverlay').css("display" , "block");
  $('.buttons').css("display", "block");
  setup_mode = "multi-create";
});

//lobby join game button
$('#lobbyjoin').click(function(e) {
  $('.game-setup').css("display" , "flex");
  $('#createoverlay').css("display" , "none");
  $('#joinoverlay').css("display" , "block");
  setup_mode = "multi-join";
});

//singleplayer create game button
$('#singlecreate').click(function(e) {
  $('.game-setup').css("display" , "flex");
  $('#createoverlay').css("display" , "block");
  
  $('#joinoverlay').css("display" , "none");
  $('.buttons').css("display", "none");
  setup_mode = "single-create";
});

//spectator join game button
$('#specjoin').click(function(e) {
  $('.game-setup').css("display" , "flex");
  $('#createoverlay').css("display" , "none");
  $('#joinoverlay').css("display" , "block");
  setup_mode = "spec-join";
});


//game creation overlay
$('#modal-overlay').click(function(e){
  switch(e.target.className){
    case "close":  
      let ancestor = document.getElementById('modal-overlay');
      for(let foo of ancestor.getElementsByTagName('*')) foo.setAttribute('display', 'none');
      $('.game-setup').css("display" , "none");
  }
});

//checks if any games are in play
var socket = io.connect();
socket.emit("gamereq",{id:getJSessionId()});

socket.on('gamereq', function(data) {
  console.log(data);
  
  //updates inplay tab visibility
  if (data.inplay.length==0){
    $('#ingame').css("display","none");
  }
  else if (data.inplay.length==1){
    $('#ingame').css("display","block");
    console.log("owo");
    $('#ingame')[0].textContent = "1 game in play";
  }
  else{
    $('#ingame').css("display","block");
    $('#ingame')[0].textContent = data.inplay.length+ "games in play";
  }
  
});
