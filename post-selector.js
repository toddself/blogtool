'use strict'

var moment = require('moment')

var conduit = require('./conduit')
var db = require('./db')

function PostSelector (parent) {
  this.parent = parent;
  this.pageSize = 50
  this.lastKey = null
  this.currPage
  this.el = document.createElement('ul')
  this.el.classList.add('js-file-list', 'file-list')
}

PostSelector.prototype.init = function () {
  var self = this
  this.getPage().then(function (posts) {
    self.parent.classList.remove('editor')
    self.parent.classList.add('list')
    self.currPage = posts
    self.appendPosts()
    self.parent.appendChild(self.el)
    self.el.addEventListener('click', function (evt) {
      if (evt.target.classList.contains('js-post') && evt.target.dataset) {
        conduit.emit('open:editor', evt.target.dataset.postid)
      }
    })
  })
}

PostSelector.prototype.getPage = function (startKey) {
  var self = this
  var data = []
  return new Promise(function (resolve, reject) {
    var opts = {
      limit: self.pageSize
    }

    if (startKey) {
      opts.gte = startKey
    }

    db.createReadStream(opts)
      .on('error', function (err) {
        reject(err)
      })
      .on('data', function (blob) {
        blob.value.key = blob.key
        data.push(blob.value)
        self.lastKey = blob.key
      })
      .on('end', function () {
        resolve(data)
      })
  })
}

PostSelector.prototype.destroy = function () {
  while (this.el.hasChildNodes()) {
    this.el.removeChild(this.el.lastChild)
  }
  this.el.removeEventListener('click', this.previewPost)
  this.parent.removeChild(this.el)
}

PostSelector.prototype.appendPosts = function () {
  var self = this
  this.currPage.forEach(function (post) {
    var li
    var createdDate
    var minus12
    var time
    if (post) {
      li = document.createElement('li')
      li.classList.add('post', 'js-post')
      li.dataset.postid = post.key
      li.dataset.created = new Date(post.created).getTime()
      createdDate = moment(post.created)
      minus12 = moment().subtract(12, 'hours')
      if (createdDate.isAfter(minus12)) {
        createdDate = createdDate.fromNow()
      } else {
        createdDate = createdDate.format('h:mm MMM D, YYYY')
      }
      time = document.createElement('time')
      time.setAttribute('datetime', post.created)
      time.classList.add('list-time')
      time.innerHTML = createdDate
      li.innerHTML = post.title
      li.appendChild(time)
      self.el.appendChild(li)
    }
  })
}

PostSelector.prototype.previewPost = function (evt) {
  if (evt.target.classList.contains('js-post')) {
    console.log(evt.target.dataset)
  }
}

module.exports = PostSelector