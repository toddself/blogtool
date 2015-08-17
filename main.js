var app = require('app')
var BrowserWindow = require('browser-window')
var conduit = require('./events')

var mainWindow = null

app.on('window-all-closed', function () {
  app.quit()
})

app.on('will-quit', function () {
  conduit.emit('app:quit')
})

app.on('ready', function () {
  mainWindow = new BrowserWindow({width: 1024, height: 768})
  mainWindow.loadUrl('file://' + __dirname + '/blogtool.html')

  mainWindow.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
})
