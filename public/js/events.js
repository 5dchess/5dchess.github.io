const tabs = {pairing:'lpools',lobby:'lreal_time',correspondence:'lseeks',inplay:''};
const tcontent = [];
$('#tabs').click(function (e) {
  Object.keys(tabs).forEach(x=>document.getElementById(x).classList.remove('active'));
  Object.keys(tabs).forEach(x=>document.getElementById(tabs[x]).style = "display:none");
  document.getElementById(e.target.id).classList.add('active');
  document.getElementById(tabs[e.target.id]).style = "display:inline";
});

