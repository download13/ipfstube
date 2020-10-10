import run from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'
import { makeHistoryDriver, captureClicks } from '@cycle/history'
import { App } from './components'
import {  makeIPFSDriver } from './drivers/ipfs'

async function main() {
	run(App, {
		DOM: makeDOMDriver(document.body),
		history: captureClicks(makeHistoryDriver()),
		IPFS: await makeIPFSDriver('ipfstube')
	})
}

main()

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