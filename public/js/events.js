const tabs = [$('pairing'),$('lobby'),$('correspondence'),$('ingame')];
$('#tabs').click(function (e) {
  tabs.forEach(x=>x[0].classList.remove('active'));
  alert(e.target.id);
});