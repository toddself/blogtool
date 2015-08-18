'use strict'

const level = require('level')
const db = level('blogtooldb', {valueEncoding: 'json'})
const conduit = require('./conduit')

conduit.on('app:quit', function () {
  db.close()
})

module.exports = db
