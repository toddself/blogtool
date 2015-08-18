'use strict'

const crypt = require('crypto')
const db = require('./db')

class BlogPost {
  constructor (key) {
    this.key = key || crypt.randomBytes(20).toString('hex')
    this.title = 'new post'
    this.created = (new Date()).toISOString()
    this.posted = (new Date()).toISOString()
    this.body = ''
    this.tags = []
  }

  save () {
    var self = this
    return new Promise(function (resolve, reject) {
      db.put(self.key, self.toJSON(), function (err) {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  load () {
    var self = this
    return new Promise(function (resolve, reject) {
      db.get(self.key, function (err, content) {
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

  toJSON () {
    return {
      key: this.key,
      title: this.title,
      created: this.created,
      posted: this.posted,
      body: this.body,
      tags: this.tags
    }
  }
}

module.exports = BlogPost
