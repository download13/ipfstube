import type { MainDOMSource, VNode } from '@cycle/dom'
import type { Stream } from 'xstream'
import type { HistoryInput, Location } from '@cycle/history'
import type { IPFSRequest, MainIPFSSource } from '../drivers/ipfs'

import Snabbdom from 'snabbdom-pragma'
import xs from 'xstream'
import { Layout } from './Layout'
import { Uploader } from './Uploader'
import { Player } from './Player'

type Sources = {
	DOM: MainDOMSource
	history: Stream<Location>
	IPFS: MainIPFSSource
}

type Sinks = {
	DOM: Stream<VNode>
	history: Stream<HistoryInput>
	IPFS: Stream<IPFSRequest>
}

export function App({ DOM, history, IPFS }: Sources): Sinks {
	const mediaBlob$ = IPFS.select('watch')
		.map(e => {
			if(e.kind === 'catRes') {
				return e.content
			}
		})
		.filter(isBlob)

	const pageTree$ = history
		.map(loc => {
			if(loc.pathname === '/') {
				return <Uploader />
			} else if(loc.pathname.startsWith('/v/')) {
				const [, cid] = loc.pathname.matchAll(/^\/v\/(.+)$/)
				return <Player path={cid} />
			} else {
				// TODO: Redirect to home
				return <span>404</span>
			}
		})
	
	const { DOM: layoutTree$ } = Layout({ children$: pageTree$ })

	return {
		DOM: layoutTree$,
		history: xs.of(),
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