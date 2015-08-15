'use strict'

var crypt = require('crypto')
var xtend = require('xtend')
var db = require('./db')

function BlogPost (key) {
  this.db = db
  this.key = key || crypt.randomBytes(20).toString('hex')
  this.title = 'new post'
  this.created = (new Date()).toISOString()
  this.posted = (new Date()).toISOString()
  this.body = ''
  this.tags = []
}

BlogPost.prototype.save = function () {
  var self = this
  return new Promise(function (resolve, reject) {
    self.db.put(self.key, self.toJSON(), function (err) {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

BlogPost.prototype.load = function () {
  var self = this
  return new Promise(function (resolve, reject) {
    self.db.get(self.key, function (err, content) {
      if (err) {
        return reject(err)
      }
      Object.keys(content).forEach(function (key) {
        self[key] = content[key]
      })
      resolve(self.toJSON())
    })
  })
}

BlogPost.prototype.toJSON = function () {
  return {
    key: this.key,
    title: this.title,
    created: this.created,
    posted: this.posted,
    body: this.body,
    tags: this.tags
  }
}

module.exports = BlogPost
