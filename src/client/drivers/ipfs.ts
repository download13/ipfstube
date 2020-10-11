import type CID from 'cids'
import xs, { Stream } from 'xstream'
import IPFS from 'ipfs'
import { Buffer } from 'buffer'
import { adapt } from '@cycle/run/lib/adapt'

export type IPFSRequest = (Add | Pin | Cat) & { category?: string }

type Add = {
	kind: 'add'
	data: Uint8Array
}

type Pin = {
	kind: 'pin'
	path: string | CID
	pin: boolean
}

type Cat = {
	kind: 'cat'
	path: string | CID
}

export type IPFSEvent = (AddResponse | CatResponse) & { category?: string }

type AddResponse = {
	kind: 'addRes'
	path: string | CID
}

type CatResponse = {
	kind: 'catRes'
	content: Blob
}

type IPFSDriver = ($: Stream<IPFSRequest>) => MainIPFSSource

export type MainIPFSSource = {
	select: (category: string) => Stream<IPFSEvent>
	events: Stream<IPFSEvent>
}

export async function makeIPFSDriver(repo: string): Promise<IPFSDriver> {
	const ipfs = await IPFS.create({ repo })

	Object.defineProperty(window, 'ipfsNode', { value: ipfs })

	function ipfsDriver(req$: Stream<IPFSRequest>): MainIPFSSource {
		const event$ = req$
			.map<Promise<IPFSEvent | undefined>>(async req => {
				if(req.kind === 'add') {
					const file = await ipfs.add(req.data)
					return {
						kind: 'addRes',
						path: file.cid
					}
				} else if(req.kind === 'cat') {
					const buffers = await collectBuffers(ipfs.cat(req.path))
					console.log('cat res', buffers)
					return {
						kind: 'catRes',
						content: new Blob(buffers)
					}
				} else if(req.kind === 'pin') {
					if(req.pin) {
						await ipfs.pin.add(req.path)
					} else {
						await ipfs.pin.rm(req.path)
					}
				}
			})
			.map(xs.fromPromise)
			.flatten()
			.filter(isIPFSEvent)

		return {
			select(category: string) {
				return adapt(
					event$.filter(evt => evt.category === category)
				)
			},
			events: adapt(event$)
		}
	}

	return ipfsDriver
}

async function collectBuffer(bufferIter: AsyncIterable<Buffer>) {
	return Buffer.concat(await collectBuffers(bufferIter))
}

async function collectBuffers(bufferIter: AsyncIterable<Buffer>): Promise<Buffer[]> {
	const a = []
	for await (const b of bufferIter) {
		a.push(b)
	}
	return a
}

function isIPFSEvent(a: IPFSEvent | undefined): a is IPFSEvent {
	return a !== undefined
}
