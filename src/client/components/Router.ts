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
		const m = loc.pathname.match(/^\/v\/(.+)$/)
		if(m && m[1])
		return { kind: 'video', id: m[1] }
	}

	return { kind: 'notfound' }
}

export function isRouteVideo(route: Route): route is Video {
	return route.kind === 'video'
}