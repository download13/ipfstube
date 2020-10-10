import run from '@cycle/run'
import { MainDOMSource, VNode, makeDOMDriver } from '@cycle/dom'
import { HistoryInput, Location, makeHistoryDriver, captureClicks } from '@cycle/history'
import xs, { Stream } from 'xstream'
import { App } from './components'

type Sources = {
	DOM: MainDOMSource
	history: Stream<Location>
}

type Sinks = {
	DOM: Stream<VNode>
	history: Stream<HistoryInput>
}

function main({ DOM, history }: Sources): Sinks {
	const { DOM: vtree$ } = App({ DOM, history })

	return {
		DOM: vtree$,
		history: xs.of()
	}
}

run(main, {
	DOM: makeDOMDriver(document.body),
	history: captureClicks(makeHistoryDriver())
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