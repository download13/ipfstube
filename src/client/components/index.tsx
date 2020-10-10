import type { MainDOMSource, VNode } from '@cycle/dom'
import type { Stream } from 'xstream'
import type { Location } from '@cycle/history'

import Snabbdom from 'snabbdom-pragma'
import { Layout } from './Layout'
import { Uploader } from './Uploader'
import { Player } from './Player'

type Sources = {
	DOM: MainDOMSource
	history: Stream<Location>
}

type Sinks = {
	DOM: Stream<VNode>
}

export function App({ history }: Sources): Sinks {
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
		DOM: layoutTree$
	}
}
