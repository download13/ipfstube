import type { MainDOMSource } from '@cycle/dom'
import type { Stream } from 'xstream'

import xs from 'xstream'
import CID from 'cids'
import sampleCombine from 'xstream/extra/sampleCombine'

type WantToWatch = WatchCID | WatchError

type WatchCID = {
	kind: 'watch'
	cid: CID
}

type WatchError = {
	kind: 'watcherror'
	message: string
}

export function watchId(DOM: MainDOMSource): Stream<WantToWatch> {
	const key$ = DOM.select('#hashnav__input').events('keyup')

	const value$ = key$.map(e => {
		if(e.target instanceof HTMLInputElement) {
			return e.target.value
		}
		return ''
	})

	const go$ = xs.merge(
		key$.filter(e => e.key === 'Enter'),
		DOM.select('#hashnav__btn').events('click')
	)

	return sampleCombine(value$)(go$)
		.map(([ _, value ]) => value)
		.map(id => {
			try {
				const cid = new CID(id)
				return { kind: 'watch', cid }
			} catch(e) {
				return { kind: 'watcherror', message: 'Invalid CID' }
			}
		})
}

export function isWatchCID(a: WantToWatch): a is WatchCID {
	return a.kind === 'watch'
}