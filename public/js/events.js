const tabs = {pairing:'lpools',lobby:'lreal_time',correspondence:'lseeks',inplay:'lnow_playing'};
const tdisplay = {pairing:'grid',lobby:'inline',correspondence:'inline',inplay:'inline'}
$('#tabs').click(function (e) {
  Object.keys(tabs).forEach(x=>document.getElementById(x).classList.remove('active'));
  Object.keys(tabs).forEach(x=>document.getElementById(tabs[x]).style.display = "none");
  console.log(e.target.id);
  document.getElementById(e.target.id).classList.add('active');
  document.getElementById(tabs[e.target.id]).style.display = 'inline';
});

