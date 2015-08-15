'use strict'

var level = require('level')
var db = level('blogtooldb', {valueEncoding: 'json'})
var conduit = require('./events')

conduit.on('app:quit', function () {
  db.close()
})

module.exports = db
