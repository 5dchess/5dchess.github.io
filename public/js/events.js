const tabs = {pairing:'lpools',lobby:'lreal_time',correspondence:'lseeks',inplay:'lnow_playing'};
const tdisplay = {pairing:'grid',lobby:'inline',correspondence:'inline',inplay:'inline'}
$('#tabs').click(function (e) {
  if(!(e.target.id) in Object.keys(tabs)) return;
  Object.keys(tabs).forEach(x=>document.getElementById(x).classList.remove('active'));
  Object.keys(tabs).forEach(x=>document.getElementById(tabs[x]).style.display = "none");
  document.getElementById(e.target.id).classList.add('active');
  document.getElementById(tabs[e.target.id]).style.display = tdisplay[e.target.id];
});

