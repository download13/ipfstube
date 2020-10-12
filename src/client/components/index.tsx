import type { MainDOMSource, VNode } from '@cycle/dom'
import type { Stream } from 'xstream'
import type { HistoryInput, Location } from '@cycle/history'
import type { IPFSRequest, MainIPFSSource } from '../drivers/ipfs'
import type { VideoInput } from '../drivers/media'

import Snabbdom from 'snabbdom-pragma'
import xs from 'xstream'
import { Layout } from './Layout'
import { Uploader } from './Uploader'
import { Player } from './Player'
import { locationToRoute } from './Router'

type Sources = {
	DOM: MainDOMSource
	history: Stream<Location>
	IPFS: MainIPFSSource
	player: Stream<VNode>
}

type Sinks = {
	DOM: Stream<VNode>
	history: Stream<HistoryInput>
	IPFS: Stream<IPFSRequest>
	player: Stream<VideoInput>
}

export function App({ DOM, history, IPFS, player }: Sources): Sinks {
	const route$ = history.map(locationToRoute)

	const pageTree$ = xs.combine(route$, player)
		.map(([ route, videoEl ]) => {
			switch(route.kind) {
			case 'root':
				return <Uploader />
			case 'video':
				return <Player>{videoEl}</Player>
			case 'notfound':
				return <span>404</span>
			}
		})

	const { DOM: layoutTree$ } = Layout({ children$: pageTree$ })

	return {
		DOM: layoutTree$,
		history: xs.of(),
		player: IPFS.select('watch')
			.map(e => {
				if(e.kind === 'catRes') {
					return e.content
				}
			})
			.filter(isBlob)
			.map(blob => ({ srcObject: blob }) as VideoInput),
		IPFS: history
			.map(({ pathname }) => {
				const [ match ]  = pathname.matchAll(/^\/v\/(.+)$/)
				if(match) {
					return match[1]
				}
			})
			.filter(isString)
			.map(path => {
				return { kind: 'cat', path, category: 'watch' } as IPFSRequest
			})
	}
}

function isString(a: unknown): a is string {
	return typeof a === 'string'
}

function isBlob(a: unknown): a is Blob {
	return a instanceof Blob
}
