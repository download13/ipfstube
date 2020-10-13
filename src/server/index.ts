import Koa from 'koa'
import koaStatic from 'koa-static'
import send from 'koa-send'

async function main() {
	const app = new Koa()

	app.use(koaStatic('./dist/client'))
	app.use(koaStatic('./static'))

	app.use(async (ctx) => {
		if(ctx.path === '/' || ctx.path.startsWith('/v/')) {
			await send(ctx, './static/index.html')
			return
		}

		ctx.status = 404
		ctx.body = 'Not Found'
	})
	
	app.listen(80)
}

main()

async function sendApp(ctx) {
	await send(ctx, )
}