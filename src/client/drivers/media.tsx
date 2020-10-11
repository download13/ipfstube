import type { Stream } from 'xstream'
import Snabbdom from 'snabbdom-pragma'

type VideoInput = {
	volume?: number
	position?: number
	srcObject?: Blob
}

export function makeVideoDriver(className: string = 'driven_video') {
	function videoDriver(input$: Stream<VideoInput>) {
		return {
			vtree$: input$
				.fold<VideoInput>(
					(state, input) => ({
						...input,
						srcObject: input.srcObject ?? state.srcObject
					}),
					{}
				)
				.debug('video inputs')
				.map(({ volume, position, srcObject }) => (
					<video
						className={className}
						volume={volume}
						currentTime={position}
						srcObject={srcObject}
					/>
				))
		}
	}

	return videoDriver
}
