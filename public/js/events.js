const tabs = [$('pairing'),$('lobby'),$('correspondence'),$('ingame')];
$("#tabs").on('click', '#pairing', function(ev) {
  console.log("uwu");
  tabs.forEach(x=>x[0].class='');
});
$("#tabs").on('click', '#lobby', function(ev) {
  tabs.forEach(x=>x[0].class='');
});
$("#tabs").on('click', '#correspondence', function(ev) {
  tabs.forEach(x=>x[0].class='');
});
$("#tabs").on('click', '#ingame', function(ev) {
  tabs.forEach(x=>x[0].class='');
});
console.log("uwu");