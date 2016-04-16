(function() {
	// Goto bar
	var input = $('#hashnav__input');
	var btn = $('#hashnav__btn');

	input.on('keyup', function(e) {
		if(e.keyCode === 13) {
			navigateFilehash();
		}
	});
	btn.on('click', navigateFilehash);

	function navigateFilehash() {
		var hash = input.val();
		if(hash) {
			location.assign('/v/' + hash);
		}
	}
})();
