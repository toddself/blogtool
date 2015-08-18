'use strict'

const app = require('app')
const BrowserWindow = require('browser-window')
const conduit = require('./conduit')

let mainWindow = null

app.on('window-all-closed', function () {
  app.quit()
})

app.on('will-quit', function () {
  conduit.emit('app:quit')
})

app.on('ready', function () {
  mainWindow = new BrowserWindow({width: 1024, height: 768})
  mainWindow.loadUrl(`file://${__dirname}/blogtool.html`)

  if (process.env.NODE_ENV === 'dev') {
    mainWindow.openDevTools()
  }

  mainWindow.on('closed', function () {
    mainWindow = null
  })
})
