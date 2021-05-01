console.log("uwu");
const tabs = [$('pairing'),$('lobby'),$('correspondence'),$('ingame')];
$('#tabs').click(function (e) {
    alert(e.target.id); // The id of the clicked element
});