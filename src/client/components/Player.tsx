import { VNode } from '@cycle/dom'
import Snabbdom from 'snabbdom-pragma'

export function Player(_props: unknown, children: VNode[]) {
	return (
		<div id="player__holder">
			{children}
		</div>
	)
}