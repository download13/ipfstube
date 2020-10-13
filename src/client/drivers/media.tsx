import type { Stream } from 'xstream'
import Snabbdom from 'snabbdom-pragma'

export type VideoInput = {
	volume?: number
	position?: number
	srcObject?: Blob
	src?: string
}

export function makeVideoDriver(className: string = 'driven_video') {
	function videoDriver(input$: Stream<VideoInput>) {
		return input$
			.fold<VideoInput>(
				(state, input) => {
					if(state.src) {
						URL.revokeObjectURL(state.src)
					}

					if(input.srcObject) {
						input.src = URL.createObjectURL(input.srcObject)
					}

					return {
						...input,
						src: input.src ?? state.src
					}
				},
				{}
			)
			.map(({ volume, position, src }) => (
				<video
					controls={true}
					className={className}
					volume={volume}
					currentTime={position}
					src={src}
				/>
			))
	}

	return videoDriver
}
