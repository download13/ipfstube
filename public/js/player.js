(function() {
	var hash = location.pathname.split('/').pop();
	// hash = 'QmU1GSqu4w29Pt7EEM57Lhte8Lce6e7kuhRHo6rSNb2UaC';
	var playerHolder = $('#player__holder');
	var player = $('#player');
	var path = hashToPath(hash);
	var sources = [
		'ipfs:', // Browser handler
		'http://127.0.0.1:8080', // User's own IPFS daemon
		'', // Us
		'https://gateway.ipfs.io', // Official gateway
		'https://ipfs.pics' // Is this rude?
	];
	var urls = sources.map(function(prefix) {
		return prefix + path;
	});

	player.on('error', function(e) {
		console.log('video error', e);
		tryNextUrl();
	});

	tryNextUrl();

	function tryNextUrl() {
		var url = urls.shift();
		if(url) {
			console.log('Trying url', url);
			player.get(0).src = url;
		} else {
			playerHolder.empty().append($('<p>Unable to load video</p>'));
		}
	}

	function hashToPath(hash) {
		if(
			hash.indexOf('/ipfs/') === -1 &&
			hash.indexOf('/ipns/') === -1
		) {
			return '/ipfs/' + hash;
		} else {
			return hash;
		}
	}
})();
