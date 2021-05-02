const tabs = {lobby:'lobbytab',spec:'spectab',private:'privatetab',ingame:'ingametab'};
const modaloverlaycss = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  background: 'rgba(0, 0, 0, 0.6)',
  'z-index': 109};


//switching between tabs
$('#tabs').click(function (e) {
  if(!(e.target.id) in Object.keys(tabs)) return;
  Object.keys(tabs).forEach(x=>document.getElementById(x).classList.remove('active'));
  Object.keys(tabs).forEach(x=>document.getElementById(tabs[x]).style.display = "none");
  document.getElementById(e.target.id).classList.add('active');
  document.getElementById(tabs[e.target.id]).style.display = "inline";
});
$('#lobbycreate').click(function(e) {
  $('.game-setup').css("display" , "block");
  for(x in modaloverlaycss) $('#modal-overlay').css(x,modaloverlaycss[x]);
  
});

