const tabs = ['pairing','lobby','correspondence','inplay'];
$('#tabs').click(function (e) {
  tabs.forEach(x=>document.getElementById(x).classList.remove('active'));
  document.getElementById(e.target.id).classList.add('active');
  
});

