const serveStatic = require('serve-static')

module.exports = app => {
  // Use static middleware
  app.use(serveStatic('static'))
}