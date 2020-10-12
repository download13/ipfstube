import { VNode } from '@cycle/dom'
import Snabbdom from 'snabbdom-pragma'

type Props = {
	children?: VNode
}

export function Player({ children }: Props) {
	return (
		<div id="player__holder">
			{children}
		</div>
	)
}