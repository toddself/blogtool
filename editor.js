'use strict'

const MediumEditor = require('medium-editor')
const DrSax = require('dr-sax')
const marked = require('marked')
const _debounce = require('lodash.debounce')

const BlogPost = require('./blog-post')
const MetadataEditor = require('./metadata-editor')

class Editor {
  constructor (postid, parent) {
    console.log('creating new editor with', postid)

    const self = this
    const editorOpts = {
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
      return `<h${level}>${text}</h${level}>`
    }
    this.parent.classList.remove('list')
    this.el = document.createElement('div')
    this.el.classList.add('editor')

    this.metadataEditor = new MetadataEditor(parent)
    this.metadataEditor.on('change', this.save.bind(this))
    this.metadataEditor.emit('reset', this.post.toJSON())
    this.parent.appendChild(this.el)

    this.editor = new MediumEditor('.editor', editorOpts)
    this.editor.subscribe('editableInput', _debounce(function () {
      if (self.editor) {
        self.save({body: self.editor.serialize()['element-0'].value})
      }
    }, 1000, true))
  }

  save (postData) {
    const self = this
    postData = postData || {}
    console.log('saving data with', postData)
    Object.keys(postData).forEach(function (key) {
      if (key === 'body') {
        postData[key] = self.dr.write(postData[key])
      }
      self.post[key] = postData[key]
    })

    return this.post.save()
  }

  load () {
    return this.post.load()
  }

  destroy () {
    const self = this
    this.post.save().then(function () {
      self.editor.destroy()
      self.editor = null
      self.parent.removeChild(self.el)
      while (self.el.hasChildNodes()) {
        self.el.removeChild(self.el.lastChild)
      }
      self.metadataEditor.destroy()
    })
  }

  populateEntry () {
    const self = this
    this.load().then(function (content) {
      console.log('populating with', content)
      self.metadataEditor.emit('reset', content)
      const html = marked(content.body, {renderer: self.mr})
      self.editor.setContent(html)
    })
  }
}

module.exports = Editor
