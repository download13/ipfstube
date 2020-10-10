import Snabbdom from 'snabbdom-pragma'

export function Player() {
	return (
		<div id="player__holder">
			<video id="player" controls crossorigin="anonymous">
				<p>Your browser does not support playing video. Update your browser to watch this video.</p>
			</video>
		</div>
	)
}