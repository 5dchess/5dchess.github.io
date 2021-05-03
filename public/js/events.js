const tabs = {lobby:'lobbytab',spec:'spectab',private:'privatetab',ingame:'ingametab'};
var setup_mode = null;

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
  $('joinoverlay').css("display" , "none");
  $('createoverlay').css("display" , "flex");
  setup_mode = "multi-create";
});

//lobby join game button
$('#lobbyjoin').click(function(e) {
  $('.game-setup').css("display" , "flex");
  $('createoverlay').css("display" , "none");
  $('joinoverlay').css("display" , "flex");
  setup_mode = "multi-join";
});

//lobby create game button
$('#singlecreate').click(function(e) {
  $('.game-setup').css("display" , "flex");
  $('createoverlay').css("display" , "none");
  $('joinoverlay').css("display" , "flex");
  setup_mode = "single-create";
});


//game creation overlay
$('#modal-overlay').click(function(e){
  switch(e.target.className){
    case "close":  
      console.log("err?");
      let ancestor = document.getElementById('modal-overlay');
      for(let foo of ancestor.getElementsByTagName('*')) foo.setAttribute('display', 'none');
      $('.game-setup').css("display" , "none");
  }
});

