import run from '@cycle/run'
import { MainDOMSource, VNode, makeDOMDriver, jsxFactory } from '@cycle/dom'
import xs, { Stream } from 'xstream'

type Sources = {
	DOM: MainDOMSource
}

type Sinks = {
	DOM: Stream<VNode>
}

function main({ DOM }: Sources): Sinks {
	return {
		DOM: xs.of(
			<main id="sitemain">
				<div id="hashnav">
					<input id="hashnav__input" placeholder="Video Hash" />
					<button id="hashnav__btn">Watch</button>
				</div>
				<div id="sitedescription">
					<p>IPFSTube is a player for videos stored in IPFS.</p>
					<p>You can upload videos here or on your own computer using <code><a href="https://ipfs.io/docs/commands/#ipfs-add">ipfs add</a></code>.</p>
				</div>
				<div id="uploader" class="dropzone"></div>
			</main>
		)
	}
}

run(main, {
	DOM: makeDOMDriver(document.body)
})


//import createDropzone from 'dropzone'
/*

const dropzone = createDropzone('#uploader', {
	url: '/upload',
	uploadMultiple: false,
	parallelUploads: 1,
	dictDefaultMessage: 'Drop video here or click to upload',
	acceptedFiles: 'video/*'
})

dropzone.on('error', function() {
	console.log('upload error', arguments);
});

dropzone.on('success', function(file, response) {
	console.log('upload success', response);
	setTimeout(function() {
		location.assign('/v/' + response.Hash);
	}, 500);
});
*/

function Footer() {
	<footer id="sitefooter">
		<span><a href="/">Home</a></span>
		<span><a href="https://github.com/download13/ipfstube">Github</a></span>
		<span><a href="https://twitter.com/IPFSTube">Twitter</a></span>
		<span>Plays videos from <a href="https://ipfs.io/">IPFS</a></span>
	</footer>
}