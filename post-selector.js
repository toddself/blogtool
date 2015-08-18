'use strict'

const moment = require('moment')

const conduit = require('./conduit')
const db = require('./db')

class PostSelector {
  constructor (parent) {
    this.parent = parent
    this.pageSize = 50
    this.lastKey = null
    this.currPage = []
    this.el = document.createElement('ul')
    this.el.classList.add('js-file-list', 'file-list')
  }

  init () {
    const self = this
    this.getPage().then(function (posts) {
      self.parent.classList.remove('editor')
      self.parent.classList.add('list')
      self.currPage = posts
      self.appendPosts()
      self.parent.appendChild(self.el)
      self.el.addEventListener('click', function (evt) {
        let target = evt.target
        if (evt.target.nodeName === 'TIME') {
          target = evt.target.parentElement
        }

        if (target.classList.contains('js-post') && target.dataset) {
          conduit.emit('open:editor', target.dataset.postid)
        }
      })
    })
  }

  getPage (startKey) {
    const self = this
    const data = []
    return new Promise(function (resolve, reject) {
      const opts = {
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

  destroy () {
    while (this.el.hasChildNodes()) {
      this.el.removeChild(this.el.lastChild)
    }
    this.el.removeEventListener('click', this.previewPost)
    this.parent.removeChild(this.el)
  }

  appendPosts () {
    const self = this
    this.currPage = this.currPage.sort(function (a, b) {
      return new Date(b.created) - new Date(a.created)
    })

    this.currPage.forEach(function (post) {
      if (post) {
        const li = document.createElement('li')
        li.classList.add('post', 'js-post')
        li.dataset.postid = post.key
        li.dataset.created = new Date(post.created).getTime()
        let createdDate = moment(post.created)
        const minus12 = moment().subtract(12, 'hours')
        if (createdDate.isAfter(minus12)) {
          createdDate = createdDate.fromNow()
        } else {
          createdDate = createdDate.format('h:mm MMM D, YYYY')
        }
        const time = document.createElement('time')
        time.setAttribute('datetime', post.created)
        time.classList.add('list-time')
        time.innerHTML = createdDate
        li.innerHTML = post.title
        li.appendChild(time)
        self.el.appendChild(li)
      }
    })
  }

  previewPost (evt) {
    if (evt.target.classList.contains('js-post')) {
      console.log(evt.target.dataset)
    }
  }
}

module.exports = PostSelector
