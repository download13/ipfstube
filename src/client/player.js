"use strict";
function getCurrentHash() {
    return location.pathname.split('/').pop();
}
try {
    console.log(location.search.split('=')[1]);
    var subs = JSON.parse(decodeURIComponent(location.search.split('=')[1]));
}
catch (e) {
    var subs = {};
}
console.log(subs);
// hash = 'QmYYMMKS5z9h2CL69GBTTys2SFRZH7XM2iiRTuqrYhYGkj';
/*subs = {
"en": "Qmd9h2eZb4ft4cZAxtypj4YSs4iDu9kLfeXtG2ECgx4Mcc",
"es": "QmeVvJaydsTNJ493JPp5xcvMjMZaWBuS8eZoMCh6vpVTgV"
}*/
var playerHolder = $('#player__holder');
var player = $('#player');
var sources = [
    'ipfs:',
    'http://127.0.0.1:8080',
    '',
    'https://gateway.ipfs.io',
    'https://ipfs.pics' // Is this rude?
];
var urls = sources.map(function (prefix) {
    return prefix + hashToPath(hash);
});
player.on('error', function (e) {
    console.log('video error', e);
    tryNextUrl();
});
Object.keys(subs).forEach(function (sub) {
    // Sliced 'ipfs:' handler because Firefox doesn't support it for video tracks
    var urls = sources.slice(1).map(function (prefix) {
        return prefix + hashToPath(subs[sub]);
    });
    var tryNextUrl = function (track) {
        var url = urls.shift();
        if (url) {
            track.get(0).src = url;
        }
    };
    var track = $('<track kind="subtitles" label="' + sub + '" srclang="' + sub + '"></track>');
    track.on('error', function () {
        console.log("error");
        tryNextUrl($(this));
    });
    player.append(track);
    tryNextUrl(track);
});
tryNextUrl();
function tryNextUrl() {
    var url = urls.shift();
    if (url) {
        console.log('Trying url', url);
        player.get(0).src = url;
    }
    else {
        playerHolder.empty().append($('<p>Unable to load video</p>'));
    }
}
function hashToPath(hash) {
    if (hash.indexOf('/ipfs/') === -1 &&
        hash.indexOf('/ipns/') === -1) {
        return '/ipfs/' + hash;
    }
    else {
        return hash;
    }
}
