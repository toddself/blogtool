'use strict'

var MediumEditor = require('medium-editor')
var DrSax = require('dr-sax')
var marked = require('marked')
var _throttle = require('lodash.throttle')

var BlogPost = require('./blog-post')

function Editor (postid, parent) {
  console.log('creating new editor with', postid)

  var self = this
  var editorOpts = {
    buttonLabels: 'fontawesome',
    elementsContainer: parent,
    toolbar: {
      buttons: ['bold', 'italic', 'anchor', 'h2', 'h3', 'quote', 'orderedlist', 'unorderedlist', 'pre']
    },
    placeholder: {
      text: ''
    },
    paste: {
      forcePlainText: true,
      cleanPastedHTML: true,
      cleanTags: ['meta', 'span', 'div']
    }
  }

  this.parent = parent
  this.post = new BlogPost(postid)
  if (postid) {
    this.post.load().then(function (entry) {
      self.populateEntry(entry)
    })
  }

  this.dr = new DrSax()
  this.mr = new marked.Renderer()
  this.mr.heading = function (text, level) {
    return ['<h', level, '>', text, '</h', level, '>'].join('')
  }
  this.parent.classList.remove('list')
  this.el = document.createElement('div')
  this.el.classList.add('editor')
  this.parent.appendChild(this.el
                          )
  this.editor = new MediumEditor('.editor', editorOpts)
  this.editor.subscribe('editableInput', _throttle(function () {
    if (self.editor) {
      self.save({body: self.editor.serialize()['element-0'].value})
    }
  }, 1000, true))
}

Editor.prototype.save = function (postData) {
  postData = postData || {}
  var self = this
  Object.keys(postData).forEach(function (key) {
    if (key === 'body') {
      postData[key] = self.dr.write(postData[key])
    }
    self.post[key] = postData[key]
  })

  return this.post.save()
}

Editor.prototype.load = function () {
  return this.post.load()
}

Editor.prototype.destroy = function () {
  var self = this
  this.post.save().then(function () {
    self.editor.destroy()
    self.editor = null
    while (self.el.hasChildNodes()) {
      self.el.removeChild(self.el.lastChild)
    }
    self.parent.removeChild(self.el)
  })
}

Editor.prototype.populateEntry = function () {
  var self = this
  this.load().then(function (content) {
    console.log('populating with', content.body)
    var html = marked(content.body, {renderer: self.mr})
    self.editor.setContent(html)
  })
}

module.exports = Editor
