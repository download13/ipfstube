import type { VNode } from '@cycle/dom'
import Snabbdom from 'snabbdom-pragma'
import type{ Stream } from 'xstream'

type Sources = {
	children$: Stream<VNode>
}

type Sinks = {
	DOM: Stream<VNode>
}

export function Layout({ children$ }: Sources): Sinks {
	return {
		DOM: children$.map(ch =>
			<main id="sitename">
				<div id="hashnav">
					<input id="hashnav__input" placeholder="Video Hash" />
					<button id="hashnav__btn">Watch</button>
				</div>
				{ch}
				<footer id="sitefooter">
					<span><a href="/">Home</a></span>
					<span><a href="https://github.com/download13/ipfstube">Github</a></span>
					<span><a href="https://twitter.com/IPFSTube">Twitter</a></span>
					<span>Plays videos from <a href="https://ipfs.io/">IPFS</a></span>
				</footer>
			</main>
		)
	}
}