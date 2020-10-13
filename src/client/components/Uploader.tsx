import Snabbdom from 'snabbdom-pragma'

export function Uploader() {
	return (
		<div>
			<div id="sitedescription">
				<p>IPFSTube is a player for videos stored in IPFS.</p>
				<p>You can upload videos here or on your own computer using <code><a href="https://ipfs.io/docs/commands/#ipfs-add">ipfs add</a></code>.</p>
			</div>
			<div id="uploader" className="dropzone"></div>
		</div>
	)
}