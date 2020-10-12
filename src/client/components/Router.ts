import type { Location } from '@cycle/history'

type Route = Root | Video | NotFound

type Root = {
	kind: 'root'
}

type Video = {
	kind: 'video'
	id: string
}

type NotFound = {
	kind: 'notfound'
}

export function locationToRoute(loc: Location): Route {
	if(loc.pathname === '/') {
		return { kind: 'root' }
	} else if(loc.pathname.startsWith('/v/')) {
		const [ [, cid] ]= loc.pathname.matchAll(/^\/v\/(.+)$/)
		return { kind: 'video', id: cid }
	} else {
		return { kind: 'notfound' }
	}
}